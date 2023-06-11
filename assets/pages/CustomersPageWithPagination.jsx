import React, {useEffect, useState} from 'react';
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = () => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then((response) => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            }).catch(error => console.log(error.response));

    }, [currentPage])

    const handleDelete = (id) => {
        // 1 . L'approche optimiste
        const originalCustomers = [...customers];


        setCustomers(customers.filter(customer => customer.id !== id));
        // 2 . L'approche pisimiste
        axios.delete(`http://127.0.0.1:8000/api/customers/${id}`)
            .then((res) => console.log('ok', res))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
    }

    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);


    return (
        <>
            <h1>Listes des clients (Pagination)</h1>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {loading ? (<tr>
                    <td> Chargement ...</td>
                </tr>) :
                    customers.map((customer) => {
                        const {id, firstName, lastName, email, company, invoices, totalAmount} = customer;
                        return <tr key={id}>
                            <td>{id}</td>
                            <td>
                                <a href="#">{firstName} {lastName}</a>
                            </td>
                            <td>{email}</td>
                            <td>{company}</td>
                            <td className="text-center">
                                <span className="badge bg-black">{invoices.length}</span>
                            </td>
                            <td className="text-center">{totalAmount.toLocaleString()} €</td>
                            <td>
                                <button onClick={() => handleDelete(customer.id)}
                                        disabled={invoices.length > 0}
                                        className="btn btn-sm btn-danger rounded-3"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerpage={itemsPerPage}
                length={totalItems}
                setCurrentPage={setCurrentPage}
                setLoading={setLoading}
            />


        </>
    );
};


export default CustomersPageWithPagination;
