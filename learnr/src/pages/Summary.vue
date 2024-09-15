<template>
    <!-- Navigation Bar Coppied and Modified from AdminProfile-->
    <div class="summary_page">
        <nav class="top">
            <div class="header">
                <img src="/logo.png" alt="Logo" class="top-logo" />
                <div class="web-name">Learnr</div>
            </div>
            <div class="nav-links">
                <router-link to="/AdminProfile" class="nav-link">AdminProfile</router-link>
                <router-link to="/AdminLogin" class="nav-link">Logout</router-link>
                <router-link to="/Generator" class="nav-link">Home</router-link>
            </div>
        </nav>
        <!-- Summary Section -->
        <div class="summary-container">
            <div class="summary-header">
                <span class="header-ID">ID</span>
                <span class="header-Answer">Total Answer</span>
                <span class="header-Accuracy">Accuracy</span>
                <span class="header-Time">Total Time</span>
            </div>
            <div class="scrolling-wrapper">
                <ul class="summary-list">
                    <li v-for="(item, index) in items" :key="index" class="summary-item" @click="gotoHistory(item.studentID)">
                        <div class="item-id">{{item.index}}-{{item.studentID}}</div>
                        <div class="item-answered">{{item.answered}}</div>
                        <div class="item-accuracy">{{item.accuracy}}%</div>
                        <div class="item-time">{{item.hour}} hours {{item.min}} min</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return{
            items:[
                {index: "1", studentID:"xxxx", answered:50, accuracy:66, hour:3, min:15},
                {index: "2", studentID:"xxxx", answered:100, accuracy:55, hour:5, min:17},
                {index: "3", studentID:"xxxx", answered:67, accuracy:80, hour:4, min:34},
                {index: "4", studentID:"xxxx", answered:45, accuracy:100, hour:2, min:8},
                {index: "5", studentID:"xxxx", answered:25, accuracy:70, hour:1, min:30},
                {index: "6", studentID:"xxxx", answered:66, accuracy:88, hour:5, min:10},
                {index: "8", studentID:"xxxx", answered:110, accuracy:78, hour:11, min:23},
                {index: "9", studentID:"xxxx", answered:44, accuracy:33, hour:2, min:48},
                {index: "10", studentID:"xxxx", answered:78, accuracy:66, hour:3, min:22},
                {index: "11", studentID:"xxxx", answered:45, accuracy:55, hour:2, min:34},
                {index: "12", studentID:"xxxx", answered:56, accuracy:48, hour:2, min:57},
                {index: "13", studentID:"xxxx", answered:25, accuracy:75, hour:1, min:13},
                {index: "14", studentID:"xxxx", answered:10, accuracy:50, hour:0, min:22},
                {index: "15", studentID:"xxxx", answered:0, accuracy:0, hour:0, min:0},
                {index: "16", studentID:"xxxx", answered:4, accuracy:100, hour:0, min:35},
            ]
        }
    }
}
</script>

<!-- style of "*",".top",".header",".top-logo",".web-name",".nav-links","nav-link","scrolling-wrapper" Coppied from AdminProfile-->
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
.summary-container{
    position: absolute;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    min-width: 650px;
}
.summary-header{
    display: grid;
    font-size: 18px;
    color: #333;
    border-bottom: 1px solid #6c6262;
    grid-template-columns: 2fr 2.4fr 2fr 4fr;;
    font-weight: bold;
    text-align: center;
}
.header-ID,.header-Answer,.header-Accuracy,.header-Time {padding: 10px; }
.summary-list{
    list-style-type: none;
    margin-top: 5px;
    padding-right: 20px;
    padding-left: 20px;
    max-height: 400px;
    cursor: pointer;
}
.summary-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 2.3fr;
    gap: 60px;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}
.summary-item:hover {background-color: #94f0a9;border-radius: 5px}
.scrolling-wrapper {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid transparent;
    padding: 0px;
    background-color: transparent;
}
.item-id,.item-answered,.item-accuracy,.item-time{
    text-align: center;
    font-size: 18px;   
    color: #3e3e3e; 
}

.scrolling-wrapper::-webkit-scrollbar {
    width: 8px;
}

.scrolling-wrapper::-webkit-scrollbar-thumb {
    background-color: #A8BA99;
    border-radius: 10px;
}
</style>