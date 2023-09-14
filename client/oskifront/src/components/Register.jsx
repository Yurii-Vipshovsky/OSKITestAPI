import { SERVER_URL } from '../Constants.js';

function Register() {

    async function submitRegister(event){
        event.preventDefault();
        let userName = document.querySelector('#inputName').value;
        let userEmail = document.querySelector('#inputEmail').value;
        let userPassword = document.querySelector('#inputPassword').value;
        const data = new FormData();
        data.append("name", userName);
        data.append("email", userEmail);
        data.append("password", userPassword);
        try{
            await fetch(SERVER_URL+"/Register",{
                method:"POST",
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    document.querySelector('.login-register__fail').classList.remove('hidden');
                }
                else{
                    document.querySelector('.login-register__fail').classList.add('hidden');                    
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
                        <label for="inputName">User name</label>
                        <input type="name" className="form-control" id="inputName" placeholder="Enter user name"/>
                    </div>
                    <div className="mb-3 form-group">
                        <label for="inputEmail">Email address</label>
                        <input type="email" className="form-control" id="inputEmail" placeholder="Enter email"/>
                    </div>
                    <div className="mb-3 form-group">
                        <label for="inputPassword">Password</label>
                        <input type="password" className="form-control" id="inputPassword" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={submitRegister}>Submit</button>
                </form>
                <h3 className="login-register__successful hidden">Register Successful</h3>
                <h3 className="login-register__fail hidden">Register Failed</h3>
            </div>
        </>
    );

}

export default Register