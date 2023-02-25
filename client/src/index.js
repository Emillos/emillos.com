import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import Auth from './components/auth'

import './styles/generalStyle.less'

ReactDOM.render(
  <BrowserRouter>
    <Auth/>
  </BrowserRouter>,
  document.getElementById('app')
);