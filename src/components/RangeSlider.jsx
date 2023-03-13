import React, { useEffect, useState } from 'react'

export default function RangeSlider(params) {
  const [rangeSlider, setRangeSlider] = useState(null);

  useEffect(() => {
    window.$(`#${params.id}`).ionRangeSlider();
    let slider = window.$(`#${params.id}`).data("ionRangeSlider");
    setRangeSlider(slider);
  }, []);

  useEffect(() => {
    if (rangeSlider) {
      rangeSlider.update({
        ...params,
        prettify: secondsToTime,

        from: params.value ? params.value[0] : params.min,
        to: params.value ? params.value[1] : params.max,

        // FIXME: filter cant find exercise with exact 14ms pause (too unprecise)
        // step: 1000, // 1 ms
        onChange: (data) => {
          params.setValue([data.from, data.to]);
        }
      });
    }
  }, [params.min, params.max]);

  function secondsToTime(microseconds) {
    let secs = microseconds / 1000000;
    // secs *= 500; // FIXME: modifying range for testing purposes only
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
    if (duration.s > 0 && duration.h < 1) {
      durationString += duration.s;
      if (duration.ms > 0 && duration.m < 1) {
        durationString += "," + Math.floor(duration.ms / 100);
      }
      durationString += "s";
    }
    if (duration.ms > 0 && secs < 1) {
      durationString += duration.ms + "ms";
    }

    if (durationString === "") {
      durationString = "0";
    }

    return durationString;
  }

  return (
    <input type="text" className="js-range-slider" id={params.id} />
  )
}
