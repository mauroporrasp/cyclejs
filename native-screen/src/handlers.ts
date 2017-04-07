import xs, {Stream} from 'xstream';

export type HandlersPerSelector = {
  [selector: string]: Handlers,
};

export type Handlers = {
  [evType: string]: Stream<any>,
};

const handlers: HandlersPerSelector = {};

export function getHandlers(selector: string): Handlers {
  handlers[selector] = handlers[selector] || {};
  return handlers[selector];
};

export function getHandler(selector: string, evType: string): Stream<any> {
  handlers[selector] = handlers[selector] || {};
  handlers[selector][evType] = handlers[selector][evType] || xs.create();
  return handlers[selector][evType];
};
