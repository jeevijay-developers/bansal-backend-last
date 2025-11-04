const MyAddress = () => {
  return (
    <>
      <div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h3 className="sub-heading text-dark mb-0">My Address</h3>
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#AddAddress"
            className="btn dashboard-white-btn-small"
          >
            + Add New Address
          </button>
        </div>
        <div className="my-address-card">
          <div className="my-address-card-top">
            <i className="fa-solid fa-location-dot" />
            <div className="my-address-content">
              <p>Ram </p>
              <span>
                {" "}
                D 150 ADARSH NAGER <br />
                Jaipur&nbsp;-&nbsp;302004 Rajasthan <br />
                Mobile:&nbsp;8947841416
              </span>
            </div>
          </div>
          <div className="my-address-card-bottom">
            <button className="btn my-address-remove-btn">Remove</button>
            <button
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#EditAddress"
              className="btn my-address-edit-btn"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAddress;
