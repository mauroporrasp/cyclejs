import 'mocha';
import * as React from 'react';
import xs from 'xstream';
import * as ReactNative from 'react-native';
import {setup} from '@cycle/run';
import {makeToastDriver, Duration} from '../toast';
import * as sinon from 'sinon';
const ToastAndroid = ReactNative.ToastAndroid;
const assert = require('assert');

/**
 * react-native-mock does not yet mock ToastAndroid so we cannot yet
 * test this driver.
 */
describe.skip('Toast driver', function () {
  it('should allow showing a toast', function (done) {
    const sandbox = sinon.sandbox.create();
    sandbox.stub(ToastAndroid, 'show');

    function main() {
      const toast$ = xs.periodic(200).take(1)
        .map(i => ({
          message: `This is toast #${i + 1}`,
          type: 'show',
          duration: Duration.SHORT,
        }));
      return {Toast: toast$};
    }

    const {run} = setup(main, {Toast: makeToastDriver()});

    setTimeout(() => {
      sinon.assert.calledOnce(ToastAndroid.show as any);
      sinon.assert.calledWithExactly(ToastAndroid.show as any,
        'This is toast #1', ToastAndroid.SHORT,
      );
      done();
    }, 500);
  });
});
