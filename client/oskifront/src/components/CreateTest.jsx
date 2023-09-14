import { useState } from "react";
import { SERVER_URL } from "../Constants";
import { getCookie } from "../services/CookieService";
import { useNavigate } from 'react-router-dom';

function CreateTest(){

    const navigate = useNavigate();

    const [curentId, setCurentId] = useState(1);
    const [inputFields, setInputFields] = useState([{ id: 1, question:'', answer:''}]);

    const addInputField = () => {
        setInputFields([...inputFields, { id: curentId+1, question: '', answer:''}]);
        setCurentId(curentId+1);
    };
    
    const handleQuestionChange = (id, event) => {
        const updatedInputFields = inputFields.map((field) =>
          field.id === id ? { ...field, question: event.target.value } : field
        );
        setInputFields(updatedInputFields);
    };

    const handleAnswerChange = (id, event) => {
        const updatedInputFields = inputFields.map((field) =>
          field.id === id ? { ...field, answer: event.target.value } : field
        );
        setInputFields(updatedInputFields);
    };

    const removeInputField = (id) => {
        const updatedInputFields = inputFields.filter((field) => field.id !== id);
        setInputFields(updatedInputFields);
    };

    async function submitCreation(event){
        event.preventDefault();
        let newTest = {
            name : document.querySelector("#inputTestName").value || "Untiltled",
            questions:[]
        }
        inputFields.forEach((element) => newTest.questions.push({"questionText":element.question, "questionAnswer":element.answer }));
        try{
            await fetch(SERVER_URL+`/CreateTest`,{
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTest)
            })
            .then(response => {
                if (response.ok) {
                    navigate('/all-tests');                  
                }
                else{
                    document.querySelector('.login-register__fail').classList.remove('hidden');  
                }
            })                                   
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div className='p-3 mx-auto w-70'>
                <form>
                    <div className="mb-3 form-group">
                        <label for="inputTestName">Test Name</label>
                        <input type="text" className="form-control" id="inputTestName" placeholder="Enter Test Name"/>
                    </div>
                    {inputFields.map((field) => (
                        <div key={field.id} className="mb-3 form-group row">
                            <div className='col'>
                                <label htmlFor={`inputField${field.id}`}>Question</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={`inputField${field.id}`}
                                    placeholder={`Enter Question`}
                                    value={field.value}
                                    onChange={(e) => handleQuestionChange(field.id, e)}
                                />
                            </div>
                            <div className='col'>
                                <label htmlFor={`inputField${field.id}`}>Answer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={`inputField${field.id}`}
                                    placeholder={`Enter Answer`}
                                    value={field.value}
                                    onChange={(e) => handleAnswerChange(field.id, e)}
                                />
                            </div>
                            <button type="button" className="btn btn-danger col"onClick={() => removeInputField(field.id)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary m-1" onClick={addInputField}>New Question</button>
                    <button type="submit" className="btn btn-primary m-1" onClick={submitCreation}>Submit</button>
                </form>
                <h3 className="login-register__fail hidden">Creation Failed</h3>
            </div>
        </>
    );
}

export default CreateTest;