import Rx from 'rx';

const action = new Rx.Subject();

action.subscribe(console.log.bind(console, '[ACTION]'));

export default action;
