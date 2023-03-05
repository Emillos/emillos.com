import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Form, Input } from 'antd';
import axios from 'axios';
const baseUrl = 'https://api.emillos.com/'
const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const onFinish = async(e, values, setErrorMessage) => {
  const {passwordRetype, newPassword} = e
  const navigate = useNavigate()
  values["password"] = newPassword
  if(checkPassword()){
    try{
      let setPw = await axios.post(`${baseUrl}passwordresetconfirm`, values, headers)
      if(setPw.data.message === 'error'){
        setErrorMessage({create:'Error creating account, try again!'})
      } else {
        await navigate('/signin?reset')
      }
    }
    catch(e){
      setErrorMessage({create:'Error resetting passwrod, try again!'})
    }
  }
}

const onFinishFailed = (errorInfo) => { 
  console.log('Failed:', errorInfo);
}

const checkPassword = (password, retyped) => {
  // TODO implement this as a helper function
  return true
}


const PasswordRestConfirm = (props) => {
  const [ errorMessage, setErrorMessage ] = useState({})
  const [ searchParams ] = useSearchParams();
  const [ urlParams ] = useState({
    code: searchParams.get('code'),
    userName: searchParams.get('userName'),
    region: searchParams.get('region'),
    email: searchParams.get('email')
  })

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={(e) => onFinish(e, urlParams, setErrorMessage)}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: 'Please input your new password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Retype Password"
        name="passwordRetype"
        rules={[{ required: true, message: 'Please retype your new password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PasswordRestConfirm