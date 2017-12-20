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

export function isolateSink(sink: Sink, scope: string): Sink {
  if (scope === ':root') {
    return sink;
  }
  return sink.map(node => {
    if (!node) {
      return node;
    }
    let newNode = {
      ...node,
      data: {
        ...node.data,
        isolate:
          node.data && Array.isArray(node.data.isolate)
            ? node.data.isolate.map((x: any) => x)
            : [],
      },
    };

    const scopeObj = getScopeObj(scope);
    newNode.data.isolate.unshift(scopeObj);

    return newNode;
  });
}

export function getScopeObj(scope: string): Scope {
  return {
    type: isClassOrId(scope) ? 'sibling' : 'total',
    scope,
  };
}
