import React from 'react'
import { Table } from 'react-bootstrap';
import moment from 'moment';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ExerciseTable({ data, dataKeys, page, itemsPerPage, onClick, sortOptions }) {

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
    <div className='table-responsive'>
    <Table hover striped>
      <thead>
        <tr style={{
          whiteSpace: 'nowrap',
        }}>
          <TableHeader key='matchIndex' colName='matchIndex' label='#' />
          {dataKeys.map(key => (
            <TableHeader key={key} colName={key} />
          ))}
        </tr>
      </thead>
      <tbody>
        {getPageResults().map(result => {
          let exercise = result.item;
          return (
            <tr id={exercise._id} key={exercise._id} onClick={onClick}>
              <td className='text-center'>{result.matchIndex}</td>
              {dataKeys.map(key => {
                var value = (key === 'createdAt' || key === 'updatedAt') ? formatDate(exercise[key]) : exercise[key];

                if (typeof value === 'number' || key === 'createdAt' || key === 'updatedAt') {
                  return <td key={key} className='text-center'>{value}</td>;
                } else if (key === 'link') {
                  return <td key={key}><a href={value}>{value}</a></td>;
                } else {
                  return <td key={key}>{value}</td>;
                }
              }
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
    </div>
  )
}
