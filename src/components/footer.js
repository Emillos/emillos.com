import React, {useState, useEffect} from 'react';
import '../styles/footerStyle.less'
import { useLocation } from 'react-router-dom'
import footerData from '../../footerData.json'

const Footer = () => {
  const [localFooterData, setLocalFooterData] = useState()
  const location = useLocation();
  useEffect(() => {
    setLocalFooterData(footerData[location.pathname])    
  })
  return (
    <div id='footer'>
      <div id='footerTitles'>
        <div id="source">Project source</div> 
        <div id="madeWith">Made with</div>
      </div>
      {localFooterData &&
        <div id='projectDetails'>
          <div id='footerGithubLink'>
            <a href={localFooterData.source.url} target={localFooterData.source.target}>
              <img src={localFooterData.source.image}  alt={localFooterData.source.alt} />
            </a>
          </div>
          <div id='footerTechList'>
            {localFooterData.techList.map(item => {
              return( 
                <a href={item.url} target={item.target}>
                  <img src={item.image} alt={item.alt}/>
                </a>
              )
            })}
          </div>
      </div>
    }
    </div>
  )
}

export default Footer