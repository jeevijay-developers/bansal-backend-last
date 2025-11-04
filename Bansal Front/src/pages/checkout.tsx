
const Checkout = () => {
    return (
        <>
            <section>
                <div className="checkout-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="checkout-form">
                                    <h2 className="checkout-heading mb-4">Delivery Address</h2>
                                    <div className="row">
                                        <div className="col-lg-6 mb-4">
                                            <label htmlFor="FirstName" className="form-label">First Name</label>
                                            <input type="text" id="FirstName" name="FirstName" className="form-control" placeholder="Enter First Name" />
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <label htmlFor="LastName" className="form-label">Last Name</label>
                                            <input type="text" id="LastName" name="LastName" className="form-control" placeholder="Enter Last Name" />
                                        </div>
                                        <div className="col-md-12 mb-4">
                                            <label htmlFor="AddressInput" className="form-label">Address</label>
                                            <input type="text" id="AddressInput" name="AddressInput" className="form-control" placeholder="Enter Address" />
                                        </div>
                                        <div className="col-xl-12 col-lg-6 mb-4">
                                            <label htmlFor="CountrySelect" className="form-label">Country</label>
                                            <select name="CountrySelect" id="CountrySelect" className="form-select form-control">
                                                <option disabled selected>Select country</option>
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="AU">Australia</option>
                                                <option value="IN">India</option>
                                            </select>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 mb-4">
                                            <label htmlFor="StateSelect" className="form-label">State</label>
                                            <select name="StateSelect" id="StateSelect" className="form-select form-control">
                                                <option disabled selected>Select state</option>
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                            </select>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 mb-4">
                                            <label htmlFor="CitySelect" className="form-label">City</label>
                                            <select name="CitySelect" id="CitySelect" className="form-select form-control">
                                                <option disabled selected>Select city</option>
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                            </select>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 mb-4">
                                            <label htmlFor="PinInput" className="form-label">Pin code</label>
                                            <input type="text" id="PinInput" name="PinInput" className="form-control" placeholder="Pin Code" />
                                        </div>
                                        <div className="col-md-12 mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="flexCheck" />
                                                <label className="form-check-label" htmlFor="flexCheck">
                                                    Save this information for next time
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="checkout-right-card">
                                    <ul className="cart-items-listing">
                                        <li>
                                            <a href="#" className="cart-item text-decoration-none">
                                                <div className="cart-item-image">
                                                    <img src="assets/img/book.png" alt="#" className="img-fluid" />
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
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="cart-item text-decoration-none">
                                                <div className="cart-item-image">
                                                    <img src="assets/img/book.png" alt="#" className="img-fluid" />
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
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="checkout-table">
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td>Subtotal: 2 Items</td>
                                                    <td className="text-end">₹3600</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td className="text-end">₹00</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td className="text-end">₹-100</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <th className="text-end">₹3500</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="checkout-action-btn">
                                        <a href="index.php?page=checkout" className="btn course-action-btn-prime w-100">Pay Now</a>
                                    </div>
                                    <div className="checkout-discount-coupon d-flex">
                                        <input type="text" id="DiscountInput" name="DiscountInput" className="form-control w-100 me-3" placeholder="Discount Code" />
                                        <button type="button" className="btn checkout-discount-btn">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default Checkout;