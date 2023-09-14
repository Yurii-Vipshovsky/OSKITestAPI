import { SERVER_URL } from "../Constants";
import { setCookie } from "../services/CookieService";
import '../styles/login-register.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    async function submitLogin(event){
        event.preventDefault();
        let userEmail = document.querySelector('#inputEmail').value;
        let userPassword = document.querySelector('#inputPassword').value;
        const data = new FormData();
        data.append("email", userEmail);
        data.append("password", userPassword);
        try{
            await fetch(SERVER_URL+"/Login",{
                method:"POST",
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    document.querySelector('.login-register__fail').classList.remove('hidden');
                }
                else{
                    return response.json()
                        .then((result)=> {
                            setCookie('token', result.access_token, 15);
                            navigate('/', { state: { logined:"true" } });
                        });                    
                }
            })                                   
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div className='p-3 mx-auto w-50'>
                <form>
                    <div className="mb-3 form-group">
                        <label for="inputEmail">Email address</label>
                        <input type="email" className="form-control" id="inputEmail" placeholder="Enter email"/>
                    </div>
                    <div className="mb-3 form-group">
                        <label for="inputPassword">Password</label>
                        <input type="password" className="form-control" id="inputPassword" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={submitLogin}>Submit</button>
                </form>
                <h3 className="login-register__fail hidden">Login Failed</h3>
            </div>
        </>
    );

}

export default Login