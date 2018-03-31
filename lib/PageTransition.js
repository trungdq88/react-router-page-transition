'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _promiseQueue = require('promise-queue');

var _promiseQueue2 = _interopRequireDefault(_promiseQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageTransition = function (_React$Component) {
  _inherits(PageTransition, _React$Component);

  _createClass(PageTransition, null, [{
    key: 'compareChildren',
    value: function compareChildren(prevChild, nextChild) {
      if (prevChild && prevChild.props && prevChild.props['data-transition-id'] && nextChild.props && nextChild.props['data-transition-id']) {
        return prevChild.props['data-transition-id'] === nextChild.props['data-transition-id'];
      }
      return prevChild === nextChild;
    }
  }]);

  function PageTransition() {
    var _ref;

    _classCallCheck(this, PageTransition);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = PageTransition.__proto__ || Object.getPrototypeOf(PageTransition)).call.apply(_ref, [this].concat(args)));

    if (_this.props.animateOnInit) {
      _this.state = {
        child1: null,
        child2: null,
        nextChild: 1
      };
    } else {
      _this.state = {
        child1: _this.props.children,
        child2: null,
        nextChild: 2
      };
    }
    _this.transite = _this.transite.bind(_this);
    _this.getRef = _this.getRef.bind(_this);

    _this.queue = new _promiseQueue2.default(1, Infinity); // max concurrent 1, max queue Inf
    return _this;
  }

  _createClass(PageTransition, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.animateOnInit) {
        var child = this.getRef('child1');
        if (child) {
          var dom = _reactDom2.default.findDOMNode(child);
          child.onTransitionDidEnd && child.onTransitionDidEnd(this.props.data);
          dom.classList.remove('transition-item');
          if (this.hasTransitionAction()) {
            dom.classList.remove('transition-' + this.props.transitionAction);
          }
        }
      } else {
        this.transite(this.props.children);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var transitNewChild = function transitNewChild() {
        _this2.queue.add(function () {
          return _this2.transite(nextProps.children);
        });
      };
      var updateChild = function updateChild() {
        var currentChild = _this2.state.nextChild === 1 ? 2 : 1;
        _this2.state['child' + currentChild] = nextProps.children;
        _this2.forceUpdate();
      };

      var isChildrenEqual = this.props.compareChildren || PageTransition.compareChildren;
      isChildrenEqual(this.props.children, nextProps.children) ? updateChild() : transitNewChild();
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
    key: 'hasTransitionAction',
    value: function hasTransitionAction() {
      return this.props.transitionAction && this.props.transitionAction != '';
    }
  }, {
    key: 'transite',
    value: function transite(nextChild) {
      var _this3 = this;

      return new Promise(function (transiteDone, transiteFailed) {
        // Render the new children
        _this3.state['child' + _this3.state.nextChild] = nextChild;
        _this3.forceUpdate(function () {
          var prevChild = _this3.getRef('child' + (_this3.state.nextChild === 1 ? 2 : 1));
          var newChild = _this3.getRef('child' + _this3.state.nextChild);
          var prevChildDom = _reactDom2.default.findDOMNode(prevChild);
          var newChildDom = _reactDom2.default.findDOMNode(newChild);
          var timeout = 0;

          // Before add appear class
          var willStart = function willStart() {
            if (newChild.onTransitionWillStart) {
              return newChild.onTransitionWillStart(_this3.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveWillStart) {
              return prevChild.onTransitionLeaveWillStart(_this3.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Add appear class and active class (or trigger manual start)
          var start = function start() {
            if (newChildDom.classList.contains('transition-item')) {
              timeout = _this3.props.timeout;
              newChildDom.classList.add('transition-appear');
              if (_this3.hasTransitionAction()) {
                newChildDom.classList.add('transition-' + _this3.props.transitionAction);
              }
              newChildDom.offsetHeight; // Trigger layout to make sure transition happen
              if (newChild.transitionManuallyStart) {
                return newChild.transitionManuallyStart(_this3.props.data, start) || Promise.resolve();
              }
              newChildDom.classList.add('transition-appear-active');
            }
            if (prevChildDom) {
              prevChildDom.classList.add('transition-leave');
              prevChildDom.classList.add('transition-item');
              if (_this3.hasTransitionAction()) {
                prevChildDom.classList.add('transition-' + _this3.props.transitionAction);
              }
              timeout = _this3.props.timeout;
              prevChildDom.offsetHeight; // Trigger layout to make sure transition happen
              if (prevChild.transitionLeaveManuallyStart) {
                return prevChild.transitionLeaveManuallyStart(_this3.props.data, start) || Promise.resolve();
              }
              prevChildDom.classList.add('transition-leave-active');
            }
            return Promise.resolve();
          };

          // After add classes
          var didStart = function didStart() {
            if (newChild.onTransitionDidStart) {
              return newChild.onTransitionDidStart(_this3.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveDidStart) {
              return prevChild.onTransitionLeaveDidStart(_this3.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Wait for transition
          var waitForTransition = function waitForTransition() {
            return new Promise(function (resolve) {
              setTimeout(function () {
                // Swap child and remove the old child
                _this3.state.nextChild = _this3.state.nextChild === 1 ? 2 : 1;
                _this3.state['child' + _this3.state.nextChild] = null;
                _this3.forceUpdate(resolve);
              }, timeout);
            });
          };

          // Before remove classes
          var willEnd = function willEnd() {
            if (newChild.onTransitionWillEnd) {
              return newChild.onTransitionWillEnd(_this3.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveWillEnd) {
              return prevChild.onTransitionLeaveWillEnd(_this3.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          // Remove appear and active class (or trigger manual end)
          var end = function end() {
            if (newChildDom.classList.contains('transition-item')) {
              newChildDom.classList.remove('transition-appear');
              newChildDom.classList.remove('transition-item');

              if (newChild.transitionManuallyStop) {
                return newChild.transitionManuallyStop(_this3.props.data) || Promise.resolve();
              }
              if (_this3.hasTransitionAction()) {
                newChildDom.classList.remove('transition-' + _this3.props.transitionAction);
              }
              newChildDom.classList.remove('transition-appear-active');
            }
            if (prevChildDom && prevChildDom.classList.contains('transition-item')) {
              prevChildDom.classList.remove('transition-leave');
              prevChildDom.classList.remove('transition-item');

              if (prevChild.transitionLeaveManuallyStop) {
                return prevChild.transitionLeaveManuallyStop(_this3.props.data) || Promise.resolve();
              }
              if (_this3.hasTransitionAction()) {
                prevChildDom.classList.remove('transition-' + _this3.props.transitionAction);
              }
              prevChildDom.classList.remove('transition-leave-active');
            }
            return Promise.resolve();
          };

          // After remove classes
          var didEnd = function didEnd() {
            if (newChild.onTransitionDidEnd) {
              return newChild.onTransitionDidEnd(_this3.props.data) || Promise.resolve();
            }
            if (prevChild && prevChild.onTransitionLeaveDidEnd) {
              return prevChild.onTransitionLeaveDidEnd(_this3.props.data) || Promise.resolve();
            }
            return Promise.resolve();
          };

          Promise.resolve().then(willStart).then(start).then(didStart).then(waitForTransition).then(willEnd).then(end).then(didEnd).then(function () {
            _this3.props.onLoad && _this3.props.onLoad();
            transiteDone();
          }).catch(transiteFailed);
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'transition-wrapper' },
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


PageTransition.propTypes = {
  'data-transition-id': _propTypes2.default.string,
  data: _propTypes2.default.object,
  animateOnInit: _propTypes2.default.bool,
  timeout: _propTypes2.default.number,
  compareChildren: _propTypes2.default.func,
  transitionAction: _propTypes2.default.string
};

PageTransition.defaultProps = {
  timeout: 500
};