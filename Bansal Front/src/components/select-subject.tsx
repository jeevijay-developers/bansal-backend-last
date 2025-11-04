// import { FC } from "react";
import { Link } from "react-router-dom";
import type { FC } from "react";

interface SelectSubProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: string[];
}

const SelectSub: FC<SelectSubProps> = ({ isOpen, onClose, subjects }) => {
  return (
    <div
      className={`modal custom-modal select-subject-modal ${isOpen ? 'show': ''}`}
      style={{ display: isOpen ? "block" : "none" }}
      tabIndex={-1}
      aria-hidden={!isOpen}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <img
              src="/assets/img/light-logo.png"
              alt="Logo"
              className="img-fluid select-subject-logo-align"
            />
            <div className="select-sub-top-align">
              <h2 className="select-subject-heading">JEE Nurture Online Course</h2>
              <button
                type="button"
                className="cuustom-close-btn"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="fa-regular fa-circle-xmark" />
              </button>
            </div>
            <h5 className="subject-heading-modal">Subjects</h5>
            <div className="select-subject-list">
              {subjects.map((subject, index) => (
                <Link
                  to="/study-materials"
                  key={index}
                  className="select-subject-link"
                >
                  {subject}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSub;
