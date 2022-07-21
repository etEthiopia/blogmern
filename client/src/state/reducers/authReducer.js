// import { toast } from "react-toastify";

import { toast } from "react-toastify";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    AUTH_LOADING,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS
} from "../actions/types";

const initialState = {
    token: localStorage.getItem('blogtoken'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case AUTH_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('blogtoken', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case LOGIN_FAIL:
            localStorage.removeItem('blogtoken');
            toast.error("Error");
            console.log(action.payload)
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case AUTH_ERROR:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            // toast.error("Error");
            //localStorage.removeItem('blogtoken');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        default:
            return state;

    }
}

export default authReducer;