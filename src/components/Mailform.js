import axios from 'axios';
import React,{useState} from 'react';
import {Container,Card} from 'react-bootstrap'

const Mailform = () => {
    const initialValue = {email:'',name:'',message:'',subject:''};
    const [mailObject,setMailObject] = useState(initialValue)
    const changeText = (e)=>{
        setMailObject({
            ...mailObject,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async(e)=>{
        try {
            e.preventDefault()
            let response = await axios.post('http://localhost:4000/send-mail',mailObject)
            if(response.status == 200) setMailObject(initialValue)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Container>
        <Card>
            <Card.Body>
                <h1 className="large text-primary text-center">Mail</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input type="email" className="form-control" placeholder="Enter your mail" name="email" value={mailObject.email} onChange={changeText} />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" placeholder="Enter your name" name="name" value={mailObject.name} onChange={changeText} />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" placeholder="Please Enter Subject for mail" name="subject" value={mailObject.subject} onChange={changeText} />
                    </div>
                    <div className="form-group mb-3">
                        <textarea className="form-control" placeholder="Message" name="message" value={mailObject.message} onChange={changeText} />
                    </div>
                    <div className="form-group mb-3">
                      <button className="btn btn-primary" type="submit" >Send Message</button>
                    </div>
                  
                </form>
            </Card.Body>
        </Card>

    </Container>
    )
}

export default Mailform
