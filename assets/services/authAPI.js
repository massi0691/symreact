import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../js/config";
const authenticate = (credentials) => {
  return axios.post(LOGIN_API,credentials)
        .then(res=>res.data.token)
        .then(token=> {
          // je stocke le token dans locla storage
          window.localStorage.setItem("authToken",token);
          // en previent axios qu'on a maintanant un header par défault sur toutes nos futures requettes http
            setAxiosTokken(token)
        });
}

const isAuthenticated = () => {
    // 1 . voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2 . si le token est encore valide
    if (token){
        const {exp: expiration} = jwtDecode(token);
        if ((expiration * 1000) > (new Date().getTime())){
            return true
        }
        return false;
    }
    return false;
}
const setAxiosTokken = (token) => {
    axios.defaults.headers['Authorization'] = "Bearer "+token;

}
const logout = () => {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
}

const setup = () => {
    // 1 . voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2 . si le token est encore valide
    if (token){
        const {exp: expiration} = jwtDecode(token);
        if ((expiration * 1000) > (new Date().getTime())){
            setAxiosTokken(token);
        }
    }
}

export default {
  authenticate,
    logout,
    setup,
    isAuthenticated
}
