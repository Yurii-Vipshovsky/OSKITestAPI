import { useParams } from 'react-router-dom';
import { getCookie } from '../services/CookieService';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../Constants';
import { useNavigate } from 'react-router-dom';

function PassTest(){
    const { value } = useParams();
    const navigate = useNavigate();

    const [testQuestions, setTestQuestions] = useState([]);
    const [testName, setTestName] = useState("");

    useEffect(() => {
        fetchTests()
    })

    async function fetchTests(){
        let token = getCookie('token');
        if(token!=null){
            try{
                await fetch(SERVER_URL+`/GetTest/${value}`,{
                    method:"GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response =>response.json()) 
                .then(res=>{
                    setTestQuestions(res.questions)
                    setTestName(res.testName)
                })                                 
            }
            catch(err){
                console.log(err);
            }   
        }
        
    }

    async function submitAnswer(event){
        event.preventDefault();
        let answersElements = document.querySelectorAll("input");
        let answersList = []
        answersElements.forEach((element) => answersList.push({"questionId":element.id, "answer":element.value }));
        try{
            await fetch(SERVER_URL+`/AnswerTest/${value}`,{
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answersList)
            })
            .then(response => {
                if (response.ok) {
                    navigate('/');                  
                }
            })                                   
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <>
            <div className='p-3 mx-auto w-50'>
                <h1>{testName}</h1>
                <form>
                    {testQuestions.map(question =>
                        <div key={question.id} className="mb-3 form-group">
                            <label for="question">{question.questionText}</label>
                            <input type="text" className="form-control" id={question.id} placeholder="Enter answer"/>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" onClick={submitAnswer}>Submit</button>
                </form>
            </div>
        </>
    )
}

export default PassTest