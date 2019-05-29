"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _bisect = require("bisect");

var _plotUtils = require("plot-utils");

var _dateFns = require("date-fns");

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

var DateXAxis =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(DateXAxis, _PureComponent);

  function DateXAxis(props) {
    var _this;

    _classCallCheck(this, DateXAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateXAxis).call(this, props));
    _this.ref = _react.default.createRef();
    return _this;
  }

  _createClass(DateXAxis, [{
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
          minX = _this$props2.minX,
          maxX = _this$props2.maxX,
          width = _this$props2.width,
          height = _this$props2.height,
          tickPosition = _this$props2.tickPosition;
      this.draw_memo = this.draw_memo || {
        validFromDiff: 0,
        validToDiff: -1,
        rangeMinX: 0,
        rangeMaxX: -1
      };
      var memo = this.draw_memo;
      var diffX = maxX - minX; // Generate grids, labels and bitmaps in cache

      if (memo.validFromDiff > diffX || diffX > memo.validToDiff || memo.rangeMinX > minX || maxX > memo.rangeMaxX) {
        memo.rangeMinX = minX - 10 * diffX;
        memo.rangeMaxX = maxX + 10 * diffX;

        var _generateDateGrids = (0, _plotUtils.generateDateGrids)(minX, maxX, memo.rangeMinX, memo.rangeMaxX),
            grids = _generateDateGrids.grids,
            validFromDiff = _generateDateGrids.validFromDiff,
            validToDiff = _generateDateGrids.validToDiff;

        memo.validFromDiff = validFromDiff;
        memo.validToDiff = validToDiff;
        memo.grids = grids;
        memo.gridLabels = this.getGridLabels(grids);
      } // Filter


      var startIndex = Math.max(0, (0, _bisect.bisect_right)(memo.grids, minX));
      var endIndex = Math.min(memo.grids.length - 1, (0, _bisect.bisect_left)(memo.grids, maxX));
      var domXs = memo.grids.slice(startIndex, endIndex + 1).map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      });
      var gridLabels = memo.gridLabels.slice(startIndex, endIndex + 1); // Plot

      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      this.textPlot(ctx, width, height, domXs, gridLabels);
      this.ticPlot(ctx, width, height, domXs, tickPosition);
    }
  }, {
    key: "getGridLabels",
    value: function getGridLabels(grids) {
      var labels = [];
      var t = new Date();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = grids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var grid = _step.value;
          t.setTime(grid);
          labels.push(this.getMeaningfulDateField(t));
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

      return labels;
    }
  }, {
    key: "getMeaningfulDateField",
    value: function getMeaningfulDateField(d) {
      if (d.getMilliseconds() === 0) {
        if (d.getSeconds() === 0) {
          if (d.getMinutes() === 0) {
            if (d.getHours() === 0) {
              if (d.getDate() === 1) {
                if (d.getMonth() === 0) {
                  return (0, _dateFns.format)(d, "YYYY");
                }

                return (0, _dateFns.format)(d, "MMM");
              }

              return (0, _dateFns.format)(d, "Do");
            }

            return (0, _dateFns.format)(d, "HH:00");
          }

          return (0, _dateFns.format)(d, "HH:mm");
        }

        return (0, _dateFns.format)(d, "HH:mm:ss");
      }

      return (0, _dateFns.format)(d, "ss.SSS");
    }
  }, {
    key: "textPlot",
    value: function textPlot(ctx, width, height, domXs, texts) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (var i = 0; i < domXs.length; i++) {
        var text = texts[i];
        var x = Math.round(domXs[i]);
        var y = Math.round(height / 2);
        ctx.fillText(text, x, y);
      }
    }
  }, {
    key: "ticPlot",
    value: function ticPlot(ctx, width, height, domXs, tickPosition) {
      switch (tickPosition) {
        case "top":
        default:
          ctx.beginPath();
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = domXs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var x = _step2.value;
              ctx.moveTo(Math.round(x) + 0.5, 0);
              ctx.lineTo(Math.round(x) + 0.5, 10);
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

          ctx.moveTo(0, 0.5);
          ctx.lineTo(width, 0.5);
          ctx.stroke();
          break;

        case "bottom":
          ctx.beginPath();
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = domXs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _x = _step3.value;
              ctx.moveTo(Math.round(_x) + 0.5, height - 10);
              ctx.lineTo(Math.round(_x) + 0.5, height);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          ctx.moveTo(0, height - 0.5);
          ctx.lineTo(width, height - 0.5);
          ctx.stroke();
          break;
      }
    }
  }]);

  return DateXAxis;
}(_react.PureComponent);

DateXAxis.propTypes = {
  minX: _propTypes.default.number.isRequired,
  maxX: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  tickPosition: _propTypes.default.string.isRequired
};
var _default = DateXAxis;
exports.default = _default;