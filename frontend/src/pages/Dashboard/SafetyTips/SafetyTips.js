import React from 'react'

const SafetyTips = () => {
    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Safety Tips</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">

                            <div className="card-body">
                                <ul className="list-unstyled widget-spec  mb-0">
                                    <li className="">
                                        <i className="fa fa-check text-success" aria-hidden="true"></i> Meet Seller at public Place
                                    </li>
                                    <li className="">
                                        <i className="fa fa-check text-success" aria-hidden="true"></i> Check item before you buy
                                    </li>
                                    <li className="">
                                        <i className="fa fa-check text-success" aria-hidden="true"></i> Pay only after collecting item
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SafetyTips