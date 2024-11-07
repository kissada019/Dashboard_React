import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    loading: false,
    hasErrors: false,
    posts: [],
};

// https://redux-toolkit.js.org/api/createslice
const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        getPosts: (state) => {
            state.loading = true;
        },
        getPostsSuccess: (state, { payload }) => {
            state.posts = payload;
            state.loading = false;
            state.hasErrors = false;
        },
        getPostsFailure: (state) => {
            state.loading = false;
        },
    },
});

// Actions generated from the slice:
export const { getPosts, getPostsSuccess, getPostsFailure } =
    postsSlice.actions;

// Selector:
export const postsSelector = (state) => state.posts;

// Reducer:
export default postsSlice.reducer;

// Async thunk action:
export function fetchPosts() {
    return async (dispatch) => {
        dispatch(getPosts());

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts"
            );
            const data = await response.json();
            dispatch(getPostsSuccess(data));
        } catch (error) {
            dispatch(getPostsFailure());
        }
    };
}