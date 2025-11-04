// <!-- remove footer from Dashboard page -->
// <style>
//     footer{
//         display: none;
//     }
// </style>

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const pieChartData = [
  { label: "Correct", value: 40, color: "#009000" },
  { label: "Incorrect", value: 20, color: "#FF2E2E" },
  { label: "Skipped", value: 40, color: "#B8B8B8" },
];

declare global {
  interface Window {
    google: any;
  }
}
const TestResult = () => {
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

  // Optional: Inform layout to hide footer
//   useEffect(() => {
//     document.body.classList.add("hide-footer");
//     return () => document.body.classList.remove("hide-footer");
//   }, []);

    return (
        <>
            <div>
                <section>
                    <div className="test-result-top">
                        <div className="container">
                            <h2 className="tresult-heading">Thank you for attempting Physics, Class-1 Live Test </h2>
                            <div className="tresult-top-cards">
                                <div className="tresult-top-card-first">
                                    <div className="tresult-tcard">
                                        <img src="/assets/img/dashboard-img/Mask group.png" alt="#" />
                                        <div className="tr-card-text">
                                            <h4>Score</h4>
                                            <p>00/20</p>
                                        </div>
                                    </div>
                                    <div className="tresult-tcard">
                                        <img src="/assets/img/dashboard-img/Group 87.png" alt="#" />
                                        <div className="tr-card-text">
                                            <h4>Attempts</h4>
                                            <p>02</p>
                                        </div>
                                    </div>
                                    <div className="tresult-tcard">
                                        <img src="/assets/img/dashboard-img/Group 88.png" alt="#" />
                                        <div className="tr-card-text">
                                            <h4>Speed</h4>
                                            <p>02/min</p>
                                        </div>
                                    </div>
                                    <div className="tresult-tcard">
                                        <img src="/assets/img/dashboard-img/goals.png" alt="#" />
                                        <div className="tr-card-text">
                                            <h4>Accuracy</h4>
                                            <p>20%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="tresult-top-card-last">
                                    <div className="tresult-chart mb-4">
                                        <canvas ref={pieRef} id="pieChart" width="300" height="300" />
                                    </div>
                                    <div className="result-chart-lables mb-4">
                                        <div className="rchart-lable">
                                            <button className="result-ans-btn correct">10</button>Correct
                                        </div>
                                        <div className="rchart-lable">
                                            <button className="result-ans-btn incorrect">10</button>Incorrect
                                        </div>
                                        <div className="rchart-lable">
                                            <button className="result-ans-btn skipped">10</button>Skipped
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="result-view-section">
                        <div className="container">
                            <h3 className="rview-heading">Question Calendar</h3>
                            <p className="rview-text">Here’s Link summary of your answers to each question. click on the question number to
                                see the answer</p>
                            <div className="result-chart-lables2">
                                <div className="rchart-lable">
                                    <button className="result-ans-btn correct">01</button>Correct
                                </div>
                                <div className="rchart-lable">
                                    <button className="result-ans-btn incorrect">02</button>Incorrect
                                </div>
                                <div className="rchart-lable">
                                    <button className="result-ans-btn skipped">03</button>Skipped
                                </div>
                                <div className="rchart-lable">
                                    <button className="result-ans-btn n-attempts">04</button>Not Attempts
                                </div>
                            </div>
                            <div className="result-perans-table">
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn correct">05</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn incorrect">06</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn skipped">07</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to='#' className="result-ans-btn n-attempts">08</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn correct">09</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn incorrect">10</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn skipped">11</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">12</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn correct">13</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn incorrect">14</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to="/test/review" className="result-ans-btn skipped">15</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">16</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">17</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">18</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link  to={''} className="result-ans-btn n-attempts">19</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">20</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">21</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">22</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">23</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">24</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">25</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">26</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">27</Link>
                                </div>
                                <div className="rchart-lable">
                                    <Link to={''} className="result-ans-btn n-attempts">28</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="result-view-section">
                        <div className="container">
                            <h3 className="rview-heading">Difficulty Analysis</h3>
                            <p className="rview-text">Every exam contains 3 category of questions i.e., Easy, Moderate and Tough. It is
                                important to make sure that you have Link high accuracy in the first two, i.e. easy and moderately
                                difficult questions. This section will help you visualize the same for every subject.</p>
                            <div className="result-column-chart">
                                <div id="columnchart_material" />
                                 {/* <div id="columnchart_material" style={{ width: "100%", height: "400px" }} /> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
}

export default TestResult;

