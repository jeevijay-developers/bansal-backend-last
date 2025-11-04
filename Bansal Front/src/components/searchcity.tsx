import { useState, useEffect } from 'react';
type City = {
    name: string;
    image: string;
};

type SearchCityProps = {
    // show: boolean;
    city: City[];
};
const SearchCity:React.FC<SearchCityProps> = ({ city }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState(city);
    const [activeCity, setActiveCity] = useState<City | null>(null);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = city.filter((c: any) =>
            c.name.toLowerCase().startsWith(query)
        );
        setFilteredCities(filtered);
    }, [searchQuery, city]);

    const placeholder = activeCity ? activeCity.name : 'Search By City';

    return (
        <div className={`offcanvas offcanvas-end custom-offcanvas`} tabIndex={-1} id="offcanvasRight">
            <div className="offcanvas-header">
                <h5>Search City</h5>
                <button
                    type="button"
                    className="cuustom-close-btn"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    <i className="fa-regular fa-circle-xmark" />
                </button>
            </div>
            <div className="offcanvas-body">
                <form>
                    <div className="searchcity-input mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <ul className="suggest-city-list">
                        {filteredCities.map((c: any, index: number) => (
                            <li
                                key={index}
                                className={`search-city-suggest ${activeCity?.name === c.name ? 'active' : ''} visible`}
                                onClick={() => setActiveCity(c)}
                            >
                                <a href="#" className="search-city-card">
                                    <img src={c.image} alt={c.name} className="img-fluid" />
                                    <h4 className="city-name">{c.name}</h4>
                                </a>
                            </li>
                        ))}
                    </ul>
                </form>
            </div>
        </div>
    );
};

export default SearchCity;

