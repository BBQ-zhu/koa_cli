<template>
  <div id="app"> 
     <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('./assets/css/release.css');
@import url('./assets/css/common.css');

.el-button--primary{
  background-color:#2b3a4a!important;
  border-radius: 8px!important;
}
</style>
