/**
 * A factory for the React Native 'Screen' driver function. Takes an `appKey`
 * string as the only input. The returned driver is a function that takes a
 * stream of ReactElement as input, and outputs a ScreenSource, a queryable
 * collection of user event streams. This is similar to Cycle DOM Driver.
 * `ScreenSource.select(selector).events(eventType)` returns the stream of
 * `eventType` user events happening on the component which has the specified
 * `selector` property.
 *
 * @param {String} appKey key to refer to the target mobile app.
 * @return {Function} the Screen driver function.
 * @function makeScreenDriver
 */
export {makeScreenDriver} from './driver';
export {ScreenSource} from './ScreenSource';
export {h} from './h';
export {Image, Text, View} from './Animated';
export {ListView} from './ListView';
