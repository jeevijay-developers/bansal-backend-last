import React, { useState } from 'react';
import LoaderWithBackground from './LoaderWithBackground';

interface Coupon {
  // coupons: any
  coupon_code: string;
  coupon_name: string;
  description: string;
  id: any;
}

interface CouponModalProps {
  show: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
  coupons: Coupon[];
  loading: boolean
}

const CouponModal: React.FC<CouponModalProps> = ({ show, onClose, onApply, coupons , loading }) => {
  // const [search, setSearch] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');

  const handleApply = () => {
    if (selectedCoupon) {
      onApply(selectedCoupon);
    }
  };
console.log(selectedCoupon, 'selectcoupen')
  // const filteredCoupons = coupons.filter(c =>
  //   c.coupon_code.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <>
    <LoaderWithBackground visible = {loading}/>
  <div
      className={`modal fade apply-copn-modal ${show ? 'show d-block' : ''}`}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden={!show}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Select Coupon
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="my-coupns-modal">
              <div className="d-flex gap-1 mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Enter Coupon Code"
                  aria-label="Enter Coupon Code"
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                />
                <button type="button" className="btn btn-aply-cpn-modal" onClick={handleApply}>
                  Apply
                </button>
              </div>

              <div className="select-coupen-check mb-4">
                {coupons.map((coupon) => (
                  <div className="select-cpn-crad" key={coupon.id}>
                    <div className="mb-4">
                      <input
                        type="radio"
                        className="btn-check couponDiscount"
                        name="options-outlined"
                        id={`coupon-${coupon.id}`}
                        autoComplete="off"
                        checked={selectedCoupon === coupon.coupon_code}
                        onChange={() => setSelectedCoupon(coupon.coupon_code)}
                      />
                      <label
                        className="btn aply-btn-cpn-code"
                        htmlFor={`coupon-${coupon.id}`}
                      >
                        <p className="cpncode-title">{coupon.coupon_name}</p>
                        <p className="cpncode mb-0">
                          Coupon Code : <span className="code-cpn">{coupon.coupon_code}</span>
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  
  );
};

export default CouponModal;
