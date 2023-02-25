import React from 'react';
import { Link } from "react-router-dom";
import { Button, Form, Input } from 'antd';
import axios from 'axios';

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const PasswordRestConfirm = () => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
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