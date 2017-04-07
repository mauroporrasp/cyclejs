import * as React from 'react';
import {getHandlers} from './handlers';

export type PropsExtensions = {
  selector?: string;
};

function incorporateHandlers<P>(props: P & PropsExtensions): P {
  if (props.selector) {
    const handlers = getHandlers(props.selector);
    const handlerEventTypes = Object.keys(handlers);
    const N = handlerEventTypes.length;
    for (let i = 0; i < N; ++i) {
      const evType = handlerEventTypes[i];
      const onFoo = `on${evType[0].toUpperCase()}${evType.slice(1)}`;
      props[onFoo] = (ev: any) => handlers[evType]._n(ev);
    }
  }
  delete props.selector;
  return props;
}

export function h<P>(type: React.ComponentClass<P>,
                     props?: (P & PropsExtensions) | string | Array<React.ReactElement<any>>,
                     children?: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  if (props === undefined && children === undefined) {
    return hCP(type, {} as (P & PropsExtensions), []);
  }
  if (children === undefined && (typeof props === 'string' || Array.isArray(props))) {
    return hC(type, props);
  }
  if (children === undefined && typeof props === 'object' && !Array.isArray(props)) {
    return hP(type, props);
  }
  if (props !== undefined && typeof props !== 'string'
  && !Array.isArray(props) && children !== undefined) {
    return hCP(type, props, children);
  } else {
    throw new Error('Unexpected usage of h() function');
  }
}

function hP<P>(type: React.ComponentClass<P>,
               props: P & PropsExtensions): React.ReactElement<P> {
  return internalH(type, incorporateHandlers(props), []);
}

function hC<P>(type: React.ComponentClass<P>,
               children: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  return internalH(type, null as any as P, children);
}

function hCP<P>(type: React.ComponentClass<P>,
                props: P & PropsExtensions,
                children: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  return internalH(type, incorporateHandlers(props), children);
}

function internalH<P>(type: React.ComponentClass<P>,
                      props: P,
                      children: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  if (typeof children === 'string') {
    return React.createElement(type, props, children);
  } else {
    return React.createElement(type, props, ...children);
  }
}