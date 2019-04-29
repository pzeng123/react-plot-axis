"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _bisect = require("bisect");

var _plotUtils = require("plot-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateVerticalGridLines = function (_PureComponent) {
  _inherits(DateVerticalGridLines, _PureComponent);

  function DateVerticalGridLines(props) {
    _classCallCheck(this, DateVerticalGridLines);

    var _this = _possibleConstructorReturn(this, (DateVerticalGridLines.__proto__ || Object.getPrototypeOf(DateVerticalGridLines)).call(this, props));

    _this.ref = _react2.default.createRef();
    return _this;
  }

  _createClass(DateVerticalGridLines, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height;

      return _react2.default.createElement("canvas", { ref: this.ref, width: width, height: 1, style: { display: "block", height: height, width: width } });
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
          minX = _props2.minX,
          maxX = _props2.maxX,
          width = _props2.width;

      var diffX = maxX - minX;
      // Generate grid if needed
      this.draw_memo = this.draw_memo || { validFromDiff: 0, validToDiff: -1, rangeMinX: 0, rangeMaxX: -1 };
      var memo = this.draw_memo;
      if (memo.validFromDiff > diffX || diffX > memo.validToDiff || memo.rangeMinX > minX || maxX > memo.rangeMaxX) {
        memo.rangeMinX = minX - 10 * diffX;
        memo.rangeMaxX = maxX + 10 * diffX;

        var _generateDateGrids = (0, _plotUtils.generateDateGrids)(minX, maxX, memo.rangeMinX, memo.rangeMaxX),
            grids = _generateDateGrids.grids,
            validFromDiff = _generateDateGrids.validFromDiff,
            validToDiff = _generateDateGrids.validToDiff;

        memo.validFromDiff = validFromDiff;
        memo.validToDiff = validToDiff;
        memo.majorGrids = grids;
        memo.minorGrids = this.generateMinorGrids(grids);
      }
      // Filter
      var majorGridStartIndex = Math.max(0, (0, _bisect.bisect_left)(memo.majorGrids, minX));
      var majorGridEndIndex = Math.min(memo.majorGrids.length - 1, (0, _bisect.bisect_right)(memo.majorGrids, maxX));
      var majorGridDomXs = memo.majorGrids.slice(majorGridStartIndex, majorGridEndIndex + 1).map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      });
      var minorGridStartIndex = Math.max(0, (0, _bisect.bisect_right)(memo.minorGrids, minX));
      var minorGridEndIndex = Math.min(memo.minorGrids.length - 1, (0, _bisect.bisect_left)(memo.minorGrids, maxX));
      var minorGridDomXs = memo.minorGrids.slice(minorGridStartIndex, minorGridEndIndex + 1).map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      });
      // Draw
      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, 1);
      ctx.globalAlpha = 0.3;
      this.verticalLinePlot(ctx, width, 1, majorGridDomXs);
      ctx.globalAlpha = 0.15;
      this.verticalLinePlot(ctx, width, 1, minorGridDomXs);
    }
  }, {
    key: "verticalLinePlot",
    value: function verticalLinePlot(ctx, width, height, domXs) {
      var x = null;
      ctx.beginPath();
      for (var i = 0; i < domXs.length; i++) {
        x = Math.round(domXs[i]);
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, height);
      }
      ctx.stroke();
    }
  }, {
    key: "generateMinorGrids",
    value: function generateMinorGrids(grids) {
      if (grids.length === 0) {
        return [];
      }
      var minorGrids = [];
      var prevGrid = grids[0];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = grids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var grid = _step.value;

          minorGrids.push((grid + prevGrid) / 2);
          prevGrid = grid;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return minorGrids;
    }
  }]);

  return DateVerticalGridLines;
}(_react.PureComponent);

exports.default = DateVerticalGridLines;