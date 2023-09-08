import { Button, MenuList, Menu, MenuHandler, MenuItem, IconButton, SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction, Typography,} from '@material-tailwind/react'
import React from 'react'
import {GrFormClose} from 'react-icons/gr'
import {FaBan, FaEye, FaPen, FaPlus, FaUserPlus} from 'react-icons/fa'
import { useStateContext } from '../../contexts/ContextApp'
import { BsFileEarmarkCheckFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { apiUrl, config } from '../../App'
import * as Swal from 'sweetalert2'
import axios from 'axios'

const Options = ({id, changeTicket, getTickets, technicians}) => {

  const addSupportFunction = (id) => {
      Swal.fire({
        title: `Agendar tecnico al ticket #${id}`,
        input: 'select',
        inputOptions: technicians.map(tech => tech.Usuario),
        inputPlaceholder: 'Seleccione un tecnico',
        showCancelButton: true,
        confirmButtonColor: '#29c53e',
        cancelButtonColor: '#666666',
        confirmButtonText: 'Asignar',
        cancelButtonText: 'Volver',
        reverseButtons: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value !== '') {
              resolve();
            } else {
              resolve('Por favor seleccion un tecnico');
            }
          });
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          axios.post(`${apiUrl}/tickets/${id}/${result.value}`, {}, config)
              .then(res => {
                  const {data} = res;
                  getTickets();
                  Swal.fire(data.message, data.text, data.type)
              })
        }
      });
  }


  return (
    <div className="absolute bottom-0 right-0">
      <SpeedDial>
        <SpeedDialHandler title="Cerrar">
          <IconButton size="lg" className="rounded-full" onClick={() => changeTicket(null)}>
             <FaPlus className="h-5 w-5 transition-transform group-hover:rotate-45 text-white" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <SpeedDialAction>
            <FaUserPlus className="h-5 w-5" onClick={() => addSupportFunction(id)}/>
            <Typography color="blue-gray" className="text-xs font-normal">
                Añadir tecnico
            </Typography>
          </SpeedDialAction>
          <SpeedDialAction>
           <BsFileEarmarkCheckFill className="h-5 w-5" /> 
           <Typography color="blue-gray" className="text-xs font-normal">
                Cerrar
              </Typography>
          </SpeedDialAction>
          <SpeedDialAction>
            <Link to={`editar/${id}`} className='flex items-center gap-2'>
              <FaPen className='h-5 w-5'/>
            </Link>
           <Typography color="blue-gray" className="text-xs font-normal">
                Editar
            </Typography>
          </SpeedDialAction>
          <SpeedDialAction>
            <FaEye className="h-5 w-5" />
            <Typography color="blue-gray" className="text-xs font-normal">
                Observación
            </Typography>
          </SpeedDialAction>
          <SpeedDialAction>
            <FaBan className="h-5 w-5" />
            <Typography color="blue-gray" className="text-xs font-normal">
                Cancelar
            </Typography>
          </SpeedDialAction>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  )
}

const TicketWindow = ({id, changeTicket, technicians, getTickets}) => {

  const {roleCode} = useStateContext();

  return (
    <>{id && (
        <div className='relative'>
            <div className="flex items-center p-4 justify-between text-2xl ">
                <div className='flex items-center gap-4'>
                  <h1 className="font-bold">
                    Ticket #{id}
                </h1>
                  <Menu>
                <MenuHandler>
                  <Button variant="filled" className='bg-black hover:shadow-gray-400'></Button>
                </MenuHandler>
                <MenuList className='ml-4 md:ml-0'>
                  {roleCode === 'TECNICO' && (
                  <>
                    <MenuItem className='flex items-center gap-2' /*onClick={() => addSupportFunction(ticket?.Id)}*/><FaUserPlus className='text-xl' /> Añadir tecnico</MenuItem>
                    <MenuItem className='flex items-center gap-2' /*onClick={() => endTicket(ticket?.Id)}*/><BsFileEarmarkCheckFill className='text-green-500 text-xl'/> Cerrar </MenuItem>
                    <MenuItem>
                      <Link to={`editar/${id}`} className='flex items-center gap-2'>
                        <FaPen className='text-blue-500 text-xl'/>
                        Editar
                      </Link>
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' /*onClick={() => addObservation(ticket?.Id)}*/><FaEye className='text-blue-gray-700'/> Observación</MenuItem>
                  </>
                  )}
                 <MenuItem className='flex items-center gap-2' /*onClick={() => cancelTicket(ticket?.Id)}*/><FaBan className='text-red-600 text-xl'/> Cancelar</MenuItem>
                </MenuList>
              </Menu>
                </div>
            </div>
            <Options id={id} changeTicket={changeTicket} technicians={technicians} getTickets={getTickets}/>
        </div>
    )}</>
  )
}

export default TicketWindow