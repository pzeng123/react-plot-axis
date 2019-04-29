"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _bisect = require("bisect");

var _plotUtils = require("plot-utils");

var _dateFns = require("date-fns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YAxis = function (_PureComponent) {
  _inherits(YAxis, _PureComponent);

  function YAxis(props) {
    _classCallCheck(this, YAxis);

    var _this = _possibleConstructorReturn(this, (YAxis.__proto__ || Object.getPrototypeOf(YAxis)).call(this, props));

    _this.ref = _react2.default.createRef();
    return _this;
  }

  _createClass(YAxis, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height;

      return _react2.default.createElement("canvas", { ref: this.ref, width: width, height: height,
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
      var _this2 = this;

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
        var gridLabels = this.getGridLabels(grids);
        memo.labelBitmaps = gridLabels.map(function (text) {
          return _this2.createTextBitmaps(text);
        });
      }
      // Filter
      var startIndex = Math.max(0, (0, _bisect.bisect_right)(memo.grids, minY));
      var endIndex = Math.min(memo.grids.length - 1, (0, _bisect.bisect_left)(memo.grids, maxY));

      var domYs = memo.grids.slice(startIndex, endIndex + 1).map(function (y) {
        return (0, _plotUtils.toDomYCoord_Linear)(height, minY, maxY, y);
      });
      var labelBitmaps = memo.labelBitmaps.slice(startIndex, endIndex + 1);
      // Plot
      var canvas = this.ref.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      this.bitmapPlot(ctx, width, height, domYs, labelBitmaps, tickPosition);
      this.ticPlot(ctx, width, height, domYs, tickPosition);
    }
  }, {
    key: "getGridLabels",
    value: function getGridLabels(grids) {
      return grids.map(function (grid) {
        if (grid > 1) {
          return Math.round(grid);
        } else {
          return Number.parseFloat(grid).toFixed(2);
        }
      });
    }
  }, {
    key: "createTextBitmaps",
    value: function createTextBitmaps(text) {
      var font = "12px Sans";
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      ctx.font = font;
      var width = ctx.measureText(text).width;
      var height = 12;
      canvas.width = width;
      canvas.height = height;
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
      return canvas;
    }
  }, {
    key: "bitmapPlot",
    value: function bitmapPlot(ctx, width, height, domYs, bitmaps, tickPosition) {
      if (tickPosition === "left") {
        for (var i = 0; i < domYs.length; i++) {
          var bitmap = bitmaps[i];
          var x = Math.round(10);
          var y = Math.round(domYs[i] - bitmap.height / 2);
          ctx.drawImage(bitmap, x, y);
        }
      } else if (tickPosition === "right") {
        for (var _i = 0; _i < domYs.length; _i++) {
          var _bitmap = bitmaps[_i];
          var _x = Math.round(width - 5 - _bitmap.width);
          var _y = Math.round(domYs[_i] - _bitmap.height / 2);
          ctx.drawImage(_bitmap, _x, _y);
        }
      }
    }
  }, {
    key: "ticPlot",
    value: function ticPlot(ctx, width, height, domYs, tickPosition) {
      var x = void 0;
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
              if (!_iteratorNormalCompletion && _iterator.return) {
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
              var _y2 = _step2.value;

              ctx.moveTo(x, Math.round(_y2));
              ctx.lineTo(width, Math.round(_y2));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
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

exports.default = YAxis;