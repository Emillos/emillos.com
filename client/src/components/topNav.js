import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/topnavStyle.less'

const TopNav = (props) => {
  const [showSignout, setShowSignout] = useState(false)
  const navigate = useNavigate()

  const handleSignout = () => {
    localStorage.removeItem('emillosAccessToken')
    props.setAuth({})
    navigate('/')
  }

  return (
    <div id='topnav'>
      <div className='topHeader'>
        <a href='https://github.com/Emillos/emillos.com' target='_blank'>
          <img src='https://client-images-emillos.s3.eu-west-1.amazonaws.com/GitHub-64.png'/>
        </a>
        <a href='https://www.linkedin.com/in/emil-filtenborg-99551699/' target='_blank'>
          <img src='https://cdn-icons-png.flaticon.com/512/174/174857.png'/>
        </a>
      </div>
      <Link to='/'>
        <h2 className='topHeader textCenter'>Emillos.com</h2>
      </Link>
      {!props.auth.user ?
      <Link to='/signin'>
        <h2 className='topHeader textCenter'>Sign In</h2>
      </Link>
      :
      <div className='topHeader textCenter'
        onMouseEnter={() => setShowSignout(true)}
        onMouseLeave={() => setShowSignout(false)}>
        {!showSignout ?
          <div>
            <p className='lh'>Signed in as</p>
            <p className='lh'>{props.auth.user}</p>
          </div>
          :
          <div>
            <h2 className='signout' onClick={() => handleSignout()}>Sign Out</h2>
          </div>
        }
      </div>
      }
    </div>
  )
}

export default TopNav