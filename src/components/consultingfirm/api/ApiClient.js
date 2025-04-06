import axios from 'axios'
//const axios = require('axios');

export const apiClient = axios.create({
    baseURL: 'http://localhost:8083',
    headers: {
        'Content-Type': 'application/json',
    }
}
);

// const axios = require('axios');

// export const apiClient = axios.create({
//   baseURL: 'http://localhost:8083',
// });