import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/frontStyle.less'

const Front = () => {
  const [showInfoBar, setShowInfoBar] = useState(true)
  const toggleShow = () => {
    showInfoBar ? setShowInfoBar(false) : setShowInfoBar(true)
  }
  return (
    <div className='main'>
      {showInfoBar ?
        <div id='infoBar'>
          <div className='toggleShow' onClick={() => toggleShow()}>Close</div>
              <div className='infoItem'>Project information</div>
              <div className='infoItem'>- This is collection of small projects made to test out tech</div>
              <div className='infoItem'>- The source code for each project is found in the bottom left</div>
              <div className='infoItem'>- A list of the techs used to create each project is found in the bottom right</div>
          </div> 
        :
        <div className='infoNoShow' onClick={() => toggleShow()}>
          !
        </div>
      }
      <div id='frontWrapper'>
        <div id='front'>
          <Link to='/clickacat' className='frontItem'>
            <img src='https://mirror-bucket-images.s3.eu-west-1.amazonaws.com/kyl.jpg'/> 
            <p className='projectTitle'>Click a cat</p>
          </Link>
        </div>
      </div>
  </div>
  )
}

export default Front