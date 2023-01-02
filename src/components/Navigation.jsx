import React from 'react'
import {FaUsers, FaTicketAlt, FaCog} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {routeServer} from '../App'

const Module = ({icon, title, link}) => (
    <Link className="bg-gray-100 shadow-md hover:shadow-2xl text-3xl font-bold p-12 w-[90%] sm:w-[10em] sm:p-24 rounded-md flex flex-col gap-2 items-center hover:scale-105 transition-all duration-200" to={routeServer+link}>
        {icon}
        <span>{title}</span>
    </Link>
)

const Navigation = () => {

  const typeUser = localStorage.getItem('typeUser')

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 md:gap-4 h-[80vh] my-6 pb-6">
        <Module icon={<FaTicketAlt />} title={typeUser === 'TECNICO' ? "Tickets" : 'Mis tickets'} link="/tickets"/>
        {typeUser === 'TECNICO' && (
          <>
            <Module icon={<FaUsers />} title="Usuarios" link="/usuarios"/>
            <Module icon={<FaCog />} title="Reportes" link="#"/>
          </>
        )}
    </div>
  )
}

export default Navigation