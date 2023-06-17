import React, {useContext} from 'react';
import AuthAPI from "../services/authAPI";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";

const NavBar = () => {
    const navigate = useNavigate();
    const {isAuthenticated, setIsAuthenticated}  = useContext(AuthContext);
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast.info('Vous étes déconnecter 🦄 !');
        navigate("/login");
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">SymReact</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/customers" className="nav-link">Clients</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/invoices" className="nav-link">Factures</Link>
                            </li>
                        </ul>
                        <ul className='navbar-nav ml-auto'>
                            {isAuthenticated ?
                                <li className="nav-item mx-1">
                                    <button className='btn btn-danger rounded-4' onClick={handleLogout}>
                                        Déconnexion
                                    </button>
                                </li> :
                                <>
                                    <li className="nav-item mx-1">
                                        <Link to='/register' className='btn btn-secondary rounded-4'>Inscription</Link>
                                    </li>
                                    <li className="nav-item mx-1">
                                        <Link to='/login' className='btn btn-success rounded-4'>Connexion</Link>
                                    </li>
                                </>
                            }

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;

