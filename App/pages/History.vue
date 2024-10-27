// ==========================================================
// @ File: History.vue
// @ Author: Team-4 Peihong Yao
// @ Date: 2024-10-27
// @ Description: This component is the history page of the web
// allow users change username and check history data
// @ Version: 1.0.0
// ==========================================================
<template>
    <div class="history">
        <!-- Navigation Bar -->
        <nav class="top">
            <div class="back-links" v-if="showBack" @click="backButton">
                <svg t="1729144190487" class="top-logo" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4866" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="25px" height="25px">
                    <path
                        d="M485.6 249.9L198.2 498c-8.3 7.1-8.3 20.8 0 27.9l287.4 248.2c10.7 9.2 26.4 0.9 26.4-14V263.8c0-14.8-15.7-23.2-26.4-13.9z m320 0L518.2 498c-4.1 3.6-6.2 8.8-6.2 14 0 5.2 2.1 10.4 6.2 14l287.4 248.2c10.7 9.2 26.4 0.9 26.4-14V263.8c0-14.8-15.7-23.2-26.4-13.9z"
                        fill="#2c2c2c" p-id="4867"></path>
                </svg>
                <div class="back">Back to {{ backWords }}</div>
            </div>
            <div class="header" v-else>
                <img src="/App/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="info-mes" v-if="showData">Get more information by clicking on the list below</div>
            <div class="nav-links">
                <router-link to="/AdminLogin" class="nav-link">Admin</router-link>
                <router-link to="/Generator" class="nav-link">Home</router-link>
            </div>
        </nav>
        <!-- Navigation Bar -->

        <!-- Load animation -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p class="loading-text">{{ loadingWord }}</p>
        </div>
        <!-- Load animation -->

        <!-- Main Body -->
        <div v-show="!isLoading">
            <!-- Not accept Page -->
            <div id="notacceptCookie" v-if="!showData">
                <div id="cookie-request">You must accept the cookie if you want check this page</div>
                <button @click="accept" id="accept-btn">Accept</button>
            </div>
            <!-- Not accept Page -->

            <!-- User data Page -->
            <div id="cont_box" v-else>

                <!-- Profile Section -->
                <div class="profile-container">
                    <div class="profile-header">
                        <div class="profile-pic">
                            <span class="profile-initial">{{ userName.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="profile-info">

                            <!-- Name Edit -->
                            <h1 v-if="!editing">
                                {{ userName }}
                                <img v-show="canEditName" @click="startEditing" src="/App/assets/icon/edit.png"
                                    width="20" height="20"></img>
                            </h1>
                            <div v-else>
                                <input v-model="newName" @keyup.enter="saveName" type="text" class="name-input"
                                    autofocus />
                                <button class="changeNameButton" @click="saveName">Change</button>
                                <button class="changeNameButton" @click="NotChangeName">Not Now</button>
                            </div>
                            <!-- Name Edit -->

                            <h3>#{{ userID.toString().padStart(5, '0') }}</h3>

                        </div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <h2>{{ accuracy }}%</h2>
                            <p>Accuracy</p>
                        </div>
                        <div class="stat1"></div>
                        <div class="stat">
                            <h2>{{ exercises }}</h2>
                            <p>Exercises</p>
                        </div>
                    </div>
                </div>
                <!-- Profile Section -->

                <!-- Graph Section -->
                <div class="graph-container">
                    <div id="graph"></div>
                </div>
                <!-- Graph Section -->

                <!-- History Section -->
                <div class="history-container">
                    <!-- History Header -->
                    <div class="history-header">
                        <span class="header-topic">Topic</span>
                        <span class="tit_text header-practice">Total Practice</span>
                        <span class="tit_text header-accuracy">Accuracy</span>
                    </div>
                    <!-- History Header -->

                    <!-- History detail -->
                    <ul class="history-list">
                        <li v-for="(item, index) in topicSummary" :key="index">
                            <div @click="questionDropdown(index)" class="history-item">
                                <div class="history-topic">
                                    <img class="tubiao" src="/App/tubiao.png" /> {{ item.topic }}
                                </div>
                                <div class="history-practice">
                                    {{ item.numQuestions }}
                                </div>
                                <div class="history-accuracy">
                                    {{ item.accuracy }}%
                                </div>
                            </div>

                            <!-- Question details -->
                            <div v-show="item.isExpanded" class="question-dropdown" v-if="item.numQuestions != 0">

                                <div class="question-header">
                                    <span class="question-topic">Question</span>
                                    <span class="question-attempts">Attempts</span>
                                    <span class="question-time">Total-Time (minutes)</span>
                                    <span class="question-correct">Had Been Correct</span>
                                </div>

                                <ul class="question-datas">
                                    <li @click="attemptDropdown(index, questionIndex)"
                                        v-for="(question, questionIndex) in item.attemptedQuestions"
                                        :key="questionIndex" class="question-data">
                                        <div class="question">
                                            {{ questionIndex + 1 }}
                                        </div>
                                        <div class="attempts">
                                            {{ question.numAttempts }}
                                        </div>
                                        <div class="time">
                                            {{ (question.totalTime / 60).toFixed(2) }}
                                        </div>
                                        <div class="correct">
                                            <img :src="question.correct ? '/App/assets/icon/true.png' : '/App/assets/icon/false.png'"
                                                alt="Correctness">
                                        </div>

                                        <!-- Attempts details -->
                                        <div v-show="question.isExpanded" class="attempt-dropdown">
                                            <div class="attempts-header">
                                                <span class="question-topic">Attempt</span>
                                                <span class="question-time">Time (minutes)</span>
                                                <span class="question-correct">Correct</span>
                                            </div>

                                            <ul class="attempts-datas">
                                                <li v-for="(attempt, attemptIndex) in question.attempts"
                                                    :key="attemptIndex" class="attempts-data">
                                                    <div class="attempt">
                                                        {{ attempt.attemptID }}
                                                    </div>
                                                    <div class="time">
                                                        {{ (attempt.time / 60).toFixed(2) }}
                                                    </div>
                                                    <div class="correct">
                                                        <img :src="attempt.correct ? '/App/assets/icon/true.png' : '/App/assets/icon/false.png'"
                                                            alt="Correctness">
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <!-- Attempts details -->

                                    </li>
                                </ul>

                            </div>
                            <!-- Question details -->

                        </li>
                    </ul>
                    <!-- History detail -->

                </div>
                <!-- History Section -->

            </div>
            <!-- User data Page -->

        </div>
        <!-- Main Body -->

    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export default {
    created() {
        echarts.use([
            TitleComponent,
            TooltipComponent,
            GridComponent,
            DatasetComponent,
            TransformComponent,
            RadarChart,
            LegendComponent,
            LabelLayout,
            UniversalTransition,
            CanvasRenderer
        ]);
    },
    mounted() {
        // Start at the very top of the page
        window.scrollTo(0, 0);

        // Load 0.5 seconds
        setTimeout(() => {
            this.isLoading = false;
        }, 500);

        // Init page
        const from = (this.$route.query.from)
        if (from == "Admin") {
            this.userID = this.$route.query.userID
            this.backWords = "Admin"
            this.showBack = true
            this.canEditName = false
            this.showData = true
        } else {
            this.showData = this.$cookies.get('acception') == 'true'
            if (!this.showData) {
                return
            }
            this.userID = this.$cookies.get('userID')
            if (from == "History") {
                this.backWords = "Question"
                this.showBack = true
            }
        }

        if (this.showData) {
            this.setUserData()
        }
    },
    data() {
        return {
            showData: null,
            // acceptCookie: true,
            userName: null,
            newName: null,
            userID: null,
            accuracy: null,
            exercises: null,
            topicSummary: null,
            editing: false,
            showBack: false,
            backWords: null,
            myChart: null,
            canEditName: true,
            isLoading: true,
            loadingWord: "Reading and analyzing may take some time, please be patient... {{{(>_<)}}}",
        };
    },
    methods: {
        // Back to previous Page
        backButton() {
            this.$router.go(-1)
        },

        // UserName edite  
        startEditing() {
            this.editing = true;
            this.newName = this.userName;
        },
        NotChangeName() {
            this.editing = false;
        },
        saveName() {
            if (this.newName.trim().length === 0 || this.newName.trim().length > 15) {
                alert("name must not empty, max length 15");
            } else if (this.newName.trim() == this.userName) {
                console.log("same name")
                this.editing = false;
            } else {
                this.userName = this.newName.trim();
                this.changeUserName(this.userID, this.userName)
                this.editing = false;
            }
        },

        // Drop down compount control
        questionDropdown(index) {
            this.topicSummary[index].isExpanded = !this.topicSummary[index].isExpanded;
        },
        attemptDropdown(topicIndex, questionIndex) {
            this.topicSummary[topicIndex].attemptedQuestions[questionIndex].isExpanded =
                !this.topicSummary[topicIndex].attemptedQuestions[questionIndex].isExpanded
        },

        // Radar chart 
        getFormattedTopicList() {
            return this.topicSummary.map(topic => {
                const cleanedTopic = topic.topic.replace(/\([^)]*\)/g, '').trim();
                const firstTwoWords = cleanedTopic.split(' ').slice(0, 2).join(' ');
                const formattedName = firstTwoWords.length > 10 ? firstTwoWords.replace(' ', '\n') : firstTwoWords;
                return {
                    name: formattedName,
                    max: 100
                };
            });
        },
        getPracticeList() {
            const maxNumQuestions = Math.max(...this.topicSummary.map(topic => topic.numQuestions));
            const normalizedNumQuestions = this.topicSummary.map(topic => topic.numQuestions / maxNumQuestions * 100);
            return normalizedNumQuestions;
        },
        getAccuracyList() {
            return this.topicSummary.map(topic => topic.accuracy);
        },
        setRadar() {
            this.myChart = echarts.init(document.getElementById('graph'));
            let option = {
                color: ['#F1E3D3', '#5B9279'],
                title: {
                    text: ''
                },
                legend: {
                    data: ['Total Practice', 'Accuarcy'],
                },
                radar: {
                    indicator: this.getFormattedTopicList(),
                    center: ['50%', '50%'],
                    radius: '70%',
                    name: {
                        textStyle: {
                            color: '#0D0D0D',
                            fontSize: 14,
                        }
                    }
                },
                axisName: {},
                series: [
                    {
                        name: 'Practice VS Accuarcy',
                        type: 'radar',
                        areaStyle: {},
                        data: [
                            {
                                value: this.getPracticeList(),
                                name: 'Total Practice',
                            },
                            {
                                value: this.getAccuracyList(),
                                name: 'Accuarcy',
                            }
                        ],
                    }
                ]
            };
            this.myChart.setOption(option);
        },

        // Set up data for this page
        async setUserData() {
            const datas = await this.getUserHistory(this.userID)
            this.accuracy = datas.userData.accuracy
            this.exercises = datas.userData.numQuestions
            this.topicSummary = datas.userData.topicSummary
            this.userName = datas.userData.name

            // Make sure DOM is inuse
            this.$nextTick(() => {
                this.setRadar();
            });
        },

        // Acquire user data from database
        async getUserHistory(userID) {
            const url = `http://localhost:8383/api/user/userData?userID=${userID}`;
            const options = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },

            };
            try {
                const response = await fetch(url, options);
                const data = await response.json();

                return data;
            } catch (error) {
                console.error('Error:', error);
                return await getUserHistory(userID);
            }
        },

        // Get UserID from the back-end
        async accept() {
            this.$cookies.set('acception', true, '3m');
            this.userID = await this.getUserID()
            this.$cookies.set('userID', this.userID, '3m');
            this.$router.go(0);
        },

        // Acquire unique identifier (UserID)
        async getUserID() {
            const url = 'http://localhost:8383/api/user/newUserID';

            const options = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            };
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // console.log(data.userID.userID);
                return data.userID;
                // return response
            } catch (error) {
                console.error('Error:', error);
                return await getUserID();
            }
        },

        // Send the changed userID to the database
        async changeUserName(userID, name) {
            const url = 'http://localhost:8383/api/user/changeUsername';

            const pack = {
                userID: userID,
                newUsername: name,
            };

            console.log(pack);

            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pack),  // Stringify the payload as JSON
            };

            try {
                const response = await fetch(url, options);

                if (!response.ok) {  // Check if the response status is not OK
                    const errorData = await response.json();  // Parse the error message
                    console.error('Error:', errorData.message);
                } else {
                    const data = await response.json();
                    console.log('Success:', data);
                }

            } catch (error) {
                console.error('Error:', error);
            }
        },
    },

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

.load-gif {
    position: fixed;
    /* 固定在屏幕中央 */
    top: 50%;
    /* 垂直居中 */
    left: 50%;
    /* 水平居中 */
    transform: translate(-50%, -50%);
    /* 通过平移将元素的中心点移到屏幕中心 */
    width: 60px;
    /* 宽度 */
    height: 60px;
    /* 高度 */
}

.header {
    display: flex;
    align-items: center;
    padding: 15px;
}

.back-links {
    display: flex;
    align-items: center;
    padding: 15px;
    color: #333333;
    font-size: 18px;
    font-weight: bold;
}

.back-links:hover {
    color: #156B3A;
}

.back-links:hover .top-logo path {
    fill: #156B3A;
}

.top-logo {
    height: 25px;
    /* Adjust as needed */
    margin-right: 10px;
}

.web-name {
    font-size: 21px;
    font-weight: bold;
}

.info-mes {
    color: #333333;
    font-weight: bold;
}

.nav-links {
    display: flex;
    gap: 20px;
    width: auto;
    /* Set width to auto to adjust based on content */
    margin-right: 30px;
    /* Move nav bar slightly away from the right edge */
}

.nav-link {
    text-decoration: none;
    color: #333333;
    font-weight: bold;
}

.nav-link:hover {
    color: #156B3A;
}

/* 动画 */
.loading-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.spinner {
    --size: 35px;
    --first-block-clr: #17743f;
    --second-block-clr: #FF8E54;
    --clr: #111;
    width: 200px;
    height: 200px;
    position: relative;
}

.spinner::after,
.spinner::before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    width: var(--size);
    height: var(--size);
    top: 50%;
    animation: up 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
    left: 50%;
    background: var(--first-block-clr);
}

.spinner::after {
    background: var(--second-block-clr);
    top: calc(50% - var(--size));
    left: calc(50% - var(--size));
    animation: down 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes down {

    0%,
    100% {
        transform: none;
    }

    25% {
        transform: translateX(100%);
    }

    50% {
        transform: translateX(100%) translateY(100%);
    }

    75% {
        transform: translateY(100%);
    }
}

@keyframes up {

    0%,
    100% {}

    25% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(-100%) translateY(-100%);
    }

    75% {
        transform: translateY(-100%);
    }
}

/* 动画 */
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
    background-color: #FF9843;
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

.name-input {
    background-color: transparent;
    width: auto;
    height: 35px;
    font-size: 15px;
}

.changeNameButton {
    background-color: transparent;
    width: auto;
    height: 35px;
    margin-left: 20px;
}

.profile-info h3 {
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

/* recent part */
.recent-container {
    max-width: 1000px;
    padding: 20px;
    border-top: 1px solid #777777;
    padding-top: 20px;
    overflow: auto;
    font-weight: 600;
    color: #3e3e3e;
}

.recent-header {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

/* history part */
.history-container {
    max-width: 1000px;
    padding: 20px;
    border-top: 1px solid #777777;
    padding-top: 30px;
    overflow: auto;
}

.graph-container {
    max-width: 1000px;
    border-top: 1px solid #777777;
    padding-top: 30px;
    overflow: auto;
}

#graph {
    width: 700px;
    height: 400px;
    margin: auto;
}

.tooltip-box {
    position: absolute;
    background-color: #333;
    /* 提示框背景色 */
    color: #fff;
    /* 提示框文字颜色 */
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    /* 保证提示框在最上层 */
    white-space: nowrap;
    pointer-events: none;
    /* 避免提示框阻止鼠标事件 */
}

.history-list {
    list-style-type: none;
    padding: 0;
    font-weight: 600;
}

.history-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    /* Topic gets more space */
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    text-align: left;
    align-items: center;
    /* Ensure Topic is left-aligned */
}

.history-header .tit_text {
    text-align: center;
}

.history-item {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    /* Topic gets more space */
    padding: 15px 0;
    align-items: center;
    /* Center items vertically */
    cursor: pointer;
}

.history-item:hover {
    /* background-color: #ccf6b34b; */
    background-color: #7ea3684b;
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
    /* Left-align Topic */
    font-size: 18px;
    color: #3e3e3e;
    /* Optional: Add padding for space */
}

.history-practice,
.history-accuracy {
    display: flex;
    align-items: center;
    justify-content: center;
    /* Keep Practice and Accuracy centered */
    font-size: 18px;
    color: #3e3e3e;
}

.history-accuracy {
    justify-content: right;
}

.history-header .header-accuracy {
    text-align: right;
}

.question-dropdown {
    /* position: absolute; */
    grid-column: span 3;
    background-color: transparent;
    list-style-type: none;
    padding: 20;
    margin: 20;
    width: 100%;
    align-items: center;
    border: solid #777777;
    border-width: 1px 0 1px;
    color: #3e3e3e;
    /* overflow-y: auto;
    max-height: 350px; */
    margin-top: 20px;

}

.attempt-dropdown {
    /* padding-left: 20px;
    padding-right: 20px; */
    /* width: 80%; */
    grid-column: span 4;
    background-color: transparent;
    list-style-type: none;
    padding: 20;
    margin: 20;
    /* width: 90%; */
    width: 100%;
    align-items: center;
    border: solid #777777;
    border-width: 1px 0 1px;
    color: #3e3e3e;
    margin-top: 20px;
    /* margin: 20 auto */
}

.question-datas {
    overflow-y: auto;
    max-height: 350px;
    /* margin-top: 10px; */
    margin: 0;
    /* 移除外边距 */
    padding: 0;
    /* 移除内边距 */
}

/* scroll bar style */
.question-datas::-webkit-scrollbar {
    background-color: #CFD1B8;
    border-radius: 10px;
}

.question-datas::-webkit-scrollbar-thumb {
    background-color: #A8BA99;
    border-radius: 10px;
}

.question-header {
    position: sticky;
    /* position: relative; */
    top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 10px 0;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    color: #3e3e3e;
}

.attempts-header {
    /* position: sticky; */
    position: relative;
    top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 10px 0;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    color: #3e3e3e;
}

.question-data {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    /* Topic gets more space */
    padding: 10px 0;
    align-items: center;
    border-radius: 40px
        /* Center items vertically */
}

.question-data:hover {
    /* background-color: #b3c1a0; */
    /* background-color: #538665; */
    background-color: #ccf6b34b;
}

.attempts-datas {
    margin: 0;
    /* 移除外边距 */
    padding: 0;
    /* 移除内边距 */
}

.attempts-data {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* Topic gets more space */
    padding: 10px 0;
    align-items: center;
    border-radius: 40px
        /* Center items vertically */
}

.question {
    /* padding-left: 120px; */
    text-align: center
}

.topic {
    padding-left: 10px
}

.attempts {
    text-align: center
        /* padding-left: 85px; */
}

.attempt {
    text-align: center
}

.time {
    /* padding-left: 90px; */
    text-align: center
}

.date {
    text-align: center
}

.correct {
    text-align: center
}

.correct img {
    width: 20px;
    /* 根据需求调整图片大小 */
    height: 20px;
}

#notacceptCookie {
    display: flex;
    /* justify-content: center; 水平居中 */
    align-items: center;
    flex-direction: column;
    row-gap: 50px;
    margin-top: 12.5%;
    margin-bottom: 25%;
}

#cookie-request {
    /* justify-content: center; */
    font-weight: 600;
    font-size: 32px;
    color: #c93c32;
}

#accept-btn {
    border: none;
    border-radius: 7px;
    padding: 10px;
    cursor: pointer;
    font-weight: 700;
    font-size: 24px;
    background-color: #e58110;
    /* box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.1); */
    transition: all 0.3s ease;
}

#accept-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.2);
}
</style>
