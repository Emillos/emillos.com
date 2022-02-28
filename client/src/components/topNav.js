import React from 'react';
import { Link } from "react-router-dom";
import '../styles/topnavStyle.less'

const TopNav = () => {
  return (
    <div id='topnav'>
      <Link to='/'>
        <h2 className='topHeader textCenter'>Home</h2>
      </Link>
      <h2 className='topHeader'></h2>
      <Link to='/login'>
        <h2 className='topHeader textCenter'>Login</h2>
      </Link>
    </div>
  )
}

export default TopNav