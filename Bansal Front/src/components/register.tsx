import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postApi } from "../services/services";
import { APIPATH } from "../api/urls";
import { useAuthStore } from "../store/auth/authStore";
import { toast } from "react-toastify";
import { useModal } from "./ModalContext";
import { Link } from "react-router-dom";

interface FormValues {
  name: string;
  email: string;
  mobileNumber: string;
  city: string;
  center_id: string;
  class_id: string;
  registration_type: string;
  category_id: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  mobileNumber: "",
  city: "",
  center_id: "",
  class_id: "",
  registration_type: "",
  category_id: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: Yup.string().matches(/^\d{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
  city: Yup.string().required("City is required"),
  class_id: Yup.string().required("Please select a class"),
  category_id: Yup.string().required("Please select a stream"),
  registration_type: Yup.string().required("Please select registration type"),
});

const Register = ({ onRequestOTP }: any) => {
  const { token, logout } = useAuthStore();
  const [categories, setCategories] = useState([]);
  // const [selectCenter, setSelectCenter] = useState([]);
  const [streams, setStreams] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { openLogin, showRegister, closeRegister } = useModal();

  useEffect(() => {
    fetchCenters()
    postApi(APIPATH.getCategory, {}, token, logout)
      .then((resp) => {
        // console.log(resp, 'cat')
        const { success, data, message } = resp;
        if (success) {
          setCategories(data);
        } else {
          toast.error(message);
        }
      })
      .catch(console.log);
  }, []);
//   useEffect(() => {
//   if (values.registration_type === 'offline') {
//     fetchCenters();
//   } else {
//     setFieldValue('center_id', '');
//   }
// }, [values.registration_type]);

  const fetchClassesByCategory = (categoryId: string) => {
    if (!categoryId) return;
    setLoading(true);
    postApi(APIPATH.getClassesList, { category_id: categoryId }, token, logout)
      .then((resp) => {
        const { success, data, message } = resp;
        if (success) setStreams(data);
        else toast.error(message);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };
  const fetchCenters = () => {
    // if (!categoryId) return;
    setLoading(true);
    postApi(APIPATH.getOfflineCenter, {}, token, logout)
      .then((resp) => {
        // console.log(resp, 'resp')
        const { success, data, message } = resp;
        if (success) setCenterList(data);
        else toast.error(message);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    postApi(APIPATH.signup, values, token, logout)
      .then((resp) => {
        console.log(resp)
        const { success, mobile, message, error } = resp;
        if (success == true) {
          onRequestOTP(`${mobile}`);
          toast.success(message);
          closeRegister();
        } else toast.error(error);
      })
      .catch(console.log)
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal className="modal fade custom-modal" show={showRegister} onHide={closeRegister} centered backdrop="static" keyboard={false} size="lg">
      <Modal.Body>
        <button
          type="button"
          className="cuustom-close-btn custom-modal-close"
          onClick={closeRegister}
          aria-label="Close"
        >
          <i className="fa-regular fa-circle-xmark" />
        </button>
        <div className="custom-modal-body">
          <h2 className="login-heading text-dark pb-4 mb-4 w-100">
            <span className="center-yellow-span pb-3">Create Profile</span>
          </h2>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, isSubmitting,values }) => (
              <Form className="register-details-form">
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Name</label>
                    <Field name="name" className="form-control" placeholder="Enter Name" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Email</label>
                    <Field name="email" type="email" className="form-control" placeholder="Enter Email" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Mobile Number</label>
                    <Field name="mobileNumber" type="text" className="form-control" placeholder="Enter Mobile Number" />
                    <ErrorMessage name="mobileNumber" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">City</label>
                    <Field name="city" className="form-control" placeholder="Enter City" />
                    <ErrorMessage name="city" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Board</label>
                    <Field
                      as="select"
                      name="category_id"
                      className="form-select"
                      onChange={(e: any) => {
                        const selectedCategory = e.target.value;
                        setFieldValue("category_id", selectedCategory);
                        setFieldValue("class_id", "");
                        fetchClassesByCategory(selectedCategory);
                      }}
                    >
                      <option value="">Select Board</option>
                      {categories?.map((item: any, index) => (
                        <option key={item.id || index} value={item.id}>{item.category_name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="category_id" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Target</label>
                    <Field as="select" name="class_id" className="form-select">
                      <option value="">Select Class</option>
                      {streams.length > 0 ? (
                        streams.map((cls: any, index) => (
                          <option key={index} value={cls.id}>{cls.name}</option>
                        ))
                      ) : (
                        <option value="" disabled>{loading ? "Loading..." : "No classes available"}</option>
                      )}
                    </Field>
                    <ErrorMessage name="class_id" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label">Registration Type</label>
                    <Field as="select" name="registration_type" className="form-select">
                      <option value="">Select Type</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </Field>
                    <ErrorMessage name="registration_type" component="div" className="text-danger" />
                  </div>
                  {values.registration_type === 'offline'  && (
                    <div className="col-lg-6 mb-4">
                      <label className="form-label">Center</label>
                      <Field as="select" name="center_id" className="form-select">
                        <option value="">Select Center</option>
                        {centerList.length > 0 ? (
                          centerList.map((cls: any, index) => (
                            <option key={index} value={cls.id}>{cls.name}</option>
                          ))
                        ) : (
                          <option value="" disabled>{loading ? "Loading..." : "No classes available"}</option>
                        )}
                      </Field>
                      <ErrorMessage name="center_id" component="div" className="text-danger" />
                    </div>
                  )}

                </div>

                <button type="submit" className="btn login-verify-btn w-100 mb-4" disabled={isSubmitting}>
                  Submit
                </button>
                <p className="text-center">
                  Already have an account? <a type="button" onClick={openLogin} className="text-decoration-underline text-primery">Login</a>
                </p>
                <p className="login-text text-center">
                  By continuing, you agree to our <br />
                  <Link to="/terms-and-conditions">Terms & Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
