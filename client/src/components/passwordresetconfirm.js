import React, { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Button, Form, Input, Divider, Alert } from 'antd';
import axios from 'axios';
const baseUrl = 'https://api.emillos.com/'
const headers = {
  "Access-Control-Allow-Headers" : "Application/json",
  "Access-Control-Allow-Origin": "*"
}

const onFinish = async(e, values, setErrorMessage, setShowForm) => {
  const {passwordRetype, newPassword} = e
  values["password"] = newPassword
  values["retypePassword"] = passwordRetype

  try{
    let setPw = await axios.post(`${baseUrl}passwordresetconfirm`, values, headers)
    setErrorMessage({
      reset:{
        message: setPw.data.message.message,
        type: setPw.data.message.type
      }
    })
    setPw.data.message.type == 'success' && setShowForm(false) 
  }
  catch(e){
    setErrorMessage({
      reset:{
        message: "Error resetting password, please close this window and try again",
        type:'error'
      }
    })
  }
}

const onFinishFailed = (errorInfo) => { 
  console.log('Failed:', errorInfo);
}

const PasswordRestConfirm = (props) => {
  const [ errorMessage, setErrorMessage ] = useState({})
  const [ showForm, setShowForm ] = useState(true)
  const [ searchParams ] = useSearchParams();
  const [ urlParams ] = useState({
    code: searchParams.get('code'),
    userName: searchParams.get('userName'),
    region: searchParams.get('region'),
    email: searchParams.get('email')
  })

  return (
    <div>
      <Divider>Reset Password</Divider>
      {errorMessage.reset &&
        <Alert
        description={errorMessage.reset.message}
        type={errorMessage.reset.type}
        showIcon/>
      }
      {showForm &&
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin:'50px auto' }}
          initialValues={{ remember: true }}
          onFinish={(e) => onFinish(e, urlParams, setErrorMessage, setShowForm)}
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
      }
    </div>
  )
}

export default PasswordRestConfirm