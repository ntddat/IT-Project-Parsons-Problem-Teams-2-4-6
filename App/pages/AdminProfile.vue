<template>
    <div class="admin-profile">
        <!-- Navigation Bar -->
        <nav class="top">
            <div class="header">
                <img src="/App/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="nav-links">
                <a href="#" class="nav-link" @click.prevent="handleLogout">Logout</a>
                <router-link to="/Generator" class="nav-link">Home</router-link>
            </div>
        </nav>
        <div id="cont_box">
            <!-- Profile Section -->
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-pic">
                        <span class="profile-initial">A</span>
                    </div>
                    <div class="profile-info">
                        <h1>{{ userName }}</h1>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <h2>{{ summary.accuracy }}%</h2>
                        <p>Total accuracy for all students</p>
                    </div>
                    <div class="stat1"></div>
                    <div class="stat">
                        <h2>{{ summary.numQuestions }}</h2>
                        <p>Total exercises for all students</p>
                    </div>
                </div>
            </div>
            <!-- Bar Chart -->
            <div id="chartContainer">
                <canvas id="barChart"></canvas>
            </div>
            <div class="info-mes">See student performance by clicking on the list below</div>
            <!-- History Section with sliding list -->
            <div class="history-container">
                <div class="history-header">
                    <span class="header-topic">Topic</span>
                    <span class="tit_text header-practice">Total Questions</span>
                    <span class="tit_text header-accuracy">Accuracy</span>
                </div>
                <div class="scrolling-wrapper">
                    <ul class="history-list">
                        <li v-for="(item, topic) in topicsInfo.sort((a, b) => a.topic.localeCompare(b.topic))" :key="topic">
                            <div @click="toggleDropdown(topic)" class="history-item">
                                <div class="history-topic">
                                    <img class="tubiao" src="/App/tubiao.png" /> {{ item.topic }}
                                </div>
                                <div class="history-practice">{{ item.numQuestions }}</div>
                                <div class="history-accuracy">{{ item.accuracy }}%</div>
                            </div>
                        <div v-show="item.isExpanded" class="dropdown-content">
                            <div class="summary-header">
                                <span class="header-ID">Student
                                    <button title='Sort by student id (ascending/descending)' @click="SetSortMethod(item, 'id')">
                                        <img class="sort_id" :src="item.sort_userID"/>
                                    </button>
                                </span>
                                <span class="header-Answer">Total Questions
                                    <button title='Sort by questions practiced (ascending/descending)' @click="SetSortMethod(item, 'questions')">
                                        <img class="sort_questions" :src="item.sort_numQuestions"/>
                                    </button>
                                </span>
                                <span class="header-Accuracy">Accuracy
                                    <button title='Sort by accuracy (ascending/descending)' @click="SetSortMethod(item, 'accuracy')">
                                        <img class="sort_accuracy" :src="item.sort_accuracy"/>
                                    </button>
                                </span>
                                <span class="header-Time">Total Time(minutes)</span>
                            </div>
                            <div class="scrolling-wrapper">
                                <ul class="summary-list">
                                    <li v-for="(user, userID) in sort_by_method(item)" :key="userID" class="summary-item">
                                        <button class="detail-button" @click="gotoHistory(user.userID)">Detail</button>
                                        <div class="item-id">{{'#'+user.userID}}</div>
                                        <div class="item-answered">{{user.numQuestions}}</div>
                                        <div class="item-accuracy">{{user.accuracy}}%</div>
                                        <div class="item-time">{{(user.totalTime/60).toFixed(2)}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import {getCookie, setCookie} from "../libs/cookie.js"
//Chart
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Legend} from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend);
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
let barChartInstance = null;

export default {
    /*Initialise datas*/
    mounted () {
        this.setSummaryData()
    },
    /*All the Datas stored here*/
    data() {
        return {
            userName: "Admin",
            summary:{
                accuracy: null,
                numQuestions: null,
            },
            topicsInfo: [],
        }
    },
    methods: {
        handleLogout() {
                console.log("loging out...");
            // setCookie("Admin", false, 0)
            this.$cookies.remove("Admin")
                console.log("Admin cookie Terminated")
            this.$router.push('/Generator')
        },
        async setSummaryData(){
            const datas = await getSummary()
            if (datas) {
                this.summary.accuracy = datas.summary.accuracy
                this.summary.numQuestions = datas.summary.numQuestions
                this.topicsInfo = datas.topicsInfo
                this.renderBarChart();
                this.setDefaultSort();
                this.seticons()
                //console.log(datas.topicsInfo)
            } else {
                console.error("No data received");
            }
        },
        /*Store sorting method into topic*/
        setDefaultSort(){
            this.topicsInfo.forEach(topic => {
                topic.sort_method = 'id_asc';
            });
        },
        /*Store icons into topic*/
        seticons(){
            this.topicsInfo.forEach(topic => {
                topic.sort_userID = 'APP/sort_asc.png';
                topic.sort_numQuestions = 'APP/sort.png';
                topic.sort_accuracy = 'APP/sort.png';
            });
        },
        /*Sorting options*/
        sort_by_method(item){
            if (item.sort_method == "id_asc"){
                return item.users.sort((a, b) => a.userID - b.userID);
            } else if (item.sort_method == "id_des"){
                return item.users.sort((a, b) => b.userID - a.userID);
            } else if (item.sort_method == "questions_asc"){
                return item.users.sort((a, b) => a.numQuestions - b.numQuestions);
            } else if (item.sort_method == "questions_des") {
                return item.users.sort((a, b) => b.numQuestions - a.numQuestions);
            } else if (item.sort_method == "accuracy_asc") {
                return item.users.sort((a, b) => a.accuracy - b.accuracy);
            } else if (item.sort_method == "accuracy_des") {
                return item.users.sort((a, b) => b.accuracy - a.accuracy);
            }
        },
        /*Determine the Sorting method and change icon after clicking the icon.*/
        SetSortMethod(topic, method){
            if (method == 'id') {
                if (topic.sort_userID != 'APP/sort_asc.png'){
                    topic.sort_userID = 'APP/sort_asc.png';
                    this.reset_other_icons(method, topic);
                    topic.sort_method = "id_asc";
                } else {
                    topic.sort_userID = 'APP/sort_des.png';
                    topic.sort_method = "id_des";
                }
            }else if (method == 'questions'){
                if (topic.sort_numQuestions != 'APP/sort_asc.png'){
                    topic.sort_numQuestions = 'APP/sort_asc.png';
                    this.reset_other_icons(method, topic);
                    topic.sort_method = "questions_asc";
                } else {
                    topic.sort_numQuestions = 'APP/sort_des.png';
                    topic.sort_method = "questions_des";
                }
            } else if (method == 'accuracy'){
                if (topic.sort_accuracy != 'APP/sort_asc.png'){
                    topic.sort_accuracy = 'APP/sort_asc.png';
                    this.reset_other_icons(method, topic);
                    topic.sort_method = "accuracy_asc";
                } else {
                    topic.sort_accuracy = 'APP/sort_des.png';
                    topic.sort_method = "accuracy_des";
                }
            }
        },
        /*If one icon is clicked, other icons are setting to default*/
        reset_other_icons(method, topic){
            if (method == 'questions'){
                topic.sort_userID = 'APP/sort.png';
                topic.sort_accuracy = 'APP/sort.png';
            } else if (method == 'accuracy') {
                topic.sort_userID = 'APP/sort.png';
                topic.sort_numQuestions = 'APP/sort.png';
            } else if (method == 'id') {
                topic.sort_accuracy = 'APP/sort.png';
                topic.sort_numQuestions = 'APP/sort.png';
            }
        },
        toggleDropdown(topic){
            this.topicsInfo[topic].isExpanded = !this.topicsInfo[topic].isExpanded;
        },
        gotoHistory(inUserID){
            console.log('pushing to '+inUserID);
            this.$router.push({
                path:'/History',
                query:{
                    from: "Admin",
                    userID: inUserID
                }
            });
        },
        renderBarChart() {
            const ctx = document.getElementById('barChart').getContext('2d');
             if (barChartInstance !== null) {
                barChartInstance.destroy();
            }
            const topicNames = this.topicsInfo.sort((a, b) => a.topic.localeCompare(b.topic)).map(item => item.topic); 
            const totalQuestions = this.topicsInfo.map(item => item.numQuestions); 
            const correctQuestions = this.topicsInfo.map(item => Math.round((item.accuracy / 100) * item.numQuestions)); 

            barChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topicNames, // X-aixs
                    datasets: [
                        {
                            label: 'Total Questions',
                            backgroundColor: 'rgba(75, 192, 192, 0.6)', 
                            data: totalQuestions, 
                        },
                        {
                            label: 'Correct Questions',
                            backgroundColor: 'rgba(153, 102, 255, 0.6)', 
                            data: correctQuestions, 
                        }
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Questions'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Topics'
                            }
                        }
                    }
                }
            });
        },
    }
};
export async function getSummary(){
    const url = 'http://localhost:8383/api/admin/summary';
    const options = {
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        },
    };
    try {
        const response = await fetch(url,options);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error:",error);
        return await getSummary();
    }
};
</script>
<style scoped>
* {
    box-sizing: border-box;
}
.info-mes {
    color: #333333;
    font-weight: bold;
    align-items: center;
    margin-left:270px;
    margin-bottom: 15px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header {
  display: flex;
  align-items: center;
  padding: 15px;
}

.top-logo {
  height: 25px; /* Adjust as needed */
  margin-right: 10px;
}

.web-name {
  font-size: 21px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
  width: auto; /* Set width to auto to adjust based on content */
  margin-right: 30px; /* Move nav bar slightly away from the right edge */
}

.nav-link {
  text-decoration: none;
  color: #333333;
  font-weight: bold;
}

.nav-link:hover {
  color: #156B3A;
}
.content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}
#cont_box {
    max-width: 1000px;
    margin: 0px auto;
    margin-top: 20px;
}

.profile-container {
    background-color: #ffffff00;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
}

.profile-header {
    display: flex;
    align-items: center;
}

.profile-pic {
    width: 80px;
    height: 80px;
    background-color: #e61b0c;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 36px;
}

.profile-info {
    margin-left: 20px;
}

.profile-info h1 {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
    color: #333333;
}

.stats {
    display: flex;
    margin-top: 10px;
}

.stat {
    width: 100%;
    border: 1px solid #777777;
    border-radius: 10px;
    text-align: center;
    padding: 5px 0px;
}

.stat1 {
    width: 10px;
}

.stat h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333333;
}

.stat p {
    margin: 0;
    font-size: 14px;
    color: #777777;
    margin-top: 5px;
}

.history-container {
    max-width: 1000px;
    padding: 20px;
    border-top: 1px solid #777777;

}

.history-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    text-align: left;
    align-items: center;
}

.history-header .tit_text {
    text-align: center;
}

.scrolling-wrapper {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid transparent;
    padding: 0px;
    background-color: transparent;
}

.history-list {
    list-style-type: none;
    padding: 0;
    font-weight: 600;
}

.history-item {
    display: grid;
    grid-template-columns: 2.5fr 1.7fr 1.4fr;
    padding: 15px;
    align-items: center;
    cursor: pointer;
}

.tubiao {
    width: 34px;
    padding: 8px;
    background: #cccccc9b;
    border-radius: 10px;
    margin-right: 10px;
}

.history-topic {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #3e3e3e;
}
.history-practice,
.history-accuracy {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #3e3e3e;
}

.history-accuracy {
    justify-content: center;
    text-align: center;
}

.scrolling-wrapper::-webkit-scrollbar {
    width: 8px;
}

.scrolling-wrapper::-webkit-scrollbar-thumb {
    background-color: #A8BA99;
    border-radius: 10px;
}
.dropdown-content {
    /* position: absolute; */
    grid-column: span 3;
    background-color: transparent;
    /* border: solid #777777; */
    list-style-type: none;
    width: 100%;
    align-items: center;
    /* border-width: 1px 0 1px; */
    color: #3e3e3e;
    max-height: 350px; 
}
.summary-header{
    display: grid;
    color: #333;
    grid-template-columns: 2.6fr 2.4fr 2.4fr 2.9fr;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.sort_id,.sort_questions,.sort_accuracy {
    width: 20px;
    height:20px;
    vertical-align: middle;
}
button {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor:pointer;
}
button:focus {
    outline: none;
}
.header-ID,.header-Answer,.header-Accuracy,.header-Time {padding: 10px; }
.summary-list{
    list-style-type: none;
    padding-left: 40px;
    max-height: 300px;
    min-width: 700px;
}
.detail-button {
  margin-right: 10px; /* 在学生ID左侧留出一些空间 */
  background-color: #4CAF50; /* 绿色背景 */
  color: rgb(65, 54, 54);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.summary-item {
    display: grid;
    grid-template-columns:0fr 1.1fr 1.5fr 1.4fr 1.4fr;
    gap: 0px;
    padding: 10px 0;
    padding-left: 25px;
    border-bottom: 1px solid #a6a4a4;
}
.summary-item:hover {background-color: #ccf6b34b;border-radius: 5px}
.history-item:hover {background-color: #7ea3684b;border-radius: 5px}
#chartContainer{
    height: 470px;
}
</style>