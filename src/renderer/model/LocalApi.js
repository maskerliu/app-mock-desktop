import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/mw';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


axios.interceptors.response.use(
    resp => {
        if (resp.status === 200) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject('error');
        }
    },
    error => {
        return Promise.reject('error');
    });

export function getIp() {
    return axios({url: '/getIp', method: 'GET'});
}

export function register(uid) {
    return axios({url: '/register', method: 'GET', params: {uid: uid}});
}

export function reset() {
    return axios({url: '/reset', method: 'GET'});
}

export function loadMockConfigs() {
    return axios({url: '/getMockConfigs', method: 'POST'});
}

export function saveMockConfig(config, rules) {
    return axios({
        url: '/saveMockConfig',
        method: 'POST',
        data: {
            config: config,
            rules: rules
        }
    });
}

export function updateMockConfig(configId, status) {
    return axios({url: '/setMockConfig', method: 'POST', data: {configId: configId, status: status}});
}

export function removeMockConfig(configId) {
    return axios({url: '/deleteMockConfig', method: 'POST', data: {configId: configId}});
}


export function loadMockRules(configId) {
    return axios({url: '/getMockRules', method: 'POST', data: {configId: configId}});
}
