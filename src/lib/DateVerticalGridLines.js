import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear,generateDateGrids} from "plot-utils";

class DateVerticalGridLines extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { width,
          height} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} style={{display:"block",height:height,width:width}}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width} = this.props;
    let diffX = maxX-minX;
    // Generate grid if needed
    this.draw_memo = this.draw_memo || {validFromDiff:0, validToDiff: -1, rangeMinX:0, rangeMaxX: -1};
    let memo = this.draw_memo;
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
      memo.majorGrids = grids;
      memo.minorGrids = this.generateMinorGrids(grids);
    }
    // Filter
    let majorGridStartIndex = Math.max(0,bisect_left(memo.majorGrids,minX));
    let majorGridEndIndex = Math.min(memo.majorGrids.length-1,bisect_right(memo.majorGrids,maxX));
    let majorGridDomXs = memo.majorGrids.slice(majorGridStartIndex,majorGridEndIndex+1)
                              .map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let minorGridStartIndex = Math.max(0,bisect_right(memo.minorGrids,minX));
    let minorGridEndIndex = Math.min(memo.minorGrids.length-1,bisect_left(memo.minorGrids,maxX));
    let minorGridDomXs = memo.minorGrids.slice(minorGridStartIndex,minorGridEndIndex+1)
                                        .map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    ctx.globalAlpha = 0.3;
    this.verticalLinePlot(ctx,width,1,majorGridDomXs);
    ctx.globalAlpha = 0.15;
    this.verticalLinePlot(ctx,width,1,minorGridDomXs);
  }
  
  verticalLinePlot(ctx,width,height,domXs){
    let x = null;
    ctx.beginPath();
    for (let i=0; i<domXs.length; i++) {
      x = Math.round(domXs[i]);
      ctx.moveTo(0.5+x,0);
      ctx.lineTo(0.5+x,height);
    }
    ctx.stroke();
  }
  
  generateMinorGrids(grids) {
    if (grids.length===0) {
      return [];
    }
    let minorGrids = [];
    let prevGrid = grids[0];
    for (let grid of grids){
      minorGrids.push((grid+prevGrid)/2);
      prevGrid = grid;
    }
    return minorGrids;
  }
}

DateVerticalGridLines.propTypes = {
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default DateVerticalGridLines;
