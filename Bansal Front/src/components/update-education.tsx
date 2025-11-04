const UpdateEducation = () => {
  return (
    <>
      <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex={-1} id="EducationModal">
        <div className="offcanvas-header">
          <h5>Update Educationsss</h5>
          <button type="button" className="cuustom-close-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-regular fa-circle-xmark" /></button>
        </div>
        <div className="offcanvas-body">
          <form action=''>
            <div className="filter-inputs mb-3">
              <label htmlFor="TragetBadge" className="form-label">Target Exams</label>
              <div>
                <input type="radio" className="btn-check" name="TragetBadgeBtn" id="TragetBadge" autoComplete="off" defaultChecked />
                <label className="btn target-badges-btn" htmlFor="TragetBadge">JEE</label>
                <input type="radio" className="btn-check" name="TragetBadgeBtn" id="TragetBadge2" autoComplete="off" />
                <label className="btn target-badges-btn" htmlFor="TragetBadge2">NEET</label>
                <input type="radio" className="btn-check" name="TragetBadgeBtn" id="TragetBadge3" autoComplete="off" />
                <label className="btn target-badges-btn" htmlFor="TragetBadge3">JEE</label>
              </div>
            </div>
            <div className="filter-inputs mb-3">
              <label htmlFor="EducationBoard" className="form-label">Board</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="EducationBoard" name="EducationBoard" />
                <label className="form-check-label" htmlFor="EducationBoard">
                  NCRT
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="EducationBoard1" name="EducationBoard" />
                <label className="form-check-label" htmlFor="EducationBoard1">
                  CBSE
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="EducationBoard2" name="EducationBoard" defaultChecked />
                <label className="form-check-label" htmlFor="EducationBoard2">
                  IB
                </label>
              </div>
            </div>
            <div className="filter-inputs mb-3">
              <label htmlFor="ClassBadge" className="form-label">Class</label>
              <div>
                <input type="radio" className="btn-check" name="ClassBadgeBtn" id="ClassBadge" autoComplete="off" defaultChecked />
                <label className="btn target-badges-btn" htmlFor="ClassBadge">Class-5</label>
                <input type="radio" className="btn-check" name="ClassBadgeBtn" id="ClassBadge2" autoComplete="off" />
                <label className="btn target-badges-btn" htmlFor="ClassBadge2">Class-6</label>
                <input type="radio" className="btn-check" name="ClassBadgeBtn" id="ClassBadge3" autoComplete="off" />
                <label className="btn target-badges-btn" htmlFor="ClassBadge3">Class-12</label>
              </div>
            </div>
          </form>
        </div>
        <div className="offcanvas-footer">
          <div className="filter-offcanvas-action-group">
            <a type="button" data-bs-dismiss="offcanvas" aria-label="Close" className="btn course-action-btn-prime w-100">Update</a>
          </div>
        </div>
      </div>

    </>
  );
}

export default UpdateEducation;
{/* <script>
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
</script> */}