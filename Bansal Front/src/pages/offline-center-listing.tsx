import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";

const OfflineCenters = () => {
  const [centerDetails, setCenterDetails] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
//   const {id} = useParams()
//   const slug = id;
  useEffect(() => {
    const slugFromState = location.state?.selectedCity || "kota";
    fetchCenters(slugFromState);
  }, [location.state?.selectedCity]);

  const fetchCenters = async (citySlug: string) => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.getOfflineCenter, { city: citySlug }, token, logout);
      const { success, data, cities } = resp;

      if (!success || !cities?.length) {
        navigate("/");
        return;
      }

      setCityList(cities);


      const matchedCity = cities.find((c: any) => c.slug === citySlug) || cities.find((c: any) => c.slug === "kota");

      if (!matchedCity) {
        navigate("/");
        return;
      }

      setSelectedSlug(matchedCity.slug);
      setSelectedCityName(matchedCity.title);

      const filteredCenters = data.filter(
        (center: any) => center.city_id === matchedCity.id
      );

      setCenterDetails(filteredCenters);

    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderWithBackground visible={loading} />

      <section className="ocenter-city-section">
        <div className="container">
          <div className="row">
            {cityList?.filter((c:any) => c.total_centers !== 0).map((city: any) => (
              <div className="col-sm-6 col-lg-4 col-xl-3 mb-4" key={city?.id}>
                <Link
                  to="/centers"
                  state={{ selectedCity: city.slug }}
                  className="text-decoration-none city-hover-ef"
                >
                  <div className={`city-card ${selectedSlug === city.slug ? "active" : ""}`}>
                    <img
                      src={`${IMAGE_URL}${city?.image}`}
                      alt={city?.title}
                      className="img-fluid"
                    />
                    <h4 className="city-name">{city?.title}</h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="institutes-section pb-0">
          <div className="container">
            <h3 className="heading text-center mb-4">
              We're Now in Your City - Visit Our <span>{selectedCityName}</span> Centre!
            </h3>
            <div className="row">
              {centerDetails.map((center: any) => (
                <div key={center.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="institute-card">
                    <img
                      src={`${IMAGE_URL}${center.logo}`}
                      alt={center.name}
                      className="img-fluid"
                    />
                    <h4>{center.name}</h4>
                    <p>
                      <i className="fa-solid fa-location-dot" /> {center.address}
                    </p>
                    <div className="institute-btn-group">
                      <Link to={`/center/${center.id}`} className="btn course-action-btn-white">
                        View Details
                      </Link>
                      <Link to="/contact" className="btn course-action-btn-prime">
                        Contact US
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {!centerDetails.length && !loading && (
                <p className="text-center">No centers found in this city.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OfflineCenters;
