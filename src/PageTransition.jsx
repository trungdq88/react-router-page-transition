import FallbackReact from 'react';
import FallbackReactDom from 'react-dom';

const DEFAULT_TIMEOUT = 500;

export default (
  React = FallbackReact, ReactDom = FallbackReactDom
) => class PageTransition extends React.Component {

  constructor(...args) {
    super(...args);
    if (this.props.animateOnInit) {
      this.state = {
        child1: null,
        child2: null,
        nextChild: 1,
        initDone: false,
      };
    } else {
      this.state = {
        child1: this.props.children,
        child2: null,
        nextChild: 2,
        initDone: true,
      };
    }
    this.transite = this.transite.bind(this);
    this.getRef = this.getRef.bind(this);
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
      this.transite(this.props.children, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    // If there is new children
    if (this.props.children !== nextProps.children) {
      this.transite(nextProps.children);
    }
  }

  getRef(ref) {
    let child = this.refs[ref];
    // Dirty way to check if the component is
    // wrapped with react-redux Connect
    if (child.getWrappedInstance) {
      child = child.getWrappedInstance();
    }
    return child;
  }

  transite(nextChild, isInit) {
    // Render the new children
    this.state[`child${this.state.nextChild}`] = nextChild;
    this.forceUpdate(() => {
      const child = this.getRef(`child${this.state.nextChild}`);
      const dom = ReactDom.findDOMNode(child);
      let timeout = 0;

      // Before add appear class
      const willStart = () => {
        if (child.onTransitionWillStart) {
          return child.onTransitionWillStart(this.props.data) || Promise.resolve();
        }
        return Promise.resolve();
      };

      // Add appear class and active class (or trigger manual start)
      const start = () => {
        if (dom.classList.contains('transition-item')) {
          timeout = this.props.timeout || DEFAULT_TIMEOUT;
          dom.classList.add('transition-appear');
          dom.offsetHeight; // Trigger layout to make sure transition happen
          if (child.transitionManuallyStart) {
            return child.transitionManuallyStart(this.props.data, start) || Promise.resolve();
          }
          dom.classList.add('transition-appear-active');
        }
        return Promise.resolve();
      };

      // After add classes
      const didStart = () => {
        if (child.onTransitionDidStart) {
          return child.onTransitionDidStart(this.props.data) || Promise.resolve();
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
        if (child.onTransitionWillEnd) {
          return child.onTransitionWillEnd(this.props.data) || Promise.resolve();
        }
        return Promise.resolve();
      };

      // Remove appear and active class (or trigger manual end)
      const end = () => {
        if (dom.classList.contains('transition-item')) {
          dom.classList.remove('transition-appear');
          dom.classList.remove('transition-item');

          if (child.transitionManuallyStop) {
            return child.transitionManuallyStop(this.props.data) || Promise.resolve();
          }
          dom.classList.remove('transition-appear-active');
        }
        return Promise.resolve();
      };

      // After remove classes
      const didEnd = () => {
        this.props.onLoad && this.props.onLoad();

        if (child.onTransitionDidEnd) {
          return child.onTransitionDidEnd(this.props.data) || Promise.resolve();
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
          if (isInit) {
            // this.setState({ initDone: true });
          }
        });
    });
  }

  render() {
    return (
      <div className="trasition-wrapper">
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
