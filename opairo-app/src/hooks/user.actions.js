import axios from 'axios';
import axiosService from "../helpers/axios";
import { useNavigate } from 'react-router-dom';

function useUserActions() {
    const navigate = useNavigate();
    const baseURL = 'http://localhost:8000/';

    return {
        login,
        register,
        logout,
        edit,
    };


    //User login function
    function login(data) {
        return axios.post(`${baseURL}auth/login/`, data)
            .then((res) => {
                setUserData(res.data);
                navigate("/");
            })
    }

    // Register the user
    function register(data) {
        return axios.post(`${baseURL}/auth/register/`, data)
        .then((res) => {
        // Registering the account and tokens in the store
        setUserData(res.data);
        navigate("/");
        });
    }

    //User registration function
    function logout(data) {
        localStorage.removeItem("auth");
        navigate("/login/");
    }

    // Edit user profile
    function edit(data, public_id) {
        return axiosService.patch(`${baseURL}account/${public_id}/`, data,
            {headers: {
                "Content-Type": "multipart/form-data",
                }
            }
        )
        .then((res) => {
        //update the user data in local storage
            localStorage.setItem("auth", JSON.stringify({
            access: getAccessToken(),
            refresh: getRefreshToken(),
            user: res.data,
            }));
        });
    } 
}
// Get the user
function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth")) || null;
    if (auth) {
    return auth.user;
    } else {
    return null;
    }
}

// Get access token
function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.access;
}

// Get refresh token
function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.refresh;
}

// Set user data in local storage
function setUserData(data) {
    localStorage.setItem("auth", JSON.stringify({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
    }));
}


export {
    useUserActions,
    getUser,
    getAccessToken,
    getRefreshToken,
    setUserData,
};