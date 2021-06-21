import axios from 'axios';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
const Editform = () => {
    const history = useHistory()
    const form = {
        'NAME': '',
        'Address': '',
        'DATE': new Date()
    }
    const [formData, setFormData] = useState(form)
    const onChangeText = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            formData.DATE = new Date(formData.DATE).toLocaleDateString()
            let response = await axios.post('http://localhost:4000/edit-pdf', formData)
            setFormData(form)
            history.push(`/?document=${response.data?.pdfname}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <section className="container">
                <h1 className="large text-primary">Edit form</h1>
                <form className='form' onSubmit={onSubmit}> 
                <div className="form-group">
                        <input type="text" placeholder="Name" name="NAME" value={formData.NAME} onChange={onChangeText} />
                    </div>
                    <div className="form-group" style={{ marginTop: '5px' }}>
                        <textarea type="text" placeholder="Address" name="Address" value={formData.Address} onChange={onChangeText} />
                    </div>
                <div className="form-group">
                        <DatePicker selected={formData.DATE} onChange={(date) => setFormData({ ...formData, DATE: date })} dateFormat="dd/MM/yyyy"  showYearDropdown={true} />
                </div>
                <div className="form-group">
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </div>
                </form> 
             </section>
        </>
    )
}

export default Editform
