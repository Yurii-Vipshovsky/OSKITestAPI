import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../Constants';
import { getCookie } from '../services/CookieService';
import { Link } from "react-router-dom";

function AllTestForUser(){

    const [userTests, setUserTests] = useState([]);

    useEffect(() => {
        fetchTests()
    },[])

    async function fetchTests(){
        let token = getCookie('token');
        if(token!=null){
            try{
                await fetch(SERVER_URL+"/GetAllTestsForCurrentUser",{
                    method:"GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response =>response.json()) 
                .then(res=>{
                    setUserTests(res)
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
                        <th scope="col">Test Name</th>
                        <th scope="col">Score</th>
                        <th scope="col">Pass</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTests.map(test =>
                            <tr key={test.testId}>
                                <td>{test.testName}</td>
                                <td>{test.score}</td>
                                {(!test.isCompleted) && <td><Link to={'/pass-test/'+test.testId}><button type="button" className="btn btn-info">Pass</button></Link></td>}
                                {(test.isCompleted)&& <td>Test Passed</td>}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllTestForUser