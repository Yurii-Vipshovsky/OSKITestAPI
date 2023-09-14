import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../Constants';
import { getCookie } from '../services/CookieService';

function AllUsers(){
    
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        fetchTests()        
    },[])

    async function fetchTests(){
        let token = getCookie('token');
        if(token!=null){
            try{
                await fetch(SERVER_URL+"/GetAllUsers",{
                    method:"GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response =>response.json()) 
                .then(res=>{
                    setAllUsers(res)
                })                                 
            }
            catch(err){
                console.log(err);
            }   
        }
    }

    return(
        <>
            <div className='p-3 mx-auto w-75'>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Id</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(test =>
                            <tr key={test.id}>
                                <td>{test.id}</td>
                                <td>{test.userName}</td>
                                <td>{test.email}</td>
                                <td>{test.userRole}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllUsers