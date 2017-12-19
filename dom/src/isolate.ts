import {Stream} from 'xstream';
import {VNode} from 'snabbdom/vnode';
import {isClassOrId} from './utils';
import {MainDOMSource} from './MainDOMSource';

export interface Scope {
  type: 'sibling' | 'total' | 'selector';
  scope: string; //Could be anything serializable
}

export type Sink = Stream<VNode | null | undefined>;
export type IsolateSink = (s: Sink, scope: string) => Sink;

export function makeIsolateSink(namespace: Array<Scope>): IsolateSink {
  return (sink, scope) => {
    if (scope === ':root') {
      return sink;
    }
    return sink.map(node => {
      if (!node) {
        return node;
      }
      const scopeObj = getScopeObj(scope);
      if (
        node.data &&
        (node.data as any).isolate &&
        Array.isArray((node.data as any).isolate)
      ) {
        node.data.isolate.unshift(scopeObj);
      } else {
        node.data = node.data || {};
        (node.data as any).isolate = [scopeObj];
      }
      return node;
    });
  };
}

export function getScopeObj(scope: string): Scope {
  return {
    type: isClassOrId(scope) ? 'sibling' : 'total',
    scope,
  };
}
