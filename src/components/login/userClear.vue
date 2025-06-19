<template >
  <div>
    <button @click="clear">清除状态</button>
  </div>
</template>

<script setup>

import { userAuthStore } from '@/stores/auth';

const auth = userAuthStore();
const clear = () => {
  auth.loginOut()
  alert('清除成功！')
}

</script>


<style lang="scss" scoped>
  button{
    width: 100px;
    height: 50px;
    background-color: aqua;
    border-radius: 10px;
  }
</style>
