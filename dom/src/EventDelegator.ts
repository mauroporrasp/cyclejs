import xs, {Stream} from 'xstream';
import {ScopeChecker} from './ScopeChecker';
import {IsolateModule} from './IsolateModule';
import {getSelectors} from './utils';
import {Scope} from './isolate';
import {fromEvent} from './fromEvent';
import {PreventDefaultOpt, preventDefaultConditional} from './fromEvent';
declare var requestIdleCallback: any;

interface Destination {
  eventType: string;
  useCapture: boolean;
  options: PreventDefaultOpt;
  scopeChecker: ScopeChecker;
  subject: Stream<Event>;
}

export interface CycleDOMEvent extends Event {
  propagationHasBeenStopped: boolean;
  ownerTarget: Element;
}

interface ListenerTree {
  [scope: string]: Destination | ListenerTree;
}

const listenerSymbol = Symbol('listener');

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
          if (this.origin !== el) {
            this.origin = el;
            this.resetEventListeners();
          }
        },
      });
  }

  public addEventListener(
    eventType: string,
    namespace: Array<Scope>,
    useCapture: boolean,
    options: PreventDefaultOpt,
  ): Stream<Event> {
    const subject = xs.never();
    const scopeChecker = new ScopeChecker(namespace, this.isolateModule);

    this.insertListener(subject, scopeChecker, eventType, useCapture, options);
    let rootEvent$ = this.eventStreamByType.get(eventType); //TODO: Non-bubbleing events
    if (rootEvent$ === undefined && this.origin !== undefined) {
      rootEvent$ = fromEvent(this.origin, eventType, useCapture, options);
      this.eventStreamByType.set(eventType, rootEvent$);
    }
    if (rootEvent$ !== undefined) {
      rootEvent$
        .filter(ev =>
          scopeChecker.isDirectlyInScope(ev.currentTarget as Element),
        )
        .addListener({
          next: ev => {
            subject.shamefullySendNext(ev);
          },
        });
    }

    return subject;
  }

  private insertListener(
    subject: Stream<Event>,
    scopeChecker: ScopeChecker,
    eventType: string,
    useCapture: boolean,
    options: PreventDefaultOpt,
  ): void {
    let curr = this.listeners;
    for (let i = 0; i < scopeChecker.namespace.length; i++) {
      const n = scopeChecker.namespace[i];
      if (n.type === 'selector') {
        continue;
      }
      curr = (curr[n.scope] || {}) as ListenerTree;
    }
    curr[listenerSymbol] = {
      eventType,
      useCapture,
      options,
      scopeChecker,
      subject,
    };
  }

  private resetEventListeners(): void {}

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
