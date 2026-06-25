import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5000" // Unga backend server port 5000 la run aana idhu okay!
});

export default API;