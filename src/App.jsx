import React from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Layout, Navigation, Users, Login } from './components/index';

export const apiUrl = 'http://13.92.232.100:81/HelpDesk/api'
export const routeServer = "/HelpDeskRG" // Production
// export const routeServer = "" // Development

const App = () => {

  console.log(routeServer)
  return (
    <div className="bg-gray-200 h-screen">
      <BrowserRouter>
        <Routes>
          <Route exact path={routeServer} element={<Layout />}>
            <Route index element={<Navigation />}></Route>
            <Route exact path={routeServer+"/usuarios"} element={<Users/>}></Route>
          </Route>
          <Route path={routeServer + "/login"}>
            <Route index element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App