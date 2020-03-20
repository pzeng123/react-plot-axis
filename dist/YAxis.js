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

var YAxis = /*#__PURE__*/function (_PureComponent) {
  _inherits(YAxis, _PureComponent);

  var _super = _createSuper(YAxis);

  function YAxis(props) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _super.call(this, props);
    _this.ref = _react.default.createRef();
    return _this;
  }

  _createClass(YAxis, [{
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

          var _iterator = _createForOfIteratorHelper(domYs),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var y = _step.value;
              ctx.moveTo(0, Math.round(y));
              ctx.lineTo(x, Math.round(y));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          ctx.moveTo(0, 0);
          ctx.lineTo(0, height);
          ctx.stroke();
          break;

        case "right":
          ctx.beginPath();
          x = width - 5;

          var _iterator2 = _createForOfIteratorHelper(domYs),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _y = _step2.value;
              ctx.moveTo(x, Math.round(_y));
              ctx.lineTo(width, Math.round(_y));
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
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