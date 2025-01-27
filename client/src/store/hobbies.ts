import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../main";
import { hobbiesService } from "../services/hobbiesService";
import { isAxiosError } from "axios";
import { Hobby } from "../types/hobbies.types";

const initialState: HobbiesState = {
    entities: [],
    isLoading: true,
    error: null
};

const hobbiesSlice = createSlice({
    name: "hobbies",
    initialState,
    reducers: {
        hobbiesRequested: (state) => {
            state.isLoading = true;
        },
        hobbiesRecieved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        hobbiesRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

const { actions, reducer: hobbiesReducer } = hobbiesSlice;
export const { hobbiesRecieved, hobbiesRequestFailed, hobbiesRequested } =
    actions;

export function loadHobbiesList() {
    return async (dispatch: AppDispatch) => {
        dispatch(hobbiesRequested());
        try {
            const hobbiesData = await hobbiesService.getHobbies();
            if (hobbiesData) {
                dispatch(hobbiesRecieved(hobbiesData));
            }
        } catch (error) {
            if (isAxiosError(error)) {
                dispatch(hobbiesRequestFailed(error.message));
            } else {
                console.log(
                    "Возникла непредвиденная ошибка при запросе Hobbies: ",
                    error
                );
            }
        }
    };
}

//                            * SELECTORS *
export function getHobbies() {
    return (state: RootState) => state.hobbies.entities;
}

export function getHobbiesLoadingStatus() {
    return (state: RootState) => state.hobbies.isLoading;
}

interface HobbiesState {
    entities: Hobby[];
    isLoading: boolean;
    error: null | string;
}

export default hobbiesReducer;
