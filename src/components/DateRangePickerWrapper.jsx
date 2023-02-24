import React from 'react'
import moment from 'moment';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default function DatePicker({ setDate, includeTime, children }) {

  function getFormat() {
    return 'DD.MM.YYYY' + (includeTime ? ' HH:mm' : '');
  }

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

      onApply={(event, picker) => {
        console.log(parseDateTime(picker.startDate), parseDateTime(picker.endDate));

        picker.element.val(picker.startDate.format(getFormat()) + ' - ' + picker.endDate.format(getFormat()));
        setDate([parseDateTime(picker.startDate), parseDateTime(picker.endDate)]);
      }}

      onCancel={(event, picker) => {
        picker.element.val('');
        setDate([null, null]);
      }}

      initialSettings={{
        autoUpdateInput: false,

        // startDate: initalStartDate,
        // endDate: initalEndDate,
        
        timePicker: includeTime,
        timePicker24Hour: includeTime,

        ranges: {
          'Today': [moment().startOf('day'), moment().endOf('day')],
          'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
          'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
          'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },

        locale: {
          format: getFormat(),
          separator: ' - ',
          applyLabel: 'Apply',
          cancelLabel: 'Clear',
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
