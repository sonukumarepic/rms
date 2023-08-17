import React from 'react'
import DataTable from 'react-data-table-component';

const Table = ({columns,data}) => {
    // console.log("Colums",data)
    // console.log("Filter Data",filteredData)
  return (
    <DataTable
    columns={columns}
    data={data}
    pagination
    
    />
  )
}

export default Table