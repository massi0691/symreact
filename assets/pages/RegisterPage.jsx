import React, {useState} from 'react';
import Field from "../forms/Field";
import {Link, useNavigate} from "react-router-dom";
import UsersAPI from "../services/UsersAPI";
import {toast} from "react-toastify";

const RegisterPage = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const navigate = useNavigate();

    function handleChange({currentTarget}) {
        const name = currentTarget.name;
        const value = currentTarget.value;
        setUser({...user, [name]: value})
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation du mdp n'est pas conforme";
            toast.error("Des erreurs dans votre formulaire !")
            setErrors(apiErrors);
            return;
        }

    try {
        await UsersAPI.register(user);
        setErrors({});
        // flash succés
        toast.success("vous etes désormais inscrit, vous pouvez connecter ! ")
        navigate("/login");
    } catch (e) {
        const {violations} = e.response.data;
        if (violations) {
            violations.forEach(violation => {
                apiErrors[violation.propertyPath] = violation.message
            });

            setErrors(apiErrors);
        }
        toast.error("Des erreurs dans votre formulaire !")
    }
}

return (
    <>
        <h1>Inscription de l'utilisateur</h1>
        <form onSubmit={handleSubmit}>
            <Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName}
                   value={user.firstName} onChange={handleChange}/>
            <Field name="lastName" label="Nom" placeholder="Votre nom de famille" error={errors.lastName}
                   value={user.lastName} onChange={handleChange}/>
            <Field name="email" label="Adresse email" placeholder="Votre adresse email" type="email"
                   error={errors.email} value={user.email} onChange={handleChange}/>
            <Field name="password" type="password" label="Mot de passe" placeholder="Votre mot de passe"
                   error={errors.password} value={user.password} onChange={handleChange}/>
            <Field name="passwordConfirm" type="password" label="Confirmation de mot de passe"
                   placeholder="Confirmez Votre Mot de passe" error={errors.passwordConfirm}
                   value={user.passwordConfirm} onChange={handleChange}/>
            <div className="form-group mt-3">
                <button type="submit" className="btn btn-success">Confirmation</button>
                <Link to="/login" className="btn btn-light mx-2">Vous avez déja un compte</Link>
            </div>
        </form>
    </>
);
}
;

export default RegisterPage;
