"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bisect = require("bisect");

var _plotUtils = require("plot-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YAxisSlabGrid = function (_PureComponent) {
  _inherits(YAxisSlabGrid, _PureComponent);

  function YAxisSlabGrid(props) {
    _classCallCheck(this, YAxisSlabGrid);

    var _this = _possibleConstructorReturn(this, (YAxisSlabGrid.__proto__ || Object.getPrototypeOf(YAxisSlabGrid)).call(this, props));

    _this.ref = _react2.default.createRef();
    return _this;
  }

  _createClass(YAxisSlabGrid, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height;

      return _react2.default.createElement("canvas", { ref: this.ref, width: 1, height: height,
        style: { width: width, height: height, display: "block" }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.draw();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var _props2 = this.props,
          minY = _props2.minY,
          maxY = _props2.maxY,
          width = _props2.width,
          height = _props2.height,
          tickPosition = _props2.tickPosition;

      this.draw_memo = this.draw_memo || { validFromDiff: 0, validToDiff: -1, rangeMinY: 0, rangeMaxY: -1 };
      var memo = this.draw_memo;
      var diffY = maxY - minY;
      // Generate grids, labels and bitmaps in cache
      if (memo.validFromDiff > diffY || diffY > memo.validToDiff || memo.rangeMinY > minY || maxY > memo.rangeMaxY) {
        memo.rangeMinY = minY - 10 * diffY;
        memo.rangeMaxY = maxY + 10 * diffY;

        var _generateGrids = (0, _plotUtils.generateGrids)(minY, maxY, memo.rangeMinY, memo.rangeMaxY),
            grids = _generateGrids.grids,
            validFromDiff = _generateGrids.validFromDiff,
            validToDiff = _generateGrids.validToDiff;

        memo.validFromDiff = validFromDiff;
        memo.validToDiff = validToDiff;
        memo.grids = grids;
      }
      // Filter
      var startIndex = Math.max(0, (0, _bisect.bisect_left)(memo.grids, minY));
      var endIndex = Math.min(memo.grids.length - 1, (0, _bisect.bisect_right)(memo.grids, maxY));

      var domYs = memo.grids.slice(startIndex, endIndex + 1).map(function (y) {
        return (0, _plotUtils.toDomYCoord_Linear)(height, minY, maxY, y);
      });
      // Plot
      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 1, height);
      this.drawSlab(ctx, 1, height, domYs);
    }
  }, {
    key: "drawSlab",
    value: function drawSlab(ctx, width, height, domYs) {
      ctx.fillStyle = "#fffef9";
      ctx.fillRect(0, 0, width, height);
      if (domYs.length === 0) {
        return;
      }
      ctx.fillStyle = "#fff7e4";
      var prevY = domYs[0];
      for (var i = 1; i < domYs.length; i++) {
        var currentY = Math.round(domYs[i]);
        var rectHeight = Math.round((prevY + currentY) / 2) - prevY;
        ctx.fillRect(0, prevY, 1, rectHeight);
        prevY = currentY;
      }
    }
  }]);

  return YAxisSlabGrid;
}(_react.PureComponent);

YAxisSlabGrid.propTypes = {
  minX: _propTypes2.default.number.isRequired,
  maxX: _propTypes2.default.number.isRequired,
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired
};

exports.default = YAxisSlabGrid;