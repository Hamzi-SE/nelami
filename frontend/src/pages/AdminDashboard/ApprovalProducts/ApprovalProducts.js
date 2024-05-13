import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners'

// Icons
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye } from "react-icons/hi"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//BOOSTRAP
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import customFetch from '../../../utils/api'

const ApprovalProducts = () => {

    const { loading } = useSelector(state => state.products);
    const productLoading = useSelector(state => state.product.loading)
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const [approvalProducts, setApprovalProducts] = useState([])
    const [approvalProductsCount, setApprovalProductsCount] = useState(0)
    const [show, setShow] = useState(false)
    const [index, setIndex] = useState(0)
    const [refreshProducts, setRefreshProducts] = useState(false)




    const getApprovalProducts = async () => {
        dispatch({ type: "ADMIN_APPROVAL_PRODUCTS_REQUEST" })
        const res = await customFetch(`/api/v1/approvalProductsAdmin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "ADMIN_APPROVAL_PRODUCTS_SUCCESS", payload: data.approvalProducts })
                setApprovalProducts(data.approvalProducts)
                setApprovalProductsCount(data.approvalProductsCount)
            } else {
                dispatch({ type: "ADMIN_APPROVAL_PRODUCTS_FAIL", payload: data.message })
                toast.error(data.message);
                navigate("/Dashboard");
            }
        } catch (error) {
            dispatch({ type: "ADMIN_APPROVAL_PRODUCTS_FAIL", payload: error })
            console.log(error);
        }
    }



    useEffect(() => {
        getApprovalProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshProducts])


    const handleProductApproval = async (product) => {
        dispatch({ type: "ADMIN_APPROVE_PRODUCT_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/approveProduct/${product._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "ADMIN_APPROVE_PRODUCT_SUCCESS", payload: data.message })
                toast.success(data.message);
                setShow(false)
                setRefreshProducts(!refreshProducts)
            } else {
                dispatch({ type: "ADMIN_APPROVE_PRODUCT_FAIL", payload: data.message })
                toast.error("Something went wrong");
                setShow(false)
            }

        } catch (error) {
            toast.error(error);
        }

    }





    const openModal = () => {
        return (
            <>
                <Modal show={show} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Approve Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to approve this product?</p>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleProductApproval(approvalProducts[index])}>{productLoading ? <ClipLoader size={20} color="white" /> : "Approve"}</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }



    const handleUpdateClick = (index) => {
        setIndex(index);
        setShow(true)
    }



    const columns = [
        {
            name: "Image",
            selector: (row) => <img src={row.images.featuredImg.url} width={100} alt="productImg" />
        },
        {
            name: "Product Name",
            selector: (row) => row.title
        },
        {
            name: "Category",
            selector: row => row.category
        },
        {
            name: "Sub Category",
            selector: row => row.subCategory
        },
        {
            name: "Price(Rs)",
            selector: row => row.price
        },
        {
            name: "Actions",
            cell: (row, i) => (
                <>


                    <button type="button" data-icon="edit" data-index={i} className="btn btn-sm btn-primary" onClick={() => handleUpdateClick(i)}>
                        <HiOutlinePencilAlt />
                    </button>
                    <button type="button" data-icon="view" data-index={i} className="btn btn-sm btn-primary" onClick={() => window.open('/Product/' + row._id, "_blank")}>
                        <HiOutlineEye />
                    </button>

                    <button type="button" data-icon="delete" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/user/product/delete/${row._id}`)}>
                        <HiOutlineTrash />
                    </button>

                </>
            ),
        },
    ]



    return (
        <>
            {openModal()}
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Approval Products</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <h5 className='text-info'>Total Products For Approval: {approvalProductsCount}</h5>
                            <DataTable
                                columns={columns}
                                data={approvalProducts}
                                pagination={true}
                                striped={true}
                                highlightOnHover={true}
                                progressPending={loading}
                            />

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ApprovalProducts