import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from "axios";

const formSchema = Yup.object().shape({
    name: Yup  
        .string()
        .required("Must include name"),
    email: Yup  
        .string()
        .email("Must be a valid email address")
        .required("Must include email address"),
    password: Yup
        .string()
        .min(6, "Passwords must be at least 6 characters long")
        .required("Passsword is Required"),
    terms: Yup  
        .boolean()
        .oneOf([true], "You must accept Terms and Conditions")
});

const Form = props => {
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [inputValues, setInputValues] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        formSchema.isValid(inputValues).then(valid => {
          setButtonDisabled(!valid);
        });
      }, [inputValues]);

    const validateChange = event => {
        Yup
            .reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [event.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [event.target.name]: err.errors
                })
            })
    }
    const handleChanges = event => {
        event.persist();
        const newFormData = {
            ...inputValues,
            [event.target.name] : 
                event.target.type === "checkbox" ? event.target.checked : event.target.value
        }
        console.log(errors)
        validateChange(event);
        setInputValues(newFormData);
    };

    const submitForm = event => {
        event.preventDefault();
        axios
            .post("https://reqres.in/api/users", inputValues)
            .then(res => {
                setInputValues({
                    name: "",
                    email: "",
                    password: "",
                    terms: ""
                });
      })
      .catch(err => {
        console.log(err.res);
      });
    };

    return (
        <div>
            <form onSubmit={submitForm}>
                <div>
                    <label htmlFor="name">
                        Name:
                    <input 
                        onChange={handleChanges} 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={inputValues.name}
                        />
                        { errors.name.length === 1 && (<div>{errors.name}</div>) }
                    </label>
                </div>
                <div>
                <label htmlFor="email">
                    email:
                </label>
                <input 
                    onChange={handleChanges} 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={inputValues.email}/>
                    { errors.email.length === 1 && (<p>{errors.email}</p>) }
                </div>
                <div>
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input 
                        onChange={handleChanges} 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={inputValues.password}
                        />
                        { errors.password.length === 1 && (<p>{errors.password}</p>) }
                </div>
                <div>
                    <label htmlFor="terms">
                        Terms of Service:
                    </label>
                    <input 
                        onChange={handleChanges} 
                        type="checkbox" 
                        id="terms" 
                        name="terms" 
                        checked={null}
                        value={inputValues.terms}
                        />
                        { errors.terms.length === 1 && (<p>{errors.terms}</p>) }
                </div>
                <div>
                    <button disabled={buttonDisabled} type="submit">
                        Add Member
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Form;