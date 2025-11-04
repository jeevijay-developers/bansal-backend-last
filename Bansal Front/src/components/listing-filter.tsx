const ListingFilter = () => {
    return (
        <>
            <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex={-1} id="ListingFilter">
                <div className="offcanvas-header">
                    <h5>Filter</h5>
                    <button type="button" className="cuustom-close-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-regular fa-circle-xmark" /></button>
                </div>
                <div className="offcanvas-body">
                    <form action = ''>
                        <div className="filter-inputs mb-3">
                            <label htmlFor="TargetExams" className="form-label">Target Exams</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="TargetExams" name="TargetExams" />
                                <label className="form-check-label" htmlFor="TargetExams">
                                    JEE
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="TargetExams1" name="TargetExams1" defaultChecked />
                                <label className="form-check-label" htmlFor="TargetExams1">
                                    NEET
                                </label>
                            </div>
                        </div>
                        <div className="filter-inputs mb-3">
                            <label htmlFor="Board" className="form-label">Board</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="Board" name="Board" />
                                <label className="form-check-label" htmlFor="Board">
                                    NCRT
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="Board1" name="Board" />
                                <label className="form-check-label" htmlFor="Board1">
                                    CBSE
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="Board2" name="Board" defaultChecked />
                                <label className="form-check-label" htmlFor="Board2">
                                    CBSE
                                </label>
                            </div>
                        </div>
                        <div className="filter-inputs mb-3">
                            <label htmlFor="Class" className="form-label">Class</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class" name="Class" />
                                <label className="form-check-label" htmlFor="Class">
                                    Class-1
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class1" name="Class1" defaultChecked />
                                <label className="form-check-label" htmlFor="Class1">
                                    Class-2
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class2" name="Class2" />
                                <label className="form-check-label" htmlFor="Class2">
                                    Class-3
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class3" name="Class3" />
                                <label className="form-check-label" htmlFor="Class3">
                                    Class-4
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class4" name="Class4" />
                                <label className="form-check-label" htmlFor="Class4">
                                    Class-5
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Class5" name="Class5" />
                                <label className="form-check-label" htmlFor="Class5">
                                    Class-6
                                </label>
                            </div>
                        </div>
                        <div className="filter-inputs mb-3">
                            <label htmlFor="StudyMode" className="form-label">Mode Of Study </label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="StudyMode" name="StudyMode" />
                                <label className="form-check-label" htmlFor="StudyMode">
                                    Offline
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="StudyMode1" name="StudyMode" />
                                <label className="form-check-label" htmlFor="StudyMode1">
                                    Online
                                </label>
                            </div>
                        </div>
                        <div className="filter-inputs mb-3">
                            <label htmlFor="Discount" className="form-label">Discount</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Discount" name="Discount" />
                                <label className="form-check-label" htmlFor="Discount">
                                    20% Upto
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Discount1" name="Discount1" defaultChecked />
                                <label className="form-check-label" htmlFor="Discount1">
                                    30% Upto
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="Discount2" name="Discount2" />
                                <label className="form-check-label" htmlFor="Discount2">
                                    40% Upto
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="offcanvas-footer">
                    <div className="filter-offcanvas-action-group">
                        <button type="button" className="btn course-action-btn-white">Clear</button>
                        <button type="button" className="btn course-action-btn-prime">Apply</button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ListingFilter;

