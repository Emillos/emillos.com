import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/loginStyle.less'


const initialState = {
  email:'',
  password: '',
  passwordCheck:''
}

const Login = () => {
  const [ activeSection, setActiveSection ] = useState('login');
  const [ authDetails, setAuthDetails ] = useState(initialState)
  const [ errorMessage, setErrorMessage ] = useState('')
  console.log(authDetails)

  const handleSubmit = (e, action) => {
    setErrorMessage('Auth is still under construction')
  }

  const setValue = (e) => {
    console.log('test')
    setAuthDetails({...authDetails, [e.target.name]: e.target.value})
  }

  const handleToggle = () => {
    console.log(activeSection)
    setAuthDetails(initialState)
    setErrorMessage('')
    let toggleValue = activeSection == 'login' ? 'create' : 'login'
    setActiveSection(toggleValue)
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
          {errorMessage &&
            <div className='errorMessage'>
              {errorMessage}
            </div>
          }
          <div className='alternateOption'
            onClick={handleToggle}>
            Or Create Account
          </div>
        </div>
        :
        <div>
          <label>Email</label>
          <input type='text' name="email" value={authDetails['email']} onChange={setValue} />
          <label>Password</label>
          <input type='password' name="password" value={authDetails['password']} onChange={setValue} />
          <label>Retype password</label>
          <input type='password' name="passwordCheck" value={authDetails['passwordCheck']} onChange={setValue} />
          <button name="create" onClick={handleSubmit}>Create Account</button>
          {errorMessage &&
            <div className='errorMessage'>
              {errorMessage}
            </div>
          }
          <div className='alternateOption'
            onClick={handleToggle}>
            Or Login
          </div>
        </div>
      }
      <div className='forgotPwText'>Forgot password?</div>
      </div>
    </div>
  )
}

export default Login