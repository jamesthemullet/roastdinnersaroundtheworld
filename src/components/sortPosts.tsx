import { useState, useMemo, useEffect } from "react";

type Post = {
  slug: string;
  title: string;
  customfields: {
    rating: number;
    currency: string;
    price: number;
    meat: string;
    country: string;
    yearVisited: number | string;
    convertedPrice: number;
  };
};

const columnLabels: Record<keyof Post["customfields"], string> = {
  rating: "Rating",
  convertedPrice: "Price (GBP)",
  meat: "Meat",
  country: "Country",
  yearVisited: "Year Visited",
  currency: "Currency",
  price: "Price",
};

const getParam = (key: string) => {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
};

const SortPosts = ({ posts }: { posts: Post[] }) => {
  const [sortOrder, setSortOrder] = useState(() => getParam("sortOrder") || "asc");
  const [sortColumn, setSortColumn] = useState<keyof Post["customfields"]>(
    () => (getParam("sortColumn") as keyof Post["customfields"]) || "rating"
  );
  const [meatFilter, setMeatFilter] = useState(() => getParam("meat"));
  const [countryFilter, setCountryFilter] = useState(() => getParam("country"));
  const [scoreFilter, setScoreFilter] = useState(() => getParam("score"));
  const [priceFilter, setPriceFilter] = useState(() => getParam("price"));
  const [copySuccess, setCopySuccess] = useState(false);

  const [showYearVisited, setShowYearVisited] = useState(true);
  const [showCountry, setShowCountry] = useState(true);
  const [showMeat, setShowMeat] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showConvertedPrice, setShowConvertedPrice] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sortColumn !== "rating") params.set("sortColumn", sortColumn);
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
    if (meatFilter) params.set("meat", meatFilter);
    if (countryFilter) params.set("country", countryFilter);
    if (scoreFilter) params.set("score", scoreFilter);
    if (priceFilter) params.set("price", priceFilter);
    const search = params.toString();
    history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [sortColumn, sortOrder, meatFilter, countryFilter, scoreFilter, priceFilter]);

  const handleCheckboxChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setter((prev) => !prev);
    };

  const sortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const { meat, country, rating, convertedPrice } = post.customfields;
      return (
        (meatFilter ? meat === meatFilter : true) &&
        (countryFilter ? country === countryFilter : true) &&
        (scoreFilter ? rating >= Number(scoreFilter) : true) &&
        (priceFilter ? convertedPrice <= Number(priceFilter) : true)
      );
    });
    return [...filtered].sort((a, b) => {
      if (a.customfields[sortColumn] < b.customfields[sortColumn])
        return sortOrder === "asc" ? -1 : 1;
      if (a.customfields[sortColumn] > b.customfields[sortColumn])
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [posts, meatFilter, countryFilter, scoreFilter, priceFilter, sortColumn, sortOrder]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortColumn = e.target.value as keyof Post["customfields"];
    setSortColumn(newSortColumn);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "meat") setMeatFilter(value);
    if (name === "country") setCountryFilter(value);
    if (name === "score") setScoreFilter(value);
    if (name === "price") setPriceFilter(value);
  };

  const clearFilters = () => {
    setMeatFilter("");
    setCountryFilter("");
    setScoreFilter("");
    setPriceFilter("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const uniqueMeats = useMemo(
    () => [...new Set(posts.map((post) => post.customfields.meat))],
    [posts]
  );
  const uniqueCountries = useMemo(
    () => [...new Set(posts.map((post) => post.customfields.country))],
    [posts]
  );

  return (
    <div>
      <fieldset className="toggle-columns">
        <legend>Show/hide columns</legend>
        <input
          type="checkbox"
          id="price"
          checked={showPrice}
          onChange={handleCheckboxChange(setShowPrice)}
        />
        <label htmlFor="price">Price</label>
        <input
          type="checkbox"
          id="convertedPrice"
          checked={showConvertedPrice}
          onChange={handleCheckboxChange(setShowConvertedPrice)}
        />
        <label htmlFor="convertedPrice">Converted Price</label>
        <input
          type="checkbox"
          id="meat"
          checked={showMeat}
          onChange={handleCheckboxChange(setShowMeat)}
        />
        <label htmlFor="meat">Meat</label>
        <input
          type="checkbox"
          id="country"
          checked={showCountry}
          onChange={handleCheckboxChange(setShowCountry)}
        />
        <label htmlFor="country">Country</label>
        <input
          type="checkbox"
          id="yearVisited"
          checked={showYearVisited}
          onChange={handleCheckboxChange(setShowYearVisited)}
        />
        <label htmlFor="yearVisited">Year Visited</label>
      </fieldset>

      <div className="sort-posts">
        <label htmlFor="sort-column">Sort by: </label>
        <select id="sort-column" onChange={handleSortChange} value={sortColumn}>
          <option value="rating">Rating</option>
          <option value="convertedPrice">Price (GBP)</option>
          <option value="meat">Meat</option>
          <option value="country">Country</option>
          <option value="yearVisited">Year Visited</option>
        </select>
        <button onClick={toggleSortOrder}>
          Sort {columnLabels[sortColumn]}{" "}
          {sortOrder === "asc" ? "descending" : "ascending"}
        </button>
      </div>

      <fieldset className="filter-posts">
        <legend>Filter by</legend>
        <label htmlFor="meat-filter">Meat: </label>
        <select
          id="meat-filter"
          name="meat"
          value={meatFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {uniqueMeats.map((meat: string) => (
            <option key={meat} value={meat}>
              {meat}
            </option>
          ))}
        </select>

        <label htmlFor="country-filter">Country: </label>
        <select
          id="country-filter"
          name="country"
          value={countryFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {uniqueCountries.map((country: string) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label htmlFor="score-filter">Rating (minimum): </label>
        <input
          type="number"
          id="score-filter"
          name="score"
          value={scoreFilter}
          onChange={handleFilterChange}
          min="0"
          max="10"
          step="1"
        />

        <label htmlFor="price-filter">Price in GBP (maximum): </label>
        <input
          type="number"
          id="price-filter"
          name="price"
          value={priceFilter}
          onChange={handleFilterChange}
          min="0"
          step="1"
        />
      </fieldset>

      <button className="clear-button" onClick={clearFilters}>
        Clear All Filters
      </button>

      <button className="copy-link-button" onClick={copyLink}>
        {copySuccess ? "Link copied!" : "Copy link"}
      </button>

      <ol className="grid-container" role="table" aria-label="Roast dinner reviews">
        <li className="grid-item grid-header" role="row">
          <span role="columnheader">Restaurant</span>
          <span role="columnheader">Rating</span>
          {showPrice && <span role="columnheader">Price</span>}
          {showConvertedPrice && <span role="columnheader">Converted Price (GBP)</span>}
          {showMeat && <span role="columnheader">Meat</span>}
          {showCountry && <span role="columnheader">Country</span>}
          {showYearVisited && <span role="columnheader">Year Visited</span>}
        </li>
        {sortedPosts.map((post) => {
          const {
            rating,
            currency,
            price,
            meat,
            country,
            yearVisited,
            convertedPrice,
          } = post.customfields;
          return (
            <li className="grid-item" key={post.slug} role="row">
              <span role="cell">
                <a
                  href={post.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${post.title} - opens in new tab`}
                >
                  {post.title}
                </a>
              </span>
              <span role="cell">{rating}</span>
              {showPrice && <span role="cell">{`${currency}${price}`}</span>}
              {showConvertedPrice && <span role="cell">£{convertedPrice.toFixed(2)}</span>}
              {showMeat && <span role="cell">{meat}</span>}
              {showCountry && <span role="cell">{country}</span>}
              {showYearVisited && <span role="cell">{yearVisited}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default SortPosts;
