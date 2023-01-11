import axios from 'axios';
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { FaUserPlus, FaUser, FaRegCheckCircle, FaAngleLeft, FaSpinner, FaTicketAlt, FaRegClock, FaAngleDown, FaBan, FaPen, FaEye } from 'react-icons/fa'
import {BsFileEarmarkCheckFill, BsQuestionCircleFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Menu, MenuHandler, MenuList, MenuItem, Button, Input, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';
dayjs.extend(utc)

const Ticket = ({ticket, typeUser, getTickets, technicians = []}) => {

    console.log(technicians);

    const [seeMore, setSeeMore] = useState(false)

    const days = dayjs(new Date()).diff(ticket.FechaC, 'days')

    let Duracion = `${days} días`

    if (days === 1) Duracion = `${days} día`

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

    const addSupportFunction = (id) => {
        Swal.fire({
          title: `Agendar tecnico al ticket #${id}`,
          input: 'select',
          inputOptions: technicians.filter(tech => tech.Usuario !== 'SoporteGeneral').map(tech => tech.Usuario),
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

    return (
        <li className="relative bg-white my-2 pr-4 rounded-md flex flex-col md:flex-row md:items-center justify-between hover:bg-[#fdfdfd] hover:shadow-md transition-all duration-150">
          <div className="px-4 py-2 flex flex-col items-start">
              <div className="flex flex-col px-1 lg:flex-row lg:items-center lg:gap-2 text-gray-600">
                  <div className='flex items-center gap-2'>
                    <FaTicketAlt />
                    <b>#{ticket.Id} | {ticket.Tipo}</b>
                  </div>
                  <div className="font-bold flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-2">
                        <FaRegClock title="Fecha de creación"/>
                        <span title="Fecha de creación"><span className='block md:hidden'>Creación: </span>{dayjs(ticket.FechaC).utc().format('DD/MM/YYYY h:mm A')}</span>
                      </div>
                      {ticket.FechaF && (
                      <>
                          <span className='hidden md:block'> - </span>
                          <div className='flex items-center gap-2'>
                            <FaRegCheckCircle title="Fecha de cierre"/>
                            <span title="Fecha de cierre"><span className='block md:hidden'>Cierre: </span>{dayjs(ticket.FechaF).utc().format('DD/MM/YYYY h:mm A')}</span> 
                          </div>     
                      </>
                      )}            
                  </div>
              </div>
              <h2 className="font-bold text-xl border-t-2 border-[#e2e2e2] md:border-t-0 w-full mt-2 pt-2 md:mt-0 md:pt-2 flex items-center gap-2">
                {ticket.Titulo}
                {ticket.Observacion && ticket.Estado !== 'CERRADO' && (
                  <Popover placement='right'>
                    <PopoverHandler>
                      <Button className='p-0 text-xl bg-transparent shadow-none rounded-full text-blue-500'>
                        <BsQuestionCircleFill />
                      </Button>
                    </PopoverHandler>
                    <PopoverContent>
                      <h1 className='py-2 border-b font-bold text-xl uppercase'>Observacion</h1>
                      <p className='p-2 text-md'>{ticket.Observacion}</p>
                    </PopoverContent>
                  </Popover> 
                )}      
              </h2>
              {typeUser === 'TECNICO' && (
                  <div className="flex items-center gap-2 opacity-50 font-bold">
                      <FaUser />
                      <span>{ticket.Usuario}</span>
                  </div>
              )}
              <div className="flex items-center gap-1 opacity-75 cursor-pointer text-xl md:text-lg" onClick={() => setSeeMore(prev => !prev)}>
                  Ver más
                  <FaAngleDown className={`${seeMore && '-rotate-180'} transition-all duration-150`}/>
              </div>
              {seeMore && (
                <div className='px-2 py-1 w-full max-w-[400px] lg:max-w-[600px]'>
                    <h2 className="font-bold uppercase text-lg md:text-xl md:mb-2">Descripción</h2>
                    <p className='text-sm md:text-md'>{ticket.Descripcion}</p>
                    {ticket.Solucion && (
                    <>
                        <h2 className="font-bold uppercase text-lg md:text-xl mt-2 md:my-2">Solución</h2>
                        <p className='text-sm md:text-md'>{ticket.Solucion}</p>
                    </>
                    )}
                </div>
              )}
              
          </div>
          <div className="flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-center lg:gap-8 px-4 pb-4">
            <div className="flex flex-col">
                <span>Ticket <b>{ticket.Estado}</b>{ticket.Estado !== 'CERRADO' && Duracion && (<><b>:</b> {Duracion}</>)}</span>
                <span>Tecnico: <b>{ticket.Tecnico}</b></span>
            </div>
            <Menu>
              <MenuHandler>
                <Button variant="gradient">Acciones</Button>
              </MenuHandler>
              <MenuList className='ml-4 md:ml-0'>
                {typeUser === 'TECNICO' && (
                <>
                  {ticket.Tecnico === 'SoporteGeneral' && ticket.Estado !== 'CERRADO' && <MenuItem className='flex items-center gap-2' onClick={() => addSupportFunction(ticket.Id)}><FaUserPlus className='text-xl' /> Añadir tecnico</MenuItem>}
                  {!ticket.Solucion && ticket.Tecnico !== 'SoporteGeneral' && <MenuItem className='flex items-center gap-2' onClick={() => endTicket(ticket.Id)}><BsFileEarmarkCheckFill className='text-green-500 text-xl'/> Cerrar </MenuItem>}
                  <MenuItem>
                    <Link to={`editar/${ticket.Id}`} className='flex items-center gap-2'>
                      <FaPen className='text-blue-500 text-xl'/>
                      Editar
                    </Link>
                  </MenuItem>
                  {!ticket.Observacion && ticket.Estado !== 'CERRADO' && <MenuItem className='flex items-center gap-2' onClick={() => addObservation(ticket.Id)}><FaEye className='text-blue-gray-700'/> Observación</MenuItem>}
                </>
                )}
                {ticket.Estado !== 'CERRADO' && <MenuItem className='flex items-center gap-2' onClick={() => cancelTicket(ticket.Id)}><FaBan className='text-red-600 text-xl'/> Cancelar</MenuItem>}
              </MenuList>
            </Menu>
          </div>
        </li>
    )
}

const Tickets = () => {

  const [tickets, setTickets] = useState([]);
  const [tableTickets, setTableTickets] = useState([]);
  const [technicians, setTechnicians] = useState([])
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem('user');
  const typeUser = localStorage.getItem('typeUser');

  const getTickets = () => {
    setLoading(true)
    axios.get(apiUrl+ '/tickets', config).then(res => {
      const {data} = res
      let tickets = data.tickets;
      if (typeUser === 'USUARIO'){
        setTickets(tickets.filter(ticket => ticket.Usuario === user));
        setTableTickets(tickets.filter(ticket => ticket.Usuario === user));
      } else {
        setTickets(tickets);
        setTableTickets(tickets);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    getTickets();

    axios.get(`${apiUrl}/users`, config)
       .then(res => {
            const {data} = res;
            setTechnicians(data.users.filter(user => user.Tipo === 'TECNICO'));
       })
    // eslint-disable-next-line
  }, [])

  const searchTickets = (term) => {
    // eslint-disable-next-line
    const results = tableTickets.filter((ticket) => {
      if (
        ticket.Id.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Usuario.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Tecnico.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Titulo.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Prioridad.toString().toLowerCase().includes(term.toLowerCase())
      ) {
        return ticket;
      }
    });
  
    setTickets(results);
    if (results.length === 0) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }

  return (
    <div className='px-3 relative'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 bg-gray-200 z-2">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {typeUser === 'TECNICO' ? 'Tickets' : 'Mis tickets'} <FaTicketAlt /></h1>
        <div className="flex items-center gap-4">
          <div className='hidden sm:block'>
            <Input
              label='Buscar ticket'
              onChange={(e) => searchTickets(e.target.value)}
              className="w-64"
            />
          </div>
          <Button variant='gradient' color="green" size='lg' className='p-0 flex items-center'>
            <Link to="crear" className="p-2 text-white flex items-center gap-2 font-bold text">Crear</Link> 
          </Button>
        </div>
        <div className='block sm:hidden w-full mb-2'>
          <Input
            label='Buscar ticket'
            onChange={(e) => searchTickets(e.target.value)}
            className=""
          />
        </div>
      </div>
      {loading && <div className='text-center font-bold text-3xl mt-24 w-full'><FaSpinner className='animate-spin m-auto block'/></div>}
      <ul className='overflow-auto h-[73vh] 3xl:h-[82vh]'>
        {tickets && tickets.length > 0 && tickets.map(ticket => (
          <Ticket ticket={ticket} typeUser={typeUser} key={ticket.Id} getTickets={getTickets} technicians={technicians}/>
        )).reverse()}
      </ul>
      {validation && <div className='text-center font-bold text-3xl mt-4'>Sin resultados</div>}
      
    </div>
  )
}

export default Tickets