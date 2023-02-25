import React from 'react';
import { Link } from "react-router-dom";

const CheckMailReset = () => {
  return (
    <div id='checkmailReset'>
      <p>Check your mailbox to reset password</p>
      <Link to='/login'>
        <p>Proceed to login</p>
      </Link>
    </div>
  )
}

export default CheckMailReset