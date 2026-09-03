// Exported object from Tuanjie library

// Provide Tuanjie lifecycle events
export { TuanjiePlayer } from 'classesLib'
// Tuanjie Player View，you can use it as a component
export { TuanjiePlayerView } from 'classesLib'
// Send message to host(aka ui or main) thread
export { POST_MESSAGE_TO_HOST } from 'classesLib'
// Send message to worker(tuanjie main) thread
export { POST_MESSAGE_TO_WORKER } from 'classesLib'
// Key of safeAreaRect and navigationMargin in AppStorage
export { APP_KEY_SAFEAREA_RECT, APP_KEY_NAVIGATION_MARGIN } from 'classesLib'
// Get or set global object
export { GetFromGlobalThis, SetToGlobalThis } from 'classesLib'
// Contains tuanjie native function, you can use it to interact with the engine
export { Tuanjie } from 'classesLib'
// Output log message with tuanjie tag.
export { TuanjieLog } from 'classesLib'
// System call module, register GalleryManager class                                               
export { RegisterGalleryManager } from 'classesLib'
// System call module, register WebviewControl class
export { RegisterWebviewControl } from 'classesLib'
// Tuanjie runtime configuration
export { TuanjieRuntimeConfig } from 'classesLib'
// System call module, register javaScript in WebviewUtils
export { REGISTER_WEBVIEW_JAVASCRIPT } from 'classesLib'
// System call module, register JavaScript for C# calls
export { RegisterJSScriptToCSharp } from './src/main/ets/gen/TuanjieJSScriptRegister'

export { 
  // Enum type distinguishes between worker and host thread
  MSG_RECEIVER,
  // User custom module, allows dynamically loading modules in the HOST or WORKER thread
  LOAD_MODULE,
  // User custom module, allows dynamically unloading modules in the HOST or WORKER thread
  UNLOAD_MODULE,
  // User custom module, allows registering modules in the HOST or WORKER thread
  REGISTER_MODULE,
  // User custom module, allows unregistering modules in the HOST or WORKER thread
  UNREGISTER_MODULE,
  // After registering handler in the HOST or WORKER thread (only registers once), then you can trigger this handler with `POST_MESSAGE_TO_HOST` or `POST_MESSAGE_TO_WORKER`
  REGISTER_HANDLER,
  // Unregisters a handler in the HOST or WORKER thread
  UNREGISTER_HANDLER,
} from 'classesLib'

// declare all exported classes in plugin (ets/ts files).
export { HMSMessageBind } from './src/main/ets/HMSMessageBind.ets';
export { RXWebViewControl } from './src/main/ets/RXWebViewControl.ts';
export { callType, JavaScriptItem } from './src/main/ets/RXWebViewJsBridge.ets';
export { RXWebViewMainThreadWorker } from './src/main/ets/RXWebViewMainThreadWorker.ets';
export { WebviewControl } from './src/main/ets/webview/WebviewControl.ets';

