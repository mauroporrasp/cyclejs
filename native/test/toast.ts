import 'mocha';
import * as React from 'react';
import xs from 'xstream';
import * as ReactNative from 'react-native';
import {setup, run} from '@cycle/run';
import * as sinon from 'sinon';
const assert = require('assert');

// Mock this ourselves, since it's lacking in `react-native-mock`
const ToastAndroid = (ReactNative as any).ToastAndroid = {
  show(message: string, duration: number) {
  },
  showWithGravity(message: string, duration: number, gravity: number) {
  },
  SHORT: 1,
  LONG: 2,
  TOP: 3,
  BOTTOM: 4,
  CENTER: 5,
};

// Must import this after the mock
const {makeToastDriver, Duration} = require('../toast');

let previousPlatformOS: any;

describe('Toast driver', function () {
  before(function () {
    previousPlatformOS = ReactNative.Platform.OS;
    ReactNative.Platform.OS = 'android';
  });

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

    run(main, {Toast: makeToastDriver()});

    setTimeout(() => {
      sinon.assert.calledOnce(ToastAndroid.show as any);
      sinon.assert.calledWithExactly(ToastAndroid.show as any,
        'This is toast #1', ToastAndroid.SHORT,
      );
      done();
    }, 400);
  });

  after(function () {
    ReactNative.Platform.OS = previousPlatformOS;
  });
});
