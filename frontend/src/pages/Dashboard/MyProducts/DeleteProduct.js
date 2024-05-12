import React from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import customFetch from "../../../utils/api";


const DeleteProduct = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { loading } = useSelector(state => state.product);
    const navigate = useNavigate();
    const { id } = useParams();

    const callDeleteProduct = async () => {
        dispatch({ type: "DELETE_PRODUCT_REQUEST" })
        const res = await customFetch(`/api/v1/product/${id}`, {
            method: "DELETE",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: data.message })
                toast.success(data.message, toastOptions);
                if (user?.role === "admin") {
                    navigate("/admin/Dashboard")
                } else {
                    navigate("/Dashboard")
                }
            } else {
                dispatch({ type: "DELETE_PRODUCT_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
            dispatch({ type: "DELETE_PRODUCT_FAIL", payload: error })
            console.log(error);
        }
    }


    const handleDelete = () => {
        callDeleteProduct()
    }

    const handleGoBack = () => {
        if (user?.role === "admin") {
            navigate("/admin/Dashboard")
        } else {
            navigate("/Dashboard")
        }
    };


    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Modal show={true} backdrop="static" keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Are You Sure You want to Delete this Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleGoBack}>Go Back</Button>
                    <Button variant="secondary btn-danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default DeleteProduct