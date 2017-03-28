import * as React from 'react';
import {findHandler} from './driver';
import * as ReactNative from 'react-native';
const View = ReactNative.View;

const ACTION_TYPES = {
  onPress: 'press',
  onPressIn: 'pressIn',
  onPressOut: 'pressOut',
  onLongPress: 'longPress',
};

export interface Props {
  selector: string;
}

function createTouchableClass(className: string) {
  return React.createClass<Props, any>({
    displayName: 'Cycle' + className,
    propTypes: {
      selector: React.PropTypes.string.isRequired,
      payload: React.PropTypes.any,
    },
    setNativeProps(props: any) {
      this._touchable.setNativeProps(props);
    },
    render() {
      const TouchableClass = ReactNative[className];
      const {selector, ...props} = this.props;

      // find all defined touch handlers
      const handlers = Object.keys(ACTION_TYPES)
        .map(name => [name, findHandler(ACTION_TYPES[name], selector)])
        .filter(([_, handler]) => !!handler)
        .reduce((memo, [name, handler]) => {
          // pass payload to event handler if defined
          memo[name] = () => handler(this.props.payload || null);
          return memo;
        }, {});

      return React.createElement(TouchableClass, {
        ref: view => this._touchable = view,
        ...handlers,
      },
        React.createElement(View, {...props},
          this.props.children,
        ),
      );
    },
  });
}

export const TouchableOpacity = createTouchableClass('TouchableOpacity');
export const TouchableWithoutFeedback = createTouchableClass('TouchableWithoutFeedback');
export const TouchableHighlight = createTouchableClass('TouchableHighlight');
export const TouchableNativeFeedback = createTouchableClass('TouchableNativeFeedback');
