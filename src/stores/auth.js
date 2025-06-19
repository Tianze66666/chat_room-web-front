import { defineStore } from "pinia";
import { ref ,computed } from "vue"
import { refreshTokenAPI } from '../network/user'

export const userAuthStore = defineStore('auth',()=>{
  const accessToken = ref(localStorage.getItem('accessToken')|| null)
  const refreshToken = ref(localStorage.getItem('refreshToken')|| null)
  const user = ref(JSON.parse(localStorage.getItem('userInfo')) || null)
  const isLogin = computed(()=>{return accessToken.value !== null})

  let refreshTimer = null;


  // 刷新页面重新获取token
  function loadTokensFromStorage() {
    accessToken.value = localStorage.getItem('accessToken')
    refreshToken.value = localStorage.getItem('refreshToken')
    const u = localStorage.getItem('userInfo')
    user.value = u ? JSON.parse(u) : null
  }
  
  loadTokensFromStorage()

  // 设置token
  function setToken(newAccessToken,newRefreshToken){
    localStorage.setItem('accessToken',newAccessToken)
    localStorage.setItem('refreshToken',newRefreshToken)
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
  }

  // 设置用户信息
  function setUserInfo(userInfo){
    localStorage.setItem('userInfo',JSON.stringify(userInfo))
    user.value = userInfo
  }


  function loginOut(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    location.reload()
  }

  async function refreshAccessToken(){
    try{
      if(!refreshToken.value) throw new Error("refreshToken is null");
      const res = await refreshTokenAPI(refreshToken.value);
      if(res){
        setToken(res.accessToken,res.refreshToken)
      }else{
        throw new Error("refreshToken is null");
      }
      }catch(error){
        console.log(error);
        loginOut()
      }
    }

    function startAutoRefreshToken(){
      if (refreshTimer) clearInterval(refreshTimer);
      refreshTimer = setInterval(refreshAccessToken, 25 * 60 * 1000); // atoken过期30分钟，每25分自动刷新
    }


  // 导出
  return {
    accessToken,
    refreshToken,
    user,
    isLogin,
    setToken,
    setUserInfo,
    loadTokensFromStorage,
    loginOut,
    startAutoRefreshToken
  }

})

