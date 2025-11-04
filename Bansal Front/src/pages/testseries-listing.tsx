import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify";

import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";

const sliderSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1920, settings: { slidesToShow: 3 } },
    { breakpoint: 1200, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
  ],
};

const TestSeriesListing = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    getTestSeries();
  }, []);

  const getTestSeries = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.testSeriesWithCategoryList);
      const { success, message, categories } = resp;

      if (success && categories?.length > 0) {
        // Only include categories with at least one test series
        const validCategories = categories.filter(
          (cat: any) => Array.isArray(cat.test_series) && cat.test_series.length > 0
        );

        setCategories(validCategories);
        if (validCategories.length > 0) {
          setActiveTab(validCategories[0].category_name);
        }
      } else {
        toast.error(message || "No categories found.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = categories.find((cat) => cat.category_name === activeTab);

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <section className="listing-page-section">
        <div className="container">
          <h2 className="heading mb-4">
            Explore All Our <span className="course-heading-span">Test Series</span>
          </h2>

          {/* Tabs */}
          <ul className="courses-tabs mb-4">
            {categories.map((category) => (
              <li className="nav-item" key={category.id}>
                <button
                  className={`nav-link ${activeTab === category.category_name ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(category.category_name)}
                >
                  {category.category_name}
                </button>
              </li>
            ))}
          </ul>

          {/* Test Series Slider */}
          {activeCategory ? (
            <Slider {...sliderSettings}>
              {activeCategory.test_series.map((series: any) => (
                <div className="item" key={series.id}>
                    <div className="test-series-card">
        <Link
          to={`/test-series/${series.slug}`}
          className="text-decoration-none text-dark d-block"
        >
          <div className="test-series-card-top">
            <img
              src={
                series?.image
                  ? `${IMAGE_URL}${series.image}`
                  : "/assets/img/no_image.jpg"
              }
              alt={series.name}
              className="img-fluid"
            />
            <p className="test-series-card-badge">
              ₹{series?.offer_price || series?.price}
            </p>
          </div>
          <h3 className="test-series-card-title">{series.name}</h3>
          {/* Optional: Handle HTML description safely */}
          {series?.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: series.description,
              }}
            />
          )}
        </Link>

        <div className="test-series-btn-group">
          <Link
            to={`/test-series/${series.slug}`}
            className="btn course-action-btn-white"
          >
            View Details
          </Link>
        </div>
      </div>
                
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-5">No test series available.</div>
          )}
        </div>
      </section>
    </>
  );
};

export default TestSeriesListing;
