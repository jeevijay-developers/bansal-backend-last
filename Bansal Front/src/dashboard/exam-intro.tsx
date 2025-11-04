// <!-- remove footer, header from test page -->
// <style>
//     footer{
//         display: none;
//     }
//     header{
//         display: none;
//     }
// </style>

import { Link ,useParams, useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth/authStore.ts";
import { APIPATH } from "../api/urls.ts";
import { postApi } from "../services/services.ts";
// import logo from '../assets/img/logo.png';
// import dashbaordAvatar from "../assets/img/dashboard-img/profile.png";

import LoaderWithBackground from '../components/LoaderWithBackground.tsx'
// interface UserProfile {
//   name: string;
//   mobile: string;
// }

const ExamIntro = () => {
  const { token, logout } = useAuthStore(); // ✅ Moved inside component
  // const [userProfile, setUserProfile] = useState<UserProfile>({
  //   name: "User",
  //   mobile: "",
  // });


  const { id } = useParams<{ id: string }>();

  const decodedId = id ? atob(id) : ""; // fallback if id is undefined
  const decodedNumber = parseInt(decodedId, 10);
  useEffect(() => {
    //fetchProfile();
    getTestData(); // ← You forgot the parentheses
  }, []);
const navigate = useNavigate(); // ✅ Now `navigate` is available
  const [loading, setLoading] = useState(false);
  const [liveTestData, setLiveTestData] = useState<any>(null);
  // const fetchProfile = async () => {
  //   try {
  //     console.log("Fetching Profile with token:", token);
  //     const res = await postApi(APIPATH.myProfile, {}, token, logout);
  //     console.log("API Response:", res);

  //     if (res.status && res.data) {
  //       setUserProfile({
  //         name: res.data.name || "User",
  //         mobile: res.data.mobile || "",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch profile", error);
  //   }
  // };


  const getTestData = () => {
    setLoading(true);
    postApi(APIPATH.examDetailsApi, { exam_id: decodedNumber, user_id: 8 }, token, logout)
      .then((resp) => {
        const {data} = resp;
        
       if (data.is_attempted) {
          navigate(`/dashboard/exam-result/${id}`); // ✅ Now this will work
        }

        setLiveTestData(data);
        
       
      })
      .catch((err) => console.log(err)).finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <LoaderWithBackground visible={loading} />
      <style>{`footer { display: none!important; }`}</style>
      <style>{`header.main-header { display: none; }`}</style>

      <div>
        <header>
          <div className="dashboard-header">
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
              <div className="container-fluid">
                
                {/* <Link className="navbar-brand" to="/">
                  <img src={logo} alt="logo-png" className="img-fluid" />
                </Link> */}
              </div>
            </nav>
          </div>
        </header>
 <div className="test-page-header">
                    <div className="container-fluid test-page-container">
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                            <h4 className="text text-dark mb-0 font-500">{ liveTestData?.test_name }</h4>
                            <Link className="navbar-brand ms-auto" to="/dashboard">
                                <img src="/assets/img/logo.png" alt="logo-png" className="img-fluid" />
                            </Link>
                        </div>
                    </div>
                </div>
    <div className="test-info-page">
                    <div className="test-left-menu">
                        <div className="test-left-menu-scrolls">
                            {/* <Link to=" " type="button" onClick={() => navigate(-1)} className="text text-decoration-none text-dark font-500 mb-4">
                                <i className="fa-solid fa-arrow-left" />
                                Back
                            </Link> */}
                           
                           <div className="live-test-cards">
                  <p>Duration: {liveTestData?.duration_test || "N/A"} Mins</p>
                  <p>No of questions: {liveTestData?.no_of_question || 0}</p>
                </div>
                            <h3 className="sub-heading mb-4">Read The Following Instructions Carefully.</h3>
                          <div dangerouslySetInnerHTML={{ __html: liveTestData?.instruction || "N/A" }} />
                            
                        </div>
                        <div className="test-left-card-bottom">
                            <div className="test-condition-agree-card">
                                <div className="form-check mb-3">
                                    <input className="form-check-input form-check-prime" type="checkbox" required defaultValue='' id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        I have read all the instructions carefully and have understood them. I agree not to
                                        cheat or use unfair means in this examination. I understand that using unfair means of
                                        any sort for my own or someone else’s advantage will lead to my immediate
                                        disqualification.
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">



  <Link to={`/dashboard/exam-live/${id}`} className="text-right-btm-btn">
                  I am ready to begin
                  </Link>
                            </div>
                        </div>
                    </div>
                    {/* <div className="test-right-menu d-none d-md-block">
                        <div className="test-right-menu-card">
                            <div className="test-profile-img">
                                <img src="/assets/img/profile-img.png" alt="#" className="img-fluid" />
                            </div>
                            <p className="user-name text-center">Hi, Jhon</p>
                            <p className="text font-500 text-center">+91 12345 01201</p>
                        </div>
                    </div> */}
                </div>
      </div>
    </>
  );
};

export default ExamIntro;

// const TestStart2 = () => {
//     const navigate = useNavigate()
//     return (
//         <>
//             <section>
//                 <div className="test-page-header">
//                     <div className="container-fluid test-page-container">
//                         <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
//                             <h4 className="text text-dark mb-0 font-500">Features for World-Class Physics</h4>
//                             <Link className="navbar-brand ms-auto" to="/dashboard">
//                                 <img src="/assets/img/logo.png" alt="logo-png" className="img-fluid" />
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="test-info-page">
//                     <div className="test-left-menu">
//                         <div className="test-left-menu-scrolls">
//                             <Link to=" " type="button" onClick={() => navigate(-1)} className="text text-decoration-none text-dark font-500 mb-4">
//                                 <i className="fa-solid fa-arrow-left" />
//                                 Back
//                             </Link>
//                             <h3 className="sub-heading mb-4">Live Test</h3>
//                             <div className="live-test-cards">
//                                 <p>Duration: 10 Mins</p>
//                                 <p>Maximum Marks: 20</p>
//                             </div>
//                             <h3 className="sub-heading mb-4">Read The Following Instructions Carefully.</h3>
//                             <p className="text">
//                                 1.Read the following instructions carefully.
//                                 <br /> 2.Each question has 4 options out of which only one is correct.
//                                 <br /> 3.You have to finish the test in 10 minutes.
//                                 <br /> 4.Try not to guess the answer as there is negative marking.
//                                 <br /> 5.You will be awarded 1&nbsp;mark for each correct answer and 0.33&nbsp;marks will be deducted for each wrong&nbsp;answer.
//                                 <br /> 6.There is no negative marking for the questions that you have not attempted.
//                                 <br /> 7.Make sure that you complete the&nbsp;test before you submit the test and/or close the browser.
//                             </p>
//                         </div>
//                         <div className="test-left-card-bottom">
//                             <div className="test-condition-agree-card">
//                                 <div className="form-check mb-3">
//                                     <input className="form-check-input form-check-prime" type="checkbox" defaultValue='' id="flexCheckDefault" />
//                                     <label className="form-check-label" htmlFor="flexCheckDefault">
//                                         I have read all the instructions carefully and have understood them. I agree not to
//                                         cheat or use unfair means in this examination. I understand that using unfair means of
//                                         any sort for my own or someone else’s advantage will lead to my immediate
//                                         disqualification.
//                                     </label>
//                                 </div>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">

//                                 <Link to="/test/live" className="btn btn-primery ms-auto">
//                                     I am ready to begin
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                     {/* <div className="test-right-menu d-none d-md-block">
//                         <div className="test-right-menu-card">
//                             <div className="test-profile-img">
//                                 <img src="/assets/img/profile-img.png" alt="#" className="img-fluid" />
//                             </div>
//                             <p className="user-name text-center">Hi, Jhon</p>
//                             <p className="text font-500 text-center">+91 12345 01201</p>
//                         </div>
//                     </div> */}
//                 </div>
//             </section>

//         </>
//     );
// }

// export default TestStart2;