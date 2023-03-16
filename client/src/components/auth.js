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
import {
  LinkedinOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Layout, FloatButton } from 'antd';
const { Header } = Layout;

const baseUrl = 'https://api.emillos.com/'
const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const getFromLocalStorage = async (setAuth) => {
  const accessToken = localStorage.getItem('emillosAccessToken');
  if(accessToken){
    let signin = await axios.post(`${baseUrl}getuserdetails`, {accessToken}, headers)
    const {message, data:{username, role}} = signin.data
    if(message === 'error'){
      console.log('try refresh token')
    } else {
      setAuth({
        user:{
          username,
          role
        }
      })
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
          icon={<LinkedinOutlined />}
          style={{ bottom: 24 }}
          href='https://www.linkedin.com/in/emil-filtenborg-99551699/' 
          target='_blank'/>
        <FloatButton shape="square"
          icon={<GithubOutlined />}
          style={{ bottom: 94 }}
          href='https://github.com/Emillos/emillos.com' 
          target='_blank' />
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