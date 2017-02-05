import React from 'react';
import ReactDom from 'react-dom';
import Queue from 'promise-queue';

const DEFAULT_TIMEOUT = 500;

export default class PageTransition extends React.Component {

  constructor(...args) {
    super(...args);
    if (this.props.animateOnInit) {
      this.state = {
        child1: null,
        child2: null,
        nextChild: 1,
      };
    } else {
      this.state = {
        child1: this.props.children,
        child2: null,
        nextChild: 2,
      };
    }
    this.transite = this.transite.bind(this);
    this.getRef = this.getRef.bind(this);

    this.queue = new Queue(1, Infinity); // max concurrent 1, max queue Inf
  }

  componentDidMount() {
    if (!this.props.animateOnInit) {
      const child = this.getRef('child1');
      if (child) {
        const dom = ReactDom.findDOMNode(child);
        child.onTransitionDidEnd && child.onTransitionDidEnd(this.props.data);
        dom.classList.remove('transition-item');
      }
    } else {
      this.transite(this.props.children);
    }
  }

  componentWillReceiveProps(nextProps) {
    const transitNewChild = () => {
      this.queue.add(() => this.transite(nextProps.children));
    };
    const updateChild = () => {
      const currentChild = this.state.nextChild === 1 ? 2 : 1;
      this.state[`child${currentChild}`] = nextProps.children;
      this.forceUpdate();
    };

    if (
      this.props.children && this.props.children.props &&
      this.props.children.props['data-transition-id'] &&
      nextProps.children.props['data-transition-id']
    ) {
      if (
        this.props.children.props['data-transition-id'] !==
        nextProps.children.props['data-transition-id']
      ) {
        transitNewChild();
      } else {
        updateChild();
      }
    } else {
      if (this.props.children !== nextProps.children) {
        transitNewChild();
      } else {
        updateChild();
      }
    }
  }

  getRef(ref) {
    let child = this.refs[ref];
    // Dirty way to check if the component is
    // wrapped with react-redux Connect
    if (child && child.getWrappedInstance) {
      child = child.getWrappedInstance();
    }
    return child;
  }

  transite(nextChild) {
    return new Promise((transiteDone, transiteFailed) => {
      // Render the new children
      this.state[`child${this.state.nextChild}`] = nextChild;
      this.forceUpdate(() => {
        const prevChild = this.getRef(`child${this.state.nextChild === 1 ? 2 : 1}`);
        const newChild = this.getRef(`child${this.state.nextChild}`);
        const prevChildDom = ReactDom.findDOMNode(prevChild);
        const newChildDom = ReactDom.findDOMNode(newChild);
        let timeout = 0;

        // Before add appear class
        const willStart = () => {
          if (newChild.onTransitionWillStart) {
            return newChild.onTransitionWillStart(this.props.data) ||
              Promise.resolve();
          }
          if (prevChild && prevChild.onTransitionLeaveWillStart) {
            return prevChild.onTransitionLeaveWillStart(this.props.data) ||
              Promise.resolve();
          }
          return Promise.resolve();
        };

        // Add appear class and active class (or trigger manual start)
        const start = () => {
          if (newChildDom.classList.contains('transition-item')) {
            timeout = this.props.timeout || DEFAULT_TIMEOUT;
            newChildDom.classList.add('transition-appear');
            newChildDom.offsetHeight; // Trigger layout to make sure transition happen
            if (newChild.transitionManuallyStart) {
              return newChild.transitionManuallyStart(this.props.data, start) ||
                Promise.resolve();
            }
            newChildDom.classList.add('transition-appear-active');
          }
          if (prevChildDom) {
            prevChildDom.classList.add('transition-leave');
            prevChildDom.classList.add('transition-item');
            timeout = this.props.timeout || DEFAULT_TIMEOUT;
            prevChildDom.offsetHeight; // Trigger layout to make sure transition happen
            if (prevChild.transitionLeaveManuallyStart) {
              return prevChild.transitionLeaveManuallyStart(this.props.data, start) ||
                Promise.resolve();
            }
            prevChildDom.classList.add('transition-leave-active');
          }
          return Promise.resolve();
        };

        // After add classes
        const didStart = () => {
          if (newChild.onTransitionDidStart) {
            return newChild.onTransitionDidStart(this.props.data) ||
              Promise.resolve();
          }
          if (prevChild && prevChild.onTransitionDidStartLeave) {
            return prevChild.onTransitionLeaveDidStart(this.props.data) ||
              Promise.resolve();
          }
          return Promise.resolve();
        };

        // Wait for transition
        const waitForTransition = () => new Promise(resolve => {
          setTimeout(() => {
            // Swap child and remove the old child
            this.state.nextChild = this.state.nextChild === 1 ? 2 : 1;
            this.state[`child${this.state.nextChild}`] = null;
            this.forceUpdate(resolve);
          }, timeout);
        });

        // Before remove classes
        const willEnd = () => {
          if (newChild.onTransitionWillEnd) {
            return newChild.onTransitionWillEnd(this.props.data) ||
              Promise.resolve();
          }
          if (prevChild && prevChild.onTransitionLeaveWillEnd) {
            return prevChild.onTransitionLeaveWillEnd(this.props.data) ||
              Promise.resolve();
          }
          return Promise.resolve();
        };

        // Remove appear and active class (or trigger manual end)
        const end = () => {
          if (newChildDom.classList.contains('transition-item')) {
            newChildDom.classList.remove('transition-appear');
            newChildDom.classList.remove('transition-item');

            if (newChild.transitionManuallyStop) {
              return newChild.transitionManuallyStop(this.props.data) ||
                Promise.resolve();
            }
            newChildDom.classList.remove('transition-appear-active');
          }
          if (prevChildDom && prevChildDom.classList.contains('transition-item')) {
            prevChildDom.classList.remove('transition-leave');
            prevChildDom.classList.remove('transition-item');

            if (prevChild.transitionLeaveManuallyStop) {
              return prevChild.transitionLeaveManuallyStop(this.props.data) ||
                Promise.resolve();
            }
            prevChildDom.classList.remove('transition-leave-active');
          }
          return Promise.resolve();
        };

        // After remove classes
        const didEnd = () => {
          if (newChild.onTransitionDidEnd) {
            return newChild.onTransitionDidEnd(this.props.data) ||
              Promise.resolve();
          }
          if (prevChild && prevChild.onTransitionLeaveDidEnd) {
            return prevChild.onTransitionLeaveDidEnd(this.props.data) ||
              Promise.resolve();
          }
          return Promise.resolve();
        };

        Promise.resolve()
          .then(willStart)
          .then(start)
          .then(didStart)
          .then(waitForTransition)
          .then(willEnd)
          .then(end)
          .then(didEnd)
          .then(() => {
            this.props.onLoad && this.props.onLoad();
            transiteDone();
          })
          .catch(transiteFailed)

      });
    });
  }

  render() {
    return (
      <div className="transition-wrapper">
        {React.Children.map(this.state.child1, element =>
            React.cloneElement(element, { ref: 'child1' })
        )}
        {React.Children.map(this.state.child2, element =>
          React.cloneElement(element, { ref: 'child2' })
        )}
      </div>
    );
  }
};
