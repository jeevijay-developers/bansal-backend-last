import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface TestItem {
  id: number;
  title: string;
  questions: number;
  marks: number;
  time: string;
  category: 'Pending' | 'Complete';
  link?: string;
  buttonText: string;
  buttonClass: string;
}

const testData: TestItem[] = [
  {
    id: 1,
    title: 'SSC CGL Tier I: (Fundamental) Mini Live Test',
    questions: 100,
    marks: 100,
    time: '30 Mins',
    category: 'Pending',
    link: '/test/start',
    buttonText: 'Start Now',
    buttonClass: 'btn secondary-btn green-start-btn',
  },
  {
    id: 2,
    title: 'SSC CGL Tier I: (Fundamental) Mini Live Test',
    questions: 100,
    marks: 100,
    time: '30 Mins',
    category: 'Complete',
    buttonText: 'View Result',
    buttonClass: 'btn blue-btn',
  },
  // Add more tests here
];

const Tests: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Pending' | 'Complete'>('all');

  const filteredTests =
    selectedCategory === 'all'
      ? testData
      : testData.filter((test) => test.category === selectedCategory);

  return (
    <section>
      <div className="course-study-top">
        <div className="container">
          <div className="course-study-top-align">
            <div>
              <h2 className="sub-heading mb-2">JEE Nurture Online Course</h2>
              <p className="text mb-0 text-secondary">Test Series</p>
            </div>
            <Link to="/dashboard" className="back-to-dash-btn btn">
              <i className="fa-solid fa-house-chimney" /> Back Home
            </Link>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-xl-6">
          <div className="course-study-page test-study-page">
            <div className="container">
              <ul className="courses-tabs course-study-tab test-tabs bg-light mx-auto mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                    type="button"
                  >
                    All Test ({testData.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === 'Complete' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('Complete')}
                    type="button"
                  >
                    Complete ({testData.filter((t) => t.category === 'Complete').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === 'Pending' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('Pending')}
                    type="button"
                  >
                    Pending Test ({testData.filter((t) => t.category === 'Pending').length})
                  </button>
                </li>
              </ul>

              <ul className="test-series-price-nav-list">
                {filteredTests.map((test) => (
                  <li key={test.id} className="test-serieslist-card test-study-card1">
                    <h4>{test.title}</h4>
                    <div className="tslc-footer-align">
                      <div className="tslc-specific-tags">
                        <span>
                          <i className="fa-regular fa-circle-question" /> {test.questions} Questions
                        </span>
                        <span>
                          <i className="fa-regular fa-file-lines" /> {test.marks} Marks
                        </span>
                        <span>
                          <i className="fa-regular fa-clock" /> {test.time}
                        </span>
                      </div>
                      {test.link ? (
                        <Link to={test.link} className={test.buttonClass}>
                          {test.buttonText}
                        </Link>
                      ) : (
                        <button className={test.buttonClass}>{test.buttonText}</button>
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
  );
};

export default Tests;
