import React, { PureComponent } from "react";
import PropTypes from "proptypes";

import {bisect_left, bisect_right} from "bisect";
import {toDomXCoord_Linear,generateDateGrids} from "plot-utils";
import {format} from "date-fns";

class DateXAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { width,height} = this.props;
    return (
      <canvas ref={this.ref}  width={width} height={height}
                              style={{width:width,height:height,display:"block"}}
                              >
      </canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }

  draw() {
    let { minX,maxX,
          width,height,
          tickPosition} = this.props;
    this.draw_memo = this.draw_memo || {validFromDiff:0,validToDiff:-1,rangeMinX:0,rangeMaxX:-1};
    let memo = this.draw_memo;
    let diffX = maxX-minX;
    // Generate grids, labels and bitmaps in cache
    if (memo.validFromDiff>diffX ||
        diffX>memo.validToDiff ||
        memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX
        ) {
      memo.rangeMinX = minX-10*diffX;
      memo.rangeMaxX = maxX+10*diffX;
      let {grids, validFromDiff, validToDiff} = generateDateGrids(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.validFromDiff = validFromDiff;
      memo.validToDiff = validToDiff;
      memo.grids = grids;
      memo.gridLabels = this.getGridLabels(grids);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.grids,minX));
    let endIndex = Math.min(memo.grids.length-1,bisect_left(memo.grids,maxX));
    
    let domXs = memo.grids.slice(startIndex,endIndex+1).map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let gridLabels = memo.gridLabels.slice(startIndex,endIndex+1);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.textPlot(ctx,width,height,domXs,gridLabels);
    this.ticPlot(ctx,width,height,domXs,tickPosition);
  }
  
  getGridLabels(grids){
    let labels = [];
    let t = new Date();
    for (let grid of grids) {
      t.setTime(grid);
      labels.push(this.getMeaningfulDateField(t));
    }
    return labels;
  }
  
  getMeaningfulDateField(d){
    if (d.getMilliseconds()===0) {
      if (d.getSeconds()===0) {
        if (d.getMinutes()===0){
          if (d.getHours()===0){
            if (d.getDate()===1) {
              if (d.getMonth()===0) {
                return format(d,"YYYY");
              }
              return format(d,"MMM");
            }
            return format(d,"Do");
          }
          return format(d,"HH:00");
        }
        return format(d,"HH:mm");
      }
      return format(d,"HH:mm:ss");
    }
    return format(d,"ss.SSS");
  }

  textPlot(ctx,width,height,domXs,texts){
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i=0; i<domXs.length; i++) {
      let text = texts[i];
      let x = Math.round(domXs[i]);
      let y = Math.round(height/2);
      ctx.fillText(text,x,y);
    }
  }
  
  ticPlot(ctx,width,height,domXs,tickPosition){
    let y;
    switch (tickPosition) {
      case "top":
      default:
        ctx.beginPath();
        y = Math.round(height*0.1);
        for (let x of domXs){
          ctx.moveTo(Math.round(x)+0.5,0);
          ctx.lineTo(Math.round(x)+0.5,y);
        }
        ctx.moveTo(0,0.5);
        ctx.lineTo(width,0.5);
        ctx.stroke();
        break;
      case "bottom":
        ctx.beginPath();
        y = Math.round(height*0.9);
        for (let x of domXs){
          ctx.moveTo(Math.round(x)+0.5,y);
          ctx.lineTo(Math.round(x)+0.5,height);
        }
        ctx.moveTo(0,height-0.5);
        ctx.lineTo(width,height-0.5);
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
  tickPosition: PropTypes.string.isRequired,
}

export default DateXAxis;
