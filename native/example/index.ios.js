import {run} from '@cycle/run';
import {makeReactNativeDriver} from '@cycle/native';
import {makeHTTPDriver} from '@cycle/http';
import {main} from './common'

run(main, {
  RN: makeReactNativeDriver('example'),
  HTTP: makeHTTPDriver()
});
