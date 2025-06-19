<template lang="html">
  <div class="chat">
    <div class="user-options">

    </div>

    <div class="selected">


    </div>
  </div>


  <clear></clear>
</template>


<script setup>
import clear  from '@/components/login/userClear.vue'
import { userAuthStore } from '@/stores/auth'
import { userChatStore } from '@/stores/chat'

  // 自动刷新token
  const auth = userAuthStore()
  auth.startAutoRefreshToken()

  // 维持ws连接
  const chat = userChatStore()
  chat.initWebSocket()

</script>


<style lang="scss">


</style>


