import axios from "axios";

const api = axios.create({
	baseURL: "https://college-api.vercel.app/api",
});

// intercept the request before it is passed to then / catch
// I obtained this code from the docs here:
// https://axios-http.com/docs/interceptors
// this is a better method because it allows the updating of the auth token

api.interceptors.request.use(function (config) {
	const token = localStorage.getItem("token");
	config.headers.Authorization = token ? `Bearer ${token}` : "";
	return config;
});

export default api;
