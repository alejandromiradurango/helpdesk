import axios from 'axios';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { apiUrl, config, routeServer } from '../App';
import {Header} from './index'

const Layout = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token){
      navigate(routeServer+'/login')
    }

    axios.get(`${apiUrl}/keepLogged`, config)
      .then(res => {
        const {code} = res.data
        if (code === 0) navigate(routeServer+'/login')
      })
      .catch(err => console.error(err))
      //eslint-disable-next-line
  }, [])

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