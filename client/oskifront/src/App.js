import Header from './components/Header.jsx';
import { Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function App() {

    const location = useLocation();
    const userData = location.state?.logined;

    const [reloadHeader, setReloadHeader] = useState(0); //need to reload Header

    useEffect(()=>{
        setReloadHeader(reloadHeader + 1)
    },[userData])

    return (
        <>
            <Header key={reloadHeader}/>
            <Outlet/>
        </>
    );

}

export default App