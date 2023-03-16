import React, {useState} from 'react';
import { useSearchParams } from "react-router-dom";
import { Alert } from 'antd';

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
  return (
    <div id='closeMe'>
      <Alert
        style={{textAlign:'center'}}
        description={components[urlParams.component][urlParams.success === 'true' ? "success" : "error"]}
        type={urlParams.success === 'true' ? "success" : "error"}
        showIcon/>
    </div>
  )
}

export default CloseMe