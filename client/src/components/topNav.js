import React from 'react';
import { Link } from "react-router-dom";
import '../styles/topnavStyle.less'

const TopNav = () => {
  return (
    <div id='topnav'>
      <Link to='/'>
        <h2 id='logo' className='topHeader'>Emillos.com - Doing tech</h2>
      </Link>
      <h2 className='topHeader'></h2>
    </div>
  )
}

export default TopNav