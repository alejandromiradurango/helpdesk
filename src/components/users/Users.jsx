import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUsers, FaUserPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl, config, routeServer } from '../../App';
import {
  Button,
  Input
} from "@material-tailwind/react";
import TableUsers from './TableUsers';
import LoadingTable from '../LoadingTable';

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
        // user.Usuario.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Nombre.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Correo.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Tipo.toString().toLowerCase().includes(term.toLowerCase()) ||
        user.Estado.toString().toLowerCase().includes(term.toLowerCase()) || 
        user.Area.toString().toLowerCase().includes(term.toLowerCase())
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

  return (
    <div className='px-8 relative overflow-hidden'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"> Usuarios <FaUsers /></h1>
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
      {loading && <LoadingTable />}
      {!loading && (
        <TableUsers users={users} showUsers={getUsers}/>
      )}
      {validation && <div className='text-center font-bold text-3xl mt-4'>Sin resultados</div>}
      
    </div>
  )
}

export default Users