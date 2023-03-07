import React, {useState} from 'react';
import { useSearchParams } from "react-router-dom";

const components = {
  pwreset: {
    success:"Password successfully reset!\nPlease close this window and return to sign in.",
    error: "Error resetting password!\nPlease close this window and return to sign in."
  },
  create: {
    success:"Account created!\nPlease close this window and return to sign in.",
    error: "Error creating account!\nPlease close this window and try again"
  },
}

const CloseMe = () => {
  const [ searchParams ] = useSearchParams();
  const [ urlParams ] = useState({
    component: searchParams.get('component'),
    success: searchParams.get('success')
  })
  console.log(urlParams)
  return (
    <div id='closeMe'>
      <h2>{urlParams.success === 'true' ? "Success" : "Error"}</h2>
      <div>
        {urlParams.success === 'true' ? 
          <p>{components[urlParams.component].success}</p> 
          : 
          <p>{components[urlParams.component].error}</p> 
        }
      </div>
    </div>
  )
}

export default CloseMe