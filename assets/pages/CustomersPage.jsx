import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // permet de récupérer les customers
    const fetchCustomers = async ()=>{
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false)
        }catch (e) {
            console.log(e.response);
        }
    }
    // au chargement de du composant , on vas chercher mles customers
    useEffect(() => {
        fetchCustomers();
    }, [])

    // gestion de la suppression d'un customer
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
           await CustomersAPI.delete(id);
        }catch (e) {
            setCustomers(originalCustomers);
        }

    }
    // gestion de la recherche
    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const itemsPerPage = 10;
    // filtrage de customers  en fonction de la rechrche

    const filteredCustomers = search.length > 0 ?
        customers.filter(customer => customer.firstName.toLowerCase().includes(search.toLowerCase())
            || customer.lastName.toLowerCase().includes(search.toLowerCase()))
        : customers;

    // pagination des données

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <>
            <h1>Listes des clients</h1>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." value={search}
                       onChange={handleSearch}/>
            </div>
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
                {loading ? <p>Loading...</p> :
                     paginatedCustomers.map((customer) => {
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
                length={filteredCustomers.length}
                setCurrentPage={setCurrentPage}
                setLoading={setLoading}
            />


        </>
    );
};


export default CustomersPage;
