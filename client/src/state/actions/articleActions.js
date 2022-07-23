import {
    GET_ARTICLES,
    GET_TRENDING_ARTICLES,
    ADD_ARTICLE,
    UPLOAD_ARTICLE_PICTURE,
    GET_ARTICLE,
    UPDATE_ARTICLE,
    DELETE_ARTICLE,
    ARTICLES_LOADING,
    ARTICLE_ERROR,
    GET_ARTICLE_COMMENTS,
    POST_ARTICLE_COMMENT,
    SEARCH_ARTICLE_COMMENTS,
    ARTICLE_COMMENT_ERROR
} from "./types";

import axios from "axios";
import {
    TokenConfig
} from './authActions';
import { refactorID } from "../../utils/functions";

// Get Latest Active Articles
export const GetArticles = (page = 1) => dispatch => {
    dispatch(SetArticleLoading());
    axios.get(`/articles/latest/${page}`)
        .then(res => {
            dispatch({
                type: GET_ARTICLES,
                payload: res.data
            })

        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Get Trending Articles
export const GetTrendingArticles = (page = 1, limit = 3) => dispatch => {
    dispatch(SetArticleLoading());
    axios.get(`/articles/trending/${page}/${limit}`)
        .then(res => {
            dispatch({
                type: GET_TRENDING_ARTICLES,
                payload: res.data
            })

        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Get Authors Articles
export const GetMyArticles = (page = 1) => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    axios.get(`/articles/my_articles/${page}`, TokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ARTICLES,
                payload: res.data
            })

        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Get Active Articles By Category
export const GetArticlesByCategory = category => dispatch => {
    dispatch(SetArticleLoading());
    axios.get('/articles/category/' + category)
        .then(res => {
            if (res.status === 204) {
                dispatch({
                    type: GET_ARTICLES,
                    payload: []
                })
            } else {
                var json = refactorID(res.data);
                dispatch({
                    type: GET_ARTICLES,
                    payload: json
                })
            }

        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Get Active Articles By Author
export const GetArticlesByAuthor = author_user_id => dispatch => {
    dispatch(SetArticleLoading());

    axios.get('/articles/author/' + author_user_id)
        .then(res => {
            if (res.status === 204) {
                dispatch({
                    type: GET_ARTICLES,
                    payload: []
                })
            } else {
                var json = refactorID(res.data);
                dispatch({
                    type: GET_ARTICLES,
                    payload: json
                })
            }

        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Upload New Article Picture
export const UploadArticlePicture = picture => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    axios.post('/articles/upload_thumbnail/', picture)
        .then(res => {
            if (res.status === 201) {
                dispatch({
                    type: UPLOAD_ARTICLE_PICTURE,
                    payload: res.data
                })
            } else {
                dispatch({
                    type: ARTICLE_ERROR,
                    payload: res.status
                })
            }
        }
        ).catch(err => dispatch({
            type: ARTICLE_ERROR,
            payload: err
        }))
};

// Add New Article
export const AddArticle = (picture, article) => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    axios.post('/articles/upload_thumbnail/', picture)
        .then(res => {
            if (res.status === 201) {
                axios.post('/articles/', {
                    ...article,
                    category: "Politics",
                    author_full_name: getState().auth.user.full_name,
                    is_draft: false
                }, TokenConfig(getState))
                    .then(res => {
                        if (res.status === 201) {
                            dispatch({
                                type: ADD_ARTICLE,
                                payload: res.data
                            })
                        } else {
                            dispatch({
                                type: ARTICLE_ERROR,
                                payload: res.status
                            })
                        }
                    }
                    ).catch(err => dispatch({
                        type: ARTICLE_ERROR,
                        payload: err
                    }))
            } else {
                dispatch({
                    type: ARTICLE_ERROR,
                    payload: res.status
                })
            }
        }
        ).catch(err => dispatch({
            type: ARTICLE_ERROR,
            payload: err
        }))

};

// Get One Article By Slug
export const GetArticle = (slug, toEdit = false) => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    let query = '/articles/';
    if (toEdit) {
        query += 'author_article/';
    }
    axios.get(query + slug, TokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ARTICLE,
                payload: res.data
            })
        }).catch(err => {
            dispatch({
                type: ARTICLE_ERROR,
                payload: err
            })
        })
}

// Get Comments By Article ID
export const GetArticleComments = (article_id) => (dispatch, getState) => {
    dispatch(SetArticleLoading());


    axios.get(`/comments/${article_id}`)
        .then(res => {
            dispatch({
                type: GET_ARTICLE_COMMENTS,
                payload: res.data
            })
        }).catch(err => {
            dispatch({
                type: ARTICLE_COMMENT_ERROR,
                payload: err
            })
        })
}

// Adds Comment
export const AddArticleComment = commentContents => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    const comment = {
        body: commentContents.body,
        article_id: commentContents.article_id,
    }
    axios.post('/comments/', comment, TokenConfig(getState))
        .then(res =>
            dispatch({
                type: POST_ARTICLE_COMMENT,
                payload: {
                    ...comment,
                    id: res._id,
                    author_user_id: getState().auth.user.user_id,
                    author_full_name: getState().auth.user.full_name,
                    author_profile_pic: getState().auth.user.profile_pic,
                    timestamp: Date.now()
                }
            })
        ).catch(err => dispatch({
            type: ARTICLE_COMMENT_ERROR,
            payload: { type: "post", err: err }
        }))
}


// Adds Comment
export const SerachArticleComments = commentParams => (dispatch, getState) => {
    dispatch(SetArticleLoading());

    axios.get(`/comments/${commentParams.article_id}/${commentParams.text}/`)
        .then(res =>
            dispatch({
                type: SEARCH_ARTICLE_COMMENTS,
                payload: res.data
            })
        ).catch(err => dispatch({
            type: ARTICLE_COMMENT_ERROR,
            payload: { type: "search", err: err }
        }))
}

// Update Title, Content... One Article By ID
export const UpdateArticle = article => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    axios.put('/articles/', article, TokenConfig(getState))
        .then(res =>
            dispatch({
                type: UPDATE_ARTICLE,
                payload: article
            })
        ).catch(err => dispatch({
            type: ARTICLE_ERROR,
            payload: err
        }))
}

// Publish or Change Visibility of Article
export const ChangeArticleStatus = (id, decision) => (dispatch, getState) => {
    dispatch(SetArticleLoading());
    axios.put("articles/visibility/", {
        id: id,
        is_visible: decision === 1 ? true : false
    }, TokenConfig(getState))
        .then(res =>
            dispatch({
                type: UPDATE_ARTICLE,
                payload: {
                    ...res.data,
                    is_visible: decision === 1 ? true : false,
                }
            })
        ).catch(err => dispatch({
            type: ARTICLE_ERROR,
            payload: err
        }))
}

// Count Article as Read
export const ReadArticle = article => dispatch => {
    try {
        axios.put('/articles/read', article);
    }
    catch (err) {
        dispatch({
            type: ARTICLE_ERROR,
            payload: err
        })
    }
}

// Delete Article By Id
export const DeleteArticle = id => (dispatch, getState) => {
    axios.delete('/articles/' + id, TokenConfig(getState)).then(res =>
        dispatch({
            type: DELETE_ARTICLE,
            payload: id
        })).catch(err => dispatch({
            type: ARTICLE_ERROR,
            payload: err
        }))
};

export const SetArticleLoading = () => {
    return {
        type: ARTICLES_LOADING
    };
};