import React, { useEffect, useState } from 'react'
import DataTable from "react-data-table-component";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import { useSelector, useDispatch } from "react-redux";

//CSS
import "./AllUsers.css"

//ICONS
import { HiOutlineTrash, HiOutlineEye } from "react-icons/hi"
import customFetch from '../../../utils/api';




const AllUsers = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.profile);

    const [allUsers, setAllUsers] = useState([])
    const [search, setSearch] = useState("")
    const [filteredUsers, setFilteredUsers] = useState([])


    const getAllUsers = async () => {
        dispatch({ type: "ALL_USERS_REQUEST" })
        const res = await customFetch("/api/v1/admin/users", {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "ALL_USERS_SUCCESS", payload: data.users })
                setAllUsers(data.users);
                setFilteredUsers(data.users);
            } else {
                dispatch({ type: "ALL_USERS_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const result = allUsers.filter(user => {
            return user.name.toLowerCase().match(search.toLowerCase())
        }).sort((a, b) => {
            return a.name.localeCompare(b.name)
        }).sort((a, b) => {
            return a.email.localeCompare(b.email)
        }
        )
        setFilteredUsers(result)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])



    const columns = [
        {
            name: "Avatar",
            selector: (row) => <img src={row.avatar.url} width={100} alt="userdp" />
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: "Email",
            selector: row => row.email
        },
        {
            name: "Phone No",
            selector: row => row.phoneNo
        },
        {
            name: "Role",
            selector: row => row.role,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row, i) => (
                <>
                    <button type="button" data-icon="view" data-index={i} className={`${row?.role !== "seller" ? "d-none" : "btn btn-sm btn-primary"}`} onClick={() => window.open('/User/' + row._id, "_blank")} >
                        <HiOutlineEye />
                    </button>
                    <button type="button" data-icon="delete" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/admin/deleteUser/${row._id}`)}>
                        <HiOutlineTrash />
                    </button>
                </>
            ),
        },
    ]


    // if (loading) {
    //     return (
    //         <>
    //             <div className="container-fluid loading-three-dots ">
    //                 <ThreeDots color="blue" height={80} width={80} />
    //             </div>
    //         </>
    //     )
    // }

    return (
        <>
            <>
                <div className="col-xl-9 col-lg-12 col-md-12">
                    <div className="card mb-0">
                        <div className="card-header">
                            <h3 className="card-title">All Users</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <DataTable
                                    columns={columns}
                                    data={filteredUsers}
                                    pagination={true}
                                    striped={true}
                                    highlightOnHover={true}
                                    progressPending={loading}
                                    subHeader
                                    subHeaderComponent={<input type='text' placeholder='Search Here' className='w-25 form-control' value={search}
                                        onChange={(e) => setSearch(e.target.value)} />}

                                />

                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}

export default AllUsers