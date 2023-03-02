import React from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import Axios from "../../api/Axios";
import styled from "styled-components";
import {
  searchCategoryRoute
} from "../../api/Url";
import { DefaultFilterForColumn } from "./Filter";

export default function Table({ columns, data, setData }) {

  const [intervalId, setIntervalId] = React.useState('')

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    visibleColumns,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn },
    },
    useFilters,
    useGlobalFilter,
  );

  const getData = async () => {
    if (intervalId.length > 0) {
      clearInterval(intervalId)
      // console.log(intervalId,"canceled")
      setIntervalId('')
    }
    else {
      let interval = setInterval(async () => {
        try {
          const response = await Axios.post(searchCategoryRoute);
          // console.log(response.data.data)
          setData(response.data.data);
          setIntervalId('')
          // setCount(response.data.count)
        } catch (e) {
          console.log(e.response.data);
          setData(e.response.data.data)
        }
      }, 3000);
      setIntervalId(interval)
    }
  };

  if (data.length === 0) {
    return null
  }

  return (
    <>
      <TableStyles>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    {/* rendering column filter */}
                    <div>{column.canFilter ? column.render("Filter") : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, i) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableStyles>
    </>
  );
}

const TableStyles = styled.section`
  td {
    color: black;
    border: 0 !important;
    padding: 14px !important;
    background-color:white !important;
    text-align:center !important
  }

  td:nth-child(3) {
    width: 20% !important;
    height: 5% !important;
  }

  .table-tr {
    border: 0 !important;
    padding: 20px !important;
    background-color:white;
  }

  table {
    margin-top:20px;
    border-radius:5px !important;
    width:100%
  }

  th {
    background-color:#3d4d66 !important;
    color:white;
    text-align:center !important;
    padding:10px 20px 10px 30px
  }

  th:nth-child(1) {
    border-top-left-radius:5px
  }

  th:last-child {
    border-top-right-radius:5px
  }

  .pagination {
    display:flex;
    justify-content:center;
    align-items:center
  }
`;
