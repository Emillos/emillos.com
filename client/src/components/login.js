import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Divider, Collapse, Alert } from 'antd';
const { Panel } = Collapse;
import axios from 'axios';
import '../styles/loginStyle.less'

const baseUrl = 'https://api.emillos.com/'
const initialState = {
  email:'',
  password: '',
  passwordCheck:'',
  userName:''
}
const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const Message = (message) => {
  return <div className='errorMessage'>{message.message}</div>
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const checkPassword = (password, retyped) => {
  // TODO implement this
  return true
}

const Login = (props) => {
  const [ activeSection, setActiveSection ] = useState('login');
  const [ authDetails, setAuthDetails ] = useState(initialState)
  const [ errorMessage, setErrorMessage ] = useState({})
  const navigate = useNavigate()

  useEffect(() =>{
    if(props.auth.user){
      navigate('/')
    }
  })

  const handleCreate = async (data) => {
    const email = data.email
    const password = data.password
    if(checkPassword()){
      try{
        let signup = await axios.post(`${baseUrl}signup`, {email, password}, headers)
        if(signup.data.message === 'error'){
          setErrorMessage({create:'Error creating account, try again!'})
        } else {
          await navigate('/checkmail')
        }
      }
      catch(e){
        setErrorMessage({create:'Error creating account, try again!'})
      }
    }
  }

  const handlePasswordReset = async (data) => {
    try{
      let reset = await axios.post(`${baseUrl}passwordreset`, {email}, headers)
      console.log(reset)
      if(reset.data.message === 'error'){
        setErrorMessage({reset:'Error reseting password!'})
      } else {
        await navigate('/checkmailreset')
      }
    }
    catch(e){
      setErrorMessage({reset:'Error reseting password!'})
    }
  }

  const handleLogin = async (data) => {
    console.log(data)
    let email = data.email
    let password = data.password
    try{
      let signin = await axios.post(`${baseUrl}signin`, {email, password}, headers)
      if(signin.data.message === 'error'){
        setErrorMessage({signin:'Wrong user and/or password, try again!'})
      } else {
        await props.setAuth({user:signin.data.user_mail})
        await localStorage.setItem('emillosAccessToken', signin.data.access_token)
        await navigate('/')
      }
    }
    catch(e){
      setErrorMessage({signin:'Wrong user and/or password, try again!'})
    }
  }

  return (
    <div id='login'>
      <div className='loginWrapper'>
        <Divider>Signin</Divider>
        {errorMessage.signin &&
          <Alert
          message="Error"
          description={errorMessage.signin}
          type="error"
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