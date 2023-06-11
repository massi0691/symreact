import React from 'react';

const NavBar = props => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                <div className="container-fluid">
                    <a href="" className="navbar-brand">SymReact</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Clients</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Factures</a>
                            </li>
                        </ul>
                        <ul className='navbar-nav ml-auto'>
                            <li className="nav-item mx-1">
                                <a href="#" className='btn btn-secondary rounded-4'>Inscription</a>
                            </li>
                            <li className="nav-item mx-1">
                                <a href="#" className='btn btn-success rounded-4'>Connexion</a>
                            </li>
                            <li className="nav-item mx-1">
                                <a href="#" className='btn btn-danger rounded-4'>Déconnexion</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;

