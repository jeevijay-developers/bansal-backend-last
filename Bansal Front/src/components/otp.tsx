import React, {useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { useLogin, useVerifyOTP } from '../store/auth/authServices';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/auth/authStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from './ModalContext';
// import { postApi } from '../services/services';
// import { APIPATH } from '../api/urls';

interface OTPModalProps {
  show: boolean;
  onClose: () => void;
  phone: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ show, onClose, phone }) => {
  const [loading, setLoading] = useState(false);
   const { openLogin } = useModal();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  // const navigate = useNavigate();
  const { mutate: verifyOTP } = useVerifyOTP();
  const { setUserDetails, setToken, setLogin } = useAuthStore();
  const { mutate: resendOtp, isLoading: resendLoading } = useLogin();
  useEffect(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, []);
  const formik = useFormik({
    initialValues: {
      otp: ['', '', '', ''],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().matches(/^[0-9]$/, 'Enter a valid digit').required('Required'))
        .min(4, 'OTP must be 4 digits'),
    }),
    onSubmit: (values) => {
      const enteredOtp = values.otp.join('');
      console.log('Entered OTP:', enteredOtp);
      if (enteredOtp.length < 4) {
        toast.error("Please enter a 4-digit OTP.");
        return;
      }
      setLoading(true);
      verifyOTP(
        {
          mobileNumber: phone,
          otp: enteredOtp,
        },
        {
          onSuccess: (data: any) => {
            setLoading(false);
            if (data.success) {
              setLogin(true)
              setUserDetails(data.customer);
              setToken(data.access_token);
              toast.success(data.message || "OTP verified successfully!");
              // navigate("/dashboard");
              onClose();
            } else {
              toast.error(data.error || "OTP verification failed.");
            }
          },
          onError: (error: any) => {
            console.error("Error verifying OTP:", error);
            toast.error("Failed to verify OTP.");
            setLoading(false);
          },
        }
      );
    },
  });
const handleEdit = () => {
  openLogin()
}
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    formik.setFieldValue(`otp[${index}]`, value);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: any, index: any) => {
    if (e.key === "Backspace") {
      if (formik.values.otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      formik.setFieldValue(`otp[${index}]`, "");
    }
  };
  const handleResendOtp = () => {
    if (!phone) return;
    resendOtp(
      { mobileNumber: phone },
      {
        onSuccess: (res: any) => {
          if (res.success) {
            toast.success("OTP resent successfully.");
          } else {
            toast.error(res.message || "Failed to resend OTP");
          }
        },
        onError: (error: any) => {
          // const errMsg =
          //   err?.response?.data?.errors?.mobile?.[0] ||
          //   err?.response?.data?.message ||
          //   "Something went wrong!";
          toast.error(error.response?.data?.error);
        },
      }
    );
  };
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
          <img
            src="/assets/img/logo.png"
            alt="Logo"
            className="img-fluid mx-auto d-block login-modal-logo"
          />
          <div>
            <h2 className="login-heading text-dark pb-4 mb-4">
              <span className="center-yellow-span pb-2">Enter OTP</span>
            </h2>
            <p className="mb-4">
              We have sent an OTP to <strong>{phone}</strong>{" "}
              <a
                type="button"
                onClick={handleEdit}
                className="text-decoration-none text-primary"
              >
                <i className="fa-regular fa-pen-to-square"></i> Edit
              </a>
            </p>

            <Form onSubmit={formik.handleSubmit}>
              <div className="otp-inputs mb-4 d-flex gap-4 justify-content-center">
                {formik.values.otp.map((_, idx) => (
                  <Form.Control
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="text-center"
                    // ref={(el) => (inputRefs.current[idx] = el!)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current[idx] = el!)}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    value={formik.values.otp[idx]}
                    name={`otp[${idx}]`}
                    style={{ width: '3rem', fontSize: '1.5rem' }}
                  />
                ))}
              </div>
              {formik.errors.otp && formik.touched.otp && (
                <div className="text-danger">{formik.errors.otp}</div>
              )}

              <p>Didn’t get the OTP? {" "}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              </p>
              <Button
                type="submit"
                className="login-verify-btn mt-3"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;
