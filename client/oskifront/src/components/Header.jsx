import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from "../services/CookieService";
import parseJwt from "../services/JWTParcer";

function Header(){

    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isUserLogined, setIsUserLoggined] = useState(false);

    useEffect(()=>{
        if(getCookie('token')==null){
            setIsUserLoggined(false);
            setIsUserAdmin(false);
        }
        else{
            setIsUserLoggined(true);
            let userData = parseJwt(getCookie('token'));
            if(userData['userRole'] === 'admin'){
                setIsUserAdmin(true);
            }
        }
    },[])

    function handleUserLogout(){
        setIsUserLoggined(false);
        setIsUserAdmin(false);
        setCookie('token', null, -1);
    }
    
    return(
        <div className="d-flex flex-wrap align-items-center 
            justify-content-center py-3 mb-4 border-bottom">
            
            <Link to={'/'} className="d-flex align-items-center 
                col-md-3 mb-2 mb-md-0 
                text-dark text-decoration-none">OSKITests</Link>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li><Link to={'/'} className="nav-link px-2 link-secondary">Home</Link></li>
                { isUserAdmin &&
                    <>
                        <li><Link to={'/all-tests'} className="nav-link px-2 link-dark">All Tests</Link></li>
                        <li><Link to={'/all-users'} className="nav-link px-2 link-dark">All Users</Link></li>
                        <li><Link to={'/create-test'}className="nav-link px-2 link-dark">Create Test</Link></li>
                        <li><Link to={'/assign-user'} className="nav-link px-2 link-dark">Assign Test</Link></li>
                    </>}
            </ul>
            { !isUserLogined &&
            <div class="col-md-3 text-end">
                <Link to={'/login-page'}><button type="button" className="btn btn-outline-primary me-2">Login</button></Link>
                <Link to={'/register-page'}><button type="button" className="btn btn-primary">Sign-up</button></Link>
            </div>}
            { isUserLogined &&
            <div className="col-md-3 text-end">
                <button type="button" className="btn btn-outline-primary me-2" onClick={handleUserLogout}>Logout</button>
            </div>}
        </div>
    );
}


export default Header;
