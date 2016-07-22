'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_TIMEOUT = 500;

var PageTransition = function (_React$Component) {
  _inherits(PageTransition, _React$Component);

  function PageTransition() {
    var _Object$getPrototypeO;

    _classCallCheck(this, PageTransition);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PageTransition)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.state = {
      child1: _this.props.children,
      child2: null,
      nextChild: 2
    };
    return _this;
  }

  _createClass(PageTransition, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var child = this.refs.child1;
      if (child) {
        var dom = _reactDom2.default.findDOMNode(child);
        child.onTransitionDidEnd && child.onTransitionDidEnd(this.props.data);
        dom.classList.remove('transition-item');
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // If there is new children
      if (this.props.children !== nextProps.children) {
        // Render the new children
        this.state['child' + this.state.nextChild] = nextProps.children;
        this.forceUpdate(function () {
          var child = _this2.refs['child' + _this2.state.nextChild];
          var dom = _reactDom2.default.findDOMNode(child);
          var timeout = 0;

          // Before add appear class
          var willStart = function willStart() {
            if (child.onTransitionWillStart) {
              return child.onTransitionWillStart(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Add appear class and active class (or trigger manual start)
          var start = function start() {
            if (dom.classList.contains('transition-item')) {
              timeout = _this2.props.timeout || DEFAULT_TIMEOUT;
              dom.classList.add('transition-appear');
              dom.offsetHeight; // Trigger layout to make sure transition happen
              if (child.transitionManuallyStart) {
                return child.transitionManuallyStart(_this2.props.data, start) || Promise.resolve();
              }
              dom.classList.add('transition-appear-active');
            }
            return Promise.resolve();
          };

          // After add classes
          var didStart = function didStart() {
            if (child.onTransitionDidStart) {
              return child.onTransitionDidStart(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Wait for transition
          var waitForTransition = function waitForTransition() {
            return new Promise(function (resolve) {
              setTimeout(function () {
                // Swap child and remove the old child
                _this2.state.nextChild = _this2.state.nextChild === 1 ? 2 : 1;
                _this2.state['child' + _this2.state.nextChild] = null;
                _this2.forceUpdate(resolve);
              }, timeout);
            });
          };

          // Before remove classes
          var willEnd = function willEnd() {
            if (child.onTransitionWillEnd) {
              return child.onTransitionWillEnd(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Remove appear and active class (or trigger manual end)
          var end = function end() {
            if (dom.classList.contains('transition-item')) {
              dom.classList.remove('transition-appear');
              dom.classList.remove('transition-item');

              if (child.transitionManuallyStop) {
                return child.transitionManuallyStop(_this2.props.data) || Promise.resolve();
              }
              dom.classList.remove('transition-appear-active');
            }
            return Promise.resolve();
          };

          // After remove classes
          var didEnd = function didEnd() {
            _this2.props.onLoad && _this2.props.onLoad();

            if (child.onTransitionDidEnd) {
              return child.onTransitionDidEnd(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          Promise.resolve().then(willStart).then(start).then(didStart).then(waitForTransition).then(willEnd).then(end).then(didEnd).then(function () {
            _this2.props.onLoad && _this2.props.onLoad();
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'trasition-wrapper' },
        _react2.default.Children.map(this.state.child1, function (element) {
          return _react2.default.cloneElement(element, { ref: 'child1' });
        }),
        _react2.default.Children.map(this.state.child2, function (element) {
          return _react2.default.cloneElement(element, { ref: 'child2' });
        })
      );
    }
  }]);

  return PageTransition;
}(_react2.default.Component);

exports.default = PageTransition;