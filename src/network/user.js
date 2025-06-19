import request from './configer'

export function login(data) {
  return request.post('/user/login/', data)
}


export function getUserInfo() {
  return request.get('/user/info')
}

export function getVerifyCode(user){
  return request.get('/user/getcode/'+user)
}

export function register(data){
  return request.post('/user/register/',data)
}


// 刷新token接口
export async function refreshTokenAPI(token){
  const data = {
    refresh:token
  }
  const res = await request.post("user/refreshtoken/", data);
  if (res.data.code===1000){
    return {
      accessToken:res.data.data.access,
      refreshToken:res.data.data.refresh,
    }
  }else{
    return null
  }
}



