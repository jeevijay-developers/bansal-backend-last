const AddAddress = () => {
  return (
    <>
      <div
        className="offcanvas offcanvas-end custom-offcanvas"
        tabIndex={-1}
        id="AddAddress"
      >
        <div className="offcanvas-header">
          <h5>Add New Address</h5>
          <button
            type="button"
            className="cuustom-close-btn"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="fa-regular fa-circle-xmark" />
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="checkout-form p-0">
            <div className="row">
              <div className="col-md-12 mb-4">
                <label htmlFor="FirstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  className="form-control"
                  placeholder="Enter First Name"
                />
              </div>
              <div className="col-md-12 mb-4">
                <label htmlFor="LastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  className="form-control"
                  placeholder="Enter Last Name"
                />
              </div>
              <div className="col-md-12 mb-4">
                <label htmlFor="AddressInput" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="AddressInput"
                  name="AddressInput"
                  className="form-control"
                  placeholder="Enter Address"
                />
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="CountrySelect" className="form-label">
                  Country
                </label>
                <select
                  name="CountrySelect"
                  id="CountrySelect"
                  className="form-select form-control"
                >
                  <option value = '' disabled selected>
                    Select country
                  </option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="StateSelect" className="form-label">
                  State
                </label>
                <select
                  name="StateSelect"
                  id="StateSelect"
                  className="form-select form-control"
                >
                  <option value = '' disabled selected>
                    Select state
                  </option>
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
              <div className="col-md-6 mb-4">
                <label htmlFor="CitySelect" className="form-label">
                  City
                </label>
                <select
                  name="CitySelect"
                  id="CitySelect"
                  className="form-select form-control"
                >
                  <option value='' disabled selected>
                    Select city
                  </option>
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
              <div className="col-md-6 mb-4">
                <label htmlFor="PinInput" className="form-label">
                  Pin code
                </label>
                <input
                  type="number"
                  id="PinInput"
                  name="PinInput"
                  className="form-control hide-number-arrow"
                  placeholder="Pin Code"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="offcanvas-footer">
          <div className="filter-offcanvas-action-group">
            <a
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              className="btn course-action-btn-prime w-100"
            >
              Save
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAddress;
{
  /* <script>
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
</script> */
}
