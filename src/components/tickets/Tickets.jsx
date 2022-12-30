import axios from 'axios';
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { FaUserPlus, FaUser, FaRegCheckCircle, FaAngleLeft, FaSpinner, FaTicketAlt, FaRegClock, FaAngleDown, FaBan, FaPen } from 'react-icons/fa'
import {FcCancel} from 'react-icons/fc'
import {BsFileEarmarkCheckFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
// eslint-disable-next-line
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';
dayjs.extend(utc)

const Ticket = ({ticket, typeUser, getTickets}) => {

    const [seeMore, setSeeMore] = useState(false)
    const [addSupport, setAddSupport] = useState(false)

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
                    Swal.fire(data.message, data.text, data.type);
                    getTickets();
                })
            
          }
        })
    }

    const addSupportFunction = (id) => {
        Swal.fire({
          title: `Agendar tecnico al ticket #${id}`,
          input: 'select',
          inputOptions: {
            'DanielZora': 'Daniel Zora',
            'HernanRendon': 'Hernan Rendón',
            'AlexanderAlvarez': 'Alexander Alvarez',
            'AlejandroMira': 'Alejandro Mira'
          },
          inputPlaceholder: 'Seleccion un tecnico',
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
                    Swal.fire(data.message, data.text, data.type)
                    getTickets();
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
                        Swal.fire(data.message, data.text, data.type)
                        getTickets();
                        setSeeMore(true);
                    })
            }
        });
    }

    return (
        <li className="relative bg-white my-2 pr-4 rounded-md flex items-center justify-between hover:bg-[#fdfdfd] hover:shadow-md transition-all duration-150">
          <div className="px-4 py-2 flex flex-col items-start">
              <div className="flex px-1 items-center gap-2 text-gray-600">
                  <FaTicketAlt />
                  <b>#{ticket.Id} | {ticket.Tipo}</b>
                  <div className="font-bold flex items-center gap-2">
                      <FaRegClock title="Fecha de creación"/>
                      <span title="Fecha de creación">{dayjs(ticket.FechaC).utc().format('DD/MM/YYYY h:mm A')}</span>
                      {ticket.FechaF && (
                      <>
                          -
                          <FaRegCheckCircle title="Fecha de cierre"/>
                          <span title="Fecha de cierre">{dayjs(ticket.FechaF).utc().format('DD/MM/YYYY h:mm A')}</span>      
                      </>
                      )}            
                  </div>
              </div>
              <h2 className="font-bold text-xl">{ticket.Titulo}</h2>
              {typeUser === 'TECNICO' && (
                  <div className="flex items-center gap-2 opacity-50 font-bold">
                      <FaUser />
                      <span>{ticket.Usuario}</span>
                  </div>
              )}
              <div className="flex items-center gap-1 opacity-75 cursor-pointer text-lg" onClick={() => setSeeMore(prev => !prev)}>
                  Ver más
                  <FaAngleDown className={`${seeMore && '-rotate-180'} transition-all duration-150`}/>
              </div>
              {seeMore && (
                <div className='px-2 py-1 w-full max-w-[600px]'>
                    <h2 className="font-bold uppercase text-xl mb-2">Descripción</h2>
                    <p>{ticket.Descripcion}</p>
                    {ticket.Solucion && (
                    <>
                        <h2 className="font-bold uppercase text-xl my-2">Solución</h2>
                        <p>{ticket.Solucion}</p>
                    </>
                    )}
                </div>
              )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-[18em]">
                <span>Ticket <b>{ticket.Estado}</b>{ticket.Estado !== 'CERRADO' && Duracion && (<><b>:</b> {Duracion}</>)}</span>
                <span>Tecnico: <b>{ticket.Tecnico}</b></span>

            </div>
            {!addSupport && (
                <div className="flex items-center gap-4 min-w-32 justify-end">
                    {typeUser === 'TECNICO' && (
                        <>
                        {ticket.Tecnico === 'SoporteGeneral' && ticket.Estado !== 'CERRADO' && <FaUserPlus className='text-2xl cursor-pointer' onClick={() => addSupportFunction(ticket.Id)}/>}
                        {!ticket.Solucion && ticket.Tecnico !== 'SoporteGeneral' && <BsFileEarmarkCheckFill className='text-green-500 text-2xl cursor-pointer' onClick={() => endTicket(ticket.Id)}/>}
                        <Link to={`editar/${ticket.Id}`}>
                            <FaPen className='text-blue-500 text-2xl'/>
                        </Link>
                        </>
                    )}
                    {ticket.Estado !== 'CERRADO' && <FaBan className='text-red-600 cursor-pointer text-2xl' onClick={() => cancelTicket(ticket.Id)}/>}
                </div>
            )}
          </div>
        </li>
    )
}

const Tickets = () => {

  const [tickets, setTickets] = useState([]);
  const [tableTickets, setTableTickets] = useState([]);
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
        <h1 className="font-bold text-4xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {typeUser === 'TECNICO' ? 'Tickets' : 'Mis tickets'} <FaTicketAlt /></h1>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            className="hidden sm:block p-2 w-64 rounded-md border-2 border-gray-500"
            placeholder='Buscar ticket...'
            onChange={(e) => searchTickets(e.target.value)}
          />
          <Link to="crear" className="rounded-md p-2 text-white bg-green-500 flex items-center gap-2 font-bold text-3xl sm:text-2xl"><FaUserPlus /></Link>
        </div>
        <input 
          type="text" 
          className="sm:hidden p-2 w-full rounded-md border-2 border-gray-500 mb-2"
          placeholder='Buscar ticket...'
          onChange={(e) => searchTickets(e.target.value)}
        />
      </div>
      {loading && <div className='text-center font-bold text-3xl mt-24 w-full'><FaSpinner className='animate-spin m-auto block'/></div>}
      <ul className='overflow-auto h-[73vh]'>
        {tickets && tickets.length > 0 && tickets.map(ticket => (
          <Ticket ticket={ticket} typeUser={typeUser} key={ticket.Id} getTickets={getTickets}/>
        )).reverse()}
      </ul>
      {validation && <div className='text-center font-bold text-3xl mt-4'>Sin resultados</div>}
      
    </div>
  )
}

export default Tickets