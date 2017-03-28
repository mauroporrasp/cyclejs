import 'mocha';
import * as React from 'react';
import xs from 'xstream';
import * as ReactNative from 'react-native';
import {setup} from '@cycle/run';
import {
  makeReactNativeDriver,
  TouchableHighlight as TH,
  TouchableNativeFeedback as TNF,
  TouchableOpacity as TO,
  TouchableWithoutFeedback as TWF,
  ListView as LV,
} from '../lib/index';
import {shallow} from 'enzyme';
const assert = require('assert');
// const Enzyme = require('enzyme');
// const shallow = Enzyme.shallow;
const ListView = React.createFactory(LV);
const TouchableOpacity = React.createFactory(TO);
const TouchableWithoutFeedback = React.createFactory(TWF);
const TouchableHighlight = React.createFactory(TH);
const TouchableNativeFeedback = React.createFactory(TNF);
const View = React.createFactory(ReactNative.View);
const Text = React.createFactory(ReactNative.Text);

describe('RN driver', function () {
  describe('with TouchableOpacity', function () {
    it('should allow using source . select . events', function (done) {
      function main(sources: any) {
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          TouchableOpacity({selector: 'button'},
            Text({}, '' + i),
          ),
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(vdom);
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => wrapper.simulate('press'));
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
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          TouchableNativeFeedback({selector: 'button'},
            Text({}, '' + i),
          ),
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(vdom);
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => wrapper.simulate('press'));
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
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          TouchableHighlight({selector: 'button'},
            Text({}, '' + i),
          ),
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(vdom);
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => wrapper.simulate('press'));
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
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
        const vdom$ = count$.map((i: number) =>
          TouchableWithoutFeedback({selector: 'button'},
            Text({}, '' + i),
          ),
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: (vdom: React.ReactElement<any>) => {
        const wrapper = shallow(vdom);
        assert.strictEqual(wrapper.childAt(0).childAt(0).childAt(0).text(), `${turn}`);
        setTimeout(() => wrapper.simulate('press'));
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
          ListView({items: persons, renderRow: (item: any) =>
            View({},
              Text({}, item.name),
            ),
          }),
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      const endlessSink$ = xs.merge(sinks.RN, xs.never());
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