import axios from 'axios';

const instance = axios.create({
    baseURL:"https://schoenstatt-fathers.link/en/api/v1/"
});

export default instance;