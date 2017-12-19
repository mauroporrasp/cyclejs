import {IsolateModule} from './IsolateModule';
import {Scope} from './isolate';
import {isEqualNamespace} from './utils';

export class ScopeChecker {
  private namespace: Array<Scope>;
  constructor(_namespace: Array<Scope>, private isolateModule: IsolateModule) {
    this.namespace = _namespace.filter(n => n.type !== 'selector');
  }

  /**
   * Checks whether the given element is *directly* in the scope of this
   * scope checker. Being contained *indirectly* through other scopes
   * is not valid. This is crucial for implementing parent-child isolation,
   * so that the parent selectors don't search inside a child scope.
   */
  public isDirectlyInScope(leaf: Element): boolean {
    const namespace = this.isolateModule.getNamespace(leaf);

    if (
      this.namespace.length > namespace.length ||
      !isEqualNamespace(
        this.namespace,
        namespace.slice(0, this.namespace.length),
      )
    ) {
      return false;
    }
    for (let i = this.namespace.length; i < namespace.length; i++) {
      if (namespace[i].type === 'total') {
        return false;
      }
    }
    return true;
  }
}
