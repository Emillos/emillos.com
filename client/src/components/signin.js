import React from 'react';
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div id='signinn'>
      <p>Congratulations! Your account has been activated!</p>
      <Link to='/login'>
        <p>Proceed to login</p>
      </Link>
    </div>
  )
}

export default Signin