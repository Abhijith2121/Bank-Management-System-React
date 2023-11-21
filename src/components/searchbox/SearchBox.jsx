import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './searchbox.css';

function SearchBox(props) {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="mt-2">
          <div className="d-flex justify-content-center">
            <div className="search">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                name="search"
                value={props.search}
                onChange={(e) => {
                  props.setSearch(e.target.value);
                  e.target.value === '' ? (props.originalAccounts && props.setAccounts && props.setAccounts(props.originalAccounts), props.originalUsers && props.setUsers && props.setUsers(props.originalUsers)) : props.handleSearchApi(props.search); 
                }}
              />
              <a
                href="#"
                className="search-icon icon"
                onClick={(e) => { 
                  props.handleSearchApi(props.search);
                }}
              >
                <FaSearch />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
