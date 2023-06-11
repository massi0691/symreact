import axios from "axios"


const findAll = () => {
      return axios.get("http://localhost:8000/api/invoices?pagination=false").then((response) => {
        return response.data["hydra:member"];
    });
};


const deleteInvoice = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`)
        .then((res)=> res.data["hydra:member"]);

}

export default {
    findAll,
    delete: deleteInvoice
}
