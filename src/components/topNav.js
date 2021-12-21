import React from 'react';
import { Link } from "react-router-dom";
import '../styles/topnavStyle.less'

const TopNav = () => {
  return (
    <div id='topnav'>
      <Link to='/'>
        <h2 id='logo' className='topHeader'>Emillos.com</h2>
      </Link>
      <h2 className='topHeader'>Testing tech</h2>
      <h2 className='topHeader mail'>Filtenborgweb@gmail.com</h2>
    </div>
  )
}

export default TopNav