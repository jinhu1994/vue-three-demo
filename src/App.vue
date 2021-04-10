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
  height: 32px;
  margin: 9px auto;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
}

.three-area {
  height: calc(100vh - 100px);
}
</style>
