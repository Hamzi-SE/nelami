import { toast } from "react-toastify";
import customFetch from "../utils/api";

async function PostProduct(dispatch, navigate, featuredImg, imageOne, imageTwo, imageThree, productData) {

    const { title, description, furnished, bedrooms, bathrooms,
        noOfStoreys, constructionState, type, features, make, model,
        year, kmsDriven, fuelType, floorLevel, areaUnit, area, price,
        province, city, category, subCategory, bidTime } = productData;


    dispatch({ type: "NEW_PRODUCT_REQUEST" });
    try {
        const res = await customFetch("/api/v1/product/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title, description, furnished, bedrooms, bathrooms,
                noOfStoreys, constructionState, type, features, make, model,
                year, kmsDriven, fuelType, floorLevel, areaUnit, area, price,
                province, city, category, subCategory, bidTime,
                featuredImg, imageOne, imageTwo, imageThree,
            }),
        });

        const data = await res.json();

        if (res.status === 201) {
            dispatch({ type: "NEW_PRODUCT_SUCCESS", payload: data.product })
            navigate('/', { replace: true });
            toast.success("Product Sent For Approval. You will be notified once it is approved.")
            return;
        } else if (res.status === 400) {
            dispatch({ type: "NEW_PRODUCT_FAIL", payload: data.message })
            toast.error(data.message)
            navigate("/packages", { replace: true });
            return;
        }
        else {
            dispatch({ type: "NEW_PRODUCT_FAIL", payload: data.message })
            toast.error(data.message);
            return;
        }
    } catch (error) {
        dispatch({ type: "NEW_PRODUCT_FAIL", payload: error.response.data.message })
    }
}


export default PostProduct;