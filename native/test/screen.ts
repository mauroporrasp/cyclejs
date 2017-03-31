import 'mocha';
import * as React from 'react';
import xs from 'xstream';
import * as ReactNative from 'react-native';
import {setup} from '@cycle/run';
import {makeScreenDriver, ListView, ScreenSource, h} from '../screen';
import {shallow} from 'enzyme';
const assert = require('assert');
const {
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = ReactNative;

function mockReactNativeEventEmitter() {
  return {
    handleTopLevel(type: string, i: any = {}, ne: any = null, t: any = 0) {
    },
    simulateEvent(key: string, type: string) {
      this.handleTopLevel(type, {
        _currentElement: {
          _owner: {
            _currentElement: {
              key,
            },
          },
        },
      });
    },
  };
}

describe('Screen driver', function () {
  describe('with TouchableOpacity', function () {
    it('should allow using shameful source . events', function (done) {
      function main(sources: {Screen: ScreenSource}) {
        const inc$ = sources.Screen.events('foo');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          h(TouchableOpacity, {shamefullySendToSource: {onPress: 'foo'}}, [
            h(View, [
              h(Text, {}, '' + i),
            ]),
          ]),
        );
        return {Screen: vdom$};
      }

      const RNEventEmitter = mockReactNativeEventEmitter();

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', RNEventEmitter),
      });

      let turn = 0;
      sinks.Screen.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(React.createElement(() => vdom));
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => wrapper.simulate('press'));
        turn++;
        if (turn === 3) {
          done();
        }
      }});

      run();
    });

    it('should allow using source . select . events', function (done) {
      function main(sources: {Screen: ScreenSource}) {
        const inc$ = sources.Screen.select('button').events('topTouchEnd');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          h(TouchableOpacity, {key: 'button'}, [
            h(View, [
              h(Text, {}, '' + i),
            ]),
          ]),
        );
        return {Screen: vdom$};
      }

      const RNEventEmitter = mockReactNativeEventEmitter();

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', RNEventEmitter),
      });

      let turn = 0;
      sinks.Screen.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(React.createElement(() => vdom));
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => RNEventEmitter.simulateEvent('button', 'topTouchEnd'));
        turn++;
        if (turn === 3) {
          done();
        }
      }});

      run();
    });
  });

  describe('with TouchableNativeFeedback', function () {
    it('should allow using source . select . events', function (done) {
      function main(sources: any) {
        const inc$ = sources.Screen.select('button').events('topTouchEnd');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          h(TouchableNativeFeedback, {key: 'button'}, [
            h(View, [
              h(Text, '' + i),
            ]),
          ]),
        );
        return {Screen: vdom$};
      }

      const RNEventEmitter = mockReactNativeEventEmitter();

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', RNEventEmitter),
      });

      let turn = 0;
      sinks.Screen.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(React.createElement(() => vdom));
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => RNEventEmitter.simulateEvent('button', 'topTouchEnd'));
        turn++;
        if (turn === 3) {
          done();
        }
      }});

      run();
    });
  });

  describe('with TouchableHighlight', function () {
    it('should allow using source . select . events', function (done) {
      function main(sources: any) {
        const inc$ = sources.Screen.select('button').events('topTouchEnd');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          h(TouchableHighlight, {key: 'button'}, [
            h(View, [
              h(Text, '' + i),
            ]),
          ]),
        );
        return {Screen: vdom$};
      }

      const RNEventEmitter = mockReactNativeEventEmitter();

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', RNEventEmitter),
      });

      let turn = 0;
      sinks.Screen.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(React.createElement(() => vdom));
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => RNEventEmitter.simulateEvent('button', 'topTouchEnd'));
        turn++;
        if (turn === 3) {
          done();
        }
      }});

      run();
    });
  });

  describe('with TouchableWithoutFeedback', function () {
    it('should allow using source . select . events', function (done) {
      function main(sources: any) {
        const inc$ = sources.Screen.select('button').events('topTouchEnd');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          h(TouchableWithoutFeedback, {key: 'button'}, [
            h(View, [
              h(Text, '' + i),
            ]),
          ]),
        );
        return {Screen: vdom$};
      }

      const RNEventEmitter = mockReactNativeEventEmitter();

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', RNEventEmitter),
      });

      let turn = 0;
      sinks.Screen.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(React.createElement(() => vdom));
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => RNEventEmitter.simulateEvent('button', 'topTouchEnd'));
        turn++;
        if (turn === 3) {
          done();
        }
      }});

      run();
    });
  });

  describe('with ListView', function () {
    it('should evolve over time', function (done) {
      function main(sources: any) {
        const persons$ = xs.periodic(100).take(2).map(i =>
          [
            [{name: 'Alice'}],
            [{name: 'Alice'}, {name: 'Bob'}],
          ][i],
        );
        const vdom$ = persons$.map(persons =>
          h(ListView, {items: persons, renderRow: (item: any) =>
            h(View, [
              h(Text, item.name),
            ]),
          }),
        );
        return {Screen: vdom$};
      }

      const {sinks, run} = setup(main, {
        Screen: makeScreenDriver('example', mockReactNativeEventEmitter()),
      });

      const endlessSink$ = xs.merge(sinks.Screen, xs.never());
      endlessSink$.take(1).addListener({next: vdom => {
        const wrapper = shallow(vdom);
        const dataBlob = wrapper.instance().state.dataSource._dataBlob;
        assert.strictEqual(dataBlob.length, 1);
        assert.strictEqual(JSON.stringify(dataBlob[0]), '{"name":"Alice"}');
      }});
      endlessSink$.drop(1).take(1).addListener({next: vdom => {
        const wrapper = shallow(vdom);
        const dataBlob = wrapper.instance().state.dataSource._dataBlob;
        assert.strictEqual(dataBlob.length, 2);
        assert.strictEqual(JSON.stringify(dataBlob[0]), '{"name":"Alice"}');
        assert.strictEqual(JSON.stringify(dataBlob[1]), '{"name":"Bob"}');
        done();
      }});

      run();
    });
  });
});