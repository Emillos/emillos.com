import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/loginStyle.less'


const initialState = {
  email:'',
  password: '',
  passwordCheck:'',
  userName:''
}

const Message = (message) => {
  return <div className='errorMessage'>{message.message}</div>
}

const Login = () => {
  const [ activeSection, setActiveSection ] = useState('login');
  const [ authDetails, setAuthDetails ] = useState(initialState)
  const [ errorMessage, setErrorMessage ] = useState('')

  const handleSubmit = (e, action) => {
    setErrorMessage('Auth is still under construction')
  }

  const setValue = (e) => {
    setAuthDetails({...authDetails, [e.target.name]: e.target.value})
  }

  const handleToggle = (e, module) => {
    setAuthDetails(initialState)
    setErrorMessage('')
    setActiveSection(module)
  }

  return (
    <div id='login'>
      <div className='loginWrapper'>
      {activeSection === 'login' ?
        <div>
          <label>Email</label>
          <input type='text' name="email" value={authDetails['email']} onChange={setValue} />
          <label>Password</label>
          <input type='password' name="password" value={authDetails['password']} onChange={setValue} />
          <button name="login" onClick={handleSubmit}>Login</button>
          {errorMessage && <Message message={errorMessage}/>}
          <div className='alternateOption'
            onClick={e => handleToggle(e, 'create')}>
            Or Create Account
          </div>
          <div className='forgotPwText'
            onClick={e => handleToggle(e, 'pwForgot')}>
            Forgot password?
          </div>
        </div>
        : activeSection === 'create' ?
        <div>
          <label>Username</label>
          <input type='text' name="userName" value={authDetails['userName']} onChange={setValue} />
          <label>Email</label>
          <input type='text' name="email" value={authDetails['email']} onChange={setValue} />
          <label>Password</label>
          <input type='password' name="password" value={authDetails['password']} onChange={setValue} />
          <label>Retype password</label>
          <input type='password' name="passwordCheck" value={authDetails['passwordCheck']} onChange={setValue} />
          <button name="create" onClick={handleSubmit}>Create Account</button>
          {errorMessage && <Message message={errorMessage}/>}
          <div className='alternateOption'
            onClick={e => handleToggle(e, 'login')}>
            Or Login
          </div>
          <div className='forgotPwText'
            onClick={e => handleToggle(e, 'pwForgot')}>
            Forgot password?
          </div>
        </div>
        :
        <div>
          <label>Email</label>
          <input type='text' name="email" value={authDetails['email']} onChange={setValue} />
          <button name="pwReset" onClick={handleSubmit}>Reset Password</button>
          {errorMessage && <Message message={errorMessage}/>}
          <div className='alternateOption'
            onClick={e => handleToggle(e, 'login')}>
            Or Login
          </div>
        </div>
      }
      </div>
    </div>
  )
}

export default Login