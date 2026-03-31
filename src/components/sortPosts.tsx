import { useState, useEffect } from "react";

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

const SortPosts = ({ posts }: { posts: Post[] }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] =
    useState<keyof Post["customfields"]>("rating");
  const [sortedPosts, setSortedPosts] = useState([...posts]);

  const [meatFilter, setMeatFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const [showYearVisited, setShowYearVisited] = useState(true);
  const [showCountry, setShowCountry] = useState(true);
  const [showMeat, setShowMeat] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showConvertedPrice, setShowConvertedPrice] = useState(true);

  const handleCheckboxChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setter((prev) => !prev);
    };

  const sortedByColumn = (
    posts: Post[],
    column: keyof Post["customfields"],
    order: string
  ) => {
    return [...posts].sort((a, b) => {
      if (a.customfields[column] < b.customfields[column])
        return order === "asc" ? -1 : 1;
      if (a.customfields[column] > b.customfields[column])
        return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterPosts = (posts: Post[]) => {
    return posts.filter((post) => {
      const { meat, country, rating, convertedPrice } = post.customfields;
      return (
        (meatFilter ? meat === meatFilter : true) &&
        (countryFilter ? country === countryFilter : true) &&
        (scoreFilter ? rating >= Number(scoreFilter) : true) &&
        (priceFilter ? convertedPrice <= Number(priceFilter) : true)
      );
    });
  };

  useEffect(() => {
    const filteredPosts = filterPosts(posts);
    setSortedPosts(sortedByColumn(filteredPosts, sortColumn, sortOrder));
  }, [
    sortColumn,
    sortOrder,
    posts,
    meatFilter,
    countryFilter,
    scoreFilter,
    priceFilter,
  ]);

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

  const uniqueMeats = [...new Set(posts.map((post) => post.customfields.meat))];
  const uniqueCountries = [
    ...new Set(posts.map((post) => post.customfields.country)),
  ];

  return (
    <div>
      <div className="toggle-columns">
        <p>Show/hide columns:</p>
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
      </div>

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
          {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
        </button>
      </div>

      <div className="filter-posts">
        <label htmlFor="meat-filter">Filter by Meat: </label>
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

        <label htmlFor="country-filter">Filter by Country: </label>
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

        <label htmlFor="score-filter">Filter by Rating (minimum): </label>
        <input
          type="number"
          id="score-filter"
          name="score"
          value={scoreFilter}
          onChange={handleFilterChange}
        />

        <label htmlFor="price-filter">Filter by Price (maximum): </label>
        <input
          type="number"
          id="price-filter"
          name="price"
          value={priceFilter}
          onChange={handleFilterChange}
        />
      </div>

      <button className="clear-button" onClick={clearFilters}>
        Clear All Filters
      </button>

      <ol className="grid-container">
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
            <li className="grid-item" key={post.slug}>
              <a href={post.slug} target="_blank" rel="noopener noreferrer">
                {post.title}
              </a>
              <span>{rating}</span>
              {showPrice && <span>{`${currency}${price}`}</span>}
              {showConvertedPrice && <span>£{convertedPrice.toFixed(2)}</span>}
              {showMeat && <span>{meat}</span>}
              {showCountry && <span>{country}</span>}
              {showYearVisited && <span>{yearVisited}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default SortPosts;
