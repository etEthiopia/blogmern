import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

// var store = null;
const middleWare = [thunk];
const initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleWare),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
// try {
//     store = createStore(
//         rootReducer,
//         compose(
//             applyMiddleware(...middleWare)),
//         window.__REDUX_DEVTOOLS_EXTENSION__ &&
//         window.__REDUX_DEVTOOLS_EXTENSION__()
//     );
// } catch (e) {
//     store = createStore(
//         rootReducer,
//         compose(
//             applyMiddleware(...middleWare))
//     );
//}

export default store;
