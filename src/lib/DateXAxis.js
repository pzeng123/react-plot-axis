import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { bisect_left, bisect_right } from "bisect";
import { toDomXCoord_Linear, generateDateGrids } from "plot-utils";
import { format } from "date-fns";
import moment from "moment";

const HOUR_IN_SECS = 3600;
const DAY_IN_SECS = 86400;
const MONTH_IN_SECS = 2592000;

class DateXAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.curDate = null;
    this.curMonth = null;
    this.curYear = null;
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
    // if (memo.validFromDiff > diffX ||
    //   diffX > memo.validToDiff ||
    //   memo.rangeMinX > minX ||
    //   maxX > memo.rangeMaxX
    // ) {
    //   memo.rangeMinX = minX - 10 * diffX;
    //   memo.rangeMaxX = maxX + 10 * diffX;
    //   let { validFromDiff, validToDiff } = generateDateGrids(minX, maxX, memo.rangeMinX, memo.rangeMaxX);
    //   memo.validFromDiff = validFromDiff;
    //   memo.validToDiff = validToDiff;
    //   memo.grids = this.generateXAxisTicks(minX / 1000, maxX / 1000, width);
    //   memo.gridLabels = this.getGridLabels(memo.grids);
    //   // console.log(memo.grids)
    // }

    // Filter
    let grids = this.generateXAxisTicks(minX / 1000, maxX / 1000, width);
    let gridLabels = this.getGridLabels(grids);
    let startIndex = Math.max(0, bisect_right(grids, minX));
    let endIndex = Math.min(grids.length - 1, bisect_left(grids, maxX));
    // console.log(moment(minX), moment(maxX), gridLabels, startIndex, endIndex, minX, maxX, grids)
    let domXs = grids
      .slice(startIndex, endIndex + 1)
      .map(x => toDomXCoord_Linear(width, minX, maxX, x));
    gridLabels = gridLabels.slice(startIndex, endIndex + 1);

    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    if (fontSize && fontWeight) {
      this.textPlot(
        ctx,
        width,
        height,
        domXs,
        gridLabels,
        fontSize,
        fontWeight,
        isItalic
      );
    } else {
      this.textPlot(ctx, width, height, domXs, gridLabels, 12, 400, isItalic);
    }
    this.ticPlot(
      ctx,
      width,
      height,
      domXs,
      tickPosition,
      strokeStyle,
      lineWidth
    );
  }

  generateXAxisTicks(minUnix, maxUnix, frameWidth) {
    let tickPadding = 10;
    let tickWidth = 40 + tickPadding;
    let timeLengthInSecs = maxUnix - minUnix;
    let ticksInUnix = [];
    let curTick = null;
    let minMoment = moment.unix(minUnix);
    let maxMoment = moment.unix(maxUnix);
    let tickIncrementInSecs = 300;
    let timeLengthInHours = Math.round(timeLengthInSecs / 3600);
    let timeLengthInDays = maxMoment.diff(minMoment, "days");

    // round down to nearest hour
    let tickStartMinX = minMoment.startOf("month").unix();
    curTick = tickStartMinX;
    //timeLengthInHours * tickIncrementInSecs;
    tickIncrementInSecs = 2592000;

    // if (timeLengthInDays > 356 && timeLengthInDays < 800) {
    //   // tickIncrementInSecs = 600
    //   tickIncrementInSecs = 2592000 * 2;
    // } else if (timeLengthInDays >= 800) {
    //   tickIncrementInSecs = 2592000 * 3;
    // }

    if (timeLengthInDays <= 30) {
      tickIncrementInSecs = DAY_IN_SECS;
    } else if (timeLengthInDays > 30 && timeLengthInDays <= 50) {
      tickIncrementInSecs = DAY_IN_SECS * 2;
    } else if (timeLengthInDays > 50 && timeLengthInDays <= 100) {
      tickIncrementInSecs = DAY_IN_SECS * 3;
    } else if (timeLengthInDays > 100 && timeLengthInDays <= 180) {
      tickIncrementInSecs = DAY_IN_SECS * 4;
    } else if (timeLengthInDays > 180 && timeLengthInDays <= 250) {
      tickIncrementInSecs = DAY_IN_SECS * 8;
    } else if (timeLengthInDays > 250 && timeLengthInDays <= 250) {
      tickIncrementInSecs = DAY_IN_SECS * 8;
    } 

    console.log(timeLengthInDays);
    // console.log(timeLengthInDays)
    while (curTick <= maxUnix) {
      let prevTick = curTick - tickIncrementInSecs;
      let nextTick = curTick + tickIncrementInSecs;
      let prevTickDate = moment.unix(prevTick).date();
      let curTickDate = moment.unix(curTick).date();
      let nextTickDate = moment.unix(nextTick).date();
      let prevTickMonth = moment.unix(prevTick).month();
      let curTickMonth = moment.unix(curTick).month();
      let nextTickMonth = moment.unix(nextTick).month();
      let prevTickYear = moment.unix(prevTick).year();
      let nextTickYear = moment.unix(nextTick).year();
      let curTickYear = moment.unix(curTick).year();


   if (prevTickYear !== curTickYear) {
        ticksInUnix.push(
          moment
            .unix(curTick)
            .startOf("year")
            .unix() * 1000
        );
      } else if (prevTickMonth !== curTickMonth) {
        ticksInUnix.push(
          moment
            .unix(curTick)
            .startOf("month")
            .unix() * 1000
        );
      } 
      else if (prevTickDate !== nextTickDate && curTickMonth === nextTickMonth) {
        ticksInUnix.push(moment.unix(curTick).startOf('day').unix() * 1000)
      }
      else if (curTickMonth === nextTickMonth) {
        ticksInUnix.push(curTick * 1000);
      }

      // if (curTickDate === prevTickDate && curTickDate === nextTickDate) {
      //   // nextTick -= nextTick % 86400
      //   // console.log(moment.unix(nextTick - nextTick % 86400).format(), moment.unix(nextTick).format())
      //   // nextTick = moment.unix(nextTick).startOf('day').unix()
      //   // console.log(moment.unix(nextTick).format(), moment.unix(nextTick).startOf('day').format())
      //   // curTick = nextTick
      //   // ticksInUnix.push(curTick * 1000)
      //   ticksInUnix.push(curTick * 1000)
      // } else if (curTickDate !== prevTickDate) {
      //   ticksInUnix.push(moment.unix(curTick).startOf('day').unix() * 1000)
      // }
      // ticksInUnix.push(curTick * 1000)
      curTick = nextTick;
      // console.log(moment.unix(curTick).format(), moment.unix(nextTick).format())
    }

    return ticksInUnix;
  }

  getGridLabels(grids) {
    let labels = [];
    let t = new Date();
    console.log(grids);
    for (let grid of grids) {
      t.setTime(grid);
      // console.log(t)
      labels.push(this.getMeaningfulDateField(t));
    }
    return labels;
  }

  getMeaningfulDateField(d) {
    // console.log(format(d,"MMM, Do, YYYY, h:MM "), d.getHours(), d.getMonth())

    // if (this.curMonth !== d.getMonth()) {
    //   this.curMonth = d.getMonth()
    //   return format(d, "MMM");
    // }

    // if (this.curDate !== d.getDate()) {
    //   this.curDate = d.getDate()
    //   return format(d, "Do");
    // }

    if (
      d.getMonth() === 0 &&
      d.getDate() === 1 &&
      d.getHours() === 0 &&
      d.getMinutes() === 0 &&
      d.getSeconds() === 0
    ) {
      return format(d, "YYYY");
    }

    if (
      d.getDate() === 1 &&
      d.getHours() === 0 &&
      d.getMinutes() === 0 &&
      d.getSeconds() === 0
    ) {
      return format(d, "MMM");
    }

    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
      return format(d, "D");
    }
    // console.log(format(d, "MMM, Do, YYYY, HH:MM "), d.getHours(), d.getMonth())
    return d.getHours() + ":" + d.getMinutes();
    // if (d.getMilliseconds() === 0) {
    //   if (d.getSeconds() === 0) {
    //     if (d.getMinutes() === 0) {
    //       if (d.getHours() === 0) {
    //         if (d.getDate() === 1) {
    //           if (d.getMonth() === 0) {
    //             console.log(d)
    //             return format(d, "YYYY");
    //           }
    //           return format(d, "MMM, YYYY");
    //         }
    //         return format(d, "Do");
    //       }
    //       return d.getHours() + ":" + d.getMinutes();
    //     }
    //     return d.getHours() + ":" + d.getMinutes();
    //   }
    //   return format(d, "HH:mm:ss");
    // }
    // return format(d, "ss.SSS");
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
