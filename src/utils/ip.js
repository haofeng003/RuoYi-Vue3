// src/utils/ip.js
import axios from 'axios';

export async function getIpAddress() {
    try {
        const response = await axios.get('https://jsonip.com/');
        console.log(response.data.ip)
        return response.data.ip;


    } catch (error) {
        console.error('Failed to get IP address:', error);
        return null;
    }
}


// https://api.ipify.org?format=json
// https://ipinfo.io/json
// https://jsonip.com/