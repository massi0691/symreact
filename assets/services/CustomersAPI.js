import axios from "axios"


const findAll = () => {
    return  axios.get("http://127.0.0.1:8000/api/customers").then((response) => {
        return response.data["hydra:member"];
    });
};


const deleteCustomer = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/customers/${id}`)
        .then((res)=> res.data["hydra:member"])

}

export default {
    findAll,
    delete: deleteCustomer
}
