import 'mocha';
import xs from 'xstream';
import {Keyboard} from 'react-native';
import {setup, run} from '@cycle/run';
import * as sinon from 'sinon';
import {makeKeyboardDriver} from '../lib/index';
const assert = require('assert');

describe('Keyboard driver', function() {
  it('should allow dismissing the keyboard', function(done) {
    const sandbox = sinon.sandbox.create();
    sandbox.stub(Keyboard, 'dismiss');

    function main() {
      const dismiss$ = xs.periodic(200).take(1).map(i => 'dismiss');
      return {Keyboard: dismiss$};
    }

    run(main, {Keyboard: makeKeyboardDriver()});

    setTimeout(() => {
      sinon.assert.calledOnce(Keyboard.dismiss as any);
      sinon.assert.calledWithExactly(Keyboard.dismiss as any);
      sandbox.restore();
      done();
    }, 400);
  });

  /**
   * How to test this? In particular, how to actually trigger an event from
   * react-native-mock
   */
  it.skip(
    'should allow using KeyboardSource.events() to listen to events',
    function(done) {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(Keyboard, '');

      function main() {
        const dismiss$ = xs.periodic(200).take(1).map(i => 'dismiss');
        return {Keyboard: dismiss$};
      }

      run(main, {Keyboard: makeKeyboardDriver()});

      setTimeout(() => {
        sinon.assert.calledOnce(Keyboard.dismiss as any);
        sinon.assert.calledWithExactly(Keyboard.dismiss as any);
        done();
      }, 400);
    },
  );
});
