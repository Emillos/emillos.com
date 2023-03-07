import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import TopNav from './topNav'
import Front from './front'
import NoShow from './noShow'
import Login from './login'
import CheckMail from './checkmail'
import CheckMailReset from './checkmailreset'
import PasswordRestConfirm from './passwordresetconfirm';
import CloseMe from './closeMe'
import axios from 'axios'
import ClickACcat from '../projects/clickAcat/index'
import ShadowRabbit from '../projects/shadowRabbit/app'

import { Layout, Space, FloatButton } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

const baseUrl = 'https://api.emillos.com/'
const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const getFromLocalStorage = async (setAuth) => {
  const accessToken = localStorage.getItem('emillosAccessToken');
  if(accessToken){
    let signin = await axios.post(`${baseUrl}getuserdetails`, {accessToken}, headers)
    const {message, data:{UserAttributes}} = signin.data
    if(message === 'error'){
      console.log('try refresh token')
    } else {
      setAuth({user:UserAttributes[UserAttributes.length -1].Value})
    }
  }
}

const Auth = () => {
  const [ auth, setAuth ] = useState({})
  useEffect(() => {
    if(!auth.user){
      getFromLocalStorage(setAuth)
    }
  })

  return (
    <div>
      <Header>
        <TopNav auth={auth} setAuth={setAuth} />
        <FloatButton shape="square"
        onClick={() => console.log('click')} />
      </Header>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="closeme" element={<CloseMe />} />
        <Route path='checkmail/' element={<CheckMail />} />
        <Route path='checkmailreset/' element={<CheckMailReset />} />
        <Route path='passwordresetconfirm' element={<PasswordRestConfirm />} />
        <Route path='clickacat/' element={<ClickACcat />} />
        <Route path='shadowrabbit/' element={<ShadowRabbit />} />
        <Route path='signin/' element={<Login auth={auth} setAuth={setAuth} />} />
        <Route path="*" element={<NoShow />} />
      </Routes>
    </div>
  )
}

export default Auth