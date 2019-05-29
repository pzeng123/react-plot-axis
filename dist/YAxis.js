"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _bisect = require("bisect");

var _plotUtils = require("plot-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var YAxis =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(YAxis, _PureComponent);

  function YAxis(props) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YAxis).call(this, props));
    _this.ref = _react.default.createRef();
    return _this;
  }

  _createClass(YAxis, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height;
      return _react.default.createElement("canvas", {
        ref: this.ref,
        width: width,
        height: height,
        style: {
          width: width,
          height: height,
          display: "block"
        }
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
      var _this$props2 = this.props,
          minY = _this$props2.minY,
          maxY = _this$props2.maxY,
          width = _this$props2.width,
          height = _this$props2.height,
          tickPosition = _this$props2.tickPosition;
      this.draw_memo = this.draw_memo || {
        validFromDiff: 0,
        validToDiff: -1,
        rangeMinY: 0,
        rangeMaxY: -1
      };
      var memo = this.draw_memo;
      var diffY = maxY - minY; // Generate grids, labels and bitmaps in cache

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
        memo.gridLabels = this.getGridLabels(grids);
      } // Filter


      var startIndex = Math.max(0, (0, _bisect.bisect_right)(memo.grids, minY));
      var endIndex = Math.min(memo.grids.length - 1, (0, _bisect.bisect_left)(memo.grids, maxY));
      var domYs = memo.grids.slice(startIndex, endIndex + 1).map(function (y) {
        return (0, _plotUtils.toDomYCoord_Linear)(height, minY, maxY, y);
      });
      var gridLabels = memo.gridLabels.slice(startIndex, endIndex + 1); // Plot

      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      this.textPlot(ctx, width, height, domYs, gridLabels);
      this.ticPlot(ctx, width, height, domYs, tickPosition);
    }
  }, {
    key: "getGridLabels",
    value: function getGridLabels(grids) {
      return grids.map(function (grid) {
        if (grid > 10 || grid < -10) {
          return Math.round(grid);
        } else {
          return Number.parseFloat(grid).toFixed(2);
        }
      });
    }
  }, {
    key: "textPlot",
    value: function textPlot(ctx, width, height, domYs, texts) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (var i = 0; i < domYs.length; i++) {
        var text = texts[i];
        var x = Math.round(width / 2);
        var y = Math.round(domYs[i]);
        ctx.fillText(text, x, y);
      }
    }
  }, {
    key: "ticPlot",
    value: function ticPlot(ctx, width, height, domYs, tickPosition) {
      var x;

      switch (tickPosition) {
        case "left":
        default:
          ctx.beginPath();
          x = 5;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = domYs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var y = _step.value;
              ctx.moveTo(0, Math.round(y));
              ctx.lineTo(x, Math.round(y));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          ctx.moveTo(0, 0);
          ctx.lineTo(0, height);
          ctx.stroke();
          break;

        case "right":
          ctx.beginPath();
          x = width - 5;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = domYs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _y = _step2.value;
              ctx.moveTo(x, Math.round(_y));
              ctx.lineTo(width, Math.round(_y));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          ctx.moveTo(width, 0);
          ctx.lineTo(width, height);
          ctx.stroke();
          break;
      }
    }
  }]);

  return YAxis;
}(_react.PureComponent);

YAxis.propTypes = {
  minX: _propTypes.default.number.isRequired,
  maxX: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  tickPosition: _propTypes.default.string.isRequired
};
var _default = YAxis;
exports.default = _default;