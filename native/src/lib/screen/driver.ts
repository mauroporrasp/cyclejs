import * as React from 'react';
import xs, {Stream, Listener} from 'xstream';
import {AppRegistry, View} from 'react-native';
import {ScreenSource} from './ScreenSource';

export function makeScreenDriver(appKey: string, RNEventEmitter: any) {
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

    AppRegistry.registerComponent(appKey, componentFactory);

    const topLevelEvent$ = xs.create({
      start(listener: Listener<any>) {
        const oldHandleTopLevel = RNEventEmitter.handleTopLevel;
        RNEventEmitter.handleTopLevel =
          (type: string, inst: any, nativeEvent: any, target: any) => {
            const ev = {type, inst, nativeEvent, target};
            listener.next(ev);
            oldHandleTopLevel.call(this, type, inst, nativeEvent, target);
          };
      },
      stop() {},
    });
    topLevelEvent$.addListener({});

    return new ScreenSource(topLevelEvent$);
  };
}
