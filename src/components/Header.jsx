import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl, config, routeServer } from '../App'
import {FaUserCog, FaUser} from 'react-icons/fa'
import {BiLogOut} from 'react-icons/bi'
import { Button } from '@material-tailwind/react'
import axios from 'axios'

const Header = () => {

  const name = localStorage.getItem('name')
  const typeUser = localStorage.getItem('typeUser')

  const [sync, setSync] = useState(true)

  useEffect(() => {
    axios.get(`${apiUrl}/keepLogged`, config)
      .then(res => {
        const {code} = res.data
        if (code === 0) setSync(false)
      })
  }, [])
  

  return (
    <header className='bg-blue-900 flex justify-between items-center py-4 px-3'>
      <div className="flex items-center gap-7">
        <Link to={routeServer} className="text-[1.25em] sm:text-[1.8em] font-bold text-white">HelpDesk</Link>
        <span className={`text-white uppercase text-xs relative before:contents-[""] before:absolute before:w-3 before:h-3 before:rounded-full before:right-[105%] before:top-[100%] before:-translate-y-[125%] ${sync ? 'before:bg-green-500' : 'before:bg-red-500'}`}>{sync ? 'Sincronizado' : 'Desincronizado'}</span>
      </div>
      <div className='flex items-center gap-4'>
        <p className='text-white hidden sm:flex items-center gap-2 text-lg'>{typeUser === 'TECNICO' ? <FaUserCog /> : <FaUser />}{name}</p>
        <Button variant='gradient' color='red' size='sm' className='p-0 flex justify-center'>
          <Link to={routeServer+"/login"} className="text-white font-bold w-full p-2" title="Cerrar sesión"><BiLogOut className="text-2xl"/></Link>
        </Button>
      </div>
    </header>
  )
}

export default Header