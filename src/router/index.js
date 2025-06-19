import { createRouter, createWebHistory } from 'vue-router'
import userLogin from '../views/user/userLogin.vue'
import userRegister from '../views/user/userRegister.vue'
import chatWindow from '../views/home/chatLayout.vue'
import { userAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: chatWindow,
      meta:{
        requireAuth:true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: userLogin,
    },
    {
      path: '/register',
      name: 'register',
      component: userRegister,
    },
  ],
})

router.beforeEach((to,from,next)=>{
  const auth = userAuthStore()
  if (to.meta.requireAuth && !auth.isLogin){
    console.log('登录状态失效');
    console.log(auth.isLogin);
    next('/login')
  }else{
    next()
  }
})

export default router
