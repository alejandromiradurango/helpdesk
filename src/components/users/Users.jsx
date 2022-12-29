import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUsers, FaUserPlus, FaUser, FaPen, FaCog, FaRegCheckCircle, FaAngleLeft, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';

const Users = () => {

  const [users, setUsers] = useState([]);
  const [tableUsers, setTableUsers] = useState([]);
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true)
    axios.get(apiUrl+ '/users', config).then(res => {
      const {data} = res
      console.log(data)
      setUsers(data.users);
      setTableUsers(data.users);
      // setLoading(false);

    })
  }

  useEffect(() => {
    getUsers();
  }, [])

  const searchUsers = (term) => {
    // eslint-disable-next-line
    const results = tableUsers.filter((user) => {
      if (
        user.Usuario.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Nombre.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Correo.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Tipo.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Estado.toString().toLowerCase().includes(term.toLowerCase())
      ) {
        return user;
      }
    });
  
    setUsers(results);
    if (results.length === 0) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }

  const changeStatus = (id, e) => {
    let icon = e.target;
    if (icon.localName === 'path'){
      icon = icon.parentElement
    }
    axios.post(`${apiUrl}/status-user/${id}`, {}, config)
      .then(res => {
        const {data} = res
        if (data.code === 1){
          if (icon.classList.contains('text-green-500')){
            icon.classList.remove('text-green-500')
            icon.classList.add('text-gray-400')
          } else {
            icon.classList.remove('text-gray-400')
            icon.classList.add('text-green-500')
          }
          // Swal.fire(data.message, '', 'success')
        } else {
          Swal.fire(data.message, '', data.type)
        }
      })
  }

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 bg-gray-200">
        <h1 className="font-bold text-4xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> Usuarios <FaUsers /></h1>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            className="hidden sm:block p-2 w-64 rounded-md border-2 border-gray-500"
            placeholder='Buscar usuario...'
            onChange={(e) => searchUsers(e.target.value)}
          />
          <Link to="crear" className="rounded-md p-2 text-white bg-green-500 flex items-center gap-2 font-bold text-3xl sm:text-2xl"><FaUserPlus /></Link>
        </div>
        <input 
          type="text" 
          className="sm:hidden p-2 w-full rounded-md border-2 border-gray-500 mb-2"
          placeholder='Buscar usuario...'
          onChange={(e) => searchUsers(e.target.value)}
        />
      </div>
      {loading && <div className='text-center font-bold text-3xl mt-4 w-full'><FaSpinner /></div>}
      <ul>
        {users.length > 0 && users.map(user => (
          <li key={user.Id} className="bg-white my-2 p-4 rounded-md flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-bold">{user.Nombre}</h2>
              <h4>{user.Correo}</h4>
            </div>
            <div className="flex items-center gap-4">
              {user.Tipo === 'TECNICO' ? <FaCog className='text-gray-400 text-2xl' title={user.Tipo}/> : <FaUser className='text-gray-400 text-2xl' title={user.Tipo}/>}
              <Link to={`editar/${user.Id}`}><FaPen className='text-blue-600 cursor-pointer text-2xl'/></Link>
              <FaRegCheckCircle onClick={(e) => changeStatus(user.Id, e)} className={`${user.Estado === 'ACTIVO' ? 'text-green-500' : 'text-gray-400'} cursor-pointer text-2xl`}/>
            </div>
          </li>
        ))}
      </ul>
      {validation && <div className='text-center font-bold text-3xl mt-4'>Sin resultados</div>}
      
    </div>
  )
}

export default Users