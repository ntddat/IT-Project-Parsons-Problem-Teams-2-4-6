<template>
<body>
    <!-- 导航 + 计时 -->
    <div id=" top-panel">
        <!-- 导航栏 -->
        <nav class="top">
        <div class="header">
            <img src="/logo.png" alt="Logo" class="top-logo" />
            <div class="web-name">Learnr</div>
        </div>
        <div class="nav-links">
            <router-link to="/AdminLogin" class="nav-link">Admin</router-link>
            <router-link to="/history" class="nav-link">History</router-link>
            <router-link to="/Generator" class="nav-link">Home</router-link>
        </div>
        </nav>

        <!-- 进度条 -->
        <div id="progress-container">
            <div id="progress-percent">0%</div>
            <div id="progress-bar">
                <div id="progress"></div>
            </div>
            <div id="time-elapsed">0 mins 0 seconds</div>
        </div>
    </div>

    <!-- 下部分，问题+输出 -->
    <main id = "main-box">
        <!-- 左侧面板，问题和拖动代码块的区域 -->
        <div id="left-panel">
            <div id="left-content">
                <h2 id="topicdescription">Parsons Problem Topic</h2> <!-- 问题数：Question1之类的但是不打算做在这个地方，先放着吧 -->
                <p id="questiondescription">Questiondescriptiondewjiodewjioewjidowjdoewjiodewjiodewj</p> <!-- 问题描述 -->
                
                <!--<a id="regenerate-btn" href="regen_demo_page.html"> -->
                <!--    <button>Regenerate</button>-->
                <!--</a>-->
                
            </div>
            
            <div id="sortableTrash" class="sortable-code"> </div>

            <a id="regenerate-btn" href="index.html"> 
                    <button>Regenerate</button>
            </a>
        </div>
        
        <!-- 可拖动的中分线 -->
        <div id="divider">⫴</div>

        <!-- 右侧面板，用户构建解决方案的区域 -->
        <div id="right-panel">
            <div id="right-top">
                <div id="sortable" class="sortable-code"></div>
                <div id="button-group">
                    <button id="run-btn">
                        <i class="fas fa-play"></i> Run
                    </button>
                    <button id="reset-btn">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                    <button id="submit-btn">
                        <i class="fas fa-paper-plane"></i> Submit
                    </button>
                </div>
            </div>
            
            <!-- 右侧可移动线 -->
            <div id="horizontal-divider">=</div>

            <!-- output 栏 -->
            <div id="calculated-value"> 
                <div id="output-icon">
                    <!-- <i class="fas fa-chevron-left"></i> 
                    <i class="fas fa-chevron-right"></i> Output</div> -->
                    <i class="fas fa-code"></i> Output</div>
                <br>
                <div id="output"></div>
                <div id="feedback"></div>
            </div>
        </div>
    </main>

</body>
</template>



<script>
export default {
    data() {
        return {
        }
    },

    mounted() {
        this.midDragControllerDiv();
        this.horDragControllerDiv();
    },

    methods: {
        // Mid resize
        midDragControllerDiv() {
            const divider = document.getElementById('divider');
            const leftPanel = document.getElementById('left-panel');
            const rightPanel = document.getElementById('right-panel');

            let isDragging = false;

            divider.addEventListener('mousedown', function(e) {
                isDragging = true;
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    let offsetX = e.clientX;
                    let totalWidth = window.innerWidth;

                    // 计算新的左侧和右侧面板的宽度百分比
                    let leftWidth = (offsetX / totalWidth) * 100;
                    let rightWidth = 100 - leftWidth;

                    // 限制最小和最大宽度
                    if (leftWidth < 10) leftWidth = 10;
                    if (rightWidth < 10) rightWidth = 10;

                    leftPanel.style.width = leftWidth + '%';
                    rightPanel.style.width = rightWidth + '%';
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });
        },

        // horizontal resize
        horDragControllerDiv() {
            const horizontalDivider = document.getElementById('horizontal-divider');
            const topSection = document.getElementById('right-top');
            const bottomSection = document.getElementById('right-bottom');
            const righTpanel = document.getElementById('right-panel');  

            let iSdragging = false;
            let startY = 0;  
            let startHeight = 0;  

            horizontalDivider.addEventListener('mousedown', function(e) {
                iSdragging = true;
                startY = e.clientY;
                startHeight = topSection.offsetHeight;
                document.body.style.cursor = 'ns-resize';
            });

            document.addEventListener('mousemove', function(e) {
                if (iSdragging) {
                    const diffY = e.clientY - startY;
                    const newHeight = startHeight + diffY;

                    if (newHeight > 50 && newHeight < righTpanel.offsetHeight - 50) {
                        topSection.style.height = `${newHeight}px`;
                        bottomSection.style.height = `${righTpanel.offsetHeight - newHeight - horizontalDivider.offsetHeight}px`;
                    }
                }
            });

            document.addEventListener('mouseup', function() {
                iSdragging = false;
                document.body.style.cursor = 'default';
            });
        },
  }
};
</script>


<style scoped>
/* Overall Layout */

html {
    height: 100%;
}
template, body {
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
}

/* #app {
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
} */

body{
    /* height: 100vh; */
    /* flex-grow: 1; */
    background: linear-gradient(to top right, #e7fcc8, #ffffff);
    display: flex;
    flex-direction: column;
}

main {
    display: flex;
    justify-content: space-between;
    padding: 0; /* Remove padding */
    margin: 0; /* Remove margin */
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: row;
    position: relative;
    margin-top: 0;
    max-height: 84%;
}
#top-panel{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
    flex-grow: 0;
}

/* menu */
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

/* 进度条容器 */
#progress-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 0px auto;  /* 居中 */
    margin-top: 10px;
    padding: 15px;
    background: linear-gradient(to top right, #6C8C81, #8E9D96);
    /* border-radius: 5px; */
    width: calc(100% - 30px);  /* 左右的间距 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    position: relative;
    height: auto;
}
#progress-percent {
    position: relative;
    top: 0;
    left: 0;
    color: #333;
    font-size: 15px;
    padding: 0;
    font-weight: bold;
    margin-bottom: 10px; /* 添加与进度条的间隔 */
}
#progress-bar {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    margin-bottom: 5px; /* 添加与时间文本的间隔 */
}
#progress {
    height: 100%;
    background-color: #F0A554; /* 设置进度条颜色 */
    width: 0%; /* 初始宽度 */
}
#time-elapsed {
    position: relative; /* Use absolute positioning */
    bottom: 0; /* Align to the bottom of the container */
    left: 0; /* Align to the left of the container */
    font-size: 15px;
    color: #fdffec;
    padding-left: 0; /* Add padding for spacing from left edge */
    padding-top: 5px; /* Add padding for spacing from bottom edge */
    margin-top: 1px; /* 添加与进度条的间隔 */
}

/* main body */
/* 右边的结果和按钮区域 */
/* 这两个中间再做一个分割线 */
#right-panel {
    /*width: 60%;
    height: 80.8vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f7eace;
    /* border-radius: 10px;
    padding: 20px; */
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
    /*margin-top: 0px;
    overflow: auto;*/
    width: 60%;
    /* height: auto; */
    /* max-height: 83vh; */
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f7eace;
    /* border-radius: 10px;
    padding: 20px; */
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
    margin-top: 0px;
    overflow: hidden;
}

/* 顶部区域样式 */
#right-top {
    padding: 0px;
    width: 100%;
    background-color: #C4D6BE;
    text-align: flex-start;
    height: 55%;
    overflow: auto; /* 如果内容超出，则添加滚动条 */
    display: flex;
    flex-direction: column; /* 确保内部的内容竖直排列 */
    justify-content: flex-start; /* Push the button-group to the bottom */
    margin-top: 0; /* 移除不必要的顶部间距 */
    margin-bottom: 0; /* 确保和#sortable之间的间距 */
}

#sortable{
    flex-grow: 1;
    margin-left: 20px;
    margin-right: 15px;
    margin-top: 0; /* 移除顶部不必要的间距 */
    padding: 0; /* 确保padding不会影响间距 */
    width: auto;
    /* overflow-y: auto;
    max-height: 500px; */
}


/* 可拖动的水平分割线 */
#horizontal-divider {
    width: 100%;
    height: 10px;
    background-color: #f1edb96c;
    cursor: ns-resize;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #52543b86;
}

#horizontal-divider:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

/* 底部区域样式 */
/* #right-bottom {
    flex-grow: 1; 
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0px;
    background-color: #f9f7eace;
    text-align: flex-start;
} */

#output i{
    font-size: 32px;
}

#output{
    /* overflow-y: auto; */
    /* padding-left: 5px; */
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 750;
    /* overflow-y: auto; */
    padding-left: 5px;
    white-space: pre-line;
    flex-shrink: 0;
}

#feedback{
    /* overflow-y: auto; */
    padding-left: 5px;
    flex-shrink: 0;
}
/* CSS for the square display area */
#calculated-value {
    /* width: auto;  
    height: auto; 
    padding: 5px;      
    background-color: #93841fce;
    text-align: flex-start;
    display: flex;
    align-items: flex-start; */
    width: 100%;
    /* height: auto; */
    flex-grow: 1; /* 占据剩余的垂直空间 */
    /* padding: 5px; */
    background-color: #f9f7eace;
    text-align: flex-start;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box; /* 包括 padding 和 border 在元素总尺寸内 */
    font-size: 24px;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    overflow-y: auto;
}

/* 分割线 */
#divider {
    width: 10px;
    height: 100%;
    background-color: #76ad9aac;
    cursor: ew-resize;  /* 调整鼠标指针形状 */
    position: relative;
    text-align: center;
    top: 0;
    bottom: 0;
    z-index: 1;
    display: flex;                
    justify-content: center;       /* 水平居中 */
    align-items: center;           /* 垂直居中 */
    color: #6c8c8186;
}

#divider:hover{
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);   /* 阴影变大 */
}

/* 左边的拖动区域 */
#left-panel{
    width: 40%;
    /* height: auto; */
    display: flex;
    flex-direction: column; /* 垂直方向排列 */
    align-items: stretch;
    /* justify-content: flex-start; */
    background: #f4f2e2;
    margin-top: 0px;
    position: relative;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    overflow: visible;
}   

#left-content{
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow:auto;
    flex-shrink: 0;
}

#topicdescription, #questiondescription{
    margin-left: 30px;
}

#sortableTrash {
    width: calc(80% - 20px);
    background: #37b0a200;
    max-height: 20%;
    /* border: 1px solid #dcdcdc; */
    border-radius: 10px;
    padding: 20px;
    /* box-shadow: 0 2px 8px rgba(131, 40, 40, 0.1); */
    flex-shrink: 0;
    overflow-y: auto;
}

#regenerate-btn{
    position: absolute;
    left: 5px;
    bottom: 5px;
}

#regenerate-btn button{
    border: none;
    border-radius: 5px;
    background: linear-gradient(to right, #d7b50d, #e9a004e2); 
    
}

button i {
    font-size: 16px;
    padding-right: 5px;
}

button {
    width: 150px;
    background-color: #C4D2C1;  /* 渐变绿色按钮 */
    border: 2px solid #ffffff;
    border-radius: 50px;
    color: rgb(0, 0, 0);
    padding: 10px;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    font-weight: 800;
    border-radius: 17.5px;
    cursor: pointer;
    margin: 5px;
    box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.1); /* Concave effect */
    transition: all 0.3s ease; /* Smooth transition */
}

/* 鼠标悬停时的效果 */
button:hover {
    border:2px solid #e2b00e;
    transform: translateY(-3px);     /* 悬浮效果 */
    /*box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);   /* 阴影变大 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.2); /* Convex effect */
}

#button-group {
    display: flex;
    justify-content: center;
    gap: 20%;
    margin-bottom: 10px; /* 将按钮组推到区域的底部 */

}

/* @media (max-width: 768px) {
    main {
        flex-direction: column;
        align-items: center;
    }

    #sortableTrash, #right-panel {
        width: 100%;
    }

    #button-group {
        flex-direction: column;
        align-items: center;
    }

    button {
        width: 95%;
    }
} */
@media (max-width: 768px) {
    .top{
        height: 40px;
    }
    /* 设置左侧和右侧面板垂直排列 */
    main {
        flex-direction: column;
        overflow-y: hidden;
    }

    /* 设置左侧面板和右侧面板的宽度为100% */
    #left-panel, #right-panel {
        width: auto;
    }

    /* 调整左侧和右侧面板的高度以适应小屏幕 */
    #left-panel {
        height: 52.5%;
        overflow: visible;
        z-index: 2;
    }

    #left-content{
        width: auto;
        height: 35.5%;
        display: block;
        /* flex-shrink: 0; */
    }
    #sortableTrash {
        height: 15%;
        margin-bottom: 45px;
    }

    /* 调整按钮宽度 */
    #regenerate-btn button {
        width: 100px;
        font-size: 14px;
        padding: 3px;
    }

    #right-panel {
        flex-grow: 1;
        z-index: 1;
        overflow-y: visible;
    }

    /* 减少字体大小和按钮的宽度 */
    h2, p {
        font-size: 14px;
    }

    button {
        width: 30%;
    }

    #button-group button {
        width: 80px; 
        font-size: 12px;
        padding: 5px;
        margin-top: 50px;
    }
    
    /* 调整按钮内部的图标大小 */
    #button-group button i {
        font-size: 16px;
    }
    
    /* 隐藏或调整分割线 */
    #divider {
        display: none;
    }

    /* 调整进度条容器在小屏幕上的样式 */
    #progress-container {
        width: auto;
        margin: 5px 0;
        margin-top: 40px;
    }

    #progress-percent,
    #progress-bar {
        display: none;
    }

    #time-elapsed {
        font-size: 12px;
        margin: 0 auto;
        text-align: center;
    }
}


</style>
