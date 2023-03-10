import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Divider, Collapse, Alert } from 'antd';
const { Panel } = Collapse;
import axios from 'axios';
import '../styles/loginStyle.less'

const baseUrl = 'https://api.emillos.com/'

const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login = (props) => {
  const [ errorMessage, setErrorMessage ] = useState({})
  const navigate = useNavigate()

  useEffect(() =>{
    if(props.auth.user){
      navigate('/')
    }
  })

  const handleCreate = async (data) => {
    const {email, password, retypePassword} = data
    
    try{
      let signup = await axios.post(`${baseUrl}signup`, {email, password, retypePassword}, headers)
      setErrorMessage({
        create:{
          message: signup.data.message.message,
          type: signup.data.message.type
        }
      })
    }
    catch(e){
      setErrorMessage({
        create:{
          message:'Error creating account, try again!',
          type:'error'
        }
      })
    }
  }

  const handlePasswordReset = async (data) => {
    const email = data.email
    try{
      let reset = await axios.post(`${baseUrl}passwordreset`, {email}, headers)
      setErrorMessage({
        reset:{
          message: reset.data.message.message,
          type: reset.data.message.type
        }
      })
    }
    catch(e){
      setErrorMessage({
        reset:{
          message:'Error reseting password!',
          type:'error'
        }
      })
    }
  }

  const handleLogin = async (data) => {
    const {email, password, remember} = data
    try{
      let signin = await axios.post(`${baseUrl}signin`, {email, password}, headers)
      if(signin.data.message != 'ok'){
        setErrorMessage({
          signin:{
            message: signin.data.message.message,
            type: signin.data.message.type
          }
        })
      } else {
        await props.setAuth({user:signin.data.user_mail})
        if(remember){
          await localStorage.setItem('emillosAccessToken', signin.data.access_token)
        }
        await navigate('/')
      }
    }
    catch(e){
      setErrorMessage({
        signin:{
          message:'Wrong user and/or password, try again!',
          type: 'error'
        }
      })
    }
  }

  return (
    <div id='login'>
      <div className='loginWrapper'>
        <Divider>Signin</Divider>
        {errorMessage.signin &&
          <Alert
          description={errorMessage.signin.message}
          type={errorMessage.signin.type}
          showIcon
          closable/>
        }
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin:'50px auto' }}
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <Collapse>
        <Panel header="Reset Password" key="1">
        {errorMessage.reset &&
          <Alert
          description={errorMessage.reset.message}
          type={errorMessage.reset.type}
          showIcon
          closable/>
        }
        <Form
            name="reset"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, margin:'50px auto' }}
            initialValues={{ remember: true }}
            onFinish={handlePasswordReset}
            onFinishFailed={onFinishFailed}
            autoComplete="off">

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>

        </Panel>
        </Collapse>

        <Divider>Create Account</Divider>
        {errorMessage.create &&
          <Alert
          description={errorMessage.create.message}
          type={errorMessage.create.type}
          showIcon
          closable/>
        }
        <Form          
          name="create"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin:'50px auto' }}
          initialValues={{ remember: true }}
          onFinish={handleCreate}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Retype Password"
            name="retypePassword"
            rules={[{ required: true, message: 'Please input your password again!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login