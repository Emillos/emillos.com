import React from 'react';
import { Link } from "react-router-dom";
import '../styles/frontStyle.less'

const Front = () => {
return (
    <div className='main'>
      <div id='frontWrapper'>
          <Link to='/clickacat' className='frontItem'>
            <img src='https://mirror-bucket-images.s3.eu-west-1.amazonaws.com/kyl.jpg'/> 
            <p className='projectTitle'>Click a cat</p>
          </Link>
      </div>
    </div>
  )
}

export default Front