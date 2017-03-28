import xs, {Stream} from 'xstream';
const BACK_ACTION = '@@back';
const backHandler = createHandler();

const handlers: any = {
  [BACK_ACTION]: backHandler,
};

function createHandler() {
  const handler = xs.create();
  (handler as any).send = function sendIntoSubject(x: any) {
    handler.shamefullySendNext(x);
  };
  return handler;
}

export function getBackHandler() {
  return handlers[BACK_ACTION];
}

export function registerHandler(selector: string, evType: string) {
  handlers[selector] = handlers[selector] || {};
  handlers[selector][evType] = handlers[selector][evType] || createHandler();
  return handlers[selector][evType];
};

export function findHandler(evType: string, selector?: string) {
  if (evType === BACK_ACTION && !selector) {
    return handlers[BACK_ACTION];
  }
  if (selector && !handlers[selector]) {
    return registerHandler(selector, evType).send;
  }
  if (selector && handlers[selector].hasOwnProperty(evType)) {
    return handlers[selector][evType].send;
  }
}
