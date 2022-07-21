import {
    CATEGORY_LOADING,
    GET_CATEGORIES,
    ADD_CATEGORY,
    CATEGORY_ERROR
} from "./types";

import axios from "axios";
import {
    TokenConfig
} from './authActions';
import { refactorID } from "../../utils/functions";

// Get Active Categories
export const GetCategories = () => dispatch => {
    dispatch(SetCategoryLoading());
    axios.get('/category/')
        .then(res => {
            if (res.status === 204) {
                dispatch({
                    type: CATEGORY_ERROR,
                    payload: 204
                })
            } else {
                var json = refactorID(res.data);
                dispatch({
                    type: GET_CATEGORIES,
                    payload: json
                })
            }

        }).catch(err => {
            dispatch({
                type: CATEGORY_ERROR,
                payload: err
            })
        })
}

// // Add New Article
// export const addCategory = name => (dispatch, getState) => {
//     dispatch(setArticleLoading());
//     axios.post('/articles/', article, TokenConfig(getState))
//         .then(res => {
//             if (res.status === 201) {
//                 dispatch({
//                     type: ADD_ARTICLE,
//                     payload: res.data
//                 })
//             } else {
//                 dispatch({
//                     type: ARTICLE_ERROR,
//                     payload: res.status
//                 })
//             }
//         }
//         ).catch(err => dispatch({
//             type: ARTICLE_ERROR,
//             payload: err
//         }))
// };

// // Get One Article By Slug
// export const getArticle = slug => dispatch => {
//     dispatch(setArticleLoading());
//     axios.get('/articles/' + slug)
//         .then(res => {
//             var json = refactorID(res.data);
//             dispatch({
//                 type: GET_ARTICLE,
//                 payload: json
//             })
//         }).catch(err => {
//             dispatch({
//                 type: ARTICLE_ERROR,
//                 payload: err
//             })
//         })
// }

// // Update Title, Content... One Article By ID
// export const updateArticle = article => (dispatch, getState) => {
//     dispatch(setArticleLoading());
//     axios.put('/articles/', article, TokenConfig(getState))
//         .then(res =>
//             dispatch({
//                 type: UPDATE_ARTICLE,
//                 payload: article
//             })
//         ).catch(err => dispatch({
//             type: ARTICLE_ERROR,
//             payload: err
//         }))
// }

// // Publish or Change Visibility of Article
// export const changeAuthorArticleStatus = (decision, isPublish = true) => (dispatch, getState) => {
//     dispatch(setArticleLoading());
//     axios.put('/articles/' + isPublish ? 'publish' : 'visibility', isPublish ? {} : decision, TokenConfig(getState))
//         .then(res =>
//             dispatch({
//                 type: UPDATE_ARTICLE,
//                 payload: {
//                     ...res.data,
//                     is_draft: isPublish ? false : res.data.is_draft,
//                     is_visible: !isPublish ? decision : res.data.is_visible,
//                 }
//             })
//         ).catch(err => dispatch({
//             type: ARTICLE_ERROR,
//             payload: err
//         }))
// }

// // Count Article as Read
// export const readArticle = article => dispatch => {
//     try {
//         axios.put('/articles/read', article);
//     }
//     catch (err) {
//         dispatch({
//             type: ARTICLE_ERROR,
//             payload: err
//         })
//     }
// }

// // Delete Article By Id
// export const deleteArticle = id => (dispatch, getState) => {
//     axios.delete('/articles/' + id, TokenConfig(getState)).then(res =>
//         dispatch({
//             type: DELETE_ARTICLE,
//             payload: id
//         })).catch(err => dispatch({
//             type: ARTICLE_ERROR,
//             payload: err
//         }))
// };

export const SetCategoryLoading = () => {
    return {
        type: CATEGORY_LOADING
    };
};