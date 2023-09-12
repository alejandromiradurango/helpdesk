import {IconButton, SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction, Tooltip} from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import {FaBan, FaEye, FaPen, FaPlus, FaUserPlus, FaWhatsapp} from 'react-icons/fa'
import { useStateContext } from '../../contexts/ContextApp'
import { BsFileEarmarkCheckFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { apiUrl, config } from '../../App'
import * as Swal from 'sweetalert2'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import dayjs from 'dayjs'

const TicketWindow = ({id, changeTicket, technicians, getTickets,status, changeStatus, changeImg}) => {

  // const {roleCode} = useStateContext();

  const [ticket, setTicket] = useState({})
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if(id !== undefined && id !== null){
      axios.get(`${apiUrl}/tickets/${id}`, config)
      .then(res => {
        setTicket(res.data.ticket);
        setLoading(false);
      })
    }
    setLoading(false);
  }, [id])

  const openModal = (url) => {
    changeImg(url)
    changeStatus(!status)
  }

  return (
    <>
    {!loading && id && (
        <div className='overflow-auto h-full'>
            <div className="p-4 h-full">
                <div className="flex flex-col">
                  <small>{ticket.Tipo} | {dayjs(ticket?.FechaC).utc().format('DD MMM h:mm A')} {ticket.FechaF && <span>- {dayjs(ticket?.FechaF).utc().format('DD MMM h:mm A')}</span>}</small>
                  <h1 className='font-bold text-2xl mb-0'>{ticket.Titulo} (#{id})</h1>
                  <small className=''>Usuario: {ticket.Usuario} - Tecnico: {ticket.Tecnico}</small>
                </div>
                <hr className='h-[2px] bg-black my-2'/>
                {/* <h2>Descripcion</h2> */}
                <div className='mb-4'>
                  <h1 className="font-bold text-xl">Descripción</h1>
                  <p className='text-md'>{ticket.Descripcion}</p>
                </div>
                {ticket.Observacion && (
                  <div className='mb-4'>
                    <h1 className='font-bold text-xl'>Observación</h1>
                    <p>{ticket.Observacion}</p>
                  </div>
                )}
                {ticket.Solucion && (
                  <div>
                    <h1 className='font-bold text-xl'>Solución</h1>
                    <p>{ticket.Solucion}</p>
                  </div>
                )}
                {ticket.Url && (
                  <div>
                    <h1 className='font-bold text-xl'>Documentos ({ticket.Url?.split(',').length})</h1>
                    <div className={`grid`} style={{gridTemplateColumns: `repeat(${ticket.Url?.split(',').length}, 1fr)`}}>
                    {ticket.Url?.split(',').map(url => {
                      const type = url.split("/")[4]

                      return (
                        <>
                        {type === 'image' ? (
                          <img src={url} alt="" onClick={() => openModal(url)}/>
                        ) : (
                          <a href={url}>Descargar archivo</a>
                        )}
                        </>
                      )
                    })}
                    </div>
                  </div>
                )}
            </div>
            <Options id={id} changeTicket={changeTicket} technicians={technicians} getTickets={getTickets}/>
        </div>
    )}
    {loading && (
      <div className='px-8 py-4'>
        <Skeleton className='py-3 mb-4'/>
        <Skeleton className='py-3 mb-4'/>
        <Skeleton count={20}/>
      </div>
    )}
    </>
  )
}

const Options = ({id, changeTicket, getTickets, technicians}) => {

  const {roleCode} = useStateContext();

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

  const addObservation = (id) => {
      Swal.fire({
          title: `Añadir observación`,
          text: `Ingresa la observación/seguimiento para el ticket #${id}`,
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Añadir",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          inputValidator: observation => {
              // Si el valor es válido, debes regresar undefined. Si no, una cadena
              if (!observation) {
                  return "Por favor escribe la observacón";
              } else {
                  return undefined;
              }
          }
      })
      .then(result => {
          if (result.isConfirmed) {
              axios.post(`${apiUrl}/add-observation/${id}`, {Observacion: result.value}, config)
                  .then(res => {
                      const {data} = res;
                      getTickets();
                      Swal.fire(data.message, data.text, data.type)
                  })
          }
      });
  }

  const endTicket = (id) => {
      Swal.fire({
          title: `Cerrar ticket #${id}`,
          text: 'Ingresa la solución para dar por cerrado este ticket.',
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Cerrar ticket",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          inputValidator: nombre => {
              // Si el valor es válido, debes regresar undefined. Si no, una cadena
              if (!nombre) {
                  return "Por favor escribe la solución";
              } else {
                  return undefined;
              }
          }
      })
      .then(result => {
          if (result.isConfirmed) {
              axios.post(`${apiUrl}/end-ticket/${id}`, {Solucion: result.value}, config)
                  .then(res => {
                      const {data} = res;
                      getTickets();
                      Swal.fire(data.message, data.text, data.type)
                  })
          }
      });
  }

  const cancelTicket = (id) => {
      Swal.fire({
        title: `¿Seguro que deseas cancelar el ticket #${id}?`,
        text: "Al cancelarlo aseguras que ya no se necesita soporte en lo requerido y se cerrará el ticket.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#666666',
        reverseButtons: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Volver'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post(`${apiUrl}/cancel-ticket/${id}`, {}, config)
              .then(res => {
                  const {data} = res;
                  getTickets();
                  Swal.fire(data.message, data.text, data.type);
              })
          
        }
      })
  }


  return (
    <div className="absolute bottom-0 right-4">
      <SpeedDial>
        <SpeedDialHandler title="Cerrar">
          <IconButton size="lg" className="rounded-full">
             <FaPlus className="h-5 w-5 transition-transform text-white" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <Tooltip content="Cancelar" placement="left">
            <SpeedDialAction>
              <FaBan className="h-5 w-5" onClick={() => cancelTicket(id)}/>
            </SpeedDialAction>
          </Tooltip>
          <Tooltip content="Editar" placement="left">
            <SpeedDialAction className={`${roleCode === 'USUARIO' ? 'hidden' : ''}`}>
              <Link to={`editar/${id}`} className='flex items-center gap-2'>
                <FaPen className='h-5 w-5'/>
              </Link>
            </SpeedDialAction>
          </Tooltip>
          <Tooltip content="Cerrar ticket" placement="left">
            <SpeedDialAction className={`${roleCode === 'USUARIO' ? 'hidden' : ''}`}>
              <BsFileEarmarkCheckFill className="h-5 w-5" onClick={() => endTicket(id)}/> 
            </SpeedDialAction>
          </Tooltip>
          <Tooltip content="Observación" placement="left">
            <SpeedDialAction className={`${roleCode === 'USUARIO' ? 'hidden' : ''}`}>
              <FaEye className="h-5 w-5" onClick={() => addObservation(id)}/>
            </SpeedDialAction>
          </Tooltip>
          <Tooltip content="Añadir tecnico" placement="left">
            <SpeedDialAction className={`${roleCode === 'USUARIO' ? 'hidden' : ''}`}>
              <FaUserPlus className="h-5 w-5" onClick={() => addSupportFunction(id)}/>
            </SpeedDialAction>
          </Tooltip>
          <Tooltip content="Preguntar en WhatsApp" placement="left">
            <a href={`https://wa.me/?phone=573136506508&text=Hola,+Quisiera+saber+más+acerca+del+ticket+${id}`} target='_blank' rel="noreferrer">
            <SpeedDialAction className=''>
                <FaWhatsapp className="h-5 w-5"/>
            </SpeedDialAction>
            </a>
          </Tooltip>
          <Tooltip content="Cerrar ventana" placement="left">
            <SpeedDialAction className=''>
                <FaPlus className="h-5 w-5 rotate-45" onClick={() => changeTicket(null)}/>
            </SpeedDialAction>
          </Tooltip>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  )
}

export default TicketWindow