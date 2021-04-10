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
.page-des {
  width: 100%;
  height: 64px;
  margin: 18px auto;
  font-size: 24px;
  line-height: 64px;
  text-align: center;
}

.three-area {
  height: calc(100vh - 150px);
}
</style>
