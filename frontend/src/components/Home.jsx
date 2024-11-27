import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { allProducts } from "../services/product.service";
import './Home.css'; 

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        allProducts()
            .then((response) => {
                setLoading(false);
                setProducts(response.data);
            })
            .catch(() => {
                setLoading(false);
                setError('Internal server error');
            });
    }, []);


    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Hero Section */}
            <div className="hero-section container-fluid bg-light text-center p-5">
                <div className="row align-items-center">
                    <div className="col-md-6 animate__animated animate__fadeInLeft">
                        <h1 className="display-4">Welcome to Our Online Shop!</h1>
                        <p className="lead">Explore our wide range of products.</p>
                        <NavLink to='/product' className="btn btn-primary btn-lg mt-3 animate__animated animate__bounceIn">Shop Now</NavLink>
                    </div>
                    <div className="col-md-6 animate__animated animate__zoomIn">
                        <img 
                            className="img-fluid hero-image" 
                            src="https://i.pinimg.com/originals/92/06/23/92062396ec80ec776743d10db0938789.gif" 
                            alt="Animated Logo"
                        />
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="container mt-5">
                <input 
                    type="text"
                    placeholder="Search products..."
                    className="form-control mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input
                />
            </div>

            {/* Top Products Section */}
            <div className="container top-products-section mt-5 mb-5">
                <h1 className="text-center animate__animated animate__fadeInUp">Popular Products</h1>
                {loading ? (
                    <h1 className="text-center">Loading...</h1>
                ) : error ? (
                    <h1 className="text-center">{error}</h1>
                ) : (
                    <div className="row justify-content-center animate__animated animate__fadeInUpBig">
                        {filteredProducts && filteredProducts.map((product, key) => product.top && (
                            <div key={key} className="col-md-3 col-sm-6 mt-4 animate__animated animate__flipInY">
                                <div className="card shadow-sm product-card">
                                    <div className="img-box">
                                        <img 
                                            src={product.photo ? product.photo : "https://via.placeholder.com/300"}
                                            className="card-img-top" 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h4 className="card-title text-center">{product.name}</h4>
                                        <p className="item-price text-center">${product.price}</p>
                                        <p className="text-center">{product.description}</p>
                                        <NavLink to={`/product/${product.id}`} className="btn btn-info btn-block animate__animated animate__lightSpeedInRight">
                                            View Details
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
