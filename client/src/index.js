import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopNav from './components/topNav'
import Front from './components/front'
import Footer from './components/footer'
import NoShow from './components/noShow'
import Login from './components/login'

import ClickACcat from './projects/clickAcat/index'

import './styles/generalStyle.less'

ReactDOM.render(
  <BrowserRouter>
    <TopNav />
    <Routes>
      <Route path="/" element={<Front />} />
      <Route path='clickacat/' element={<ClickACcat />} />
      <Route path='login/' element={<Login />} />
      <Route path="*" element={<NoShow />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
  document.getElementById('app')
);