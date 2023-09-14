import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../Constants';
import { getCookie } from '../services/CookieService';

function AllTests(){
    
    const [allTests, setAllTests] = useState([]);

    useEffect(() => {
        fetchTests()        
    },[])

    async function fetchTests(){
        let token = getCookie('token');
        if(token!=null){
            try{
                await fetch(SERVER_URL+"/GetAllTests",{
                    method:"GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response =>response.json()) 
                .then(res=>{
                    setAllTests(res)
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
                        <th scope="col">Test Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTests.map(test =>
                            <tr key={test.id}>
                                <td>{test.id}</td>
                                <td>{test.name}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllTests