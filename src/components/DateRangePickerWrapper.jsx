import React from 'react'

import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default function DatePicker({ initalStartDate, initalEndDate, refDate, includeTime, children }) {

  function parseDateTime(date) {
    if (date === undefined) {
      return undefined;
    }

    var dateTime = date.format('YYYY-MM-DD');
    if (includeTime) {
      dateTime += 'T' + date.format('HH:mm:ss.SSS');
    }

    return dateTime;
  }

  return (
    <DateRangePicker
      onCallback={(start, end) => {
        console.log(parseDateTime(start), parseDateTime(end));
        refDate([parseDateTime(start), parseDateTime(end)]);
      }}
      initialSettings={{
        startDate: initalStartDate,
        endDate: initalEndDate,
        timePicker: includeTime,
        timePicker24Hour: includeTime,

        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },

        locale: {
          format: 'DD.MM.YYYY' + (includeTime ? ' HH:mm' : ''),
          separator: ' - ',
          applyLabel: 'Apply',
          cancelLabel: 'Cancel',
          fromLabel: 'From',
          toLabel: 'To',
          customRangeLabel: 'Custom',
          weekLabel: 'W',
          daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          firstDay: 1
        }
      }}>
      {children}
    </DateRangePicker>
  )
}
