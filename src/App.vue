<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body {
    margin: 0;
    background-image: url('assets/holyjs-back4.jpg');
    min-height: 100%;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #app {
    font-family: Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 15vh;
    opacity: 0.9;
  }
  @media only screen and (max-device-width: 1366px) {
    background-attachment: scroll;
  }
</style>
