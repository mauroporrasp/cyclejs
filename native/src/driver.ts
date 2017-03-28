import * as React from 'react';
import xs, {Stream} from 'xstream';
import {AppRegistry, View} from 'react-native';

const BACK_ACTION = '@@back';
const backHandler = xs.create();

const handlers = {
  [BACK_ACTION]: createHandler(),
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

function isChildReactElement(child: any) {
  return !!child && typeof child === `object` && child._isReactElement;
}

export function makeReactNativeDriver(appKey: string) {
  return function reactNativeDriver(vdom$: Stream<React.ReactElement<any>>) {
    function componentFactory() {
      return React.createClass<any, {vdom: React.ReactElement<any>}>({
        componentWillMount() {
          vdom$.addListener({
            next: vdom => {
              this.setState({vdom: vdom});
            },
          });
        },
        getInitialState() {
          return {vdom: React.createElement(View)};
        },
        render() {
          return this.state.vdom;
        },
      });
    }

    const response = {
      select(selector: string) {
        return {
          observable: xs.empty(),
          events: function events(evType: string) {
            return registerHandler(selector, evType);
          },
        };
      },

      navigateBack() {
        return findHandler(BACK_ACTION);
      },
    };

    AppRegistry.registerComponent(appKey, componentFactory);

    return response;
  };
}
