import xs, {Stream, Listener} from 'xstream';
import {Keyboard, Platform} from 'react-native';

export type KeyboardEventType =
  'keyboardWillShow' |
  'keyboardDidShow' |
  'keyboardWillHide' |
  'keyboardDidHide' |
  'keyboardWillChangeFrame' |
  'keyboardDidChangeFrame';

export class KeyboardSource {
  constructor() {
  }

  public events(type: KeyboardEventType): Stream<any> {
    return xs.create({
      start(listener: Listener<any>) {
        this.keyboardCallback = (ev: any) => {
          listener.next(ev);
        };
        Keyboard.addListener(type, this.keyboardCallback);
      },
      stop() {
        Keyboard.removeListener(type, this.keyboardCallback);
      },
    } as any);
  }
}

export function makeKeyboardDriver() {
  return function keyboardDriver(sink: Stream<'dismiss'>): KeyboardSource {
    sink.addListener({
      next: t => {
        Keyboard.dismiss();
      },
    });

    return new KeyboardSource();
  };
}
