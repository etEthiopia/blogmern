// import {
//     USER_LOADED,
//     USER_LOADING,
//     AUTH_ERROR,
//     AUTH_LOADING,
//     LOGIN_FAIL,
//     LOGOUT_SUCCESS,
//     REGISTER_SUCCESS,
//     REGISTER_FAIL,
//     LOGIN_SUCCESS
// } from "../actions/types";

// const initialState = {
//     token: localStorage.getItem('blogmerntoken'),
//     isAuthenticated: null,
//     isLoading: false,
//     user: null
// }

// export default function (state = initialState, action) {

//     switch (action.type) {
//         case USER_LOADING:
//             return {
//                 ...state,
//                 isLoading: true
//             };
//         case USER_LOADED:

//             return {
//                 ...state,
//                 isAuthenticated: true,
//                 isLoading: false,
//                 user: action.payload
//             };
//         case LOGIN_SUCCESS:
//         case REGISTER_SUCCESS:
//             localStorage.setItem('shopingtoken', action.payload.token)
//             return {
//                 ...state,
//                 ...action.payload,
//                 isAuthenticated: true,
//                 isLoading: false
//             };
//         case AUTH_ERROR:
//         case LOGIN_FAIL:
//         case LOGOUT_SUCCESS:
//         case REGISTER_FAIL:
//             localStorage.removeItem('shopingtoken');
//             return {
//                 ...state,
//                 token: null,
//                 user: null,
//                 isAuthenticated: false,
//                 isLoading: false
//             };
//         default:
//             return state;

//     }
// }