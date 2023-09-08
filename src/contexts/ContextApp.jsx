import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextApp = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userName, setUserName] = useState(localStorage.getItem("name") ?? null);
    const [user, setUser] = useState(localStorage.getItem("user") ?? null);
    const [roleCode, setRoleCode] = useState(localStorage.getItem("typeUser") ?? null);

    const getToken = token => {
        setToken(token);
        localStorage.setItem("token", token);
    }

    const getName = name => {
        setUserName(name);
        localStorage.setItem("name", name);
    }

    const getRol = rol => {
        setRoleCode(rol);
        localStorage.setItem("typeUser", rol);
    }

    const getUser = user => {
        setRoleCode(user);
        localStorage.setItem("user", user);
    }

    return (
        <StateContext.Provider
            value={{
                roleCode,
                userName,
                getName,
                getRol,
                token,
                getToken,
                user,
                getUser
            }}
        >
            {children}
        </StateContext.Provider>
    )

}

export const useStateContext = () => useContext(StateContext);