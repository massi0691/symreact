import axios from "axios"
import Cache from "./cache";
import {CUSTOMERS_API} from "../js/config";
const findAll = async () => {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) return cachedCustomers;
    return  axios.get(CUSTOMERS_API).then((response) => {

        const customers = response.data["hydra:member"];
        Cache.set("customers", customers);
        return customers;
    });
};

const find = async (id) => {
    const cachedCustomer = await Cache.get("customers."+id);
    if (cachedCustomer) return cachedCustomer;
   return  axios.get(CUSTOMERS_API+"/"+ id).then((res)=>{
       const customer = res.data;
       Cache.set("customers."+id, customer);
       return customer;
   });
}

const update = (id, customer) => {
    return axios.put(CUSTOMERS_API+"/" + id, customer).then(async res=> {
        const cachedCustomers = await Cache.get("customers");
        const cachedCustomer = await Cache.get('customers.'+id);
        if (cachedCustomer){
           Cache.set("customers."+id, res.data);

        }
        if (cachedCustomers){
            const cachedCustomers = await Cache.get("customers");
            const index = cachedCustomers.findIndex(c => c.id === +id);
            cachedCustomers[index]= res.data;
        }
        return res;
    });;

}

const create = (customer) => {
    return axios.post(CUSTOMERS_API,customer).then(async res=> {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers){
            Cache.set("customers", [...cachedCustomers,res.data]);
        }
        return res;
    });

}
const deleteCustomer =  (id) => {

    axios.delete(CUSTOMERS_API+"/"+id)
        .then(async res=> {
            const cachedCustomers = await Cache.get("customers");
            if (cachedCustomers){
                Cache.set("customers", cachedCustomers.filter(c =>c.id !== id))
            }
            return res;
        })

}

export default {
    findAll,
    delete: deleteCustomer,
    find,
    update,
    create
}
