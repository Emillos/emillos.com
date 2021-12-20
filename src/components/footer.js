import React from 'react';
import '../styles/footerStyle.less'

const Footer = () => {
return (
    <div id='footer'>
      <div id='footerTitle'>
        Made with: 
      </div>
      <div id='footerTechList'>
        <a href='https://reactjs.org/' target='_blank'>
          <img src='https://mirror-bucket-images.s3.eu-west-1.amazonaws.com/pngwing.com.png' alt='ReactJS'/>
        </a>
      </div>
      <div id='footerGithubLink'>
        <a href='https://github.com/Emillos' target='_blank'>
          <img src='https://mirror-bucket-images.s3.eu-west-1.amazonaws.com/GitHub-Mark-32px.png'  alt='Github' />
        </a>       
      </div>
    </div>
  )
}

export default Footer