import * as React from 'react';
import xs, {Stream} from 'xstream';
import {AppRegistry, View} from 'react-native';
import {adapt} from '@cycle/run/lib/adapt';
import {registerHandler, getBackHandler} from './handlers';
import {ScreenSource} from './ScreenSource';

export function makeScreenDriver(appKey: string) {
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

    return new ScreenSource();
  };
}
