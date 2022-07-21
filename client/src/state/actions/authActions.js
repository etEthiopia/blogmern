import axios from 'axios';
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
} from "./types";


// Check token and load user

export const LoadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({
        type: USER_LOADING
    });


    axios.get('/auth/user', TokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch({
                type: AUTH_ERROR,
                payload: err
            })

        })
}

// Setup Config
export const TokenConfig = getState => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }

    }

    // // Get token from localstorage
    const token = getState().auth.token;

    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;


}

// Register User
export const Register = (user) => dispatch => {
    // Auth Loading
    dispatch(SetAuthLoading());
    axios.post('/authors', user)
        .then(res => {
            if (res.status === 201) {
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: res.data
                })
            } else {
                dispatch({
                    type: REGISTER_FAIL,
                    payload: res
                })
            }
        }
        )
        .catch(err => {
            dispatch({
                type: REGISTER_FAIL,
                payload: err
            })
        })

}

// Login User
export const Login = (user) => dispatch => {
    // Auth Loading
    dispatch(SetAuthLoading());
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.post('/auth', user, config)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                })
            } else {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: res
                })
            }
        })
        .catch(err => {
            dispatch({
                type: LOGIN_FAIL,
                payload: err
            })
        })

}

export const SetAuthLoading = () => {
    return {
        type: AUTH_LOADING
    };
};

export const Logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}