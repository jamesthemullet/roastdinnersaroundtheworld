import React, { useState, useEffect } from "react";

const SortPosts = ({ posts }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("rating");
  const [sortedPosts, setSortedPosts] = useState([...posts]);
  const [currencyRates, setCurrencyRates] = useState({});

  useEffect(() => {
    const fetchCurrencyData = async () => {
      const currency = await fetch(
        "https://api.exchangerate-api.com/v4/latest/GBP",
      );

      const currencyData = await currency.json();
      setCurrencyRates(currencyData.rates);
    };

    fetchCurrencyData();
  }, [posts]);

  const sortedByColumn = (posts, column, order) => {
    return [...posts].sort((a, b) => {
      if (a.customfields[column] < b.customfields[column])
        return order === "asc" ? -1 : 1;
      if (a.customfields[column] > b.customfields[column])
        return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSortChange = (e) => {
    const newSortColumn = e.target.value;
    setSortColumn(newSortColumn);
    setSortedPosts(sortedByColumn(posts, newSortColumn, sortOrder));
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortedPosts(sortedByColumn(posts, sortColumn, newSortOrder));
  };

  return (
    <div>
      <div className="sort-posts">
        <label htmlFor="sort-column">Sort by: </label>
        <select id="sort-column" onChange={handleSortChange} value={sortColumn}>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
          <option value="meat">Meat</option>
          <option value="country">Country</option>
          <option value="yearVisited">Year Visited</option>
        </select>
        <button onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
        </button>
      </div>

      <ol className="grid-container">
        {sortedPosts.map((post) => {
          const { rating, currency, price, meat, country, yearVisited } =
            post.customfields;
          return (
            <li className="grid-item" key={post.slug}>
              <a href={post.slug} target="_blank" rel="noopener noreferrer">
                {post.title}
              </a>
              <span>{rating}</span>
              <span>{`${currency}${price}`}</span>
              <span>
                {currencyRates[currency]
                  ? `£${(price / currencyRates[currency]).toFixed(2)}`
                  : ""}
              </span>
              <span>{meat}</span>
              <span>{country}</span>
              <span>{yearVisited}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default SortPosts;
