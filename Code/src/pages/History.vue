<template>
    <div class="history">
        <!-- Navigation Bar -->
        <nav class="top">
            <div class="header">
                <img src="/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="nav-links">
                <router-link to="/AdminLogin" class="nav-link">Admin</router-link>
                <router-link to="/Generator" class="nav-link">Home</router-link>
            </div>
        </nav>
        <div id="cont_box">

            <!-- Profile Section -->
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-pic">
                        <span class="profile-initial">S</span>
                    </div>
                    <div class="profile-info">
                        <h1>{{ userName }}</h1>
                        <h3>{{ userID }}</h3>
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

            <!-- History Section -->
            <div class="history-container">
            <div class="history-header">
                <span class="header-topic">Topic</span>
                <span class="tit_text header-practice">Total Practice</span>
                <span class="tit_text header-accuracy">Accuracy</span>
            </div>
            <ul class="history-list">
                <li @click="toggleDropdown(index)" v-for="(item, index) in history" :key="index" class="history-item">
                    <div class="history-topic">
                        <img class="tubiao" src="/tubiao.png" /> {{ item.title }}
                    </div>
                    <div class="history-practice">
                        {{ item.practice }}
                    </div>
                    <div class="history-accuracy">
                        {{ item.accuracy }}%
                    </div>

                    <!-- Question details -->
                    <div v-show="item.isExpanded" class="dropdown-content">
                        
                        <div class="question-header">
                            <span class="question-topic">Question</span>
                            <span class="question-attempts">Attempts</span>
                            <span class="question-time">Time</span>
                            <span class="question-correct">Correct</span>
                        </div>

                        <ul class = "question-datas">
                        <li v-for="(attempt, attemptIndex) in attempts" :key="attemptIndex" class="question-data">
                            <div class="question">
                                {{ attempt.question }}
                            </div>
                            <div class="attempt">
                                {{ attempt.attempt }}
                            </div>
                            <div class="time">
                                {{ formatTime(attempt.time)  }}
                            </div>
                            <div class="correct">
                                <img :src="attempt.correctness ? '/true.png' : '/false.png'" alt="Correctness">
                            </div>
                        </li>
                        </ul>
                    </div>                  

                </li>
            </ul>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userName: "Student",
            userID: "#0001",
            accuracy: 60,
            exercises: 5,
            space: "     ",
            history: [
                { title: "Decision Tree Classifier", practice: 90, accuracy: 77 },
                { title: "Linear Regression", practice: 100, accuracy: 80 },
                { title: "Correlation", practice: 78, accuracy: 65 },
                { title: "NMI", practice: 133, accuracy: 70 },
                { title: "Correlation", practice: 60, accuracy: 90 }
            ],
            attempts: [
                { question: 1, attempt: 4, time: 75, correctness: false },
                { question: 2, attempt: 3, time: 112, correctness: true },
                { question: 3, attempt: 5, time: 89, correctness: true },
                { question: 4,attempt: 2, time: 58, correctness: false },
                { question: 5,attempt: 6, time: 108, correctness: true },
                { question: 6,attempt: 2, time: 70, correctness: true },
                { question: 7,attempt: 8, time: 95, correctness: false },
                { question: 8,attempt: 2, time: 100, correctness: true },
                { question: 9,attempt: 3, time: 81, correctness: false },
                { question: 11,attempt: 4, time: 115, correctness: true },
                { question: 12,attempt: 4, time: 115, correctness: true },
                { question: 13,attempt: 4, time: 115, correctness: true },
                { question: 14,attempt: 4, time: 115, correctness: true }
            ]
        };
    },
    methods: {
    toggleDropdown(index) {
      this.history[index].isExpanded = !this.history[index].isExpanded;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60); 
      const sec = seconds % 60; 

      return `${minutes}m ${sec < 10 ? '0' + sec : sec}s`; 
    },
  }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.admin-profile {
    /* max-width: 1000px; */
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
    padding: 30px;
    margin-bottom: 20px;
}

.profile-header {
    display: flex;
    align-items: center;
}

.profile-pic {
    width: 120px;
    height: 120px;
    background-color: #FF8A8A;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 48px;
}

.profile-info {
    display: flex;           /* 使用 Flexbox 布局 */
    align-items: bottom;      /* 垂直方向上居中对齐 */
    gap: 30px;   
    margin-left: 30px;
}

.profile-info h1 {
    margin: 0;
    font-size: 36px;
    font-weight: bold;
    color: #333333;
}

.profile-info h3 {
    font-weight: bold;
    color: #333333;
}

.stats {
    display: flex;
    margin-top: 20px;
}

.stat {
    width: 100%;
    border: 1px solid #777777;
    border-radius: 10px;
    text-align: center;
    padding: 10px 0px;
}

.stat1 {
    width: 20px;
}

.stat h2 {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
    color: #333333;

}

.stat p {
    margin: 0;
    font-size: 18px;
    color: #777777;
    margin-top: 10px;
}

.history-container {
    max-width: 1000px;
    padding: 20px;
    border-top: 1px solid #777777;
    padding-top: 30px;
    overflow: auto; 
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
.history-header .tit_text{
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
}
.tubiao{
    width: 34px;
    padding: 8px;
    background: #cccccc9b;
    border-radius:10px ;
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
.history-accuracy{
    justify-content: right;
}
.history-header .header-accuracy{
    text-align: right;
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
    overflow-y: auto;
    max-height: 350px; 
    margin-top: 20px
}

/* scroll bar style */
.dropdown-content::-webkit-scrollbar {
    background-color: #CFD1B8;
    border-radius: 10px;
    /* background: #888; */
    /* border-radius: 10px;  */
}
.dropdown-content::-webkit-scrollbar-thumb {
    background-color: #A8BA99;
    border-radius: 10px;
}

.question-header {
    /* position: sticky; */
    position: relative;
    top : 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 10px 0;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.question-data {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    /* Topic gets more space */
    padding: 10px 0;
    align-items: center;

    /* Center items vertically */
}

.question {
    padding-left: 80px;
}

.attempt {
    padding-left: 85px;
}

.time {
    padding-left: 70px;
}
.correct {
    text-align: center
}
.correct img {
  width: 20px; /* 根据需求调整图片大小 */
  height: 20px;
}
</style>