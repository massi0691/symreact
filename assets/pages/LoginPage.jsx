import React, {useContext, useState} from 'react';
import AuthAPI from "../services/authAPI";
import {useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Field from "../forms/Field";
import {toast} from "react-toastify";
const LoginPage = () => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        email:"",
        password:""
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();
    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name}= currentTarget;
        setCredentials({...credentials, [name]:value});
    }
    // Gestion de submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           await AuthAPI.authenticate(credentials);
           setError("");
           setIsAuthenticated(true);
           toast.success("vous étes désormer connecter !")
           navigate("/customers");
        }catch (e) {
            setError("Aucun compte ne posséde cette adresse ou alors les informations ne correspond pas");
            toast.error("une erreur est survenu !")
        }
    }

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit} method="post">
                {/*email*/}
                <Field
                    label='Adresse email'
                    name='email'
                    value={credentials.email}
                    id='email'
                    onChange={handleChange}
                    error={error}
                    placeholder='Adresse email de connexion'
                />
                {/*password*/}
                <Field
                    label='Mot de passe'
                    type="password"
                    name='password'
                    value={credentials.password}
                    id='password'
                    onChange={handleChange}
                    error={error}
                    placeholder='Mot de passe de connexion'
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success mt-2 rounded-4">je me connect</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
