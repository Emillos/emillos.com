import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'antd';
import '../styles/topnavStyle.less'


const TopNav = (props) => {
  const navigate = useNavigate()

  const items = [
    {
      key:'1',
      label: (<div onClick={() => handleSignout()}>Sign out</div>)
    }
  ]

  const handleSignout = () => {
    localStorage.removeItem('emillosAccessToken')
    props.setAuth({})
    navigate('/')
  }

  return (
    <div id='topnav'>
      <Link to='/'>
        <h2 className='topHeader textCenter'>Emillos.com</h2>
      </Link>
      <div className='topHeader'></div>
      {!props.auth.user ?
      <Link to='/signin'>
        <h2 className='topHeader textCenter'>Sign In</h2>
      </Link>
      :
      <div className='topHeader textCenter'>
          <Dropdown menu={{ items }} 
            placement="bottomRight">
            <h2 className='lh'>{props.auth.user.username}</h2>
          </Dropdown>
        
      </div>
      }
    </div>
  )
}

export default TopNav