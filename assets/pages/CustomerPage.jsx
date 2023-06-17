import React, {useEffect, useState} from 'react';
import {Link,useNavigate, useParams} from "react-router-dom";
import Field from "../forms/Field";
import CustomersAPI from "../services/CustomersAPI";
import {toast} from "react-toastify";
import FormLoader from "../components/loaders/formLoader";

const CustomerPage = () => {
    const {id}= useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        lastName:"",
        firstName:"",
        email:"",
        company:""
    });

    const [errors, setErrors] = useState({
        lastName:"",
        firstName:"",
        email:"",
        company:""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    // récupération de customer suivant l'identifiant
    const fetchCustomer = async (id) => {
        try {
            const {firstName,lastName, company, email} =  await CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        }catch (e) {
            console.log(e.response);
            toast.error("Le client n'a pas pus etre charger !")
            navigate("/customers");
        }

    }

    useEffect(() => {
        if (id !== "new"){
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    async function handleSubmit (e) {
       e.preventDefault();
       try {
           if (editing){
               await CustomersAPI.update(id, customer);
               toast.success("Le client viens d'étre modifiée");
           }else {
               await CustomersAPI.create(customer);
               toast.success("Le client viens d'étre créer");

               navigate("/customers");
           }
           setErrors({});
       }catch ({response}) {
           const {violations}= response.data;
           if(violations){
               const apiErrors = {};
               violations.forEach(({propertyPath,message}) => {
                   apiErrors[propertyPath] = message;
               });
               setErrors(apiErrors);
               toast.error("Des erreurs dans votre formulaire ");
           }
       }
    }
    function handleChange({currentTarget}) {
        const name = currentTarget.name;
        const value = currentTarget.value;
        setCustomer({...customer, [name]:value})
    }

    return (
        <>
            { !editing && <h1>Création d'un client </h1> || <h1>Modification du client</h1> }
            {loading && <FormLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field value={customer.lastName} onChange={handleChange} name="lastName" label="Nom de famille" placeholder="Nom de famille de client" error={errors.lastName}/>
                <Field value={customer.firstName} onChange={handleChange} name="firstName" label="Prénom" placeholder="prénom de client" error={errors.firstName}/>
                <Field value={customer.email} onChange={handleChange} name="email" label="Email" placeholder="Email de client" type="email" error={errors.email}/>
                <Field value={customer.company} onChange={handleChange} name="company" label="Entreprise" placeholder="Entreprise de client" error={errors.company}/>

                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-light mx-4">Retour a la liste </Link>
                </div>
            </form>}
        </>
    );
};


export default CustomerPage;
