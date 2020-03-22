import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { bisect_left, bisect_right } from "bisect";
import { toDomXCoord_Linear, generateDateGrids } from "plot-utils";
import { format } from "date-fns";
import moment from "moment";

// shift from UTC to EDT(with DST) or EST(without DST)
// numbers are only for EDT/EST
const SHIFT_HOURS_DST = 4;
const SHIFT_HOURS_NON_DST = 5;
const CUSTOM_DAY_START_HOUR = 7;

class DateXAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.displayDayAlready = true;
  }

  render() {
    let { width, height } = this.props;
    return (
      <canvas
        ref={this.ref}
        width={width}
        height={height}
        style={{ width: width, height: height, display: "block" }}
      ></canvas>
    );
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    let {
      minX,
      maxX,
      width,
      height,
      tickPosition,
      fontSize,
      isItalic,
      fontWeight,
      strokeStyle,
      lineWidth
    } = this.props;
    this.draw_memo = this.draw_memo || {
      validFromDiff: 0,
      validToDiff: -1,
      rangeMinX: 0,
      rangeMaxX: -1
    };
    let memo = this.draw_memo;
    let diffX = maxX - minX;

    // Generate grids, labels and bitmaps in cache
    if (
      memo.validFromDiff > diffX ||
      diffX > memo.validToDiff ||
      memo.rangeMinX > minX ||
      maxX > memo.rangeMaxX
    ) {
      memo.rangeMinX = minX - 10 * diffX;
      memo.rangeMaxX = maxX + 10 * diffX;
      let { grids, validFromDiff, validToDiff } = generateDateGrids(
        minX,
        maxX,
        memo.rangeMinX,
        memo.rangeMaxX
      );
      memo.validFromDiff = validFromDiff;
      memo.validToDiff = validToDiff;
      memo.grids = grids;
      memo.gridLabels = this.getGridLabels(grids);
    }

    // Filter
    let startIndex = Math.max(0, bisect_right(memo.grids, minX));
    let endIndex = Math.min(memo.grids.length - 1, bisect_left(memo.grids, maxX));
    let filteredArr = memo.grids.slice(startIndex, endIndex + 1);
    let newArr = [];

    if (filteredArr && filteredArr.length > 2) {
      let interval = this.getInterval(filteredArr);
      if (interval === 12 * 3600 * 1000) {
        // interval is 12 hours, add date display
        filteredArr.forEach(element => {
          newArr.push(element);
          let shift_hours = moment(element).isDST() ? SHIFT_HOURS_DST : SHIFT_HOURS_NON_DST;
          if (element % (86400 * 1000) === (CUSTOM_DAY_START_HOUR + shift_hours) * 3600 * 1000) {
            if (
              moment(element - CUSTOM_DAY_START_HOUR * 3600 * 1000).isDST() !==
              moment(element).isDST()
            ) {
              let newTs = element - CUSTOM_DAY_START_HOUR * 3600 * 1000;
              if (moment(newTs).isDST()) {
                // DST to non DST
                newArr.push(newTs - 3600*1000);
              } else {
                newArr.push(newTs);
              }
            } else {
              newArr.push(element - CUSTOM_DAY_START_HOUR * 3600 * 1000);
            }
          }
        });
      } else if (interval <= 6 * 3600 * 1000 && interval >= 3600 * 1000) {
        // interval is between 1 hour and 16 hours
        filteredArr.forEach(element => {
          let shift_hours = moment(element).isDST() ? SHIFT_HOURS_DST : SHIFT_HOURS_NON_DST;
          if (element % (86400 * 1000) === (1 + shift_hours) * 3600 * 1000) {
            let newTs = element - 3600*1000;
            if (moment(newTs).isDST() && !moment(newTs + 12 * 3600*1000).isDST()) {
              // DST to non DST
              newArr.push(newTs - 3600*1000);
              if (interval !== 6 * 3600 * 1000) {
                newArr.push(newTs);
              }
              if (interval <= 3 * 3600 * 1000) {
                newArr.push(element);
              }
            } else {
              newArr.push(newTs);
              if (interval !== 6 * 3600 * 1000) {
                newArr.push(element);
              }
            }            
          } else {
            newArr.push(element);
          }
        });
      } else {
        newArr = filteredArr;
      }
    } else {
      newArr = filteredArr;
    }
    // adjusted for daylight saving time and dates, time points array newArr size is small: ~10
    newArr.sort((a, b) => a - b);

    let domXs = newArr.map(x => toDomXCoord_Linear(width, minX, maxX, x));
    let gridLabels = this.getGridLabels(newArr);

    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    if (fontSize && fontWeight) {
      this.textPlot(ctx, width, height, domXs, gridLabels, fontSize, fontWeight, isItalic);
    } else {
      this.textPlot(ctx, width, height, domXs, gridLabels, 12, 400, isItalic);
    }
    this.ticPlot(ctx, width, height, domXs, tickPosition, strokeStyle, lineWidth);

    // // if need display day, plot day text and line
    // if (drawAdditionalDates && !this.displayDayAlready) {
    //   let dayArr = this.getDayArr(minX, maxX);
    //   let dayDomXs = dayArr.map(x=> toDomXCoord_Linear(width, minX, maxX, x));
    //   let dayGridLabels = dayArr.map(x=> {
    //     let t = new Date();
    //     t.setTime(x);
    //     return format(t, "Do");
    //   });
    //   let dayHeight = heightAdditionalDates === null || heightAdditionalDates === undefined ? height + 15 : height + heightAdditionalDates;
    //   if (fontSize && fontWeight) {
    //     this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, fontSize, fontWeight, isItalic);
    //   } else {
    //     this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, 12, 400, isItalic);
    //   }
    //   let dayTickPosition = tickPosition==="top"? "bottom" : "top";
    //   this.ticPlot(ctx, width, height, dayDomXs, dayTickPosition, strokeStyle, lineWidth);
    // }
  }

  getInterval(arr) {
    if (arr.length === 3) {
      let a = (arr[1] - arr[0])/3600000;
      let b = (arr[2] - arr[1])/3600000;
      if (a === 12 || b === 12) {
        return 12 * 3600*1000;
      } else if (a === 6 || b === 6) {
        return 6 * 3600*1000;
      } else {
        return Math.min(a, b) * 3600*1000;
      }
    }

    let dict = {};
    for (let i = 1; i < arr.length; i++) {
      let curInterval = arr[i] - arr[i-1];
      if (curInterval in dict) {
        return curInterval;
      } else {
        dict[curInterval] = 1;
      }
    }
    return null;
  }


  getDayArr(minX, maxX) {
    let startTs = Math.floor(minX / 86400000) * 86400000;
    let endTs = Math.ceil(maxX / 86400000) * 86400000;
    let arr = [];
    for (let i = 0; i < endTs - startTs; i = i + 86400000) {
      let currentTs = startTs + i + SHIFT_HOURS_DST * 3600000;
      if (moment(currentTs).isDST()) {
        arr.push(startTs + i + SHIFT_HOURS_DST * 3600000);
      } else {
        arr.push(startTs + i + SHIFT_HOURS_NON_DST * 3600000);
      }
    }
    return arr;
  }

  getGridLabels(grids) {
    let labels = [];
    let t = new Date();
    for (let grid of grids) {
      t.setTime(grid);
      labels.push(this.getMeaningfulDateField(t));
    }
    return labels;
  }

  getMeaningfulDateField(d) {
    this.displayDayAlready = true;
    if (d.getMilliseconds() === 0) {
      if (d.getSeconds() === 0) {
        if (d.getMinutes() === 0) {
          if (d.getHours() === 0) {
            if (d.getDate() === 1) {
              if (d.getMonth() === 0) {
                return format(d, "YYYY");
              }
              return format(d, "MMM");
            }
            return format(d, "Do");
          }
          this.displayDayAlready = false;
          return format(d, "HH:00");
        }
        this.displayDayAlready = false;
        return format(d, "HH:mm");
      }
      this.displayDayAlready = false;
      return format(d, "HH:mm:ss");
    }
    this.displayDayAlready = false;
    return format(d, "ss.SSS");
  }

  textPlot(ctx, width, height, domXs, texts, fontSize, fontWeight, isItalic) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (isItalic) {
      ctx.font = "italic " + fontWeight + " " + fontSize + "px MuseoSans, Sans";
    } else {
      ctx.font = fontWeight + " " + fontSize + "px MuseoSans, Sans";
    }

    for (let i = 0; i < domXs.length; i++) {
      let text = texts[i];
      let x = Math.round(domXs[i]);
      let y = Math.round(height / 2);
      ctx.fillText(text, x, y);
    }
  }

  ticPlot(ctx, width, height, domXs, tickPosition, strokeStyle, lineWidth) {
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
    }

    if (lineWidth) {
      ctx.lineWidth = lineWidth;
    }

    switch (tickPosition) {
      case "top":
      default:
        ctx.beginPath();
        for (let x of domXs) {
          ctx.moveTo(Math.round(x) + 0.5, 0);
          ctx.lineTo(Math.round(x) + 0.5, 10);
        }
        ctx.moveTo(0, 0.5);
        ctx.lineTo(width, 0.5);
        ctx.stroke();
        break;
      case "bottom":
        ctx.beginPath();
        for (let x of domXs) {
          ctx.moveTo(Math.round(x) + 0.5, height - 10);
          ctx.lineTo(Math.round(x) + 0.5, height);
        }
        ctx.moveTo(0, height - 0.5);
        ctx.lineTo(width, height - 0.5);
        ctx.stroke();
        break;
    }
  }
}

DateXAxis.propTypes = {
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  tickPosition: PropTypes.string.isRequired
};

export default DateXAxis;
