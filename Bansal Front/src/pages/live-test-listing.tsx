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

const LiveTestListing = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    getTestSeries();
  }, []);

  const getTestSeries = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.liveTestList);
      const { success, categories: apiCategories } = resp;

      console.log("API Categories:", apiCategories);

      if (success && apiCategories?.length > 0) {
        const validCategories = apiCategories.filter(
          (cat: any) => Array.isArray(cat.live_test) && cat.live_test.length > 0
        );

        setCategories(validCategories);

        if (validCategories.length > 0) {
          setActiveTab(validCategories[0].category_name);
        }
      } else {
        toast.info("No live test categories found.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = categories.find(
    (cat) => cat.category_name === activeTab
  );

  return (
    <>
      <LoaderWithBackground visible={loading} />
      <section className="listing-page-section">
        <div className="container">
          <h2 className="heading mb-4">
            Explore All Our <span className="course-heading-span">Live Test</span>
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
              {activeCategory.live_test.map((series: any) => (
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
                        to={`/live-test/${btoa(String(series.id))}`}
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

export default LiveTestListing;
