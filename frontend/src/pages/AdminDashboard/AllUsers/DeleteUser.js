import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import Loader from "../../../Components/Loader/Loader";
import customFetch from "../../../utils/api";



const DeleteUser = () => {
    const { user } = useSelector(state => state.user);
    const { loading } = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const callDeleteProduct = async () => {
        dispatch({ type: "DELETE_USER_REQUEST" })
        if (user?._id === id) {
            dispatch({ type: "DELETE_USER_FAIL", payload: "You can't delete your own account" })
            return toast.error("You can't delete yourself", toastOptions)
        }
        const res = await customFetch(`/api/v1/admin/user/${id}`, {
            method: "DELETE",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "DELETE_USER_SUCCESS" })
                toast.success(data.message, toastOptions);
                if (user?.role === "admin") {
                    navigate("/admin/Dashboard")
                } else {
                    navigate("/Dashboard")
                }
            } else {
                dispatch({ type: "DELETE_USER_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
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
                    <Modal.Title>Are You Sure You want to Delete this User</Modal.Title>
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

export default DeleteUser;