import React from 'react'
import { FaAngleLeft, FaUserPlus, FaUserEdit } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { routeServer } from '../../App'

const FormUsers = () => {

  const {id} = useParams();

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 bg-gray-200">
        <h1 className="font-bold text-4xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer+"/usuarios"}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {!id ? 'Crear usuario' : 'Editar usuario'} {!id ? <FaUserPlus /> : <FaUserEdit />}</h1>
        
      </div>
    </div>
  )
}

export default FormUsers