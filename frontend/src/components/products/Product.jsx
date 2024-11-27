import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { allProducts } from "../../services/product.service";
import './Product.css';  // Custom styles for product page
import { FaSearch } from 'react-icons/fa';  // Import the search icon

function Product() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search term state

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

    // Filter products based on search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <h1 className="text-center my-5">Loading . . .</h1>;
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h2 className="product-title">Our Products</h2>
                    </div>
                </div>
                {/* Search Input */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="search-bar search-container">
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                                className="search-input animate__animated animate__fadeIn" // Adding animation
                            />
                            <FaSearch className="search-bar-icon animate__animated animate__zoomIn" /> {/* Search icon */}
                        </div>
                    </div>
                </div>
                <div className="row">
                    {error && <h1 className="text-danger text-center">{error}</h1>}
                    {filteredProducts &&
                        filteredProducts.map((product) => (
                            <div className="col-lg-4 col-md-6 col-sm-12" key={product.id}>
                                <div className="card product-card mb-4 animate__animated animate__fadeInUp"> {/* Added animation */}
                                    <div className="card-header p-0">
                                        <img
                                            src={product.photo || "https://via.placeholder.com/300"}
                                            alt={product.name}
                                            className="img-fluid product-image"
                                        />
                                    </div>
                                    <div className="card-body">
                                        <NavLink to={`/product/${product.id}`} className="product-link">
                                            <h5 className="card-title">{product.name}</h5>
                                        </NavLink>
                                        <p className="card-text product-description">{product.description}</p>
                                        <p className="card-text">
                                            <strong>Price: </strong>${product.price.toFixed(2)}
                                        </p>
                                        {product.discount > 0 && (
                                            <p className="card-text text-success">
                                                <strong>Discount: </strong>{product.discount}%
                                            </p>
                                        )}
                                        <NavLink className="btn btn-primary btn-block" to={`/product/${product.id}`}>
                                            View Details
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default Product;
