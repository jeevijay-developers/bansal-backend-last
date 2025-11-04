
import MyCourse from "../components/my-course";
import MyProfile from "../components/my-profile";
import { Link } from "react-router-dom";
import UpdateEducation from "../components/update-education";
import LoaderWithBackground from "../components/LoaderWithBackground";
import { useEffect, useState } from "react";
import { postApi } from "../services/services";
import { APIPATH} from "../api/urls";

import { useAuthStore } from "../store/auth/authStore";
const Dashboard = () => {
 
  const [orderList, setOrderList] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuthStore();

  useEffect(() => {
    fetchCenters();
      getProfile();
      
  }, []);

 const fetchCenters = async () => {
  setLoading(true);
  try {
    const resp = await postApi(APIPATH.myCourse, {}, token, logout);

    const orders = resp.orders.map((item: any) => ({
      id: item.id.toString(),
      course_name: item.course_name,
      badge: item.order_status, // or 'active', 'complete', etc.
      orderId: item.order_id,
      enrolledDate: item.purchase_date,
      course_expired_date: item.course_expired_date,
      expired_date: item.expired_date,
      created_at: item.created_at,
       course_id: item.course_id,
      endDate: item.course_expired_date,
      image: item.course_image,
      purchase_date: item.purchase_date,
      subjects: item.subjects?.map((sub: any) => sub.subject_name) || [],
    }));

    setOrderList(orders); // ✅ now an array, not a string
  } catch (error) {
    console.error("Error fetching course:", error);
  } finally {
    setLoading(false);
  }
};
    const getProfile = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.myProfile, {}, token, logout);
      console.log(resp, "resp");
      const { success, user } = resp;
      if (success) {
        setUser(user);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <UpdateEducation />

      <section>
        <div className="dashboard-bg">
          <div className="container">
            <div className="dashboard-hero-section">
              <div className="dashboard-left-profile-card">
                <div className="dashboard-profile-align">
                  <img
                    src="/assets/img/profile-img.png"
                    alt="Profile"
                    className="img-fluid"
                    id="PropImage"
                  />
                  <input type="file" className="btn-check" id="Profile-updater" accept="image/*" />
                  <label className="btn btn-profile-update" htmlFor="Profile-updater">
                    <i className="fa-solid fa-pen-to-square" />
                  </label>
                </div>
                <div>
                  <h4>Hello, {`${user?.name}`}</h4>
                  <p className="text mb-0">+91 {`${user?.mobile}`}</p>
                </div>
              </div>

              <div className="dashboard-right-card">
                <div>
                  <h3 className="text mb-2">Board</h3>
                  <p>{`${user?.category_name}`}</p>
                </div>
                <div>
                  <h3 className="text mb-2">Class</h3>
                  <p>{`${user?.class_name}`}</p>
                </div>
               {user?.center_name && (
                  <div>
                    <h3 className="text mb-2">Center</h3>
                    <p>{user.center_name}</p>
                  </div>
                )}
              
              </div>
            </div>

            <div className="dashboard-card">
               <div className="dashboard-menu-card">
                <div
                  className="dashboard-menu-list"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <Link to="/dashboard" className="dashboard-menu-link active ">
                    <i className="fa-solid fa-book me-2" />
                    My Courses
                  </Link>

                  <Link to="/dashboard/my-profile" className="dashboard-menu-link ">
                    <i className="fa-solid fa-book me-2" />
                    My Profile
                  </Link>

                  <Link to="/dashboard/my-test-series" className="dashboard-menu-link">
                    <i className="fa-solid fa-book me-2" />
                    My Test Series
                  </Link>

                   <Link to="/dashboard/my-live-test" className="dashboard-menu-link">
                    <i className="fa-solid fa-book me-2" />
                    My Live Test
                  </Link>
                </div>
              </div>

              <div className="dashboard-page-card">
                <div className="tab-content" id="v-pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-menu1"
                    role="tabpanel"
                    aria-labelledby="pills-menu1-tab"
                  >
        
                    {orderList ? <MyCourse set={orderList} /> : <div>Loading...</div>}
                  </div>

                  <div
                    className="tab-pane fade"
                    id="pills-menu2"
                    role="tabpanel"
                    aria-labelledby="pills-menu2-tab"
                  >
                    {user ? <MyProfile set={user} /> : <div>Loading...</div>}
                  </div>

                  {/* <div className="tab-pane fade" id="pills-menu3" role="tabpanel" aria-labelledby="pills-menu3-tab">03</div> */}

                

                  {/* <div
                    className="tab-pane fade"
                    id="pills-menu5"
                    role="tabpanel"
                    aria-labelledby="pills-menu5-tab"
                  >
                    <MyOrder />
                  </div> */}

                  {/* <div
                    className="tab-pane fade"
                    id="pills-menu6"
                    role="tabpanel"
                    aria-labelledby="pills-menu6-tab"
                  >
                    <MyAddress />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;