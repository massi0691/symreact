import React, {useEffect, useState} from 'react';
import Field from "../forms/Field";
import Select from "../forms/Select";
import {Link, useNavigate, useParams} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import {toast} from "react-toastify";
import FormLoader from "../components/loaders/formLoader";

const InvoicePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchCustomers() {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false)
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id})
        } catch (e) {
            toast.error("impossible de charger les clients")
            navigate("/invoices")
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchInvoice = async (id) => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        }catch (e) {
            console.log(e.response);
            toast.error("impossible charger la facture")
            navigate("/invoices");
        }
    }
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }

    }, [id]);



    function handleChange({currentTarget}) {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value})
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!editing){
                await InvoicesAPI.create(invoice);
                toast.success("La facture viens d'etre créer")
            }else {
                await InvoicesAPI.update(id,invoice);
                toast.success("La facture viens d'etre modifiée")

            }

            // to do : flash notification succés
            navigate("/invoices");
            setErrors({});
        } catch ({response}) {
            const violation = response.data;
            toast.error("Des erreurs dans votre formulaire !")
        }
    }

    return (
        <>
        {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            {loading && <FormLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field name="amount" type="number" step="any" placeholder="Montant de la facture" label="Montant"
                       onChange={handleChange} value={invoice.amount} error={errors.amount}/>
                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer}
                        onChange={handleChange}>
                    {customers.map(customer => <option key={customer.id}
                                                       value={customer.id}>
                        {customer.firstName} {customer.lastName}
                    </option>)}
                </Select>
                <Select name="status" label="statut" value={invoice.status} error={errors.status}
                        onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELED">Annulée</option>
                </Select>

                <div className="form-group mt-2">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-light mx-2">Retour aux factures</Link>
                </div>
            </form>}
        </>
    );
};

export default InvoicePage;
