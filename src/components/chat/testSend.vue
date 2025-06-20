<template lang="html">
  <input type="text" v-model="message">
  <div>
    <div class="send" @click="sendMessage">发送消息</div>
  </div>
</template>

<script setup>
import { userChatStore } from '@/stores/chat'
import { ref } from 'vue'

const message = ref('')
const chat = userChatStore()
chat.currentChat = 1

const sendMessage = () => {
  let data = {
    "type":"chat",
    "to":"group",
    "channel_id":chat.currentChat,
    "message":message.value,
    "token":localStorage.getItem('accessToken')
  }
  const res = chat.sendMessage(data)
  console.log(res?'ok':'发送失败');

}


</script>


<style lang="scss" scoped>
.send{
  width: 100px;
  height: 50px;
  background-color: #2c3e50;
  color: white;
  line-height: 50px;
  text-align: center;
  border-radius: 10px;
  &:hover{
    cursor: pointer;
  }
}


</style>
