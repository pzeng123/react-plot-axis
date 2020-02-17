import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";
import { DateXAxis, DateVerticalLineGrid, YAxis, YAxisSlabGrid } from "./lib";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import moment from "moment";

// CSS
import "./index.css";

class DateXAxisBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1000,
      height: 50,
      minX: 1477836800000,
      maxX: 1506780800000,
      range: 1506780800000,
      tickPosition: "top"
    };
    this.minX = 1277836800000;
    this.maxX = 1506780800000;
    this.range = 1506780800000;
  }

  // Given a date range in unix, return the common date components
  // of the dates that falls within the date range
  // ie: minDate = Feb 2, 2019 maxDate = Feb 28, 2019
  // common components = Feb, 2019
  getCommonDateComponents(minUnix, maxUnix) {
    let minT = new Date(minUnix);
    let maxT = new Date(maxUnix);

    if (minT.getFullYear() === maxT.getFullYear()) {
      if (minT.getMonth() === maxT.getMonth()) {
        if (minT.getDate() === maxT.getDate()) {
          if (minT.getHours() === maxT.getHours()) {
            if (minT.getMinutes() === maxT.getMinutes()) {
              if (minT.getSeconds() === maxT.getSeconds()) {
                return format(minT, "YYYY/MMM/Do HH:mm:ss");
              }
              return format(minT, "YYYY/MMM/Do HH:mm");
            }
            return format(minT, "YYYY/MMM/Do HH");
          }
          return format(minT, "YYYY/MMM/Do");
        }
        return format(minT, "MMM, YYYY");
      }
      return format(minT, "YYYY");
    }
    return "Time";
  }

  generateXAxisTicks(minUnix, maxUnix, frameWidth) {
    let tickPadding = 10;
    let tickWidth = 40 + tickPadding;
    let timeLengthInSecs = maxUnix - minUnix;
    let ticksInUnix = [];
    let curTick = null;
    let minMoment = moment.unix(minUnix);

    if (timeLengthInSecs <= 3600) {
      // round down to nearest hour
      let tickStartMinX = minUnix - (minUnix % 3600);
      let tickIncrementInSecs = 300;

      curTick = tickStartMinX;
      ticksInUnix.push(curTick * 1000);
      while (curTick <= maxUnix) {
        curTick += tickIncrementInSecs;
        ticksInUnix.push(curTick * 1000);
      }
    }
  }

  render() {
    let { width, height, minX, maxX, tickPosition } = this.state;
    this.generateXAxisTicks(minX / 1000, maxX / 1000, width);
    return (
      <Fragment>
        <div>
          width:
          <input
            type="range"
            min={800}
            max={1600}
            step={1}
            value={width}
            onChange={ev =>
              this.setState({ width: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          height:
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={height}
            onChange={ev =>
              this.setState({ height: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          minX:
          <input
            type="range"
            min={this.minX}
            max={this.maxX}
            step={1}
            value={minX}
            onChange={ev =>
              this.setState({ minX: Number.parseInt(ev.target.value) })
            }
            style={{ width: this.state.width }}
          />
        </div>
        <div>
          maxX:
          <input
            type="range"
            min={this.minX}
            max={this.maxX}
            step={1}
            value={maxX}
            onChange={ev =>
              this.setState({ maxX: Number.parseInt(ev.target.value) })
            }
            style={{ width: this.state.width }}
          />
        </div>
        <div>
          range:
          <input
            type="range"
            min={this.minX}
            max={this.maxX}
            step={1}
            value={maxX}
            onChange={ev =>
              this.setState({
                maxX: Number.parseInt(ev.target.value),
                minX: Number.parseInt(ev.target.value) - 3600000
              })
            }
            style={{ width: this.state.width }}
          />
        </div>
        <div>
          tickPosition:
          <select
            value={tickPosition}
            onChange={ev => this.setState({ tickPosition: ev.target.value })}
          >
            <option value="top">top</option>
            <option value="bottom">bottom</option>
          </select>
        </div>
        <DateXAxis
          width={width}
          height={height}
          minX={minX}
          maxX={maxX}
          tickPosition={tickPosition}
          fontSize={13}
          fontWeight={200}
          strokeStyle="gray"
          lineWidth={2}
          isItalic={true}
        />
        <div>{this.getCommonDateComponents(minX, maxX)}</div>
        <div>
          {moment(minX).format()} {moment(maxX).format()}
        </div>
      </Fragment>
    );
  }
}

class DateVerticalLineGridBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1000,
      height: 50,
      minX: 0,
      maxX: 100000000000,
      tickPosition: "top"
    };
  }

  render() {
    let { width, height, minX, maxX, tickPosition } = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input
            type="range"
            min={800}
            max={1600}
            step={1}
            value={width}
            onChange={ev =>
              this.setState({ width: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          height:
          <input
            type="range"
            min={100}
            max={500}
            step={1}
            value={height}
            onChange={ev =>
              this.setState({ height: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          minX:
          <input
            type="range"
            min={-100000000000}
            max={maxX}
            step={1}
            value={minX}
            onChange={ev =>
              this.setState({ minX: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          maxX:
          <input
            type="range"
            min={minX}
            max={100000000000}
            step={1}
            value={maxX}
            onChange={ev =>
              this.setState({ maxX: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DateVerticalLineGrid
            width={width}
            height={height}
            minX={minX}
            maxX={maxX}
          />
          <DateXAxis
            width={width}
            height={50}
            minX={minX}
            maxX={maxX}
            tickPosition="top"
          />
        </div>
      </Fragment>
    );
  }
}

class YAxisBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 50,
      height: 400,
      minY: 0,
      maxY: 10000,
      tickPosition: "left"
    };
  }

  render() {
    let { width, height, minY, maxY, tickPosition } = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={width}
            onChange={ev =>
              this.setState({ width: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          height:
          <input
            type="range"
            min={200}
            max={800}
            step={1}
            value={height}
            onChange={ev =>
              this.setState({ height: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          minY:
          <input
            type="range"
            min={-10000}
            max={maxY}
            step={1}
            value={minY}
            onChange={ev =>
              this.setState({ minY: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          maxY:
          <input
            type="range"
            min={minY}
            max={10000}
            step={1}
            value={maxY}
            onChange={ev =>
              this.setState({ maxY: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          tickPosition:
          <select
            value={tickPosition}
            onChange={ev => this.setState({ tickPosition: ev.target.value })}
          >
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </div>
        <YAxis
          width={50}
          height={height}
          minY={minY}
          maxY={maxY}
          tickPosition="left"
        />
      </Fragment>
    );
  }
}

class YAxisSlabGridBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 800,
      height: 400,
      minY: 0,
      maxY: 10000
    };
  }

  render() {
    let { width, height, minY, maxY, tickPosition } = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input
            type="range"
            min={400}
            max={1200}
            step={1}
            value={width}
            onChange={ev =>
              this.setState({ width: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          height:
          <input
            type="range"
            min={200}
            max={800}
            step={1}
            value={height}
            onChange={ev =>
              this.setState({ height: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          minY:
          <input
            type="range"
            min={-10000}
            max={maxY}
            step={1}
            value={minY}
            onChange={ev =>
              this.setState({ minY: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div>
          maxY:
          <input
            type="range"
            min={minY}
            max={10000}
            step={1}
            value={maxY}
            onChange={ev =>
              this.setState({ maxY: Number.parseInt(ev.target.value) })
            }
          />
        </div>
        <div style={{ display: "flex" }}>
          <YAxis
            width={50}
            height={height}
            minY={minY}
            maxY={maxY}
            tickPosition="right"
          />
          <YAxisSlabGrid
            width={width}
            height={height}
            minY={minY}
            maxY={maxY}
          />
        </div>
      </Fragment>
    );
  }
}

const App = props => {
  return (
    <Router>
      <nav className="app">
        <Link to="/DateXAxis">DateXAxis</Link>
        <Link to="/DateVerticalLineGrid">DateVerticalLineGrid</Link>
        <Link to="/YAxis">YAxisBundle</Link>
        <Link to="/YAxisSlabGrid">YAxisSlabGridBundle</Link>
      </nav>
      <Route path="/DateXAxis" exact component={DateXAxisBundle} />
      <Route
        path="/DateVerticalLineGrid"
        exact
        component={DateVerticalLineGridBundle}
      />
      <Route path="/YAxis" exact component={YAxisBundle} />
      <Route path="/YAxisSlabGrid" exact component={YAxisSlabGridBundle} />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
