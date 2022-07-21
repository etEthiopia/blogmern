import { toast } from "react-toastify";

import {
    CATEGORY_LOADING,
    GET_CATEGORIES,
    ADD_CATEGORY,
    CATEGORY_ERROR
} from "../actions/types";

const initialState = {
    categories: [
    ],
    isLoading: false
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                isLoading: false
            };
        case CATEGORY_ERROR:
            console.log(action.payload);
            toast.error("Error");
            return {
                ...state,
                isLoading: true,
            }
        case CATEGORY_LOADING:
            return {
                ...state,
                isLoading: true
            }
        default:
            return state;
    }
}
export default categoryReducer;