import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { useSelector } from 'react-redux';

import customFetch from '../../../utils/api';
import "./StatsDashboard.css";



const StatsDashboard = () => {
    const { user } = useSelector(state => state.user)
    const [stats, setStats] = useState({
        totalBids: 0,
        totalProducts: 0,
        totalEndedBids: 0,
        totalOngoingBids: 0,
        totalVehicles: 0,
        totalProperties: 0,
        totalMiscProducts: 0,
    })


    const getStats = async () => {
        const res = await customFetch("/api/v1/userStats", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();

        if (res.status === 200) {
            setStats({
                totalBids: data.totalBids,
                totalProducts: data.totalProducts,
                totalEndedBids: data.totalEndedBids,
                totalOngoingBids: data.totalOngoingBids,
                totalVehicles: data.totalVehicles,
                totalProperties: data.totalProperties,
                totalMiscProducts: data.totalMiscProducts,
            })
        }
        else {
            console.log("Error")
        }
    }


    useEffect(() => {
        getStats();
    }, [])
    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Profile</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box yellow-box">
                                        <div className="stats-text">
                                            <h3>
                                                Total Products <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalProducts} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "buyer" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box green-box">
                                        <div className="stats-text">
                                            <h3>
                                                Placed Bids <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalBids} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box red-box">
                                        <div className="stats-text">
                                            <h3>
                                                Auction Ended <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalEndedBids} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box green-box">
                                        <div className="stats-text">
                                            <h3>
                                                Ongoing Auction <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalOngoingBids} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box blue-box">
                                        <div className="stats-text">
                                            <h3>
                                                Vehicles <br />  <span> <CountUp duration={0.6} useEasing={true} end={stats.totalVehicles} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box purple-box">
                                        <div className="stats-text">
                                            <h3>
                                                Lands <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalProperties} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}
                            {user?.role === "seller" &&
                                <div className="col-md-4 col-sm-6 col-6">
                                    <div className="stats-box orange-box">
                                        <div className="stats-text">
                                            <h3>
                                                Miscellaneous  <br />  <span><CountUp duration={0.6} useEasing={true} end={stats.totalMiscProducts} /></span>
                                            </h3>

                                        </div>
                                    </div>
                                </div>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatsDashboard