<script setup>
import { ref } from 'vue'

const value = ref('')

function add() {
  // Handle login logic here
  console.log('Input Value:', value.value)
}
</script>

<template>
  <div class="header">
    <!-- <img src="path/to/logo.png" alt="Logo" class="logo" /> -->
    <div class="company-name">learnr</div>
  </div>
  <div class="todo-app">
    <div class="title">Login</div>

    <div class="todo-form">
      <input
        v-model="value"
        type="text"
        class="todo-input"
        placeholder="Enter your Email"
      />
    </div>

    <div class="todo-form">
      <input
        v-model="value"
        type="text"
        class="todo-input"
        placeholder="Enter your Password"
      />
    </div>

    <div class="button-container">
      <div @click="add" class="login-button">LOGIN</div>
    </div>

  </div>
</template>

<style scoped>
.todo-app {
  box-sizing: border-box;
  margin-top: 40px;
  margin-left: 1%;
  padding-top: 30px;
  width: 98%;
  height: 500px;
  background: #F6F4F4;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center all items horizontally */
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
}

.todo-form {
  display: flex;
  flex-direction: column; /* Align inputs vertically */
  width: 80%; /* Make inputs a bit narrower */
  max-width: 400px; /* Set a maximum width */
  margin-bottom: 20px;
}

.login-button {
  width: 100px;
  height: 52px;
  border-radius: 20px;
  text-align: center;
  background: #156B3A;
  color: #fff;
  line-height: 52px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.todo-input {
  padding: 0px 15px;
  border-radius: 20px;
  border: 1px solid #dfe1e5;
  outline: none;
  width: 100%;
  height: 50px;
  margin-bottom: 15px; /* Add some space between inputs */
}

.button-container {
  display: flex;
  justify-content: center; /* Center the button horizontally */
  width: 100%;
}
</style>
