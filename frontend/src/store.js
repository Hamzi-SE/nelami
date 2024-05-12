import { configureStore } from "@reduxjs/toolkit";
import { bidReducer, bidsReducer } from "./reducers/bidReducers";
import { conversationReducer, conversationsReducer, messagesReducer } from "./reducers/conversationReducers";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { dataReducer, featureReducer } from "./reducers/dataReducer";
import { productReducer, productsReducer, singleProductReducer } from "./reducers/productReducers";
import { forgotPasswordReducer, profileReducer, sellerReducer, userReducer } from "./reducers/userReducer"
import { packageReducer, paymentReducer } from "./reducers/packageReducers"

const store = configureStore({
    reducer: {
        //Reducers Come Here
        data: dataReducer,
        feature: featureReducer,
        user: userReducer,
        profile: profileReducer,
        dashboard: dashboardReducer,
        sellerProfile: sellerReducer,
        forgotPassword: forgotPasswordReducer,
        products: productsReducer,
        singleProduct: singleProductReducer,
        product: productReducer,
        bid: bidReducer,
        bids: bidsReducer,
        conversation: conversationReducer,
        messages: messagesReducer,
        conversations: conversationsReducer,
        package: packageReducer,
        payment: paymentReducer
    },
});



export default store;