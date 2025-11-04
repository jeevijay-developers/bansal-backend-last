import { useEffect, useState } from "react";
import React from "react";
import { useAuthStore } from "../store/auth/authStore";
import { APIPATH } from "../api/urls";
import { postApi } from "../services/services";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { toast } from "react-toastify";
import LoaderWithBackground from "../components/LoaderWithBackground.tsx";
interface QuestionAttempt {
  id: string | number;
  is_skipped: boolean;
  is_correct: boolean;
  is_attempted:boolean;
  is_wrong: boolean;
}
const DashboardLiveTest = () => {
  const { token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [liveTestData, setLiveTestData] = useState<any>(null);

  const [questionData, setQuestionData] = useState<any>(null);
  //const [nextId, setNextId] = useState<any>(null);
  const [isNext, setIsNext] = useState<any>(null);
  const [previousId, setPreviousId] = useState<any>(null);
  const [questionSrNo, setQuestionSrNo] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [allAttempted, setAllAttempted] = useState("");
const [examAttempedHistory, setExamAttempedHistory] = useState<QuestionAttempt[]>([]);

const [totalAttempted, setTotalAttempted] = useState(0);
const [totalSkipped, setTotalSkipped] = useState(0);
// const [totalCorrect, setTotalCorrect] = useState(0);
// const [totalWrong, setTotalWrong] = useState(0);
const [totalPending, setTotalPending] = useState(0);
// const [progress, setProgress] = useState(0);



  // const [isLastQuestion, setIsLastQuestion] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const decodedId = atob(id || "");

  //const totalDuration = 3600; // fallback duration (1 hour)
  const [totalDuration, settotalDuration] = useState("");
  //const totalDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000) || 3600;

  const getInitialSecondsLeft = (): number => {
    const savedTime = localStorage.getItem(`secondsLeft-${decodedId}`);
    const savedRunning = localStorage.getItem(`isRunning-${decodedId}`);

    if (savedRunning === "false") {
      localStorage.setItem(`isRunning-${decodedId}`, "true");
      localStorage.setItem(
        `secondsLeft-${decodedId}`,
        totalDuration.toString()
      );
      localStorage.setItem(`spentSeconds-${decodedId}`, "0");
      return parseInt(totalDuration);
    }

    return savedTime ? parseInt(savedTime, 10) : parseInt(totalDuration);
  };

  const getInitialSpentSeconds = () => {
    const savedSpent = localStorage.getItem(`spentSeconds-${decodedId}`);
    return savedSpent ? parseInt(savedSpent) : 0;
  };
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    getInitialSecondsLeft()
  );
  const [spentSeconds, setSpentSeconds] = useState<number>(() =>
    getInitialSpentSeconds()
  );
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem(`secondsLeft-${decodedId}`, secondsLeft.toString());
  }, [secondsLeft]);

  useEffect(() => {
    localStorage.setItem(`spentSeconds-${decodedId}`, spentSeconds.toString());
  }, [spentSeconds]);

  useEffect(() => {
    localStorage.setItem(`isRunning-${decodedId}`, isRunning.toString());
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            localStorage.setItem(`isRunning-${decodedId}`, "false");
            localStorage.setItem(`secondsLeft-${decodedId}`, "0");
         //   handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
        setSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  // const handleStop = () => {
  //   setIsRunning(false);
  //   localStorage.setItem('isRunning', 'false');
  // };
  // const formatTime = (secs: number): string => {
  //   const minutes = Math.floor(secs / 60);
  //   const seconds = secs % 60;
  //   return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  // };

  // const formatTime = (totalSeconds: number) => {
  //   const hours = Math.floor(totalSeconds / 3600);
  //   const minutes = Math.floor((totalSeconds % 3600) / 60);
  //   const seconds = totalSeconds % 60;

  //   const parts = [];
  //   if (hours > 0) parts.push(`${hours} h`);
  //   if (minutes > 0) parts.push(`${minutes} min`);
  //   if (seconds > 0) parts.push(`${seconds} sec`);

  //   return parts.join(" ");
  // };
  useEffect(() => {
    getTestData();
    examAttempHistory();
  }, []);

  const getTestData = (questionId?: string) => {
    setLoading(true);
    const payload = questionId
      ? { test_id: decodedId, question_id: questionId }
      : { test_id: decodedId };
    postApi(APIPATH.getTestQuestion, payload, token, logout)
      .then((resp) => {
        const {
          success,
          live_test,
          question,
          //next_id,
          previous_id,
          question_sr_no,
          total_questions,
          student_answer,
          all_attempted,
         // is_last_question,
          is_next,
          is_result,
        } = resp;
        if (is_result) {
          if (resp.redirect_url == "practice-test-result") {
            navigate(`/dashboard/exam-result/${id}`);
          } else {
            navigate(`/dashboard/exam-result/${id}`);
          }
          // navigate(`/test-result/${id}`);
        }
        if (success) {
          console.log(live_test);
          setLiveTestData(live_test);
          if (live_test?.duration_test) {
            const totalTime = live_test.duration_test * 60;
            setSecondsLeft((prev) => (prev > 0 ? prev : totalTime));
          }

          settotalDuration(live_test?.duration_test);
          setQuestionData(question);
          //setNextId(next_id);
          setIsNext(is_next);
          setPreviousId(previous_id);
          setQuestionSrNo(question_sr_no);
          setTotalQuestions(total_questions);
          setStudentAnswer(student_answer);
          setSelectedOption(student_answer);
          setAllAttempted(all_attempted);
          // setIsLastQuestion(is_last_question);
        } else {
          toast.error(resp.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const examAttempHistory = () => {
  console.log("examAttempHistory called");
  setLoading(true);

  postApi(APIPATH.examAttempHistory, { test_id: decodedId }, token, logout)
    .then((resp) => {
      console.log('Response Start');
      console.log(resp);
      setExamAttempedHistory(resp.data || []);

          setTotalAttempted(resp.attempted ?? 0);
    setTotalSkipped(resp.skipped ?? 0);
    // setTotalCorrect(resp.totalCorrect ?? 0);
    // setTotalWrong(resp.totalWrong ?? 0);
    setTotalPending(resp.pending ?? 0);
    // setProgress(resp.pending ?? 0)
      // rest of your code...
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
};

// const examAttempHistory = () => {
//   setLoading(true);



// postApi(APIPATH.examAttempHistory, { test_id: decodedId }, token, logout)
//   .then((resp) => {
//   console.log('Reposne Start');
//     console.log(resp); why this mno tprint
//     // Adjust here based on what console.log(resp) shows
//     const data = resp.data || resp;  // resp.data if axios, else resp

//     setTotalQuestions(data.totalQuestions ?? 0);
//     setTotalAttempted(data.totalAttempted ?? 0);
//     setTotalSkipped(data.totalSkipped ?? 0);
//     setTotalCorrect(data.totalCorrect ?? 0);
//     setTotalWrong(data.totalWrong ?? 0);
//     setTotalPending(data.totalPending ?? 0);

//     setExamAttempedHistory(data.data || []);
//   })
//   .catch((err) => console.error(err))
//   .finally(() => setLoading(false));

// };

  const handlePrevious = () => {
    if (!previousId) {
      toast.warning("No previous question available.");
      return;
    }
    getTestData(previousId);
  };
  const handleSaveAndNext = () => {
    // if (liveTestData?.test_pattern !== "subjective" && !selectedOption) {
    //   toast.warning("Please select an option before proceeding.");
    //   return;
    // }
    // if (!selectedOption) {
    //   toast.warning("Please select an option before proceeding.");
    //   return;
    // }
  
    const payload = {
      test_id: decodedId,
      question_id: questionData?.id,
      student_answer: selectedOption,
      spend_time: spentSeconds,
      action: "save_and_next",
    };
    setLoading(true);
    postApi(APIPATH.submitLiveTest, payload, token, logout)
      .then((resp) => {
        if (resp.success) {
          setSelectedOption("");
          getTestData(resp?.nextId);
          setIsNext(resp?.is_next || false);
          // setIsLastQuestion(resp?.is_last_question || false);
          //else setAllAttempted(resp.all_attempted);
          examAttempHistory();
        } else {
          toast.error(resp.message || "Failed to save answer.");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    const payload = { test_id: decodedId };
    postApi(APIPATH.submitFinalLiveTest, payload, token, logout)
      .then((resp) => {
        if (resp.status) {
          console.log(resp.redirect_url);
          toast.success(resp.message || "Test submitted successfully!");
         
            navigate(`/dashboard/exam-result/${id}`);
         
        } else {
          toast.error(resp.message || "Failed to submit test.");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };
// function formatSnakeCaseToTitle(text: string) {
//   return text
//     .split("_")
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }
  return (
    <>
      <MathJaxContext>
        <style>
          {`
      .questions-ans-submit label.active {
        color: var(--bs-btn-color);
        background-color: var(--bs-btn-bg);
        border-color: var(--bs-btn-border-color);
      }
      footer {
        display: none;
      }
      header.main-header {
        display: none;
      }
 
//         .questions-ans-submit label.btn span.option {
//     color: var(--text);
//     background: var(--border);
//     min-width: 30px;
//     width: 30px!important;
//     height: 30px;
//     display: flex
// ;
//     align-items: center;
//     justify-content: center;
//     border-radius: 50%;
//     font-size: 18px;
//     font-weight: 500;
//     box-shadow: none !important;
// }
.mjx-container[jax="CHTML"][display="true"]{display:inline!important}
.live-test-right-scroll, .questions-card {

    max-height: calc(100vh - 135px)!important;
 
}
    `}
        </style>
        <LoaderWithBackground visible={loading} />
        <section className="overflow-hidden">
          <div className="test-page-header">
            <div className="container-fluid test-page-container">
              <div className="live-test-header">
                <Link className="navbar-brand order-1" to="/dashboard">
                  <img
                    src="/assets/img/logo.png"
                    alt="logo"
                    className="img-fluid"
                  />
                </Link>
              {/* <div className="live-test-progress order-3 order-sm-2">
  <div className="progress">
    <div
      className="progress-bar"
      role="progressbar"
      style={{ width: `${100-progress}%` }}
      aria-valuenow={100-progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
</div> */}
                <div className="order-2 order-sm-3">
                  <button
                    type="button"
                    className="test-menu-close-btn"
                    id="MenuCBtn"
                  >
                    <i className="fa-solid fa-bars" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="test-info-page test-live-submit-page">
            {/* Left Section */}
            <div className="livetest-left-menu">
              <div className="livetest-top-header">
                <p>Question {questionSrNo}.</p>
                <span>
                  <i className="fa-regular fa-flag" /> Repost
                </span>
              </div>
              
              <div className="questions-card">
                {questionData ? (
                  <>
                    <h3 className="question-heading d-flex">
                      {/* <span className="me-2">Q{questionSrNo}.</span> */}
                      {questionData?.question?.includes("<img") ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: questionData?.question,
                          }}
                        />
                      ) : (
                        <MathJax dynamic>{questionData?.question}</MathJax>
                      )}
                    </h3>

                    {questionData?.question_image?.includes("<img") ? (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: questionData?.question_image,
                        }}
                      />
                    ) : (
                      <MathJax dynamic>{questionData?.question_image}</MathJax>
                    )}

                    <div className="questions-ans-submit mt-4">
                      {(() => {
                        const options = ["A", "B", "C", "D"];
                        if (liveTestData?.test_pattern === "subjective") {
                          options.push(
                            "E",
                            "F",
                            "G",
                            "H",
                            "I",
                            "J",
                            "K",
                            "L",
                            "M",
                            "N"
                          );
                        }

                        return options
                          .filter((optionKey) =>
                            questionData?.[`option${optionKey}`]?.trim()
                          ) // ✅ Show only if option value exists and not empty
                          .map((optionKey, index) => (
                            <React.Fragment key={index}>
                              <div>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="options-outlined"
                                  id={`success-outlined-${optionKey}`}
                                  autoComplete="off"
                                  checked={selectedOption === optionKey}
                                  onChange={() => {
                                    if (
                                      originalAnswer == null &&
                                      studentAnswer !== null
                                    ) {
                                      setOriginalAnswer(studentAnswer);
                                    }

                                    setSelectedOption(optionKey);
                                    setStudentAnswer(optionKey);
                                  }}
                                /> 
                                 
                        
                               <label
                                  className={`btn btn-outline-success ${
                                    studentAnswer === optionKey ? "active" : ""
                                  }`}
                                  htmlFor={`success-outlined-${optionKey}`}
                                >
                                  <div className="d-flex justify-content-between align-items-center w-100">
                                    <div
                                      className="d-flex align-items-center w-100"
                                      style={{ gap: "5px" }}
                                    >
                                      <span className="qoptions">{optionKey}</span>{" "}
                                      {questionData?.[
                                        `option${optionKey}`
                                      ]?.includes("<img") ? (
                                        <p className=""
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              questionData?.[
                                                `option${optionKey}`
                                              ],
                                          }}
                                        />
                                      ) : (
                                        <MathJax dynamic>
                                          {questionData?.[`option${optionKey}`]}
                                        </MathJax>
                                      )}
                                    </div>

                                    {studentAnswer === optionKey && (
                                      <span
                                        style={{
                                          color: "green",
                                          fontSize: "14px",
                                          width: "170px",
                                          textAlign: "right",
                                        }}
                                      >
                                        <strong>Your Answer</strong>
                                      </span>
                                    )}
                                    
                                    {studentAnswer !== null &&
                                      originalAnswer === optionKey &&
                                      (previousId === "" ? (
                                        <span
                                          style={{
                                            color: "blue",
                                            fontSize: "14px",
                                            width: "170px",
                                            textAlign: "right",
                                          }}
                                        >
                                          <strong>Your Previous Answer</strong>
                                        </span>
                                      ) : null)}
                            
                                  </div>
                                </label> 
                              </div>
                            </React.Fragment>
                          ));
                      })()}
                    </div>
                  </>
                ) : (
                  <p>Loading question...</p>
                )}
              </div>
            
                <div className="live-test-footer">
                  <div className="questions-count">
                    <h2 className="qcount-heading">
                      Question {questionSrNo} of {totalQuestions} totals
                    </h2>
                  </div>
                  <div className="qsec-btns-group">
                    {previousId && (
                      <button
                        className="question-action-btn me-3"
                        onClick={handlePrevious}
                      >
                        Previous & Review
                      </button>
                    )}

                    {liveTestData?.test_pattern === "mcq" ? (
                      <>
                        {Number(allAttempted) === 1 && Number(isNext) === 0 ? (
                          <button
                            className="text-right-btm-btn"
                            onClick={handleFinalSubmit}
                          >
                            Final Submit
                          </button>
                        ) : (
                          <button
                            className="text-right-btm-btn me-3"
                            onClick={handleSaveAndNext}
                          >
                            Save And Next
                          </button>
                        )}
                      </>
                    ) : liveTestData?.test_pattern === "subjective" ? (
                      <></>
                    ) : (
                      // fallback if pattern is neither mcq nor subjective
                      <button
                        className="text-right-btm-btn me-3"
                        onClick={handleSaveAndNext}
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </div>
          
            </div>

            {/* Right Panel */}
            <div className="live-test-right-menu d-none" id="Rightmenu">
              <div className="live-test-menu-head">
                {/* <div className="lt-menu-user-img">
                <img src="/assets/img/profile-img.png" alt="user" className="img-fluid" />
              </div> */}
                <p className="user-name mb-0">Candidate Info</p>
              </div>
              <div className="live-test-right-scroll">
                <div className="marking-suggest">
                  {[
                    ["answered-mark", "01", "Answered"],
                    ["marked-mark", "02", "Skipped"],
                    ["not-answered-mark", "05", "Not Answered"],
                  ].map(([className, num, label], idx) => (
                    <div className="mark-sug-group" key={idx}>
                      <button className={className}>{num}</button>
                      <p className="mb-0 text text-dark">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="test-section-card">
                  <h3>
                    Section: <span>test</span>
                  </h3>
                  <div className="total-questions-aligns">
                    {Array.from({ length: 30 }, (_, i) => (
                      <button key={i} className="answered-mark empty">
                        {String(i + 1).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
            </div>
            <div className="live-test-right-menu" id="Rightmenu">
      <div className="live-test-menu-head">
        {/* <div className="lt-menu-user-img">
            <img src="/assets/img/profile-img.png" alt="user" className="img-fluid" />
          </div> */}
        <p className="user-name mb-0">Candidate Info</p>
      </div>

     <div className="live-test-right-scroll">
  {/* Marking Suggestion Summary */}
  <div className="marking-suggest">
    {[
      ["answered-mark", totalAttempted.toString().padStart(2, "0"), "Answered"],
      ["marked-mark", totalSkipped.toString().padStart(2, "0"), "Skipped"],
      ["not-answered-mark", totalPending.toString().padStart(2, "0"), "Not Answered"]
    ].map(([className, num, label], idx) => (
      <div className="mark-sug-group" key={idx}>
        <button className={className}>{num}</button>
        <p className="mb-0 text text-dark">{label}</p>
      </div>
    ))}
  </div>

  {/* Questions Section */}
  <div className="test-section-card">
    <h3>
      Section: <span>Test</span>
    </h3>

    <div className="total-questions-aligns">
      {examAttempedHistory.map((questionss: QuestionAttempt, index) => {
  let btnClass = "not-answered-mark empty";

  if (questionss.is_skipped) {
    btnClass = "marked-mark is_skipped";
  } else if (questionss.is_attempted) {
    btnClass = "answered-mark btn-sm is_attempted";
  } else{
    btnClass = "not-answered-mark";
  }

  return (
    <button key={questionss.id} className={btnClass}>
      {String(index + 1).padStart(2, "0")}
    </button>
  );
})}
    
    </div>
  </div>
</div>

    </div>
          </div>
        </section>
        <div>
       
        
        </div>
      </MathJaxContext>
    </>
  );
};

export default DashboardLiveTest;
