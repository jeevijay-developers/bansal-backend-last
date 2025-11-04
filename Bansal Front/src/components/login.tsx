import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from './ModalContext';
import { useLogin } from '../store/auth/authServices';
import { useAuthStore } from '../store/auth/authStore';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onRequestOTP: (phone: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onRequestOTP }) => {
  const { mutate, data, error, isError } = useLogin();
  const { setLogin, setUserDetails, setToken } = useAuthStore();
    const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { openRegister } = useModal();

  const formik = useFormik({
    initialValues: {
      countryCode: "+91",
      mobile: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number')
        .required('Mobile number is required'),
    }),
    onSubmit: (values) => {
      // setLoading(true)
      console.log(values, 'datadata')
      mutate({
        mobileNumber: values.mobile,
      });
    },
  });
  useEffect(() => {
    console.log(data, 'datadata')
    if (data) {
        console.log(data), 'fadsfadsf'; 
        setLoading(false);
        if (data.success) {
            onRequestOTP(`${data.mobile}`);
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    }
  }, [data, setLogin, setToken, setUserDetails]);
  useEffect(() => {
    if (isError && error) {
      setLoading(false);
      toast.error(error.response?.data.error);
    }
  }, [isError, error]);
  return (
    <Modal
      className="modal fade custom-modal"
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Body>
        <button
          type="button"
          className="cuustom-close-btn custom-modal-close btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-regular fa-circle-xmark"></i>
        </button>
        <div className="custom-modal-body text-center">
          <img src="/assets/img/logo.png" alt="Logo" className="img-fluid mx-auto d-block login-modal-logo" />
          <div>
            <h2 className="login-heading text-dark pb-4 mb-4">
              Experience Your True Growth With Focused <br />
              <span className="center-yellow-span text-primary pb-2">Personal Attention.</span>
            </h2>
            <p className="login-input-heading mb-4">Login With Mobile Number</p>
            <Form className="login-form" onSubmit={formik.handleSubmit}>
              <div className="login-input-group mb-3 d-flex gap-2 justify-content-center">
                <Form.Select
                  name="countryCode"
                  className="login-ccode-select"
                  value={formik.values.countryCode}
                  onChange={formik.handleChange}
                  style={{ maxWidth: '6rem' }}
                >
                  <option defaultValue="+91">+91</option>

                </Form.Select>
                {/* <span className="input-group-text">+91</span> */}
                <Form.Control
                  type="tel"
                  name="mobile"
                  className="login-number-input form-control hide-number-arrow"
                  placeholder="Mobile Number"
                  value={formik.values.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    formik.setFieldValue('mobile', val);
                  }}
                  isInvalid={!!formik.errors.mobile && formik.touched.mobile}
                />
                <Button type="submit" className="login-action-btn d-flex align-items-center" disabled={loading} >
                  <i className="fa-solid fa-arrow-right" />
                </Button>
              </div>
              {formik.errors.mobile && formik.touched.mobile && (
                <div className="text-danger text-sm">{formik.errors.mobile}</div>
              )}
            </Form>
            <p className="text mb-3 text-center">
              Don’t have an account? {" "}
              <a
                type="button"
                onClick={openRegister}
                className="text-decoration-underline text-primery text-decoration-none"
              >
                
                Sign up
              </a>
            </p>
          </div>
          <p className="login-text text-center">
            By continuing, you agree to our <br />
            <a href="#">Terms & Conditions</a> and the <a href="#">Privacy Policy</a>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
