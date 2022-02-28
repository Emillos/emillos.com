import React, {useState, useEffect} from 'react';
import '../styles/footerStyle.less'
import { useLocation } from 'react-router-dom'
import footerData from '../../footerData.json'

const Footer = () => {
  return (
    <div id='footer'>
        <h2 className='footerItem'>
          <a href='https://github.com/Emillos/emillos.com' target='_blank'>
            <img src='https://client-images-emillos.s3.eu-west-1.amazonaws.com/GitHub-64.png'/>
          </a>
        </h2>
        <h2 className='footerItem'></h2>
        <h2 className='footerItem'>
          <a href='https://www.linkedin.com/in/emil-filtenborg-99551699/' target='_blank'>
            <img src='https://cdn-icons-png.flaticon.com/512/174/174857.png'/>
          </a>
        </h2>
    </div>
  )
}

export default Footer