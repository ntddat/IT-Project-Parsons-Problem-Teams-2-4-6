<template>
    <div class="admin-profile">
        <!-- Navigation Bar -->
        <nav class="top">
            <div class="header">
                <img src="/App/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="info-mes">Get more information by clicking on the list below</div>
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
                        <p>Accuracy</p>
                    </div>
                    <div class="stat1"></div>
                    <div class="stat">
                        <h2>{{ summary.numQuestions }}</h2>
                        <p>Exercises</p>
                    </div>
                </div>
            </div>

            <!-- History Section with sliding list -->
            <div class="history-container">
                <div class="history-header">
                    <span class="header-topic">Topic</span>
                    <span class="tit_text header-practice">Total Questions</span>
                    <span class="tit_text header-accuracy">Accuracy</span>
                </div>

                <div class="scrolling-wrapper">
                    <ul class="history-list">
                        <li v-for="(item, topic) in topicsInfo" :key="topic">
                            <div @click="toggleDropdown(topic)" class="history-item">
                                <div class="history-topic">
                                    <img class="tubiao" src="/App/tubiao.png" /> {{ item.topic }}
                                </div>
                                <div class="history-practice">{{ item.numQuestions }}</div>
                                <div class="history-accuracy">{{ item.accuracy }}%</div>
                            </div>
                        <div v-show="item.isExpanded" class="dropdown-content">
                            <div class="summary-header">
                                <span class="header-ID">ID</span>
                                <span class="header-Answer">Total Questions</span>
                                <span class="header-Accuracy">Accuracy</span>
                                <span class="header-Time">Total Time(minutes)</span>
                            </div>
                            <div class="scrolling-wrapper">
                                <ul class="summary-list">
                                    <li v-for="(user, userID) in item.users" :key="userID" class="summary-item" @click="gotoHistory(user.userID)">
                                        <div class="item-id">{{user.userID}}</div>
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


export default {
    mounted () {
        this.setSummaryData()
    },
    data() {
        return {
            userName: "Admin",
            summary:{
                accuracy: null,
                numQuestions: null,
            },
            topicsInfo: []
            // Sample data with more rows to demonstrate scrolling
        };
    },
    methods: {
        handleLogout() {
                console.log("loging out...");
            // setCookie("Admin", false, 0)
            this.$cookies.remove("Admin")
                console.log("Admin cookie Terminated")
            this.$router.push('/Generator')
        },

        toggleDropdown(topic){
            this.topicsInfo[topic].isExpanded = !this.topicsInfo[topic].isExpanded;
        },
        async setSummaryData(){
            const datas = await getSummary()
            if (datas) {
                this.summary.accuracy = datas.summary.accuracy
                this.summary.numQuestions = datas.summary.numQuestions
                this.topicsInfo = datas.topicsInfo
                console.log(datas.topicsInfo)
            } else {
                console.error("Lack of data");
            }
            
        },
        gotoHistory(inUserID){
            this.$router.push({
                path:'/History',
                query:{
                    isAdmin: true,
                    userID: inUserID
                }
            });
        }
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
    padding-top: 30px;
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
    position: relative;
    display: grid;
    grid-template-columns: 2.5fr 1.7fr 1.4fr;
    padding: 15px 0;
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
    border: solid #777777;
    list-style-type: none;
    padding: 20;
    margin: 20;
    width: 100%;
    align-items: center;
    border-width: 1px 0 1px;
    color: #3e3e3e;
    max-height: 350px; 
    margin-top: 20px;
}
.summary-header{
    display: grid;
    color: #333;
    grid-template-columns: 1.5fr 2.4fr 2.4fr 2.9fr;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}
.header-ID,.header-Answer,.header-Accuracy,.header-Time {padding: 10px; }
.summary-list{
    list-style-type: none;
    padding-left: 40px;
    max-height: 300px;
    cursor: pointer;
    min-width: 700px;
}
.summary-item {
    display: grid;
    grid-template-columns: 1.1fr 1.5fr 1.4fr 1.4fr;
    gap: 60px;
    padding: 10px 0;
    padding-left: 25px;
    border-bottom: 1px solid #a6a4a4;
}
.summary-item:hover {background-color: #ccf6b34b;border-radius: 5px}
.history-item:hover {background-color: #7ea3684b;border-radius: 5px}
.info-mes {
    color: #333333;
    font-weight: bold;
}
</style>