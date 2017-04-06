import xs, {Stream, Listener} from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import {getHandler} from './handlers';

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
      return adapt(xs.empty());
    } else {
      return adapt(getHandler(this.selector, eventType));
    }
  }
}