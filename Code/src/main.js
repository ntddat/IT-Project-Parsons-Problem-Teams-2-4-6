import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Generator from './pages/Generator.vue'
import AdminProfile from './pages/AdminProfile.vue'
import AdminLogin from './pages/AdminLogin.vue'
import History from './pages/History.vue'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/icon/iconfont.css'

const app = createApp(App);


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: "/",
            redirect: '/Generator'
        },
        {
            path: "/Generator",
            name: "Generator",
            component: Generator,
          },
        {
            path: "/AdminProfile",
            name: "AdminProfile",
            component: AdminProfile,
          },
        {
            path: "/AdminLogin",
            name: "AdminLogin",
            component: AdminLogin,
          },
          {
            path: "/History",
            name: "History",
            component: History,
          },
          
    ]
  });

app.use(router);
app.mount("#app");

export default router;