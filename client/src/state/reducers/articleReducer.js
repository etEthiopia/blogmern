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
    ARTICLE_ERROR,
    GET_ARTICLE_COMMENTS,
    POST_ARTICLE_COMMENT,
    SEARCH_ARTICLE_COMMENTS,
    ARTICLE_COMMENT_ERROR
} from "../actions/types";

const initialState = {
    articles: [],
    trendingArticles: [],
    comments: [],
    serachedComments: [],
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
                comments: [],
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
        case GET_ARTICLE_COMMENTS:
            return {
                ...state,
                comments: action.payload,
                isLoading: false
            };
        case SEARCH_ARTICLE_COMMENTS:
            return {
                ...state,
                serachedComments: action.payload,
                isLoading: false
            };
        case POST_ARTICLE_COMMENT:
            return {
                ...state,
                comments: [action.payload].concat(state.comments),
                isLoading: false
            };
        case ARTICLE_COMMENT_ERROR:
            if (action.payload.type === "post") {
                toast.error("Couldn't Post Comment")
            }
            else if (action.payload.type === "search") {
                toast.error("Couldn't Search Comment")
            }
            console.log(action.payload);
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