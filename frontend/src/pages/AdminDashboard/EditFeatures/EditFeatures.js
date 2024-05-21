import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    getAllCitiesDropList, getProvinceDropList, getIslamabadSectorsDropList, getNorthernAreasCitiesDropList,
    getAzadKashmirCitiesDropList, getPunjabCitiesDropList, getSindhCitiesDropList,
    getBalochistanCitiesDropList, getKPKCitiesDropList
} from "../../../utils/PakCitiesData";

import getBidTimeDropList from "../../../utils/BidData";
import { getBikeMake } from '../../../utils/BikeData';
import { getCarMake, getFuelDropList } from '../../../utils/carData';
import { getData } from '../../../helpers/GetData';
import customFetch from '../../../utils/api';

const EditFeatures = () => {
    const dispatch = useDispatch();

    const { data } = useSelector(state => state.data);
    const [item, setItem] = useState("");
    const [newEntry, setNewEntry] = useState("");
    const [itemRemove, setItemRemove] = useState("");
    const [entryToRemove, setEntryToRemove] = useState("");
    const [newPackage, setNewPackage] = useState({
        name: "",
        price: "",
        productsAllowed: "",
        description: "",
    })

    const addNewFeature = async (e) => {
        e.preventDefault();
        dispatch({ type: "ADD_FEATURE_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/data/newEntry`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    item,
                    newEntry,
                }),
            });
            const data = await res.json();
            
            if (res.status === 201) {
                dispatch({ type: "ADD_FEATURE_SUCCESS", payload: data.message })
                toast.success(data.message);
                setItem("");
                setNewEntry("");
                getData(dispatch);
            }
            else {
                dispatch({ type: "ADD_FEATURE_FAIL", payload: data.message })
                toast.error(data.message);
            }
        }

        catch (error) {
            dispatch({ type: "ADD_FEATURE_FAIL", payload: error })
            console.log(error);
        }
    }


    const removeFeature = async (e) => {
        dispatch({ type: "REMOVE_FEATURE_REQUEST" })
        e.preventDefault();
        try {
            const res = await customFetch(`/api/v1/data/removeEntry`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    item: itemRemove,
                    newEntry: entryToRemove,
                }),
            });
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "REMOVE_FEATURE_SUCCESS", payload: data.message })
                toast.success(data.message);
                setItemRemove("");
                setEntryToRemove("");
                getData(dispatch);
            }
            else {
                dispatch({ type: "REMOVE_FEATURE_FAIL", payload: data.message })
                toast.error(data.message);
            }
        }

        catch (error) {
            dispatch({ type: "REMOVE_FEATURE_FAIL", payload: error })
            console.log(error);
        }
    }


    const updatePackage = async (e) => {
        // dispatch({ type: "REMOVE_FEATURE_REQUEST" })
        e.preventDefault();
        try {
            const res = await customFetch(`/api/v1/data/updatePackage`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pkgName: newPackage.name,
                    newPrice: newPackage.price,
                    newProductsAllowed: newPackage.productsAllowed,
                    newDesc: newPackage.description,
                }),
            });
            const data = await res.json();
            if (res.status === 200) {
                // dispatch({ type: "REMOVE_FEATURE_SUCCESS", payload: data.message })
                setNewPackage({ name: "", price: "", productsAllowed: "", description: "" })

                toast.success(data.message);
                getData(dispatch);
            }
            else {
                // dispatch({ type: "REMOVE_FEATURE_FAIL", payload: data.message })
                toast.error(data.message);
            }
        }

        catch (error) {
            // dispatch({ type: "REMOVE_FEATURE_FAIL", payload: error })
            console.log(error);
        }
    }




    const getDropList = (item, data) => {
        if (item === "bidTimeList") {
            return getBidTimeDropList(data);
        }
        else if (item === "bikeMakeList") {
            return getBikeMake(data);
        }
        else if (item === "carMakeList") {
            return getCarMake(data);
        }
        else if (item === "carFuelTypeList") {
            return getFuelDropList(data);
        }
        else if (item === "allCitiesList") {
            return getAllCitiesDropList(data);
        }
        else if (item === "provinceList") {
            return getProvinceDropList(data);
        }
        else if (item === "punjabCitiesList") {
            return getPunjabCitiesDropList(data);
        }
        else if (item === "sindhCitiesList") {
            return getSindhCitiesDropList(data);
        }
        else if (item === "kpkCitiesList") {
            return getKPKCitiesDropList(data);
        }
        else if (item === "balochistanCitiesList") {
            return getBalochistanCitiesDropList(data);
        }
        else if (item === "azadKashmirCitiesList") {
            return getAzadKashmirCitiesDropList(data);
        }
        else if (item === "northernAreasList") {
            return getNorthernAreasCitiesDropList(data);
        }
        else if (item === "islamabadSectorsList") {
            return getIslamabadSectorsDropList(data);
        }


    }




    const handlePackageNameChange = (e) => {
        let obj = data.packages.find(o => o.name == e.target.value);
        if (obj) {
            setNewPackage({
                name: obj.name,
                price: obj.price,
                productsAllowed: obj.productsAllowed,
                description: obj.description,
            })
        }
    }



    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Add New Feature</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <form className='col-md-12 d-flex flex-wrap' onSubmit={addNewFeature}>
                                <div className="col-md-5">
                                    <div className="form-group m-0">
                                        <label className="form-label text-dark">Feature</label>
                                        <select id="features" name="item" value={item} onChange={(e) => setItem(e.target.value)} className="form-control" required>
                                            <option value=""> Select Item</option>
                                            <option value="bidTimeList">Bid Time</option>
                                            <option value="bikeMakeList">Bike Make</option>
                                            <option value="carMakeList">Car Make</option>
                                            <option value="carFuelTypeList">Fuel Type</option>
                                            <option value="allCitiesList">All Cities</option>
                                            <option value="provinceList">Province</option>
                                            <option value="punjabCitiesList">Punjab Cities</option>
                                            <option value="sindhCitiesList">Sindh Cities</option>
                                            <option value="kpkCitiesList">KPK Cities</option>
                                            <option value="balochistanCitiesList">Balochistan Cities</option>
                                            <option value="azadKashmirCitiesList">Azad Kashmir Cities</option>
                                            <option value="northernAreasList">Northern Areas</option>
                                            <option value="islamabadSectorsList">Islamabad Sectors</option>
                                        </select>
                                    </div>
                                </div>

                                {item && <div className="col-md-5">
                                    <div className="form-group m-0">
                                        <label className="form-label text-dark">New Value</label>
                                        <input type="text" value={newEntry} onChange={(e) => setNewEntry(e.target.value)} className="form-control" placeholder="New Value" required />
                                    </div>
                                </div>
                                }
                                {item && <div className='col-md-2 d-flex justify-content-center align-items-end'>
                                    <button type="submit" className="btn btn-primary w-100">Add</button>
                                </div>}
                            </form>

                        </div>
                    </div>
                </div>



                {/* REMOVE FEATURE */}
                <div className="card mb-0 mt-5">
                    <div className="card-header">
                        <h3 className="card-title">Remove Feature</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <form className='col-md-12 d-flex flex-wrap' onSubmit={removeFeature}>
                                <div className="col-md-5">
                                    <div className="form-group m-0">
                                        <label className="form-label text-dark">Features</label>
                                        <select id="features" name="item" value={itemRemove} onChange={(e) => setItemRemove(e.target.value)} className="form-control" required>
                                            <option value=""> Select Item</option>
                                            <option value="bidTimeList">Bid Time</option>
                                            <option value="bikeMakeList">Bike Make</option>
                                            <option value="carMakeList">Car Make</option>
                                            <option value="carFuelTypeList">Fuel Type</option>
                                            <option value="allCitiesList">All Cities</option>
                                            <option value="provinceList">Province</option>
                                            <option value="punjabCitiesList">Punjab Cities</option>
                                            <option value="sindhCitiesList">Sindh Cities</option>
                                            <option value="kpkCitiesList">KPK Cities</option>
                                            <option value="balochistanCitiesList">Balochistan Cities</option>
                                            <option value="azadKashmirCitiesList">Azad Kashmir Cities</option>
                                            <option value="northernAreasList">Northern Areas</option>
                                            <option value="islamabadSectorsList">Islamabad Sectors</option>
                                        </select>
                                    </div>
                                </div>

                                {itemRemove &&
                                    <div className="col-md-5">
                                        <div className="form-group m-0">
                                            <label className="form-label text-dark">Bid Time List</label>
                                            <select id="features" name="newEntry" value={entryToRemove} onChange={(e) => setEntryToRemove(e.target.value)} className="form-control" required>
                                                {getDropList(itemRemove, data)}
                                            </select>
                                        </div>
                                    </div>
                                }





                                {itemRemove && <div className='col-md-2 d-flex justify-content-center align-items-end'>
                                    <button type="submit" className="btn btn-primary w-100">Remove</button>
                                </div>}
                            </form>

                        </div>
                    </div>
                </div>



                {/* Edit Packages */}
                <div className="card mb-0 mt-5">
                    <div className="card-header">
                        <h3 className="card-title">Edit Packages</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <form className='col-md-12 d-flex flex-wrap' onSubmit={updatePackage}>
                                <div className="col-md-4">
                                    <div className="form-group m-0">
                                        <label className="form-label text-dark">Packages</label>
                                        <select id="features" name="name" value={newPackage.name} onChange={handlePackageNameChange} className="form-control" required>
                                            <option value=""> Select Package</option>
                                            <option value="Free">Free</option>
                                            <option value="Gold">Gold</option>
                                            <option value="Platinum">Platinum</option>
                                        </select>
                                    </div>
                                </div>

                                {newPackage &&
                                    <div className="col-md-4">
                                        <div className="form-group m-0">
                                            <label className="form-label text-dark">New Price</label>
                                            <input type="number" name="price" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, [e.target.name]: e.target.value })} className="form-control" placeholder="New Price" required />
                                        </div>
                                    </div>
                                }
                                {newPackage &&
                                    <div className="col-md-4">
                                        <div className="form-group m-0">
                                            <label className="form-label text-dark">New Products Allowed</label>
                                            <input type="number" name="productsAllowed" value={newPackage.productsAllowed} onChange={(e) => setNewPackage({ ...newPackage, [e.target.name]: e.target.value })} className="form-control" placeholder="New Products Allowed" required />
                                        </div>
                                    </div>
                                }
                                {newPackage &&
                                    <div className="col-md-9 mt-5">
                                        <div className="form-group m-0">
                                            <label className="form-label text-dark">New Description (Comma seperated)</label>
                                            <input type="text" name="description" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, [e.target.name]: e.target.value })} className="form-control" placeholder="New Description" required />
                                        </div>
                                    </div>
                                }





                                {newPackage && <div className='col-md-3 d-flex justify-content-center align-items-end'>
                                    <button type="submit" className="btn btn-primary w-100">Update</button>
                                </div>}
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default EditFeatures;
