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

var DateVerticalLineGrid =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(DateVerticalLineGrid, _PureComponent);

  function DateVerticalLineGrid(props) {
    var _this;

    _classCallCheck(this, DateVerticalLineGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateVerticalLineGrid).call(this, props));
    _this.ref = _react.default.createRef();
    return _this;
  }

  _createClass(DateVerticalLineGrid, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height;
      return _react.default.createElement("canvas", {
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
          if (!_iteratorNormalCompletion && _iterator.return != null) {
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