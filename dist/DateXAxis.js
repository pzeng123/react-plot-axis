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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// shift from UTC to EDT(with DST) or EST(without DST)
// numbers are only for EDT/EST
var SHIFT_HOURS_DST = 4;
var SHIFT_HOURS_NON_DST = 5;
var CUSTOM_DAY_START_HOUR = 7;

var DateXAxis = /*#__PURE__*/function (_PureComponent) {
  _inherits(DateXAxis, _PureComponent);

  var _super = _createSuper(DateXAxis);

  function DateXAxis(props) {
    var _this;

    _classCallCheck(this, DateXAxis);

    _this = _super.call(this, props);
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
      return /*#__PURE__*/_react.default.createElement("canvas", {
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
          lineWidth = _this$props2.lineWidth;
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
      var filteredArr = memo.grids.slice(startIndex, endIndex + 1);
      var newArr = [];

      if (filteredArr && filteredArr.length > 2) {
        var interval = this.getInterval(filteredArr);

        if (interval === 12 * 3600 * 1000) {
          // interval is 12 hours, add date display
          filteredArr.forEach(function (element) {
            newArr.push(element);
            var shift_hours = (0, _moment.default)(element).isDST() ? SHIFT_HOURS_DST : SHIFT_HOURS_NON_DST;

            if (element % (86400 * 1000) === (CUSTOM_DAY_START_HOUR + shift_hours) * 3600 * 1000) {
              if ((0, _moment.default)(element - CUSTOM_DAY_START_HOUR * 3600 * 1000).isDST() !== (0, _moment.default)(element).isDST()) {
                var newTs = element - CUSTOM_DAY_START_HOUR * 3600 * 1000;

                if ((0, _moment.default)(newTs).isDST()) {
                  // DST to non DST
                  newArr.push(newTs - 3600 * 1000);
                } else {
                  newArr.push(newTs);
                }
              } else {
                newArr.push(element - CUSTOM_DAY_START_HOUR * 3600 * 1000);
              }
            }
          });
        } else if (interval <= 6 * 3600 * 1000 && interval >= 3600 * 1000) {
          // interval is between 1 hour and 16 hours
          filteredArr.forEach(function (element) {
            var shift_hours = (0, _moment.default)(element).isDST() ? SHIFT_HOURS_DST : SHIFT_HOURS_NON_DST;

            if (element % (86400 * 1000) === (1 + shift_hours) * 3600 * 1000) {
              var newTs = element - 3600 * 1000;

              if ((0, _moment.default)(newTs).isDST() && !(0, _moment.default)(newTs + 12 * 3600 * 1000).isDST()) {
                // DST to non DST
                newArr.push(newTs - 3600 * 1000);

                if (interval !== 6 * 3600 * 1000) {
                  newArr.push(newTs);
                }

                if (interval <= 3 * 3600 * 1000) {
                  newArr.push(element);
                }
              } else {
                newArr.push(newTs);

                if (interval !== 6 * 3600 * 1000) {
                  newArr.push(element);
                }
              }
            } else {
              newArr.push(element);
            }
          });
        } else {
          newArr = filteredArr;
        }
      } else {
        newArr = filteredArr;
      } // adjusted for daylight saving time and dates, time points array newArr size is small: ~10


      newArr.sort(function (a, b) {
        return a - b;
      });
      var domXs = newArr.map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      });
      var gridLabels = this.getGridLabels(newArr); // Plot

      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      if (fontSize && fontWeight) {
        this.textPlot(ctx, width, height, domXs, gridLabels, fontSize, fontWeight, isItalic);
      } else {
        this.textPlot(ctx, width, height, domXs, gridLabels, 12, 400, isItalic);
      }

      this.ticPlot(ctx, width, height, domXs, tickPosition, strokeStyle, lineWidth); // // if need display day, plot day text and line
      // if (drawAdditionalDates && !this.displayDayAlready) {
      //   let dayArr = this.getDayArr(minX, maxX);
      //   let dayDomXs = dayArr.map(x=> toDomXCoord_Linear(width, minX, maxX, x));
      //   let dayGridLabels = dayArr.map(x=> {
      //     let t = new Date();
      //     t.setTime(x);
      //     return format(t, "Do");
      //   });
      //   let dayHeight = heightAdditionalDates === null || heightAdditionalDates === undefined ? height + 15 : height + heightAdditionalDates;
      //   if (fontSize && fontWeight) {
      //     this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, fontSize, fontWeight, isItalic);
      //   } else {
      //     this.textPlot(ctx, width, dayHeight, dayDomXs, dayGridLabels, 12, 400, isItalic);
      //   }
      //   let dayTickPosition = tickPosition==="top"? "bottom" : "top";
      //   this.ticPlot(ctx, width, height, dayDomXs, dayTickPosition, strokeStyle, lineWidth);
      // }
    }
  }, {
    key: "getInterval",
    value: function getInterval(arr) {
      if (arr.length === 3) {
        var a = (arr[1] - arr[0]) / 3600000;
        var b = (arr[2] - arr[1]) / 3600000;

        if (a === 12 || b === 12) {
          return 12 * 3600 * 1000;
        } else if (a === 6 || b === 6) {
          return 6 * 3600 * 1000;
        } else {
          return Math.min(a, b) * 3600 * 1000;
        }
      }

      var dict = {};

      for (var i = 1; i < arr.length; i++) {
        var curInterval = arr[i] - arr[i - 1];

        if (curInterval in dict) {
          return curInterval;
        } else {
          dict[curInterval] = 1;
        }
      }

      return null;
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

      var _iterator = _createForOfIteratorHelper(grids),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var grid = _step.value;
          t.setTime(grid);
          labels.push(this.getMeaningfulDateField(t));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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

          var _iterator2 = _createForOfIteratorHelper(domXs),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var x = _step2.value;
              ctx.moveTo(Math.round(x) + 0.5, 0);
              ctx.lineTo(Math.round(x) + 0.5, 10);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          ctx.moveTo(0, 0.5);
          ctx.lineTo(width, 0.5);
          ctx.stroke();
          break;

        case "bottom":
          ctx.beginPath();

          var _iterator3 = _createForOfIteratorHelper(domXs),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _x = _step3.value;
              ctx.moveTo(Math.round(_x) + 0.5, height - 10);
              ctx.lineTo(Math.round(_x) + 0.5, height);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
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