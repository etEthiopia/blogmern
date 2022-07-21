import { combineReducers } from "redux";
import authReducer from "./authReducer";
import articleReducer from "./articleReducer";
import categoryReducer from "./categoryReducer";

export default combineReducers({
    auth: authReducer,
    article: articleReducer,
    category: categoryReducer
});
