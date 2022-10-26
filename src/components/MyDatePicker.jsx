import React from 'react'

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default function MyDatePicker({ initalStartDate, initalEndDate, includeTime, onChange }) {
  return (
    <DateRangePicker
                                        onCallback={onChange}
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
                                         }}>
                                            {/* <Form.Control type="text" placeholder="Updated" /> */}
                                        </DateRangePicker>
  )
}
