import * as React from 'react';
import {getShamefulHandlerSubject} from './handlers';

export type PropsExtensions = {
  shamefullySendToSource?: {
    [onFoo: string]: string;
  };
};

function incorporateShamefulHandlers<P>(props: P & PropsExtensions): P {
  if (props.shamefullySendToSource) {
    const mappingKeys = Object.keys(props.shamefullySendToSource);
    const N = mappingKeys.length;
    for (let i = 0; i < N; ++i) {
      const onFoo = mappingKeys[i];
      const sourceName = props.shamefullySendToSource[onFoo];
      const subject = getShamefulHandlerSubject(sourceName);
      props[onFoo] = (ev: any) => subject._n(ev);
    }
  }
  delete props.shamefullySendToSource;
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
  return internalH(type, incorporateShamefulHandlers(props), []);
}

function hC<P>(type: React.ComponentClass<P>,
               children: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  return internalH(type, null as any as P, children);
}

function hCP<P>(type: React.ComponentClass<P>,
                props: P & PropsExtensions,
                children: string | Array<React.ReactElement<any>>): React.ReactElement<P> {
  return internalH(type, incorporateShamefulHandlers(props), children);
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