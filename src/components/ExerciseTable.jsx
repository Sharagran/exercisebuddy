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

  function formatDuration(microseconds) {
    let secs = microseconds / 1000000;
    // secs *= 10; // FIXME: modifying range for testing purposes only
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.floor(divisor_for_seconds);

    let divisor_for_milliseconds = divisor_for_seconds % 1;
    let milliseconds = Math.ceil(divisor_for_milliseconds * 1000);

    let duration = {
      h: hours,
      m: minutes,
      s: seconds,
      ms: milliseconds
    };

    var durationString = "";
    if (duration.h > 0) {
      durationString += duration.h + "h";
    }
    if (duration.m > 0) {
      durationString += duration.m + "m";
    }
    if (duration.s > 0) {
      durationString += duration.s + "s";
    }
    // FIXME: probably not nessessary in production
    if (duration.ms > 0) {
      durationString += duration.ms + "ms";
    }

    if (durationString === "") {
      durationString = "0s";
    }

    return durationString;
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
                var value;
                if (key === 'createdAt' || key === 'updatedAt') {
                  value = formatDate(exercise[key]);
                } else if (key === 'duration' || key === 'pause') {
                  value = formatDuration(exercise[key]);
                } else {
                  value = exercise[key];
                }

                if (typeof value === 'number' || key === 'createdAt' || key === 'updatedAt') {
                  return <td key={key} className='text-center'>{value}</td>;
                } else if (key === 'link') {
                  return <td key={key}><a href={value}>{value}</a></td>;
                } else if (key === 'complaintsAreas' || key === 'equipment') {
                  return <td key={key}>{value.map(
                    (item, index) => {
                      return <span key={index}>{item}<br /></span>
                    }
                  )}</td>;
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
