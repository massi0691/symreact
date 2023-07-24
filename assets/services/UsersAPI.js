import axios from "axios";
import {USERS_API} from "../js/config";

function register(user) {
    return axios({
        headers: {
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        url: USERS_API,
        data: user,
        method: 'POST',
        mode:"cors"
    });

}


export default {
    register
}
