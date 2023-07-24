import React, {StrictMode, useState} from "react";
import ReactDom from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';
import {ToastContainer} from "react-toastify";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import ProtectedRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
import cors from 'cors';

const corsOrigin ={
    origin:'https://symreact-765ea167ead9.herokuapp.com', //or whatever port your frontend is using
    credentials:true,
    optionSuccessStatus:200
}
const App = () => {

    AuthAPI.setup();

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    return <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <Router>
            <NavBar/>

            <main className="container pt-5">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path="/customers" element={<ProtectedRoute><CustomersPage/></ProtectedRoute>}/>
                    <Route path="/customers/:id" element={<ProtectedRoute><CustomerPage/></ProtectedRoute>}/>
                    <Route path="/invoices" element={<ProtectedRoute><InvoicesPage/></ProtectedRoute>}/>
                    <Route path="/invoices/:id" element={<ProtectedRoute><InvoicePage/></ProtectedRoute>}/>

                </Routes>
            </main>
        </Router>
        <ToastContainer position="bottom-left"/>

    </AuthContext.Provider>
        ;
};

const rootElement = document.getElementById('app');
const root = ReactDom.createRoot(rootElement);
root.render(<StrictMode><App/></StrictMode>);

App.use(cors(corsOrigin));


