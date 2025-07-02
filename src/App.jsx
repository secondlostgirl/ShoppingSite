import { useState } from 'react'
import PageContainer from "./container/PageContainer";

import './App.css'
import Header from './components/Header'

import RouterConfig from './config/RouterConfig';
import Loading from './components/Loading';


function App() {
  

  return (
    <div>
  <Loading/>
      <Header/>
      <RouterConfig/>
     
    
    </div>
  )
}

export default App
