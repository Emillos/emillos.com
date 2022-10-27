import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/frontStyle.less'

const Front = () => {
  return (
    <div id='front'>
      <div className='frontItem'>
        <Link to='/clickacat'>
          <div className='frontItemHeader'>Click-A-Cat</div>
        </Link>
      </div>
      <div className='frontItem'>
        <Link to='/shadowrabbit'>
          <div className='frontItemHeader'>a rabbit and its shadow</div>
        </Link>
      </div>
    </div>
  )
}

export default Front