import React from 'react';
import { CSVLink } from 'react-csv';

const CsvDownload = (props) => {
  const csvData = props.data.slice();
  csvData.unshift(['Username', 'Points value']);
  return (
    <CSVLink className="btn btn-primary px-2" data={csvData} filename="pointsExport.csv">Download CSV</CSVLink>
  );
};

export default CsvDownload;
