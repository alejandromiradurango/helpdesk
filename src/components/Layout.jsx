import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header} from './index'

const Layout = () => {
  return (
    <>
      <Header/>
      <div>
        <Outlet />   
      </div>
    </>
  )
}

export default Layout