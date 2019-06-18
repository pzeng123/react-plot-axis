import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {bisect_left, bisect_right} from "bisect";
import {toDomYCoord_Linear, generateGrids} from "plot-utils";

class YAxisSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let {width,height} = this.props;
    return (
      <canvas ref={this.ref}  width={1} height={height}
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
    let { minY,maxY,
          height} = this.props;
    this.draw_memo = this.draw_memo || {validFromDiff:0,validToDiff:-1,rangeMinY:0,rangeMaxY:-1};
    let memo = this.draw_memo;
    let diffY = maxY-minY;
    // Generate grids, labels and bitmaps in cache
    if (memo.validFromDiff>diffY ||
        diffY>memo.validToDiff ||
        memo.rangeMinY>minY ||
        maxY>memo.rangeMaxY
        ) {
      memo.rangeMinY = minY-10*diffY;
      memo.rangeMaxY = maxY+10*diffY;
      let {grids, validFromDiff, validToDiff} = generateGrids(minY,maxY,memo.rangeMinY,memo.rangeMaxY);
      memo.validFromDiff = validFromDiff;
      memo.validToDiff = validToDiff;
      memo.grids = grids;
    }
    // Filter
    let startIndex = Math.max(0,bisect_left(memo.grids,minY));
    let endIndex = Math.min(memo.grids.length-1,bisect_right(memo.grids,maxY));
    
    let domYs = memo.grids.slice(startIndex,endIndex+1).map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,1,height);
    this.drawSlab(ctx,1,height,domYs);
  }
  
  drawSlab(ctx,width,height,domYs){
    ctx.fillStyle="#fffef9";
    ctx.fillRect(0,0,width,height);
    if (domYs.length===0) {
      return;
    }
    ctx.fillStyle="#fff7e4";
    let prevY = domYs[0];
    for (let i=1; i<domYs.length; i++) {
      let currentY = Math.round(domYs[i]);
      let rectHeight = Math.round((prevY+currentY)/2)-prevY;
      ctx.fillRect(0,prevY,1,rectHeight);
      prevY = currentY;
    }
  }
}

YAxisSlabGrid.propTypes = {
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default YAxisSlabGrid;


