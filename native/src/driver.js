import React from 'react'
import xs from 'xstream'
import ReactNative from 'react-native';
const {AppRegistry, View} = ReactNative;

const BACK_ACTION = '@@back';
const backHandler = xs.create();

let handlers = {
  [BACK_ACTION]: createHandler()
};

function createHandler() {
  const handler = xs.create();
  handler.send = function sendIntoSubject(x) {
    handler.shamefullySendNext(x)
  }
  return handler;
}

export function getBackHandler() {
  return handlers[BACK_ACTION];
}

export function registerHandler(selector, evType) {
  handlers[selector] = handlers[selector] || {};
  handlers[selector][evType] = handlers[selector][evType] || createHandler();
  return handlers[selector][evType];
};

export function findHandler(evType, selector) {
  if (evType === BACK_ACTION && !selector) {
    return handlers[BACK_ACTION];
  }
  if (!handlers[selector]) {
    return registerHandler(selector, evType).send;
  }
  if (handlers[selector].hasOwnProperty(evType)) {
    return handlers[selector][evType].send
  }
}

function isChildReactElement(child) {
  return !!child && typeof child === `object` && child._isReactElement
}

function makeReactNativeDriver(appKey) {
  return function reactNativeDriver(vtree$) {
    function componentFactory() {
      return React.createClass({
        componentWillMount() {
          vtree$.subscribe(newVTree => {
            this.setState({vtree: newVTree})
          })
        },
        getInitialState() {
          return {vtree: React.createElement(View)}
        },
        render() {
          return this.state.vtree
        },
      })
    }

    let response = {
      select(selector) {
        return {
          observable: xs.empty(),
          events: function events(evType) {
            return registerHandler(selector, evType);
          },
        }
      },

      navigateBack() {
        return findHandler(BACK_ACTION);
      }
    }

    AppRegistry.registerComponent(appKey, componentFactory)

    return response
  }
}

export default makeReactNativeDriver
