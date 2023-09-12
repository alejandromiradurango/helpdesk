import { Card, Chip, Typography } from '@material-tailwind/react';
import React from 'react'

const TableTicket = ({tickets, changeId, id}) => {

  const sortTickets = (a, b) => {
    const order = ["ABIERTO", "PENDIENTE", "PENDIENTE POR USUARIO", "PENDIENTE POR PROOVEDOR", "CERRADO"];
    
    return order.indexOf(b.Estado) - order.indexOf(a.Estado)
  }

  const tableHead = ["Ticket", "Estado", "Tipo de solicitud", "Tecnico"]


  return (
    <div className={`overflow-y-auto h-[85vh] 3xl:h-[90vh] ${id ? 'w-0 lg:w-2/5': 'w-full'} transition-all duration-300 pr-2`}>
          <Card>
            <table>
              <thead>
                {tableHead.map(head => (
                  <th className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-left' key={head}>
                    <Typography
                      // variant="small"
                      color="black"
                      className="font-normal leading-none"
                    >
                      <b>{head}</b>
                    </Typography>  
                  </th>
                ))}
              </thead>
              <tbody>
              {tickets && tickets.length > 0 && tickets.sort(sortTickets).map(({Id, Titulo, Usuario, Tecnico, Estado, Tipo}, index) => {
                    const isLast = index === tickets.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={index} onClick={() => changeId(Id)} className={`hover:bg-gray-100 ${id === Id && 'bg-gray-200'} transition-all duration-200 cursor-pointer`}>
                      <td className={classes}>
                          <div className="flex items-center gap-3">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="black"
                                className="font-normal"
                              >
                                  <b> #{Id} {Titulo}</b>
                              </Typography>
                              <Typography
                                variant="small"
                                color="black"
                                className="font-normal"
                              >
                                {Usuario}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                              <Typography
                                  variant="small"
                                  color="black"
                                  className="font-normal"
                                >
                                <b>{Estado}</b>
                              </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={Tipo}
                              color={Tipo === 'INCIDENCIA' ? "red" : "yellow"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="black"
                              className="font-normal"
                            >
                              <b>{Tecnico}</b>
                            </Typography>
                          </div>
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

export default TableTicket