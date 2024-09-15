<template>
    <div class="admin-profile">
        <!-- Navigation Bar -->
        <nav class="top">
            <div class="header">
                <img src="/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="nav-links">
                <router-link to="/history" class="nav-link">History</router-link>
                <router-link to="/AdminLogin" class="nav-link">Logout</router-link>
                <router-link to="/Generator" class="nav-link">Home</router-link>
            </div>
        </nav>

        <div id="cont_box">
            <!-- Profile Section -->
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-pic">
                        <span class="profile-initial">J</span>
                    </div>
                    <div class="profile-info">
                        <h1>{{ userName }}</h1>
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

            <!-- History Section with sliding list -->
            <div class="history-container">
                <div class="history-header">
                    <span class="header-topic">Topic</span>
                    <span class="tit_text header-practice">Total Practice</span>
                    <span class="tit_text header-accuracy">Accuracy</span>
                </div>

                <div class="scrolling-wrapper">
                    <ul class="history-list">
                        <li v-for="(item, index) in history" :key="index" class="history-item">
                            <div class="history-topic">
                                <img class="tubiao" src="/tubiao.png" /> {{ item.title }}
                            </div>
                            <div class="history-practice">{{ item.practice }}</div>
                            <div class="history-accuracy">{{ item.accuracy }}%</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userName: "Jane",
            accuracy: 60,
            exercises: 8,
            // Sample data with more rows to demonstrate scrolling
            history: [
                { title: "Decision Tree Classifier", practice: 90, accuracy: 77 },
                { title: "Linear Regression", practice: 100, accuracy: 80 },
                { title: "Correlation", practice: 78, accuracy: 65 },
                { title: "NMI", practice: 133, accuracy: 70 },
                { title: "Correlation", practice: 60, accuracy: 90 },
                { title: "DataFrame", practice: 45, accuracy: 88 },
                { title: "Sentence splitting using nltk", practice: 75, accuracy: 85 },
                { title: "Reading/Writing CSV files", practice: 50, accuracy: 82 }
            ]
        };
    }
};
</script>
<style scoped>
* {
    box-sizing: border-box;
    font-family: "Helvetica Neue", Arial, sans-serif; /* Added font stack for consistency */
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
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 15px 0;
    align-items: center;
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
</style>




