import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination"
import moment from "moment";
import InvoicesAPI from "../services/InvoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELED: "danger"
}
const STATUS_LABELS =  {
    PAID: "payée",
    SENT: "Envoyée",
    CANCELED: "Annuler"
}
const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchInvoices = async () => {
       try {
           const data = await InvoicesAPI.findAll();
           setInvoices(data);
           setLoading(false);
       }catch (e){
           console.log(e);
       }
    }
    
    useEffect(() => {
        fetchInvoices();
    }, []);

    const formatDate = (str) => {
        return moment(str).format('DD/MM/YYYY');
    }


    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
        }catch (e) {
            setInvoices(originalInvoices);
        }
    }
    const itemsPerPage = 20;

    const filteredInvoices = search.length > 0 ?
        invoices.filter(invoice => invoice.customer.firstName.toLowerCase().includes(search.toLowerCase())
            || invoice.customer.lastName.toLowerCase().includes(search.toLowerCase())
            || invoice.amount.toString().startsWith(search.toLowerCase())
            || STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase()))
        : invoices;



    const paginationInvoices = Pagination.getData(filteredInvoices,currentPage,itemsPerPage);
    
    return (
        <>
            <h1>List des Factures</h1>

            <div className="form-group">
                <input type="text"
                       className="form-control"
                       placeholder="Rechercher..."
                       value={search}
                       onChange={handleSearch}
                />
            </div>


            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className='text-center'>Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                </tr>
                </thead>
                <tbody>
                {
                    loading ? <h4 className='mt-2'> Chargement....</h4>:
                    paginationInvoices.map(invoice=>{
                    const {id,chrono, customer:{firstName, lastName},sentAt, status, amount } = invoice;
                    return <tr key={id}>

                        <td>{chrono}</td>
                        <td>
                            <a href='#'>{firstName} {lastName}</a>
                        </td>
                        <td className="text-center">{formatDate(sentAt)}</td>
                        <td className="text-center">
                            <span className= { `badge bg-${STATUS_CLASSES[status]}` }>{STATUS_LABELS[status]}</span>
                        </td>
                        <td className="text-center">{amount.toLocaleString()} €</td>
                        <td>
                            <button className="btn btn-sm btn-primary mx-1 rounded-3">Editer</button>
                            <button className="btn btn-sm btn-danger rounded-3" onClick={()=>handleDelete(id)}>Supprimer</button>
                        </td>
                    </tr>
                })}

                </tbody>
            </table>

            {
                <Pagination
                currentPage={currentPage}
                length={filteredInvoices.length}
                setCurrentPage={setCurrentPage}
                itemsPerpage={itemsPerPage}
                />
            }
        </>
    );
};

export default InvoicesPage;
