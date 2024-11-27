import { useEffect, useState } from "react";
import { allOrders, deleteOrder } from "../../services/order.service";
import './Modal.css';  // Custom styles for the modal

function Modal(props) {
  const user = props.user;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    allOrders()
      .then((response) => {
        setLoading(false);
        setOrders(response.data);
      })
      .catch((err) => {
        setLoading(false);
        setError("Internal server error");
      });
  }, []);

  const calculateFinalPrice = (price, discount) => {
    const discountAmount = (price * discount) / 100;
    return (price - discountAmount).toFixed(2);
  };

  const removeHandle = async (id) => {
    setLoading(true);
    deleteOrder(id)
      .then((response) => {
        allOrders().then((response) => {
          setLoading(false);
          setOrders(response.data);
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Updated Modal Title */}
            <div className="modal-header bg-primary text-light p-3">
              <h5 className="modal-title" id="staticBackdropLabel">
                Basket
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="container">
                <div className="row">
                  <div className="col-sm-12">
                    <table className="table table-hover table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && <tr><td colSpan="4">Loading . . .</td></tr>}
                        {error ? (
                          <tr><td colSpan="4" className="text-center text-danger">{error}</td></tr>
                        ) : (
                          orders.map((order, key) => {
                            const originalPrice = order.product.price;
                            const discount = order.product.discount || 0;
                            const finalPrice = calculateFinalPrice(originalPrice, discount);
                            const totalPrice = (finalPrice * order.quantity).toFixed(2);

                            return (
                              <tr key={key}>
                                <td>
                                  {/* Display product image */}
                                  <img
                                    src={order.product.photo || "https://via.placeholder.com/50"}
                                    width={50}
                                    height={50}
                                    alt={order.product.name}
                                    className="img-thumbnail me-2"
                                  />
                                  <b>{order.product.name}</b>
                                  <br />
                                  <small>Original: {originalPrice}$</small>
                                  {discount > 0 && (
                                    <small>
                                      {" "} | Discount: {discount}% | Final: {finalPrice}$
                                    </small>
                                  )}
                                </td>
                                <td>{order.quantity}</td>
                                <td>{totalPrice}$</td>
                                <td>
                                  <button
                                    onClick={() => removeHandle(order.id)}
                                    className="btn btn-outline-danger btn-sm"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="modal-footer bg-light p-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
