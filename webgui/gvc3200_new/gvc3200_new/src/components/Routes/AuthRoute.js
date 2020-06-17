/**
 * 认证路由
 */
import React from 'react'
import Cookie from 'js-cookie'
// eslint-disable-next-line
import { Route, Redirect } from 'react-router-dom'
import API from '@/api'

const AuthRoute = (props) => {
  let type = Cookie.get('type') // phonecookie 设成HttpOnly 无法读 这是登录后同步设置的用户类型, 暂时用这个做路由鉴权
  if (!type) {
    API.logoff()
    return <Redirect to='/login' />
  }
  return (
    <Route {...props}/>
  )
}

export default AuthRoute
