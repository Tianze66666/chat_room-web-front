import { defineStore } from "pinia";
import {  ref ,reactive,computed} from 'vue'
import { userAuthStore } from "./auth";
import { refreshTokenAPI } from '@/network/user'

export const userChatStore = defineStore('chat',()=>{
  const LOCAL_MESSAGE_KEY = "ws_messages";
  const authStore = userAuthStore()
  const currentChat = ref(null)
  const reconnectTimeout = ref(null)
  const messageMap = reactive(loadAllMessage());
  const ws = ref(null)    // ws连接实例
  const isConnected = ref(false)  // ws连接状态
  const writeQueue = {};

  // 最大重连次数3
  let retryCount = 0
  const MAX_RETRY = 3


  function initWebSocket(){
    if (!authStore.accessToken) {
      console.error('缺少accessToken，无法连接WebSocket')
      authStore.loginOut()
      location.reload()
      return
    }
    if (ws.value){
      console.log('已存在WebSocket实例，请勿重复初始化');
      return
    }

    const url = `ws://47.122.130.222:8080/ws/chat/?token=${encodeURIComponent(localStorage.getItem('accessToken'))}`

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      console.log("✅ WebSocket 连接成功");
      isConnected.value = true;
      retryCount = 0
      if (reconnectTimeout.value){
        reconnectTimeout.value = null
      }
    };

    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMessage(data);
    };

    ws.value.onclose = () =>{
      console.warn("WebSocket 断开");
      isConnected.value = false;
      ws.value = null;
      if (retryCount >= MAX_RETRY){
        console.log('已超过最大重连次数，请重新登录');
        authStore.loginOut()
        location.reload()
      }
      retryCount++
      // 重连机制
      reconnectTimeout.value = setTimeout(initWebSocket, 3000);
    }

  }

  async function handleIncomingMessage(data){
    const channelId = data.channel_id
    const code =data.code
    console.log("收到消息", data);

    // 强制踢出
    if(code===403){
      closeWebSocket()
      authStore.loginOut()
      location.reload()
    }

    // token过期，尝试刷新token
    if(code===401){
      const res = await refreshTokenAPI(localStorage.getItem('refreshToken'))
      if(res){
        authStore.setToken(res.accessToken,res.refreshToken)
        if ( ws.value ){
          closeWebSocket()
        }
        setTimeout(() => {
          initWebSocket();
        }, 100);
        }else{
          authStore.loginOut()
          location.reload()
      }
    }


    if (data.type === 'channel_chat'){
      console.log('群组聊天消息',data);
      if (!channelId) return console.warn("消息缺少 channel_id", data);
      if (!messageMap[channelId]) {
        messageMap[channelId] = [];
      }
      messageMap[channelId].push(data)
      saveMessage(channelId,messageMap[channelId]); // 同步更新
      throttledSaveMessage(channelId,messageMap[channelId]);
    }

  }

  function sendMessage(msgdata){
    if(!currentChat.value){
      console.warn('请选择聊天对象');
      return false
    }
    if(ws.value && isConnected.value){
      ws.value.send(JSON.stringify(msgdata))
      return true
    }else{
      console.warn('WebSocket未连接，请稍后再试');
      return false
    }
  }

  function closeWebSocket(){
    if (ws.value) {
      ws.value.close();
      ws.value = null;
      isConnected.value = false;
      if (reconnectTimeout.value) clearTimeout(reconnectTimeout.value);
    }
  }

  // 当前群的聊天消息
  const currentMessages = computed(() => {
    return messageMap[currentChat.value] || [];
  });


  // 本地存储消息

  function loadAllMessage() {
    const raw = localStorage.getItem(LOCAL_MESSAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  function saveMessage(groupId,messages) {
    const all = loadAllMessage();
    all[groupId] = messages.slice(-50); // 仅保留最近 50 条
    localStorage.setItem(LOCAL_MESSAGE_KEY, JSON.stringify(all));
  }


  // 清空群消息
  function clearGroupMessages(groupId) {
    if (messageMap[groupId]) {
      delete messageMap[groupId];
    }
    const all = loadAllMessage();
    delete all[groupId];
    localStorage.setItem(LOCAL_MESSAGE_KEY, JSON.stringify(all));
  }


  // 节流保存消息
  function throttledSaveMessage(groupId, messages, delay = 300) {
  if (writeQueue[groupId]) clearTimeout(writeQueue[groupId]);
  writeQueue[groupId] = setTimeout(() => {
    saveMessage(groupId, messages);
    delete writeQueue[groupId];
  }, delay);
  }


  return {
    initWebSocket,
    sendMessage,
    closeWebSocket,
    clearGroupMessages,
    currentMessages,
    messageMap,
    currentChat,
  }
})
