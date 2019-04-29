import React, { PureComponent } from "react";
import {bisect_left, bisect_right} from "bisect";
import {toDomYCoord_Linear, generateGrids} from "plot-utils";
import {format} from "date-fns";

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
      let gridLabels = this.getGridLabels(grids);
      memo.labelBitmaps = gridLabels.map((text)=>this.createTextBitmaps(text));
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.grids,minY));
    let endIndex = Math.min(memo.grids.length-1,bisect_left(memo.grids,maxY));
    
    let domYs = memo.grids.slice(startIndex,endIndex+1).map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let labelBitmaps = memo.labelBitmaps.slice(startIndex,endIndex+1);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.bitmapPlot(ctx,width,height,domYs,labelBitmaps,tickPosition);
    this.ticPlot(ctx,width,height,domYs,tickPosition);
  }
  
  getGridLabels(grids){
    return grids.map((grid)=>{
      if (grid>1) {
        return Math.round(grid);
      }
      else {
        return Number.parseFloat(grid).toFixed(2)
      }
    });
  }
  
  createTextBitmaps(text) {
    let font = "12px Sans";
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = 12;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }

  bitmapPlot(ctx,width,height,domYs,bitmaps,tickPosition){
    if (tickPosition === "left") {
      for (let i=0; i<domYs.length; i++) {
        let bitmap = bitmaps[i];
        let x = Math.round(10);
        let y = Math.round(domYs[i]-bitmap.height/2);
        ctx.drawImage(bitmap,x,y);
      }
    }
    else if (tickPosition === "right") {
      for (let i=0; i<domYs.length; i++) {
        let bitmap = bitmaps[i];
        let x = Math.round(width-5-bitmap.width);
        let y = Math.round(domYs[i]-bitmap.height/2);
        ctx.drawImage(bitmap,x,y);
      }
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

export default YAxis;

