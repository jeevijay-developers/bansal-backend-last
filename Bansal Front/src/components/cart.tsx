import { Link } from "react-router-dom";

const Cart = () => {
    return (
        <>
            <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex={-1} id="CartModal">
                <div className="offcanvas-header">
                    <h5>Cart</h5>
                    <button type="button" className="cuustom-close-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-regular fa-circle-xmark" /></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="cart-items-listing">
                        <li>
                            <Link to="#" className="cart-item text-decoration-none">
                                <div className="cart-item-image">
                                    <img src="/assets/img/book.png" alt="#" className="img-fluid" />
                                </div>
                                <div className="cart-item-details">
                                    <h4 className="product-name">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do </h4>
                                    <div className="cart-item-btm">
                                        <p className="course-price cart-item-price" style={{ fontSize: 14, fontWeight: 400 }}>
                                            ₹1800
                                            <span className="mrp-price">2000</span>
                                            <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="cart-item text-decoration-none">
                                <div className="cart-item-image">
                                    <img src="/assets/img/book.png" alt="#" className="img-fluid" />
                                </div>
                                <div className="cart-item-details">
                                    <h4 className="product-name">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do </h4>
                                    <div className="cart-item-btm">
                                        <p className="course-price cart-item-price" style={{ fontSize: 14, fontWeight: 400 }}>
                                            ₹1800
                                            <span className="mrp-price">2000</span>
                                            <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="offcanvas-footer">
                    <div className="filter-offcanvas-action-group">
                        <div className="cart-bottom w-100">
                            <div className="d-flex gap-4 align-items-center justify-content-between">
                                <h3>Estimated Total</h3>
                                <p>₹1,800</p>
                            </div>
                            <p className="cart-bottom-note">Tax included.&nbsp;Shipping&nbsp;and discounts calculated at checkout.</p>
                            <button 
                                className="btn course-action-btn-prime w-100" 
                                data-bs-dismiss="offcanvas" 
                                aria-label="Close"
                                onClick={() => window.location.href = "/checkout"} >
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Cart;
{/* <script>
    document.addEventListener("DOMContentLoaded", function () {
        function plus(button) {
            const countEl = button.parentElement.querySelector(".count");
            let count = parseInt(countEl.value);
            count++;
            countEl.value = count;
        }
        function minus(button) {
            const countEl = button.parentElement.querySelector(".count");
            let count = parseInt(countEl.value);
            if (count > 1) {
                count--;
                countEl.value = count;
            }
        }
        document.querySelectorAll(".plus").forEach(button => {
            button.addEventListener("click", function () {
                plus(this);
            });
        });
        document.querySelectorAll(".moins").forEach(button => {
            button.addEventListener("click", function () {
                minus(this);
            });
        });
    });
</script> */}