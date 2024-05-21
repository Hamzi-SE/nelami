import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from "react-countup";

import customFetch from '../../../utils/api';
import "./StatsDashboard.css";



const StatsDashboard = () => {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBuyers: 0,
        totalSellers: 0,
        activeBids: 0,
        endedBids: 0,
        totalProducts: 0,
        totalVehicles: 0,
        totalProperties: 0,
        totalMiscProducts: 0,
    })

    const getStats = async () => {
        const res = await customFetch("/api/v1/adminStats", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();

        if (res.status === 200) {
            setStats({
                totalUsers: data.totalUsers,
                totalBuyers: data.totalBuyers,
                totalSellers: data.totalSellers,
                activeBids: data.activeBids,
                endedBids: data.endedBids,
                totalProducts: data.totalProducts,
                totalVehicles: data.totalVehicles,
                totalProperties: data.totalProperties,
                totalMiscProducts: data.totalMiscProducts,
            })
        }
        else {
            console.log(data?.message || "Something went wrong while fetching stats")
        }
    }
    useEffect(() => {
        getStats();
    }, [])

    Chart.register(...registerables);

    // const { totalUsers } = props;


    const pieState = {
        labels: ['Vehicles', 'Properties', 'Misc Products'],
        datasets: [{
            backgroundColor: ['#98b3ad', '#937DC2', '#f0bb77'],
            hoverBackgroundColor: ['#98b3ad', '#937DC2', '#f0bb77'],
            data: [stats.totalVehicles, stats.totalProperties, stats.totalMiscProducts]
        }]
    }
    const pieState2 = {
        labels: ['Buyers', 'Sellers'],
        datasets: [{
            backgroundColor: ['#FBB454', '#3AB4F2'],
            hoverBackgroundColor: ['#FBB454', '#3AB4F2'],
            data: [stats.totalBuyers, stats.totalSellers]
        }]
    }


    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Profile</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box royal-blue-box">
                                    <div className="stats-text">
                                        <h3>
                                            Total Users <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalUsers} /></span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box peach-box">
                                    <div className="stats-text">
                                        <h3>
                                            Total Buyers <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalBuyers} /></span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box blue-box">
                                    <div className="stats-text">
                                        <h3>
                                            Total Sellers <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalSellers} /></span>
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box yellow-box">
                                    <div className="stats-text">
                                        <h3>
                                            Total Products <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalProducts} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box green-box">
                                    <div className="stats-text">
                                        <h3>
                                            Active Bids <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.activeBids} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box red-box">
                                    <div className="stats-text">
                                        <h3>
                                            Ended Bids <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.endedBids} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box grey-box">
                                    <div className="stats-text">
                                        <h3>
                                            Vehicles <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalVehicles} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box purple-box">
                                    <div className="stats-text">
                                        <h3>
                                            Properties <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalProperties} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-6">
                                <div className="stats-box orange-box">
                                    <div className="stats-text">
                                        <h3>
                                            Miscellaneous  <br />  <span><CountUp duration={0.8} useEasing={true} end={stats.totalMiscProducts} /></span>
                                        </h3>

                                    </div>
                                </div>
                            </div>

                            <div className='w-100 d-flex justify-content-between'>
                                <div style={{ display: "flex", flexDirection: "row", width: "350px", columnGap: "10em", padding: "1em" }}>

                                    <Pie data={pieState} options={{
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                            }
                                        },
                                    }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", width: "335px", columnGap: "10em", padding: "1em" }}>

                                    <Pie data={pieState2} options={{
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                            }
                                        },
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatsDashboard