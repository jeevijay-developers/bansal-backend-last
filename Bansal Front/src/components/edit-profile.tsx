import { useEffect, useState } from "react";
import { postApi } from "../services/services";
import { APIPATH } from "../api/urls";
import { useAuthStore } from "../store/auth/authStore";
import LoaderWithBackground from "../components/LoaderWithBackground";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    category_id: "",
    class_id: "",
    registration_type: "",
    center_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [streams, setStreams] = useState([]);
  const [centerList, setCenterList] = useState([]);

  const { token, logout } = useAuthStore();

  useEffect(() => {
    getProfile();
    getCategory();
    fetchCenters();

  }, []);

  const getProfile = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.myProfile, {}, token, logout);
      const { success, user } = resp;
      if (success) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          city: user.city || "",
          category_id: user.category_id || "",
          class_id: user.class_id || "",
          registration_type: user.registration_type || "",
          center_id: user.center_id || "",
        });

        if (user.category_id) fetchClassesByCategory(user.category_id);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.getCategory, {}, token, logout);
      if (resp.success) {
        setCategories(resp.data);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassesByCategory = async (categoryId: string) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.getClassesList, { category_id: categoryId }, token, logout);
      if (resp.success) {
        setStreams(resp.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.getOfflineCenter, {}, token, logout);
      if (resp.success) {
        setCenterList(resp.data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {

    console.log('Handal');
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "category_id" ? { class_id: "" } : {}),
    }));

    if (name === "category_id") {
      fetchClassesByCategory(value);
    }
  };

 const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Basic validation
    const { name, email, mobile, city, category_id, class_id, registration_type, center_id } = formData;
    if (!name || !email || !mobile || !city || !category_id || !class_id || !registration_type) {
      alert("Please fill in all required fields.");
      return;
    }

    if (registration_type === "offline" && !center_id) {
      alert("Please select a center for offline registration.");
      return;
    }

    setLoading(true);
    try {
      const resp = await postApi(APIPATH.updateProfile, formData, token, logout);
      if (resp.success) {
        // alert("Profile updated successfully.");
        // ("#closeButton").target="click" closeButton 
        getProfile(); // Refresh updated data
      } else {
        alert(resp.message || "Profile update failed.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex={-1} id="EditProfile">
        <div className="offcanvas-header">
          <h5>Edit User Profile</h5>
          <button id="closeButton"
            type="button"
            className="cuustom-close-btn"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="fa-regular fa-circle-xmark" />
          </button>
        </div>

        <div className="offcanvas-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "City", name: "city", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="col-lg-12 mb-4">
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={`Enter ${label}`}
                  />
                </div>
              ))}

              <div className="col-lg-6 mb-4">
                <label className="form-label">Board</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Board</option>
                  {categories.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-6 mb-4">
                <label className="form-label">Target</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Class</option>
                  {streams.length > 0 ? (
                    streams.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {loading ? "Loading..." : "No classes available"}
                    </option>
                  )}
                </select>
              </div>

              <div className="col-lg-6 mb-4">
                <label className="form-label">Registration Type</label>
                <select
                  name="registration_type"
                  value={formData.registration_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {formData.registration_type === "offline" && (
                <div className="col-lg-6 mb-4">
                  <label className="form-label">Center</label>
                  <select
                    name="center_id"
                    value={formData.center_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Center</option>
                    {centerList.map((center: any) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="offcanvas-footer p-3">
              <button type="submit" className="btn course-action-btn-prime w-100" data-bs-dismiss="offcanvas"
            aria-label="Close">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
