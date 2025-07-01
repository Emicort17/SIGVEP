import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const AxiosClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

const AxiosFormClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

AxiosClient.interceptors.request.use((request) => {
    request.headers["Accept"] = "application/json";
    request.headers["Content-Type"] = "application/json";

    const session = JSON.parse(localStorage.getItem("user")) || null;
    if (session?.token) {
        request.headers["Authorization"] = `Bearer ${session.token}`;
    }

    return request;
});

AxiosFormClient.interceptors.request.use((request) => {
    request.headers["Accept"] = "application/json";

    const session = JSON.parse(localStorage.getItem("user")) || null;
    if (session?.token) {
        request.headers["Authorization"] = `Bearer ${session.token}`;
    }
    return request;
});

const responseHandler = (res) => Promise.resolve(res.data);
const errorHandler = (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/";
    }
    return Promise.reject(err);
};

AxiosClient.interceptors.response.use(responseHandler, errorHandler);
AxiosFormClient.interceptors.response.use(responseHandler, errorHandler);

export { AxiosClient, AxiosFormClient };
