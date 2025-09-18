import React from "react";
import cs from "./search_bar.scss";

interface SearchBarProps {
  searchBy?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchBy }) => {
  return (
    <form action="/user_storage_consumption" method="get" className={cs.searchContainer}>
      <input
        type="text"
        name="search_by"
        placeholder="Search by user ID, name, or email"
        defaultValue={searchBy}
        className={cs.searchInput}
      />
      <button type="submit" className={cs.searchButton}>
        Search
      </button>
    </form>
  );
};
