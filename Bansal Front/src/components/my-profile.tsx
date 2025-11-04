const MyProfile = ({ set }: { set: any }) => {
  return (
    <>
      <div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h3 className="sub-heading text-dark mb-0">My Profile</h3>
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#EditProfile"
            className="btn dashboard-white-btn-small"
          >
            <i className="fa-solid fa-pen-to-square" /> Edit
          </button>
        </div>
        <div className="checkout-form p-0">
          <div className="row">
            <div className="col-md-4 mb-4">
              <label className="form-label">Namess</label>
              <p className="my-profile-details-text">{set.name || 'User'}</p>
            </div>
       
            <div className="col-md-4 mb-4">
              <label className="form-label">Email Address</label>
              <p className="my-profile-details-text">{set.email || ''}</p>
            </div>
            <div className="col-md-4 mb-4">
              <label className="form-label">Mobile Number</label>
              <p className="my-profile-details-text">{set.mobile || 'User'}</p>
            </div>
            {/* <div className="col-md-12 mb-4">
              <label className="form-label">Address</label>
              <p className="my-profile-details-text">Asalpur-jobner, Jaipur</p>
            </div> */}
            {/* <div className="col-md-6 mb-4">
              <label className="form-label">Country</label>
              <p className="my-profile-details-text">India</p>
            </div> */}
            <div className="col-md-6 mb-4">
              <label className="form-label">State</label>
              <p className="my-profile-details-text">Rajasthan</p>
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">City</label>
              <p className="my-profile-details-text">{set.city || 'User'}</p>
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">Pin code</label>
              <p className="my-profile-details-text">303604</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
