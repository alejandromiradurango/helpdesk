import React from 'react'
import { Link } from 'react-router-dom'
import { routeServer } from '../App'
import {FaUserCog, FaUser} from 'react-icons/fa'
import {BiLogOut} from 'react-icons/bi'

const Header = () => {

  const name = localStorage.getItem('name')
  const typeUser = localStorage.getItem('typeUser')

  return (
    <header className='bg-blue-900 flex justify-between items-center py-4 px-3'>
      <Link to={routeServer} className="text-[1.25em] sm:text-[1.8em] font-bold text-white">HelpDesk</Link>
      <div className='flex items-center gap-4'>
        <p className='text-white hidden sm:flex items-center gap-2 text-lg'>{typeUser === 'TECNICO' ? <FaUserCog /> : <FaUser />}{name}</p>
        <Link to={routeServer+"/login"} className="text-white font-bold bg-red-500 p-2 rounded-md hover:brightness-90 transition-all duration-200" title="Cerrar sesión"><BiLogOut className="text-2xl"/></Link>
      </div>
    </header>
  )
}

export default Header