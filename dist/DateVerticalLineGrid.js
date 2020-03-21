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

var DateVerticalLineGrid = /*#__PURE__*/function (_PureComponent) {
  _inherits(DateVerticalLineGrid, _PureComponent);

  var _super = _createSuper(DateVerticalLineGrid);

  function DateVerticalLineGrid(props) {
    var _this;

    _classCallCheck(this, DateVerticalLineGrid);

    _this = _super.call(this, props);
    _this.ref = _react.default.createRef();
    return _this;
  }

  _createClass(DateVerticalLineGrid, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height;
      return /*#__PURE__*/_react.default.createElement("canvas", {
        ref: this.ref,
        width: width,
        height: 1,
        style: {
          display: "block",
          height: height,
          width: width
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
          width = _this$props2.width;
      var diffX = maxX - minX; // Generate grid if needed

      this.draw_memo = this.draw_memo || {
        validFromDiff: 0,
        validToDiff: -1,
        rangeMinX: 0,
        rangeMaxX: -1
      };
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
      } // Filter


      var majorGridStartIndex = Math.max(0, (0, _bisect.bisect_left)(memo.majorGrids, minX));
      var majorGridEndIndex = Math.min(memo.majorGrids.length - 1, (0, _bisect.bisect_right)(memo.majorGrids, maxX));
      var majorGridDomXs = memo.majorGrids.slice(majorGridStartIndex, majorGridEndIndex + 1).map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      });
      var minorGridStartIndex = Math.max(0, (0, _bisect.bisect_right)(memo.minorGrids, minX));
      var minorGridEndIndex = Math.min(memo.minorGrids.length - 1, (0, _bisect.bisect_left)(memo.minorGrids, maxX));
      var minorGridDomXs = memo.minorGrids.slice(minorGridStartIndex, minorGridEndIndex + 1).map(function (x) {
        return (0, _plotUtils.toDomXCoord_Linear)(width, minX, maxX, x);
      }); // Draw

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

      var _iterator = _createForOfIteratorHelper(grids),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var grid = _step.value;
          minorGrids.push((grid + prevGrid) / 2);
          prevGrid = grid;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return minorGrids;
    }
  }]);

  return DateVerticalLineGrid;
}(_react.PureComponent);

DateVerticalLineGrid.propTypes = {
  minX: _propTypes.default.number.isRequired,
  maxX: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
var _default = DateVerticalLineGrid;
exports.default = _default;