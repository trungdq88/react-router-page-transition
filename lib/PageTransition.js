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

exports.default = function () {
  var React = arguments.length <= 0 || arguments[0] === undefined ? _react2.default : arguments[0];
  var ReactDom = arguments.length <= 1 || arguments[1] === undefined ? _reactDom2.default : arguments[1];
  return function (_React$Component) {
    _inherits(PageTransition, _React$Component);

    function PageTransition() {
      var _Object$getPrototypeO;

      _classCallCheck(this, PageTransition);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PageTransition)).call.apply(_Object$getPrototypeO, [this].concat(args)));

      if (_this.props.animateOnInit) {
        _this.state = {
          child1: null,
          child2: null,
          nextChild: 1,
          initDone: false
        };
      } else {
        _this.state = {
          child1: _this.props.children,
          child2: null,
          nextChild: 2,
          initDone: true
        };
      }
      _this.transite = _this.transite.bind(_this);
      _this.getRef = _this.getRef.bind(_this);
      return _this;
    }

    _createClass(PageTransition, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (!this.props.animateOnInit) {
          var child = this.getRef('child1');
          if (child) {
            var dom = ReactDom.findDOMNode(child);
            child.onTransitionDidEnd && child.onTransitionDidEnd(this.props.data);
            dom.classList.remove('transition-item');
          }
        } else {
          this.transite(this.props.children, true);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        // If there is new children
        if (this.props.children !== nextProps.children) {
          this.transite(nextProps.children);
        }
      }
    }, {
      key: 'getRef',
      value: function getRef(ref) {
        var child = this.refs[ref];
        // Dirty way to check if the component is
        // wrapped with react-redux Connect
        if (child && child.getWrappedInstance) {
          child = child.getWrappedInstance();
        }
        return child;
      }
    }, {
      key: 'transite',
      value: function transite(nextChild, isInit) {
        var _this2 = this;

        // Render the new children
        this.state['child' + this.state.nextChild] = nextChild;
        this.forceUpdate(function () {
          var prevChild = _this2.getRef('child' + (_this2.state.nextChild === 1 ? 2 : 1));
          var newChild = _this2.getRef('child' + _this2.state.nextChild);
          var prevChildDom = ReactDom.findDOMNode(prevChild);
          var newChildDom = ReactDom.findDOMNode(newChild);
          var timeout = 0;

          // Before add appear class
          var willStart = function willStart() {
            if (newChild.onTransitionWillStart) {
              return newChild.onTransitionWillStart(_this2.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveWillStart) {
              return prevChild.onTransitionLeaveWillStart(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Add appear class and active class (or trigger manual start)
          var start = function start() {
            if (newChildDom.classList.contains('transition-item')) {
              timeout = _this2.props.timeout || DEFAULT_TIMEOUT;
              newChildDom.classList.add('transition-appear');
              newChildDom.offsetHeight; // Trigger layout to make sure transition happen
              if (newChild.transitionManuallyStart) {
                return newChild.transitionManuallyStart(_this2.props.data, start) || Promise.resolve();
              }
              newChildDom.classList.add('transition-appear-active');
            }
            if (prevChildDom) {
              prevChildDom.classList.add('transition-leave');
              prevChildDom.classList.add('transition-item');
              timeout = _this2.props.timeout || DEFAULT_TIMEOUT;
              prevChildDom.offsetHeight; // Trigger layout to make sure transition happen
              if (prevChild.transitionManuallyLeaveStart) {
                return prevChild.transitionManuallyLeaveStart(_this2.props.data, start) || Promise.resolve();
              }
              prevChildDom.classList.add('transition-leave-active');
            }
            return Promise.resolve();
          };

          // After add classes
          var didStart = function didStart() {
            if (newChild.onTransitionDidStart) {
              return newChild.onTransitionDidStart(_this2.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionDidStartLeave) {
              return prevChild.onTransitionLeaveDidStart(_this2.props.data) || Promise.resolve();
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
            if (newChild.onTransitionWillEnd) {
              return newChild.onTransitionWillEnd(_this2.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveWillEnd) {
              return prevChild.onTransitionLeaveWillEnd(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Remove appear and active class (or trigger manual end)
          var end = function end() {
            if (newChildDom.classList.contains('transition-item')) {
              newChildDom.classList.remove('transition-appear');
              newChildDom.classList.remove('transition-item');

              if (newChild.transitionManuallyStop) {
                return newChild.transitionManuallyStop(_this2.props.data) || Promise.resolve();
              }
              newChildDom.classList.remove('transition-appear-active');
            }
            if (prevChildDom && prevChildDom.classList.contains('transition-item')) {
              prevChildDom.classList.remove('transition-leave');
              prevChildDom.classList.remove('transition-item');

              if (prevChild.transitionLeaveManuallyStop) {
                return prevChild.transitionLeaveManuallyStop(_this2.props.data) || Promise.resolve();
              }
              prevChildDom.classList.remove('transition-leave-active');
            }
            return Promise.resolve();
          };

          // After remove classes
          var didEnd = function didEnd() {
            _this2.props.onLoad && _this2.props.onLoad();

            if (newChild.onTransitionDidEnd) {
              return newChild.onTransitionDidEnd(_this2.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveDidEnd) {
              return prevChild.onTransitionLeaveDidEnd(_this2.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          Promise.resolve().then(willStart).then(start).then(didStart).then(waitForTransition).then(willEnd).then(end).then(didEnd).then(function () {
            _this2.props.onLoad && _this2.props.onLoad();
            if (isInit) {
              // this.setState({ initDone: true });
            }
          });
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          { className: 'trasition-wrapper' },
          React.Children.map(this.state.child1, function (element) {
            return React.cloneElement(element, { ref: 'child1' });
          }),
          React.Children.map(this.state.child2, function (element) {
            return React.cloneElement(element, { ref: 'child2' });
          })
        );
      }
    }]);

    return PageTransition;
  }(React.Component);
};