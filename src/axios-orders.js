import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-f9480.firebaseio.com/'
});

export default instance;