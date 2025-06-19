<template >

    <div class="container">
    <h1>天泽聊天室登录</h1>
    <div  class="login-form">
      <div class="form-item input">
        <input type="email" placeholder=" " v-model="email" id="user"/>
        <label class="place-label" for="user">邮箱或用户名</label>
        <label class='notice'>请输入正确的邮箱</label>
      </div>
      <div class="form-item verify-code ">
        <div>
          <input class="verify-code-input" type="text" placeholder=" "  v-model="verifyCode" id="verifyCode"/>
          <label class="place-label" for="verifyCode">验证码</label>
        </div>
        <span id="get-verify-code" @click="get" class="active">获取验证码</span>
      </div>
      <div class="form-item">
        <button class="login-button" @click="loginByVerify">登录</button>
        <button class="register-button">立即注册</button>
      </div>
    </div>
  </div>

</template>


<script setup>
import { ref } from 'vue';
import { getVerifyCode , login , getUserInfo} from '@/network/user'
import { userAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';

  const router = useRouter()

  const email = ref('')
  const verifyCode = ref('')

  const auth = userAuthStore()


  // 获取验证码
  const get = () => {
    const button = document.getElementById('get-verify-code')

    // 阻止鼠标事件
    if(button.classList.contains('disable')){
      return
    }
    if(!email.value){
      alert('请输入邮箱或用户名')
      return
    }

    getVerifyCode(email.value).then(res=>{
      if (res.data.code===1000){
        alert('验证码已发送')
      }else{
        alert(res.data.message)
      }
    })

    // 按钮置灰，60s一次
    button.classList.add('disable')
    let countDown = 60
    button.innerText = `${countDown}s后重试`
    // 倒计时
    const timer = setInterval(()=>{
      countDown--
      button.innerText = `${countDown}s后重试`
      if (countDown <= 0){
        clearInterval(timer)
        button.classList.remove('disable')
        button.innerText = '获取验证码'
      }
    },1000)
  }

  const loginByVerify = ()=>{
    console.log(1);
    if (!email.value || !verifyCode.value){
      alert('输入用户名或验证码')
      return
    }
    let data
    if (isEmail(email.value)){
      data = {
        email: email.value,
        verify_code: verifyCode.value
      }
    }else{
      data = {
        username: email.value,
        verify_code: verifyCode.value
      }
    }
    login(data).then(res=>{
      if (res.data.code === 1000){
        alert('登录成功！')
        auth.setToken(res.data.data.access,res.data.data.refresh)
        getUserInfo().then(res=>{
          auth.setUserInfo(res.data)
        })
        router.push('/')
      }else{
        alert(res.data.message)
      }
    })
  }

  //  验证邮箱
  function isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

</script>


<style lang="scss" scoped>

.container {
  width: 500px;
  height: auto;
  border: 1px solid #b9b5b5;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1{
  margin-top: 10px;
  margin-bottom: 10px;
  }
  .login-form{
    .form-item{
      position: relative;
      position: relative;
      margin-bottom: 20px;
      text-align: center;
      width: 250px;
      &:first-child{
        margin-top: 15px;
        margin-bottom: 25px;
      }
      &:last-child{
        margin-top: 30px;
        margin-bottom: 30px;
      }
      .place-label{
        position: absolute;
        left: 20px;
        top: 2px;
        font-size:20px;
        pointer-events: none;
        transition:
          top 0.25s ease,
          font-size 0.25s ease,
          color 0.25s ease,
          transform 0.25s ease;
      }
      input{
        width: 240px;
        height: 35px;
        border: 1.5px solid rgb(0, 145, 255);
        border-radius: 4px;
        background-color: white;
        transition: border-color 0.3s, box-shadow 0.3s;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

        &:focus{
        box-shadow: 0 0 6px rgba(0, 145, 255, 0.5);
        }
        &:focus + .place-label,&:not(:placeholder-shown) + .place-label{
          top: -8px;
          font-size: 12px;
          color: #007bff;
          background-image: linear-gradient(white, white);
          background-repeat: no-repeat;
          background-size: 100% 6px;
          background-position: 0 50%;
          display: inline-block;
        }
        &:not(:placeholder-shown):invalid~ .notice{
          opacity: 1;
        }


      }
      .verify-code-input{
        width: 120px;
      }

      button{
        width: 90px;
        height: 30px;
        background-color: #6096d0;
        border-radius: 10px;
        &:active{
          background-color: #2184ed;
        }
      }
      .login-button{
        margin-right: 20px;
      }
      .notice{
        font-size: 11px;
        position: absolute;
        left: 10px;
        top: 100%;
        color: red;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .forget{
        font-size: 14px;
        margin-right: 20px;
        &:hover{
          color: red;
          cursor: pointer;
        }
      }
    }
    .verify-code{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 5px;
      .active{
        width: 90px;
        height: 35px;
        border-radius: 5px;
        font-size: 14px;
        line-height: 35px;
        color: white;
        background-color: #6096d0;
        user-select: none;
        &:hover{
          cursor: pointer;
        }
        &:active{
          color: black;
          background-color: #4f95e0;

        }
      }
      .disable{
        // pointer-events: none;
        filter: grayscale(100%);
        background: rgb(71, 70, 70);
        opacity: 0.6;
        cursor: not-allowed;
        &:hover{
          cursor: not-allowed !important;
        }
      }
    }
  }
}



</style>
