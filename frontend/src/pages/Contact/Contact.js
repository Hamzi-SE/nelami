import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
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
            
            {/* <!--/Breadcrumb--> */}


            {/* <!--Contact--> */}
            <div className="sptb">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 mx-auto">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                name="name" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)} 
                                                placeholder="Your Name" 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                name="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)} 
                                                placeholder="Email Address" 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <textarea 
                                                className="form-control" 
                                                name="message" 
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)} 
                                                rows="7" 
                                                placeholder="Message" 
                                                required
                                            ></textarea>
                                        </div>
                                        <button 
                                            type='submit' 
                                            className={`btn btn-primary ${loading ? 'disabled' : ''}`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </button>
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
                                    <h6>nelami@ihamza.dev</h6>
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