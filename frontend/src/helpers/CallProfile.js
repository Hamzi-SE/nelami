import customFetch from "../utils/api";

export const callProfile = async (dispatch) => {
    dispatch({ type: "LOAD_USER_REQUEST" });
    try {
        const res = await customFetch("/api/v1/me", {
            method: "GET",
            "Content-Type": "application/json",
        });
        const data = await res.json();

        if (res.status === 200) {
            dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user })
        }
        else {
            dispatch({ type: "LOAD_USER_FAIL", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "LOAD_USER_FAIL", payload: error })
    }
};
