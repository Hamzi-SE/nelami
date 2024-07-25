import React, { useEffect, useState } from 'react'

const CustomForm = ({ status, message, onValidated }) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (status === "success") clearFields();
    }, [status])

    const clearFields = () => {
        setEmail('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        email &&
            email.indexOf("@") > -1 &&
            onValidated({
                EMAIL: email,
            });
    }

    return (


        // {/* <!-- Newsletter--> */ }
        //     < section className = "sptb bg-white border-top" >
        //         <div className="container">
        //             <div className="row">
        // <div className="col-lg-7 col-xl-6 col-md-12">
        //     <div className="sub-newsletter">
        //         <h3 className="mb-2">
        //             <i className="fa fa-paper-plane-o me-2"></i> Subscribe To Our Newsletter
        //         </h3>
        //         <p className="mb-0">Get in touch with our latest offers and products</p>
        //     </div>
        // </div>
        // <div className="col-lg-5 col-xl-6 col-md-12">
        //     <div className="input-group sub-input mt-1">
        //         <input type="text" className="form-control input-lg " placeholder="Enter your Email" />
        //         <div className="input-group-text border-0 bg-transparent p-0 ">
        //             <button type="button" className="btn btn-primary btn-lg br-te-7 br-be-7">
        //                 Subscribe
        //             </button>
        //         </div>
        //     </div>
        // </div>
        //             </div>
        //         </div>
        //   </section >
        // {/* <!--/Newsletter--> */ }


        <section className="sptb bg-white border-top">
            <div className="container">
                <form className="row mc__form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="col-lg-7 col-xl-6 col-md-12">
                        <div className="sub-newsletter">
                            <h3 className="mb-2 mc__title">
                                <i className="fa fa-paper-plane me-2"></i> Subscribe To Our Newsletter
                            </h3>
                            <p className="mb-0">Get in touch with our latest offers and products</p>
                            {/* Error and sending status messages */}
                            {status === "success" && (
                                <div
                                    className="mc__alert mc__alert--success"
                                    dangerouslySetInnerHTML={{ __html: message }}
                                />
                            )}

                            {status === "sending" && (
                                <div className="mc__alert mc__alert--sending">
                                    sending...
                                </div>
                            )}
                            {status === "error" && (
                                <div
                                    className="mc__alert mc__alert--error"
                                    dangerouslySetInnerHTML={{ __html: message }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-lg-5 col-xl-6 col-md-12">
                        <div className="input-group sub-input mt-1">

                            {status !== "success" ? (
                                <input
                                    label="Email"
                                    className='form-control input-lg'
                                    onChange={e => setEmail(e.target.value)}
                                    type="email"
                                    value={email}
                                    placeholder="your@email.com"
                                />
                            ) : null}
                            <div className="input-group-text border-0 bg-transparent p-0 ">
                                {
                                    status === 'success' ? (
                                        <button className="mc__button btn btn-primary btn-lg br-te-7 br-be-7" type="submit" disabled>
                                            Success!
                                        </button>
                                    ) : (
                                        <button className="mc__button btn btn-primary btn-lg br-te-7 br-be-7" type="submit" disabled={status === "sending"}>
                                            {status === "sending" ? "Sending..." : "Subscribe"}
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>







                </form>

            </div>
        </section>
    )
}

export default CustomForm