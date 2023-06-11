import React, {StrictMode} from "react";
import ReactDom from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './styles/app.css';
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
console.log('hello word');


const App = () => {

    return <Router>
        <NavBar/>
        <main className="container pt-5">

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/customers" element={<CustomersPage/>}/>
                <Route path="/invoices" element={<InvoicesPage/>}/>
            </Routes>

        </main>
    </Router>;
};

const rootElement = document.getElementById('app');
const root = ReactDom.createRoot(rootElement);
root.render(<StrictMode><App/></StrictMode>);


