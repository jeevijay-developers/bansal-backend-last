import { useEffect, useState,useRef } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { APIPATH } from "../api/urls";
import { postApi } from "../services/services";
import { useParams } from "react-router-dom";

import LoaderWithBackground from "../components/LoaderWithBackground.tsx";

interface QuestionHistoryItem {
  question_id: number;
  status: string;
  is_correct: number;
  is_skipped: number;
  time_taken: string | null;
}
const pieChartData = [
  { label: "Correct", value: 40, color: "#009000" },
  { label: "Incorrect", value: 20, color: "#FF2E2E" },
  { label: "Skipped", value: 40, color: "#B8B8B8" },
];
const ExamResult = () => {
  const { token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [liveTestData, setLiveTestData] = useState<any>(null);
  const [liveTestResultData, setLiveTestResultData] = useState<any>(null);


  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>(
    []
  );
  const { id } = useParams();
  const decodedId = atob(id || "");
  console.log(decodedId);
  useEffect(() => {
    getTestResultData();
  }, []);

  const getTestResultData = () => {
    setLoading(true);
    postApi(
      APIPATH.liveTestResult,
      { test_id: decodedId, user_id: 8 },
      token,
      logout
    )
      .then((resp) => {
        const {
          success,
          data,
  
          live_test,
        } = resp;
        if (success) {
          setLiveTestData(live_test);
          setLiveTestResultData(data);
       

          setQuestionHistory(data?.question_history || []);
        }
      })
      .catch((err) => console.log("API Error:", err))
      .finally(() => {
        setLoading(false);
      });
  };
const pieRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
    // Draw Pie Chart
    const canvas = pieRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

        let startAngle = 0;
        pieChartData.forEach((segment) => {
          const sliceAngle = (segment.value / 100) * 2 * Math.PI;
          const endAngle = startAngle + sliceAngle;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = segment.color;
          ctx.fill();

          startAngle = endAngle;
        });
      }
    }

    // Load Google Charts and draw column chart
    const loadGoogleCharts = () => {
      window.google.charts.load("current", { packages: ["bar"] });
      window.google.charts.setOnLoadCallback(drawColumnChart);
    };

    const drawColumnChart = () => {
      const data = window.google.visualization.arrayToDataTable([
        ["Type", "Correct", "Incorrect", "Skipped"],
        ["Easy", 24, 10, 12],
        ["Moderate", 24, 13, 17],
        ["Tough", 10, 20, 14],
      ]);

      const options = {
        chart: {
          title: "Overall Difficulty Analysis",
        },
        colors: ["#009000", "#FF2E2E", "#B8B8B8"],
      };

      const chart = new window.google.charts.Bar(
        document.getElementById("columnchart_material")
      );
      chart.draw(data, window.google.charts.Bar.convertOptions(options));
    };

    // Dynamically load Google Charts script
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = loadGoogleCharts;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <style>{`footer { display: none!important; }`}</style>
      {/* {liveTestData?.test_pattern === "mcq" && !isResultDeclared ? (
        <section>
          <div className="test-result-top" style={{ background: "#4C59DC" }}>
            <div className="container">
              <h2 className="tresult-heading">
                Thank you for attempting {liveTestData?.test_name}
              </h2>
            </div>
          </div>
        </section>
      ) : null} */}


        <section>
          <div className="test-result-top" style={{ background: "#4C59DC" }}>
            <div className="container">
              <h2 className="tresult-heading">
                Thank you for attempting {liveTestData?.test_name}
              </h2>

              <div className="tresult-top-cards">
                <div className="tresult-top-card-first">
                  <div className="tresult-tcard">
                    <img src="/assets/img/dashboard-img/Mask group.png" alt="#" />
                    <div className="tr-card-text">
                      <h4>Score</h4>
                      <p>{liveTestResultData?.score}</p>
                    </div>
                  </div>
                  <div className="tresult-tcard">
                    <img src="/assets/img/dashboard-img/Group 87.png" alt="#" />
                    <div className="tr-card-text">
                      <h4>Attempts</h4>
                      <p>{liveTestResultData?.attempts}</p>
                    </div>
                  </div>

                  {/* <div className="tresult-tcard">
                   <img src="/assets/img/dashboard-img/Group 87.png" alt="#" />
                    <div className="tr-card-text">
                      <h4>Rank</h4>
                      <p>{liveTestResultData?.rank}</p>
                    </div>
                  </div> */}
                  {/* <div className="tresult-tcard"> */}
                    {/* <img src={corrects} alt="Grade" /> */}
                    {/* <div className="tr-card-text">
                      <h4>Grade</h4>
                      <p>{liveTestResultData?.grade}</p>
                    </div> */}
                  {/* </div> */}
                  <div className="tresult-tcard">
                    {/* <img src={accuracy} alt="Accuracy" /> */}
                    <div className="tr-card-text">
                      <h4>Accuracy</h4>
                      <p>{liveTestResultData?.accuracy}</p>
                    </div>
                  </div>
                </div>

                <div className="tresult-top-card-last">
                   <div className="tresult-chart mb-4">
                                        <canvas ref={pieRef} id="pieChart" width="300" height="300" />
                                    </div>
                  <div className="result-chart-lables">
                    {/* <div className="rchart-lable">
                      <button className="result-ans-btn correct">
                        {liveTestResultData?.attempts}
                      </button>{" "}
                      Attempts
                    </div> */}
                    <div className="rchart-lable">
                      <button className="result-ans-btn correct">
                        {liveTestResultData?.correct}
                      </button>{" "}
                      Correct
                    </div>
                    <div className="rchart-lable">
                      <button className="result-ans-btn incorrect">
                        {liveTestResultData?.incorrect}
                      </button>{" "}
                      Skipped
                    </div>
                    <div className="rchart-lable">
                      <button className="result-ans-btn incorrect">
                        {liveTestResultData?.skipped}
                      </button>{" "}
                      Incorrect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-view-section">
            <div className="container">
              
                         <h3 className="rview-heading">Question Calendar</h3>
                            <p className="rview-text">Here’s Link summary of your answers to each question. click on the question number to
                                see the answer</p>
                            <div className="result-chart-lables2">
                                <div className="rchart-lable">
                                    <button className="result-ans-btn correct">{liveTestResultData?.correct}</button>Correct
                                </div>
                                <div className="rchart-lable">
                                    <button className="result-ans-btn incorrect">{liveTestResultData?.incorrect}</button>Incorrect
                                </div>
                                {/* <div className="rchart-lable">
                                    <button className="result-ans-btn skipped"> {liveTestResultData?.skipped}</button>Skipped
                                </div> */}
                                {/* <div className="rchart-lable">
                                    <button className="result-ans-btn n-attempts">04</button>Not Attempts
                                </div> */}
                            </div>
              <div className="" style={{ border: "1px solid var(--gray)" }}>
                <div
                  className="result-perans-table"
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    border: "0px solid var(--gray)",
                  }}
                >
                  {questionHistory.map(
                    (item: QuestionHistoryItem, index: number) => {
                      let statusClass = "n-attempts";

                      if (item.is_skipped === 1) {
                        statusClass = "skipped";
                      } else if (item.is_correct === 1) {
                        statusClass = "correct";
                      } else if (
                        item.is_correct === 0 &&
                        item.is_skipped === 0
                      ) {
                        statusClass = "incorrect";
                      }

                      // Ensure question_id is a valid number
                      const questionNumber = (index + 1)
                        .toString()
                        .padStart(2, "0");

                      return (
                        <div key={index} className="rchart-lable">
                          <a className={`result-ans-btn ${statusClass}`}>
                            {questionNumber}
                          </a>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* <div className="text-center mb-4">
                  <Link
                    to={`/test-result-history/${id}`}
                    className="btn btn-success"
                  >
                    Show Test Result History
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      <section>
                    {/* <div className="result-view-section">
                        <div className="container">
                            <h3 className="rview-heading">Difficulty Analysis</h3>
                            <p className="rview-text">Every exam contains 3 category of questions i.e., Easy, Moderate and Tough. It is
                                important to make sure that you have Link high accuracy in the first two, i.e. easy and moderately
                                difficult questions. This section will help you visualize the same for every subject.</p>
                            <div className="result-column-chart">
                                <div id="columnchart_material" />
                                 <div id="columnchart_material" style={{ width: "100%", height: "400px" }} />
                            </div>
                        </div>
                    </div> */}
                </section>
   
    
    </>
  );
};

export default ExamResult;
