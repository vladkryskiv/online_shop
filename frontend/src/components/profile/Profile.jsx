import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { allOrders, updateOrder, deleteOrder } from "../../services/order.service";  
import './Profile.css';  // Custom styles for the profile page

function Profile(props) {
    const user = props.user;    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);

        if (!user) {
            navigate('/');
            return;
        }

        allOrders().then((response) => {
            setLoading(false);
            setOrders(response.data);
        })
        .catch((err) => {
            setLoading(false);
            setError('Internal server error');
        });
    }, [navigate, user]);

    const handleBuy = (orderId) => {
        const updatedData = {
            quantity: 2,
            total: 40.00
        };

        updateOrder(orderId, updatedData)
            .then(() => {
                const updatedOrders = orders.map(order => 
                    order.id === orderId ? { ...order, ...updatedData } : order
                );
                setOrders(updatedOrders);
                console.log(`Order ${orderId} updated successfully`);
            })
            .catch((err) => {
                console.error('Error updating order:', err);
            });
    };

    const handleRemove = (orderId) => {
        deleteOrder(orderId)
            .then(() => {
                const remainingOrders = orders.filter(order => order.id !== orderId);
                setOrders(remainingOrders);
                console.log(`Order ${orderId} removed successfully`);
            })
            .catch((err) => {
                console.error('Error removing order:', err);
            });
    };

    const calculateFinalPrice = (product) => {
        const discount = product.discount || 0;  
        const finalPrice = product.price - (product.price * discount / 100);
        return finalPrice.toFixed(2);
    };

    return ( 
        <>
            {/* Profile Header */}
            <div className="hero-section container-fluid bg-light text-center p-5">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        {user && (
                            <>
                                <h1 className="display-4 animate__animated animate__fadeInDown">Welcome, {user.name}!</h1>
                                <p className="lead animate__animated animate__fadeInUp">Email: {user.email}</p>
                            </>  
                        )}
                    </div>
                    <div className="col-md-4 text-end">
                        <NavLink className="btn btn-outline-primary btn-lg mt-3 animate__animated animate__bounceIn" to='/logout'>Log Out</NavLink>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div className="container mt-5">
                <h3 className="text-center mb-4">Your Orders</h3>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-hover table-striped animate__animated animate__fadeIn">
                            <thead className="table-dark">
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Original Price</th>
                                    <th>Discount</th>
                                    <th>Final Price</th>
                                    <th>Total</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (<tr><td colSpan="7" className="text-center">Loading...</td></tr>)}
                                {error ? (<tr><td colSpan="7" className="text-center text-danger">{error}</td></tr>) :
                                    orders.map((order, key) => (
                                        <tr key={key}>
                                            <td>
                                                <img 
                                                    src={order.product.photo ? order.product.photo : "https://via.placeholder.com/50"} 
                                                    alt={order.product.name}
                                                    className="img-thumbnail me-2"
                                                    width={50}
                                                    height={50}
                                                />
                                                <b>{order.product.name}</b><br />
                                            </td>
                                            <td>{order.quantity}</td>
                                            <td>{order.product.price}$</td>
                                            <td>{order.product.discount || 0}%</td>
                                            <td>{calculateFinalPrice(order.product)}$</td>
                                            <td>{(calculateFinalPrice(order.product) * order.quantity).toFixed(2)}$</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-success me-2" 
                                                    onClick={() => handleBuy(order.id)}
                                                >
                                                    Buy
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger" 
                                                    onClick={() => handleRemove(order.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;

