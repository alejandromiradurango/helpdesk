import { Card, Chip, Tooltip, Typography } from '@material-tailwind/react';
import axios from 'axios';
import React from 'react'
import { apiUrl, config } from '../../App';
import * as Swal from 'sweetalert2'
import { FaPen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TableUsers = ({users, showUsers}) => {

  const tableHead = ["Usuario", "Tipo", "Estado", "Acciones"]

  const sortUsers = (a, b) => {
    if (a.Nombre > b.Nombre) {
      return 1;
    }
    if (a.Nombre < b.Nombre) {
      return -1;
    }

    return 0;
  }

  const changeStatus = (id) => {
    axios.post(`${apiUrl}/status-user/${id}`, {}, config)
      .then(res => {
        const {data} = res
        if (data.code === 1){
          Swal.fire(data.message, '', 'success')
          showUsers();
        } else {
          Swal.fire(data.message, '', data.type)
        }
      })
  }

  return (
    <div className='overflow-y-auto h-[85vh] 3xl:h-[90vh]'>
          <Card>
            <table className='w-full min-w-max table-auto text-left'>
              <thead>
                <tr>
                  {tableHead.map(head => (
                    <th className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-left' key={head}>
                      <Typography
                        //variant="small"
                      // color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>  
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 && users.sort(sortUsers).map(({Id_Usuario, Nombre, Correo, Tipo, Estado, Area}, index) => {
                    const isLast = index === users.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={index}>
                      <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                <Tooltip content={`ID: ${Id_Usuario}`} placement="right">
                                  <b>{Nombre}</b>
                                </Tooltip>
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {Correo}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              <b>{Area}</b>
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {Tipo}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={Estado}
                              color={Estado === 'ACTIVO' ? "green" : "blue-gray"}
                              className='cursor-pointer hover:scale-110 transition-all duration-300'
                              onClick={() => changeStatus(Id_Usuario)}
                            />
                          </div>
                        </td>
                        <td className={`${classes} text-center`}>
                          <Tooltip content="Editar Usuario" placement="right">
                            <Link to={`editar/${Id_Usuario}`}><FaPen color='black' className='cursor-pointer text-xl'/></Link>
                          </Tooltip>
                        </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>
  )
}

export default TableUsers