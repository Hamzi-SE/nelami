import customFetch from "../utils/api";

export const getData = async (dispatch) => {
    dispatch({ type: "LOAD_DATA_REQUEST" });
    try {
        const res = await customFetch("/api/v1/getData/all", {
            method: "GET",
            "Content-Type": "application/json",
        });
        const data = await res.json();

        if (res.status === 200) {
            dispatch({ type: "LOAD_DATA_SUCCESS", payload: data.data })
        }
        else {
            dispatch({ type: "LOAD_DATA_FAIL", payload: "Data Fetching Failed" })
        }
    } catch (error) {
        dispatch({ type: "LOAD_DATA_FAIL", payload: error })
    }
};
