import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { DateXAxis, DateVerticalLineGrid, YAxis, YAxisSlabGrid } from "./lib";
import { HashRouter as Router, Route, Link } from "react-router-dom";

// CSS
import "./index.css";

const INIT_MINX = 1541111200000;
const INIT_MAXX = 1541611200000;

class DateXAxisBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1000,
      height: 50,
      minX: INIT_MINX,
      maxX: INIT_MAXX,
      tickPosition: "top"
    };
  }

  render() {
    let { width, height, minX, maxX, tickPosition } = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input type="range" min={800} max={1600} step={1}
            value={width}
            onChange={(ev) => this.setState({ width: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          height:
          <input type="range" min={50} max={100} step={1}
            value={height}
            onChange={(ev) => this.setState({ height: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          minX:
          <input type="range" min={INIT_MINX} max={maxX} step={1}
            value={minX}
            onChange={(ev) => this.setState({ minX: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          maxX:
          <input type="range" min={minX} max={INIT_MAXX} step={1}
            value={maxX}
            onChange={(ev) => this.setState({ maxX: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          tickPosition:
          <select value={tickPosition}
            onChange={(ev) => this.setState({ tickPosition: ev.target.value })}>
            <option value="top">top</option>
            <option value="bottom">bottom</option>
          </select>
        </div>
        <DateXAxis width={width}
          height={height}
          minX={minX}
          maxX={maxX}
          tickPosition={tickPosition}
          fontSize={13}
          fontWeight={200}
          strokeStyle="gray"
          lineWidth={2}
          isItalic={true}
          drawAdditionalDates={true}
          heightAdditionalDates={5}
        />
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
          <input type="range" min={800} max={1600} step={1}
            value={width}
            onChange={(ev) => this.setState({ width: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          height:
          <input type="range" min={100} max={500} step={1}
            value={height}
            onChange={(ev) => this.setState({ height: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          minX:
          <input type="range" min={-100000000000} max={maxX} step={1}
            value={minX}
            onChange={(ev) => this.setState({ minX: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          maxX:
          <input type="range" min={minX} max={100000000000} step={1}
            value={maxX}
            onChange={(ev) => this.setState({ maxX: Number.parseInt(ev.target.value) })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DateVerticalLineGrid width={width} height={height}
            minX={minX} maxX={maxX}
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
          <input type="range" min={50} max={100} step={1}
            value={width}
            onChange={(ev) => this.setState({ width: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          height:
          <input type="range" min={200} max={800} step={1}
            value={height}
            onChange={(ev) => this.setState({ height: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          minY:
          <input type="range" min={-10000} max={maxY} step={1}
            value={minY}
            onChange={(ev) => this.setState({ minY: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          maxY:
          <input type="range" min={minY} max={10000} step={1}
            value={maxY}
            onChange={(ev) => this.setState({ maxY: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          tickPosition:
          <select value={tickPosition}
            onChange={(ev) => this.setState({ tickPosition: ev.target.value })}>
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </div>
        <YAxis width={50} height={height}
          minY={minY} maxY={maxY}
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
      maxY: 10000,
    };
  }

  render() {
    let { width, height, minY, maxY, tickPosition } = this.state;
    return (
      <Fragment>
        <div>
          width:
          <input type="range" min={400} max={1200} step={1}
            value={width}
            onChange={(ev) => this.setState({ width: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          height:
          <input type="range" min={200} max={800} step={1}
            value={height}
            onChange={(ev) => this.setState({ height: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          minY:
          <input type="range" min={-10000} max={maxY} step={1}
            value={minY}
            onChange={(ev) => this.setState({ minY: Number.parseInt(ev.target.value) })} />
        </div>
        <div>
          maxY:
          <input type="range" min={minY} max={10000} step={1}
            value={maxY}
            onChange={(ev) => this.setState({ maxY: Number.parseInt(ev.target.value) })} />
        </div>
        <div style={{ display: "flex" }}>
          <YAxis widtDateXAxish={50} height={height}
            minY={minY} maxY={maxY}
            tickPosition="right"
          />
          <YAxisSlabGrid width={width} height={height}
            minY={minY} maxY={maxY}
          />
        </div>
      </Fragment>
    );
  }
}

const App = (props) => {
  return (
    <Router>
      <nav className="app">
        <Link to="/DateXAxis">DateXAxis</Link>
        <Link to="/DateVerticalLineGrid">DateVerticalLineGrid</Link>
        <Link to="/YAxis">YAxisBundle</Link>
        <Link to="/YAxisSlabGrid">YAxisSlabGridBundle</Link>
      </nav>
      <Route path="/DateXAxis" exact component={DateXAxisBundle} />
      <Route path="/DateVerticalLineGrid" exact component={DateVerticalLineGridBundle} />
      <Route path="/YAxis" exact component={YAxisBundle} />
      <Route path="/YAxisSlabGrid" exact component={YAxisSlabGridBundle} />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
