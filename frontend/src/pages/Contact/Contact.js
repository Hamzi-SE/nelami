import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import MetaData from '../../utils/MetaData';
import customFetch from '../../utils/api';

const Contact = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!name || !email || !message) {
            toast.error('Please fill all fields')
            setLoading(false)
            return
        }

        const res = await customFetch("/api/v1//message/toAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name, email, message
            }),
        });

        const data = await res.json();
        if (res.status === 200) {
            toast.success(data.message)
            navigate('/', { replace: true })
        }
        else {
            toast.error(data.message)
        }

        setLoading(false)

    }

    return (
        <>
            <MetaData title="Contact - Nelami" />
            {/* <!--Breadcrumb--> */}
            <div>
                <div className="bannerimg cover-image bg-background3">
                    <div className="header-text mb-0">
                        <div className="container">
                            <div className="text-center text-white ">
                                <h1 className="">Contact Us</h1>
                                <ol className="breadcrumb text-center">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active text-white" aria-current="page">Contact</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--/Breadcrumb--> */}


            {/* <!--Contact--> */}
            <div className="sptb">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4  col-md-12 mx-auto d-block">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="name1" name="name" onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                                        </div>
                                        <div className="form-group">
                                            <input type="email" className="form-control" id="email" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                                        </div>
                                        <div className="form-group">
                                            <textarea className="form-control" name="message" onChange={(e) => setMessage(e.target.value)} rows="6" placeholder="Message"></textarea>
                                        </div>
                                        <button type='submit' className={`btn btn-primary ${loading && 'disabled'}`}>Send Message</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--Contact--> */}

            {/* <!--Statistics--> */}
            <section className="sptb bg-white">
                <div className="container">
                    <div className="section-title center-block text-center">
                        <h1>Contact Info</h1>
                        <p>Mauris ut cursus nunc. Morbi eleifend, ligula at consectetur vehicula</p>
                    </div>
                    <div className="support">
                        <div className="row text-white">
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="support-service bg-primary br-2 mb-4 mb-xl-0">
                                    <i className="fa fa-phone"></i>
                                    <h6>+92 315-608-8777</h6>
                                    <p>Free Support!</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="support-service bg-secondary br-2 mb-4 mb-xl-0">
                                    <i className="fa fa-clock"></i>
                                    <h6>Mon-Sat(10:00-19:00)</h6>
                                    <p>Working Hours!</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12  col-md-12">
                                <div className="support-service bg-warning br-2">
                                    <i className="fa fa-envelope"></i>
                                    <h6>nelami@gmail.com</h6>
                                    <p>Support us!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--/Statistics--> */}


        </>
    )
}

export default Contact