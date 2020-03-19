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

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// shift from UTC to EDT(with DST) or EST(without DST)
// numbers are only for EDT/EST
var SHIFT_HOURS_DST = 4;
var SHIFT_HOURS_NON_DST = 5;

var DateXAxis = /*#__PURE__*/function (_PureComponent) {
  _inherits(DateXAxis, _PureComponent);

  function DateXAxis(props) {
    var _this;

    _classCallCheck(this, DateXAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateXAxis).call(this, props));
    _this.ref = _react.default.createRef();
    _this.displayDayAlready = true;
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
          tickPosition = _this$props2.tickPosition,
          fontSize = _this$props2.fontSize,
          isItalic = _this$props2.isItalic,
          fontWeight = _this$props2.fontWeight,
          strokeStyle = _this$props2.strokeStyle,
          lineWidth = _this$props2.lineWidth,
          drawAdditionalDates = _this$props2.drawAdditionalDates,
          heightAdditionalDates = _this$props2.heightAdditionalDates;
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
        memo.validToDiff = validToDiff; // check daylight saving time
        // if check DST in generateDateGrids, it would be faster
        // memo.grids = grids.map(x => moment(x).isDST()? x - 3600000 : x);  

        memo.grids = grids;
        memo.gridLabels = this.getGridLabels(grids);
        var a = grids.map(function (x) {
          return (0, _moment.default)(x).toString();
        });
        console.log('moment :', a);
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

      if (fontSize && fontWeight) {
        this.textPlot(ctx, width, height, domXs, gridLabels, fontSize, fontWeight, isItalic);
      } else {
        this.textPlot(ctx, width, height, domXs, gridLabels, 12, 400, isItalic);
      }

      this.ticPlot(ctx, width, height, domXs, tickPosition, strokeStyle, lineWidth); // if need display day, plot day text and line

      if (drawAdditionalDates && !this.displayDayAlready) {
        var dayArr = this.getDayArr(minX, maxX);
        var dayDomXs = dayArr.map(function (x) {
          return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
        });
        var dayGridLabels = dayArr.map(function (x) {
          var t = new Date();
          t.setTime(x);
          return (0, _dateFns.format)(t, "Do");
        });
        var dayHeight = heightAdditionalDates === null || heightAdditionalDates === undefined ? height + 15 : height + heightAdditionalDates; 

        if (fontSize && fontWeight) {
          this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, fontSize, fontWeight, isItalic);
        } else {
          this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, 12, 400, isItalic);
        }

        var dayTickPosition = tickPosition === "top" ? "bottom" : "top";
        this.ticPlot(ctx, width, height, dayDomXs, dayTickPosition, strokeStyle, lineWidth);
      }
    }
  }, {
    key: "getDayArr",
    value: function getDayArr(minX, maxX) {
      var startTs = Math.floor(minX / 86400000) * 86400000;
      var endTs = Math.ceil(maxX / 86400000) * 86400000;
      var arr = [];

      for (var i = 0; i < endTs - startTs; i = i + 86400000) {
        var currentTs = startTs + i + SHIFT_HOURS_DST * 3600000;

        if ((0, _moment.default)(currentTs).isDST()) {
          arr.push(startTs + i + SHIFT_HOURS_DST * 3600000);
        } else {
          arr.push(startTs + i + SHIFT_HOURS_NON_DST * 3600000);
        }
      }

      return arr;
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
      this.displayDayAlready = true;

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

            this.displayDayAlready = false;
            return (0, _dateFns.format)(d, "HH:00");
          }

          this.displayDayAlready = false;
          return (0, _dateFns.format)(d, "HH:mm");
        }

        this.displayDayAlready = false;
        return (0, _dateFns.format)(d, "HH:mm:ss");
      }

      this.displayDayAlready = false;
      return (0, _dateFns.format)(d, "ss.SSS");
    }
  }, {
    key: "textPlot",
    value: function textPlot(ctx, width, height, domXs, texts, fontSize, fontWeight, isItalic) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (isItalic) {
        ctx.font = "italic " + fontWeight + " " + fontSize + "px MuseoSans, Sans";
      } else {
        ctx.font = fontWeight + " " + fontSize + "px MuseoSans, Sans";
      }

      for (var i = 0; i < domXs.length; i++) {
        var text = texts[i];
        var x = Math.round(domXs[i]);
        var y = Math.round(height / 2);
        ctx.fillText(text, x, y);
      }
    }
  }, {
    key: "ticPlot",
    value: function ticPlot(ctx, width, height, domXs, tickPosition, strokeStyle, lineWidth) {
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
      }

      if (lineWidth) {
        ctx.lineWidth = lineWidth;
      }

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
