import {run} from '@cycle/run';
import {makeScreenDriver} from '@cycle/native/screen';
import {makeToastDriver} from '@cycle/native/toast';
import {makeHTTPDriver} from '@cycle/http';
import {main} from './common'

run(main, {
  Screen: makeScreenDriver('example'),
  Toast: makeToastDriver(),
  HTTP: makeHTTPDriver()
});
