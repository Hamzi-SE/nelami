import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../../../utils/api';

const WaitingApproval = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [approvalProducts, setApprovalProducts] = useState([])
    const [approvalProductsCount, setApprovalProductsCount] = useState(0)


    const getApprovalProducts = async () => {
        dispatch({ type: "SELLER_APPROVAL_PRODUCTS_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/getApprovalProducts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "SELLER_APPROVAL_PRODUCTS_SUCCESS", payload: data.approvalProducts })
                setApprovalProducts(data.approvalProducts)
                setApprovalProductsCount(data.approvalProductsCount)
            } else {
                toast.error(data.message);
                navigate("/Dashboard");
            }
        } catch (error) {
            dispatch({ type: "SELLER_APPROVAL_PRODUCTS_FAIL", payload: error })
        }


    }



    useEffect(() => {
        getApprovalProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
    ]



    return (
        <>
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
                            />

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default WaitingApproval