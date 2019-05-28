import React, { PureComponent } from "react";
import PropTypes from "prop-types"; 
import {bisect_left, bisect_right} from "bisect";
import {toDomYCoord_Linear, generateGrids} from "plot-utils";

class YAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let {width,height} = this.props;
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
    let { minY,maxY,
          width,height,
          tickPosition} = this.props;
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
      memo.gridLabels = this.getGridLabels(grids);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.grids,minY));
    let endIndex = Math.min(memo.grids.length-1,bisect_left(memo.grids,maxY));
    
    let domYs = memo.grids.slice(startIndex,endIndex+1).map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let gridLabels = memo.gridLabels.slice(startIndex,endIndex+1);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.textPlot(ctx,width,height,domYs,gridLabels);
    this.ticPlot(ctx,width,height,domYs,tickPosition);
  }
  
  getGridLabels(grids){
    return grids.map((grid)=>{
      if (grid>10 || grid<-10) {
        return Math.round(grid);
      }
      else {
        return Number.parseFloat(grid).toFixed(2)
      }
    });
  }

  textPlot(ctx,width,height,domYs,texts){
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i=0; i<domYs.length; i++) {
      let text = texts[i];
      let x = Math.round(width/2);
      let y = Math.round(domYs[i]);
      ctx.fillText(text,x,y);
    }
  }
  
  ticPlot(ctx,width,height,domYs,tickPosition){
    let x;
    switch (tickPosition) {
      case "left":
      default:
        ctx.beginPath();
        x = 5;
        for (let y of domYs){
          ctx.moveTo(0, Math.round(y));
          ctx.lineTo(x, Math.round(y));
        }
        ctx.moveTo(0,0);
        ctx.lineTo(0,height);
        ctx.stroke();
        break;
      case "right":
        ctx.beginPath();
        x = width-5;
        for (let y of domYs){
          ctx.moveTo(x, Math.round(y));
          ctx.lineTo(width, Math.round(y));
        }
        ctx.moveTo(width,0);
        ctx.lineTo(width,height);
        ctx.stroke();
        break;
    }
  }
}

YAxis.propTypes = {
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  tickPosition: PropTypes.string.isRequired,
}

export default YAxis;

