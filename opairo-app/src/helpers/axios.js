import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
    getAccessToken,
    getRefreshToken,
    getUser,
} from "../hooks/user.actions";

const axiosService = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});



axiosService.interceptors.request.use((config) => {
    /**
     * Retrieving the access and refresh tokens from the local storage
     */
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err)
);

const refreshAuthLogic = (failedRequest) => {
    axios.post("http://localhost:8000/auth/refresh/", {refresh: getRefreshToken()})
        .then((resp) => {
        const { access } = resp.data;
        localStorage.setItem("auth",JSON.stringify({ access, refresh: getRefreshToken(), user: getUser() }));
        failedRequest.response.config.headers["Authorization"] =
        "Bearer " + access;
        return Promise.resolve();
    })
    .catch(() => {
        localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher(url) {
    return axiosService.get(url).then((res) => res.data);
}

export default axiosService;