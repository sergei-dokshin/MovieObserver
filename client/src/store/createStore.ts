import { configureStore } from "@reduxjs/toolkit";
import hobbiesReducer from "./hobbies";
import usersReducer from "./users";
import commentsReducer from "./comments";

export function createStore() {
    // при использовании redux-toolkit стандартный middleware подключен по умолчанию - в том числе redux thunk.
    return configureStore({
        reducer: {
            users: usersReducer,
            hobbies: hobbiesReducer,
            comments: commentsReducer
        }
    });
}
