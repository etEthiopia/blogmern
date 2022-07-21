import { toast } from "react-toastify";

import {
    GET_ARTICLES,
    GET_TRENDING_ARTICLES,
    UPLOAD_ARTICLE_PICTURE,
    ADD_ARTICLE,
    GET_ARTICLE,
    UPDATE_ARTICLE,
    DELETE_ARTICLE,
    ARTICLES_LOADING,
    ARTICLE_ERROR
} from "../actions/types";

const initialState = {
    articles: [],
    trendingArticles: [],
    article: null,
    isLoading: false
};

const articleReducer = (state = initialState, action) => {
    const temp = state.articles;
    switch (action.type) {

        case GET_ARTICLES:
            return {
                ...state,
                articles: action.payload,
                isLoading: false
            };
        case GET_TRENDING_ARTICLES:
            return {
                ...state,
                trendingArticles: action.payload,
                isLoading: false
            };
        case GET_ARTICLE:
            return {
                ...state,
                article: action.payload,
                isLoading: false
            };
        case DELETE_ARTICLE:
            temp.docs = state.articles.docs.filter(item => item._id !== action.payload);
            return {
                ...state,
                articles: temp
            }
        case ADD_ARTICLE:
            toast.success("Article Added")
            window.location = "/portfolio";
            return {
                ...state,
                isLoading: false
            }
        case UPLOAD_ARTICLE_PICTURE:
            return {
                ...state,
                isLoading: false
            }
        case UPDATE_ARTICLE:
            toast.success("Article Updated")
            window.location = "/portfolio";
            return {
                ...state,
                isLoading: false,

            }
        case ARTICLE_ERROR:
            console.log(action.payload);
            toast.error("Error");
            return {
                ...state,
                isLoading: false,
            }
        case ARTICLES_LOADING:
            return {
                ...state,
                isLoading: true
            }
        default:
            return state;
    }
}
export default articleReducer;