import {Scope} from './isolate';

function isValidNode(obj: any): obj is Element {
  const ELEM_TYPE = 1;
  const FRAG_TYPE = 11;
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement || obj instanceof DocumentFragment
    : obj &&
        typeof obj === 'object' &&
        obj !== null &&
        (obj.nodeType === ELEM_TYPE || obj.nodeType === FRAG_TYPE) &&
        typeof obj.nodeName === 'string';
}

export function isClassOrId(str: string): boolean {
  return str.length > 1 && (str[0] === '.' || str[0] === '#');
}

export function isDocFrag(
  el: Element | DocumentFragment,
): el is DocumentFragment {
  return el.nodeType === 11;
}

export function checkValidContainer(
  container: Element | DocumentFragment | string,
): void {
  if (typeof container !== 'string' && !isValidNode(container)) {
    throw new Error(
      'Given container is not a DOM element neither a selector string.',
    );
  }
}

export function getValidNode(
  selectors: Element | DocumentFragment | string,
): Element | DocumentFragment | null {
  const domElement =
    typeof selectors === 'string'
      ? document.querySelector(selectors)
      : selectors;

  if (typeof selectors === 'string' && domElement === null) {
    throw new Error(`Cannot render into unknown element \`${selectors}\``);
  }
  return domElement;
}

export function getSelectors(namespace: Array<Scope>): string {
  return namespace
    .filter(n => n.type === 'selector')
    .map(n => n.scope)
    .join(' ');
}

export function isEqualNamespace(
  a: Array<Scope> | undefined,
  b: Array<Scope> | undefined,
): boolean {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].type !== b[i].type || a[i].scope !== b[i].scope) {
      return false;
    }
  }
  return true;
}
