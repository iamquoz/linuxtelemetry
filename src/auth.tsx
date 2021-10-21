import axios, { AxiosResponse } from "axios";

function login(u: string, p: string) {
	return axios.post('/auth/login', {username: u, password: p});
}

function logout() {
	return axios.post('/auth/logout');
}

function check() : Promise<AxiosResponse> {
	return axios.get('/auth/login');
}

export {login, logout, check}