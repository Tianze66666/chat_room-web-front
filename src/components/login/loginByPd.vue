<template >
    <div class="container">
    <h1>天泽聊天室登录</h1>
    <div  class="login-form">
      <div class="form-item input">
        <input type="email" placeholder=" " v-model="email" id="user"/>
        <label class="place-label" for="user">邮箱或用户名</label>
        <label class='notice'>请输入正确的邮箱</label>
      </div>
      <div class="form-item input">
        <input type="password" placeholder=" "  v-model="password" id="pd"/>
        <label class="place-label" for="pd">密码</label>
      </div>
      <div class="form-item">
        <button class="login-button" @click="loginByEmaPw">登录</button>
        <button class="register-button" @click="toRegister">立即注册</button>
      </div>
      <div class="form-item">
        <label class="forget">忘记密码</label>
        <label class="verify-code" @click="toVerifyLogin">验证码登录</label>
      </div>
    </div>
  </div>

</template>


<script setup>
  import { login ,getUserInfo} from "@/network/user";
  import { ref } from "vue";
  import { userAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";

  const router = useRouter()

  const email = ref("");
  const password = ref("");
  const auth = userAuthStore()
  const loginByEmaPw = ()=>{
    if(!email.value || !password.value){
      console.log(email.value);
      alert('请输入邮箱和密码')
      return
    }
    let data = {
      email: email.value,
      password: password.value
    }
    login(data).then(res=>{
      if (res.data.code===1000){
        console.log(res);

        alert('登录成功！')

        auth.setToken(res.data.data.access,res.data.data.refresh)
        getUserInfo().then(res=>{
          auth.setUserInfo(res.data)
          router.push('/')
        })
      }else{
        alert(res.data.message)
      }
    })
  }

  const toVerifyLogin = ()=>{
    router.push('/login?type=verify')

  }

  const toRegister = ()=>{
    router.push('/register')
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
        text-align: right;
      }

      .place-label{
        position: absolute;
        left: 20px;
        top: 2px;
        font-size:20px;
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
      .verify-code{
        font-size: 14px;
        &:hover{
          color: red;
          cursor: pointer;
        }
      }
    }
  }
}












</style>
