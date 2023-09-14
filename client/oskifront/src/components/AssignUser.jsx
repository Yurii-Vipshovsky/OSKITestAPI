import { SERVER_URL } from "../Constants";
import { getCookie } from "../services/CookieService";
import AllTests from "./AllTests";
import AllUsers from "./AllUsers";

function AssignUser(){

    async function submitAssign(event){
        event.preventDefault();
        let testId = document.querySelector("#inputTestId").value;
        let userId = document.querySelector("#inputUserId").value;
        try{
            await fetch(SERVER_URL+`/AssignTest/${testId}&${userId}`,{
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    document.querySelector('.login-register__fail').classList.add('hidden');
                    document.querySelector('.login-register__successful').classList.remove('hidden');     
                }
                else{
                    document.querySelector('.login-register__successful').classList.add('hidden'); 
                    document.querySelector('.login-register__fail').classList.remove('hidden');     
                }
            })                                  
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <>
            <AllTests></AllTests>
            <AllUsers></AllUsers>
            <div className='p-3 mx-auto w-70'>
                <form>
                    <div className="mb-3 form-group">
                        <label for="inputTestName">Test Id</label>
                        <input type="text" className="form-control" id="inputTestId" placeholder="Enter Test ID"/>
                    </div>
                    <div className="mb-3 form-group">
                        <label for="inputTestName">User Id</label>
                        <input type="text" className="form-control" id="inputUserId" placeholder="Enter User ID"/>
                    </div>
                    <button type="submit" className="btn btn-primary m-1" onClick={submitAssign}>Assign</button>                    
                </form>
                <h3 className="login-register__successful hidden">Assign Successful</h3>
                <h3 className="login-register__fail hidden">Assign Failed</h3>
            </div>
        </>
    )
}

export default AssignUser