<template lang="html">
    <div class="container">
    <h1>聊天室注册</h1>
    <div  class="login-form" >
      <div class="form-item input">
        <input type="email" placeholder=" " v-model="email" id="email"/>
        <label class="place-label" for="email">邮箱</label>
        <label class='notice'>请输入正确的邮箱</label>
      </div>
      <div class="form-item input">
        <input type="text" placeholder=" " v-model="name" id="user"/>
        <label class="place-label" for="user">昵称</label>
      </div>
      <div class="form-item input">
        <input type="password" placeholder=" " v-model="password" id="password"/>
        <label class="place-label" for="password">密码</label>
      </div>
      <div class="form-item input">
        <input type="password" placeholder=" " v-model="rePassword" id="rePassword"/>
        <label class="place-label" for="rePassword">确认密码</label>
      </div>
      <div class="form-item verify-code ">
        <div>
          <input class="verify-code-input" type="text" placeholder=" "  v-model="verifyCode" id="verifyCode"/>
          <label class="place-label" for="verifyCode">验证码</label>
        </div>
        <span id="get-verify-code" @click="get" class="active">获取验证码</span>
      </div>
      <div class="form-item">
        <button class="login-button" @click="toLogin" >登录</button>
        <button class="register-button" @click="userRegister">立即注册</button>
      </div>
    </div>
  </div>
  <clear></clear>
</template>

<script setup>
import { ref ,reactive} from 'vue'
import { register ,getVerifyCode } from '@/network/user'
import { useRouter } from 'vue-router'
import  clear  from '@/components/login/userClear.vue'

  const router = useRouter()

  const name = ref('')
  const email = ref('')
  const password = ref('')
  const rePassword = ref('')
  const verifyCode = ref('')

  let data = reactive({
    email: email,
    name: name,
    password: password,
    rePassword: rePassword,
    verify_code: verifyCode
  })


  const fieldMap = {
    email: '邮箱',
    name: '用户名',
    password: '密码',
    rePassword: '确认密码',
    verifyCode: '验证码'
  };

  const userRegister = ()=> {

    // 判断是否有空
    for (let i in data){
      if (!data[i]){
        alert(`${fieldMap[i]} 不能为空`);
        return
      }
    }

    // 密码是否一致
    if (data.password !== data.rePassword){
      alert('密码不一致');
      return
    }

    // 注册网络请求
    register(data).then(res=>{
      console.log(res);
      switch (res.data.code) {
        case 1000:
          alert('注册成功！')
          router.push('/login')
          break;
        case 1004:
          alert('用户已存在！')
          break;
        default:
          alert('注册失败！请检查验证码')
          break;
      }
    })
  }


  // 获取验证码
  const get = () => {
    if (!isEmail(email.value)){
      alert('请输入正确的邮箱')
      return
    }
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
      console.log(res);
      if (res.data.code===1000){
        alert('验证码已发送')
      }else{
        alert('res.data.message')
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


  const toLogin = ()=>{
    router.push('login/')
  }

  // 验证邮箱
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
          // background-color: white;
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
