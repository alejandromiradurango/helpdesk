import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUsers, FaUserPlus, FaUser, FaPen, FaCog, FaRegCheckCircle, FaAngleLeft, FaSpinner } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Input
} from "@material-tailwind/react";
 

const Users = () => {

  const [users, setUsers] = useState([]);
  const [tableUsers, setTableUsers] = useState([]);
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true)
    axios.get(apiUrl+ '/users', config).then(res => {
      const {data} = res
      setUsers(data.users);
      setTableUsers(data.users);
      setLoading(false);
    })
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('typeUser') !== 'TECNICO'){
      navigate(routeServer)
    }
    getUsers();
    // eslint-disable-next-line
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

  const changeStatus = (id) => {
    axios.post(`${apiUrl}/status-user/${id}`, {}, config)
      .then(res => {
        const {data} = res
        if (data.code === 1){
          Swal.fire(data.message, '', 'success')
          getUsers();
        } else {
          Swal.fire(data.message, '', data.type)
        }
      })
  }

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 bg-gray-200">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> Usuarios <FaUsers /></h1>
        <div className="flex items-center gap-4">
          {/* <input 
            type="text" 
            className="hidden sm:block p-2 w-64 rounded-md border-2 border-gray-500"
            placeholder='Buscar usuario...'
            onChange={(e) => searchUsers(e.target.value)}
          /> */}
          <div className="hidden sm:block w-64">
            <Input
              label='Buscar usuario'
              onChange={(e) => searchUsers(e.target.value)}
            />
          </div>
          <Button variant="gradient" color='green' size='sm' className='p-0'><Link to="crear" className="flex items-center gap-2 font-bold text-xl sm:text-2xl p-2"><FaUserPlus /></Link></Button>
        </div>
        <div className='block sm:hidden w-full mb-2'>
          <Input
            label='Buscar usuario'
            onChange={(e) => searchUsers(e.target.value)}
          />
        </div>
      </div>
      {loading && <div className='text-center font-bold text-3xl mt-24 w-full'><FaSpinner className='animate-spin m-auto block'/></div>}
      <ul className='h-[72vh] 3xl:h-[82vh] overflow-auto'>
        {users && users.length > 0 && users.map(user => (
          <li key={user.Id} className="bg-white my-2 p-4 rounded-md flex flex-wrap items-center justify-between">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <h2 className="font-bold">{user.Nombre}</h2>
              <h4>{user.Correo}</h4>
            </div>
            {/* <div className="flex items-center gap-4">
              {user.Tipo === 'TECNICO' ? <FaCog className='text-gray-400 text-2xl' title={user.Tipo}/> : <FaUser className='text-gray-400 text-2xl' title={user.Tipo}/>}
              <Link to={`editar/${user.Id}`}><FaPen className='text-blue-600 cursor-pointer text-2xl'/></Link>
              <FaRegCheckCircle onClick={() => changeStatus(user.Id)} className={`${user.Estado === 'ACTIVO' ? 'text-green-500' : 'text-gray-400'} cursor-pointer text-2xl`}/>
            </div> */}
            <div className="w-auto mt-2 sm:mt-0">
              <Menu>
                <MenuHandler>
                  <Button variant="gradient">Acciones</Button>
                </MenuHandler>
                <MenuList className='ml-3 md:ml-0' >
                  <MenuItem>
                    <Link to={`editar/${user.Id}`} className='flex items-center gap-2'><FaPen className='text-blue-600 cursor-pointer text-xl'/>Editar</Link>
                  </MenuItem>
                  <MenuItem className='flex items-center gap-2' onClick={(e) => changeStatus(user.Id, e)}>
                    <FaRegCheckCircle className={`${user.Estado === 'ACTIVO' ? 'text-green-500' : 'text-gray-400'} cursor-pointer text-xl`}/>
                    {user.Estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                  </MenuItem>
                  <MenuItem className='flex items-center gap-2 cursor-default'>
                  {user.Tipo === 'TECNICO' ? <FaCog className='text-gray-400 text-2xl' title={user.Tipo}/> : <FaUser className='text-gray-400 text-2xl' title={user.Tipo}/>}
                  {user.Tipo === 'TECNICO' ? 'Tecnico' : 'Usuario'}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
      {validation && <div className='text-center font-bold text-3xl mt-4'>Sin resultados</div>}
      
    </div>
  )
}

export default Users