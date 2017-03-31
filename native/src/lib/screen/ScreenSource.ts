import xs, {Stream, Listener} from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import {getHandlerSubject, SHAMEFUL_SELECTOR} from './handlers';

export class ScreenSource {
  private key: string;
  private topLevelEvent$: Stream<any>;

  constructor(topLevelEvent$: Stream<any>,
              key: string = SHAMEFUL_SELECTOR) {
    this.topLevelEvent$ = topLevelEvent$;
    this.key = key;
  }

  public select(key: string): ScreenSource {
    return new ScreenSource(this.topLevelEvent$, key);
  }

  public events(eventType: string): Stream<any> {
    if (this.key === SHAMEFUL_SELECTOR || !this.topLevelEvent$) {
      return adapt(getHandlerSubject(this.key, eventType));
    } else {
      return adapt(
        this.topLevelEvent$.filter(ev =>
          ev.type === eventType &&
          ev.inst &&
          ev.inst._currentElement &&
          ev.inst._currentElement._owner &&
          ev.inst._currentElement._owner._currentElement &&
          ev.inst._currentElement._owner._currentElement.key === this.key,
        ),
      );
    }
  }
}