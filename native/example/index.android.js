import {run} from '@cycle/core';
import makeReactNativeDriver from '@cycle/react-native/lib/driver';
import {makeHTTPDriver} from '@cycle/http';
import {main} from './common'

run(main, {
  RN: makeReactNativeDriver('example'),
  HTTP: makeHTTPDriver()
});