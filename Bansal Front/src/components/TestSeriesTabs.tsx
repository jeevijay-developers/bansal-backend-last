import React, { useState } from 'react';

type TestCategory = 'All' | 'Free' | 'Paid';

interface Exam {
  id: number;
  test_name: string;
  price: number;
  duration_test: string | null;
  test_type: string | null;
  marks: number | null;
  total_active_questions: number | null;
}

interface TestSeriesTabsProps {
  exams: Exam[];
}

const normalizeCategory = (test_type: string | null, price: number): TestCategory => {
  if (test_type?.toLowerCase() === 'free' || price === 0) return 'Free';
  return 'Paid';
};

const TestSeriesTabs: React.FC<TestSeriesTabsProps> = ({ exams }) => {
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>('All');

  const examsWithCategory = exams.map(exam => ({
    ...exam,
    category: normalizeCategory(exam.test_type, exam.price)
  }));

  const filteredExams = selectedCategory === 'All'
    ? examsWithCategory
    : examsWithCategory.filter(e => e.category === selectedCategory);

  return (
    <div className="test-series-price-tabs">
      <ul className="courses-tabs mb-4" style={{ background: 'var(--background-light)' }}>
        {(['All', 'Free', 'Paid'] as TestCategory[]).map(cat => (
          <li className="nav-item" key={cat}>
            <button
              className={`nav-link ${selectedCategory === cat ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} Test ({cat === 'All' ? exams.length : examsWithCategory.filter(e => e.category === cat).length})
            </button>
          </li>
        ))}
      </ul>

      {filteredExams.length === 0 ? (
         <ul className="test-series-price-nav-list">
           <li className="test-serieslist-card">
        <div>No active exams found.</div>
        </li>
        </ul>
      ) : (
        <ul className="test-series-price-nav-list">
          {filteredExams.map(test => (
            <li className="test-serieslist-card" key={test.id}>
              {/* {test.category === 'Free' && <span className="tslc-free-badge">Free</span>} */}
              <h4>{test.test_name.toUpperCase()} ({test.test_type ? test.test_type.charAt(0).toUpperCase() + test.test_type.slice(1) : 'N/A'})</h4>
              <div className="tslc-footer-align">
                <div className="tslc-specific-tags">
                  <span><i className="fa-regular fa-circle-question" /> {test.total_active_questions ?? 0} Questions</span>
                  <span><i className="fa-regular fa-file-lines" /> {test.marks ?? 0} Marks</span>
                  <span><i className="fa-regular fa-clock" /> {test.duration_test ?? 'N/A'} Minutes</span>
                </div>
                {test.category === 'Free' ? (
                  <button className="btn secondary-btn green-start-btn">Start Now</button>
                ) : (
                  <button className="btn secondary-btn"><i className="fa-solid fa-lock" /> Unlock Now</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestSeriesTabs;
