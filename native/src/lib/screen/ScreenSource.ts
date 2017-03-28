import {Stream} from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import {registerHandler, getBackHandler} from './handlers';

export class ScreenSource {
  private selector: string | null;

  constructor(selector: (string | null) = null) {
    this.selector = selector;
  }

  public select(selector: string): ScreenSource {
    return new ScreenSource(selector);
  }

  public events(eventType: string): Stream<any> {
    if (this.selector === null) {
      throw new Error(`Cannot get event stream of type ${eventType} from ` +
        'a ScreenSource that had no selector. Perhaps you missed ' +
        'source.select(sel) ?');
    }
    return adapt(registerHandler(this.selector, eventType));
  }

  public navigateBack(): any {
    return getBackHandler();
  };
}