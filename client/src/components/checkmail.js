import React from 'react';
import { Link } from "react-router-dom";

const CheckMail = () => {
  return (
    <div id='checkmail'>
      <p>Check your mailbox to complete the signup</p>
      <Link to='/login'>
        <p>Proceed to login</p>
      </Link>
    </div>
  )
}

export default CheckMail