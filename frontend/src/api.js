import axios from 'axios';

const API = axios.create({
    // Vercel live-la run aagumbodhu indha link-ah automatic-ah frontend use பண்ணிக்கும்
    baseURL: "https://skilltrack-backend.onrender.com" 
});

export default API;