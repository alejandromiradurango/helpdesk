import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { routeServer } from '../App';
import {Header} from './index'

const Layout = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token){
      navigate(routeServer+'/login')
    }
  })

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