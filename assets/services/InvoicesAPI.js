import axios from "axios"
import {INVOICES_API} from "../js/config";


const findAll = () => {
      return axios.get(INVOICES_API+"?pagination=false").then((response) => {
        return response.data["hydra:member"];
    });
};


const deleteInvoice = (id) => {
    return axios.delete(`${INVOICES_API}/${id}`)
        .then((res)=> res.data["hydra:member"]);

}
const find = (id) => {
   return  axios.get(INVOICES_API+"/"+id).then(res=>res.data);
}
const update = (id, invoice) => {
   return  axios.put(INVOICES_API+"/"+id, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

const create = (invoice) => {
    return axios.post(INVOICES_API, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

export default {
    findAll,
    delete: deleteInvoice,
    find,
    update,
    create
}
