import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";
import {DateXAxis} from "./lib";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class DateXAxisBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {width: 1000,
                  height: 50,
                  minX: 0,
                  maxX: 100000000000
                  };
  }

  render() {
    let {width,height,minX,maxX} = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input  type="range" min={800} max={1600} step={1}
                  value={width}
                  onChange={(ev)=>this.setState({width:Number.parseInt(ev.target.value)})}/>
        </div>
        <div>
          height:
          <input  type="range" min={50} max={100} step={1}
                  value={height}
                  onChange={(ev)=>this.setState({height:Number.parseInt(ev.target.value)})}/>
        </div>
        <div>
          minX:
          <input  type="range" min={-100000000000} max={maxX} step={1}
                  value={minX}
                  onChange={(ev)=>this.setState({minX:Number.parseInt(ev.target.value)})}/>
        </div>
        <div>
          maxX:
          <input  type="range" min={minX} max={100000000000} step={1}
                  value={maxX}
                  onChange={(ev)=>this.setState({maxX:Number.parseInt(ev.target.value)})}/>
        </div>
        <div></div>
        <div></div>
        <DateXAxis  width={width} height={height}
                    minX={minX} maxX={maxX}
                    />
      </Fragment>
    );
  }
}


const App = (props)=>{
  return (
    <Router>
      <Link to="/DateXAxis">DateXAxis</Link>
      <Route path="/DateXAxis" exact component={DateXAxisBundle}/>
    </Router>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
