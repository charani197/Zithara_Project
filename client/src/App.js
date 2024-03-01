import React, { useState } from 'react';
import './App.css'; 
import { data } from './App.test'; 
const TableSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); 
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); 
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredData.length / recordsPerPage))); // Ensure currentPage doesn't exceed total pages
  };

  
  let sortedData = [...data];
  if (sortOption === 'date') {
    sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOption === 'time') {
    sortedData.sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(':').map(Number);
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      return aHours - bHours || aMinutes - bMinutes;
    });
  }

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm))
  );

  
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, filteredData.length);
  const slicedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container">
      <h1>CUSTOMER DETAILS</h1>
      <h3>Perform a real-time search and filter on a table</h3>
      <div className="controls">
        <b>
          Search the table for Customer Name, Age, Phone, Location,Date/Time:
          <input
            className="search-input"
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </b>
        <b>
          Sort by:
          <select className="sort-select" onChange={handleSortChange}>
            <option value="">None</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
          </select>
        </b>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((row, index) => (
            <TableRow key={index} rowData={row} index={startIndex + index + 1} />
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={endIndex >= filteredData.length}>Next</button>
      </div>
    </div>
  );
};

const TableRow = ({ rowData, index }) => {
  const { customerName, age, phone, location, date, time } = rowData;

  return (
    <tr>
      <td>{index}</td>
      <td>{customerName}</td>
      <td>{age}</td>
      <td>{phone}</td>
      <td>{location}</td>
      <td>{date}</td>
      <td>{time}</td>
    </tr>
  );
};

export default TableSearch;
