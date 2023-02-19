import React from 'react'
import { Table } from 'react-bootstrap';
import moment from 'moment';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function MyTable({ data, tableKeys, page, itemsPerPage, onClick, sortOptions }) {

  function displaySortIcon(key) {
    if (sortOptions.sortKey === key) {
      return sortOptions.sortAsc ? <i className="bi bi-sort-up"></i> : <i className="bi bi-sort-down"></i>;
    }
    return null;
  }

  function handleSort(key) {
    // FIXME: remove debug logs
    if (sortOptions.sortKey === key) {
      sortOptions.setSortAsc(!sortOptions.sortAsc);
    } else {
      sortOptions.setSortKey(key);
      sortOptions.setSortAsc(true);
    }
  }

  function getPageResults() {
    return data.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage);
  }

  function TableHeader({ colName, label = capitalizeFirstLetter(colName) }) {
    return (
      <th
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => {
          handleSort(colName);
        }}>{label} {displaySortIcon(colName)}</th>
    )
  }

  function formatDate(date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
  }

  return (
    <Table hover striped>
      <thead>
        <tr style={{
          whiteSpace: 'nowrap',
        }}>
          <TableHeader key='matchIndex' colName='matchIndex' label='#' />
          {tableKeys.map(key => (
            <TableHeader key={key} colName={key} />
          ))}
        </tr>
      </thead>
      <tbody>
        {getPageResults().map(result => {
          let exercise = result.item;
          return (
            <tr id={exercise._id} key={exercise._id} onClick={onClick}>
              <td>{result.matchIndex}</td>
              {tableKeys.map(key => {
                if (key === 'createdAt' || key === 'updatedAt') {
                  return <td key={key}>{formatDate(exercise[key])}</td>;
                } else {
                  return <td key={key}>{exercise[key]}</td>;
                }
              }
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
