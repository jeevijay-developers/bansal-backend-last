import { useFormik } from 'formik';
import * as Yup from 'yup';

const ContactCenter = () => {
  const formik = useFormik({
    initialValues: {
      ContactFullName: '',
      ContactEmailAddress: '',
      ContactMobileNumber: '',
      ContactBoardName: '',
      ContactTargetName: '',
      ContactMessage: '',
    },
    validationSchema: Yup.object({
      ContactFullName: Yup.string()
        .required('Full name is required')
        .min(2, 'Must be at least 2 characters'),
      ContactEmailAddress: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      ContactMobileNumber: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Must be a 10-digit number'),
      ContactBoardName: Yup.string().required('Board selection is required'),
      ContactTargetName: Yup.string().required('Target selection is required'),
      ContactMessage: Yup.string().required('Message is required'),
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
      // Your API call logic goes here
    },
  });

  return (
    <section>
      <div className="contact-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-5 col-xl-6 col-xl-5 mb-4">
              <h2 className="heading mb-4">
                Experience Personalized Guidance - <span> Visit Our Centre Today</span>.
              </h2>
              <ul className="our-video-list">
                <li>Take a tour of our centre and experience our interactive classes firsthand.</li>
                <li>Get free one-on-one counselling to help you choose the right course.</li>
                <li>Visit us and unlock exclusive discounts available for a limited time.</li>
              </ul>
            </div>
            <div className="col-md-7 col-xl-6 mb-4">
              <div className="contactus-form register-details-form">
                <h3 className="contact-form-heading">Connect With Us</h3>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-md-12 mb-3">
                      <label htmlFor="ContactFullName" className="form-label">Full Name</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          name="ContactFullName"
                          id="ContactFullName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ContactFullName}
                        />
                        <span className="input-group-text text-dark"><i className="fa-solid fa-user" /></span>
                      </div>
                      {formik.touched.ContactFullName && formik.errors.ContactFullName && (
                        <div className="text-danger">{formik.errors.ContactFullName}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-lg-6 mb-3">
                      <label htmlFor="ContactEmailAddress" className="form-label">Email Address</label>
                      <div className="input-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Email Address"
                          name="ContactEmailAddress"
                          id="ContactEmailAddress"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ContactEmailAddress}
                        />
                        <span className="input-group-text text-dark"><i className="fa-solid fa-envelope" /></span>
                      </div>
                      {formik.touched.ContactEmailAddress && formik.errors.ContactEmailAddress && (
                        <div className="text-danger">{formik.errors.ContactEmailAddress}</div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="col-lg-6 mb-3">
                      <label htmlFor="ContactMobileNumber" className="form-label">Mobile Number</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control hide-number-arrow"
                          placeholder="Enter Mobile Number"
                          name="ContactMobileNumber"
                          id="ContactMobileNumber"
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            formik.setFieldValue('ContactMobileNumber', val);
                          }}
                          onBlur={formik.handleBlur}
                          value={formik.values.ContactMobileNumber}
                        />
                        <span className="input-group-text text-dark"><i className="fa-solid fa-phone" /></span>
                      </div>
                      {formik.touched.ContactMobileNumber && formik.errors.ContactMobileNumber && (
                        <div className="text-danger">{formik.errors.ContactMobileNumber}</div>
                      )}
                    </div>

                    {/* Board */}
                    <div className="col-sm-6 mb-3">
                      <label htmlFor="ContactBoardName" className="form-label">Board</label>
                      <select
                        className="form-select form-control"
                        id="ContactBoardName"
                        name="ContactBoardName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ContactBoardName}
                      >
                        <option value="">Select Board</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      {formik.touched.ContactBoardName && formik.errors.ContactBoardName && (
                        <div className="text-danger">{formik.errors.ContactBoardName}</div>
                      )}
                    </div>

                    {/* Target */}
                    <div className="col-sm-6 mb-3">
                      <label htmlFor="ContactTargetName" className="form-label">Target</label>
                      <select
                        className="form-select form-control"
                        id="ContactTargetName"
                        name="ContactTargetName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ContactTargetName}
                      >
                        <option value="">Select Target</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      {formik.touched.ContactTargetName && formik.errors.ContactTargetName && (
                        <div className="text-danger">{formik.errors.ContactTargetName}</div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="col-md-12 mb-3">
                      <label htmlFor="ContactMessage" className="form-label">Write Message</label>
                      <div className="input-group">
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Enter Message"
                          name="ContactMessage"
                          id="ContactMessage"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ContactMessage}
                        />
                        <span className="input-group-text"><i className="fa-solid fa-pen" /></span>
                      </div>
                      {formik.touched.ContactMessage && formik.errors.ContactMessage && (
                        <div className="text-danger">{formik.errors.ContactMessage}</div>
                      )}
                    </div>

                    <div className="col-md-12">
                      <button type="submit" className="ms-auto btn btn-primery d-block">
                        Book Free Consultancy
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCenter;
