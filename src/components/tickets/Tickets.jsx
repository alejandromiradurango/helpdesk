import axios from 'axios';
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { FaUserPlus, FaUser, FaRegCheckCircle, FaAngleLeft, FaSpinner, FaTicketAlt, FaRegClock, FaAngleDown, FaBan, FaPen, FaEye } from 'react-icons/fa'
import {BsFileEarmarkCheckFill, BsFilterRight, BsPaperclip, BsQuestionCircleFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Menu, MenuHandler, MenuList, MenuItem, Button, Input } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';
import { BiFile, BiImage } from 'react-icons/bi';
import {IoMdClose} from 'react-icons/io'
import PrismaZoom from 'react-prismazoom'
import FormSelect from '../form/FormSelect';
import { useForm } from 'react-hook-form';
dayjs.extend(utc);

const ZoomModal = ({status, changeStatus, img}) => {

  const bodyClass = document.body.classList;

  const closeModal = () => {
    bodyClass.remove('overflow-y-hidden');
    changeStatus(!status);
  }
  // eslint-disable-next-line
  useEffect(() => bodyClass.add('overflow-y-hidden'),[])

  return (
    <div className='fixed top-0 left-0 w-screen h-screen z-[99] flex justify-center items-center'>
      <div className='bg-white/60 backdrop-blur-lg h-screen w-screen absolute top-0 left-0 z-[1]' onClick={() => closeModal()}/>
      <IoMdClose className='fixed top-0 right-0 z-[2] text-[48px] cursor-pointer' onClick={() => closeModal()}/>
      <div className='relative z-[2] bg-white shadow-2xl rounded-lg md:max-w-[95vw] md:h-[95vh] overflow-hidden animate-fadeIn'>
        <PrismaZoom>
          <img src={img} alt="" className='md:max-w-[95vw] md:h-[95vh] object-cover' />
        </PrismaZoom>
      </div>
    </div>
  )
}

const Ticket = ({ticket, typeUser, getTickets, technicians = [], status, changeStatus, changeImg}) => {

    const [seeMore, setSeeMore] = useState(false)

    // Parsa las fechas utilizando el formato adecuado
    const formato = 'YYYY-MM-DD HH:mm:ss';
    const date1 = dayjs(ticket.FechaInicio).utc().format(formato);
    const date2 = dayjs(new Date()).format(formato);


    // Función para calcular las horas hábiles entre dos fechas
    function calcularHorasHabiles(fechaInicio, fechaFin) {
        let horasHabiles = 0;
        let current = dayjs(fechaInicio);

        while (current.isBefore(fechaFin)) {
            if (current.day() >= 1 && current.day() <= 5) { // De lunes a viernes
                const horaActual = current.hour();
                if (horaActual >= 6 && horaActual < 17) {
                    horasHabiles++;
                }
            }

            current = current.add(1, 'hour');
        }

        return horasHabiles;
    }

    const horasHabiles = calcularHorasHabiles(date1, date2);

    let Duracion = `${horasHabiles - 1} horas`

    if (horasHabiles === 2) Duracion = `${horasHabiles - 1} hora`

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
          inputOptions: technicians,
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

    const openModal = (url) => {
      changeImg(url)
      changeStatus(!status)
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
                    <Button className='p-0 text-xl bg-transparent shadow-none rounded-full text-blue-500' onClick={() => Swal.fire(`Observación - Ticket #${ticket.Id}`, ticket.Observacion, 'info')}>
                      <BsQuestionCircleFill />
                    </Button>
                )}      
                {ticket.Url && ticket.Estado !== 'CERRADO' && (
                  <Menu>
                    <MenuHandler>
                      <Button className='p-0 text-xl bg-transparent shadow-none rounded-full text-blue-500'>
                        <BsPaperclip />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      {ticket.Url.split(",").map((url, index) => {
                        
                        const type = url.split("/")[4]

                        return (
                        <MenuItem key={index}>
                          {type === 'raw' ? (
                            <a href={url} target="_blank" rel='noreferrer' className='flex items-center gap-2'>
                            <BiFile className='text-blue-500 text-xl'/>
                            Descargar archivo
                            </a>
                          ) : (
                            <button type="button" data-url={url} className='flex items-center gap-2' onClick={() => {
                              openModal(url);
                            }}>
                              <BiImage className='text-blue-500 text-xl'/> Ver imagen
                            </button>
                          )}
                        </MenuItem>
                      )})}
                    </MenuList>
                  </Menu>
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
                <span>Ticket <b>{ticket.Estado}</b>{ticket.Estado === 'PENDIENTE' && ticket.FechaInicio && Duracion && (<><b>:</b> {Duracion}</>)}</span>
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
                  {!ticket.Solucion && ticket.Tecnico !== 'SoporteGeneral' && ticket.Estado !== 'CERRADO' && <MenuItem className='flex items-center gap-2' onClick={() => endTicket(ticket.Id)}><BsFileEarmarkCheckFill className='text-green-500 text-xl'/> Cerrar </MenuItem>}
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
  const [img, setImg] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState(false);
  const [doingFilter, setDoingFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tableSub, setTableSub] = useState([]);

  const user = localStorage.getItem('user');
  const typeUser = localStorage.getItem('typeUser');

  const {register, handleSubmit, watch, formState: {isDirty}, reset} = useForm()

  const getTickets = () => {
    setLoading(true)
    axios.get(apiUrl+ '/tickets', config).then(res => {
      const {data} = res
      let tickets = data.tickets;
      if (typeUser === 'USUARIO'){
        setTickets(tickets.filter(ticket => ticket.Usuario === user && ticket.Estado !== 'CERRADO'));
        setTableTickets(tickets.filter(ticket => ticket.Usuario === user && ticket.Estado !== 'CERRADO'));
      } else {
        setTickets(tickets.filter(ticket => ticket.Estado !== 'CERRADO'));
        setTableTickets(tickets.filter(ticket => ticket.Estado !== 'CERRADO'));
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
    
    axios.get(`${apiUrl}/helpers`, config)
     .then(res => {
        const {data} = res;
        setCategories(data.categories)
        setSubcategories(data.subcategories)
        setTableSub(data.subcategories)
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
        ticket.Prioridad.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Estado.toString().toLowerCase().includes(term.toLowerCase())
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

  let techs = {};
  technicians.filter(tech => tech.Usuario !== 'SoporteGeneral').map(tech => {
    techs[tech.Usuario] = tech.Usuario;
    return null;
  })

  const selectInput = [
      {
          field: 'Tecnico',
          options: technicians && technicians.map(tech => tech.Usuario)
      },
      {
          field: 'Estado',
          options: ["ABIERTO", "PENDIENTE", "CERRADO"]
      },
      {
          field: 'Tipo',
          options: ["INCIDENCIA", "SOLICITUD"]
      },
      {
          field:"Categoria",
          options:categories && categories.map(cat => cat.Categoria)
      },
      {
          field:"Subcategoria",
          options:subcategories && subcategories.map(sub => sub.SubCategoria)
      },
      {
          field: 'Prioridad',
          options: ["BAJA", "MEDIA", "ALTA"]
      }
  ]

  const inputStyle = 'transition-all duration-200 rounded-md border p-2 m-auto w-full md:w-[20em] focus:outline-2 text-sm bg-white border-blue-gray-200 focus:border-blue-500 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:appearance-none'

  const {Categoria} = watch()

  useEffect(() => {
    const results = tableSub?.filter((sub) => sub.Categoria.includes(Categoria));
    setSubcategories(results);
  }, [Categoria, tableSub]);

  const order = ["ABIERTO", "PENDIENTE", "CERRADO"];

  const doFilter = data => {
    setDoingFilter(true);
    data.FechaC = [];
    setTickets([]);
    console.log(data);

    const camposVacios = Object.values(data).every(valor => (
      (Array.isArray(valor) && valor.length === 0) || (typeof valor === 'string' && valor === "")
    ));

    if (camposVacios) {
      // Ejecutar función cuando todos los campos están vacíos
      getTickets();
    } else {
      // Ejecutar función cuando al menos un campo no está vacío
      axios.post(`${apiUrl}/generate-report`, data, config)
        .then(res => {
                const {data} = res;
                setTickets(data.tickets);
                setFilters(false);
                setDoingFilter(false);
        })
    }
    
  }

  return (
    <div className='px-3 relative'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 bg-gray-200 z-2">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {typeUser === 'TECNICO' ? 'Tickets' : 'Mis tickets'} <FaTicketAlt /></h1>
        <div className="flex items-center gap-4">
          {typeUser === "TECNICO" && (
            <Button variant='gradient' color="blue-gray" size='lg' className='p-0 flex items-center px-3' onClick={() => setFilters(prev => !prev)}>
              <span className="p-2 text-white flex items-center gap-2 font-bold text">Filtrar</span> 
              <BsFilterRight className='scale-150' />
            </Button>
          )}
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
      {validation && <h1 className='text-center font-bold text-3xl mt-4'>Sin resultados</h1>}
      {!loading && !validation && tickets && tickets.length === 0 && <h1 className='mt-8 font-bold text-center text-3xl'>No se han encontrado tickets</h1>}
      <ul className='overflow-y-auto h-[76.5vh] 3xl:h-[84vh]'>
        {tickets && tickets.length > 0 && tickets.sort((a, b) => order.indexOf(b.Estado) - order.indexOf(a.Estado)).map(ticket => (
          <Ticket ticket={ticket} typeUser={typeUser} key={ticket.Id} getTickets={getTickets} technicians={techs} status={modal} changeStatus={setModal} changeImg={setImg}/>
        )).reverse()}
      </ul>
      {modal && <ZoomModal status={modal} changeStatus={setModal} img={img}/>}
      {typeUser === "TECNICO" && (
        <>
        <div className={`absolute w-full h-full top-0 ${filters ? 'left-0 rounded-l-none scale-100' : 'left-[100%] rounded-l-full scale-50'} bg-black/25 transition-all duration-200 backdrop-blur-sm`} onClick={() => setFilters(prev => !prev)}/>
        <aside className={`min-w-[100%] md:min-w-[25em] border-l-2 border-gray-400 absolute top-0 ${filters ? 'right-0' : '-right-[100%]'} transition-all duration-200  h-screen md:h-full bg-white shadow-2xl z-2 flex flex-col justify-center items-center`}>
          <IoMdClose className='absolute top-10 right-10 scale-150 cursor-pointer' onClick={() => setFilters(prev => !prev)} />
          <h2 className='font-bold text-xl '>Filtrar tickets</h2>
          <form className='flex flex-col gap-2 items-center justify-center min-w-[80%]' onSubmit={handleSubmit(doFilter)}>
          {selectInput.map((select) => (
              <FormSelect
                key={select.field}
                field={select.field}
                options={select.options}
                register={register}
                label={false}
                className={inputStyle}
              />
          ))}
            <div className="flex justify-center gap-2 items-center">
              {isDirty && (
                <Button color='red' variant='gradient' size='lg' onClick={() => reset()} className="animate-fade-in">
                    Limpiar
                </Button>
              )}
              <Button type='submit' variant='gradient' size='lg' color='blue' className='disabled:cursor-wait' disabled={doingFilter}>
                {doingFilter ? 'Filtrando...' : 'Filtrar'}
              </Button>
            </div>
          </form>
        </aside>
        </>
      )}
    </div>
  )
}

export default Tickets