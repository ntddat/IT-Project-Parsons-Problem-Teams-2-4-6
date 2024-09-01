<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleLogin() {
  // Handle login logic here
  console.log('Email:', email.value)
  console.log('Password:', password.value)
}
</script>

<template>
  <div class="header">
    <img src="/logo.png" alt="Logo" class="logo1" />
    <div class="company-name">learnr</div>
  </div>
  <div class="login-frame">
    <div class="main-content">
      <img src="/logo.png" alt="Logo" class="logo2" />
      <div class="title">Admin Login</div>
      <div class="login-form">
        <div class="form-group">
          <div class="subtitle">Username</div>
          <input
            v-model="email"
            type="text"
            class="login-input"
            placeholder="Enter your Username"
          />
        </div>
        <div class="form-group">
          <div class="subtitle">Password</div>
          <input
            v-model="password"
            type="password"
            class="login-input"
            placeholder="Enter your Password"
          />
        </div>
        <button @click="handleLogin" class="login-button">Login</button>
      </div>
      <div class="warning-container">
        <div class="warning1">Not Admin?</div>
        <div class="warning2">Go Back to Home</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-frame {
  box-sizing: border-box;
  margin-top: 5%;
  margin-left: 33%;
  padding-top: 30px;
  width: 550px;
  height: 630px;
  background: #F6F4F4;
  border-radius: 30px;
  display: flex;
  align-items: center; /* Center all items horizontally */
}
.title {
  font-size: 30px;
  font-weight: bold;
}

.subtitle {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 0; /* Ensure there's no margin */
  line-height: 0.5; /* Set line-height to 1 to minimize any extra space */
  text-align: left; /* Ensure subtitles are aligned to the left */
  width: 100%; /* Ensure subtitle takes full width */
}

.header {
  display: flex;
  align-items: center;
  padding: 15px;
}

.logo1 {
  height: 25px; /* Adjust as needed */
  margin-right: 10px;
}

.logo2 {
  height: 50px; /* Adjust as needed */
  margin-right: 10px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
}
.warning-container {
  display: flex; /* Align items in a row */
  justify-content: space-between; /* Distribute space between the warnings */
  position: absolute; /* Position relative to parent */
  bottom: 15%; /* Adjust as needed for spacing from the bottom */
  width: 9.5%; /* Full width of the parent container */
}
.warning1 {
  font-size: 10px;
}
.warning2 {
  font-size: 10px;
  font-weight: bold;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
  font-size: 24px;
  font-family: Lexend, sans-serif;
  font-weight: 500;
  line-height: 48px;
  word-wrap: break-word;
  margin-bottom: 80px;
  gap: 30px; /* Space between all children */
}

.login-form {
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* Space between all children */
}

.form-group {
  width: 90%; /* Ensures input and subtitle take full width */
  margin-bottom: 20px; /* Space between form groups */
}

.login-input {
  width: 100%;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  outline: none;
}

.login-button {
  background-color: #030403;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 55%;
  font-size: 13px;
}
</style>
