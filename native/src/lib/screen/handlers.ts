import xs, {Stream} from 'xstream';

type Handlers = {
  [name: string]: Stream<any>;
};

const handlers: Handlers = {};

export const SHAMEFUL_SELECTOR = '@@shameful';

export function getShamefulHandlerSubject(evType: string): Stream<any> {
  const selector = SHAMEFUL_SELECTOR;
  return getHandlerSubject(selector, evType);
};

export function getHandlerSubject(selector: string, evType: string): Stream<any> {
  handlers[selector] = handlers[selector] || {};
  handlers[selector][evType] = handlers[selector][evType] || xs.create();
  return handlers[selector][evType];
};
