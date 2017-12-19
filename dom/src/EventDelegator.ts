import xs, {Stream} from 'xstream';
import {ScopeChecker} from './ScopeChecker';
import {IsolateModule} from './IsolateModule';
import {getSelectors} from './utils';
import {Scope} from './isolate';
import {fromEvent} from './fromEvent';
import {PreventDefaultOpt, preventDefaultConditional} from './fromEvent';
declare var requestIdleCallback: any;

interface Destination {
  id: number;
  selector: string;
  scopeChecker: ScopeChecker;
  subject: Stream<Event>;
}

export interface CycleDOMEvent extends Event {
  propagationHasBeenStopped: boolean;
  ownerTarget: Element;
}

export interface ListenerTree {
  [scope: string]: Stream<Event> | ListenerTree;
}

/**
 * Manages "Event delegation", by connecting an origin with multiple
 * destinations.
 *
 * Attaches a DOM event listener to the DOM element called the "origin",
 * and delegates events to "destinations", which are subjects as outputs
 * for the DOMSource. Simulates bubbling or capturing, with regards to
 * isolation boundaries too.
 */
export class EventDelegator {
  private listeners: ListenerTree;
  private origin: Element;
  private eventStreamByType: Map<string, Stream<Event>>;

  constructor(
    private rootElement$: Stream<Element>,
    public isolateModule: IsolateModule,
  ) {
    this.eventStreamByType = new Map<string, Stream<Event>>();
    this.listeners = {};
    rootElement$
      .drop(1)
      .take(1)
      .addListener({
        next: el => {
          this.origin = el;
        },
      });
  }

  public addEventListener(
    eventType: string,
    namespace: Array<Scope>,
    useCapture: boolean,
    options: PreventDefaultOpt,
  ): Stream<Event> {
    if (!this.origin) return xs.empty();
    let rootEvent$ = this.eventStreamByType.get(eventType); //TODO: Non-bubbleing events
    if (rootEvent$ === undefined) {
      rootEvent$ = fromEvent(this.origin, eventType, useCapture, options);
      this.eventStreamByType.set(eventType, rootEvent$);
    }
    const checker = new ScopeChecker(namespace, this.isolateModule);

    return rootEvent$.filter(ev =>
      checker.isDirectlyInScope(ev.currentTarget as Element),
    );
  }

  /*private bubble(rawEvent: Event): void {
    const origin = this.origin;
    if (!origin.contains(rawEvent.currentTarget as Node)) {
      return;
    }
    const roof = origin.parentElement;
    const ev = this.patchEvent(rawEvent);
    for (
      let el = ev.target as Element | null;
      el && el !== roof;
      el = el.parentElement
    ) {
      if (!origin.contains(el)) {
        ev.stopPropagation();
      }
      if (ev.propagationHasBeenStopped) {
        return;
      }
      this.matchEventAgainstDestinations(el, ev);
    }
  }

  private patchEvent(event: Event): CycleDOMEvent {
    const pEvent = event as CycleDOMEvent;
    pEvent.propagationHasBeenStopped = false;
    const oldStopPropagation = pEvent.stopPropagation;
    pEvent.stopPropagation = function stopPropagation() {
      oldStopPropagation.call(this);
      this.propagationHasBeenStopped = true;
    };
    return pEvent;
  }

  private mutateEventCurrentTarget(
    event: CycleDOMEvent,
    currentTargetElement: Element,
  ) {
    try {
      Object.defineProperty(event, `currentTarget`, {
        value: currentTargetElement,
        configurable: true,
      });
    } catch (err) {
      console.log(`please use event.ownerTarget`);
    }
    event.ownerTarget = currentTargetElement;
  }*/
}
