const assert = require('assert');
const React = require('react');
const xs = require('xstream').default;
const ReactNative = require('react-native');
const {setup} = require('@cycle/run');
const makeReactNativeDriver = require('../lib/driver').default;
const Enzyme = require('enzyme');
const shallow = Enzyme.shallow;
const Touchables = require('../lib/Touchable').default;
const ListView = React.createFactory(require('../lib/ListView').default);
const TouchableOpacity = React.createFactory(Touchables.TouchableOpacity);
const TouchableWithoutFeedback = React.createFactory(Touchables.TouchableWithoutFeedback);
const TouchableHighlight = React.createFactory(Touchables.TouchableHighlight);
const TouchableNativeFeedback = React.createFactory(Touchables.TouchableNativeFeedback);
const View = React.createFactory(ReactNative.View);
const Text = React.createFactory(ReactNative.Text);

describe('RN driver', function () {
  describe('with TouchableOpacity', function () {
    it('should allow using source . select . events', function (done) {
      function main(sources) {
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc, x) => acc + 1, 0);
        const vdom$ = count$.map(i =>
          TouchableOpacity({selector: 'button'},
            Text({}, '' + i)
          )
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: vdom => {
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
      function main(sources) {
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc, x) => acc + 1, 0);
        const vdom$ = count$.map(i =>
          TouchableNativeFeedback({selector: 'button'},
            Text({}, '' + i)
          )
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: vdom => {
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
      function main(sources) {
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc, x) => acc + 1, 0);
        const vdom$ = count$.map(i =>
          TouchableHighlight({selector: 'button'},
            Text({}, '' + i)
          )
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: vdom => {
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
      function main(sources) {
        const inc$ = sources.RN.select('button').events('press');
        const count$ = inc$.fold((acc, x) => acc + 1, 0);
        const vdom$ = count$.map(i =>
          TouchableWithoutFeedback({selector: 'button'},
            Text({}, '' + i)
          )
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      let turn = 0;
      sinks.RN.take(3).addListener({next: vdom => {
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
      function main(sources) {
        const persons$ = xs.periodic(100).take(2).map(i =>
          [
            [{name: 'Alice'}],
            [{name: 'Alice'}, {name: 'Bob'}]
          ][i]
        );
        const vdom$ = persons$.map(persons =>
          ListView({items: persons, renderRow: item => {
            View({},
              Text({}, item.name)
            )
          }})
        );
        return {RN: vdom$};
      }

      const {sinks, run} = setup(main, { RN: makeReactNativeDriver('example')});

      const endlessSink$ = xs.merge(sinks.RN, xs.never());
      endlessSink$.take(1).addListener({next: vdom => {
        debugger;
        const wrapper = shallow(vdom);
        const dataBlob = wrapper.instance().state.dataSource._dataBlob;
        assert.strictEqual(dataBlob.length, 1);
        assert.strictEqual(JSON.stringify(dataBlob[0]), '{"name":"Alice"}');
      }});
      endlessSink$.drop(1).take(1).addListener({next: vdom => {
        debugger;
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