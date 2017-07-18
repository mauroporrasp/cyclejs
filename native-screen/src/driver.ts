import {Component, ReactElement, createElement} from 'react';
import xs, {Stream, Listener} from 'xstream';
import {AppRegistry, View} from 'react-native';
import {ScreenSource} from './ScreenSource';

export function makeScreenDriver(appKey: string) {
  return function reactNativeDriver(vdom$: Stream<ReactElement<any>>) {
    function componentFactory() {
      return class extends Component<any, {vdom: ReactElement<any>}> {
        constructor() {
          super();
          this.state = {vdom: createElement(View)};
        }

        public componentWillMount() {
          vdom$.addListener({
            next: vdom => {
              this.setState(() => ({vdom: vdom}));
            },
          });
        }

        public render() {
          return this.state.vdom;
        }
      };
    }

    AppRegistry.registerComponent(appKey, componentFactory);

    return new ScreenSource();
  };
}
