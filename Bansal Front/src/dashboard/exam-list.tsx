import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";

// Interfaces
interface ExamItem {
  id: number;
  test_name: string;
  no_of_question: number | null;
  marks: number;
  duration_test: string;
  test_type: "free" | "paid";
  test_location: string;
  category?: "Pending" | "Complete"; // Optional if not using filter
  start_date_time: string;
  end_date_time: string;
  test_slug?: string;
  is_start: boolean;
  is_completed: boolean;
  is_expired: boolean;
  is_result: boolean;
  is_attempted: boolean;
  is_open: boolean;
  is_close: boolean;
}

interface TestSeries {
  id: number;
  name: string;
}

const Tests: React.FC = () => {
  const [examList, setExamList] = useState<ExamItem[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries | null>(null);
  const [loading, setLoading] = useState(false);

  const { token, logout } = useAuthStore();
  const { id } = useParams<{ id: string }>();

  const decodedId = id ? atob(id) : ""; // fallback if id is undefined
  const decodedNumber = decodedId ? parseInt(decodedId, 10) : 0;
  console.log(decodedNumber);
  useEffect(() => {
    fetchExams();
  }, [decodedNumber, token, logout]);

  const fetchExams = async () => {
    if (!decodedNumber) {
      console.error("Invalid test_series_id");
      return;
    }

    setLoading(true);
    try {
      const resp = await postApi(
        APIPATH.examListApi,
        { test_series_id: decodedNumber },
        token,
        logout
      );
      console.log("API Response:", resp);

      if (!resp || typeof resp !== "object") {
        throw new Error("Invalid API response");
      }

      const { success, exams, data } = resp;
      setTestSeries(data);
      if (success) {
        setExamList(exams);
      } else {
        console.error("API Error");
      }
    } catch (error) {
      console.error("Fetch Exams Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <section>
        <div className="course-study-top">
          <div className="container">
            <div className="course-study-top-align">
              <div>
                {testSeries && (
                  <>
                    <h1 className="sub-heading mb-2">{testSeries.name}</h1>
                    <p className="text mb-0 text-secondary">Test Series</p>
                  </>
                )}
              </div>
              <Link to="/dashboard/my-test-series" className="back-to-dash-btn btn">
                <i className="fa-solid fa-house-chimney" />
                {" "}
                Back Home
              </Link>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-xl-6">
            <div className="course-study-page test-study-page">
              <div className="container">
                <ul className="test-series-price-nav-list">
                  {examList.map((test) => (
                    <li key={test.id} className="test-serieslist-card test-study-card1">
                      <h4>{test.test_name}</h4>
                      <div className="tslc-footer-align">
                        <div className="tslc-specific-tags">
                          <span>
                            <i className="fa-regular fa-circle-question" />
                            {" "}
                            {test.no_of_question || 0} Questions
                          </span>
                          <span>
                            <i className="fa-regular fa-file-lines" />
                            {" "}
                            {test.marks} Marks
                          </span>
                          <span>
                            <i className="fa-regular fa-clock" />
                            {" "}
                            {test.duration_test} mins
                          </span>
                        </div>

                        {test.no_of_question && test.no_of_question > 0 ? (
                          <>
                            {test.is_open && !test.is_attempted && (
                              <Link
                                to={`/dashboard/exam-intro/${btoa(String(test.id))}`}
                                className="btn secondary-btn green-start-btn"
                              >
                                Start Now
                              </Link>
                            )}

                            {test.is_attempted && (
                              <button className="btn btn-secondary" disabled>
                                Attempted
                              </button>
                            )}

                            {!test.is_open && !test.is_completed && (
                              <button className="btn btn-warning" disabled>
                                Not Started
                              </button>
                            )}

                            {test.is_completed && !test.is_attempted && (
                              <button className="btn btn-danger" disabled>
                                Expired
                              </button>
                            )}

                            {test.is_completed && test.is_attempted && (
                              <Link
                                to={`/test/result/${btoa(String(test.id))}`}
                                className="btn btn-primary"
                              >
                                View Result
                              </Link>
                            )}
                          </>
                        ) : (
                          <span>No questions</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tests;
