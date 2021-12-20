import React from 'react';
import { Link } from "react-router-dom";
import '../styles/topnavStyle.less'

const TopNav = () => {
  return (
    <div id='topnav'>
      <Link to='/'>
        <h1>Emillos.com - Testing stuff out</h1>
      </Link>
    </div>
  )
}

export default TopNav