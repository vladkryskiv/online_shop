import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addOrder } from "../../services/order.service";
import { getProductById } from "../../services/product.service";
import './IndexProduct.css';  // Custom styles for the individual product page

function IndexProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(''); // Define notification state

    useEffect(() => {
        setLoading(true);
        getProductById(id)
            .then((response) => {
                setLoading(false);
                setProduct(response.data);
            })
            .catch((err) => {
                setLoading(false);
                setError('Product is not found!');
            });
    }, [id]);

    const addQuantity = () => setQuantity(prev => prev + 1);

    const lowQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleOrder = async () => {
        addOrder(product.id, quantity)
            .then(() => {
                setNotification('Product added to cart successfully!'); // Set the notification message
                setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 401) {
                    navigate('/auth/login');
                } else {
                    alert('Internal server error');
                }
            });
    };

    if (loading) return <h1 className="text-center my-5">Loading . . .</h1>;

    return (
        <div className="container my-5">
            {error ? (
                <h1 className="text-danger text-center">{error}</h1>
            ) : (
                <div className="row">
                    <div className="col-md-6">
                        <div className="product-image">
                            <img
                                src={product.photo || "https://fakeimg.pl/500x500/"}
                                alt={product.name}
                                className="img-fluid"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: ${product.price}</p>
                        {product.discount > 0 && (
                            <p className="product-discount text-success">Discount: {product.discount}%</p>
                        )}
                        <p className="product-color">Color: {product.color}</p>
                        <p className="product-size">Size: {product.size}</p>

                        <div className="quantity-selector my-3">
                            <button className="btn btn-outline-secondary" onClick={lowQuantity}>-</button>
                            <span className="quantity">{quantity}</span>
                            <button className="btn btn-outline-secondary" onClick={addQuantity}>+</button>
                        </div>

                        <button className="btn btn-primary btn-lg btn-block" onClick={handleOrder}>
                            Add to Basket
                        </button>
                        {/* Notification Message */}
                        {notification && (
                            <div className="notification">
                                {notification}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default IndexProduct;
