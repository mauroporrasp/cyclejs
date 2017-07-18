import {Component, createElement} from 'react';
import {Animated} from 'react-native';

function createAnimationDongle(className: string): typeof Component {
  return class extends Component<any, any> {
    public static displayName = 'Cycle' + className;

    constructor(props: any) {
      super();
      const currentValue = new Animated.Value(this.props.initialValue || 0);
      this.state = {currentValue};
    }

    public componentWillReceiveProps(nextProps: any) {
      if (nextProps.value !== this.state.currentValue._value) {
        this.runAnimation(nextProps);
      }
    }

    private runAnimation({animation, options = {}, value}: any) {
      animation(this.state.currentValue, {
        ...options,
        toValue: value,
      }).start();
    }

    public render() {
      const AnimatedClass = Animated[className];
      const {animate} = this.props;

      const animatedStyle: any = Object.keys(animate)
        .filter(key => key !== 'transform')
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: this.state.currentValue.interpolate(animate[key]),
          }),
          {},
        );

      if (animate.transform) {
        const transforms = animate.transform.map((obj: any) => {
          const key = Object.keys(obj)[0];
          return {
            [key]: this.state.currentValue.interpolate(obj[key]),
          };
        });

        animatedStyle.transform = transforms;
      }

      const style = {...this.props.style || {}, ...animatedStyle};
      const extraProps = {source: this.props.source};

      return createElement(
        AnimatedClass,
        {style, ...extraProps},
        this.props.children,
      );
    }
  };
}

export const View = createAnimationDongle('View');
export const Text = createAnimationDongle('Text');
export const Image = createAnimationDongle('Image');
