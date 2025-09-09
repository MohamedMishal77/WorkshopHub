import React from "react";
import "../Styles/FilterControls.css";

const FilterControls = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  categories,
}) => {
  return (
    <div className="filter-controls">
      <div className="filter-row">
        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-filter">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
