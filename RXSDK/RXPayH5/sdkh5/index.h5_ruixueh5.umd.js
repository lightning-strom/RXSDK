(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /*!
   * Vue.js v2.7.16
   * (c) 2014-2023 Evan You
   * Released under the MIT License.
   */
  const emptyObject = Object.freeze({});
  const isArray$2 = Array.isArray;
  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef(v) {
      return v === undefined || v === null;
  }
  function isDef(v) {
      return v !== undefined && v !== null;
  }
  function isTrue(v) {
      return v === true;
  }
  function isFalse(v) {
      return v === false;
  }
  /**
   * Check if value is primitive.
   */
  function isPrimitive(value) {
      return (typeof value === 'string' ||
          typeof value === 'number' ||
          // $flow-disable-line
          typeof value === 'symbol' ||
          typeof value === 'boolean');
  }
  function isFunction$2(value) {
      return typeof value === 'function';
  }
  /**
   * Quick object check - this is primarily used to tell
   * objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject$2(obj) {
      return obj !== null && typeof obj === 'object';
  }
  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  const _toString = Object.prototype.toString;
  function toRawType(value) {
      return _toString.call(value).slice(8, -1);
  }
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject$1(obj) {
      return _toString.call(obj) === '[object Object]';
  }
  function isRegExp(v) {
      return _toString.call(v) === '[object RegExp]';
  }
  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex(val) {
      const n = parseFloat(String(val));
      return n >= 0 && Math.floor(n) === n && isFinite(val);
  }
  function isPromise(val) {
      return (isDef(val) &&
          typeof val.then === 'function' &&
          typeof val.catch === 'function');
  }
  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString$2(val) {
      return val == null
          ? ''
          : Array.isArray(val) || (isPlainObject$1(val) && val.toString === _toString)
              ? JSON.stringify(val, replacer, 2)
              : String(val);
  }
  function replacer(_key, val) {
      // avoid circular deps from v3
      if (val && val.__v_isRef) {
          return val.value;
      }
      return val;
  }
  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber(val) {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
  }
  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap(str, expectsLowerCase) {
      const map = Object.create(null);
      const list = str.split(',');
      for (let i = 0; i < list.length; i++) {
          map[list[i]] = true;
      }
      return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
  }
  /**
   * Check if a tag is a built-in tag.
   */
  const isBuiltInTag = makeMap('slot,component', true);
  /**
   * Check if an attribute is a reserved attribute.
   */
  const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
  /**
   * Remove an item from an array.
   */
  function remove$2(arr, item) {
      const len = arr.length;
      if (len) {
          // fast path for the only / last item
          if (item === arr[len - 1]) {
              arr.length = len - 1;
              return;
          }
          const index = arr.indexOf(item);
          if (index > -1) {
              return arr.splice(index, 1);
          }
      }
  }
  /**
   * Check whether an object has the property.
   */
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
  }
  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
      const cache = Object.create(null);
      return function cachedFn(str) {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
      };
  }
  /**
   * Camelize a hyphen-delimited string.
   */
  const camelizeRE = /-(\w)/g;
  const camelize = cached((str) => {
      return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
  });
  /**
   * Capitalize a string.
   */
  const capitalize = cached((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  });
  /**
   * Hyphenate a camelCase string.
   */
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cached((str) => {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
  });
  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */
  /* istanbul ignore next */
  function polyfillBind(fn, ctx) {
      function boundFn(a) {
          const l = arguments.length;
          return l
              ? l > 1
                  ? fn.apply(ctx, arguments)
                  : fn.call(ctx, a)
              : fn.call(ctx);
      }
      boundFn._length = fn.length;
      return boundFn;
  }
  function nativeBind(fn, ctx) {
      return fn.bind(ctx);
  }
  // @ts-expect-error bind cannot be `undefined`
  const bind$1 = Function.prototype.bind ? nativeBind : polyfillBind;
  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
      start = start || 0;
      let i = list.length - start;
      const ret = new Array(i);
      while (i--) {
          ret[i] = list[i + start];
      }
      return ret;
  }
  /**
   * Mix properties into target object.
   */
  function extend$1(to, _from) {
      for (const key in _from) {
          to[key] = _from[key];
      }
      return to;
  }
  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
      const res = {};
      for (let i = 0; i < arr.length; i++) {
          if (arr[i]) {
              extend$1(res, arr[i]);
          }
      }
      return res;
  }
  /* eslint-disable no-unused-vars */
  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop(a, b, c) { }
  /**
   * Always return false.
   */
  const no = (a, b, c) => false;
  /* eslint-enable no-unused-vars */
  /**
   * Return the same value.
   */
  const identity = (_) => _;
  /**
   * Generate a string containing static keys from compiler modules.
   */
  function genStaticKeys$1(modules) {
      return modules
          .reduce((keys, m) => keys.concat(m.staticKeys || []), [])
          .join(',');
  }
  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
      if (a === b)
          return true;
      const isObjectA = isObject$2(a);
      const isObjectB = isObject$2(b);
      if (isObjectA && isObjectB) {
          try {
              const isArrayA = Array.isArray(a);
              const isArrayB = Array.isArray(b);
              if (isArrayA && isArrayB) {
                  return (a.length === b.length &&
                      a.every((e, i) => {
                          return looseEqual(e, b[i]);
                      }));
              }
              else if (a instanceof Date && b instanceof Date) {
                  return a.getTime() === b.getTime();
              }
              else if (!isArrayA && !isArrayB) {
                  const keysA = Object.keys(a);
                  const keysB = Object.keys(b);
                  return (keysA.length === keysB.length &&
                      keysA.every(key => {
                          return looseEqual(a[key], b[key]);
                      }));
              }
              else {
                  /* istanbul ignore next */
                  return false;
              }
          }
          catch (e) {
              /* istanbul ignore next */
              return false;
          }
      }
      else if (!isObjectA && !isObjectB) {
          return String(a) === String(b);
      }
      else {
          return false;
      }
  }
  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf(arr, val) {
      for (let i = 0; i < arr.length; i++) {
          if (looseEqual(arr[i], val))
              return i;
      }
      return -1;
  }
  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
      let called = false;
      return function () {
          if (!called) {
              called = true;
              fn.apply(this, arguments);
          }
      };
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill
  function hasChanged(x, y) {
      if (x === y) {
          return x === 0 && 1 / x !== 1 / y;
      }
      else {
          return x === x || y === y;
      }
  }

  const SSR_ATTR = 'data-server-rendered';
  const ASSET_TYPES = ['component', 'directive', 'filter'];
  const LIFECYCLE_HOOKS = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated',
      'errorCaptured',
      'serverPrefetch',
      'renderTracked',
      'renderTriggered'
  ];

  var config = {
      /**
       * Option merge strategies (used in core/util/options)
       */
      // $flow-disable-line
      optionMergeStrategies: Object.create(null),
      /**
       * Whether to suppress warnings.
       */
      silent: false,
      /**
       * Show production mode tip message on boot?
       */
      productionTip: true,
      /**
       * Whether to enable devtools
       */
      devtools: true,
      /**
       * Whether to record perf
       */
      performance: false,
      /**
       * Error handler for watcher errors
       */
      errorHandler: null,
      /**
       * Warn handler for watcher warns
       */
      warnHandler: null,
      /**
       * Ignore certain custom elements
       */
      ignoredElements: [],
      /**
       * Custom user key aliases for v-on
       */
      // $flow-disable-line
      keyCodes: Object.create(null),
      /**
       * Check if a tag is reserved so that it cannot be registered as a
       * component. This is platform-dependent and may be overwritten.
       */
      isReservedTag: no,
      /**
       * Check if an attribute is reserved so that it cannot be used as a component
       * prop. This is platform-dependent and may be overwritten.
       */
      isReservedAttr: no,
      /**
       * Check if a tag is an unknown element.
       * Platform-dependent.
       */
      isUnknownElement: no,
      /**
       * Get the namespace of an element
       */
      getTagNamespace: noop,
      /**
       * Parse the real tag name for the specific platform.
       */
      parsePlatformTagName: identity,
      /**
       * Check if an attribute must be bound using property, e.g. value
       * Platform-dependent.
       */
      mustUseProp: no,
      /**
       * Perform updates asynchronously. Intended to be used by Vue Test Utils
       * This will significantly reduce performance if set to false.
       */
      async: true,
      /**
       * Exposed for legacy reasons
       */
      _lifecycleHooks: LIFECYCLE_HOOKS
  };

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
      const c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5f;
  }
  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true
      });
  }
  /**
   * Parse simple path.
   */
  const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
  function parsePath(path) {
      if (bailRE.test(path)) {
          return;
      }
      const segments = path.split('.');
      return function (obj) {
          for (let i = 0; i < segments.length; i++) {
              if (!obj)
                  return;
              obj = obj[segments[i]];
          }
          return obj;
      };
  }

  // can we use __proto__?
  const hasProto = '__proto__' in {};
  // Browser environment sniffing
  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIE = UA && /msie|trident/.test(UA);
  const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  const isEdge = UA && UA.indexOf('edge/') > 0;
  UA && UA.indexOf('android') > 0;
  const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  UA && /chrome\/\d+/.test(UA) && !isEdge;
  UA && /phantomjs/.test(UA);
  const isFF = UA && UA.match(/firefox\/(\d+)/);
  // Firefox has a "watch" function on Object.prototype...
  // @ts-expect-error firebox support
  const nativeWatch = {}.watch;
  let supportsPassive = false;
  if (inBrowser) {
      try {
          const opts = {};
          Object.defineProperty(opts, 'passive', {
              get() {
                  /* istanbul ignore next */
                  supportsPassive = true;
              }
          }); // https://github.com/facebook/flow/issues/285
          window.addEventListener('test-passive', null, opts);
      }
      catch (e) { }
  }
  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  let _isServer;
  const isServerRendering = () => {
      if (_isServer === undefined) {
          /* istanbul ignore if */
          if (!inBrowser && typeof global !== 'undefined') {
              // detect presence of vue-server-renderer and avoid
              // Webpack shimming the process
              _isServer =
                  global['process'] && global['process'].env.VUE_ENV === 'server';
          }
          else {
              _isServer = false;
          }
      }
      return _isServer;
  };
  // detect devtools
  const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  /* istanbul ignore next */
  function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }
  const hasSymbol = typeof Symbol !== 'undefined' &&
      isNative(Symbol) &&
      typeof Reflect !== 'undefined' &&
      isNative(Reflect.ownKeys);
  let _Set; // $flow-disable-line
  /* istanbul ignore if */ if (typeof Set !== 'undefined' && isNative(Set)) {
      // use native Set when available.
      _Set = Set;
  }
  else {
      // a non-standard Set polyfill that only works with primitive keys.
      _Set = class Set {
          constructor() {
              this.set = Object.create(null);
          }
          has(key) {
              return this.set[key] === true;
          }
          add(key) {
              this.set[key] = true;
          }
          clear() {
              this.set = Object.create(null);
          }
      };
  }

  let currentInstance = null;
  /**
   * @internal
   */
  function setCurrentInstance(vm = null) {
      if (!vm)
          currentInstance && currentInstance._scope.off();
      currentInstance = vm;
      vm && vm._scope.on();
  }

  /**
   * @internal
   */
  class VNode {
      constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
          this.tag = tag;
          this.data = data;
          this.children = children;
          this.text = text;
          this.elm = elm;
          this.ns = undefined;
          this.context = context;
          this.fnContext = undefined;
          this.fnOptions = undefined;
          this.fnScopeId = undefined;
          this.key = data && data.key;
          this.componentOptions = componentOptions;
          this.componentInstance = undefined;
          this.parent = undefined;
          this.raw = false;
          this.isStatic = false;
          this.isRootInsert = true;
          this.isComment = false;
          this.isCloned = false;
          this.isOnce = false;
          this.asyncFactory = asyncFactory;
          this.asyncMeta = undefined;
          this.isAsyncPlaceholder = false;
      }
      // DEPRECATED: alias for componentInstance for backwards compat.
      /* istanbul ignore next */
      get child() {
          return this.componentInstance;
      }
  }
  const createEmptyVNode = (text = '') => {
      const node = new VNode();
      node.text = text;
      node.isComment = true;
      return node;
  };
  function createTextVNode(val) {
      return new VNode(undefined, undefined, undefined, String(val));
  }
  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
      const cloned = new VNode(vnode.tag, vnode.data, 
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
      cloned.ns = vnode.ns;
      cloned.isStatic = vnode.isStatic;
      cloned.key = vnode.key;
      cloned.isComment = vnode.isComment;
      cloned.fnContext = vnode.fnContext;
      cloned.fnOptions = vnode.fnOptions;
      cloned.fnScopeId = vnode.fnScopeId;
      cloned.asyncMeta = vnode.asyncMeta;
      cloned.isCloned = true;
      return cloned;
  }

  /* not type checking this file because flow doesn't play well with Proxy */
  let initProxy;
  {
      const allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
          'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
          'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
          'require' // for Webpack/Browserify
      );
      const warnNonPresent = (target, key) => {
          warn$2(`Property or method "${key}" is not defined on the instance but ` +
              'referenced during render. Make sure that this property is reactive, ' +
              'either in the data option, or for class-based components, by ' +
              'initializing the property. ' +
              'See: https://v2.vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
      };
      const warnReservedPrefix = (target, key) => {
          warn$2(`Property "${key}" must be accessed with "$data.${key}" because ` +
              'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
              'prevent conflicts with Vue internals. ' +
              'See: https://v2.vuejs.org/v2/api/#data', target);
      };
      const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
      if (hasProxy) {
          const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
          config.keyCodes = new Proxy(config.keyCodes, {
              set(target, key, value) {
                  if (isBuiltInModifier(key)) {
                      warn$2(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`);
                      return false;
                  }
                  else {
                      target[key] = value;
                      return true;
                  }
              }
          });
      }
      const hasHandler = {
          has(target, key) {
              const has = key in target;
              const isAllowed = allowedGlobals(key) ||
                  (typeof key === 'string' &&
                      key.charAt(0) === '_' &&
                      !(key in target.$data));
              if (!has && !isAllowed) {
                  if (key in target.$data)
                      warnReservedPrefix(target, key);
                  else
                      warnNonPresent(target, key);
              }
              return has || !isAllowed;
          }
      };
      const getHandler = {
          get(target, key) {
              if (typeof key === 'string' && !(key in target)) {
                  if (key in target.$data)
                      warnReservedPrefix(target, key);
                  else
                      warnNonPresent(target, key);
              }
              return target[key];
          }
      };
      initProxy = function initProxy(vm) {
          if (hasProxy) {
              // determine which proxy handler to use
              const options = vm.$options;
              const handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
              vm._renderProxy = new Proxy(vm, handlers);
          }
          else {
              vm._renderProxy = vm;
          }
      };
  }

  let uid$2 = 0;
  const pendingCleanupDeps = [];
  const cleanupDeps = () => {
      for (let i = 0; i < pendingCleanupDeps.length; i++) {
          const dep = pendingCleanupDeps[i];
          dep.subs = dep.subs.filter(s => s);
          dep._pending = false;
      }
      pendingCleanupDeps.length = 0;
  };
  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   * @internal
   */
  class Dep {
      constructor() {
          // pending subs cleanup
          this._pending = false;
          this.id = uid$2++;
          this.subs = [];
      }
      addSub(sub) {
          this.subs.push(sub);
      }
      removeSub(sub) {
          // #12696 deps with massive amount of subscribers are extremely slow to
          // clean up in Chromium
          // to workaround this, we unset the sub for now, and clear them on
          // next scheduler flush.
          this.subs[this.subs.indexOf(sub)] = null;
          if (!this._pending) {
              this._pending = true;
              pendingCleanupDeps.push(this);
          }
      }
      depend(info) {
          if (Dep.target) {
              Dep.target.addDep(this);
              if (info && Dep.target.onTrack) {
                  Dep.target.onTrack(Object.assign({ effect: Dep.target }, info));
              }
          }
      }
      notify(info) {
          // stabilize the subscriber list first
          const subs = this.subs.filter(s => s);
          if (!config.async) {
              // subs aren't sorted in scheduler if not running async
              // we need to sort them now to make sure they fire in correct
              // order
              subs.sort((a, b) => a.id - b.id);
          }
          for (let i = 0, l = subs.length; i < l; i++) {
              const sub = subs[i];
              if (info) {
                  sub.onTrigger &&
                      sub.onTrigger(Object.assign({ effect: subs[i] }, info));
              }
              sub.update();
          }
      }
  }
  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  const targetStack = [];
  function pushTarget(target) {
      targetStack.push(target);
      Dep.target = target;
  }
  function popTarget() {
      targetStack.pop();
      Dep.target = targetStack[targetStack.length - 1];
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */
  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);
  const methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
  ];
  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
      // cache original method
      const original = arrayProto[method];
      def(arrayMethods, method, function mutator(...args) {
          const result = original.apply(this, args);
          const ob = this.__ob__;
          let inserted;
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args;
                  break;
              case 'splice':
                  inserted = args.slice(2);
                  break;
          }
          if (inserted)
              ob.observeArray(inserted);
          // notify change
          {
              ob.dep.notify({
                  type: "array mutation" /* TriggerOpTypes.ARRAY_MUTATION */,
                  target: this,
                  key: method
              });
          }
          return result;
      });
  });

  const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
  const NO_INITIAL_VALUE = {};
  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  let shouldObserve = true;
  function toggleObserving(value) {
      shouldObserve = value;
  }
  // ssr mock dep
  const mockDep = {
      notify: noop,
      depend: noop,
      addSub: noop,
      removeSub: noop
  };
  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  class Observer {
      constructor(value, shallow = false, mock = false) {
          this.value = value;
          this.shallow = shallow;
          this.mock = mock;
          // this.value = value
          this.dep = mock ? mockDep : new Dep();
          this.vmCount = 0;
          def(value, '__ob__', this);
          if (isArray$2(value)) {
              if (!mock) {
                  if (hasProto) {
                      value.__proto__ = arrayMethods;
                      /* eslint-enable no-proto */
                  }
                  else {
                      for (let i = 0, l = arrayKeys.length; i < l; i++) {
                          const key = arrayKeys[i];
                          def(value, key, arrayMethods[key]);
                      }
                  }
              }
              if (!shallow) {
                  this.observeArray(value);
              }
          }
          else {
              /**
               * Walk through all properties and convert them into
               * getter/setters. This method should only be called when
               * value type is Object.
               */
              const keys = Object.keys(value);
              for (let i = 0; i < keys.length; i++) {
                  const key = keys[i];
                  defineReactive(value, key, NO_INITIAL_VALUE, undefined, shallow, mock);
              }
          }
      }
      /**
       * Observe a list of Array items.
       */
      observeArray(value) {
          for (let i = 0, l = value.length; i < l; i++) {
              observe(value[i], false, this.mock);
          }
      }
  }
  // helpers
  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe(value, shallow, ssrMockReactivity) {
      if (value && hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          return value.__ob__;
      }
      if (shouldObserve &&
          (ssrMockReactivity || !isServerRendering()) &&
          (isArray$2(value) || isPlainObject$1(value)) &&
          Object.isExtensible(value) &&
          !value.__v_skip /* ReactiveFlags.SKIP */ &&
          !isRef(value) &&
          !(value instanceof VNode)) {
          return new Observer(value, shallow, ssrMockReactivity);
      }
  }
  /**
   * Define a reactive property on an Object.
   */
  function defineReactive(obj, key, val, customSetter, shallow, mock, observeEvenIfShallow = false) {
      const dep = new Dep();
      const property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
          return;
      }
      // cater for pre-defined getter/setters
      const getter = property && property.get;
      const setter = property && property.set;
      if ((!getter || setter) &&
          (val === NO_INITIAL_VALUE || arguments.length === 2)) {
          val = obj[key];
      }
      let childOb = shallow ? val && val.__ob__ : observe(val, false, mock);
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              const value = getter ? getter.call(obj) : val;
              if (Dep.target) {
                  {
                      dep.depend({
                          target: obj,
                          type: "get" /* TrackOpTypes.GET */,
                          key
                      });
                  }
                  if (childOb) {
                      childOb.dep.depend();
                      if (isArray$2(value)) {
                          dependArray(value);
                      }
                  }
              }
              return isRef(value) && !shallow ? value.value : value;
          },
          set: function reactiveSetter(newVal) {
              const value = getter ? getter.call(obj) : val;
              if (!hasChanged(value, newVal)) {
                  return;
              }
              if (customSetter) {
                  customSetter();
              }
              if (setter) {
                  setter.call(obj, newVal);
              }
              else if (getter) {
                  // #7981: for accessor properties without setter
                  return;
              }
              else if (!shallow && isRef(value) && !isRef(newVal)) {
                  value.value = newVal;
                  return;
              }
              else {
                  val = newVal;
              }
              childOb = shallow ? newVal && newVal.__ob__ : observe(newVal, false, mock);
              {
                  dep.notify({
                      type: "set" /* TriggerOpTypes.SET */,
                      target: obj,
                      key,
                      newValue: newVal,
                      oldValue: value
                  });
              }
          }
      });
      return dep;
  }
  function set(target, key, val) {
      if ((isUndef(target) || isPrimitive(target))) {
          warn$2(`Cannot set reactive property on undefined, null, or primitive value: ${target}`);
      }
      if (isReadonly(target)) {
          warn$2(`Set operation on key "${key}" failed: target is readonly.`);
          return;
      }
      const ob = target.__ob__;
      if (isArray$2(target) && isValidArrayIndex(key)) {
          target.length = Math.max(target.length, key);
          target.splice(key, 1, val);
          // when mocking for SSR, array methods are not hijacked
          if (ob && !ob.shallow && ob.mock) {
              observe(val, false, true);
          }
          return val;
      }
      if (key in target && !(key in Object.prototype)) {
          target[key] = val;
          return val;
      }
      if (target._isVue || (ob && ob.vmCount)) {
          warn$2('Avoid adding reactive properties to a Vue instance or its root $data ' +
                  'at runtime - declare it upfront in the data option.');
          return val;
      }
      if (!ob) {
          target[key] = val;
          return val;
      }
      defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock);
      {
          ob.dep.notify({
              type: "add" /* TriggerOpTypes.ADD */,
              target: target,
              key,
              newValue: val,
              oldValue: undefined
          });
      }
      return val;
  }
  function del(target, key) {
      if ((isUndef(target) || isPrimitive(target))) {
          warn$2(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`);
      }
      if (isArray$2(target) && isValidArrayIndex(key)) {
          target.splice(key, 1);
          return;
      }
      const ob = target.__ob__;
      if (target._isVue || (ob && ob.vmCount)) {
          warn$2('Avoid deleting properties on a Vue instance or its root $data ' +
                  '- just set it to null.');
          return;
      }
      if (isReadonly(target)) {
          warn$2(`Delete operation on key "${key}" failed: target is readonly.`);
          return;
      }
      if (!hasOwn(target, key)) {
          return;
      }
      delete target[key];
      if (!ob) {
          return;
      }
      {
          ob.dep.notify({
              type: "delete" /* TriggerOpTypes.DELETE */,
              target: target,
              key
          });
      }
  }
  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray(value) {
      for (let e, i = 0, l = value.length; i < l; i++) {
          e = value[i];
          if (e && e.__ob__) {
              e.__ob__.dep.depend();
          }
          if (isArray$2(e)) {
              dependArray(e);
          }
      }
  }
  /**
   * Return a shallowly-reactive copy of the original object, where only the root
   * level properties are reactive. It also does not auto-unwrap refs (even at the
   * root level).
   */
  function shallowReactive(target) {
      makeReactive(target, true);
      def(target, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
      return target;
  }
  function makeReactive(target, shallow) {
      // if trying to observe a readonly proxy, return the readonly version.
      if (!isReadonly(target)) {
          {
              if (isArray$2(target)) {
                  warn$2(`Avoid using Array as root value for ${shallow ? `shallowReactive()` : `reactive()`} as it cannot be tracked in watch() or watchEffect(). Use ${shallow ? `shallowRef()` : `ref()`} instead. This is a Vue-2-only limitation.`);
              }
              const existingOb = target && target.__ob__;
              if (existingOb && existingOb.shallow !== shallow) {
                  warn$2(`Target is already a ${existingOb.shallow ? `` : `non-`}shallow reactive object, and cannot be converted to ${shallow ? `` : `non-`}shallow.`);
              }
          }
          const ob = observe(target, shallow, isServerRendering() /* ssr mock reactivity */);
          if (!ob) {
              if (target == null || isPrimitive(target)) {
                  warn$2(`value cannot be made reactive: ${String(target)}`);
              }
              if (isCollectionType(target)) {
                  warn$2(`Vue 2 does not support reactive collection types such as Map or Set.`);
              }
          }
      }
  }
  function isReadonly(value) {
      return !!(value && value.__v_isReadonly);
  }
  /**
   * @internal
   */
  function isCollectionType(value) {
      const type = toRawType(value);
      return (type === 'Map' || type === 'WeakMap' || type === 'Set' || type === 'WeakSet');
  }
  function isRef(r) {
      return !!(r && r.__v_isRef === true);
  }
  function proxyWithRefUnwrap(target, source, key) {
      Object.defineProperty(target, key, {
          enumerable: true,
          configurable: true,
          get: () => {
              const val = source[key];
              if (isRef(val)) {
                  return val.value;
              }
              else {
                  const ob = val && val.__ob__;
                  if (ob)
                      ob.dep.depend();
                  return val;
              }
          },
          set: value => {
              const oldValue = source[key];
              if (isRef(oldValue) && !isRef(value)) {
                  oldValue.value = value;
              }
              else {
                  source[key] = value;
              }
          }
      });
  }

  let mark;
  let measure;
  {
      const perf = inBrowser && window.performance;
      /* istanbul ignore if */
      if (perf &&
          // @ts-ignore
          perf.mark &&
          // @ts-ignore
          perf.measure &&
          // @ts-ignore
          perf.clearMarks &&
          // @ts-ignore
          perf.clearMeasures) {
          mark = tag => perf.mark(tag);
          measure = (name, startTag, endTag) => {
              perf.measure(name, startTag, endTag);
              perf.clearMarks(startTag);
              perf.clearMarks(endTag);
              // perf.clearMeasures(name)
          };
      }
  }

  const normalizeEvent = cached((name) => {
      const passive = name.charAt(0) === '&';
      name = passive ? name.slice(1) : name;
      const once = name.charAt(0) === '~'; // Prefixed last, checked first
      name = once ? name.slice(1) : name;
      const capture = name.charAt(0) === '!';
      name = capture ? name.slice(1) : name;
      return {
          name,
          once,
          capture,
          passive
      };
  });
  function createFnInvoker(fns, vm) {
      function invoker() {
          const fns = invoker.fns;
          if (isArray$2(fns)) {
              const cloned = fns.slice();
              for (let i = 0; i < cloned.length; i++) {
                  invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
              }
          }
          else {
              // return handler return value for single handlers
              return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`);
          }
      }
      invoker.fns = fns;
      return invoker;
  }
  function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
      let name, cur, old, event;
      for (name in on) {
          cur = on[name];
          old = oldOn[name];
          event = normalizeEvent(name);
          if (isUndef(cur)) {
              warn$2(`Invalid handler for event "${event.name}": got ` + String(cur), vm);
          }
          else if (isUndef(old)) {
              if (isUndef(cur.fns)) {
                  cur = on[name] = createFnInvoker(cur, vm);
              }
              if (isTrue(event.once)) {
                  cur = on[name] = createOnceHandler(event.name, cur, event.capture);
              }
              add(event.name, cur, event.capture, event.passive, event.params);
          }
          else if (cur !== old) {
              old.fns = cur;
              on[name] = old;
          }
      }
      for (name in oldOn) {
          if (isUndef(on[name])) {
              event = normalizeEvent(name);
              remove(event.name, oldOn[name], event.capture);
          }
      }
  }

  function mergeVNodeHook(def, hookKey, hook) {
      if (def instanceof VNode) {
          def = def.data.hook || (def.data.hook = {});
      }
      let invoker;
      const oldHook = def[hookKey];
      function wrappedHook() {
          hook.apply(this, arguments);
          // important: remove merged hook to ensure it's called only once
          // and prevent memory leak
          remove$2(invoker.fns, wrappedHook);
      }
      if (isUndef(oldHook)) {
          // no existing hook
          invoker = createFnInvoker([wrappedHook]);
      }
      else {
          /* istanbul ignore if */
          if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
              // already a merged invoker
              invoker = oldHook;
              invoker.fns.push(wrappedHook);
          }
          else {
              // existing plain hook
              invoker = createFnInvoker([oldHook, wrappedHook]);
          }
      }
      invoker.merged = true;
      def[hookKey] = invoker;
  }

  function extractPropsFromVNodeData(data, Ctor, tag) {
      // we are only extracting raw values here.
      // validation and default values are handled in the child
      // component itself.
      const propOptions = Ctor.options.props;
      if (isUndef(propOptions)) {
          return;
      }
      const res = {};
      const { attrs, props } = data;
      if (isDef(attrs) || isDef(props)) {
          for (const key in propOptions) {
              const altKey = hyphenate(key);
              {
                  const keyInLowerCase = key.toLowerCase();
                  if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
                      tip(`Prop "${keyInLowerCase}" is passed to component ` +
                          `${formatComponentName(
                        // @ts-expect-error tag is string
                        tag || Ctor)}, but the declared prop name is` +
                          ` "${key}". ` +
                          `Note that HTML attributes are case-insensitive and camelCased ` +
                          `props need to use their kebab-case equivalents when using in-DOM ` +
                          `templates. You should probably use "${altKey}" instead of "${key}".`);
                  }
              }
              checkProp(res, props, key, altKey, true) ||
                  checkProp(res, attrs, key, altKey, false);
          }
      }
      return res;
  }
  function checkProp(res, hash, key, altKey, preserve) {
      if (isDef(hash)) {
          if (hasOwn(hash, key)) {
              res[key] = hash[key];
              if (!preserve) {
                  delete hash[key];
              }
              return true;
          }
          else if (hasOwn(hash, altKey)) {
              res[key] = hash[altKey];
              if (!preserve) {
                  delete hash[altKey];
              }
              return true;
          }
      }
      return false;
  }

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:
  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
      for (let i = 0; i < children.length; i++) {
          if (isArray$2(children[i])) {
              return Array.prototype.concat.apply([], children);
          }
      }
      return children;
  }
  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
      return isPrimitive(children)
          ? [createTextVNode(children)]
          : isArray$2(children)
              ? normalizeArrayChildren(children)
              : undefined;
  }
  function isTextNode(node) {
      return isDef(node) && isDef(node.text) && isFalse(node.isComment);
  }
  function normalizeArrayChildren(children, nestedIndex) {
      const res = [];
      let i, c, lastIndex, last;
      for (i = 0; i < children.length; i++) {
          c = children[i];
          if (isUndef(c) || typeof c === 'boolean')
              continue;
          lastIndex = res.length - 1;
          last = res[lastIndex];
          //  nested
          if (isArray$2(c)) {
              if (c.length > 0) {
                  c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`);
                  // merge adjacent text nodes
                  if (isTextNode(c[0]) && isTextNode(last)) {
                      res[lastIndex] = createTextVNode(last.text + c[0].text);
                      c.shift();
                  }
                  res.push.apply(res, c);
              }
          }
          else if (isPrimitive(c)) {
              if (isTextNode(last)) {
                  // merge adjacent text nodes
                  // this is necessary for SSR hydration because text nodes are
                  // essentially merged when rendered to HTML strings
                  res[lastIndex] = createTextVNode(last.text + c);
              }
              else if (c !== '') {
                  // convert primitive to vnode
                  res.push(createTextVNode(c));
              }
          }
          else {
              if (isTextNode(c) && isTextNode(last)) {
                  // merge adjacent text nodes
                  res[lastIndex] = createTextVNode(last.text + c.text);
              }
              else {
                  // default key for nested array children (likely generated by v-for)
                  if (isTrue(children._isVList) &&
                      isDef(c.tag) &&
                      isUndef(c.key) &&
                      isDef(nestedIndex)) {
                      c.key = `__vlist${nestedIndex}_${i}__`;
                  }
                  res.push(c);
              }
          }
      }
      return res;
  }

  const SIMPLE_NORMALIZE = 1;
  const ALWAYS_NORMALIZE = 2;
  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {
      if (isArray$2(data) || isPrimitive(data)) {
          normalizationType = children;
          children = data;
          data = undefined;
      }
      if (isTrue(alwaysNormalize)) {
          normalizationType = ALWAYS_NORMALIZE;
      }
      return _createElement(context, tag, data, children, normalizationType);
  }
  function _createElement(context, tag, data, children, normalizationType) {
      if (isDef(data) && isDef(data.__ob__)) {
          warn$2(`Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` + 'Always create fresh vnode data objects in each render!', context);
          return createEmptyVNode();
      }
      // object syntax in v-bind
      if (isDef(data) && isDef(data.is)) {
          tag = data.is;
      }
      if (!tag) {
          // in case of component :is set to falsy value
          return createEmptyVNode();
      }
      // warn against non-primitive key
      if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
          warn$2('Avoid using non-primitive value as key, ' +
              'use string/number value instead.', context);
      }
      // support single function children as default scoped slot
      if (isArray$2(children) && isFunction$2(children[0])) {
          data = data || {};
          data.scopedSlots = { default: children[0] };
          children.length = 0;
      }
      if (normalizationType === ALWAYS_NORMALIZE) {
          children = normalizeChildren(children);
      }
      else if (normalizationType === SIMPLE_NORMALIZE) {
          children = simpleNormalizeChildren(children);
      }
      let vnode, ns;
      if (typeof tag === 'string') {
          let Ctor;
          ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
          if (config.isReservedTag(tag)) {
              // platform built-in elements
              if (isDef(data) &&
                  isDef(data.nativeOn) &&
                  data.tag !== 'component') {
                  warn$2(`The .native modifier for v-on is only valid on components but it was used on <${tag}>.`, context);
              }
              vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
          }
          else if ((!data || !data.pre) &&
              isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
              // component
              vnode = createComponent(Ctor, data, context, children, tag);
          }
          else {
              // unknown or unlisted namespaced elements
              // check at runtime because it may get assigned a namespace when its
              // parent normalizes children
              vnode = new VNode(tag, data, children, undefined, undefined, context);
          }
      }
      else {
          // direct component options / constructor
          vnode = createComponent(tag, data, context, children);
      }
      if (isArray$2(vnode)) {
          return vnode;
      }
      else if (isDef(vnode)) {
          if (isDef(ns))
              applyNS(vnode, ns);
          if (isDef(data))
              registerDeepBindings(data);
          return vnode;
      }
      else {
          return createEmptyVNode();
      }
  }
  function applyNS(vnode, ns, force) {
      vnode.ns = ns;
      if (vnode.tag === 'foreignObject') {
          // use default namespace inside foreignObject
          ns = undefined;
          force = true;
      }
      if (isDef(vnode.children)) {
          for (let i = 0, l = vnode.children.length; i < l; i++) {
              const child = vnode.children[i];
              if (isDef(child.tag) &&
                  (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
                  applyNS(child, ns, force);
              }
          }
      }
  }
  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings(data) {
      if (isObject$2(data.style)) {
          traverse(data.style);
      }
      if (isObject$2(data.class)) {
          traverse(data.class);
      }
  }

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList(val, render) {
      let ret = null, i, l, keys, key;
      if (isArray$2(val) || typeof val === 'string') {
          ret = new Array(val.length);
          for (i = 0, l = val.length; i < l; i++) {
              ret[i] = render(val[i], i);
          }
      }
      else if (typeof val === 'number') {
          ret = new Array(val);
          for (i = 0; i < val; i++) {
              ret[i] = render(i + 1, i);
          }
      }
      else if (isObject$2(val)) {
          if (hasSymbol && val[Symbol.iterator]) {
              ret = [];
              const iterator = val[Symbol.iterator]();
              let result = iterator.next();
              while (!result.done) {
                  ret.push(render(result.value, ret.length));
                  result = iterator.next();
              }
          }
          else {
              keys = Object.keys(val);
              ret = new Array(keys.length);
              for (i = 0, l = keys.length; i < l; i++) {
                  key = keys[i];
                  ret[i] = render(val[key], key, i);
              }
          }
      }
      if (!isDef(ret)) {
          ret = [];
      }
      ret._isVList = true;
      return ret;
  }

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot(name, fallbackRender, props, bindObject) {
      const scopedSlotFn = this.$scopedSlots[name];
      let nodes;
      if (scopedSlotFn) {
          // scoped slot
          props = props || {};
          if (bindObject) {
              if (!isObject$2(bindObject)) {
                  warn$2('slot v-bind without argument expects an Object', this);
              }
              props = extend$1(extend$1({}, bindObject), props);
          }
          nodes =
              scopedSlotFn(props) ||
                  (isFunction$2(fallbackRender) ? fallbackRender() : fallbackRender);
      }
      else {
          nodes =
              this.$slots[name] ||
                  (isFunction$2(fallbackRender) ? fallbackRender() : fallbackRender);
      }
      const target = props && props.slot;
      if (target) {
          return this.$createElement('template', { slot: target }, nodes);
      }
      else {
          return nodes;
      }
  }

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter(id) {
      return resolveAsset(this.$options, 'filters', id, true) || identity;
  }

  function isKeyNotMatch(expect, actual) {
      if (isArray$2(expect)) {
          return expect.indexOf(actual) === -1;
      }
      else {
          return expect !== actual;
      }
  }
  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
      const mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
      if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
          return isKeyNotMatch(builtInKeyName, eventKeyName);
      }
      else if (mappedKeyCode) {
          return isKeyNotMatch(mappedKeyCode, eventKeyCode);
      }
      else if (eventKeyName) {
          return hyphenate(eventKeyName) !== key;
      }
      return eventKeyCode === undefined;
  }

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(data, tag, value, asProp, isSync) {
      if (value) {
          if (!isObject$2(value)) {
              warn$2('v-bind without argument expects an Object or Array value', this);
          }
          else {
              if (isArray$2(value)) {
                  value = toObject(value);
              }
              let hash;
              for (const key in value) {
                  if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
                      hash = data;
                  }
                  else {
                      const type = data.attrs && data.attrs.type;
                      hash =
                          asProp || config.mustUseProp(tag, type, key)
                              ? data.domProps || (data.domProps = {})
                              : data.attrs || (data.attrs = {});
                  }
                  const camelizedKey = camelize(key);
                  const hyphenatedKey = hyphenate(key);
                  if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                      hash[key] = value[key];
                      if (isSync) {
                          const on = data.on || (data.on = {});
                          on[`update:${key}`] = function ($event) {
                              value[key] = $event;
                          };
                      }
                  }
              }
          }
      }
      return data;
  }

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic(index, isInFor) {
      const cached = this._staticTrees || (this._staticTrees = []);
      let tree = cached[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree.
      if (tree && !isInFor) {
          return tree;
      }
      // otherwise, render a fresh tree.
      tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, this._c, this // for render fns generated for functional component templates
      );
      markStatic$1(tree, `__static__${index}`, false);
      return tree;
  }
  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce(tree, index, key) {
      markStatic$1(tree, `__once__${index}${key ? `_${key}` : ``}`, true);
      return tree;
  }
  function markStatic$1(tree, key, isOnce) {
      if (isArray$2(tree)) {
          for (let i = 0; i < tree.length; i++) {
              if (tree[i] && typeof tree[i] !== 'string') {
                  markStaticNode(tree[i], `${key}_${i}`, isOnce);
              }
          }
      }
      else {
          markStaticNode(tree, key, isOnce);
      }
  }
  function markStaticNode(node, key, isOnce) {
      node.isStatic = true;
      node.key = key;
      node.isOnce = isOnce;
  }

  function bindObjectListeners(data, value) {
      if (value) {
          if (!isPlainObject$1(value)) {
              warn$2('v-on without argument expects an Object value', this);
          }
          else {
              const on = (data.on = data.on ? extend$1({}, data.on) : {});
              for (const key in value) {
                  const existing = on[key];
                  const ours = value[key];
                  on[key] = existing ? [].concat(existing, ours) : ours;
              }
          }
      }
      return data;
  }

  function resolveScopedSlots(fns, res, 
  // the following are added in 2.6
  hasDynamicKeys, contentHashKey) {
      res = res || { $stable: !hasDynamicKeys };
      for (let i = 0; i < fns.length; i++) {
          const slot = fns[i];
          if (isArray$2(slot)) {
              resolveScopedSlots(slot, res, hasDynamicKeys);
          }
          else if (slot) {
              // marker for reverse proxying v-slot without scope on this.$slots
              // @ts-expect-error
              if (slot.proxy) {
                  // @ts-expect-error
                  slot.fn.proxy = true;
              }
              res[slot.key] = slot.fn;
          }
      }
      if (contentHashKey) {
          res.$key = contentHashKey;
      }
      return res;
  }

  // helper to process dynamic keys for dynamic arguments in v-bind and v-on.
  function bindDynamicKeys(baseObj, values) {
      for (let i = 0; i < values.length; i += 2) {
          const key = values[i];
          if (typeof key === 'string' && key) {
              baseObj[values[i]] = values[i + 1];
          }
          else if (key !== '' && key !== null) {
              // null is a special value for explicitly removing a binding
              warn$2(`Invalid value for dynamic directive argument (expected string or null): ${key}`, this);
          }
      }
      return baseObj;
  }
  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier(value, symbol) {
      return typeof value === 'string' ? symbol + value : value;
  }

  function installRenderHelpers(target) {
      target._o = markOnce;
      target._n = toNumber;
      target._s = toString$2;
      target._l = renderList;
      target._t = renderSlot;
      target._q = looseEqual;
      target._i = looseIndexOf;
      target._m = renderStatic;
      target._f = resolveFilter;
      target._k = checkKeyCodes;
      target._b = bindObjectProps;
      target._v = createTextVNode;
      target._e = createEmptyVNode;
      target._u = resolveScopedSlots;
      target._g = bindObjectListeners;
      target._d = bindDynamicKeys;
      target._p = prependModifier;
  }

  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(children, context) {
      if (!children || !children.length) {
          return {};
      }
      const slots = {};
      for (let i = 0, l = children.length; i < l; i++) {
          const child = children[i];
          const data = child.data;
          // remove slot attribute if the node is resolved as a Vue slot node
          if (data && data.attrs && data.attrs.slot) {
              delete data.attrs.slot;
          }
          // named slots should only be respected if the vnode was rendered in the
          // same context.
          if ((child.context === context || child.fnContext === context) &&
              data &&
              data.slot != null) {
              const name = data.slot;
              const slot = slots[name] || (slots[name] = []);
              if (child.tag === 'template') {
                  slot.push.apply(slot, child.children || []);
              }
              else {
                  slot.push(child);
              }
          }
          else {
              (slots.default || (slots.default = [])).push(child);
          }
      }
      // ignore slots that contains only whitespace
      for (const name in slots) {
          if (slots[name].every(isWhitespace)) {
              delete slots[name];
          }
      }
      return slots;
  }
  function isWhitespace(node) {
      return (node.isComment && !node.asyncFactory) || node.text === ' ';
  }

  function isAsyncPlaceholder(node) {
      // @ts-expect-error not really boolean type
      return node.isComment && node.asyncFactory;
  }

  function normalizeScopedSlots(ownerVm, scopedSlots, normalSlots, prevScopedSlots) {
      let res;
      const hasNormalSlots = Object.keys(normalSlots).length > 0;
      const isStable = scopedSlots ? !!scopedSlots.$stable : !hasNormalSlots;
      const key = scopedSlots && scopedSlots.$key;
      if (!scopedSlots) {
          res = {};
      }
      else if (scopedSlots._normalized) {
          // fast path 1: child component re-render only, parent did not change
          return scopedSlots._normalized;
      }
      else if (isStable &&
          prevScopedSlots &&
          prevScopedSlots !== emptyObject &&
          key === prevScopedSlots.$key &&
          !hasNormalSlots &&
          !prevScopedSlots.$hasNormal) {
          // fast path 2: stable scoped slots w/ no normal slots to proxy,
          // only need to normalize once
          return prevScopedSlots;
      }
      else {
          res = {};
          for (const key in scopedSlots) {
              if (scopedSlots[key] && key[0] !== '$') {
                  res[key] = normalizeScopedSlot(ownerVm, normalSlots, key, scopedSlots[key]);
              }
          }
      }
      // expose normal slots on scopedSlots
      for (const key in normalSlots) {
          if (!(key in res)) {
              res[key] = proxyNormalSlot(normalSlots, key);
          }
      }
      // avoriaz seems to mock a non-extensible $scopedSlots object
      // and when that is passed down this would cause an error
      if (scopedSlots && Object.isExtensible(scopedSlots)) {
          scopedSlots._normalized = res;
      }
      def(res, '$stable', isStable);
      def(res, '$key', key);
      def(res, '$hasNormal', hasNormalSlots);
      return res;
  }
  function normalizeScopedSlot(vm, normalSlots, key, fn) {
      const normalized = function () {
          const cur = currentInstance;
          setCurrentInstance(vm);
          let res = arguments.length ? fn.apply(null, arguments) : fn({});
          res =
              res && typeof res === 'object' && !isArray$2(res)
                  ? [res] // single vnode
                  : normalizeChildren(res);
          const vnode = res && res[0];
          setCurrentInstance(cur);
          return res &&
              (!vnode ||
                  (res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode))) // #9658, #10391
              ? undefined
              : res;
      };
      // this is a slot using the new v-slot syntax without scope. although it is
      // compiled as a scoped slot, render fn users would expect it to be present
      // on this.$slots because the usage is semantically a normal slot.
      if (fn.proxy) {
          Object.defineProperty(normalSlots, key, {
              get: normalized,
              enumerable: true,
              configurable: true
          });
      }
      return normalized;
  }
  function proxyNormalSlot(slots, key) {
      return () => slots[key];
  }

  function initSetup(vm) {
      const options = vm.$options;
      const setup = options.setup;
      if (setup) {
          const ctx = (vm._setupContext = createSetupContext(vm));
          setCurrentInstance(vm);
          pushTarget();
          const setupResult = invokeWithErrorHandling(setup, null, [vm._props || shallowReactive({}), ctx], vm, `setup`);
          popTarget();
          setCurrentInstance();
          if (isFunction$2(setupResult)) {
              // render function
              // @ts-ignore
              options.render = setupResult;
          }
          else if (isObject$2(setupResult)) {
              // bindings
              if (setupResult instanceof VNode) {
                  warn$2(`setup() should not return VNodes directly - ` +
                      `return a render function instead.`);
              }
              vm._setupState = setupResult;
              // __sfc indicates compiled bindings from <script setup>
              if (!setupResult.__sfc) {
                  for (const key in setupResult) {
                      if (!isReserved(key)) {
                          proxyWithRefUnwrap(vm, setupResult, key);
                      }
                      else {
                          warn$2(`Avoid using variables that start with _ or $ in setup().`);
                      }
                  }
              }
              else {
                  // exposed for compiled render fn
                  const proxy = (vm._setupProxy = {});
                  for (const key in setupResult) {
                      if (key !== '__sfc') {
                          proxyWithRefUnwrap(proxy, setupResult, key);
                      }
                  }
              }
          }
          else if (setupResult !== undefined) {
              warn$2(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
          }
      }
  }
  function createSetupContext(vm) {
      let exposeCalled = false;
      return {
          get attrs() {
              if (!vm._attrsProxy) {
                  const proxy = (vm._attrsProxy = {});
                  def(proxy, '_v_attr_proxy', true);
                  syncSetupProxy(proxy, vm.$attrs, emptyObject, vm, '$attrs');
              }
              return vm._attrsProxy;
          },
          get listeners() {
              if (!vm._listenersProxy) {
                  const proxy = (vm._listenersProxy = {});
                  syncSetupProxy(proxy, vm.$listeners, emptyObject, vm, '$listeners');
              }
              return vm._listenersProxy;
          },
          get slots() {
              return initSlotsProxy(vm);
          },
          emit: bind$1(vm.$emit, vm),
          expose(exposed) {
              {
                  if (exposeCalled) {
                      warn$2(`expose() should be called only once per setup().`, vm);
                  }
                  exposeCalled = true;
              }
              if (exposed) {
                  Object.keys(exposed).forEach(key => proxyWithRefUnwrap(vm, exposed, key));
              }
          }
      };
  }
  function syncSetupProxy(to, from, prev, instance, type) {
      let changed = false;
      for (const key in from) {
          if (!(key in to)) {
              changed = true;
              defineProxyAttr(to, key, instance, type);
          }
          else if (from[key] !== prev[key]) {
              changed = true;
          }
      }
      for (const key in to) {
          if (!(key in from)) {
              changed = true;
              delete to[key];
          }
      }
      return changed;
  }
  function defineProxyAttr(proxy, key, instance, type) {
      Object.defineProperty(proxy, key, {
          enumerable: true,
          configurable: true,
          get() {
              return instance[type][key];
          }
      });
  }
  function initSlotsProxy(vm) {
      if (!vm._slotsProxy) {
          syncSetupSlots((vm._slotsProxy = {}), vm.$scopedSlots);
      }
      return vm._slotsProxy;
  }
  function syncSetupSlots(to, from) {
      for (const key in from) {
          to[key] = from[key];
      }
      for (const key in to) {
          if (!(key in from)) {
              delete to[key];
          }
      }
  }

  function initRender(vm) {
      vm._vnode = null; // the root of the child tree
      vm._staticTrees = null; // v-once cached trees
      const options = vm.$options;
      const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
      const renderContext = parentVnode && parentVnode.context;
      vm.$slots = resolveSlots(options._renderChildren, renderContext);
      vm.$scopedSlots = parentVnode
          ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots)
          : emptyObject;
      // bind the createElement fn to this instance
      // so that we get proper render context inside it.
      // args order: tag, data, children, normalizationType, alwaysNormalize
      // internal version is used by render functions compiled from templates
      // @ts-expect-error
      vm._c = (a, b, c, d) => createElement$1(vm, a, b, c, d, false);
      // normalization is always applied for the public version, used in
      // user-written render functions.
      // @ts-expect-error
      vm.$createElement = (a, b, c, d) => createElement$1(vm, a, b, c, d, true);
      // $attrs & $listeners are exposed for easier HOC creation.
      // they need to be reactive so that HOCs using them are always updated
      const parentData = parentVnode && parentVnode.data;
      /* istanbul ignore else */
      {
          defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, () => {
              !isUpdatingChildComponent && warn$2(`$attrs is readonly.`, vm);
          }, true);
          defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
              !isUpdatingChildComponent && warn$2(`$listeners is readonly.`, vm);
          }, true);
      }
  }
  let currentRenderingInstance = null;
  function renderMixin(Vue) {
      // install runtime convenience helpers
      installRenderHelpers(Vue.prototype);
      Vue.prototype.$nextTick = function (fn) {
          return nextTick(fn, this);
      };
      Vue.prototype._render = function () {
          const vm = this;
          const { render, _parentVnode } = vm.$options;
          if (_parentVnode && vm._isMounted) {
              vm.$scopedSlots = normalizeScopedSlots(vm.$parent, _parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
              if (vm._slotsProxy) {
                  syncSetupSlots(vm._slotsProxy, vm.$scopedSlots);
              }
          }
          // set parent vnode. this allows render functions to have access
          // to the data on the placeholder node.
          vm.$vnode = _parentVnode;
          // render self
          const prevInst = currentInstance;
          const prevRenderInst = currentRenderingInstance;
          let vnode;
          try {
              setCurrentInstance(vm);
              currentRenderingInstance = vm;
              vnode = render.call(vm._renderProxy, vm.$createElement);
          }
          catch (e) {
              handleError$1(e, vm, `render`);
              // return error render result,
              // or previous vnode to prevent render error causing blank component
              /* istanbul ignore else */
              if (vm.$options.renderError) {
                  try {
                      vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                  }
                  catch (e) {
                      handleError$1(e, vm, `renderError`);
                      vnode = vm._vnode;
                  }
              }
              else {
                  vnode = vm._vnode;
              }
          }
          finally {
              currentRenderingInstance = prevRenderInst;
              setCurrentInstance(prevInst);
          }
          // if the returned array contains only a single node, allow it
          if (isArray$2(vnode) && vnode.length === 1) {
              vnode = vnode[0];
          }
          // return empty vnode in case the render function errored out
          if (!(vnode instanceof VNode)) {
              if (isArray$2(vnode)) {
                  warn$2('Multiple root nodes returned from render function. Render function ' +
                      'should return a single root node.', vm);
              }
              vnode = createEmptyVNode();
          }
          // set parent
          vnode.parent = _parentVnode;
          return vnode;
      };
  }

  function ensureCtor(comp, base) {
      if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
          comp = comp.default;
      }
      return isObject$2(comp) ? base.extend(comp) : comp;
  }
  function createAsyncPlaceholder(factory, data, context, children, tag) {
      const node = createEmptyVNode();
      node.asyncFactory = factory;
      node.asyncMeta = { data, context, children, tag };
      return node;
  }
  function resolveAsyncComponent(factory, baseCtor) {
      if (isTrue(factory.error) && isDef(factory.errorComp)) {
          return factory.errorComp;
      }
      if (isDef(factory.resolved)) {
          return factory.resolved;
      }
      const owner = currentRenderingInstance;
      if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
          // already pending
          factory.owners.push(owner);
      }
      if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
          return factory.loadingComp;
      }
      if (owner && !isDef(factory.owners)) {
          const owners = (factory.owners = [owner]);
          let sync = true;
          let timerLoading = null;
          let timerTimeout = null;
          owner.$on('hook:destroyed', () => remove$2(owners, owner));
          const forceRender = (renderCompleted) => {
              for (let i = 0, l = owners.length; i < l; i++) {
                  owners[i].$forceUpdate();
              }
              if (renderCompleted) {
                  owners.length = 0;
                  if (timerLoading !== null) {
                      clearTimeout(timerLoading);
                      timerLoading = null;
                  }
                  if (timerTimeout !== null) {
                      clearTimeout(timerTimeout);
                      timerTimeout = null;
                  }
              }
          };
          const resolve = once((res) => {
              // cache resolved
              factory.resolved = ensureCtor(res, baseCtor);
              // invoke callbacks only if this is not a synchronous resolve
              // (async resolves are shimmed as synchronous during SSR)
              if (!sync) {
                  forceRender(true);
              }
              else {
                  owners.length = 0;
              }
          });
          const reject = once(reason => {
              warn$2(`Failed to resolve async component: ${String(factory)}` +
                      (reason ? `\nReason: ${reason}` : ''));
              if (isDef(factory.errorComp)) {
                  factory.error = true;
                  forceRender(true);
              }
          });
          const res = factory(resolve, reject);
          if (isObject$2(res)) {
              if (isPromise(res)) {
                  // () => Promise
                  if (isUndef(factory.resolved)) {
                      res.then(resolve, reject);
                  }
              }
              else if (isPromise(res.component)) {
                  res.component.then(resolve, reject);
                  if (isDef(res.error)) {
                      factory.errorComp = ensureCtor(res.error, baseCtor);
                  }
                  if (isDef(res.loading)) {
                      factory.loadingComp = ensureCtor(res.loading, baseCtor);
                      if (res.delay === 0) {
                          factory.loading = true;
                      }
                      else {
                          // @ts-expect-error NodeJS timeout type
                          timerLoading = setTimeout(() => {
                              timerLoading = null;
                              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                  factory.loading = true;
                                  forceRender(false);
                              }
                          }, res.delay || 200);
                      }
                  }
                  if (isDef(res.timeout)) {
                      // @ts-expect-error NodeJS timeout type
                      timerTimeout = setTimeout(() => {
                          timerTimeout = null;
                          if (isUndef(factory.resolved)) {
                              reject(`timeout (${res.timeout}ms)` );
                          }
                      }, res.timeout);
                  }
              }
          }
          sync = false;
          // return in case resolved synchronously
          return factory.loading ? factory.loadingComp : factory.resolved;
      }
  }

  function getFirstComponentChild(children) {
      if (isArray$2(children)) {
          for (let i = 0; i < children.length; i++) {
              const c = children[i];
              if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                  return c;
              }
          }
      }
  }

  function initEvents(vm) {
      vm._events = Object.create(null);
      vm._hasHookEvent = false;
      // init parent attached events
      const listeners = vm.$options._parentListeners;
      if (listeners) {
          updateComponentListeners(vm, listeners);
      }
  }
  let target$1;
  function add$1(event, fn) {
      target$1.$on(event, fn);
  }
  function remove$1(event, fn) {
      target$1.$off(event, fn);
  }
  function createOnceHandler$1(event, fn) {
      const _target = target$1;
      return function onceHandler() {
          const res = fn.apply(null, arguments);
          if (res !== null) {
              _target.$off(event, onceHandler);
          }
      };
  }
  function updateComponentListeners(vm, listeners, oldListeners) {
      target$1 = vm;
      updateListeners(listeners, oldListeners || {}, add$1, remove$1, createOnceHandler$1, vm);
      target$1 = undefined;
  }
  function eventsMixin(Vue) {
      const hookRE = /^hook:/;
      Vue.prototype.$on = function (event, fn) {
          const vm = this;
          if (isArray$2(event)) {
              for (let i = 0, l = event.length; i < l; i++) {
                  vm.$on(event[i], fn);
              }
          }
          else {
              (vm._events[event] || (vm._events[event] = [])).push(fn);
              // optimize hook:event cost by using a boolean flag marked at registration
              // instead of a hash lookup
              if (hookRE.test(event)) {
                  vm._hasHookEvent = true;
              }
          }
          return vm;
      };
      Vue.prototype.$once = function (event, fn) {
          const vm = this;
          function on() {
              vm.$off(event, on);
              fn.apply(vm, arguments);
          }
          on.fn = fn;
          vm.$on(event, on);
          return vm;
      };
      Vue.prototype.$off = function (event, fn) {
          const vm = this;
          // all
          if (!arguments.length) {
              vm._events = Object.create(null);
              return vm;
          }
          // array of events
          if (isArray$2(event)) {
              for (let i = 0, l = event.length; i < l; i++) {
                  vm.$off(event[i], fn);
              }
              return vm;
          }
          // specific event
          const cbs = vm._events[event];
          if (!cbs) {
              return vm;
          }
          if (!fn) {
              vm._events[event] = null;
              return vm;
          }
          // specific handler
          let cb;
          let i = cbs.length;
          while (i--) {
              cb = cbs[i];
              if (cb === fn || cb.fn === fn) {
                  cbs.splice(i, 1);
                  break;
              }
          }
          return vm;
      };
      Vue.prototype.$emit = function (event) {
          const vm = this;
          {
              const lowerCaseEvent = event.toLowerCase();
              if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                  tip(`Event "${lowerCaseEvent}" is emitted in component ` +
                      `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
                      `Note that HTML attributes are case-insensitive and you cannot use ` +
                      `v-on to listen to camelCase events when using in-DOM templates. ` +
                      `You should probably use "${hyphenate(event)}" instead of "${event}".`);
              }
          }
          let cbs = vm._events[event];
          if (cbs) {
              cbs = cbs.length > 1 ? toArray(cbs) : cbs;
              const args = toArray(arguments, 1);
              const info = `event handler for "${event}"`;
              for (let i = 0, l = cbs.length; i < l; i++) {
                  invokeWithErrorHandling(cbs[i], vm, args, vm, info);
              }
          }
          return vm;
      };
  }

  let activeEffectScope;
  class EffectScope {
      constructor(detached = false) {
          this.detached = detached;
          /**
           * @internal
           */
          this.active = true;
          /**
           * @internal
           */
          this.effects = [];
          /**
           * @internal
           */
          this.cleanups = [];
          this.parent = activeEffectScope;
          if (!detached && activeEffectScope) {
              this.index =
                  (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
          }
      }
      run(fn) {
          if (this.active) {
              const currentEffectScope = activeEffectScope;
              try {
                  activeEffectScope = this;
                  return fn();
              }
              finally {
                  activeEffectScope = currentEffectScope;
              }
          }
          else {
              warn$2(`cannot run an inactive effect scope.`);
          }
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      on() {
          activeEffectScope = this;
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      off() {
          activeEffectScope = this.parent;
      }
      stop(fromParent) {
          if (this.active) {
              let i, l;
              for (i = 0, l = this.effects.length; i < l; i++) {
                  this.effects[i].teardown();
              }
              for (i = 0, l = this.cleanups.length; i < l; i++) {
                  this.cleanups[i]();
              }
              if (this.scopes) {
                  for (i = 0, l = this.scopes.length; i < l; i++) {
                      this.scopes[i].stop(true);
                  }
              }
              // nested scope, dereference from parent to avoid memory leaks
              if (!this.detached && this.parent && !fromParent) {
                  // optimized O(1) removal
                  const last = this.parent.scopes.pop();
                  if (last && last !== this) {
                      this.parent.scopes[this.index] = last;
                      last.index = this.index;
                  }
              }
              this.parent = undefined;
              this.active = false;
          }
      }
  }
  /**
   * @internal
   */
  function recordEffectScope(effect, scope = activeEffectScope) {
      if (scope && scope.active) {
          scope.effects.push(effect);
      }
  }
  function getCurrentScope() {
      return activeEffectScope;
  }

  let activeInstance = null;
  let isUpdatingChildComponent = false;
  function setActiveInstance(vm) {
      const prevActiveInstance = activeInstance;
      activeInstance = vm;
      return () => {
          activeInstance = prevActiveInstance;
      };
  }
  function initLifecycle(vm) {
      const options = vm.$options;
      // locate first non-abstract parent
      let parent = options.parent;
      if (parent && !options.abstract) {
          while (parent.$options.abstract && parent.$parent) {
              parent = parent.$parent;
          }
          parent.$children.push(vm);
      }
      vm.$parent = parent;
      vm.$root = parent ? parent.$root : vm;
      vm.$children = [];
      vm.$refs = {};
      vm._provided = parent ? parent._provided : Object.create(null);
      vm._watcher = null;
      vm._inactive = null;
      vm._directInactive = false;
      vm._isMounted = false;
      vm._isDestroyed = false;
      vm._isBeingDestroyed = false;
  }
  function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode, hydrating) {
          const vm = this;
          const prevEl = vm.$el;
          const prevVnode = vm._vnode;
          const restoreActiveInstance = setActiveInstance(vm);
          vm._vnode = vnode;
          // Vue.prototype.__patch__ is injected in entry points
          // based on the rendering backend used.
          if (!prevVnode) {
              // initial render
              vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
          }
          else {
              // updates
              vm.$el = vm.__patch__(prevVnode, vnode);
          }
          restoreActiveInstance();
          // update __vue__ reference
          if (prevEl) {
              prevEl.__vue__ = null;
          }
          if (vm.$el) {
              vm.$el.__vue__ = vm;
          }
          // if parent is an HOC, update its $el as well
          let wrapper = vm;
          while (wrapper &&
              wrapper.$vnode &&
              wrapper.$parent &&
              wrapper.$vnode === wrapper.$parent._vnode) {
              wrapper.$parent.$el = wrapper.$el;
              wrapper = wrapper.$parent;
          }
          // updated hook is called by the scheduler to ensure that children are
          // updated in a parent's updated hook.
      };
      Vue.prototype.$forceUpdate = function () {
          const vm = this;
          if (vm._watcher) {
              vm._watcher.update();
          }
      };
      Vue.prototype.$destroy = function () {
          const vm = this;
          if (vm._isBeingDestroyed) {
              return;
          }
          callHook$1(vm, 'beforeDestroy');
          vm._isBeingDestroyed = true;
          // remove self from parent
          const parent = vm.$parent;
          if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
              remove$2(parent.$children, vm);
          }
          // teardown scope. this includes both the render watcher and other
          // watchers created
          vm._scope.stop();
          // remove reference from data ob
          // frozen object may not have observer.
          if (vm._data.__ob__) {
              vm._data.__ob__.vmCount--;
          }
          // call the last hook...
          vm._isDestroyed = true;
          // invoke destroy hooks on current rendered tree
          vm.__patch__(vm._vnode, null);
          // fire destroyed hook
          callHook$1(vm, 'destroyed');
          // turn off all instance listeners.
          vm.$off();
          // remove __vue__ reference
          if (vm.$el) {
              vm.$el.__vue__ = null;
          }
          // release circular reference (#6759)
          if (vm.$vnode) {
              vm.$vnode.parent = null;
          }
      };
  }
  function mountComponent(vm, el, hydrating) {
      vm.$el = el;
      if (!vm.$options.render) {
          // @ts-expect-error invalid type
          vm.$options.render = createEmptyVNode;
          {
              /* istanbul ignore if */
              if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                  vm.$options.el ||
                  el) {
                  warn$2('You are using the runtime-only build of Vue where the template ' +
                      'compiler is not available. Either pre-compile the templates into ' +
                      'render functions, or use the compiler-included build.', vm);
              }
              else {
                  warn$2('Failed to mount component: template or render function not defined.', vm);
              }
          }
      }
      callHook$1(vm, 'beforeMount');
      let updateComponent;
      /* istanbul ignore if */
      if (config.performance && mark) {
          updateComponent = () => {
              const name = vm._name;
              const id = vm._uid;
              const startTag = `vue-perf-start:${id}`;
              const endTag = `vue-perf-end:${id}`;
              mark(startTag);
              const vnode = vm._render();
              mark(endTag);
              measure(`vue ${name} render`, startTag, endTag);
              mark(startTag);
              vm._update(vnode, hydrating);
              mark(endTag);
              measure(`vue ${name} patch`, startTag, endTag);
          };
      }
      else {
          updateComponent = () => {
              vm._update(vm._render(), hydrating);
          };
      }
      const watcherOptions = {
          before() {
              if (vm._isMounted && !vm._isDestroyed) {
                  callHook$1(vm, 'beforeUpdate');
              }
          }
      };
      {
          watcherOptions.onTrack = e => callHook$1(vm, 'renderTracked', [e]);
          watcherOptions.onTrigger = e => callHook$1(vm, 'renderTriggered', [e]);
      }
      // we set this to vm._watcher inside the watcher's constructor
      // since the watcher's initial patch may call $forceUpdate (e.g. inside child
      // component's mounted hook), which relies on vm._watcher being already defined
      new Watcher(vm, updateComponent, noop, watcherOptions, true /* isRenderWatcher */);
      hydrating = false;
      // flush buffer for flush: "pre" watchers queued in setup()
      const preWatchers = vm._preWatchers;
      if (preWatchers) {
          for (let i = 0; i < preWatchers.length; i++) {
              preWatchers[i].run();
          }
      }
      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      if (vm.$vnode == null) {
          vm._isMounted = true;
          callHook$1(vm, 'mounted');
      }
      return vm;
  }
  function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
      {
          isUpdatingChildComponent = true;
      }
      // determine whether component has slot children
      // we need to do this before overwriting $options._renderChildren.
      // check if there are dynamic scopedSlots (hand-written or compiled but with
      // dynamic slot names). Static scoped slots compiled from template has the
      // "$stable" marker.
      const newScopedSlots = parentVnode.data.scopedSlots;
      const oldScopedSlots = vm.$scopedSlots;
      const hasDynamicScopedSlot = !!((newScopedSlots && !newScopedSlots.$stable) ||
          (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
          (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
          (!newScopedSlots && vm.$scopedSlots.$key));
      // Any static slot children from the parent may have changed during parent's
      // update. Dynamic scoped slots may also have changed. In such cases, a forced
      // update is necessary to ensure correctness.
      let needsForceUpdate = !!(renderChildren || // has new static slots
          vm.$options._renderChildren || // has old static slots
          hasDynamicScopedSlot);
      const prevVNode = vm.$vnode;
      vm.$options._parentVnode = parentVnode;
      vm.$vnode = parentVnode; // update vm's placeholder node without re-render
      if (vm._vnode) {
          // update child tree's parent
          vm._vnode.parent = parentVnode;
      }
      vm.$options._renderChildren = renderChildren;
      // update $attrs and $listeners hash
      // these are also reactive so they may trigger child update if the child
      // used them during render
      const attrs = parentVnode.data.attrs || emptyObject;
      if (vm._attrsProxy) {
          // force update if attrs are accessed and has changed since it may be
          // passed to a child component.
          if (syncSetupProxy(vm._attrsProxy, attrs, (prevVNode.data && prevVNode.data.attrs) || emptyObject, vm, '$attrs')) {
              needsForceUpdate = true;
          }
      }
      vm.$attrs = attrs;
      // update listeners
      listeners = listeners || emptyObject;
      const prevListeners = vm.$options._parentListeners;
      if (vm._listenersProxy) {
          syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, '$listeners');
      }
      vm.$listeners = vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, prevListeners);
      // update props
      if (propsData && vm.$options.props) {
          toggleObserving(false);
          const props = vm._props;
          const propKeys = vm.$options._propKeys || [];
          for (let i = 0; i < propKeys.length; i++) {
              const key = propKeys[i];
              const propOptions = vm.$options.props; // wtf flow?
              props[key] = validateProp(key, propOptions, propsData, vm);
          }
          toggleObserving(true);
          // keep a copy of raw propsData
          vm.$options.propsData = propsData;
      }
      // resolve slots + force update if has children
      if (needsForceUpdate) {
          vm.$slots = resolveSlots(renderChildren, parentVnode.context);
          vm.$forceUpdate();
      }
      {
          isUpdatingChildComponent = false;
      }
  }
  function isInInactiveTree(vm) {
      while (vm && (vm = vm.$parent)) {
          if (vm._inactive)
              return true;
      }
      return false;
  }
  function activateChildComponent(vm, direct) {
      if (direct) {
          vm._directInactive = false;
          if (isInInactiveTree(vm)) {
              return;
          }
      }
      else if (vm._directInactive) {
          return;
      }
      if (vm._inactive || vm._inactive === null) {
          vm._inactive = false;
          for (let i = 0; i < vm.$children.length; i++) {
              activateChildComponent(vm.$children[i]);
          }
          callHook$1(vm, 'activated');
      }
  }
  function deactivateChildComponent(vm, direct) {
      if (direct) {
          vm._directInactive = true;
          if (isInInactiveTree(vm)) {
              return;
          }
      }
      if (!vm._inactive) {
          vm._inactive = true;
          for (let i = 0; i < vm.$children.length; i++) {
              deactivateChildComponent(vm.$children[i]);
          }
          callHook$1(vm, 'deactivated');
      }
  }
  function callHook$1(vm, hook, args, setContext = true) {
      // #7573 disable dep collection when invoking lifecycle hooks
      pushTarget();
      const prevInst = currentInstance;
      const prevScope = getCurrentScope();
      setContext && setCurrentInstance(vm);
      const handlers = vm.$options[hook];
      const info = `${hook} hook`;
      if (handlers) {
          for (let i = 0, j = handlers.length; i < j; i++) {
              invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
          }
      }
      if (vm._hasHookEvent) {
          vm.$emit('hook:' + hook);
      }
      if (setContext) {
          setCurrentInstance(prevInst);
          prevScope && prevScope.on();
      }
      popTarget();
  }

  const MAX_UPDATE_COUNT = 100;
  const queue = [];
  const activatedChildren = [];
  let has = {};
  let circular = {};
  let waiting = false;
  let flushing = false;
  let index$1 = 0;
  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
      index$1 = queue.length = activatedChildren.length = 0;
      has = {};
      {
          circular = {};
      }
      waiting = flushing = false;
  }
  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  let currentFlushTimestamp = 0;
  // Async edge case fix requires storing an event listener's attach timestamp.
  let getNow = Date.now;
  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
      const performance = window.performance;
      if (performance &&
          typeof performance.now === 'function' &&
          getNow() > document.createEvent('Event').timeStamp) {
          // if the event timestamp, although evaluated AFTER the Date.now(), is
          // smaller than it, it means the event is using a hi-res timestamp,
          // and we need to use the hi-res version for event listener timestamps as
          // well.
          getNow = () => performance.now();
      }
  }
  const sortCompareFn = (a, b) => {
      if (a.post) {
          if (!b.post)
              return 1;
      }
      else if (b.post) {
          return -1;
      }
      return a.id - b.id;
  };
  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
      currentFlushTimestamp = getNow();
      flushing = true;
      let watcher, id;
      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child)
      // 2. A component's user watchers are run before its render watcher (because
      //    user watchers are created before the render watcher)
      // 3. If a component is destroyed during a parent component's watcher run,
      //    its watchers can be skipped.
      queue.sort(sortCompareFn);
      // do not cache length because more watchers might be pushed
      // as we run existing watchers
      for (index$1 = 0; index$1 < queue.length; index$1++) {
          watcher = queue[index$1];
          if (watcher.before) {
              watcher.before();
          }
          id = watcher.id;
          has[id] = null;
          watcher.run();
          // in dev build, check and stop circular updates.
          if (has[id] != null) {
              circular[id] = (circular[id] || 0) + 1;
              if (circular[id] > MAX_UPDATE_COUNT) {
                  warn$2('You may have an infinite update loop ' +
                      (watcher.user
                          ? `in watcher with expression "${watcher.expression}"`
                          : `in a component render function.`), watcher.vm);
                  break;
              }
          }
      }
      // keep copies of post queues before resetting state
      const activatedQueue = activatedChildren.slice();
      const updatedQueue = queue.slice();
      resetSchedulerState();
      // call component updated and activated hooks
      callActivatedHooks(activatedQueue);
      callUpdatedHooks(updatedQueue);
      cleanupDeps();
      // devtool hook
      /* istanbul ignore if */
      if (devtools && config.devtools) {
          devtools.emit('flush');
      }
  }
  function callUpdatedHooks(queue) {
      let i = queue.length;
      while (i--) {
          const watcher = queue[i];
          const vm = watcher.vm;
          if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
              callHook$1(vm, 'updated');
          }
      }
  }
  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent(vm) {
      // setting _inactive to false here so that a render function can
      // rely on checking whether it's in an inactive tree (e.g. router-view)
      vm._inactive = false;
      activatedChildren.push(vm);
  }
  function callActivatedHooks(queue) {
      for (let i = 0; i < queue.length; i++) {
          queue[i]._inactive = true;
          activateChildComponent(queue[i], true /* true */);
      }
  }
  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
      const id = watcher.id;
      if (has[id] != null) {
          return;
      }
      if (watcher === Dep.target && watcher.noRecurse) {
          return;
      }
      has[id] = true;
      if (!flushing) {
          queue.push(watcher);
      }
      else {
          // if already flushing, splice the watcher based on its id
          // if already past its id, it will be run next immediately.
          let i = queue.length - 1;
          while (i > index$1 && queue[i].id > watcher.id) {
              i--;
          }
          queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
          waiting = true;
          if (!config.async) {
              flushSchedulerQueue();
              return;
          }
          nextTick(flushSchedulerQueue);
      }
  }
  function resolveProvided(vm) {
      // by default an instance inherits its parent's provides object
      // but when it needs to provide values of its own, it creates its
      // own provides object using parent provides object as prototype.
      // this way in `inject` we can simply look up injections from direct
      // parent and let the prototype chain do the work.
      const existing = vm._provided;
      const parentProvides = vm.$parent && vm.$parent._provided;
      if (parentProvides === existing) {
          return (vm._provided = Object.create(parentProvides));
      }
      else {
          return existing;
      }
  }

  function handleError$1(err, vm, info) {
      // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
      // See: https://github.com/vuejs/vuex/issues/1505
      pushTarget();
      try {
          if (vm) {
              let cur = vm;
              while ((cur = cur.$parent)) {
                  const hooks = cur.$options.errorCaptured;
                  if (hooks) {
                      for (let i = 0; i < hooks.length; i++) {
                          try {
                              const capture = hooks[i].call(cur, err, vm, info) === false;
                              if (capture)
                                  return;
                          }
                          catch (e) {
                              globalHandleError(e, cur, 'errorCaptured hook');
                          }
                      }
                  }
              }
          }
          globalHandleError(err, vm, info);
      }
      finally {
          popTarget();
      }
  }
  function invokeWithErrorHandling(handler, context, args, vm, info) {
      let res;
      try {
          res = args ? handler.apply(context, args) : handler.call(context);
          if (res && !res._isVue && isPromise(res) && !res._handled) {
              res.catch(e => handleError$1(e, vm, info + ` (Promise/async)`));
              res._handled = true;
          }
      }
      catch (e) {
          handleError$1(e, vm, info);
      }
      return res;
  }
  function globalHandleError(err, vm, info) {
      if (config.errorHandler) {
          try {
              return config.errorHandler.call(null, err, vm, info);
          }
          catch (e) {
              // if the user intentionally throws the original error in the handler,
              // do not log it twice
              if (e !== err) {
                  logError(e, null, 'config.errorHandler');
              }
          }
      }
      logError(err, vm, info);
  }
  function logError(err, vm, info) {
      {
          warn$2(`Error in ${info}: "${err.toString()}"`, vm);
      }
      /* istanbul ignore else */
      if (inBrowser && typeof console !== 'undefined') {
          console.error(err);
      }
      else {
          throw err;
      }
  }

  /* globals MutationObserver */
  let isUsingMicroTask = false;
  const callbacks = [];
  let pending = false;
  function flushCallbacks() {
      pending = false;
      const copies = callbacks.slice(0);
      callbacks.length = 0;
      for (let i = 0; i < copies.length; i++) {
          copies[i]();
      }
  }
  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  let timerFunc;
  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
      const p = Promise.resolve();
      timerFunc = () => {
          p.then(flushCallbacks);
          // In problematic UIWebViews, Promise.then doesn't completely break, but
          // it can get stuck in a weird state where callbacks are pushed into the
          // microtask queue but the queue isn't being flushed, until the browser
          // needs to do some other work, e.g. handle a timer. Therefore we can
          // "force" the microtask queue to be flushed by adding an empty timer.
          if (isIOS)
              setTimeout(noop);
      };
      isUsingMicroTask = true;
  }
  else if (!isIE &&
      typeof MutationObserver !== 'undefined' &&
      (isNative(MutationObserver) ||
          // PhantomJS and iOS 7.x
          MutationObserver.toString() === '[object MutationObserverConstructor]')) {
      // Use MutationObserver where native Promise is not available,
      // e.g. PhantomJS, iOS7, Android 4.4
      // (#6466 MutationObserver is unreliable in IE11)
      let counter = 1;
      const observer = new MutationObserver(flushCallbacks);
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
          characterData: true
      });
      timerFunc = () => {
          counter = (counter + 1) % 2;
          textNode.data = String(counter);
      };
      isUsingMicroTask = true;
  }
  else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      // Fallback to setImmediate.
      // Technically it leverages the (macro) task queue,
      // but it is still a better choice than setTimeout.
      timerFunc = () => {
          setImmediate(flushCallbacks);
      };
  }
  else {
      // Fallback to setTimeout.
      timerFunc = () => {
          setTimeout(flushCallbacks, 0);
      };
  }
  /**
   * @internal
   */
  function nextTick(cb, ctx) {
      let _resolve;
      callbacks.push(() => {
          if (cb) {
              try {
                  cb.call(ctx);
              }
              catch (e) {
                  handleError$1(e, ctx, 'nextTick');
              }
          }
          else if (_resolve) {
              _resolve(ctx);
          }
      });
      if (!pending) {
          pending = true;
          timerFunc();
      }
      // $flow-disable-line
      if (!cb && typeof Promise !== 'undefined') {
          return new Promise(resolve => {
              _resolve = resolve;
          });
      }
  }

  /**
   * Note: also update dist/vue.runtime.mjs when adding new exports to this file.
   */
  const version$1 = '2.7.16';

  const seenObjects = new _Set();
  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse(val) {
      _traverse(val, seenObjects);
      seenObjects.clear();
      return val;
  }
  function _traverse(val, seen) {
      let i, keys;
      const isA = isArray$2(val);
      if ((!isA && !isObject$2(val)) ||
          val.__v_skip /* ReactiveFlags.SKIP */ ||
          Object.isFrozen(val) ||
          val instanceof VNode) {
          return;
      }
      if (val.__ob__) {
          const depId = val.__ob__.dep.id;
          if (seen.has(depId)) {
              return;
          }
          seen.add(depId);
      }
      if (isA) {
          i = val.length;
          while (i--)
              _traverse(val[i], seen);
      }
      else if (isRef(val)) {
          _traverse(val.value, seen);
      }
      else {
          keys = Object.keys(val);
          i = keys.length;
          while (i--)
              _traverse(val[keys[i]], seen);
      }
  }

  let uid$1 = 0;
  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   * @internal
   */
  class Watcher {
      constructor(vm, expOrFn, cb, options, isRenderWatcher) {
          recordEffectScope(this, 
          // if the active effect scope is manually created (not a component scope),
          // prioritize it
          activeEffectScope && !activeEffectScope._vm
              ? activeEffectScope
              : vm
                  ? vm._scope
                  : undefined);
          if ((this.vm = vm) && isRenderWatcher) {
              vm._watcher = this;
          }
          // options
          if (options) {
              this.deep = !!options.deep;
              this.user = !!options.user;
              this.lazy = !!options.lazy;
              this.sync = !!options.sync;
              this.before = options.before;
              {
                  this.onTrack = options.onTrack;
                  this.onTrigger = options.onTrigger;
              }
          }
          else {
              this.deep = this.user = this.lazy = this.sync = false;
          }
          this.cb = cb;
          this.id = ++uid$1; // uid for batching
          this.active = true;
          this.post = false;
          this.dirty = this.lazy; // for lazy watchers
          this.deps = [];
          this.newDeps = [];
          this.depIds = new _Set();
          this.newDepIds = new _Set();
          this.expression = expOrFn.toString() ;
          // parse expression for getter
          if (isFunction$2(expOrFn)) {
              this.getter = expOrFn;
          }
          else {
              this.getter = parsePath(expOrFn);
              if (!this.getter) {
                  this.getter = noop;
                  warn$2(`Failed watching path: "${expOrFn}" ` +
                          'Watcher only accepts simple dot-delimited paths. ' +
                          'For full control, use a function instead.', vm);
              }
          }
          this.value = this.lazy ? undefined : this.get();
      }
      /**
       * Evaluate the getter, and re-collect dependencies.
       */
      get() {
          pushTarget(this);
          let value;
          const vm = this.vm;
          try {
              value = this.getter.call(vm, vm);
          }
          catch (e) {
              if (this.user) {
                  handleError$1(e, vm, `getter for watcher "${this.expression}"`);
              }
              else {
                  throw e;
              }
          }
          finally {
              // "touch" every property so they are all tracked as
              // dependencies for deep watching
              if (this.deep) {
                  traverse(value);
              }
              popTarget();
              this.cleanupDeps();
          }
          return value;
      }
      /**
       * Add a dependency to this directive.
       */
      addDep(dep) {
          const id = dep.id;
          if (!this.newDepIds.has(id)) {
              this.newDepIds.add(id);
              this.newDeps.push(dep);
              if (!this.depIds.has(id)) {
                  dep.addSub(this);
              }
          }
      }
      /**
       * Clean up for dependency collection.
       */
      cleanupDeps() {
          let i = this.deps.length;
          while (i--) {
              const dep = this.deps[i];
              if (!this.newDepIds.has(dep.id)) {
                  dep.removeSub(this);
              }
          }
          let tmp = this.depIds;
          this.depIds = this.newDepIds;
          this.newDepIds = tmp;
          this.newDepIds.clear();
          tmp = this.deps;
          this.deps = this.newDeps;
          this.newDeps = tmp;
          this.newDeps.length = 0;
      }
      /**
       * Subscriber interface.
       * Will be called when a dependency changes.
       */
      update() {
          /* istanbul ignore else */
          if (this.lazy) {
              this.dirty = true;
          }
          else if (this.sync) {
              this.run();
          }
          else {
              queueWatcher(this);
          }
      }
      /**
       * Scheduler job interface.
       * Will be called by the scheduler.
       */
      run() {
          if (this.active) {
              const value = this.get();
              if (value !== this.value ||
                  // Deep watchers and watchers on Object/Arrays should fire even
                  // when the value is the same, because the value may
                  // have mutated.
                  isObject$2(value) ||
                  this.deep) {
                  // set new value
                  const oldValue = this.value;
                  this.value = value;
                  if (this.user) {
                      const info = `callback for watcher "${this.expression}"`;
                      invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info);
                  }
                  else {
                      this.cb.call(this.vm, value, oldValue);
                  }
              }
          }
      }
      /**
       * Evaluate the value of the watcher.
       * This only gets called for lazy watchers.
       */
      evaluate() {
          this.value = this.get();
          this.dirty = false;
      }
      /**
       * Depend on all deps collected by this watcher.
       */
      depend() {
          let i = this.deps.length;
          while (i--) {
              this.deps[i].depend();
          }
      }
      /**
       * Remove self from all dependencies' subscriber list.
       */
      teardown() {
          if (this.vm && !this.vm._isBeingDestroyed) {
              remove$2(this.vm._scope.effects, this);
          }
          if (this.active) {
              let i = this.deps.length;
              while (i--) {
                  this.deps[i].removeSub(this);
              }
              this.active = false;
              if (this.onStop) {
                  this.onStop();
              }
          }
      }
  }

  const sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop,
      set: noop
  };
  function proxy(target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter() {
          return this[sourceKey][key];
      };
      sharedPropertyDefinition.set = function proxySetter(val) {
          this[sourceKey][key] = val;
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function initState(vm) {
      const opts = vm.$options;
      if (opts.props)
          initProps$1(vm, opts.props);
      // Composition API
      initSetup(vm);
      if (opts.methods)
          initMethods(vm, opts.methods);
      if (opts.data) {
          initData(vm);
      }
      else {
          const ob = observe((vm._data = {}));
          ob && ob.vmCount++;
      }
      if (opts.computed)
          initComputed$1(vm, opts.computed);
      if (opts.watch && opts.watch !== nativeWatch) {
          initWatch(vm, opts.watch);
      }
  }
  function initProps$1(vm, propsOptions) {
      const propsData = vm.$options.propsData || {};
      const props = (vm._props = shallowReactive({}));
      // cache prop keys so that future props updates can iterate using Array
      // instead of dynamic object key enumeration.
      const keys = (vm.$options._propKeys = []);
      const isRoot = !vm.$parent;
      // root instance props should be converted
      if (!isRoot) {
          toggleObserving(false);
      }
      for (const key in propsOptions) {
          keys.push(key);
          const value = validateProp(key, propsOptions, propsData, vm);
          /* istanbul ignore else */
          {
              const hyphenatedKey = hyphenate(key);
              if (isReservedAttribute(hyphenatedKey) ||
                  config.isReservedAttr(hyphenatedKey)) {
                  warn$2(`"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`, vm);
              }
              defineReactive(props, key, value, () => {
                  if (!isRoot && !isUpdatingChildComponent) {
                      warn$2(`Avoid mutating a prop directly since the value will be ` +
                          `overwritten whenever the parent component re-renders. ` +
                          `Instead, use a data or computed property based on the prop's ` +
                          `value. Prop being mutated: "${key}"`, vm);
                  }
              }, true /* shallow */);
          }
          // static props are already proxied on the component's prototype
          // during Vue.extend(). We only need to proxy props defined at
          // instantiation here.
          if (!(key in vm)) {
              proxy(vm, `_props`, key);
          }
      }
      toggleObserving(true);
  }
  function initData(vm) {
      let data = vm.$options.data;
      data = vm._data = isFunction$2(data) ? getData(data, vm) : data || {};
      if (!isPlainObject$1(data)) {
          data = {};
          warn$2('data functions should return an object:\n' +
                  'https://v2.vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
      }
      // proxy data on instance
      const keys = Object.keys(data);
      const props = vm.$options.props;
      const methods = vm.$options.methods;
      let i = keys.length;
      while (i--) {
          const key = keys[i];
          {
              if (methods && hasOwn(methods, key)) {
                  warn$2(`Method "${key}" has already been defined as a data property.`, vm);
              }
          }
          if (props && hasOwn(props, key)) {
              warn$2(`The data property "${key}" is already declared as a prop. ` +
                      `Use prop default value instead.`, vm);
          }
          else if (!isReserved(key)) {
              proxy(vm, `_data`, key);
          }
      }
      // observe data
      const ob = observe(data);
      ob && ob.vmCount++;
  }
  function getData(data, vm) {
      // #7573 disable dep collection when invoking data getters
      pushTarget();
      try {
          return data.call(vm, vm);
      }
      catch (e) {
          handleError$1(e, vm, `data()`);
          return {};
      }
      finally {
          popTarget();
      }
  }
  const computedWatcherOptions = { lazy: true };
  function initComputed$1(vm, computed) {
      // $flow-disable-line
      const watchers = (vm._computedWatchers = Object.create(null));
      // computed properties are just getters during SSR
      const isSSR = isServerRendering();
      for (const key in computed) {
          const userDef = computed[key];
          const getter = isFunction$2(userDef) ? userDef : userDef.get;
          if (getter == null) {
              warn$2(`Getter is missing for computed property "${key}".`, vm);
          }
          if (!isSSR) {
              // create internal watcher for the computed property.
              watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
          }
          // component-defined computed properties are already defined on the
          // component prototype. We only need to define computed properties defined
          // at instantiation here.
          if (!(key in vm)) {
              defineComputed(vm, key, userDef);
          }
          else {
              if (key in vm.$data) {
                  warn$2(`The computed property "${key}" is already defined in data.`, vm);
              }
              else if (vm.$options.props && key in vm.$options.props) {
                  warn$2(`The computed property "${key}" is already defined as a prop.`, vm);
              }
              else if (vm.$options.methods && key in vm.$options.methods) {
                  warn$2(`The computed property "${key}" is already defined as a method.`, vm);
              }
          }
      }
  }
  function defineComputed(target, key, userDef) {
      const shouldCache = !isServerRendering();
      if (isFunction$2(userDef)) {
          sharedPropertyDefinition.get = shouldCache
              ? createComputedGetter(key)
              : createGetterInvoker(userDef);
          sharedPropertyDefinition.set = noop;
      }
      else {
          sharedPropertyDefinition.get = userDef.get
              ? shouldCache && userDef.cache !== false
                  ? createComputedGetter(key)
                  : createGetterInvoker(userDef.get)
              : noop;
          sharedPropertyDefinition.set = userDef.set || noop;
      }
      if (sharedPropertyDefinition.set === noop) {
          sharedPropertyDefinition.set = function () {
              warn$2(`Computed property "${key}" was assigned to but it has no setter.`, this);
          };
      }
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function createComputedGetter(key) {
      return function computedGetter() {
          const watcher = this._computedWatchers && this._computedWatchers[key];
          if (watcher) {
              if (watcher.dirty) {
                  watcher.evaluate();
              }
              if (Dep.target) {
                  if (Dep.target.onTrack) {
                      Dep.target.onTrack({
                          effect: Dep.target,
                          target: this,
                          type: "get" /* TrackOpTypes.GET */,
                          key
                      });
                  }
                  watcher.depend();
              }
              return watcher.value;
          }
      };
  }
  function createGetterInvoker(fn) {
      return function computedGetter() {
          return fn.call(this, this);
      };
  }
  function initMethods(vm, methods) {
      const props = vm.$options.props;
      for (const key in methods) {
          {
              if (typeof methods[key] !== 'function') {
                  warn$2(`Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
                      `Did you reference the function correctly?`, vm);
              }
              if (props && hasOwn(props, key)) {
                  warn$2(`Method "${key}" has already been defined as a prop.`, vm);
              }
              if (key in vm && isReserved(key)) {
                  warn$2(`Method "${key}" conflicts with an existing Vue instance method. ` +
                      `Avoid defining component methods that start with _ or $.`);
              }
          }
          vm[key] = typeof methods[key] !== 'function' ? noop : bind$1(methods[key], vm);
      }
  }
  function initWatch(vm, watch) {
      for (const key in watch) {
          const handler = watch[key];
          if (isArray$2(handler)) {
              for (let i = 0; i < handler.length; i++) {
                  createWatcher(vm, key, handler[i]);
              }
          }
          else {
              createWatcher(vm, key, handler);
          }
      }
  }
  function createWatcher(vm, expOrFn, handler, options) {
      if (isPlainObject$1(handler)) {
          options = handler;
          handler = handler.handler;
      }
      if (typeof handler === 'string') {
          handler = vm[handler];
      }
      return vm.$watch(expOrFn, handler, options);
  }
  function stateMixin(Vue) {
      // flow somehow has problems with directly declared definition object
      // when using Object.defineProperty, so we have to procedurally build up
      // the object here.
      const dataDef = {};
      dataDef.get = function () {
          return this._data;
      };
      const propsDef = {};
      propsDef.get = function () {
          return this._props;
      };
      {
          dataDef.set = function () {
              warn$2('Avoid replacing instance root $data. ' +
                  'Use nested data properties instead.', this);
          };
          propsDef.set = function () {
              warn$2(`$props is readonly.`, this);
          };
      }
      Object.defineProperty(Vue.prototype, '$data', dataDef);
      Object.defineProperty(Vue.prototype, '$props', propsDef);
      Vue.prototype.$set = set;
      Vue.prototype.$delete = del;
      Vue.prototype.$watch = function (expOrFn, cb, options) {
          const vm = this;
          if (isPlainObject$1(cb)) {
              return createWatcher(vm, expOrFn, cb, options);
          }
          options = options || {};
          options.user = true;
          const watcher = new Watcher(vm, expOrFn, cb, options);
          if (options.immediate) {
              const info = `callback for immediate watcher "${watcher.expression}"`;
              pushTarget();
              invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
              popTarget();
          }
          return function unwatchFn() {
              watcher.teardown();
          };
      };
  }

  function initProvide(vm) {
      const provideOption = vm.$options.provide;
      if (provideOption) {
          const provided = isFunction$2(provideOption)
              ? provideOption.call(vm)
              : provideOption;
          if (!isObject$2(provided)) {
              return;
          }
          const source = resolveProvided(vm);
          // IE9 doesn't support Object.getOwnPropertyDescriptors so we have to
          // iterate the keys ourselves.
          const keys = hasSymbol ? Reflect.ownKeys(provided) : Object.keys(provided);
          for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              Object.defineProperty(source, key, Object.getOwnPropertyDescriptor(provided, key));
          }
      }
  }
  function initInjections(vm) {
      const result = resolveInject(vm.$options.inject, vm);
      if (result) {
          toggleObserving(false);
          Object.keys(result).forEach(key => {
              /* istanbul ignore else */
              {
                  defineReactive(vm, key, result[key], () => {
                      warn$2(`Avoid mutating an injected value directly since the changes will be ` +
                          `overwritten whenever the provided component re-renders. ` +
                          `injection being mutated: "${key}"`, vm);
                  });
              }
          });
          toggleObserving(true);
      }
  }
  function resolveInject(inject, vm) {
      if (inject) {
          // inject is :any because flow is not smart enough to figure out cached
          const result = Object.create(null);
          const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
          for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              // #6574 in case the inject object is observed...
              if (key === '__ob__')
                  continue;
              const provideKey = inject[key].from;
              if (provideKey in vm._provided) {
                  result[key] = vm._provided[provideKey];
              }
              else if ('default' in inject[key]) {
                  const provideDefault = inject[key].default;
                  result[key] = isFunction$2(provideDefault)
                      ? provideDefault.call(vm)
                      : provideDefault;
              }
              else {
                  warn$2(`Injection "${key}" not found`, vm);
              }
          }
          return result;
      }
  }

  let uid = 0;
  function initMixin$1(Vue) {
      Vue.prototype._init = function (options) {
          const vm = this;
          // a uid
          vm._uid = uid++;
          let startTag, endTag;
          /* istanbul ignore if */
          if (config.performance && mark) {
              startTag = `vue-perf-start:${vm._uid}`;
              endTag = `vue-perf-end:${vm._uid}`;
              mark(startTag);
          }
          // a flag to mark this as a Vue instance without having to do instanceof
          // check
          vm._isVue = true;
          // avoid instances from being observed
          vm.__v_skip = true;
          // effect scope
          vm._scope = new EffectScope(true /* detached */);
          // #13134 edge case where a child component is manually created during the
          // render of a parent component
          vm._scope.parent = undefined;
          vm._scope._vm = true;
          // merge options
          if (options && options._isComponent) {
              // optimize internal component instantiation
              // since dynamic options merging is pretty slow, and none of the
              // internal component options needs special treatment.
              initInternalComponent(vm, options);
          }
          else {
              vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
          }
          /* istanbul ignore else */
          {
              initProxy(vm);
          }
          // expose real self
          vm._self = vm;
          initLifecycle(vm);
          initEvents(vm);
          initRender(vm);
          callHook$1(vm, 'beforeCreate', undefined, false /* setContext */);
          initInjections(vm); // resolve injections before data/props
          initState(vm);
          initProvide(vm); // resolve provide after data/props
          callHook$1(vm, 'created');
          /* istanbul ignore if */
          if (config.performance && mark) {
              vm._name = formatComponentName(vm, false);
              mark(endTag);
              measure(`vue ${vm._name} init`, startTag, endTag);
          }
          if (vm.$options.el) {
              vm.$mount(vm.$options.el);
          }
      };
  }
  function initInternalComponent(vm, options) {
      const opts = (vm.$options = Object.create(vm.constructor.options));
      // doing this because it's faster than dynamic enumeration.
      const parentVnode = options._parentVnode;
      opts.parent = options.parent;
      opts._parentVnode = parentVnode;
      const vnodeComponentOptions = parentVnode.componentOptions;
      opts.propsData = vnodeComponentOptions.propsData;
      opts._parentListeners = vnodeComponentOptions.listeners;
      opts._renderChildren = vnodeComponentOptions.children;
      opts._componentTag = vnodeComponentOptions.tag;
      if (options.render) {
          opts.render = options.render;
          opts.staticRenderFns = options.staticRenderFns;
      }
  }
  function resolveConstructorOptions(Ctor) {
      let options = Ctor.options;
      if (Ctor.super) {
          const superOptions = resolveConstructorOptions(Ctor.super);
          const cachedSuperOptions = Ctor.superOptions;
          if (superOptions !== cachedSuperOptions) {
              // super option changed,
              // need to resolve new options.
              Ctor.superOptions = superOptions;
              // check if there are any late-modified/attached options (#4976)
              const modifiedOptions = resolveModifiedOptions(Ctor);
              // update base extend options
              if (modifiedOptions) {
                  extend$1(Ctor.extendOptions, modifiedOptions);
              }
              options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
              if (options.name) {
                  options.components[options.name] = Ctor;
              }
          }
      }
      return options;
  }
  function resolveModifiedOptions(Ctor) {
      let modified;
      const latest = Ctor.options;
      const sealed = Ctor.sealedOptions;
      for (const key in latest) {
          if (latest[key] !== sealed[key]) {
              if (!modified)
                  modified = {};
              modified[key] = latest[key];
          }
      }
      return modified;
  }

  function FunctionalRenderContext(data, props, children, parent, Ctor) {
      const options = Ctor.options;
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      let contextVm;
      if (hasOwn(parent, '_uid')) {
          contextVm = Object.create(parent);
          contextVm._original = parent;
      }
      else {
          // the context vm passed in is a functional context as well.
          // in this case we want to make sure we are able to get a hold to the
          // real context instance.
          contextVm = parent;
          // @ts-ignore
          parent = parent._original;
      }
      const isCompiled = isTrue(options._compiled);
      const needNormalization = !isCompiled;
      this.data = data;
      this.props = props;
      this.children = children;
      this.parent = parent;
      this.listeners = data.on || emptyObject;
      this.injections = resolveInject(options.inject, parent);
      this.slots = () => {
          if (!this.$slots) {
              normalizeScopedSlots(parent, data.scopedSlots, (this.$slots = resolveSlots(children, parent)));
          }
          return this.$slots;
      };
      Object.defineProperty(this, 'scopedSlots', {
          enumerable: true,
          get() {
              return normalizeScopedSlots(parent, data.scopedSlots, this.slots());
          }
      });
      // support for compiled functional template
      if (isCompiled) {
          // exposing $options for renderStatic()
          this.$options = options;
          // pre-resolve slots for renderSlot()
          this.$slots = this.slots();
          this.$scopedSlots = normalizeScopedSlots(parent, data.scopedSlots, this.$slots);
      }
      if (options._scopeId) {
          this._c = (a, b, c, d) => {
              const vnode = createElement$1(contextVm, a, b, c, d, needNormalization);
              if (vnode && !isArray$2(vnode)) {
                  vnode.fnScopeId = options._scopeId;
                  vnode.fnContext = parent;
              }
              return vnode;
          };
      }
      else {
          this._c = (a, b, c, d) => createElement$1(contextVm, a, b, c, d, needNormalization);
      }
  }
  installRenderHelpers(FunctionalRenderContext.prototype);
  function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
      const options = Ctor.options;
      const props = {};
      const propOptions = options.props;
      if (isDef(propOptions)) {
          for (const key in propOptions) {
              props[key] = validateProp(key, propOptions, propsData || emptyObject);
          }
      }
      else {
          if (isDef(data.attrs))
              mergeProps(props, data.attrs);
          if (isDef(data.props))
              mergeProps(props, data.props);
      }
      const renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
      const vnode = options.render.call(null, renderContext._c, renderContext);
      if (vnode instanceof VNode) {
          return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
      }
      else if (isArray$2(vnode)) {
          const vnodes = normalizeChildren(vnode) || [];
          const res = new Array(vnodes.length);
          for (let i = 0; i < vnodes.length; i++) {
              res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
          }
          return res;
      }
  }
  function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
      // #7817 clone node before setting fnContext, otherwise if the node is reused
      // (e.g. it was from a cached normal slot) the fnContext causes named slots
      // that should not be matched to match.
      const clone = cloneVNode(vnode);
      clone.fnContext = contextVm;
      clone.fnOptions = options;
      {
          (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext =
              renderContext;
      }
      if (data.slot) {
          (clone.data || (clone.data = {})).slot = data.slot;
      }
      return clone;
  }
  function mergeProps(to, from) {
      for (const key in from) {
          to[camelize(key)] = from[key];
      }
  }

  function getComponentName(options) {
      return options.name || options.__name || options._componentTag;
  }
  // inline hooks to be invoked on component VNodes during patch
  const componentVNodeHooks = {
      init(vnode, hydrating) {
          if (vnode.componentInstance &&
              !vnode.componentInstance._isDestroyed &&
              vnode.data.keepAlive) {
              // kept-alive components, treat as a patch
              const mountedNode = vnode; // work around flow
              componentVNodeHooks.prepatch(mountedNode, mountedNode);
          }
          else {
              const child = (vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance));
              child.$mount(hydrating ? vnode.elm : undefined, hydrating);
          }
      },
      prepatch(oldVnode, vnode) {
          const options = vnode.componentOptions;
          const child = (vnode.componentInstance = oldVnode.componentInstance);
          updateChildComponent(child, options.propsData, // updated props
          options.listeners, // updated listeners
          vnode, // new parent vnode
          options.children // new children
          );
      },
      insert(vnode) {
          const { context, componentInstance } = vnode;
          if (!componentInstance._isMounted) {
              componentInstance._isMounted = true;
              callHook$1(componentInstance, 'mounted');
          }
          if (vnode.data.keepAlive) {
              if (context._isMounted) {
                  // vue-router#1212
                  // During updates, a kept-alive component's child components may
                  // change, so directly walking the tree here may call activated hooks
                  // on incorrect children. Instead we push them into a queue which will
                  // be processed after the whole patch process ended.
                  queueActivatedComponent(componentInstance);
              }
              else {
                  activateChildComponent(componentInstance, true /* direct */);
              }
          }
      },
      destroy(vnode) {
          const { componentInstance } = vnode;
          if (!componentInstance._isDestroyed) {
              if (!vnode.data.keepAlive) {
                  componentInstance.$destroy();
              }
              else {
                  deactivateChildComponent(componentInstance, true /* direct */);
              }
          }
      }
  };
  const hooksToMerge = Object.keys(componentVNodeHooks);
  function createComponent(Ctor, data, context, children, tag) {
      if (isUndef(Ctor)) {
          return;
      }
      const baseCtor = context.$options._base;
      // plain options object: turn it into a constructor
      if (isObject$2(Ctor)) {
          Ctor = baseCtor.extend(Ctor);
      }
      // if at this stage it's not a constructor or an async component factory,
      // reject.
      if (typeof Ctor !== 'function') {
          {
              warn$2(`Invalid Component definition: ${String(Ctor)}`, context);
          }
          return;
      }
      // async component
      let asyncFactory;
      // @ts-expect-error
      if (isUndef(Ctor.cid)) {
          asyncFactory = Ctor;
          Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
          if (Ctor === undefined) {
              // return a placeholder node for async component, which is rendered
              // as a comment node but preserves all the raw information for the node.
              // the information will be used for async server-rendering and hydration.
              return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
          }
      }
      data = data || {};
      // resolve constructor options in case global mixins are applied after
      // component constructor creation
      resolveConstructorOptions(Ctor);
      // transform component v-model data into props & events
      if (isDef(data.model)) {
          // @ts-expect-error
          transformModel(Ctor.options, data);
      }
      // extract props
      // @ts-expect-error
      const propsData = extractPropsFromVNodeData(data, Ctor, tag);
      // functional component
      // @ts-expect-error
      if (isTrue(Ctor.options.functional)) {
          return createFunctionalComponent(Ctor, propsData, data, context, children);
      }
      // extract listeners, since these needs to be treated as
      // child component listeners instead of DOM listeners
      const listeners = data.on;
      // replace with listeners with .native modifier
      // so it gets processed during parent component patch.
      data.on = data.nativeOn;
      // @ts-expect-error
      if (isTrue(Ctor.options.abstract)) {
          // abstract components do not keep anything
          // other than props & listeners & slot
          // work around flow
          const slot = data.slot;
          data = {};
          if (slot) {
              data.slot = slot;
          }
      }
      // install component management hooks onto the placeholder node
      installComponentHooks(data);
      // return a placeholder vnode
      // @ts-expect-error
      const name = getComponentName(Ctor.options) || tag;
      const vnode = new VNode(
      // @ts-expect-error
      `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`, data, undefined, undefined, undefined, context, 
      // @ts-expect-error
      { Ctor, propsData, listeners, tag, children }, asyncFactory);
      return vnode;
  }
  function createComponentInstanceForVnode(
  // we know it's MountedComponentVNode but flow doesn't
  vnode, 
  // activeInstance in lifecycle state
  parent) {
      const options = {
          _isComponent: true,
          _parentVnode: vnode,
          parent
      };
      // check inline-template render functions
      const inlineTemplate = vnode.data.inlineTemplate;
      if (isDef(inlineTemplate)) {
          options.render = inlineTemplate.render;
          options.staticRenderFns = inlineTemplate.staticRenderFns;
      }
      return new vnode.componentOptions.Ctor(options);
  }
  function installComponentHooks(data) {
      const hooks = data.hook || (data.hook = {});
      for (let i = 0; i < hooksToMerge.length; i++) {
          const key = hooksToMerge[i];
          const existing = hooks[key];
          const toMerge = componentVNodeHooks[key];
          // @ts-expect-error
          if (existing !== toMerge && !(existing && existing._merged)) {
              hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
          }
      }
  }
  function mergeHook(f1, f2) {
      const merged = (a, b) => {
          // flow complains about extra args which is why we use any
          f1(a, b);
          f2(a, b);
      };
      merged._merged = true;
      return merged;
  }
  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
      const prop = (options.model && options.model.prop) || 'value';
      const event = (options.model && options.model.event) || 'input';
      (data.attrs || (data.attrs = {}))[prop] = data.model.value;
      const on = data.on || (data.on = {});
      const existing = on[event];
      const callback = data.model.callback;
      if (isDef(existing)) {
          if (isArray$2(existing)
              ? existing.indexOf(callback) === -1
              : existing !== callback) {
              on[event] = [callback].concat(existing);
          }
      }
      else {
          on[event] = callback;
      }
  }

  let warn$2 = noop;
  let tip = noop;
  let generateComponentTrace; // work around flow check
  let formatComponentName;
  {
      const hasConsole = typeof console !== 'undefined';
      const classifyRE = /(?:^|[-_])(\w)/g;
      const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
      warn$2 = (msg, vm = currentInstance) => {
          const trace = vm ? generateComponentTrace(vm) : '';
          if (config.warnHandler) {
              config.warnHandler.call(null, msg, vm, trace);
          }
          else if (hasConsole && !config.silent) {
              console.error(`[Vue warn]: ${msg}${trace}`);
          }
      };
      tip = (msg, vm) => {
          if (hasConsole && !config.silent) {
              console.warn(`[Vue tip]: ${msg}` + (vm ? generateComponentTrace(vm) : ''));
          }
      };
      formatComponentName = (vm, includeFile) => {
          if (vm.$root === vm) {
              return '<Root>';
          }
          const options = isFunction$2(vm) && vm.cid != null
              ? vm.options
              : vm._isVue
                  ? vm.$options || vm.constructor.options
                  : vm;
          let name = getComponentName(options);
          const file = options.__file;
          if (!name && file) {
              const match = file.match(/([^/\\]+)\.vue$/);
              name = match && match[1];
          }
          return ((name ? `<${classify(name)}>` : `<Anonymous>`) +
              (file && includeFile !== false ? ` at ${file}` : ''));
      };
      const repeat = (str, n) => {
          let res = '';
          while (n) {
              if (n % 2 === 1)
                  res += str;
              if (n > 1)
                  str += str;
              n >>= 1;
          }
          return res;
      };
      generateComponentTrace = (vm) => {
          if (vm._isVue && vm.$parent) {
              const tree = [];
              let currentRecursiveSequence = 0;
              while (vm) {
                  if (tree.length > 0) {
                      const last = tree[tree.length - 1];
                      if (last.constructor === vm.constructor) {
                          currentRecursiveSequence++;
                          vm = vm.$parent;
                          continue;
                      }
                      else if (currentRecursiveSequence > 0) {
                          tree[tree.length - 1] = [last, currentRecursiveSequence];
                          currentRecursiveSequence = 0;
                      }
                  }
                  tree.push(vm);
                  vm = vm.$parent;
              }
              return ('\n\nfound in\n\n' +
                  tree
                      .map((vm, i) => `${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${isArray$2(vm)
                    ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
                    : formatComponentName(vm)}`)
                      .join('\n'));
          }
          else {
              return `\n\n(found in ${formatComponentName(vm)})`;
          }
      };
  }

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  const strats = config.optionMergeStrategies;
  /**
   * Options with restrictions
   */
  {
      strats.el = strats.propsData = function (parent, child, vm, key) {
          if (!vm) {
              warn$2(`option "${key}" can only be used during instance ` +
                  'creation with the `new` keyword.');
          }
          return defaultStrat(parent, child);
      };
  }
  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from, recursive = true) {
      if (!from)
          return to;
      let key, toVal, fromVal;
      const keys = hasSymbol
          ? Reflect.ownKeys(from)
          : Object.keys(from);
      for (let i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__')
              continue;
          toVal = to[key];
          fromVal = from[key];
          if (!recursive || !hasOwn(to, key)) {
              set(to, key, fromVal);
          }
          else if (toVal !== fromVal &&
              isPlainObject$1(toVal) &&
              isPlainObject$1(fromVal)) {
              mergeData(toVal, fromVal);
          }
      }
      return to;
  }
  /**
   * Data
   */
  function mergeDataOrFn(parentVal, childVal, vm) {
      if (!vm) {
          // in a Vue.extend merge, both should be functions
          if (!childVal) {
              return parentVal;
          }
          if (!parentVal) {
              return childVal;
          }
          // when parentVal & childVal are both present,
          // we need to return a function that returns the
          // merged result of both functions... no need to
          // check if parentVal is a function here because
          // it has to be a function to pass previous merges.
          return function mergedDataFn() {
              return mergeData(isFunction$2(childVal) ? childVal.call(this, this) : childVal, isFunction$2(parentVal) ? parentVal.call(this, this) : parentVal);
          };
      }
      else {
          return function mergedInstanceDataFn() {
              // instance merge
              const instanceData = isFunction$2(childVal)
                  ? childVal.call(vm, vm)
                  : childVal;
              const defaultData = isFunction$2(parentVal)
                  ? parentVal.call(vm, vm)
                  : parentVal;
              if (instanceData) {
                  return mergeData(instanceData, defaultData);
              }
              else {
                  return defaultData;
              }
          };
      }
  }
  strats.data = function (parentVal, childVal, vm) {
      if (!vm) {
          if (childVal && typeof childVal !== 'function') {
              warn$2('The "data" option should be a function ' +
                      'that returns a per-instance value in component ' +
                      'definitions.', vm);
              return parentVal;
          }
          return mergeDataOrFn(parentVal, childVal);
      }
      return mergeDataOrFn(parentVal, childVal, vm);
  };
  /**
   * Hooks and props are merged as arrays.
   */
  function mergeLifecycleHook(parentVal, childVal) {
      const res = childVal
          ? parentVal
              ? parentVal.concat(childVal)
              : isArray$2(childVal)
                  ? childVal
                  : [childVal]
          : parentVal;
      return res ? dedupeHooks(res) : res;
  }
  function dedupeHooks(hooks) {
      const res = [];
      for (let i = 0; i < hooks.length; i++) {
          if (res.indexOf(hooks[i]) === -1) {
              res.push(hooks[i]);
          }
      }
      return res;
  }
  LIFECYCLE_HOOKS.forEach(hook => {
      strats[hook] = mergeLifecycleHook;
  });
  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal, vm, key) {
      const res = Object.create(parentVal || null);
      if (childVal) {
          assertObjectType(key, childVal, vm);
          return extend$1(res, childVal);
      }
      else {
          return res;
      }
  }
  ASSET_TYPES.forEach(function (type) {
      strats[type + 's'] = mergeAssets;
  });
  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal, vm, key) {
      // work around Firefox's Object.prototype.watch...
      //@ts-expect-error work around
      if (parentVal === nativeWatch)
          parentVal = undefined;
      //@ts-expect-error work around
      if (childVal === nativeWatch)
          childVal = undefined;
      /* istanbul ignore if */
      if (!childVal)
          return Object.create(parentVal || null);
      {
          assertObjectType(key, childVal, vm);
      }
      if (!parentVal)
          return childVal;
      const ret = {};
      extend$1(ret, parentVal);
      for (const key in childVal) {
          let parent = ret[key];
          const child = childVal[key];
          if (parent && !isArray$2(parent)) {
              parent = [parent];
          }
          ret[key] = parent ? parent.concat(child) : isArray$2(child) ? child : [child];
      }
      return ret;
  };
  /**
   * Other object hashes.
   */
  strats.props =
      strats.methods =
          strats.inject =
              strats.computed =
                  function (parentVal, childVal, vm, key) {
                      if (childVal && true) {
                          assertObjectType(key, childVal, vm);
                      }
                      if (!parentVal)
                          return childVal;
                      const ret = Object.create(null);
                      extend$1(ret, parentVal);
                      if (childVal)
                          extend$1(ret, childVal);
                      return ret;
                  };
  strats.provide = function (parentVal, childVal) {
      if (!parentVal)
          return childVal;
      return function () {
          const ret = Object.create(null);
          mergeData(ret, isFunction$2(parentVal) ? parentVal.call(this) : parentVal);
          if (childVal) {
              mergeData(ret, isFunction$2(childVal) ? childVal.call(this) : childVal, false // non-recursive
              );
          }
          return ret;
      };
  };
  /**
   * Default strategy.
   */
  const defaultStrat = function (parentVal, childVal) {
      return childVal === undefined ? parentVal : childVal;
  };
  /**
   * Validate component names
   */
  function checkComponents(options) {
      for (const key in options.components) {
          validateComponentName(key);
      }
  }
  function validateComponentName(name) {
      if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
          warn$2('Invalid component name: "' +
              name +
              '". Component names ' +
              'should conform to valid custom element name in html5 specification.');
      }
      if (isBuiltInTag(name) || config.isReservedTag(name)) {
          warn$2('Do not use built-in or reserved HTML elements as component ' +
              'id: ' +
              name);
      }
  }
  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options, vm) {
      const props = options.props;
      if (!props)
          return;
      const res = {};
      let i, val, name;
      if (isArray$2(props)) {
          i = props.length;
          while (i--) {
              val = props[i];
              if (typeof val === 'string') {
                  name = camelize(val);
                  res[name] = { type: null };
              }
              else {
                  warn$2('props must be strings when using array syntax.');
              }
          }
      }
      else if (isPlainObject$1(props)) {
          for (const key in props) {
              val = props[key];
              name = camelize(key);
              res[name] = isPlainObject$1(val) ? val : { type: val };
          }
      }
      else {
          warn$2(`Invalid value for option "props": expected an Array or an Object, ` +
              `but got ${toRawType(props)}.`, vm);
      }
      options.props = res;
  }
  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject(options, vm) {
      const inject = options.inject;
      if (!inject)
          return;
      const normalized = (options.inject = {});
      if (isArray$2(inject)) {
          for (let i = 0; i < inject.length; i++) {
              normalized[inject[i]] = { from: inject[i] };
          }
      }
      else if (isPlainObject$1(inject)) {
          for (const key in inject) {
              const val = inject[key];
              normalized[key] = isPlainObject$1(val)
                  ? extend$1({ from: key }, val)
                  : { from: val };
          }
      }
      else {
          warn$2(`Invalid value for option "inject": expected an Array or an Object, ` +
              `but got ${toRawType(inject)}.`, vm);
      }
  }
  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives$1(options) {
      const dirs = options.directives;
      if (dirs) {
          for (const key in dirs) {
              const def = dirs[key];
              if (isFunction$2(def)) {
                  dirs[key] = { bind: def, update: def };
              }
          }
      }
  }
  function assertObjectType(name, value, vm) {
      if (!isPlainObject$1(value)) {
          warn$2(`Invalid value for option "${name}": expected an Object, ` +
              `but got ${toRawType(value)}.`, vm);
      }
  }
  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child, vm) {
      {
          checkComponents(child);
      }
      if (isFunction$2(child)) {
          // @ts-expect-error
          child = child.options;
      }
      normalizeProps(child, vm);
      normalizeInject(child, vm);
      normalizeDirectives$1(child);
      // Apply extends and mixins on the child options,
      // but only if it is a raw options object that isn't
      // the result of another mergeOptions call.
      // Only merged options has the _base property.
      if (!child._base) {
          if (child.extends) {
              parent = mergeOptions(parent, child.extends, vm);
          }
          if (child.mixins) {
              for (let i = 0, l = child.mixins.length; i < l; i++) {
                  parent = mergeOptions(parent, child.mixins[i], vm);
              }
          }
      }
      const options = {};
      let key;
      for (key in parent) {
          mergeField(key);
      }
      for (key in child) {
          if (!hasOwn(parent, key)) {
              mergeField(key);
          }
      }
      function mergeField(key) {
          const strat = strats[key] || defaultStrat;
          options[key] = strat(parent[key], child[key], vm, key);
      }
      return options;
  }
  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset(options, type, id, warnMissing) {
      /* istanbul ignore if */
      if (typeof id !== 'string') {
          return;
      }
      const assets = options[type];
      // check local registration variations first
      if (hasOwn(assets, id))
          return assets[id];
      const camelizedId = camelize(id);
      if (hasOwn(assets, camelizedId))
          return assets[camelizedId];
      const PascalCaseId = capitalize(camelizedId);
      if (hasOwn(assets, PascalCaseId))
          return assets[PascalCaseId];
      // fallback to prototype chain
      const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
      if (warnMissing && !res) {
          warn$2('Failed to resolve ' + type.slice(0, -1) + ': ' + id);
      }
      return res;
  }

  function validateProp(key, propOptions, propsData, vm) {
      const prop = propOptions[key];
      const absent = !hasOwn(propsData, key);
      let value = propsData[key];
      // boolean casting
      const booleanIndex = getTypeIndex(Boolean, prop.type);
      if (booleanIndex > -1) {
          if (absent && !hasOwn(prop, 'default')) {
              value = false;
          }
          else if (value === '' || value === hyphenate(key)) {
              // only cast empty string / same name to boolean if
              // boolean has higher priority
              const stringIndex = getTypeIndex(String, prop.type);
              if (stringIndex < 0 || booleanIndex < stringIndex) {
                  value = true;
              }
          }
      }
      // check default value
      if (value === undefined) {
          value = getPropDefaultValue(vm, prop, key);
          // since the default value is a fresh copy,
          // make sure to observe it.
          const prevShouldObserve = shouldObserve;
          toggleObserving(true);
          observe(value);
          toggleObserving(prevShouldObserve);
      }
      {
          assertProp(prop, key, value, vm, absent);
      }
      return value;
  }
  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, key) {
      // no default, return undefined
      if (!hasOwn(prop, 'default')) {
          return undefined;
      }
      const def = prop.default;
      // warn against non-factory defaults for Object & Array
      if (isObject$2(def)) {
          warn$2('Invalid default value for prop "' +
              key +
              '": ' +
              'Props with type Object/Array must use a factory function ' +
              'to return the default value.', vm);
      }
      // the raw prop value was also undefined from previous render,
      // return previous default value to avoid unnecessary watcher trigger
      if (vm &&
          vm.$options.propsData &&
          vm.$options.propsData[key] === undefined &&
          vm._props[key] !== undefined) {
          return vm._props[key];
      }
      // call factory function for non-Function types
      // a value is Function if its prototype is function even across different execution context
      return isFunction$2(def) && getType(prop.type) !== 'Function'
          ? def.call(vm)
          : def;
  }
  /**
   * Assert whether a prop is valid.
   */
  function assertProp(prop, name, value, vm, absent) {
      if (prop.required && absent) {
          warn$2('Missing required prop: "' + name + '"', vm);
          return;
      }
      if (value == null && !prop.required) {
          return;
      }
      let type = prop.type;
      let valid = !type || type === true;
      const expectedTypes = [];
      if (type) {
          if (!isArray$2(type)) {
              type = [type];
          }
          for (let i = 0; i < type.length && !valid; i++) {
              const assertedType = assertType(value, type[i], vm);
              expectedTypes.push(assertedType.expectedType || '');
              valid = assertedType.valid;
          }
      }
      const haveExpectedTypes = expectedTypes.some(t => t);
      if (!valid && haveExpectedTypes) {
          warn$2(getInvalidTypeMessage(name, value, expectedTypes), vm);
          return;
      }
      const validator = prop.validator;
      if (validator) {
          if (!validator(value)) {
              warn$2('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
          }
      }
  }
  const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
  function assertType(value, type, vm) {
      let valid;
      const expectedType = getType(type);
      if (simpleCheckRE.test(expectedType)) {
          const t = typeof value;
          valid = t === expectedType.toLowerCase();
          // for primitive wrapper objects
          if (!valid && t === 'object') {
              valid = value instanceof type;
          }
      }
      else if (expectedType === 'Object') {
          valid = isPlainObject$1(value);
      }
      else if (expectedType === 'Array') {
          valid = isArray$2(value);
      }
      else {
          try {
              valid = value instanceof type;
          }
          catch (e) {
              warn$2('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
              valid = false;
          }
      }
      return {
          valid,
          expectedType
      };
  }
  const functionTypeCheckRE = /^\s*function (\w+)/;
  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType(fn) {
      const match = fn && fn.toString().match(functionTypeCheckRE);
      return match ? match[1] : '';
  }
  function isSameType(a, b) {
      return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
      if (!isArray$2(expectedTypes)) {
          return isSameType(expectedTypes, type) ? 0 : -1;
      }
      for (let i = 0, len = expectedTypes.length; i < len; i++) {
          if (isSameType(expectedTypes[i], type)) {
              return i;
          }
      }
      return -1;
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
      let message = `Invalid prop: type check failed for prop "${name}".` +
          ` Expected ${expectedTypes.map(capitalize).join(', ')}`;
      const expectedType = expectedTypes[0];
      const receivedType = toRawType(value);
      // check if we need to specify expected value
      if (expectedTypes.length === 1 &&
          isExplicable(expectedType) &&
          isExplicable(typeof value) &&
          !isBoolean$1(expectedType, receivedType)) {
          message += ` with value ${styleValue(value, expectedType)}`;
      }
      message += `, got ${receivedType} `;
      // check if we need to specify received value
      if (isExplicable(receivedType)) {
          message += `with value ${styleValue(value, receivedType)}.`;
      }
      return message;
  }
  function styleValue(value, type) {
      if (type === 'String') {
          return `"${value}"`;
      }
      else if (type === 'Number') {
          return `${Number(value)}`;
      }
      else {
          return `${value}`;
      }
  }
  const EXPLICABLE_TYPES = ['string', 'number', 'boolean'];
  function isExplicable(value) {
      return EXPLICABLE_TYPES.some(elem => value.toLowerCase() === elem);
  }
  function isBoolean$1(...args) {
      return args.some(elem => elem.toLowerCase() === 'boolean');
  }

  function Vue(options) {
      if (!(this instanceof Vue)) {
          warn$2('Vue is a constructor and should be called with the `new` keyword');
      }
      this._init(options);
  }
  //@ts-expect-error Vue has function type
  initMixin$1(Vue);
  //@ts-expect-error Vue has function type
  stateMixin(Vue);
  //@ts-expect-error Vue has function type
  eventsMixin(Vue);
  //@ts-expect-error Vue has function type
  lifecycleMixin(Vue);
  //@ts-expect-error Vue has function type
  renderMixin(Vue);

  function initUse(Vue) {
      Vue.use = function (plugin) {
          const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
          if (installedPlugins.indexOf(plugin) > -1) {
              return this;
          }
          // additional parameters
          const args = toArray(arguments, 1);
          args.unshift(this);
          if (isFunction$2(plugin.install)) {
              plugin.install.apply(plugin, args);
          }
          else if (isFunction$2(plugin)) {
              plugin.apply(null, args);
          }
          installedPlugins.push(plugin);
          return this;
      };
  }

  function initMixin(Vue) {
      Vue.mixin = function (mixin) {
          this.options = mergeOptions(this.options, mixin);
          return this;
      };
  }

  function initExtend(Vue) {
      /**
       * Each instance constructor, including Vue, has a unique
       * cid. This enables us to create wrapped "child
       * constructors" for prototypal inheritance and cache them.
       */
      Vue.cid = 0;
      let cid = 1;
      /**
       * Class inheritance
       */
      Vue.extend = function (extendOptions) {
          extendOptions = extendOptions || {};
          const Super = this;
          const SuperId = Super.cid;
          const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
          if (cachedCtors[SuperId]) {
              return cachedCtors[SuperId];
          }
          const name = getComponentName(extendOptions) || getComponentName(Super.options);
          if (name) {
              validateComponentName(name);
          }
          const Sub = function VueComponent(options) {
              this._init(options);
          };
          Sub.prototype = Object.create(Super.prototype);
          Sub.prototype.constructor = Sub;
          Sub.cid = cid++;
          Sub.options = mergeOptions(Super.options, extendOptions);
          Sub['super'] = Super;
          // For props and computed properties, we define the proxy getters on
          // the Vue instances at extension time, on the extended prototype. This
          // avoids Object.defineProperty calls for each instance created.
          if (Sub.options.props) {
              initProps(Sub);
          }
          if (Sub.options.computed) {
              initComputed(Sub);
          }
          // allow further extension/mixin/plugin usage
          Sub.extend = Super.extend;
          Sub.mixin = Super.mixin;
          Sub.use = Super.use;
          // create asset registers, so extended classes
          // can have their private assets too.
          ASSET_TYPES.forEach(function (type) {
              Sub[type] = Super[type];
          });
          // enable recursive self-lookup
          if (name) {
              Sub.options.components[name] = Sub;
          }
          // keep a reference to the super options at extension time.
          // later at instantiation we can check if Super's options have
          // been updated.
          Sub.superOptions = Super.options;
          Sub.extendOptions = extendOptions;
          Sub.sealedOptions = extend$1({}, Sub.options);
          // cache constructor
          cachedCtors[SuperId] = Sub;
          return Sub;
      };
  }
  function initProps(Comp) {
      const props = Comp.options.props;
      for (const key in props) {
          proxy(Comp.prototype, `_props`, key);
      }
  }
  function initComputed(Comp) {
      const computed = Comp.options.computed;
      for (const key in computed) {
          defineComputed(Comp.prototype, key, computed[key]);
      }
  }

  function initAssetRegisters(Vue) {
      /**
       * Create asset registration methods.
       */
      ASSET_TYPES.forEach(type => {
          // @ts-expect-error function is not exact same type
          Vue[type] = function (id, definition) {
              if (!definition) {
                  return this.options[type + 's'][id];
              }
              else {
                  /* istanbul ignore if */
                  if (type === 'component') {
                      validateComponentName(id);
                  }
                  if (type === 'component' && isPlainObject$1(definition)) {
                      // @ts-expect-error
                      definition.name = definition.name || id;
                      definition = this.options._base.extend(definition);
                  }
                  if (type === 'directive' && isFunction$2(definition)) {
                      definition = { bind: definition, update: definition };
                  }
                  this.options[type + 's'][id] = definition;
                  return definition;
              }
          };
      });
  }

  function _getComponentName(opts) {
      return opts && (getComponentName(opts.Ctor.options) || opts.tag);
  }
  function matches(pattern, name) {
      if (isArray$2(pattern)) {
          return pattern.indexOf(name) > -1;
      }
      else if (typeof pattern === 'string') {
          return pattern.split(',').indexOf(name) > -1;
      }
      else if (isRegExp(pattern)) {
          return pattern.test(name);
      }
      /* istanbul ignore next */
      return false;
  }
  function pruneCache(keepAliveInstance, filter) {
      const { cache, keys, _vnode, $vnode } = keepAliveInstance;
      for (const key in cache) {
          const entry = cache[key];
          if (entry) {
              const name = entry.name;
              if (name && !filter(name)) {
                  pruneCacheEntry(cache, key, keys, _vnode);
              }
          }
      }
      $vnode.componentOptions.children = undefined;
  }
  function pruneCacheEntry(cache, key, keys, current) {
      const entry = cache[key];
      if (entry && (!current || entry.tag !== current.tag)) {
          // @ts-expect-error can be undefined
          entry.componentInstance.$destroy();
      }
      cache[key] = null;
      remove$2(keys, key);
  }
  const patternTypes = [String, RegExp, Array];
  // TODO defineComponent
  var KeepAlive = {
      name: 'keep-alive',
      abstract: true,
      props: {
          include: patternTypes,
          exclude: patternTypes,
          max: [String, Number]
      },
      methods: {
          cacheVNode() {
              const { cache, keys, vnodeToCache, keyToCache } = this;
              if (vnodeToCache) {
                  const { tag, componentInstance, componentOptions } = vnodeToCache;
                  cache[keyToCache] = {
                      name: _getComponentName(componentOptions),
                      tag,
                      componentInstance
                  };
                  keys.push(keyToCache);
                  // prune oldest entry
                  if (this.max && keys.length > parseInt(this.max)) {
                      pruneCacheEntry(cache, keys[0], keys, this._vnode);
                  }
                  this.vnodeToCache = null;
              }
          }
      },
      created() {
          this.cache = Object.create(null);
          this.keys = [];
      },
      destroyed() {
          for (const key in this.cache) {
              pruneCacheEntry(this.cache, key, this.keys);
          }
      },
      mounted() {
          this.cacheVNode();
          this.$watch('include', val => {
              pruneCache(this, name => matches(val, name));
          });
          this.$watch('exclude', val => {
              pruneCache(this, name => !matches(val, name));
          });
      },
      updated() {
          this.cacheVNode();
      },
      render() {
          const slot = this.$slots.default;
          const vnode = getFirstComponentChild(slot);
          const componentOptions = vnode && vnode.componentOptions;
          if (componentOptions) {
              // check pattern
              const name = _getComponentName(componentOptions);
              const { include, exclude } = this;
              if (
              // not included
              (include && (!name || !matches(include, name))) ||
                  // excluded
                  (exclude && name && matches(exclude, name))) {
                  return vnode;
              }
              const { cache, keys } = this;
              const key = vnode.key == null
                  ? // same constructor may get registered as different local components
                      // so cid alone is not enough (#3269)
                      componentOptions.Ctor.cid +
                          (componentOptions.tag ? `::${componentOptions.tag}` : '')
                  : vnode.key;
              if (cache[key]) {
                  vnode.componentInstance = cache[key].componentInstance;
                  // make current key freshest
                  remove$2(keys, key);
                  keys.push(key);
              }
              else {
                  // delay setting the cache until update
                  this.vnodeToCache = vnode;
                  this.keyToCache = key;
              }
              // @ts-expect-error can vnode.data can be undefined
              vnode.data.keepAlive = true;
          }
          return vnode || (slot && slot[0]);
      }
  };

  var builtInComponents = {
      KeepAlive
  };

  function initGlobalAPI(Vue) {
      // config
      const configDef = {};
      configDef.get = () => config;
      {
          configDef.set = () => {
              warn$2('Do not replace the Vue.config object, set individual fields instead.');
          };
      }
      Object.defineProperty(Vue, 'config', configDef);
      // exposed util methods.
      // NOTE: these are not considered part of the public API - avoid relying on
      // them unless you are aware of the risk.
      Vue.util = {
          warn: warn$2,
          extend: extend$1,
          mergeOptions,
          defineReactive
      };
      Vue.set = set;
      Vue.delete = del;
      Vue.nextTick = nextTick;
      // 2.6 explicit observable API
      Vue.observable = (obj) => {
          observe(obj);
          return obj;
      };
      Vue.options = Object.create(null);
      ASSET_TYPES.forEach(type => {
          Vue.options[type + 's'] = Object.create(null);
      });
      // this is used to identify the "base" constructor to extend all plain-object
      // components with in Weex's multi-instance scenarios.
      Vue.options._base = Vue;
      extend$1(Vue.options.components, builtInComponents);
      initUse(Vue);
      initMixin(Vue);
      initExtend(Vue);
      initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);
  Object.defineProperty(Vue.prototype, '$isServer', {
      get: isServerRendering
  });
  Object.defineProperty(Vue.prototype, '$ssrContext', {
      get() {
          /* istanbul ignore next */
          return this.$vnode && this.$vnode.ssrContext;
      }
  });
  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
      value: FunctionalRenderContext
  });
  Vue.version = version$1;

  // these are reserved for web because they are directly compiled away
  // during template compilation
  const isReservedAttr = makeMap('style,class');
  // attributes that should be using props for binding
  const acceptValue = makeMap('input,textarea,option,select,progress');
  const mustUseProp = (tag, type, attr) => {
      return ((attr === 'value' && acceptValue(tag) && type !== 'button') ||
          (attr === 'selected' && tag === 'option') ||
          (attr === 'checked' && tag === 'input') ||
          (attr === 'muted' && tag === 'video'));
  };
  const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
  const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
  const convertEnumeratedValue = (key, value) => {
      return isFalsyAttrValue(value) || value === 'false'
          ? 'false'
          : // allow arbitrary string value for contenteditable
              key === 'contenteditable' && isValidContentEditableValue(value)
                  ? value
                  : 'true';
  };
  const isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
      'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
      'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
      'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
      'required,reversed,scoped,seamless,selected,sortable,' +
      'truespeed,typemustmatch,visible');
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const isXlink = (name) => {
      return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
  };
  const getXlinkProp = (name) => {
      return isXlink(name) ? name.slice(6, name.length) : '';
  };
  const isFalsyAttrValue = (val) => {
      return val == null || val === false;
  };

  function genClassForVnode(vnode) {
      let data = vnode.data;
      let parentNode = vnode;
      let childNode = vnode;
      while (isDef(childNode.componentInstance)) {
          childNode = childNode.componentInstance._vnode;
          if (childNode && childNode.data) {
              data = mergeClassData(childNode.data, data);
          }
      }
      // @ts-expect-error parentNode.parent not VNodeWithData
      while (isDef((parentNode = parentNode.parent))) {
          if (parentNode && parentNode.data) {
              data = mergeClassData(data, parentNode.data);
          }
      }
      return renderClass(data.staticClass, data.class);
  }
  function mergeClassData(child, parent) {
      return {
          staticClass: concat(child.staticClass, parent.staticClass),
          class: isDef(child.class) ? [child.class, parent.class] : parent.class
      };
  }
  function renderClass(staticClass, dynamicClass) {
      if (isDef(staticClass) || isDef(dynamicClass)) {
          return concat(staticClass, stringifyClass(dynamicClass));
      }
      /* istanbul ignore next */
      return '';
  }
  function concat(a, b) {
      return a ? (b ? a + ' ' + b : a) : b || '';
  }
  function stringifyClass(value) {
      if (Array.isArray(value)) {
          return stringifyArray(value);
      }
      if (isObject$2(value)) {
          return stringifyObject(value);
      }
      if (typeof value === 'string') {
          return value;
      }
      /* istanbul ignore next */
      return '';
  }
  function stringifyArray(value) {
      let res = '';
      let stringified;
      for (let i = 0, l = value.length; i < l; i++) {
          if (isDef((stringified = stringifyClass(value[i]))) && stringified !== '') {
              if (res)
                  res += ' ';
              res += stringified;
          }
      }
      return res;
  }
  function stringifyObject(value) {
      let res = '';
      for (const key in value) {
          if (value[key]) {
              if (res)
                  res += ' ';
              res += key;
          }
      }
      return res;
  }

  const namespaceMap = {
      svg: 'http://www.w3.org/2000/svg',
      math: 'http://www.w3.org/1998/Math/MathML'
  };
  const isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot');
  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  const isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
      'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
      'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
  const isPreTag = (tag) => tag === 'pre';
  const isReservedTag = (tag) => {
      return isHTMLTag(tag) || isSVG(tag);
  };
  function getTagNamespace(tag) {
      if (isSVG(tag)) {
          return 'svg';
      }
      // basic support for MathML
      // note it doesn't support other MathML elements being component roots
      if (tag === 'math') {
          return 'math';
      }
  }
  const unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
      /* istanbul ignore if */
      if (!inBrowser) {
          return true;
      }
      if (isReservedTag(tag)) {
          return false;
      }
      tag = tag.toLowerCase();
      /* istanbul ignore if */
      if (unknownElementCache[tag] != null) {
          return unknownElementCache[tag];
      }
      const el = document.createElement(tag);
      if (tag.indexOf('-') > -1) {
          // https://stackoverflow.com/a/28210364/1070244
          return (unknownElementCache[tag] =
              el.constructor === window.HTMLUnknownElement ||
                  el.constructor === window.HTMLElement);
      }
      else {
          return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()));
      }
  }
  const isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
      if (typeof el === 'string') {
          const selected = document.querySelector(el);
          if (!selected) {
              warn$2('Cannot find element: ' + el);
              return document.createElement('div');
          }
          return selected;
      }
      else {
          return el;
      }
  }

  function createElement(tagName, vnode) {
      const elm = document.createElement(tagName);
      if (tagName !== 'select') {
          return elm;
      }
      // false or null will remove the attribute but undefined will not
      if (vnode.data &&
          vnode.data.attrs &&
          vnode.data.attrs.multiple !== undefined) {
          elm.setAttribute('multiple', 'multiple');
      }
      return elm;
  }
  function createElementNS(namespace, tagName) {
      return document.createElementNS(namespaceMap[namespace], tagName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(node) {
      return node.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function setStyleScope(node, scopeId) {
      node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  var ref = {
      create(_, vnode) {
          registerRef(vnode);
      },
      update(oldVnode, vnode) {
          if (oldVnode.data.ref !== vnode.data.ref) {
              registerRef(oldVnode, true);
              registerRef(vnode);
          }
      },
      destroy(vnode) {
          registerRef(vnode, true);
      }
  };
  function registerRef(vnode, isRemoval) {
      const ref = vnode.data.ref;
      if (!isDef(ref))
          return;
      const vm = vnode.context;
      const refValue = vnode.componentInstance || vnode.elm;
      const value = isRemoval ? null : refValue;
      const $refsValue = isRemoval ? undefined : refValue;
      if (isFunction$2(ref)) {
          invokeWithErrorHandling(ref, vm, [value], vm, `template ref function`);
          return;
      }
      const isFor = vnode.data.refInFor;
      const _isString = typeof ref === 'string' || typeof ref === 'number';
      const _isRef = isRef(ref);
      const refs = vm.$refs;
      if (_isString || _isRef) {
          if (isFor) {
              const existing = _isString ? refs[ref] : ref.value;
              if (isRemoval) {
                  isArray$2(existing) && remove$2(existing, refValue);
              }
              else {
                  if (!isArray$2(existing)) {
                      if (_isString) {
                          refs[ref] = [refValue];
                          setSetupRef(vm, ref, refs[ref]);
                      }
                      else {
                          ref.value = [refValue];
                      }
                  }
                  else if (!existing.includes(refValue)) {
                      existing.push(refValue);
                  }
              }
          }
          else if (_isString) {
              if (isRemoval && refs[ref] !== refValue) {
                  return;
              }
              refs[ref] = $refsValue;
              setSetupRef(vm, ref, value);
          }
          else if (_isRef) {
              if (isRemoval && ref.value !== refValue) {
                  return;
              }
              ref.value = value;
          }
          else {
              warn$2(`Invalid template ref type: ${typeof ref}`);
          }
      }
  }
  function setSetupRef({ _setupState }, key, val) {
      if (_setupState && hasOwn(_setupState, key)) {
          if (isRef(_setupState[key])) {
              _setupState[key].value = val;
          }
          else {
              _setupState[key] = val;
          }
      }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */
  const emptyNode = new VNode('', {}, []);
  const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
  function sameVnode(a, b) {
      return (a.key === b.key &&
          a.asyncFactory === b.asyncFactory &&
          ((a.tag === b.tag &&
              a.isComment === b.isComment &&
              isDef(a.data) === isDef(b.data) &&
              sameInputType(a, b)) ||
              (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error))));
  }
  function sameInputType(a, b) {
      if (a.tag !== 'input')
          return true;
      let i;
      const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
      const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
      return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
      let i, key;
      const map = {};
      for (i = beginIdx; i <= endIdx; ++i) {
          key = children[i].key;
          if (isDef(key))
              map[key] = i;
      }
      return map;
  }
  function createPatchFunction(backend) {
      let i, j;
      const cbs = {};
      const { modules, nodeOps } = backend;
      for (i = 0; i < hooks.length; ++i) {
          cbs[hooks[i]] = [];
          for (j = 0; j < modules.length; ++j) {
              if (isDef(modules[j][hooks[i]])) {
                  cbs[hooks[i]].push(modules[j][hooks[i]]);
              }
          }
      }
      function emptyNodeAt(elm) {
          return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
      }
      function createRmCb(childElm, listeners) {
          function remove() {
              if (--remove.listeners === 0) {
                  removeNode(childElm);
              }
          }
          remove.listeners = listeners;
          return remove;
      }
      function removeNode(el) {
          const parent = nodeOps.parentNode(el);
          // element may have already been removed due to v-html / v-text
          if (isDef(parent)) {
              nodeOps.removeChild(parent, el);
          }
      }
      function isUnknownElement(vnode, inVPre) {
          return (!inVPre &&
              !vnode.ns &&
              !(config.ignoredElements.length &&
                  config.ignoredElements.some(ignore => {
                      return isRegExp(ignore)
                          ? ignore.test(vnode.tag)
                          : ignore === vnode.tag;
                  })) &&
              config.isUnknownElement(vnode.tag));
      }
      let creatingElmInVPre = 0;
      function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
          if (isDef(vnode.elm) && isDef(ownerArray)) {
              // This vnode was used in a previous render!
              // now it's used as a new node, overwriting its elm would cause
              // potential patch errors down the road when it's used as an insertion
              // reference node. Instead, we clone the node on-demand before creating
              // associated DOM element for it.
              vnode = ownerArray[index] = cloneVNode(vnode);
          }
          vnode.isRootInsert = !nested; // for transition enter check
          if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
              return;
          }
          const data = vnode.data;
          const children = vnode.children;
          const tag = vnode.tag;
          if (isDef(tag)) {
              {
                  if (data && data.pre) {
                      creatingElmInVPre++;
                  }
                  if (isUnknownElement(vnode, creatingElmInVPre)) {
                      warn$2('Unknown custom element: <' +
                          tag +
                          '> - did you ' +
                          'register the component correctly? For recursive components, ' +
                          'make sure to provide the "name" option.', vnode.context);
                  }
              }
              vnode.elm = vnode.ns
                  ? nodeOps.createElementNS(vnode.ns, tag)
                  : nodeOps.createElement(tag, vnode);
              setScope(vnode);
              createChildren(vnode, children, insertedVnodeQueue);
              if (isDef(data)) {
                  invokeCreateHooks(vnode, insertedVnodeQueue);
              }
              insert(parentElm, vnode.elm, refElm);
              if (data && data.pre) {
                  creatingElmInVPre--;
              }
          }
          else if (isTrue(vnode.isComment)) {
              vnode.elm = nodeOps.createComment(vnode.text);
              insert(parentElm, vnode.elm, refElm);
          }
          else {
              vnode.elm = nodeOps.createTextNode(vnode.text);
              insert(parentElm, vnode.elm, refElm);
          }
      }
      function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
          let i = vnode.data;
          if (isDef(i)) {
              const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
              if (isDef((i = i.hook)) && isDef((i = i.init))) {
                  i(vnode, false /* hydrating */);
              }
              // after calling the init hook, if the vnode is a child component
              // it should've created a child instance and mounted it. the child
              // component also has set the placeholder vnode's elm.
              // in that case we can just return the element and be done.
              if (isDef(vnode.componentInstance)) {
                  initComponent(vnode, insertedVnodeQueue);
                  insert(parentElm, vnode.elm, refElm);
                  if (isTrue(isReactivated)) {
                      reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                  }
                  return true;
              }
          }
      }
      function initComponent(vnode, insertedVnodeQueue) {
          if (isDef(vnode.data.pendingInsert)) {
              insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
              vnode.data.pendingInsert = null;
          }
          vnode.elm = vnode.componentInstance.$el;
          if (isPatchable(vnode)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
              setScope(vnode);
          }
          else {
              // empty component root.
              // skip all element-related modules except for ref (#3455)
              registerRef(vnode);
              // make sure to invoke the insert hook
              insertedVnodeQueue.push(vnode);
          }
      }
      function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
          let i;
          // hack for #4339: a reactivated component with inner transition
          // does not trigger because the inner node's created hooks are not called
          // again. It's not ideal to involve module-specific logic in here but
          // there doesn't seem to be a better way to do it.
          let innerNode = vnode;
          while (innerNode.componentInstance) {
              innerNode = innerNode.componentInstance._vnode;
              if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                  for (i = 0; i < cbs.activate.length; ++i) {
                      cbs.activate[i](emptyNode, innerNode);
                  }
                  insertedVnodeQueue.push(innerNode);
                  break;
              }
          }
          // unlike a newly created component,
          // a reactivated keep-alive component doesn't insert itself
          insert(parentElm, vnode.elm, refElm);
      }
      function insert(parent, elm, ref) {
          if (isDef(parent)) {
              if (isDef(ref)) {
                  if (nodeOps.parentNode(ref) === parent) {
                      nodeOps.insertBefore(parent, elm, ref);
                  }
              }
              else {
                  nodeOps.appendChild(parent, elm);
              }
          }
      }
      function createChildren(vnode, children, insertedVnodeQueue) {
          if (isArray$2(children)) {
              {
                  checkDuplicateKeys(children);
              }
              for (let i = 0; i < children.length; ++i) {
                  createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
              }
          }
          else if (isPrimitive(vnode.text)) {
              nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
          }
      }
      function isPatchable(vnode) {
          while (vnode.componentInstance) {
              vnode = vnode.componentInstance._vnode;
          }
          return isDef(vnode.tag);
      }
      function invokeCreateHooks(vnode, insertedVnodeQueue) {
          for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode);
          }
          i = vnode.data.hook; // Reuse variable
          if (isDef(i)) {
              if (isDef(i.create))
                  i.create(emptyNode, vnode);
              if (isDef(i.insert))
                  insertedVnodeQueue.push(vnode);
          }
      }
      // set scope id attribute for scoped CSS.
      // this is implemented as a special case to avoid the overhead
      // of going through the normal attribute patching process.
      function setScope(vnode) {
          let i;
          if (isDef((i = vnode.fnScopeId))) {
              nodeOps.setStyleScope(vnode.elm, i);
          }
          else {
              let ancestor = vnode;
              while (ancestor) {
                  if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                      nodeOps.setStyleScope(vnode.elm, i);
                  }
                  ancestor = ancestor.parent;
              }
          }
          // for slot content they should also get the scopeId from the host instance.
          if (isDef((i = activeInstance)) &&
              i !== vnode.context &&
              i !== vnode.fnContext &&
              isDef((i = i.$options._scopeId))) {
              nodeOps.setStyleScope(vnode.elm, i);
          }
      }
      function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
          for (; startIdx <= endIdx; ++startIdx) {
              createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
          }
      }
      function invokeDestroyHook(vnode) {
          let i, j;
          const data = vnode.data;
          if (isDef(data)) {
              if (isDef((i = data.hook)) && isDef((i = i.destroy)))
                  i(vnode);
              for (i = 0; i < cbs.destroy.length; ++i)
                  cbs.destroy[i](vnode);
          }
          if (isDef((i = vnode.children))) {
              for (j = 0; j < vnode.children.length; ++j) {
                  invokeDestroyHook(vnode.children[j]);
              }
          }
      }
      function removeVnodes(vnodes, startIdx, endIdx) {
          for (; startIdx <= endIdx; ++startIdx) {
              const ch = vnodes[startIdx];
              if (isDef(ch)) {
                  if (isDef(ch.tag)) {
                      removeAndInvokeRemoveHook(ch);
                      invokeDestroyHook(ch);
                  }
                  else {
                      // Text node
                      removeNode(ch.elm);
                  }
              }
          }
      }
      function removeAndInvokeRemoveHook(vnode, rm) {
          if (isDef(rm) || isDef(vnode.data)) {
              let i;
              const listeners = cbs.remove.length + 1;
              if (isDef(rm)) {
                  // we have a recursively passed down rm callback
                  // increase the listeners count
                  rm.listeners += listeners;
              }
              else {
                  // directly removing
                  rm = createRmCb(vnode.elm, listeners);
              }
              // recursively invoke hooks on child component root node
              if (isDef((i = vnode.componentInstance)) &&
                  isDef((i = i._vnode)) &&
                  isDef(i.data)) {
                  removeAndInvokeRemoveHook(i, rm);
              }
              for (i = 0; i < cbs.remove.length; ++i) {
                  cbs.remove[i](vnode, rm);
              }
              if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                  i(vnode, rm);
              }
              else {
                  rm();
              }
          }
          else {
              removeNode(vnode.elm);
          }
      }
      function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
          let oldStartIdx = 0;
          let newStartIdx = 0;
          let oldEndIdx = oldCh.length - 1;
          let oldStartVnode = oldCh[0];
          let oldEndVnode = oldCh[oldEndIdx];
          let newEndIdx = newCh.length - 1;
          let newStartVnode = newCh[0];
          let newEndVnode = newCh[newEndIdx];
          let oldKeyToIdx, idxInOld, vnodeToMove, refElm;
          // removeOnly is a special flag used only by <transition-group>
          // to ensure removed elements stay in correct relative positions
          // during leaving transitions
          const canMove = !removeOnly;
          {
              checkDuplicateKeys(newCh);
          }
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (isUndef(oldStartVnode)) {
                  oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
              }
              else if (isUndef(oldEndVnode)) {
                  oldEndVnode = oldCh[--oldEndIdx];
              }
              else if (sameVnode(oldStartVnode, newStartVnode)) {
                  patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                  oldStartVnode = oldCh[++oldStartIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (sameVnode(oldEndVnode, newEndVnode)) {
                  patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newEndVnode)) {
                  // Vnode moved right
                  patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                  canMove &&
                      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                  oldStartVnode = oldCh[++oldStartIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldEndVnode, newStartVnode)) {
                  // Vnode moved left
                  patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                  canMove &&
                      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else {
                  if (isUndef(oldKeyToIdx))
                      oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                  idxInOld = isDef(newStartVnode.key)
                      ? oldKeyToIdx[newStartVnode.key]
                      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                  if (isUndef(idxInOld)) {
                      // New element
                      createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                  }
                  else {
                      vnodeToMove = oldCh[idxInOld];
                      if (sameVnode(vnodeToMove, newStartVnode)) {
                          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                          oldCh[idxInOld] = undefined;
                          canMove &&
                              nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                      }
                      else {
                          // same key but different element. treat as new element
                          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                      }
                  }
                  newStartVnode = newCh[++newStartIdx];
              }
          }
          if (oldStartIdx > oldEndIdx) {
              refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
              addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
          }
          else if (newStartIdx > newEndIdx) {
              removeVnodes(oldCh, oldStartIdx, oldEndIdx);
          }
      }
      function checkDuplicateKeys(children) {
          const seenKeys = {};
          for (let i = 0; i < children.length; i++) {
              const vnode = children[i];
              const key = vnode.key;
              if (isDef(key)) {
                  if (seenKeys[key]) {
                      warn$2(`Duplicate keys detected: '${key}'. This may cause an update error.`, vnode.context);
                  }
                  else {
                      seenKeys[key] = true;
                  }
              }
          }
      }
      function findIdxInOld(node, oldCh, start, end) {
          for (let i = start; i < end; i++) {
              const c = oldCh[i];
              if (isDef(c) && sameVnode(node, c))
                  return i;
          }
      }
      function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
          if (oldVnode === vnode) {
              return;
          }
          if (isDef(vnode.elm) && isDef(ownerArray)) {
              // clone reused vnode
              vnode = ownerArray[index] = cloneVNode(vnode);
          }
          const elm = (vnode.elm = oldVnode.elm);
          if (isTrue(oldVnode.isAsyncPlaceholder)) {
              if (isDef(vnode.asyncFactory.resolved)) {
                  hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
              }
              else {
                  vnode.isAsyncPlaceholder = true;
              }
              return;
          }
          // reuse element for static trees.
          // note we only do this if the vnode is cloned -
          // if the new node is not cloned it means the render functions have been
          // reset by the hot-reload-api and we need to do a proper re-render.
          if (isTrue(vnode.isStatic) &&
              isTrue(oldVnode.isStatic) &&
              vnode.key === oldVnode.key &&
              (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
              vnode.componentInstance = oldVnode.componentInstance;
              return;
          }
          let i;
          const data = vnode.data;
          if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
              i(oldVnode, vnode);
          }
          const oldCh = oldVnode.children;
          const ch = vnode.children;
          if (isDef(data) && isPatchable(vnode)) {
              for (i = 0; i < cbs.update.length; ++i)
                  cbs.update[i](oldVnode, vnode);
              if (isDef((i = data.hook)) && isDef((i = i.update)))
                  i(oldVnode, vnode);
          }
          if (isUndef(vnode.text)) {
              if (isDef(oldCh) && isDef(ch)) {
                  if (oldCh !== ch)
                      updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
              }
              else if (isDef(ch)) {
                  {
                      checkDuplicateKeys(ch);
                  }
                  if (isDef(oldVnode.text))
                      nodeOps.setTextContent(elm, '');
                  addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
              }
              else if (isDef(oldCh)) {
                  removeVnodes(oldCh, 0, oldCh.length - 1);
              }
              else if (isDef(oldVnode.text)) {
                  nodeOps.setTextContent(elm, '');
              }
          }
          else if (oldVnode.text !== vnode.text) {
              nodeOps.setTextContent(elm, vnode.text);
          }
          if (isDef(data)) {
              if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
                  i(oldVnode, vnode);
          }
      }
      function invokeInsertHook(vnode, queue, initial) {
          // delay insert hooks for component root nodes, invoke them after the
          // element is really inserted
          if (isTrue(initial) && isDef(vnode.parent)) {
              vnode.parent.data.pendingInsert = queue;
          }
          else {
              for (let i = 0; i < queue.length; ++i) {
                  queue[i].data.hook.insert(queue[i]);
              }
          }
      }
      let hydrationBailed = false;
      // list of modules that can skip create hook during hydration because they
      // are already rendered on the client or has no need for initialization
      // Note: style is excluded because it relies on initial clone for future
      // deep updates (#7063).
      const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
      // Note: this is a browser-only function so we can assume elms are DOM nodes.
      function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
          let i;
          const { tag, data, children } = vnode;
          inVPre = inVPre || (data && data.pre);
          vnode.elm = elm;
          if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
              vnode.isAsyncPlaceholder = true;
              return true;
          }
          // assert node match
          {
              if (!assertNodeMatch(elm, vnode, inVPre)) {
                  return false;
              }
          }
          if (isDef(data)) {
              if (isDef((i = data.hook)) && isDef((i = i.init)))
                  i(vnode, true /* hydrating */);
              if (isDef((i = vnode.componentInstance))) {
                  // child component. it should have hydrated its own tree.
                  initComponent(vnode, insertedVnodeQueue);
                  return true;
              }
          }
          if (isDef(tag)) {
              if (isDef(children)) {
                  // empty element, allow client to pick up and populate children
                  if (!elm.hasChildNodes()) {
                      createChildren(vnode, children, insertedVnodeQueue);
                  }
                  else {
                      // v-html and domProps: innerHTML
                      if (isDef((i = data)) &&
                          isDef((i = i.domProps)) &&
                          isDef((i = i.innerHTML))) {
                          if (i !== elm.innerHTML) {
                              /* istanbul ignore if */
                              if (typeof console !== 'undefined' &&
                                  !hydrationBailed) {
                                  hydrationBailed = true;
                                  console.warn('Parent: ', elm);
                                  console.warn('server innerHTML: ', i);
                                  console.warn('client innerHTML: ', elm.innerHTML);
                              }
                              return false;
                          }
                      }
                      else {
                          // iterate and compare children lists
                          let childrenMatch = true;
                          let childNode = elm.firstChild;
                          for (let i = 0; i < children.length; i++) {
                              if (!childNode ||
                                  !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
                                  childrenMatch = false;
                                  break;
                              }
                              childNode = childNode.nextSibling;
                          }
                          // if childNode is not null, it means the actual childNodes list is
                          // longer than the virtual children list.
                          if (!childrenMatch || childNode) {
                              /* istanbul ignore if */
                              if (typeof console !== 'undefined' &&
                                  !hydrationBailed) {
                                  hydrationBailed = true;
                                  console.warn('Parent: ', elm);
                                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                              }
                              return false;
                          }
                      }
                  }
              }
              if (isDef(data)) {
                  let fullInvoke = false;
                  for (const key in data) {
                      if (!isRenderedModule(key)) {
                          fullInvoke = true;
                          invokeCreateHooks(vnode, insertedVnodeQueue);
                          break;
                      }
                  }
                  if (!fullInvoke && data['class']) {
                      // ensure collecting deps for deep class bindings for future updates
                      traverse(data['class']);
                  }
              }
          }
          else if (elm.data !== vnode.text) {
              elm.data = vnode.text;
          }
          return true;
      }
      function assertNodeMatch(node, vnode, inVPre) {
          if (isDef(vnode.tag)) {
              return (vnode.tag.indexOf('vue-component') === 0 ||
                  (!isUnknownElement(vnode, inVPre) &&
                      vnode.tag.toLowerCase() ===
                          (node.tagName && node.tagName.toLowerCase())));
          }
          else {
              return node.nodeType === (vnode.isComment ? 8 : 3);
          }
      }
      return function patch(oldVnode, vnode, hydrating, removeOnly) {
          if (isUndef(vnode)) {
              if (isDef(oldVnode))
                  invokeDestroyHook(oldVnode);
              return;
          }
          let isInitialPatch = false;
          const insertedVnodeQueue = [];
          if (isUndef(oldVnode)) {
              // empty mount (likely as component), create new root element
              isInitialPatch = true;
              createElm(vnode, insertedVnodeQueue);
          }
          else {
              const isRealElement = isDef(oldVnode.nodeType);
              if (!isRealElement && sameVnode(oldVnode, vnode)) {
                  // patch existing root node
                  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
              }
              else {
                  if (isRealElement) {
                      // mounting to a real element
                      // check if this is server-rendered content and if we can perform
                      // a successful hydration.
                      if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                          oldVnode.removeAttribute(SSR_ATTR);
                          hydrating = true;
                      }
                      if (isTrue(hydrating)) {
                          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                              invokeInsertHook(vnode, insertedVnodeQueue, true);
                              return oldVnode;
                          }
                          else {
                              warn$2('The client-side rendered virtual DOM tree is not matching ' +
                                  'server-rendered content. This is likely caused by incorrect ' +
                                  'HTML markup, for example nesting block-level elements inside ' +
                                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                  'full client-side render.');
                          }
                      }
                      // either not server-rendered, or hydration failed.
                      // create an empty node and replace it
                      oldVnode = emptyNodeAt(oldVnode);
                  }
                  // replacing existing element
                  const oldElm = oldVnode.elm;
                  const parentElm = nodeOps.parentNode(oldElm);
                  // create new node
                  createElm(vnode, insertedVnodeQueue, 
                  // extremely rare edge case: do not insert if old element is in a
                  // leaving transition. Only happens when combining transition +
                  // keep-alive + HOCs. (#4590)
                  oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm));
                  // update parent placeholder node element, recursively
                  if (isDef(vnode.parent)) {
                      let ancestor = vnode.parent;
                      const patchable = isPatchable(vnode);
                      while (ancestor) {
                          for (let i = 0; i < cbs.destroy.length; ++i) {
                              cbs.destroy[i](ancestor);
                          }
                          ancestor.elm = vnode.elm;
                          if (patchable) {
                              for (let i = 0; i < cbs.create.length; ++i) {
                                  cbs.create[i](emptyNode, ancestor);
                              }
                              // #6513
                              // invoke insert hooks that may have been merged by create hooks.
                              // e.g. for directives that uses the "inserted" hook.
                              const insert = ancestor.data.hook.insert;
                              if (insert.merged) {
                                  // start at index 1 to avoid re-invoking component mounted hook
                                  // clone insert hooks to avoid being mutated during iteration.
                                  // e.g. for customed directives under transition group.
                                  const cloned = insert.fns.slice(1);
                                  for (let i = 0; i < cloned.length; i++) {
                                      cloned[i]();
                                  }
                              }
                          }
                          else {
                              registerRef(ancestor);
                          }
                          ancestor = ancestor.parent;
                      }
                  }
                  // destroy old node
                  if (isDef(parentElm)) {
                      removeVnodes([oldVnode], 0, 0);
                  }
                  else if (isDef(oldVnode.tag)) {
                      invokeDestroyHook(oldVnode);
                  }
              }
          }
          invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
          return vnode.elm;
      };
  }

  var directives$1 = {
      create: updateDirectives,
      update: updateDirectives,
      destroy: function unbindDirectives(vnode) {
          // @ts-expect-error emptyNode is not VNodeWithData
          updateDirectives(vnode, emptyNode);
      }
  };
  function updateDirectives(oldVnode, vnode) {
      if (oldVnode.data.directives || vnode.data.directives) {
          _update(oldVnode, vnode);
      }
  }
  function _update(oldVnode, vnode) {
      const isCreate = oldVnode === emptyNode;
      const isDestroy = vnode === emptyNode;
      const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
      const newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
      const dirsWithInsert = [];
      const dirsWithPostpatch = [];
      let key, oldDir, dir;
      for (key in newDirs) {
          oldDir = oldDirs[key];
          dir = newDirs[key];
          if (!oldDir) {
              // new directive, bind
              callHook(dir, 'bind', vnode, oldVnode);
              if (dir.def && dir.def.inserted) {
                  dirsWithInsert.push(dir);
              }
          }
          else {
              // existing directive, update
              dir.oldValue = oldDir.value;
              dir.oldArg = oldDir.arg;
              callHook(dir, 'update', vnode, oldVnode);
              if (dir.def && dir.def.componentUpdated) {
                  dirsWithPostpatch.push(dir);
              }
          }
      }
      if (dirsWithInsert.length) {
          const callInsert = () => {
              for (let i = 0; i < dirsWithInsert.length; i++) {
                  callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode);
              }
          };
          if (isCreate) {
              mergeVNodeHook(vnode, 'insert', callInsert);
          }
          else {
              callInsert();
          }
      }
      if (dirsWithPostpatch.length) {
          mergeVNodeHook(vnode, 'postpatch', () => {
              for (let i = 0; i < dirsWithPostpatch.length; i++) {
                  callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
              }
          });
      }
      if (!isCreate) {
          for (key in oldDirs) {
              if (!newDirs[key]) {
                  // no longer present, unbind
                  callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
              }
          }
      }
  }
  const emptyModifiers = Object.create(null);
  function normalizeDirectives(dirs, vm) {
      const res = Object.create(null);
      if (!dirs) {
          // $flow-disable-line
          return res;
      }
      let i, dir;
      for (i = 0; i < dirs.length; i++) {
          dir = dirs[i];
          if (!dir.modifiers) {
              // $flow-disable-line
              dir.modifiers = emptyModifiers;
          }
          res[getRawDirName(dir)] = dir;
          if (vm._setupState && vm._setupState.__sfc) {
              const setupDef = dir.def || resolveAsset(vm, '_setupState', 'v-' + dir.name);
              if (typeof setupDef === 'function') {
                  dir.def = {
                      bind: setupDef,
                      update: setupDef,
                  };
              }
              else {
                  dir.def = setupDef;
              }
          }
          dir.def = dir.def || resolveAsset(vm.$options, 'directives', dir.name, true);
      }
      // $flow-disable-line
      return res;
  }
  function getRawDirName(dir) {
      return (dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join('.')}`);
  }
  function callHook(dir, hook, vnode, oldVnode, isDestroy) {
      const fn = dir.def && dir.def[hook];
      if (fn) {
          try {
              fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
          }
          catch (e) {
              handleError$1(e, vnode.context, `directive ${dir.name} ${hook} hook`);
          }
      }
  }

  var baseModules = [ref, directives$1];

  function updateAttrs(oldVnode, vnode) {
      const opts = vnode.componentOptions;
      if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
          return;
      }
      if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
          return;
      }
      let key, cur, old;
      const elm = vnode.elm;
      const oldAttrs = oldVnode.data.attrs || {};
      let attrs = vnode.data.attrs || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(attrs.__ob__) || isTrue(attrs._v_attr_proxy)) {
          attrs = vnode.data.attrs = extend$1({}, attrs);
      }
      for (key in attrs) {
          cur = attrs[key];
          old = oldAttrs[key];
          if (old !== cur) {
              setAttr(elm, key, cur, vnode.data.pre);
          }
      }
      // #4391: in IE9, setting type can reset value for input[type=radio]
      // #6666: IE/Edge forces progress value down to 1 before setting a max
      /* istanbul ignore if */
      if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
          setAttr(elm, 'value', attrs.value);
      }
      for (key in oldAttrs) {
          if (isUndef(attrs[key])) {
              if (isXlink(key)) {
                  elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
              }
              else if (!isEnumeratedAttr(key)) {
                  elm.removeAttribute(key);
              }
          }
      }
  }
  function setAttr(el, key, value, isInPre) {
      if (isInPre || el.tagName.indexOf('-') > -1) {
          baseSetAttr(el, key, value);
      }
      else if (isBooleanAttr(key)) {
          // set attribute for blank value
          // e.g. <option disabled>Select one</option>
          if (isFalsyAttrValue(value)) {
              el.removeAttribute(key);
          }
          else {
              // technically allowfullscreen is a boolean attribute for <iframe>,
              // but Flash expects a value of "true" when used on <embed> tag
              value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
              el.setAttribute(key, value);
          }
      }
      else if (isEnumeratedAttr(key)) {
          el.setAttribute(key, convertEnumeratedValue(key, value));
      }
      else if (isXlink(key)) {
          if (isFalsyAttrValue(value)) {
              el.removeAttributeNS(xlinkNS, getXlinkProp(key));
          }
          else {
              el.setAttributeNS(xlinkNS, key, value);
          }
      }
      else {
          baseSetAttr(el, key, value);
      }
  }
  function baseSetAttr(el, key, value) {
      if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
      }
      else {
          // #7138: IE10 & 11 fires input event when setting placeholder on
          // <textarea>... block the first input event and remove the blocker
          // immediately.
          /* istanbul ignore if */
          if (isIE &&
              !isIE9 &&
              el.tagName === 'TEXTAREA' &&
              key === 'placeholder' &&
              value !== '' &&
              !el.__ieph) {
              const blocker = e => {
                  e.stopImmediatePropagation();
                  el.removeEventListener('input', blocker);
              };
              el.addEventListener('input', blocker);
              // $flow-disable-line
              el.__ieph = true; /* IE placeholder patched */
          }
          el.setAttribute(key, value);
      }
  }
  var attrs = {
      create: updateAttrs,
      update: updateAttrs
  };

  function updateClass(oldVnode, vnode) {
      const el = vnode.elm;
      const data = vnode.data;
      const oldData = oldVnode.data;
      if (isUndef(data.staticClass) &&
          isUndef(data.class) &&
          (isUndef(oldData) ||
              (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
          return;
      }
      let cls = genClassForVnode(vnode);
      // handle transition classes
      const transitionClass = el._transitionClasses;
      if (isDef(transitionClass)) {
          cls = concat(cls, stringifyClass(transitionClass));
      }
      // set the class
      if (cls !== el._prevClass) {
          el.setAttribute('class', cls);
          el._prevClass = cls;
      }
  }
  var klass$1 = {
      create: updateClass,
      update: updateClass
  };

  const validDivisionCharRE = /[\w).+\-_$\]]/;
  function parseFilters(exp) {
      let inSingle = false;
      let inDouble = false;
      let inTemplateString = false;
      let inRegex = false;
      let curly = 0;
      let square = 0;
      let paren = 0;
      let lastFilterIndex = 0;
      let c, prev, i, expression, filters;
      for (i = 0; i < exp.length; i++) {
          prev = c;
          c = exp.charCodeAt(i);
          if (inSingle) {
              if (c === 0x27 && prev !== 0x5c)
                  inSingle = false;
          }
          else if (inDouble) {
              if (c === 0x22 && prev !== 0x5c)
                  inDouble = false;
          }
          else if (inTemplateString) {
              if (c === 0x60 && prev !== 0x5c)
                  inTemplateString = false;
          }
          else if (inRegex) {
              if (c === 0x2f && prev !== 0x5c)
                  inRegex = false;
          }
          else if (c === 0x7c && // pipe
              exp.charCodeAt(i + 1) !== 0x7c &&
              exp.charCodeAt(i - 1) !== 0x7c &&
              !curly &&
              !square &&
              !paren) {
              if (expression === undefined) {
                  // first filter, end of expression
                  lastFilterIndex = i + 1;
                  expression = exp.slice(0, i).trim();
              }
              else {
                  pushFilter();
              }
          }
          else {
              switch (c) {
                  case 0x22:
                      inDouble = true;
                      break; // "
                  case 0x27:
                      inSingle = true;
                      break; // '
                  case 0x60:
                      inTemplateString = true;
                      break; // `
                  case 0x28:
                      paren++;
                      break; // (
                  case 0x29:
                      paren--;
                      break; // )
                  case 0x5b:
                      square++;
                      break; // [
                  case 0x5d:
                      square--;
                      break; // ]
                  case 0x7b:
                      curly++;
                      break; // {
                  case 0x7d:
                      curly--;
                      break; // }
              }
              if (c === 0x2f) {
                  // /
                  let j = i - 1;
                  let p;
                  // find first non-whitespace prev char
                  for (; j >= 0; j--) {
                      p = exp.charAt(j);
                      if (p !== ' ')
                          break;
                  }
                  if (!p || !validDivisionCharRE.test(p)) {
                      inRegex = true;
                  }
              }
          }
      }
      if (expression === undefined) {
          expression = exp.slice(0, i).trim();
      }
      else if (lastFilterIndex !== 0) {
          pushFilter();
      }
      function pushFilter() {
          (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
          lastFilterIndex = i + 1;
      }
      if (filters) {
          for (i = 0; i < filters.length; i++) {
              expression = wrapFilter(expression, filters[i]);
          }
      }
      return expression;
  }
  function wrapFilter(exp, filter) {
      const i = filter.indexOf('(');
      if (i < 0) {
          // _f: resolveFilter
          return `_f("${filter}")(${exp})`;
      }
      else {
          const name = filter.slice(0, i);
          const args = filter.slice(i + 1);
          return `_f("${name}")(${exp}${args !== ')' ? ',' + args : args}`;
      }
  }

  /* eslint-disable no-unused-vars */
  function baseWarn(msg, range) {
      console.error(`[Vue compiler]: ${msg}`);
  }
  /* eslint-enable no-unused-vars */
  function pluckModuleFunction(modules, key) {
      return modules ? modules.map(m => m[key]).filter(_ => _) : [];
  }
  function addProp(el, name, value, range, dynamic) {
      (el.props || (el.props = [])).push(rangeSetItem({ name, value, dynamic }, range));
      el.plain = false;
  }
  function addAttr(el, name, value, range, dynamic) {
      const attrs = dynamic
          ? el.dynamicAttrs || (el.dynamicAttrs = [])
          : el.attrs || (el.attrs = []);
      attrs.push(rangeSetItem({ name, value, dynamic }, range));
      el.plain = false;
  }
  // add a raw attr (use this in preTransforms)
  function addRawAttr(el, name, value, range) {
      el.attrsMap[name] = value;
      el.attrsList.push(rangeSetItem({ name, value }, range));
  }
  function addDirective(el, name, rawName, value, arg, isDynamicArg, modifiers, range) {
      (el.directives || (el.directives = [])).push(rangeSetItem({
          name,
          rawName,
          value,
          arg,
          isDynamicArg,
          modifiers
      }, range));
      el.plain = false;
  }
  function prependModifierMarker(symbol, name, dynamic) {
      return dynamic ? `_p(${name},"${symbol}")` : symbol + name; // mark the event as captured
  }
  function addHandler(el, name, value, modifiers, important, warn, range, dynamic) {
      modifiers = modifiers || emptyObject;
      // warn prevent and passive modifier
      /* istanbul ignore if */
      if (warn && modifiers.prevent && modifiers.passive) {
          warn("passive and prevent can't be used together. " +
              "Passive handler can't prevent default event.", range);
      }
      // normalize click.right and click.middle since they don't actually fire
      // this is technically browser-specific, but at least for now browsers are
      // the only target envs that have right/middle clicks.
      if (modifiers.right) {
          if (dynamic) {
              name = `(${name})==='click'?'contextmenu':(${name})`;
          }
          else if (name === 'click') {
              name = 'contextmenu';
              delete modifiers.right;
          }
      }
      else if (modifiers.middle) {
          if (dynamic) {
              name = `(${name})==='click'?'mouseup':(${name})`;
          }
          else if (name === 'click') {
              name = 'mouseup';
          }
      }
      // check capture modifier
      if (modifiers.capture) {
          delete modifiers.capture;
          name = prependModifierMarker('!', name, dynamic);
      }
      if (modifiers.once) {
          delete modifiers.once;
          name = prependModifierMarker('~', name, dynamic);
      }
      /* istanbul ignore if */
      if (modifiers.passive) {
          delete modifiers.passive;
          name = prependModifierMarker('&', name, dynamic);
      }
      let events;
      if (modifiers.native) {
          delete modifiers.native;
          events = el.nativeEvents || (el.nativeEvents = {});
      }
      else {
          events = el.events || (el.events = {});
      }
      const newHandler = rangeSetItem({ value: value.trim(), dynamic }, range);
      if (modifiers !== emptyObject) {
          newHandler.modifiers = modifiers;
      }
      const handlers = events[name];
      /* istanbul ignore if */
      if (Array.isArray(handlers)) {
          important ? handlers.unshift(newHandler) : handlers.push(newHandler);
      }
      else if (handlers) {
          events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
      }
      else {
          events[name] = newHandler;
      }
      el.plain = false;
  }
  function getRawBindingAttr(el, name) {
      return (el.rawAttrsMap[':' + name] ||
          el.rawAttrsMap['v-bind:' + name] ||
          el.rawAttrsMap[name]);
  }
  function getBindingAttr(el, name, getStatic) {
      const dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
      if (dynamicValue != null) {
          return parseFilters(dynamicValue);
      }
      else if (getStatic !== false) {
          const staticValue = getAndRemoveAttr(el, name);
          if (staticValue != null) {
              return JSON.stringify(staticValue);
          }
      }
  }
  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr(el, name, removeFromMap) {
      let val;
      if ((val = el.attrsMap[name]) != null) {
          const list = el.attrsList;
          for (let i = 0, l = list.length; i < l; i++) {
              if (list[i].name === name) {
                  list.splice(i, 1);
                  break;
              }
          }
      }
      if (removeFromMap) {
          delete el.attrsMap[name];
      }
      return val;
  }
  function getAndRemoveAttrByRegex(el, name) {
      const list = el.attrsList;
      for (let i = 0, l = list.length; i < l; i++) {
          const attr = list[i];
          if (name.test(attr.name)) {
              list.splice(i, 1);
              return attr;
          }
      }
  }
  function rangeSetItem(item, range) {
      if (range) {
          if (range.start != null) {
              item.start = range.start;
          }
          if (range.end != null) {
              item.end = range.end;
          }
      }
      return item;
  }

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(el, value, modifiers) {
      const { number, trim } = modifiers || {};
      const baseValueExpression = '$$v';
      let valueExpression = baseValueExpression;
      if (trim) {
          valueExpression =
              `(typeof ${baseValueExpression} === 'string'` +
                  `? ${baseValueExpression}.trim()` +
                  `: ${baseValueExpression})`;
      }
      if (number) {
          valueExpression = `_n(${valueExpression})`;
      }
      const assignment = genAssignmentCode(value, valueExpression);
      el.model = {
          value: `(${value})`,
          expression: JSON.stringify(value),
          callback: `function (${baseValueExpression}) {${assignment}}`
      };
  }
  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(value, assignment) {
      const res = parseModel(value);
      if (res.key === null) {
          return `${value}=${assignment}`;
      }
      else {
          return `$set(${res.exp}, ${res.key}, ${assignment})`;
      }
  }
  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */
  let len, str, chr, index, expressionPos, expressionEndPos;
  function parseModel(val) {
      // Fix https://github.com/vuejs/vue/pull/7730
      // allow v-model="obj.val " (trailing whitespace)
      val = val.trim();
      len = val.length;
      if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
          index = val.lastIndexOf('.');
          if (index > -1) {
              return {
                  exp: val.slice(0, index),
                  key: '"' + val.slice(index + 1) + '"'
              };
          }
          else {
              return {
                  exp: val,
                  key: null
              };
          }
      }
      str = val;
      index = expressionPos = expressionEndPos = 0;
      while (!eof()) {
          chr = next();
          /* istanbul ignore if */
          if (isStringStart(chr)) {
              parseString(chr);
          }
          else if (chr === 0x5b) {
              parseBracket(chr);
          }
      }
      return {
          exp: val.slice(0, expressionPos),
          key: val.slice(expressionPos + 1, expressionEndPos)
      };
  }
  function next() {
      return str.charCodeAt(++index);
  }
  function eof() {
      return index >= len;
  }
  function isStringStart(chr) {
      return chr === 0x22 || chr === 0x27;
  }
  function parseBracket(chr) {
      let inBracket = 1;
      expressionPos = index;
      while (!eof()) {
          chr = next();
          if (isStringStart(chr)) {
              parseString(chr);
              continue;
          }
          if (chr === 0x5b)
              inBracket++;
          if (chr === 0x5d)
              inBracket--;
          if (inBracket === 0) {
              expressionEndPos = index;
              break;
          }
      }
  }
  function parseString(chr) {
      const stringQuote = chr;
      while (!eof()) {
          chr = next();
          if (chr === stringQuote) {
              break;
          }
      }
  }

  let warn$1;
  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  const RANGE_TOKEN = '__r';
  const CHECKBOX_RADIO_TOKEN = '__c';
  function model$1(el, dir, _warn) {
      warn$1 = _warn;
      const value = dir.value;
      const modifiers = dir.modifiers;
      const tag = el.tag;
      const type = el.attrsMap.type;
      {
          // inputs with type="file" are read only and setting the input's
          // value will throw an error.
          if (tag === 'input' && type === 'file') {
              warn$1(`<${el.tag} v-model="${value}" type="file">:\n` +
                  `File inputs are read only. Use a v-on:change listener instead.`, el.rawAttrsMap['v-model']);
          }
      }
      if (el.component) {
          genComponentModel(el, value, modifiers);
          // component v-model doesn't need extra runtime
          return false;
      }
      else if (tag === 'select') {
          genSelect(el, value, modifiers);
      }
      else if (tag === 'input' && type === 'checkbox') {
          genCheckboxModel(el, value, modifiers);
      }
      else if (tag === 'input' && type === 'radio') {
          genRadioModel(el, value, modifiers);
      }
      else if (tag === 'input' || tag === 'textarea') {
          genDefaultModel(el, value, modifiers);
      }
      else if (!config.isReservedTag(tag)) {
          genComponentModel(el, value, modifiers);
          // component v-model doesn't need extra runtime
          return false;
      }
      else {
          warn$1(`<${el.tag} v-model="${value}">: ` +
              `v-model is not supported on this element type. ` +
              "If you are working with contenteditable, it's recommended to " +
              'wrap a library dedicated for that purpose inside a custom component.', el.rawAttrsMap['v-model']);
      }
      // ensure runtime directive metadata
      return true;
  }
  function genCheckboxModel(el, value, modifiers) {
      const number = modifiers && modifiers.number;
      const valueBinding = getBindingAttr(el, 'value') || 'null';
      const trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
      const falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
      addProp(el, 'checked', `Array.isArray(${value})` +
          `?_i(${value},${valueBinding})>-1` +
          (trueValueBinding === 'true'
              ? `:(${value})`
              : `:_q(${value},${trueValueBinding})`));
      addHandler(el, 'change', `var $$a=${value},` +
          '$$el=$event.target,' +
          `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` +
          'if(Array.isArray($$a)){' +
          `var $$v=${number ? '_n(' + valueBinding + ')' : valueBinding},` +
          '$$i=_i($$a,$$v);' +
          `if($$el.checked){$$i<0&&(${genAssignmentCode(value, '$$a.concat([$$v])')})}` +
          `else{$$i>-1&&(${genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')})}` +
          `}else{${genAssignmentCode(value, '$$c')}}`, null, true);
  }
  function genRadioModel(el, value, modifiers) {
      const number = modifiers && modifiers.number;
      let valueBinding = getBindingAttr(el, 'value') || 'null';
      valueBinding = number ? `_n(${valueBinding})` : valueBinding;
      addProp(el, 'checked', `_q(${value},${valueBinding})`);
      addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }
  function genSelect(el, value, modifiers) {
      const number = modifiers && modifiers.number;
      const selectedVal = `Array.prototype.filter` +
          `.call($event.target.options,function(o){return o.selected})` +
          `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
          `return ${number ? '_n(val)' : 'val'}})`;
      const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
      let code = `var $$selectedVal = ${selectedVal};`;
      code = `${code} ${genAssignmentCode(value, assignment)}`;
      addHandler(el, 'change', code, null, true);
  }
  function genDefaultModel(el, value, modifiers) {
      const type = el.attrsMap.type;
      // warn if v-bind:value conflicts with v-model
      // except for inputs with v-bind:type
      {
          const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
          const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
          if (value && !typeBinding) {
              const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
              warn$1(`${binding}="${value}" conflicts with v-model on the same element ` +
                  'because the latter already expands to a value binding internally', el.rawAttrsMap[binding]);
          }
      }
      const { lazy, number, trim } = modifiers || {};
      const needCompositionGuard = !lazy && type !== 'range';
      const event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';
      let valueExpression = '$event.target.value';
      if (trim) {
          valueExpression = `$event.target.value.trim()`;
      }
      if (number) {
          valueExpression = `_n(${valueExpression})`;
      }
      let code = genAssignmentCode(value, valueExpression);
      if (needCompositionGuard) {
          code = `if($event.target.composing)return;${code}`;
      }
      addProp(el, 'value', `(${value})`);
      addHandler(el, event, code, null, true);
      if (trim || number) {
          addHandler(el, 'blur', '$forceUpdate()');
      }
  }

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents(on) {
      /* istanbul ignore if */
      if (isDef(on[RANGE_TOKEN])) {
          // IE input[type=range] only supports `change` event
          const event = isIE ? 'change' : 'input';
          on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
          delete on[RANGE_TOKEN];
      }
      // This was originally intended to fix #4521 but no longer necessary
      // after 2.5. Keeping it for backwards compat with generated code from < 2.4
      /* istanbul ignore if */
      if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
          on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
          delete on[CHECKBOX_RADIO_TOKEN];
      }
  }
  let target;
  function createOnceHandler(event, handler, capture) {
      const _target = target; // save current target element in closure
      return function onceHandler() {
          const res = handler.apply(null, arguments);
          if (res !== null) {
              remove(event, onceHandler, capture, _target);
          }
      };
  }
  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  const useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
  function add(name, handler, capture, passive) {
      // async edge case #6566: inner click event triggers patch, event handler
      // attached to outer element during patch, and triggered again. This
      // happens because browsers fire microtask ticks between event propagation.
      // the solution is simple: we save the timestamp when a handler is attached,
      // and the handler would only fire if the event passed to it was fired
      // AFTER it was attached.
      if (useMicrotaskFix) {
          const attachedTimestamp = currentFlushTimestamp;
          const original = handler;
          //@ts-expect-error
          handler = original._wrapper = function (e) {
              if (
              // no bubbling, should always fire.
              // this is just a safety net in case event.timeStamp is unreliable in
              // certain weird environments...
              e.target === e.currentTarget ||
                  // event is fired after handler attachment
                  e.timeStamp >= attachedTimestamp ||
                  // bail for environments that have buggy event.timeStamp implementations
                  // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                  // #9681 QtWebEngine event.timeStamp is negative value
                  e.timeStamp <= 0 ||
                  // #9448 bail if event is fired in another document in a multi-page
                  // electron/nw.js app, since event.timeStamp will be using a different
                  // starting reference
                  e.target.ownerDocument !== document) {
                  return original.apply(this, arguments);
              }
          };
      }
      target.addEventListener(name, handler, supportsPassive ? { capture, passive } : capture);
  }
  function remove(name, handler, capture, _target) {
      (_target || target).removeEventListener(name, 
      //@ts-expect-error
      handler._wrapper || handler, capture);
  }
  function updateDOMListeners(oldVnode, vnode) {
      if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
          return;
      }
      const on = vnode.data.on || {};
      const oldOn = oldVnode.data.on || {};
      // vnode is empty when removing all listeners,
      // and use old vnode dom element
      target = vnode.elm || oldVnode.elm;
      normalizeEvents(on);
      updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
      target = undefined;
  }
  var events = {
      create: updateDOMListeners,
      update: updateDOMListeners,
      // @ts-expect-error emptyNode has actually data
      destroy: (vnode) => updateDOMListeners(vnode, emptyNode)
  };

  let svgContainer;
  function updateDOMProps(oldVnode, vnode) {
      if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
          return;
      }
      let key, cur;
      const elm = vnode.elm;
      const oldProps = oldVnode.data.domProps || {};
      let props = vnode.data.domProps || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(props.__ob__) || isTrue(props._v_attr_proxy)) {
          props = vnode.data.domProps = extend$1({}, props);
      }
      for (key in oldProps) {
          if (!(key in props)) {
              elm[key] = '';
          }
      }
      for (key in props) {
          cur = props[key];
          // ignore children if the node has textContent or innerHTML,
          // as these will throw away existing DOM nodes and cause removal errors
          // on subsequent patches (#3360)
          if (key === 'textContent' || key === 'innerHTML') {
              if (vnode.children)
                  vnode.children.length = 0;
              if (cur === oldProps[key])
                  continue;
              // #6601 work around Chrome version <= 55 bug where single textNode
              // replaced by innerHTML/textContent retains its parentNode property
              if (elm.childNodes.length === 1) {
                  elm.removeChild(elm.childNodes[0]);
              }
          }
          if (key === 'value' && elm.tagName !== 'PROGRESS') {
              // store value as _value as well since
              // non-string values will be stringified
              elm._value = cur;
              // avoid resetting cursor position when value is the same
              const strCur = isUndef(cur) ? '' : String(cur);
              if (shouldUpdateValue(elm, strCur)) {
                  elm.value = strCur;
              }
          }
          else if (key === 'innerHTML' &&
              isSVG(elm.tagName) &&
              isUndef(elm.innerHTML)) {
              // IE doesn't support innerHTML for SVG elements
              svgContainer = svgContainer || document.createElement('div');
              svgContainer.innerHTML = `<svg>${cur}</svg>`;
              const svg = svgContainer.firstChild;
              while (elm.firstChild) {
                  elm.removeChild(elm.firstChild);
              }
              while (svg.firstChild) {
                  elm.appendChild(svg.firstChild);
              }
          }
          else if (
          // skip the update if old and new VDOM state is the same.
          // `value` is handled separately because the DOM value may be temporarily
          // out of sync with VDOM state due to focus, composition and modifiers.
          // This  #4521 by skipping the unnecessary `checked` update.
          cur !== oldProps[key]) {
              // some property updates can throw
              // e.g. `value` on <progress> w/ non-finite value
              try {
                  elm[key] = cur;
              }
              catch (e) { }
          }
      }
  }
  function shouldUpdateValue(elm, checkVal) {
      return (
      //@ts-expect-error
      !elm.composing &&
          (elm.tagName === 'OPTION' ||
              isNotInFocusAndDirty(elm, checkVal) ||
              isDirtyWithModifiers(elm, checkVal)));
  }
  function isNotInFocusAndDirty(elm, checkVal) {
      // return true when textbox (.number and .trim) loses focus and its value is
      // not equal to the updated value
      let notInFocus = true;
      // #6157
      // work around IE bug when accessing document.activeElement in an iframe
      try {
          notInFocus = document.activeElement !== elm;
      }
      catch (e) { }
      return notInFocus && elm.value !== checkVal;
  }
  function isDirtyWithModifiers(elm, newVal) {
      const value = elm.value;
      const modifiers = elm._vModifiers; // injected by v-model runtime
      if (isDef(modifiers)) {
          if (modifiers.number) {
              return toNumber(value) !== toNumber(newVal);
          }
          if (modifiers.trim) {
              return value.trim() !== newVal.trim();
          }
      }
      return value !== newVal;
  }
  var domProps = {
      create: updateDOMProps,
      update: updateDOMProps
  };

  const parseStyleText = cached(function (cssText) {
      const res = {};
      const listDelimiter = /;(?![^(]*\))/g;
      const propertyDelimiter = /:(.+)/;
      cssText.split(listDelimiter).forEach(function (item) {
          if (item) {
              const tmp = item.split(propertyDelimiter);
              tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
          }
      });
      return res;
  });
  // merge static and dynamic style data on the same vnode
  function normalizeStyleData(data) {
      const style = normalizeStyleBinding(data.style);
      // static style is pre-processed into an object during compilation
      // and is always a fresh object, so it's safe to merge into it
      return data.staticStyle ? extend$1(data.staticStyle, style) : style;
  }
  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
      if (Array.isArray(bindingStyle)) {
          return toObject(bindingStyle);
      }
      if (typeof bindingStyle === 'string') {
          return parseStyleText(bindingStyle);
      }
      return bindingStyle;
  }
  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle(vnode, checkChild) {
      const res = {};
      let styleData;
      if (checkChild) {
          let childNode = vnode;
          while (childNode.componentInstance) {
              childNode = childNode.componentInstance._vnode;
              if (childNode &&
                  childNode.data &&
                  (styleData = normalizeStyleData(childNode.data))) {
                  extend$1(res, styleData);
              }
          }
      }
      if ((styleData = normalizeStyleData(vnode.data))) {
          extend$1(res, styleData);
      }
      let parentNode = vnode;
      // @ts-expect-error parentNode.parent not VNodeWithData
      while ((parentNode = parentNode.parent)) {
          if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
              extend$1(res, styleData);
          }
      }
      return res;
  }

  const cssVarRE = /^--/;
  const importantRE = /\s*!important$/;
  const setProp = (el, name, val) => {
      /* istanbul ignore if */
      if (cssVarRE.test(name)) {
          el.style.setProperty(name, val);
      }
      else if (importantRE.test(val)) {
          el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
      }
      else {
          const normalizedName = normalize(name);
          if (Array.isArray(val)) {
              // Support values array created by autoprefixer, e.g.
              // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
              // Set them one by one, and the browser will only set those it can recognize
              for (let i = 0, len = val.length; i < len; i++) {
                  el.style[normalizedName] = val[i];
              }
          }
          else {
              el.style[normalizedName] = val;
          }
      }
  };
  const vendorNames = ['Webkit', 'Moz', 'ms'];
  let emptyStyle;
  const normalize = cached(function (prop) {
      emptyStyle = emptyStyle || document.createElement('div').style;
      prop = camelize(prop);
      if (prop !== 'filter' && prop in emptyStyle) {
          return prop;
      }
      const capName = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (let i = 0; i < vendorNames.length; i++) {
          const name = vendorNames[i] + capName;
          if (name in emptyStyle) {
              return name;
          }
      }
  });
  function updateStyle(oldVnode, vnode) {
      const data = vnode.data;
      const oldData = oldVnode.data;
      if (isUndef(data.staticStyle) &&
          isUndef(data.style) &&
          isUndef(oldData.staticStyle) &&
          isUndef(oldData.style)) {
          return;
      }
      let cur, name;
      const el = vnode.elm;
      const oldStaticStyle = oldData.staticStyle;
      const oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
      // if static style exists, stylebinding already merged into it when doing normalizeStyleData
      const oldStyle = oldStaticStyle || oldStyleBinding;
      const style = normalizeStyleBinding(vnode.data.style) || {};
      // store normalized style under a different key for next diff
      // make sure to clone it if it's reactive, since the user likely wants
      // to mutate it.
      vnode.data.normalizedStyle = isDef(style.__ob__) ? extend$1({}, style) : style;
      const newStyle = getStyle(vnode, true);
      for (name in oldStyle) {
          if (isUndef(newStyle[name])) {
              setProp(el, name, '');
          }
      }
      for (name in newStyle) {
          cur = newStyle[name];
          // ie9 setting to null has no effect, must use empty string
          setProp(el, name, cur == null ? '' : cur);
      }
  }
  var style$1 = {
      create: updateStyle,
      update: updateStyle
  };

  const whitespaceRE$1 = /\s+/;
  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
          return;
      }
      /* istanbul ignore else */
      if (el.classList) {
          if (cls.indexOf(' ') > -1) {
              cls.split(whitespaceRE$1).forEach(c => el.classList.add(c));
          }
          else {
              el.classList.add(cls);
          }
      }
      else {
          const cur = ` ${el.getAttribute('class') || ''} `;
          if (cur.indexOf(' ' + cls + ' ') < 0) {
              el.setAttribute('class', (cur + cls).trim());
          }
      }
  }
  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
          return;
      }
      /* istanbul ignore else */
      if (el.classList) {
          if (cls.indexOf(' ') > -1) {
              cls.split(whitespaceRE$1).forEach(c => el.classList.remove(c));
          }
          else {
              el.classList.remove(cls);
          }
          if (!el.classList.length) {
              el.removeAttribute('class');
          }
      }
      else {
          let cur = ` ${el.getAttribute('class') || ''} `;
          const tar = ' ' + cls + ' ';
          while (cur.indexOf(tar) >= 0) {
              cur = cur.replace(tar, ' ');
          }
          cur = cur.trim();
          if (cur) {
              el.setAttribute('class', cur);
          }
          else {
              el.removeAttribute('class');
          }
      }
  }

  function resolveTransition(def) {
      if (!def) {
          return;
      }
      /* istanbul ignore else */
      if (typeof def === 'object') {
          const res = {};
          if (def.css !== false) {
              extend$1(res, autoCssTransition(def.name || 'v'));
          }
          extend$1(res, def);
          return res;
      }
      else if (typeof def === 'string') {
          return autoCssTransition(def);
      }
  }
  const autoCssTransition = cached(name => {
      return {
          enterClass: `${name}-enter`,
          enterToClass: `${name}-enter-to`,
          enterActiveClass: `${name}-enter-active`,
          leaveClass: `${name}-leave`,
          leaveToClass: `${name}-leave-to`,
          leaveActiveClass: `${name}-leave-active`
      };
  });
  const hasTransition = inBrowser && !isIE9;
  const TRANSITION = 'transition';
  const ANIMATION = 'animation';
  // Transition property/event sniffing
  let transitionProp = 'transition';
  let transitionEndEvent = 'transitionend';
  let animationProp = 'animation';
  let animationEndEvent = 'animationend';
  if (hasTransition) {
      /* istanbul ignore if */
      if (window.ontransitionend === undefined &&
          window.onwebkittransitionend !== undefined) {
          transitionProp = 'WebkitTransition';
          transitionEndEvent = 'webkitTransitionEnd';
      }
      if (window.onanimationend === undefined &&
          window.onwebkitanimationend !== undefined) {
          animationProp = 'WebkitAnimation';
          animationEndEvent = 'webkitAnimationEnd';
      }
  }
  // binding to window is necessary to make hot reload work in IE in strict mode
  const raf = inBrowser
      ? window.requestAnimationFrame
          ? window.requestAnimationFrame.bind(window)
          : setTimeout
      : /* istanbul ignore next */ /* istanbul ignore next */ fn => fn();
  function nextFrame(fn) {
      raf(() => {
          // @ts-expect-error
          raf(fn);
      });
  }
  function addTransitionClass(el, cls) {
      const transitionClasses = el._transitionClasses || (el._transitionClasses = []);
      if (transitionClasses.indexOf(cls) < 0) {
          transitionClasses.push(cls);
          addClass(el, cls);
      }
  }
  function removeTransitionClass(el, cls) {
      if (el._transitionClasses) {
          remove$2(el._transitionClasses, cls);
      }
      removeClass(el, cls);
  }
  function whenTransitionEnds(el, expectedType, cb) {
      const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
      if (!type)
          return cb();
      const event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
      let ended = 0;
      const end = () => {
          el.removeEventListener(event, onEnd);
          cb();
      };
      const onEnd = e => {
          if (e.target === el) {
              if (++ended >= propCount) {
                  end();
              }
          }
      };
      setTimeout(() => {
          if (ended < propCount) {
              end();
          }
      }, timeout + 1);
      el.addEventListener(event, onEnd);
  }
  const transformRE = /\b(transform|all)(,|$)/;
  function getTransitionInfo(el, expectedType) {
      const styles = window.getComputedStyle(el);
      // JSDOM may return undefined for transition properties
      const transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
      const transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
      const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      const animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
      const animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
      const animationTimeout = getTimeout(animationDelays, animationDurations);
      let type;
      let timeout = 0;
      let propCount = 0;
      /* istanbul ignore if */
      if (expectedType === TRANSITION) {
          if (transitionTimeout > 0) {
              type = TRANSITION;
              timeout = transitionTimeout;
              propCount = transitionDurations.length;
          }
      }
      else if (expectedType === ANIMATION) {
          if (animationTimeout > 0) {
              type = ANIMATION;
              timeout = animationTimeout;
              propCount = animationDurations.length;
          }
      }
      else {
          timeout = Math.max(transitionTimeout, animationTimeout);
          type =
              timeout > 0
                  ? transitionTimeout > animationTimeout
                      ? TRANSITION
                      : ANIMATION
                  : null;
          propCount = type
              ? type === TRANSITION
                  ? transitionDurations.length
                  : animationDurations.length
              : 0;
      }
      const hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
      return {
          type,
          timeout,
          propCount,
          hasTransform
      };
  }
  function getTimeout(delays, durations) {
      /* istanbul ignore next */
      while (delays.length < durations.length) {
          delays = delays.concat(delays);
      }
      return Math.max.apply(null, durations.map((d, i) => {
          return toMs(d) + toMs(delays[i]);
      }));
  }
  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs(s) {
      return Number(s.slice(0, -1).replace(',', '.')) * 1000;
  }

  function enter(vnode, toggleDisplay) {
      const el = vnode.elm;
      // call leave callback now
      if (isDef(el._leaveCb)) {
          el._leaveCb.cancelled = true;
          el._leaveCb();
      }
      const data = resolveTransition(vnode.data.transition);
      if (isUndef(data)) {
          return;
      }
      /* istanbul ignore if */
      if (isDef(el._enterCb) || el.nodeType !== 1) {
          return;
      }
      const { css, type, enterClass, enterToClass, enterActiveClass, appearClass, appearToClass, appearActiveClass, beforeEnter, enter, afterEnter, enterCancelled, beforeAppear, appear, afterAppear, appearCancelled, duration } = data;
      // activeInstance will always be the <transition> component managing this
      // transition. One edge case to check is when the <transition> is placed
      // as the root node of a child component. In that case we need to check
      // <transition>'s parent for appear check.
      let context = activeInstance;
      let transitionNode = activeInstance.$vnode;
      while (transitionNode && transitionNode.parent) {
          context = transitionNode.context;
          transitionNode = transitionNode.parent;
      }
      const isAppear = !context._isMounted || !vnode.isRootInsert;
      if (isAppear && !appear && appear !== '') {
          return;
      }
      const startClass = isAppear && appearClass ? appearClass : enterClass;
      const activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
      const toClass = isAppear && appearToClass ? appearToClass : enterToClass;
      const beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
      const enterHook = isAppear ? (isFunction$2(appear) ? appear : enter) : enter;
      const afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
      const enterCancelledHook = isAppear
          ? appearCancelled || enterCancelled
          : enterCancelled;
      const explicitEnterDuration = toNumber(isObject$2(duration) ? duration.enter : duration);
      if (explicitEnterDuration != null) {
          checkDuration(explicitEnterDuration, 'enter', vnode);
      }
      const expectsCSS = css !== false && !isIE9;
      const userWantsControl = getHookArgumentsLength(enterHook);
      const cb = (el._enterCb = once(() => {
          if (expectsCSS) {
              removeTransitionClass(el, toClass);
              removeTransitionClass(el, activeClass);
          }
          // @ts-expect-error
          if (cb.cancelled) {
              if (expectsCSS) {
                  removeTransitionClass(el, startClass);
              }
              enterCancelledHook && enterCancelledHook(el);
          }
          else {
              afterEnterHook && afterEnterHook(el);
          }
          el._enterCb = null;
      }));
      if (!vnode.data.show) {
          // remove pending leave element on enter by injecting an insert hook
          mergeVNodeHook(vnode, 'insert', () => {
              const parent = el.parentNode;
              const pendingNode = parent && parent._pending && parent._pending[vnode.key];
              if (pendingNode &&
                  pendingNode.tag === vnode.tag &&
                  pendingNode.elm._leaveCb) {
                  pendingNode.elm._leaveCb();
              }
              enterHook && enterHook(el, cb);
          });
      }
      // start enter transition
      beforeEnterHook && beforeEnterHook(el);
      if (expectsCSS) {
          addTransitionClass(el, startClass);
          addTransitionClass(el, activeClass);
          nextFrame(() => {
              removeTransitionClass(el, startClass);
              // @ts-expect-error
              if (!cb.cancelled) {
                  addTransitionClass(el, toClass);
                  if (!userWantsControl) {
                      if (isValidDuration(explicitEnterDuration)) {
                          setTimeout(cb, explicitEnterDuration);
                      }
                      else {
                          whenTransitionEnds(el, type, cb);
                      }
                  }
              }
          });
      }
      if (vnode.data.show) {
          toggleDisplay && toggleDisplay();
          enterHook && enterHook(el, cb);
      }
      if (!expectsCSS && !userWantsControl) {
          cb();
      }
  }
  function leave(vnode, rm) {
      const el = vnode.elm;
      // call enter callback now
      if (isDef(el._enterCb)) {
          el._enterCb.cancelled = true;
          el._enterCb();
      }
      const data = resolveTransition(vnode.data.transition);
      if (isUndef(data) || el.nodeType !== 1) {
          return rm();
      }
      /* istanbul ignore if */
      if (isDef(el._leaveCb)) {
          return;
      }
      const { css, type, leaveClass, leaveToClass, leaveActiveClass, beforeLeave, leave, afterLeave, leaveCancelled, delayLeave, duration } = data;
      const expectsCSS = css !== false && !isIE9;
      const userWantsControl = getHookArgumentsLength(leave);
      const explicitLeaveDuration = toNumber(isObject$2(duration) ? duration.leave : duration);
      if (isDef(explicitLeaveDuration)) {
          checkDuration(explicitLeaveDuration, 'leave', vnode);
      }
      const cb = (el._leaveCb = once(() => {
          if (el.parentNode && el.parentNode._pending) {
              el.parentNode._pending[vnode.key] = null;
          }
          if (expectsCSS) {
              removeTransitionClass(el, leaveToClass);
              removeTransitionClass(el, leaveActiveClass);
          }
          // @ts-expect-error
          if (cb.cancelled) {
              if (expectsCSS) {
                  removeTransitionClass(el, leaveClass);
              }
              leaveCancelled && leaveCancelled(el);
          }
          else {
              rm();
              afterLeave && afterLeave(el);
          }
          el._leaveCb = null;
      }));
      if (delayLeave) {
          delayLeave(performLeave);
      }
      else {
          performLeave();
      }
      function performLeave() {
          // the delayed leave may have already been cancelled
          // @ts-expect-error
          if (cb.cancelled) {
              return;
          }
          // record leaving element
          if (!vnode.data.show && el.parentNode) {
              (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] =
                  vnode;
          }
          beforeLeave && beforeLeave(el);
          if (expectsCSS) {
              addTransitionClass(el, leaveClass);
              addTransitionClass(el, leaveActiveClass);
              nextFrame(() => {
                  removeTransitionClass(el, leaveClass);
                  // @ts-expect-error
                  if (!cb.cancelled) {
                      addTransitionClass(el, leaveToClass);
                      if (!userWantsControl) {
                          if (isValidDuration(explicitLeaveDuration)) {
                              setTimeout(cb, explicitLeaveDuration);
                          }
                          else {
                              whenTransitionEnds(el, type, cb);
                          }
                      }
                  }
              });
          }
          leave && leave(el, cb);
          if (!expectsCSS && !userWantsControl) {
              cb();
          }
      }
  }
  // only used in dev mode
  function checkDuration(val, name, vnode) {
      if (typeof val !== 'number') {
          warn$2(`<transition> explicit ${name} duration is not a valid number - ` +
              `got ${JSON.stringify(val)}.`, vnode.context);
      }
      else if (isNaN(val)) {
          warn$2(`<transition> explicit ${name} duration is NaN - ` +
              'the duration expression might be incorrect.', vnode.context);
      }
  }
  function isValidDuration(val) {
      return typeof val === 'number' && !isNaN(val);
  }
  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
      if (isUndef(fn)) {
          return false;
      }
      // @ts-expect-error
      const invokerFns = fn.fns;
      if (isDef(invokerFns)) {
          // invoker
          return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
      }
      else {
          // @ts-expect-error
          return (fn._length || fn.length) > 1;
      }
  }
  function _enter(_, vnode) {
      if (vnode.data.show !== true) {
          enter(vnode);
      }
  }
  var transition = inBrowser
      ? {
          create: _enter,
          activate: _enter,
          remove(vnode, rm) {
              /* istanbul ignore else */
              if (vnode.data.show !== true) {
                  // @ts-expect-error
                  leave(vnode, rm);
              }
              else {
                  rm();
              }
          }
      }
      : {};

  var platformModules = [attrs, klass$1, events, domProps, style$1, transition];

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  const modules$1 = platformModules.concat(baseModules);
  const patch = createPatchFunction({ nodeOps, modules: modules$1 });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */
  /* istanbul ignore if */
  if (isIE9) {
      // http://www.matts411.com/post/internet-explorer-9-oninput/
      document.addEventListener('selectionchange', () => {
          const el = document.activeElement;
          // @ts-expect-error
          if (el && el.vmodel) {
              trigger(el, 'input');
          }
      });
  }
  const directive = {
      inserted(el, binding, vnode, oldVnode) {
          if (vnode.tag === 'select') {
              // #6903
              if (oldVnode.elm && !oldVnode.elm._vOptions) {
                  mergeVNodeHook(vnode, 'postpatch', () => {
                      directive.componentUpdated(el, binding, vnode);
                  });
              }
              else {
                  setSelected(el, binding, vnode.context);
              }
              el._vOptions = [].map.call(el.options, getValue);
          }
          else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
              el._vModifiers = binding.modifiers;
              if (!binding.modifiers.lazy) {
                  el.addEventListener('compositionstart', onCompositionStart);
                  el.addEventListener('compositionend', onCompositionEnd);
                  // Safari < 10.2 & UIWebView doesn't fire compositionend when
                  // switching focus before confirming composition choice
                  // this also fixes the issue where some browsers e.g. iOS Chrome
                  // fires "change" instead of "input" on autocomplete.
                  el.addEventListener('change', onCompositionEnd);
                  /* istanbul ignore if */
                  if (isIE9) {
                      el.vmodel = true;
                  }
              }
          }
      },
      componentUpdated(el, binding, vnode) {
          if (vnode.tag === 'select') {
              setSelected(el, binding, vnode.context);
              // in case the options rendered by v-for have changed,
              // it's possible that the value is out-of-sync with the rendered options.
              // detect such cases and filter out values that no longer has a matching
              // option in the DOM.
              const prevOptions = el._vOptions;
              const curOptions = (el._vOptions = [].map.call(el.options, getValue));
              if (curOptions.some((o, i) => !looseEqual(o, prevOptions[i]))) {
                  // trigger change event if
                  // no matching option found for at least one value
                  const needReset = el.multiple
                      ? binding.value.some(v => hasNoMatchingOption(v, curOptions))
                      : binding.value !== binding.oldValue &&
                          hasNoMatchingOption(binding.value, curOptions);
                  if (needReset) {
                      trigger(el, 'change');
                  }
              }
          }
      }
  };
  function setSelected(el, binding, vm) {
      actuallySetSelected(el, binding, vm);
      /* istanbul ignore if */
      if (isIE || isEdge) {
          setTimeout(() => {
              actuallySetSelected(el, binding, vm);
          }, 0);
      }
  }
  function actuallySetSelected(el, binding, vm) {
      const value = binding.value;
      const isMultiple = el.multiple;
      if (isMultiple && !Array.isArray(value)) {
          warn$2(`<select multiple v-model="${binding.expression}"> ` +
                  `expects an Array value for its binding, but got ${Object.prototype.toString
                    .call(value)
                    .slice(8, -1)}`, vm);
          return;
      }
      let selected, option;
      for (let i = 0, l = el.options.length; i < l; i++) {
          option = el.options[i];
          if (isMultiple) {
              selected = looseIndexOf(value, getValue(option)) > -1;
              if (option.selected !== selected) {
                  option.selected = selected;
              }
          }
          else {
              if (looseEqual(getValue(option), value)) {
                  if (el.selectedIndex !== i) {
                      el.selectedIndex = i;
                  }
                  return;
              }
          }
      }
      if (!isMultiple) {
          el.selectedIndex = -1;
      }
  }
  function hasNoMatchingOption(value, options) {
      return options.every(o => !looseEqual(o, value));
  }
  function getValue(option) {
      return '_value' in option ? option._value : option.value;
  }
  function onCompositionStart(e) {
      e.target.composing = true;
  }
  function onCompositionEnd(e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing)
          return;
      e.target.composing = false;
      trigger(e.target, 'input');
  }
  function trigger(el, type) {
      const e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
  }

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
      // @ts-expect-error
      return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
          ? locateNode(vnode.componentInstance._vnode)
          : vnode;
  }
  var show = {
      bind(el, { value }, vnode) {
          vnode = locateNode(vnode);
          const transition = vnode.data && vnode.data.transition;
          const originalDisplay = (el.__vOriginalDisplay =
              el.style.display === 'none' ? '' : el.style.display);
          if (value && transition) {
              vnode.data.show = true;
              enter(vnode, () => {
                  el.style.display = originalDisplay;
              });
          }
          else {
              el.style.display = value ? originalDisplay : 'none';
          }
      },
      update(el, { value, oldValue }, vnode) {
          /* istanbul ignore if */
          if (!value === !oldValue)
              return;
          vnode = locateNode(vnode);
          const transition = vnode.data && vnode.data.transition;
          if (transition) {
              vnode.data.show = true;
              if (value) {
                  enter(vnode, () => {
                      el.style.display = el.__vOriginalDisplay;
                  });
              }
              else {
                  leave(vnode, () => {
                      el.style.display = 'none';
                  });
              }
          }
          else {
              el.style.display = value ? el.__vOriginalDisplay : 'none';
          }
      },
      unbind(el, binding, vnode, oldVnode, isDestroy) {
          if (!isDestroy) {
              el.style.display = el.__vOriginalDisplay;
          }
      }
  };

  var platformDirectives = {
      model: directive,
      show
  };

  // Provides transition support for a single element/component.
  const transitionProps = {
      name: String,
      appear: Boolean,
      css: Boolean,
      mode: String,
      type: String,
      enterClass: String,
      leaveClass: String,
      enterToClass: String,
      leaveToClass: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      appearClass: String,
      appearActiveClass: String,
      appearToClass: String,
      duration: [Number, String, Object]
  };
  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
      const compOptions = vnode && vnode.componentOptions;
      if (compOptions && compOptions.Ctor.options.abstract) {
          return getRealChild(getFirstComponentChild(compOptions.children));
      }
      else {
          return vnode;
      }
  }
  function extractTransitionData(comp) {
      const data = {};
      const options = comp.$options;
      // props
      for (const key in options.propsData) {
          data[key] = comp[key];
      }
      // events.
      // extract listeners and pass them directly to the transition methods
      const listeners = options._parentListeners;
      for (const key in listeners) {
          data[camelize(key)] = listeners[key];
      }
      return data;
  }
  function placeholder(h, rawChild) {
      // @ts-expect-error
      if (/\d-keep-alive$/.test(rawChild.tag)) {
          return h('keep-alive', {
              props: rawChild.componentOptions.propsData
          });
      }
  }
  function hasParentTransition(vnode) {
      while ((vnode = vnode.parent)) {
          if (vnode.data.transition) {
              return true;
          }
      }
  }
  function isSameChild(child, oldChild) {
      return oldChild.key === child.key && oldChild.tag === child.tag;
  }
  const isNotTextNode = (c) => c.tag || isAsyncPlaceholder(c);
  const isVShowDirective = d => d.name === 'show';
  var Transition = {
      name: 'transition',
      props: transitionProps,
      abstract: true,
      render(h) {
          let children = this.$slots.default;
          if (!children) {
              return;
          }
          // filter out text nodes (possible whitespaces)
          children = children.filter(isNotTextNode);
          /* istanbul ignore if */
          if (!children.length) {
              return;
          }
          // warn multiple elements
          if (children.length > 1) {
              warn$2('<transition> can only be used on a single element. Use ' +
                  '<transition-group> for lists.', this.$parent);
          }
          const mode = this.mode;
          // warn invalid mode
          if (mode && mode !== 'in-out' && mode !== 'out-in') {
              warn$2('invalid <transition> mode: ' + mode, this.$parent);
          }
          const rawChild = children[0];
          // if this is a component root node and the component's
          // parent container node also has transition, skip.
          if (hasParentTransition(this.$vnode)) {
              return rawChild;
          }
          // apply transition data to child
          // use getRealChild() to ignore abstract components e.g. keep-alive
          const child = getRealChild(rawChild);
          /* istanbul ignore if */
          if (!child) {
              return rawChild;
          }
          if (this._leaving) {
              return placeholder(h, rawChild);
          }
          // ensure a key that is unique to the vnode type and to this transition
          // component instance. This key will be used to remove pending leaving nodes
          // during entering.
          const id = `__transition-${this._uid}-`;
          child.key =
              child.key == null
                  ? child.isComment
                      ? id + 'comment'
                      : id + child.tag
                  : isPrimitive(child.key)
                      ? String(child.key).indexOf(id) === 0
                          ? child.key
                          : id + child.key
                      : child.key;
          const data = ((child.data || (child.data = {})).transition =
              extractTransitionData(this));
          const oldRawChild = this._vnode;
          const oldChild = getRealChild(oldRawChild);
          // mark v-show
          // so that the transition module can hand over the control to the directive
          if (child.data.directives && child.data.directives.some(isVShowDirective)) {
              child.data.show = true;
          }
          if (oldChild &&
              oldChild.data &&
              !isSameChild(child, oldChild) &&
              !isAsyncPlaceholder(oldChild) &&
              // #6687 component root is a comment node
              !(oldChild.componentInstance &&
                  oldChild.componentInstance._vnode.isComment)) {
              // replace old child transition data with fresh one
              // important for dynamic transitions!
              const oldData = (oldChild.data.transition = extend$1({}, data));
              // handle transition mode
              if (mode === 'out-in') {
                  // return placeholder node and queue update when leave finishes
                  this._leaving = true;
                  mergeVNodeHook(oldData, 'afterLeave', () => {
                      this._leaving = false;
                      this.$forceUpdate();
                  });
                  return placeholder(h, rawChild);
              }
              else if (mode === 'in-out') {
                  if (isAsyncPlaceholder(child)) {
                      return oldRawChild;
                  }
                  let delayedLeave;
                  const performLeave = () => {
                      delayedLeave();
                  };
                  mergeVNodeHook(data, 'afterEnter', performLeave);
                  mergeVNodeHook(data, 'enterCancelled', performLeave);
                  mergeVNodeHook(oldData, 'delayLeave', leave => {
                      delayedLeave = leave;
                  });
              }
          }
          return rawChild;
      }
  };

  // Provides transition support for list items.
  const props = extend$1({
      tag: String,
      moveClass: String
  }, transitionProps);
  delete props.mode;
  var TransitionGroup = {
      props,
      beforeMount() {
          const update = this._update;
          this._update = (vnode, hydrating) => {
              const restoreActiveInstance = setActiveInstance(this);
              // force removing pass
              this.__patch__(this._vnode, this.kept, false, // hydrating
              true // removeOnly (!important, avoids unnecessary moves)
              );
              this._vnode = this.kept;
              restoreActiveInstance();
              update.call(this, vnode, hydrating);
          };
      },
      render(h) {
          const tag = this.tag || this.$vnode.data.tag || 'span';
          const map = Object.create(null);
          const prevChildren = (this.prevChildren = this.children);
          const rawChildren = this.$slots.default || [];
          const children = (this.children = []);
          const transitionData = extractTransitionData(this);
          for (let i = 0; i < rawChildren.length; i++) {
              const c = rawChildren[i];
              if (c.tag) {
                  if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                      children.push(c);
                      map[c.key] = c;
                      (c.data || (c.data = {})).transition = transitionData;
                  }
                  else {
                      const opts = c.componentOptions;
                      const name = opts
                          ? getComponentName(opts.Ctor.options) || opts.tag || ''
                          : c.tag;
                      warn$2(`<transition-group> children must be keyed: <${name}>`);
                  }
              }
          }
          if (prevChildren) {
              const kept = [];
              const removed = [];
              for (let i = 0; i < prevChildren.length; i++) {
                  const c = prevChildren[i];
                  c.data.transition = transitionData;
                  // @ts-expect-error .getBoundingClientRect is not typed in Node
                  c.data.pos = c.elm.getBoundingClientRect();
                  if (map[c.key]) {
                      kept.push(c);
                  }
                  else {
                      removed.push(c);
                  }
              }
              this.kept = h(tag, null, kept);
              this.removed = removed;
          }
          return h(tag, null, children);
      },
      updated() {
          const children = this.prevChildren;
          const moveClass = this.moveClass || (this.name || 'v') + '-move';
          if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
              return;
          }
          // we divide the work into three loops to avoid mixing DOM reads and writes
          // in each iteration - which helps prevent layout thrashing.
          children.forEach(callPendingCbs);
          children.forEach(recordPosition);
          children.forEach(applyTranslation);
          // force reflow to put everything in position
          // assign to this to avoid being removed in tree-shaking
          // $flow-disable-line
          this._reflow = document.body.offsetHeight;
          children.forEach((c) => {
              if (c.data.moved) {
                  const el = c.elm;
                  const s = el.style;
                  addTransitionClass(el, moveClass);
                  s.transform = s.WebkitTransform = s.transitionDuration = '';
                  el.addEventListener(transitionEndEvent, (el._moveCb = function cb(e) {
                      if (e && e.target !== el) {
                          return;
                      }
                      if (!e || /transform$/.test(e.propertyName)) {
                          el.removeEventListener(transitionEndEvent, cb);
                          el._moveCb = null;
                          removeTransitionClass(el, moveClass);
                      }
                  }));
              }
          });
      },
      methods: {
          hasMove(el, moveClass) {
              /* istanbul ignore if */
              if (!hasTransition) {
                  return false;
              }
              /* istanbul ignore if */
              if (this._hasMove) {
                  return this._hasMove;
              }
              // Detect whether an element with the move class applied has
              // CSS transitions. Since the element may be inside an entering
              // transition at this very moment, we make a clone of it and remove
              // all other transition classes applied to ensure only the move class
              // is applied.
              const clone = el.cloneNode();
              if (el._transitionClasses) {
                  el._transitionClasses.forEach((cls) => {
                      removeClass(clone, cls);
                  });
              }
              addClass(clone, moveClass);
              clone.style.display = 'none';
              this.$el.appendChild(clone);
              const info = getTransitionInfo(clone);
              this.$el.removeChild(clone);
              return (this._hasMove = info.hasTransform);
          }
      }
  };
  function callPendingCbs(c) {
      /* istanbul ignore if */
      if (c.elm._moveCb) {
          c.elm._moveCb();
      }
      /* istanbul ignore if */
      if (c.elm._enterCb) {
          c.elm._enterCb();
      }
  }
  function recordPosition(c) {
      c.data.newPos = c.elm.getBoundingClientRect();
  }
  function applyTranslation(c) {
      const oldPos = c.data.pos;
      const newPos = c.data.newPos;
      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;
      if (dx || dy) {
          c.data.moved = true;
          const s = c.elm.style;
          s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`;
          s.transitionDuration = '0s';
      }
  }

  var platformComponents = {
      Transition,
      TransitionGroup
  };

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;
  // install platform runtime directives & components
  extend$1(Vue.options.directives, platformDirectives);
  extend$1(Vue.options.components, platformComponents);
  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;
  // public mount method
  Vue.prototype.$mount = function (el, hydrating) {
      el = el && inBrowser ? query(el) : undefined;
      return mountComponent(this, el, hydrating);
  };
  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
      setTimeout(() => {
          if (config.devtools) {
              if (devtools) {
                  devtools.emit('init', Vue);
              }
              else {
                  // @ts-expect-error
                  console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' +
                      'https://github.com/vuejs/vue-devtools');
              }
          }
          if (config.productionTip !== false &&
              typeof console !== 'undefined') {
              // @ts-expect-error
              console[console.info ? 'info' : 'log'](`You are running Vue in development mode.\n` +
                  `Make sure to turn on production mode when deploying for production.\n` +
                  `See more tips at https://vuejs.org/guide/deployment.html`);
          }
      }, 0);
  }

  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  const buildRegex = cached(delimiters => {
      const open = delimiters[0].replace(regexEscapeRE, '\\$&');
      const close = delimiters[1].replace(regexEscapeRE, '\\$&');
      return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
  });
  function parseText(text, delimiters) {
      //@ts-expect-error
      const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
      if (!tagRE.test(text)) {
          return;
      }
      const tokens = [];
      const rawTokens = [];
      let lastIndex = (tagRE.lastIndex = 0);
      let match, index, tokenValue;
      while ((match = tagRE.exec(text))) {
          index = match.index;
          // push text token
          if (index > lastIndex) {
              rawTokens.push((tokenValue = text.slice(lastIndex, index)));
              tokens.push(JSON.stringify(tokenValue));
          }
          // tag token
          const exp = parseFilters(match[1].trim());
          tokens.push(`_s(${exp})`);
          rawTokens.push({ '@binding': exp });
          lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
          rawTokens.push((tokenValue = text.slice(lastIndex)));
          tokens.push(JSON.stringify(tokenValue));
      }
      return {
          expression: tokens.join('+'),
          tokens: rawTokens
      };
  }

  function transformNode$1(el, options) {
      const warn = options.warn || baseWarn;
      const staticClass = getAndRemoveAttr(el, 'class');
      if (staticClass) {
          const res = parseText(staticClass, options.delimiters);
          if (res) {
              warn(`class="${staticClass}": ` +
                  'Interpolation inside attributes has been removed. ' +
                  'Use v-bind or the colon shorthand instead. For example, ' +
                  'instead of <div class="{{ val }}">, use <div :class="val">.', el.rawAttrsMap['class']);
          }
      }
      if (staticClass) {
          el.staticClass = JSON.stringify(staticClass.replace(/\s+/g, ' ').trim());
      }
      const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
      if (classBinding) {
          el.classBinding = classBinding;
      }
  }
  function genData$2(el) {
      let data = '';
      if (el.staticClass) {
          data += `staticClass:${el.staticClass},`;
      }
      if (el.classBinding) {
          data += `class:${el.classBinding},`;
      }
      return data;
  }
  var klass = {
      staticKeys: ['staticClass'],
      transformNode: transformNode$1,
      genData: genData$2
  };

  function transformNode(el, options) {
      const warn = options.warn || baseWarn;
      const staticStyle = getAndRemoveAttr(el, 'style');
      if (staticStyle) {
          /* istanbul ignore if */
          {
              const res = parseText(staticStyle, options.delimiters);
              if (res) {
                  warn(`style="${staticStyle}": ` +
                      'Interpolation inside attributes has been removed. ' +
                      'Use v-bind or the colon shorthand instead. For example, ' +
                      'instead of <div style="{{ val }}">, use <div :style="val">.', el.rawAttrsMap['style']);
              }
          }
          el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
      }
      const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
      if (styleBinding) {
          el.styleBinding = styleBinding;
      }
  }
  function genData$1(el) {
      let data = '';
      if (el.staticStyle) {
          data += `staticStyle:${el.staticStyle},`;
      }
      if (el.styleBinding) {
          data += `style:(${el.styleBinding}),`;
      }
      return data;
  }
  var style = {
      staticKeys: ['staticStyle'],
      transformNode,
      genData: genData$1
  };

  let decoder;
  var he = {
      decode(html) {
          decoder = decoder || document.createElement('div');
          decoder.innerHTML = html;
          return decoder.textContent;
      }
  };

  const isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
      'link,meta,param,source,track,wbr');
  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  const canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');
  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  const isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
      'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
      'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
      'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
      'title,tr,track');

  /**
   * Not type-checking this file because it's mostly vendor code.
   */
  // Regular Expressions for parsing tags and attributes
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const startTagClose = /^\s*(\/?)>/;
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  const doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being passed as HTML comment when inlined in page
  const comment = /^<!\--/;
  const conditionalComment = /^<!\[/;
  // Special Elements (can contain anything)
  const isPlainTextElement = makeMap('script,style,textarea', true);
  const reCache = {};
  const decodingMap = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&amp;': '&',
      '&#10;': '\n',
      '&#9;': '\t',
      '&#39;': "'"
  };
  const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;
  // #5992
  const isIgnoreNewlineTag = makeMap('pre,textarea', true);
  const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
  function decodeAttr(value, shouldDecodeNewlines) {
      const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
      return value.replace(re, match => decodingMap[match]);
  }
  function parseHTML(html, options) {
      const stack = [];
      const expectHTML = options.expectHTML;
      const isUnaryTag = options.isUnaryTag || no;
      const canBeLeftOpenTag = options.canBeLeftOpenTag || no;
      let index = 0;
      let last, lastTag;
      while (html) {
          last = html;
          // Make sure we're not in a plaintext content element like script/style
          if (!lastTag || !isPlainTextElement(lastTag)) {
              let textEnd = html.indexOf('<');
              if (textEnd === 0) {
                  // Comment:
                  if (comment.test(html)) {
                      const commentEnd = html.indexOf('-->');
                      if (commentEnd >= 0) {
                          if (options.shouldKeepComment && options.comment) {
                              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
                          }
                          advance(commentEnd + 3);
                          continue;
                      }
                  }
                  // https://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                  if (conditionalComment.test(html)) {
                      const conditionalEnd = html.indexOf(']>');
                      if (conditionalEnd >= 0) {
                          advance(conditionalEnd + 2);
                          continue;
                      }
                  }
                  // Doctype:
                  const doctypeMatch = html.match(doctype);
                  if (doctypeMatch) {
                      advance(doctypeMatch[0].length);
                      continue;
                  }
                  // End tag:
                  const endTagMatch = html.match(endTag);
                  if (endTagMatch) {
                      const curIndex = index;
                      advance(endTagMatch[0].length);
                      parseEndTag(endTagMatch[1], curIndex, index);
                      continue;
                  }
                  // Start tag:
                  const startTagMatch = parseStartTag();
                  if (startTagMatch) {
                      handleStartTag(startTagMatch);
                      if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                          advance(1);
                      }
                      continue;
                  }
              }
              let text, rest, next;
              if (textEnd >= 0) {
                  rest = html.slice(textEnd);
                  while (!endTag.test(rest) &&
                      !startTagOpen.test(rest) &&
                      !comment.test(rest) &&
                      !conditionalComment.test(rest)) {
                      // < in plain text, be forgiving and treat it as text
                      next = rest.indexOf('<', 1);
                      if (next < 0)
                          break;
                      textEnd += next;
                      rest = html.slice(textEnd);
                  }
                  text = html.substring(0, textEnd);
              }
              if (textEnd < 0) {
                  text = html;
              }
              if (text) {
                  advance(text.length);
              }
              if (options.chars && text) {
                  options.chars(text, index - text.length, index);
              }
          }
          else {
              let endTagLength = 0;
              const stackedTag = lastTag.toLowerCase();
              const reStackedTag = reCache[stackedTag] ||
                  (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
              const rest = html.replace(reStackedTag, function (all, text, endTag) {
                  endTagLength = endTag.length;
                  if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                      text = text
                          .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                          .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                  }
                  if (shouldIgnoreFirstNewline(stackedTag, text)) {
                      text = text.slice(1);
                  }
                  if (options.chars) {
                      options.chars(text);
                  }
                  return '';
              });
              index += html.length - rest.length;
              html = rest;
              parseEndTag(stackedTag, index - endTagLength, index);
          }
          if (html === last) {
              options.chars && options.chars(html);
              if (!stack.length && options.warn) {
                  options.warn(`Mal-formatted tag at end of template: "${html}"`, {
                      start: index + html.length
                  });
              }
              break;
          }
      }
      // Clean up any remaining tags
      parseEndTag();
      function advance(n) {
          index += n;
          html = html.substring(n);
      }
      function parseStartTag() {
          const start = html.match(startTagOpen);
          if (start) {
              const match = {
                  tagName: start[1],
                  attrs: [],
                  start: index
              };
              advance(start[0].length);
              let end, attr;
              while (!(end = html.match(startTagClose)) &&
                  (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                  attr.start = index;
                  advance(attr[0].length);
                  attr.end = index;
                  match.attrs.push(attr);
              }
              if (end) {
                  match.unarySlash = end[1];
                  advance(end[0].length);
                  match.end = index;
                  return match;
              }
          }
      }
      function handleStartTag(match) {
          const tagName = match.tagName;
          const unarySlash = match.unarySlash;
          if (expectHTML) {
              if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                  parseEndTag(lastTag);
              }
              if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
                  parseEndTag(tagName);
              }
          }
          const unary = isUnaryTag(tagName) || !!unarySlash;
          const l = match.attrs.length;
          const attrs = new Array(l);
          for (let i = 0; i < l; i++) {
              const args = match.attrs[i];
              const value = args[3] || args[4] || args[5] || '';
              const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                  ? options.shouldDecodeNewlinesForHref
                  : options.shouldDecodeNewlines;
              attrs[i] = {
                  name: args[1],
                  value: decodeAttr(value, shouldDecodeNewlines)
              };
              if (options.outputSourceRange) {
                  attrs[i].start = args.start + args[0].match(/^\s*/).length;
                  attrs[i].end = args.end;
              }
          }
          if (!unary) {
              stack.push({
                  tag: tagName,
                  lowerCasedTag: tagName.toLowerCase(),
                  attrs: attrs,
                  start: match.start,
                  end: match.end
              });
              lastTag = tagName;
          }
          if (options.start) {
              options.start(tagName, attrs, unary, match.start, match.end);
          }
      }
      function parseEndTag(tagName, start, end) {
          let pos, lowerCasedTagName;
          if (start == null)
              start = index;
          if (end == null)
              end = index;
          // Find the closest opened tag of the same type
          if (tagName) {
              lowerCasedTagName = tagName.toLowerCase();
              for (pos = stack.length - 1; pos >= 0; pos--) {
                  if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                      break;
                  }
              }
          }
          else {
              // If no tag name is provided, clean shop
              pos = 0;
          }
          if (pos >= 0) {
              // Close all the open elements, up the stack
              for (let i = stack.length - 1; i >= pos; i--) {
                  if ((i > pos || !tagName) && options.warn) {
                      options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
                          start: stack[i].start,
                          end: stack[i].end
                      });
                  }
                  if (options.end) {
                      options.end(stack[i].tag, start, end);
                  }
              }
              // Remove the open elements from the stack
              stack.length = pos;
              lastTag = pos && stack[pos - 1].tag;
          }
          else if (lowerCasedTagName === 'br') {
              if (options.start) {
                  options.start(tagName, [], true, start, end);
              }
          }
          else if (lowerCasedTagName === 'p') {
              if (options.start) {
                  options.start(tagName, [], false, start, end);
              }
              if (options.end) {
                  options.end(tagName, start, end);
              }
          }
      }
  }

  const onRE = /^@|^v-on:/;
  const dirRE = /^v-|^@|^:|^#/;
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  const stripParensRE = /^\(|\)$/g;
  const dynamicArgRE = /^\[.*\]$/;
  const argRE = /:(.*)$/;
  const bindRE = /^:|^\.|^v-bind:/;
  const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
  const slotRE = /^v-slot(:|$)|^#/;
  const lineBreakRE = /[\r\n]/;
  const whitespaceRE = /[ \f\t\r\n]+/g;
  const invalidAttributeRE = /[\s"'<>\/=]/;
  const decodeHTMLCached = cached(he.decode);
  const emptySlotScopeToken = `_empty_`;
  // configurable state
  let warn;
  let delimiters;
  let transforms;
  let preTransforms;
  let postTransforms;
  let platformIsPreTag;
  let platformMustUseProp;
  let platformGetTagNamespace;
  let maybeComponent;
  function createASTElement(tag, attrs, parent) {
      return {
          type: 1,
          tag,
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          rawAttrsMap: {},
          parent,
          children: []
      };
  }
  /**
   * Convert HTML string to AST.
   */
  function parse(template, options) {
      warn = options.warn || baseWarn;
      platformIsPreTag = options.isPreTag || no;
      platformMustUseProp = options.mustUseProp || no;
      platformGetTagNamespace = options.getTagNamespace || no;
      const isReservedTag = options.isReservedTag || no;
      maybeComponent = (el) => !!(el.component ||
          el.attrsMap[':is'] ||
          el.attrsMap['v-bind:is'] ||
          !(el.attrsMap.is ? isReservedTag(el.attrsMap.is) : isReservedTag(el.tag)));
      transforms = pluckModuleFunction(options.modules, 'transformNode');
      preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
      postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
      delimiters = options.delimiters;
      const stack = [];
      const preserveWhitespace = options.preserveWhitespace !== false;
      const whitespaceOption = options.whitespace;
      let root;
      let currentParent;
      let inVPre = false;
      let inPre = false;
      let warned = false;
      function warnOnce(msg, range) {
          if (!warned) {
              warned = true;
              warn(msg, range);
          }
      }
      function closeElement(element) {
          trimEndingWhitespace(element);
          if (!inVPre && !element.processed) {
              element = processElement(element, options);
          }
          // tree management
          if (!stack.length && element !== root) {
              // allow root elements with v-if, v-else-if and v-else
              if (root.if && (element.elseif || element.else)) {
                  {
                      checkRootConstraints(element);
                  }
                  addIfCondition(root, {
                      exp: element.elseif,
                      block: element
                  });
              }
              else {
                  warnOnce(`Component template should contain exactly one root element. ` +
                      `If you are using v-if on multiple elements, ` +
                      `use v-else-if to chain them instead.`, { start: element.start });
              }
          }
          if (currentParent && !element.forbidden) {
              if (element.elseif || element.else) {
                  processIfConditions(element, currentParent);
              }
              else {
                  if (element.slotScope) {
                      // scoped slot
                      // keep it in the children list so that v-else(-if) conditions can
                      // find it as the prev node.
                      const name = element.slotTarget || '"default"';
                      (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                  }
                  currentParent.children.push(element);
                  element.parent = currentParent;
              }
          }
          // final children cleanup
          // filter out scoped slots
          element.children = element.children.filter(c => !c.slotScope);
          // remove trailing whitespace node again
          trimEndingWhitespace(element);
          // check pre state
          if (element.pre) {
              inVPre = false;
          }
          if (platformIsPreTag(element.tag)) {
              inPre = false;
          }
          // apply post-transforms
          for (let i = 0; i < postTransforms.length; i++) {
              postTransforms[i](element, options);
          }
      }
      function trimEndingWhitespace(el) {
          // remove trailing whitespace node
          if (!inPre) {
              let lastNode;
              while ((lastNode = el.children[el.children.length - 1]) &&
                  lastNode.type === 3 &&
                  lastNode.text === ' ') {
                  el.children.pop();
              }
          }
      }
      function checkRootConstraints(el) {
          if (el.tag === 'slot' || el.tag === 'template') {
              warnOnce(`Cannot use <${el.tag}> as component root element because it may ` +
                  'contain multiple nodes.', { start: el.start });
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
              warnOnce('Cannot use v-for on stateful component root element because ' +
                  'it renders multiple elements.', el.rawAttrsMap['v-for']);
          }
      }
      parseHTML(template, {
          warn,
          expectHTML: options.expectHTML,
          isUnaryTag: options.isUnaryTag,
          canBeLeftOpenTag: options.canBeLeftOpenTag,
          shouldDecodeNewlines: options.shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
          shouldKeepComment: options.comments,
          outputSourceRange: options.outputSourceRange,
          start(tag, attrs, unary, start, end) {
              // check namespace.
              // inherit parent ns if there is one
              const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);
              // handle IE svg bug
              /* istanbul ignore if */
              if (isIE && ns === 'svg') {
                  attrs = guardIESVGBug(attrs);
              }
              let element = createASTElement(tag, attrs, currentParent);
              if (ns) {
                  element.ns = ns;
              }
              {
                  if (options.outputSourceRange) {
                      element.start = start;
                      element.end = end;
                      element.rawAttrsMap = element.attrsList.reduce((cumulated, attr) => {
                          cumulated[attr.name] = attr;
                          return cumulated;
                      }, {});
                  }
                  attrs.forEach(attr => {
                      if (invalidAttributeRE.test(attr.name)) {
                          warn(`Invalid dynamic argument expression: attribute names cannot contain ` +
                              `spaces, quotes, <, >, / or =.`, options.outputSourceRange
                              ? {
                                  start: attr.start + attr.name.indexOf(`[`),
                                  end: attr.start + attr.name.length
                              }
                              : undefined);
                      }
                  });
              }
              if (isForbiddenTag(element) && !isServerRendering()) {
                  element.forbidden = true;
                  warn('Templates should only be responsible for mapping the state to the ' +
                          'UI. Avoid placing tags with side-effects in your templates, such as ' +
                          `<${tag}>` +
                          ', as they will not be parsed.', { start: element.start });
              }
              // apply pre-transforms
              for (let i = 0; i < preTransforms.length; i++) {
                  element = preTransforms[i](element, options) || element;
              }
              if (!inVPre) {
                  processPre(element);
                  if (element.pre) {
                      inVPre = true;
                  }
              }
              if (platformIsPreTag(element.tag)) {
                  inPre = true;
              }
              if (inVPre) {
                  processRawAttrs(element);
              }
              else if (!element.processed) {
                  // structural directives
                  processFor(element);
                  processIf(element);
                  processOnce(element);
              }
              if (!root) {
                  root = element;
                  {
                      checkRootConstraints(root);
                  }
              }
              if (!unary) {
                  currentParent = element;
                  stack.push(element);
              }
              else {
                  closeElement(element);
              }
          },
          end(tag, start, end) {
              const element = stack[stack.length - 1];
              // pop stack
              stack.length -= 1;
              currentParent = stack[stack.length - 1];
              if (options.outputSourceRange) {
                  element.end = end;
              }
              closeElement(element);
          },
          chars(text, start, end) {
              if (!currentParent) {
                  {
                      if (text === template) {
                          warnOnce('Component template requires a root element, rather than just text.', { start });
                      }
                      else if ((text = text.trim())) {
                          warnOnce(`text "${text}" outside root element will be ignored.`, {
                              start
                          });
                      }
                  }
                  return;
              }
              // IE textarea placeholder bug
              /* istanbul ignore if */
              if (isIE &&
                  currentParent.tag === 'textarea' &&
                  currentParent.attrsMap.placeholder === text) {
                  return;
              }
              const children = currentParent.children;
              if (inPre || text.trim()) {
                  text = isTextTag(currentParent)
                      ? text
                      : decodeHTMLCached(text);
              }
              else if (!children.length) {
                  // remove the whitespace-only node right after an opening tag
                  text = '';
              }
              else if (whitespaceOption) {
                  if (whitespaceOption === 'condense') {
                      // in condense mode, remove the whitespace node if it contains
                      // line break, otherwise condense to a single space
                      text = lineBreakRE.test(text) ? '' : ' ';
                  }
                  else {
                      text = ' ';
                  }
              }
              else {
                  text = preserveWhitespace ? ' ' : '';
              }
              if (text) {
                  if (!inPre && whitespaceOption === 'condense') {
                      // condense consecutive whitespaces into single space
                      text = text.replace(whitespaceRE, ' ');
                  }
                  let res;
                  let child;
                  if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
                      child = {
                          type: 2,
                          expression: res.expression,
                          tokens: res.tokens,
                          text
                      };
                  }
                  else if (text !== ' ' ||
                      !children.length ||
                      children[children.length - 1].text !== ' ') {
                      child = {
                          type: 3,
                          text
                      };
                  }
                  if (child) {
                      if (options.outputSourceRange) {
                          child.start = start;
                          child.end = end;
                      }
                      children.push(child);
                  }
              }
          },
          comment(text, start, end) {
              // adding anything as a sibling to the root node is forbidden
              // comments should still be allowed, but ignored
              if (currentParent) {
                  const child = {
                      type: 3,
                      text,
                      isComment: true
                  };
                  if (options.outputSourceRange) {
                      child.start = start;
                      child.end = end;
                  }
                  currentParent.children.push(child);
              }
          }
      });
      return root;
  }
  function processPre(el) {
      if (getAndRemoveAttr(el, 'v-pre') != null) {
          el.pre = true;
      }
  }
  function processRawAttrs(el) {
      const list = el.attrsList;
      const len = list.length;
      if (len) {
          const attrs = (el.attrs = new Array(len));
          for (let i = 0; i < len; i++) {
              attrs[i] = {
                  name: list[i].name,
                  value: JSON.stringify(list[i].value)
              };
              if (list[i].start != null) {
                  attrs[i].start = list[i].start;
                  attrs[i].end = list[i].end;
              }
          }
      }
      else if (!el.pre) {
          // non root node in pre blocks with no attributes
          el.plain = true;
      }
  }
  function processElement(element, options) {
      processKey(element);
      // determine whether this is a plain element after
      // removing structural attributes
      element.plain =
          !element.key && !element.scopedSlots && !element.attrsList.length;
      processRef(element);
      processSlotContent(element);
      processSlotOutlet(element);
      processComponent(element);
      for (let i = 0; i < transforms.length; i++) {
          element = transforms[i](element, options) || element;
      }
      processAttrs(element);
      return element;
  }
  function processKey(el) {
      const exp = getBindingAttr(el, 'key');
      if (exp) {
          {
              if (el.tag === 'template') {
                  warn(`<template> cannot be keyed. Place the key on real elements instead.`, getRawBindingAttr(el, 'key'));
              }
              if (el.for) {
                  const iterator = el.iterator2 || el.iterator1;
                  const parent = el.parent;
                  if (iterator &&
                      iterator === exp &&
                      parent &&
                      parent.tag === 'transition-group') {
                      warn(`Do not use v-for index as key on <transition-group> children, ` +
                          `this is the same as not using keys.`, getRawBindingAttr(el, 'key'), true /* tip */);
                  }
              }
          }
          el.key = exp;
      }
  }
  function processRef(el) {
      const ref = getBindingAttr(el, 'ref');
      if (ref) {
          el.ref = ref;
          el.refInFor = checkInFor(el);
      }
  }
  function processFor(el) {
      let exp;
      if ((exp = getAndRemoveAttr(el, 'v-for'))) {
          const res = parseFor(exp);
          if (res) {
              extend$1(el, res);
          }
          else {
              warn(`Invalid v-for expression: ${exp}`, el.rawAttrsMap['v-for']);
          }
      }
  }
  function parseFor(exp) {
      const inMatch = exp.match(forAliasRE);
      if (!inMatch)
          return;
      const res = {};
      res.for = inMatch[2].trim();
      const alias = inMatch[1].trim().replace(stripParensRE, '');
      const iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
          res.alias = alias.replace(forIteratorRE, '').trim();
          res.iterator1 = iteratorMatch[1].trim();
          if (iteratorMatch[2]) {
              res.iterator2 = iteratorMatch[2].trim();
          }
      }
      else {
          res.alias = alias;
      }
      return res;
  }
  function processIf(el) {
      const exp = getAndRemoveAttr(el, 'v-if');
      if (exp) {
          el.if = exp;
          addIfCondition(el, {
              exp: exp,
              block: el
          });
      }
      else {
          if (getAndRemoveAttr(el, 'v-else') != null) {
              el.else = true;
          }
          const elseif = getAndRemoveAttr(el, 'v-else-if');
          if (elseif) {
              el.elseif = elseif;
          }
      }
  }
  function processIfConditions(el, parent) {
      const prev = findPrevElement(parent.children);
      if (prev && prev.if) {
          addIfCondition(prev, {
              exp: el.elseif,
              block: el
          });
      }
      else {
          warn(`v-${el.elseif ? 'else-if="' + el.elseif + '"' : 'else'} ` +
              `used on element <${el.tag}> without corresponding v-if.`, el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']);
      }
  }
  function findPrevElement(children) {
      let i = children.length;
      while (i--) {
          if (children[i].type === 1) {
              return children[i];
          }
          else {
              if (children[i].text !== ' ') {
                  warn(`text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
                      `will be ignored.`, children[i]);
              }
              children.pop();
          }
      }
  }
  function addIfCondition(el, condition) {
      if (!el.ifConditions) {
          el.ifConditions = [];
      }
      el.ifConditions.push(condition);
  }
  function processOnce(el) {
      const once = getAndRemoveAttr(el, 'v-once');
      if (once != null) {
          el.once = true;
      }
  }
  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent(el) {
      let slotScope;
      if (el.tag === 'template') {
          slotScope = getAndRemoveAttr(el, 'scope');
          /* istanbul ignore if */
          if (slotScope) {
              warn(`the "scope" attribute for scoped slots have been deprecated and ` +
                  `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
                  `can also be used on plain elements in addition to <template> to ` +
                  `denote scoped slots.`, el.rawAttrsMap['scope'], true);
          }
          el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
      }
      else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
          /* istanbul ignore if */
          if (el.attrsMap['v-for']) {
              warn(`Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
                  `(v-for takes higher priority). Use a wrapper <template> for the ` +
                  `scoped slot to make it clearer.`, el.rawAttrsMap['slot-scope'], true);
          }
          el.slotScope = slotScope;
      }
      // slot="xxx"
      const slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
          el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
          el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
          // preserve slot as an attribute for native shadow DOM compat
          // only for non-scoped slots.
          if (el.tag !== 'template' && !el.slotScope) {
              addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
          }
      }
      // 2.6 v-slot syntax
      {
          if (el.tag === 'template') {
              // v-slot on <template>
              const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
              if (slotBinding) {
                  {
                      if (el.slotTarget || el.slotScope) {
                          warn(`Unexpected mixed usage of different slot syntaxes.`, el);
                      }
                      if (el.parent && !maybeComponent(el.parent)) {
                          warn(`<template v-slot> can only appear at the root level inside ` +
                              `the receiving component`, el);
                      }
                  }
                  const { name, dynamic } = getSlotName(slotBinding);
                  el.slotTarget = name;
                  el.slotTargetDynamic = dynamic;
                  el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
              }
          }
          else {
              // v-slot on component, denotes default slot
              const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
              if (slotBinding) {
                  {
                      if (!maybeComponent(el)) {
                          warn(`v-slot can only be used on components or <template>.`, slotBinding);
                      }
                      if (el.slotScope || el.slotTarget) {
                          warn(`Unexpected mixed usage of different slot syntaxes.`, el);
                      }
                      if (el.scopedSlots) {
                          warn(`To avoid scope ambiguity, the default slot should also use ` +
                              `<template> syntax when there are other named slots.`, slotBinding);
                      }
                  }
                  // add the component's children to its default slot
                  const slots = el.scopedSlots || (el.scopedSlots = {});
                  const { name, dynamic } = getSlotName(slotBinding);
                  const slotContainer = (slots[name] = createASTElement('template', [], el));
                  slotContainer.slotTarget = name;
                  slotContainer.slotTargetDynamic = dynamic;
                  slotContainer.children = el.children.filter((c) => {
                      if (!c.slotScope) {
                          c.parent = slotContainer;
                          return true;
                      }
                  });
                  slotContainer.slotScope = slotBinding.value || emptySlotScopeToken;
                  // remove children as they are returned from scopedSlots now
                  el.children = [];
                  // mark el non-plain so data gets generated
                  el.plain = false;
              }
          }
      }
  }
  function getSlotName(binding) {
      let name = binding.name.replace(slotRE, '');
      if (!name) {
          if (binding.name[0] !== '#') {
              name = 'default';
          }
          else {
              warn(`v-slot shorthand syntax requires a slot name.`, binding);
          }
      }
      return dynamicArgRE.test(name)
          ? // dynamic [name]
              { name: name.slice(1, -1), dynamic: true }
          : // static name
              { name: `"${name}"`, dynamic: false };
  }
  // handle <slot/> outlets
  function processSlotOutlet(el) {
      if (el.tag === 'slot') {
          el.slotName = getBindingAttr(el, 'name');
          if (el.key) {
              warn(`\`key\` does not work on <slot> because slots are abstract outlets ` +
                  `and can possibly expand into multiple elements. ` +
                  `Use the key on a wrapping element instead.`, getRawBindingAttr(el, 'key'));
          }
      }
  }
  function processComponent(el) {
      let binding;
      if ((binding = getBindingAttr(el, 'is'))) {
          el.component = binding;
      }
      if (getAndRemoveAttr(el, 'inline-template') != null) {
          el.inlineTemplate = true;
      }
  }
  function processAttrs(el) {
      const list = el.attrsList;
      let i, l, name, rawName, value, modifiers, syncGen, isDynamic;
      for (i = 0, l = list.length; i < l; i++) {
          name = rawName = list[i].name;
          value = list[i].value;
          if (dirRE.test(name)) {
              // mark element as dynamic
              el.hasBindings = true;
              // modifiers
              modifiers = parseModifiers(name.replace(dirRE, ''));
              // support .foo shorthand syntax for the .prop modifier
              if (modifiers) {
                  name = name.replace(modifierRE, '');
              }
              if (bindRE.test(name)) {
                  // v-bind
                  name = name.replace(bindRE, '');
                  value = parseFilters(value);
                  isDynamic = dynamicArgRE.test(name);
                  if (isDynamic) {
                      name = name.slice(1, -1);
                  }
                  if (value.trim().length === 0) {
                      warn(`The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`);
                  }
                  if (modifiers) {
                      if (modifiers.prop && !isDynamic) {
                          name = camelize(name);
                          if (name === 'innerHtml')
                              name = 'innerHTML';
                      }
                      if (modifiers.camel && !isDynamic) {
                          name = camelize(name);
                      }
                      if (modifiers.sync) {
                          syncGen = genAssignmentCode(value, `$event`);
                          if (!isDynamic) {
                              addHandler(el, `update:${camelize(name)}`, syncGen, null, false, warn, list[i]);
                              if (hyphenate(name) !== camelize(name)) {
                                  addHandler(el, `update:${hyphenate(name)}`, syncGen, null, false, warn, list[i]);
                              }
                          }
                          else {
                              // handler w/ dynamic event name
                              addHandler(el, `"update:"+(${name})`, syncGen, null, false, warn, list[i], true // dynamic
                              );
                          }
                      }
                  }
                  if ((modifiers && modifiers.prop) ||
                      (!el.component && platformMustUseProp(el.tag, el.attrsMap.type, name))) {
                      addProp(el, name, value, list[i], isDynamic);
                  }
                  else {
                      addAttr(el, name, value, list[i], isDynamic);
                  }
              }
              else if (onRE.test(name)) {
                  // v-on
                  name = name.replace(onRE, '');
                  isDynamic = dynamicArgRE.test(name);
                  if (isDynamic) {
                      name = name.slice(1, -1);
                  }
                  addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic);
              }
              else {
                  // normal directives
                  name = name.replace(dirRE, '');
                  // parse arg
                  const argMatch = name.match(argRE);
                  let arg = argMatch && argMatch[1];
                  isDynamic = false;
                  if (arg) {
                      name = name.slice(0, -(arg.length + 1));
                      if (dynamicArgRE.test(arg)) {
                          arg = arg.slice(1, -1);
                          isDynamic = true;
                      }
                  }
                  addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
                  if (name === 'model') {
                      checkForAliasModel(el, value);
                  }
              }
          }
          else {
              // literal attribute
              {
                  const res = parseText(value, delimiters);
                  if (res) {
                      warn(`${name}="${value}": ` +
                          'Interpolation inside attributes has been removed. ' +
                          'Use v-bind or the colon shorthand instead. For example, ' +
                          'instead of <div id="{{ val }}">, use <div :id="val">.', list[i]);
                  }
              }
              addAttr(el, name, JSON.stringify(value), list[i]);
              // #6887 firefox doesn't update muted state if set via attribute
              // even immediately after element creation
              if (!el.component &&
                  name === 'muted' &&
                  platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                  addProp(el, name, 'true', list[i]);
              }
          }
      }
  }
  function checkInFor(el) {
      let parent = el;
      while (parent) {
          if (parent.for !== undefined) {
              return true;
          }
          parent = parent.parent;
      }
      return false;
  }
  function parseModifiers(name) {
      const match = name.match(modifierRE);
      if (match) {
          const ret = {};
          match.forEach(m => {
              ret[m.slice(1)] = true;
          });
          return ret;
      }
  }
  function makeAttrsMap(attrs) {
      const map = {};
      for (let i = 0, l = attrs.length; i < l; i++) {
          if (map[attrs[i].name] && !isIE && !isEdge) {
              warn('duplicate attribute: ' + attrs[i].name, attrs[i]);
          }
          map[attrs[i].name] = attrs[i].value;
      }
      return map;
  }
  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag(el) {
      return el.tag === 'script' || el.tag === 'style';
  }
  function isForbiddenTag(el) {
      return (el.tag === 'style' ||
          (el.tag === 'script' &&
              (!el.attrsMap.type || el.attrsMap.type === 'text/javascript')));
  }
  const ieNSBug = /^xmlns:NS\d+/;
  const ieNSPrefix = /^NS\d+:/;
  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
      const res = [];
      for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          if (!ieNSBug.test(attr.name)) {
              attr.name = attr.name.replace(ieNSPrefix, '');
              res.push(attr);
          }
      }
      return res;
  }
  function checkForAliasModel(el, value) {
      let _el = el;
      while (_el) {
          if (_el.for && _el.alias === value) {
              warn(`<${el.tag} v-model="${value}">: ` +
                  `You are binding v-model directly to a v-for iteration alias. ` +
                  `This will not be able to modify the v-for source array because ` +
                  `writing to the alias is like modifying a function local variable. ` +
                  `Consider using an array of objects and use v-model on an object property instead.`, el.rawAttrsMap['v-model']);
          }
          _el = _el.parent;
      }
  }

  /**
   * Expand input[v-model] with dynamic type bindings into v-if-else chains
   * Turn this:
   *   <input v-model="data[type]" :type="type">
   * into this:
   *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
   *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
   *   <input v-else :type="type" v-model="data[type]">
   */
  function preTransformNode(el, options) {
      if (el.tag === 'input') {
          const map = el.attrsMap;
          if (!map['v-model']) {
              return;
          }
          let typeBinding;
          if (map[':type'] || map['v-bind:type']) {
              typeBinding = getBindingAttr(el, 'type');
          }
          if (!map.type && !typeBinding && map['v-bind']) {
              typeBinding = `(${map['v-bind']}).type`;
          }
          if (typeBinding) {
              const ifCondition = getAndRemoveAttr(el, 'v-if', true);
              const ifConditionExtra = ifCondition ? `&&(${ifCondition})` : ``;
              const hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
              const elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
              // 1. checkbox
              const branch0 = cloneASTElement(el);
              // process for on the main node
              processFor(branch0);
              addRawAttr(branch0, 'type', 'checkbox');
              processElement(branch0, options);
              branch0.processed = true; // prevent it from double-processed
              branch0.if = `(${typeBinding})==='checkbox'` + ifConditionExtra;
              addIfCondition(branch0, {
                  exp: branch0.if,
                  block: branch0
              });
              // 2. add radio else-if condition
              const branch1 = cloneASTElement(el);
              getAndRemoveAttr(branch1, 'v-for', true);
              addRawAttr(branch1, 'type', 'radio');
              processElement(branch1, options);
              addIfCondition(branch0, {
                  exp: `(${typeBinding})==='radio'` + ifConditionExtra,
                  block: branch1
              });
              // 3. other
              const branch2 = cloneASTElement(el);
              getAndRemoveAttr(branch2, 'v-for', true);
              addRawAttr(branch2, ':type', typeBinding);
              processElement(branch2, options);
              addIfCondition(branch0, {
                  exp: ifCondition,
                  block: branch2
              });
              if (hasElse) {
                  branch0.else = true;
              }
              else if (elseIfCondition) {
                  branch0.elseif = elseIfCondition;
              }
              return branch0;
          }
      }
  }
  function cloneASTElement(el) {
      return createASTElement(el.tag, el.attrsList.slice(), el.parent);
  }
  var model = {
      preTransformNode
  };

  var modules = [klass, style, model];

  function text(el, dir) {
      if (dir.value) {
          addProp(el, 'textContent', `_s(${dir.value})`, dir);
      }
  }

  function html(el, dir) {
      if (dir.value) {
          addProp(el, 'innerHTML', `_s(${dir.value})`, dir);
      }
  }

  var directives = {
      model: model$1,
      text,
      html
  };

  const baseOptions = {
      expectHTML: true,
      modules,
      directives,
      isPreTag,
      isUnaryTag,
      mustUseProp,
      canBeLeftOpenTag,
      isReservedTag,
      getTagNamespace,
      staticKeys: genStaticKeys$1(modules)
  };

  let isStaticKey;
  let isPlatformReservedTag;
  const genStaticKeysCached = cached(genStaticKeys);
  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize(root, options) {
      if (!root)
          return;
      isStaticKey = genStaticKeysCached(options.staticKeys || '');
      isPlatformReservedTag = options.isReservedTag || no;
      // first pass: mark all non-static nodes.
      markStatic(root);
      // second pass: mark static roots.
      markStaticRoots(root, false);
  }
  function genStaticKeys(keys) {
      return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
          (keys ? ',' + keys : ''));
  }
  function markStatic(node) {
      node.static = isStatic(node);
      if (node.type === 1) {
          // do not make component slot content static. this avoids
          // 1. components not able to mutate slot nodes
          // 2. static slot content fails for hot-reloading
          if (!isPlatformReservedTag(node.tag) &&
              node.tag !== 'slot' &&
              node.attrsMap['inline-template'] == null) {
              return;
          }
          for (let i = 0, l = node.children.length; i < l; i++) {
              const child = node.children[i];
              markStatic(child);
              if (!child.static) {
                  node.static = false;
              }
          }
          if (node.ifConditions) {
              for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                  const block = node.ifConditions[i].block;
                  markStatic(block);
                  if (!block.static) {
                      node.static = false;
                  }
              }
          }
      }
  }
  function markStaticRoots(node, isInFor) {
      if (node.type === 1) {
          if (node.static || node.once) {
              node.staticInFor = isInFor;
          }
          // For a node to qualify as a static root, it should have children that
          // are not just static text. Otherwise the cost of hoisting out will
          // outweigh the benefits and it's better off to just always render it fresh.
          if (node.static &&
              node.children.length &&
              !(node.children.length === 1 && node.children[0].type === 3)) {
              node.staticRoot = true;
              return;
          }
          else {
              node.staticRoot = false;
          }
          if (node.children) {
              for (let i = 0, l = node.children.length; i < l; i++) {
                  markStaticRoots(node.children[i], isInFor || !!node.for);
              }
          }
          if (node.ifConditions) {
              for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                  markStaticRoots(node.ifConditions[i].block, isInFor);
              }
          }
      }
  }
  function isStatic(node) {
      if (node.type === 2) {
          // expression
          return false;
      }
      if (node.type === 3) {
          // text
          return true;
      }
      return !!(node.pre ||
          (!node.hasBindings && // no dynamic bindings
              !node.if &&
              !node.for && // not v-if or v-for or v-else
              !isBuiltInTag(node.tag) && // not a built-in
              isPlatformReservedTag(node.tag) && // not a component
              !isDirectChildOfTemplateFor(node) &&
              Object.keys(node).every(isStaticKey)));
  }
  function isDirectChildOfTemplateFor(node) {
      while (node.parent) {
          node = node.parent;
          if (node.tag !== 'template') {
              return false;
          }
          if (node.for) {
              return true;
          }
      }
      return false;
  }

  const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
  const fnInvokeRE = /\([^)]*?\);*$/;
  const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
  // KeyboardEvent.keyCode aliases
  const keyCodes = {
      esc: 27,
      tab: 9,
      enter: 13,
      space: 32,
      up: 38,
      left: 37,
      right: 39,
      down: 40,
      delete: [8, 46]
  };
  // KeyboardEvent.key aliases
  const keyNames = {
      // #7880: IE11 and Edge use `Esc` for Escape key name.
      esc: ['Esc', 'Escape'],
      tab: 'Tab',
      enter: 'Enter',
      // #9112: IE11 uses `Spacebar` for Space key name.
      space: [' ', 'Spacebar'],
      // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
      up: ['Up', 'ArrowUp'],
      left: ['Left', 'ArrowLeft'],
      right: ['Right', 'ArrowRight'],
      down: ['Down', 'ArrowDown'],
      // #9112: IE11 uses `Del` for Delete key name.
      delete: ['Backspace', 'Delete', 'Del']
  };
  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  const genGuard = condition => `if(${condition})return null;`;
  const modifierCode = {
      stop: '$event.stopPropagation();',
      prevent: '$event.preventDefault();',
      self: genGuard(`$event.target !== $event.currentTarget`),
      ctrl: genGuard(`!$event.ctrlKey`),
      shift: genGuard(`!$event.shiftKey`),
      alt: genGuard(`!$event.altKey`),
      meta: genGuard(`!$event.metaKey`),
      left: genGuard(`'button' in $event && $event.button !== 0`),
      middle: genGuard(`'button' in $event && $event.button !== 1`),
      right: genGuard(`'button' in $event && $event.button !== 2`)
  };
  function genHandlers(events, isNative) {
      const prefix = isNative ? 'nativeOn:' : 'on:';
      let staticHandlers = ``;
      let dynamicHandlers = ``;
      for (const name in events) {
          const handlerCode = genHandler(events[name]);
          //@ts-expect-error
          if (events[name] && events[name].dynamic) {
              dynamicHandlers += `${name},${handlerCode},`;
          }
          else {
              staticHandlers += `"${name}":${handlerCode},`;
          }
      }
      staticHandlers = `{${staticHandlers.slice(0, -1)}}`;
      if (dynamicHandlers) {
          return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`;
      }
      else {
          return prefix + staticHandlers;
      }
  }
  function genHandler(handler) {
      if (!handler) {
          return 'function(){}';
      }
      if (Array.isArray(handler)) {
          return `[${handler.map(handler => genHandler(handler)).join(',')}]`;
      }
      const isMethodPath = simplePathRE.test(handler.value);
      const isFunctionExpression = fnExpRE.test(handler.value);
      const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));
      if (!handler.modifiers) {
          if (isMethodPath || isFunctionExpression) {
              return handler.value;
          }
          return `function($event){${isFunctionInvocation ? `return ${handler.value}` : handler.value}}`; // inline statement
      }
      else {
          let code = '';
          let genModifierCode = '';
          const keys = [];
          for (const key in handler.modifiers) {
              if (modifierCode[key]) {
                  genModifierCode += modifierCode[key];
                  // left/right
                  if (keyCodes[key]) {
                      keys.push(key);
                  }
              }
              else if (key === 'exact') {
                  const modifiers = handler.modifiers;
                  genModifierCode += genGuard(['ctrl', 'shift', 'alt', 'meta']
                      .filter(keyModifier => !modifiers[keyModifier])
                      .map(keyModifier => `$event.${keyModifier}Key`)
                      .join('||'));
              }
              else {
                  keys.push(key);
              }
          }
          if (keys.length) {
              code += genKeyFilter(keys);
          }
          // Make sure modifiers like prevent and stop get executed after key filtering
          if (genModifierCode) {
              code += genModifierCode;
          }
          const handlerCode = isMethodPath
              ? `return ${handler.value}.apply(null, arguments)`
              : isFunctionExpression
                  ? `return (${handler.value}).apply(null, arguments)`
                  : isFunctionInvocation
                      ? `return ${handler.value}`
                      : handler.value;
          return `function($event){${code}${handlerCode}}`;
      }
  }
  function genKeyFilter(keys) {
      return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      `if(!$event.type.indexOf('key')&&` +
          `${keys.map(genFilterCode).join('&&')})return null;`);
  }
  function genFilterCode(key) {
      const keyVal = parseInt(key, 10);
      if (keyVal) {
          return `$event.keyCode!==${keyVal}`;
      }
      const keyCode = keyCodes[key];
      const keyName = keyNames[key];
      return (`_k($event.keyCode,` +
          `${JSON.stringify(key)},` +
          `${JSON.stringify(keyCode)},` +
          `$event.key,` +
          `${JSON.stringify(keyName)}` +
          `)`);
  }

  function on(el, dir) {
      if (dir.modifiers) {
          warn$2(`v-on without argument does not support modifiers.`);
      }
      el.wrapListeners = (code) => `_g(${code},${dir.value})`;
  }

  function bind$2(el, dir) {
      el.wrapData = (code) => {
          return `_b(${code},'${el.tag}',${dir.value},${dir.modifiers && dir.modifiers.prop ? 'true' : 'false'}${dir.modifiers && dir.modifiers.sync ? ',true' : ''})`;
      };
  }

  var baseDirectives = {
      on,
      bind: bind$2,
      cloak: noop
  };

  class CodegenState {
      constructor(options) {
          this.options = options;
          this.warn = options.warn || baseWarn;
          this.transforms = pluckModuleFunction(options.modules, 'transformCode');
          this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
          this.directives = extend$1(extend$1({}, baseDirectives), options.directives);
          const isReservedTag = options.isReservedTag || no;
          this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);
          this.onceId = 0;
          this.staticRenderFns = [];
          this.pre = false;
      }
  }
  function generate(ast, options) {
      const state = new CodegenState(options);
      // fix #11483, Root level <script> tags should not be rendered.
      const code = ast
          ? ast.tag === 'script'
              ? 'null'
              : genElement(ast, state)
          : '_c("div")';
      return {
          render: `with(this){return ${code}}`,
          staticRenderFns: state.staticRenderFns
      };
  }
  function genElement(el, state) {
      if (el.parent) {
          el.pre = el.pre || el.parent.pre;
      }
      if (el.staticRoot && !el.staticProcessed) {
          return genStatic(el, state);
      }
      else if (el.once && !el.onceProcessed) {
          return genOnce(el, state);
      }
      else if (el.for && !el.forProcessed) {
          return genFor(el, state);
      }
      else if (el.if && !el.ifProcessed) {
          return genIf(el, state);
      }
      else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
          return genChildren(el, state) || 'void 0';
      }
      else if (el.tag === 'slot') {
          return genSlot(el, state);
      }
      else {
          // component or element
          let code;
          if (el.component) {
              code = genComponent(el.component, el, state);
          }
          else {
              let data;
              const maybeComponent = state.maybeComponent(el);
              if (!el.plain || (el.pre && maybeComponent)) {
                  data = genData(el, state);
              }
              let tag;
              // check if this is a component in <script setup>
              const bindings = state.options.bindings;
              if (maybeComponent && bindings && bindings.__isScriptSetup !== false) {
                  tag = checkBindingType(bindings, el.tag);
              }
              if (!tag)
                  tag = `'${el.tag}'`;
              const children = el.inlineTemplate ? null : genChildren(el, state, true);
              code = `_c(${tag}${data ? `,${data}` : '' // data
            }${children ? `,${children}` : '' // children
            })`;
          }
          // module transforms
          for (let i = 0; i < state.transforms.length; i++) {
              code = state.transforms[i](el, code);
          }
          return code;
      }
  }
  function checkBindingType(bindings, key) {
      const camelName = camelize(key);
      const PascalName = capitalize(camelName);
      const checkType = (type) => {
          if (bindings[key] === type) {
              return key;
          }
          if (bindings[camelName] === type) {
              return camelName;
          }
          if (bindings[PascalName] === type) {
              return PascalName;
          }
      };
      const fromConst = checkType("setup-const" /* BindingTypes.SETUP_CONST */) ||
          checkType("setup-reactive-const" /* BindingTypes.SETUP_REACTIVE_CONST */);
      if (fromConst) {
          return fromConst;
      }
      const fromMaybeRef = checkType("setup-let" /* BindingTypes.SETUP_LET */) ||
          checkType("setup-ref" /* BindingTypes.SETUP_REF */) ||
          checkType("setup-maybe-ref" /* BindingTypes.SETUP_MAYBE_REF */);
      if (fromMaybeRef) {
          return fromMaybeRef;
      }
  }
  // hoist static sub-trees out
  function genStatic(el, state) {
      el.staticProcessed = true;
      // Some elements (templates) need to behave differently inside of a v-pre
      // node.  All pre nodes are static roots, so we can use this as a location to
      // wrap a state change and reset it upon exiting the pre node.
      const originalPreState = state.pre;
      if (el.pre) {
          state.pre = el.pre;
      }
      state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`);
      state.pre = originalPreState;
      return `_m(${state.staticRenderFns.length - 1}${el.staticInFor ? ',true' : ''})`;
  }
  // v-once
  function genOnce(el, state) {
      el.onceProcessed = true;
      if (el.if && !el.ifProcessed) {
          return genIf(el, state);
      }
      else if (el.staticInFor) {
          let key = '';
          let parent = el.parent;
          while (parent) {
              if (parent.for) {
                  key = parent.key;
                  break;
              }
              parent = parent.parent;
          }
          if (!key) {
              state.warn(`v-once can only be used inside v-for that is keyed. `, el.rawAttrsMap['v-once']);
              return genElement(el, state);
          }
          return `_o(${genElement(el, state)},${state.onceId++},${key})`;
      }
      else {
          return genStatic(el, state);
      }
  }
  function genIf(el, state, altGen, altEmpty) {
      el.ifProcessed = true; // avoid recursion
      return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
  }
  function genIfConditions(conditions, state, altGen, altEmpty) {
      if (!conditions.length) {
          return altEmpty || '_e()';
      }
      const condition = conditions.shift();
      if (condition.exp) {
          return `(${condition.exp})?${genTernaryExp(condition.block)}:${genIfConditions(conditions, state, altGen, altEmpty)}`;
      }
      else {
          return `${genTernaryExp(condition.block)}`;
      }
      // v-if with v-once should generate code like (a)?_m(0):_m(1)
      function genTernaryExp(el) {
          return altGen
              ? altGen(el, state)
              : el.once
                  ? genOnce(el, state)
                  : genElement(el, state);
      }
  }
  function genFor(el, state, altGen, altHelper) {
      const exp = el.for;
      const alias = el.alias;
      const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
      const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';
      if (state.maybeComponent(el) &&
          el.tag !== 'slot' &&
          el.tag !== 'template' &&
          !el.key) {
          state.warn(`<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
              `v-for should have explicit keys. ` +
              `See https://v2.vuejs.org/v2/guide/list.html#key for more info.`, el.rawAttrsMap['v-for'], true /* tip */);
      }
      el.forProcessed = true; // avoid recursion
      return (`${altHelper || '_l'}((${exp}),` +
          `function(${alias}${iterator1}${iterator2}){` +
          `return ${(altGen || genElement)(el, state)}` +
          '})');
  }
  function genData(el, state) {
      let data = '{';
      // directives first.
      // directives may mutate the el's other properties before they are generated.
      const dirs = genDirectives(el, state);
      if (dirs)
          data += dirs + ',';
      // key
      if (el.key) {
          data += `key:${el.key},`;
      }
      // ref
      if (el.ref) {
          data += `ref:${el.ref},`;
      }
      if (el.refInFor) {
          data += `refInFor:true,`;
      }
      // pre
      if (el.pre) {
          data += `pre:true,`;
      }
      // record original tag name for components using "is" attribute
      if (el.component) {
          data += `tag:"${el.tag}",`;
      }
      // module data generation functions
      for (let i = 0; i < state.dataGenFns.length; i++) {
          data += state.dataGenFns[i](el);
      }
      // attributes
      if (el.attrs) {
          data += `attrs:${genProps(el.attrs)},`;
      }
      // DOM props
      if (el.props) {
          data += `domProps:${genProps(el.props)},`;
      }
      // event handlers
      if (el.events) {
          data += `${genHandlers(el.events, false)},`;
      }
      if (el.nativeEvents) {
          data += `${genHandlers(el.nativeEvents, true)},`;
      }
      // slot target
      // only for non-scoped slots
      if (el.slotTarget && !el.slotScope) {
          data += `slot:${el.slotTarget},`;
      }
      // scoped slots
      if (el.scopedSlots) {
          data += `${genScopedSlots(el, el.scopedSlots, state)},`;
      }
      // component v-model
      if (el.model) {
          data += `model:{value:${el.model.value},callback:${el.model.callback},expression:${el.model.expression}},`;
      }
      // inline-template
      if (el.inlineTemplate) {
          const inlineTemplate = genInlineTemplate(el, state);
          if (inlineTemplate) {
              data += `${inlineTemplate},`;
          }
      }
      data = data.replace(/,$/, '') + '}';
      // v-bind dynamic argument wrap
      // v-bind with dynamic arguments must be applied using the same v-bind object
      // merge helper so that class/style/mustUseProp attrs are handled correctly.
      if (el.dynamicAttrs) {
          data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`;
      }
      // v-bind data wrap
      if (el.wrapData) {
          data = el.wrapData(data);
      }
      // v-on data wrap
      if (el.wrapListeners) {
          data = el.wrapListeners(data);
      }
      return data;
  }
  function genDirectives(el, state) {
      const dirs = el.directives;
      if (!dirs)
          return;
      let res = 'directives:[';
      let hasRuntime = false;
      let i, l, dir, needRuntime;
      for (i = 0, l = dirs.length; i < l; i++) {
          dir = dirs[i];
          needRuntime = true;
          const gen = state.directives[dir.name];
          if (gen) {
              // compile-time directive that manipulates AST.
              // returns true if it also needs a runtime counterpart.
              needRuntime = !!gen(el, dir, state.warn);
          }
          if (needRuntime) {
              hasRuntime = true;
              res += `{name:"${dir.name}",rawName:"${dir.rawName}"${dir.value
                ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}`
                : ''}${dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''}${dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''}},`;
          }
      }
      if (hasRuntime) {
          return res.slice(0, -1) + ']';
      }
  }
  function genInlineTemplate(el, state) {
      const ast = el.children[0];
      if ((el.children.length !== 1 || ast.type !== 1)) {
          state.warn('Inline-template components must have exactly one child element.', { start: el.start });
      }
      if (ast && ast.type === 1) {
          const inlineRenderFns = generate(ast, state.options);
          return `inlineTemplate:{render:function(){${inlineRenderFns.render}},staticRenderFns:[${inlineRenderFns.staticRenderFns
            .map(code => `function(){${code}}`)
            .join(',')}]}`;
      }
  }
  function genScopedSlots(el, slots, state) {
      // by default scoped slots are considered "stable", this allows child
      // components with only scoped slots to skip forced updates from parent.
      // but in some cases we have to bail-out of this optimization
      // for example if the slot contains dynamic names, has v-if or v-for on them...
      let needsForceUpdate = el.for ||
          Object.keys(slots).some(key => {
              const slot = slots[key];
              return (slot.slotTargetDynamic || slot.if || slot.for || containsSlotChild(slot) // is passing down slot from parent which may be dynamic
              );
          });
      // #9534: if a component with scoped slots is inside a conditional branch,
      // it's possible for the same component to be reused but with different
      // compiled slot content. To avoid that, we generate a unique key based on
      // the generated code of all the slot contents.
      let needsKey = !!el.if;
      // OR when it is inside another scoped slot or v-for (the reactivity may be
      // disconnected due to the intermediate scope variable)
      // #9438, #9506
      // TODO: this can be further optimized by properly analyzing in-scope bindings
      // and skip force updating ones that do not actually use scope variables.
      if (!needsForceUpdate) {
          let parent = el.parent;
          while (parent) {
              if ((parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
                  parent.for) {
                  needsForceUpdate = true;
                  break;
              }
              if (parent.if) {
                  needsKey = true;
              }
              parent = parent.parent;
          }
      }
      const generatedSlots = Object.keys(slots)
          .map(key => genScopedSlot(slots[key], state))
          .join(',');
      return `scopedSlots:_u([${generatedSlots}]${needsForceUpdate ? `,null,true` : ``}${!needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``})`;
  }
  function hash(str) {
      let hash = 5381;
      let i = str.length;
      while (i) {
          hash = (hash * 33) ^ str.charCodeAt(--i);
      }
      return hash >>> 0;
  }
  function containsSlotChild(el) {
      if (el.type === 1) {
          if (el.tag === 'slot') {
              return true;
          }
          return el.children.some(containsSlotChild);
      }
      return false;
  }
  function genScopedSlot(el, state) {
      const isLegacySyntax = el.attrsMap['slot-scope'];
      if (el.if && !el.ifProcessed && !isLegacySyntax) {
          return genIf(el, state, genScopedSlot, `null`);
      }
      if (el.for && !el.forProcessed) {
          return genFor(el, state, genScopedSlot);
      }
      const slotScope = el.slotScope === emptySlotScopeToken ? `` : String(el.slotScope);
      const fn = `function(${slotScope}){` +
          `return ${el.tag === 'template'
            ? el.if && isLegacySyntax
                ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
                : genChildren(el, state) || 'undefined'
            : genElement(el, state)}}`;
      // reverse proxy v-slot without scope on this.$slots
      const reverseProxy = slotScope ? `` : `,proxy:true`;
      return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`;
  }
  function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
      const children = el.children;
      if (children.length) {
          const el = children[0];
          // optimize single v-for
          if (children.length === 1 &&
              el.for &&
              el.tag !== 'template' &&
              el.tag !== 'slot') {
              const normalizationType = checkSkip
                  ? state.maybeComponent(el)
                      ? `,1`
                      : `,0`
                  : ``;
              return `${(altGenElement || genElement)(el, state)}${normalizationType}`;
          }
          const normalizationType = checkSkip
              ? getNormalizationType(children, state.maybeComponent)
              : 0;
          const gen = altGenNode || genNode;
          return `[${children.map(c => gen(c, state)).join(',')}]${normalizationType ? `,${normalizationType}` : ''}`;
      }
  }
  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(children, maybeComponent) {
      let res = 0;
      for (let i = 0; i < children.length; i++) {
          const el = children[i];
          if (el.type !== 1) {
              continue;
          }
          if (needsNormalization(el) ||
              (el.ifConditions &&
                  el.ifConditions.some(c => needsNormalization(c.block)))) {
              res = 2;
              break;
          }
          if (maybeComponent(el) ||
              (el.ifConditions && el.ifConditions.some(c => maybeComponent(c.block)))) {
              res = 1;
          }
      }
      return res;
  }
  function needsNormalization(el) {
      return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
  }
  function genNode(node, state) {
      if (node.type === 1) {
          return genElement(node, state);
      }
      else if (node.type === 3 && node.isComment) {
          return genComment(node);
      }
      else {
          return genText(node);
      }
  }
  function genText(text) {
      return `_v(${text.type === 2
        ? text.expression // no need for () because already wrapped in _s()
        : transformSpecialNewlines(JSON.stringify(text.text))})`;
  }
  function genComment(comment) {
      return `_e(${JSON.stringify(comment.text)})`;
  }
  function genSlot(el, state) {
      const slotName = el.slotName || '"default"';
      const children = genChildren(el, state);
      let res = `_t(${slotName}${children ? `,function(){return ${children}}` : ''}`;
      const attrs = el.attrs || el.dynamicAttrs
          ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
              // slot props are camelized
              name: camelize(attr.name),
              value: attr.value,
              dynamic: attr.dynamic
          })))
          : null;
      const bind = el.attrsMap['v-bind'];
      if ((attrs || bind) && !children) {
          res += `,null`;
      }
      if (attrs) {
          res += `,${attrs}`;
      }
      if (bind) {
          res += `${attrs ? '' : ',null'},${bind}`;
      }
      return res + ')';
  }
  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent(componentName, el, state) {
      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      return `_c(${componentName},${genData(el, state)}${children ? `,${children}` : ''})`;
  }
  function genProps(props) {
      let staticProps = ``;
      let dynamicProps = ``;
      for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          const value = transformSpecialNewlines(prop.value);
          if (prop.dynamic) {
              dynamicProps += `${prop.name},${value},`;
          }
          else {
              staticProps += `"${prop.name}":${value},`;
          }
      }
      staticProps = `{${staticProps.slice(0, -1)}}`;
      if (dynamicProps) {
          return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`;
      }
      else {
          return staticProps;
      }
  }
  // #3895, #4268
  function transformSpecialNewlines(text) {
      return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  const prohibitedKeywordRE = new RegExp('\\b' +
      ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
          'super,throw,while,yield,delete,export,import,return,switch,default,' +
          'extends,finally,continue,debugger,function,arguments')
          .split(',')
          .join('\\b|\\b') +
      '\\b');
  // these unary operators should not be used as property/method names
  const unaryOperatorsRE = new RegExp('\\b' +
      'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') +
      '\\s*\\([^\\)]*\\)');
  // strip strings in expressions
  const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
  // detect problematic expressions in a template
  function detectErrors(ast, warn) {
      if (ast) {
          checkNode(ast, warn);
      }
  }
  function checkNode(node, warn) {
      if (node.type === 1) {
          for (const name in node.attrsMap) {
              if (dirRE.test(name)) {
                  const value = node.attrsMap[name];
                  if (value) {
                      const range = node.rawAttrsMap[name];
                      if (name === 'v-for') {
                          checkFor(node, `v-for="${value}"`, warn, range);
                      }
                      else if (name === 'v-slot' || name[0] === '#') {
                          checkFunctionParameterExpression(value, `${name}="${value}"`, warn, range);
                      }
                      else if (onRE.test(name)) {
                          checkEvent(value, `${name}="${value}"`, warn, range);
                      }
                      else {
                          checkExpression(value, `${name}="${value}"`, warn, range);
                      }
                  }
              }
          }
          if (node.children) {
              for (let i = 0; i < node.children.length; i++) {
                  checkNode(node.children[i], warn);
              }
          }
      }
      else if (node.type === 2) {
          checkExpression(node.expression, node.text, warn, node);
      }
  }
  function checkEvent(exp, text, warn, range) {
      const stripped = exp.replace(stripStringRE, '');
      const keywordMatch = stripped.match(unaryOperatorsRE);
      if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
          warn(`avoid using JavaScript unary operator as property name: ` +
              `"${keywordMatch[0]}" in expression ${text.trim()}`, range);
      }
      checkExpression(exp, text, warn, range);
  }
  function checkFor(node, text, warn, range) {
      checkExpression(node.for || '', text, warn, range);
      checkIdentifier(node.alias, 'v-for alias', text, warn, range);
      checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
      checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }
  function checkIdentifier(ident, type, text, warn, range) {
      if (typeof ident === 'string') {
          try {
              new Function(`var ${ident}=_`);
          }
          catch (e) {
              warn(`invalid ${type} "${ident}" in expression: ${text.trim()}`, range);
          }
      }
  }
  function checkExpression(exp, text, warn, range) {
      try {
          new Function(`return ${exp}`);
      }
      catch (e) {
          const keywordMatch = exp
              .replace(stripStringRE, '')
              .match(prohibitedKeywordRE);
          if (keywordMatch) {
              warn(`avoid using JavaScript keyword as property name: ` +
                  `"${keywordMatch[0]}"\n  Raw expression: ${text.trim()}`, range);
          }
          else {
              warn(`invalid expression: ${e.message} in\n\n` +
                  `    ${exp}\n\n` +
                  `  Raw expression: ${text.trim()}\n`, range);
          }
      }
  }
  function checkFunctionParameterExpression(exp, text, warn, range) {
      try {
          new Function(exp, '');
      }
      catch (e) {
          warn(`invalid function parameter expression: ${e.message} in\n\n` +
              `    ${exp}\n\n` +
              `  Raw expression: ${text.trim()}\n`, range);
      }
  }

  const range = 2;
  function generateCodeFrame(source, start = 0, end = source.length) {
      const lines = source.split(/\r?\n/);
      let count = 0;
      const res = [];
      for (let i = 0; i < lines.length; i++) {
          count += lines[i].length + 1;
          if (count >= start) {
              for (let j = i - range; j <= i + range || end > count; j++) {
                  if (j < 0 || j >= lines.length)
                      continue;
                  res.push(`${j + 1}${repeat(` `, 3 - String(j + 1).length)}|  ${lines[j]}`);
                  const lineLength = lines[j].length;
                  if (j === i) {
                      // push underline
                      const pad = start - (count - lineLength) + 1;
                      const length = end > count ? lineLength - pad : end - start;
                      res.push(`   |  ` + repeat(` `, pad) + repeat(`^`, length));
                  }
                  else if (j > i) {
                      if (end > count) {
                          const length = Math.min(end - count, lineLength);
                          res.push(`   |  ` + repeat(`^`, length));
                      }
                      count += lineLength + 1;
                  }
              }
              break;
          }
      }
      return res.join('\n');
  }
  function repeat(str, n) {
      let result = '';
      if (n > 0) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
              // eslint-disable-line
              if (n & 1)
                  result += str;
              n >>>= 1;
              if (n <= 0)
                  break;
              str += str;
          }
      }
      return result;
  }

  function createFunction(code, errors) {
      try {
          return new Function(code);
      }
      catch (err) {
          errors.push({ err, code });
          return noop;
      }
  }
  function createCompileToFunctionFn(compile) {
      const cache = Object.create(null);
      return function compileToFunctions(template, options, vm) {
          options = extend$1({}, options);
          const warn = options.warn || warn$2;
          delete options.warn;
          /* istanbul ignore if */
          {
              // detect possible CSP restriction
              try {
                  new Function('return 1');
              }
              catch (e) {
                  if (e.toString().match(/unsafe-eval|CSP/)) {
                      warn('It seems you are using the standalone build of Vue.js in an ' +
                          'environment with Content Security Policy that prohibits unsafe-eval. ' +
                          'The template compiler cannot work in this environment. Consider ' +
                          'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                          'templates into render functions.');
                  }
              }
          }
          // check cache
          const key = options.delimiters
              ? String(options.delimiters) + template
              : template;
          if (cache[key]) {
              return cache[key];
          }
          // compile
          const compiled = compile(template, options);
          // check compilation errors/tips
          {
              if (compiled.errors && compiled.errors.length) {
                  if (options.outputSourceRange) {
                      compiled.errors.forEach(e => {
                          warn(`Error compiling template:\n\n${e.msg}\n\n` +
                              generateCodeFrame(template, e.start, e.end), vm);
                      });
                  }
                  else {
                      warn(`Error compiling template:\n\n${template}\n\n` +
                          compiled.errors.map(e => `- ${e}`).join('\n') +
                          '\n', vm);
                  }
              }
              if (compiled.tips && compiled.tips.length) {
                  if (options.outputSourceRange) {
                      compiled.tips.forEach(e => tip(e.msg, vm));
                  }
                  else {
                      compiled.tips.forEach(msg => tip(msg, vm));
                  }
              }
          }
          // turn code into functions
          const res = {};
          const fnGenErrors = [];
          res.render = createFunction(compiled.render, fnGenErrors);
          res.staticRenderFns = compiled.staticRenderFns.map(code => {
              return createFunction(code, fnGenErrors);
          });
          // check function generation errors.
          // this should only happen if there is a bug in the compiler itself.
          // mostly for codegen development use
          /* istanbul ignore if */
          {
              if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                  warn(`Failed to generate render function:\n\n` +
                      fnGenErrors
                          .map(({ err, code }) => `${err.toString()} in\n\n${code}\n`)
                          .join('\n'), vm);
              }
          }
          return (cache[key] = res);
      };
  }

  function createCompilerCreator(baseCompile) {
      return function createCompiler(baseOptions) {
          function compile(template, options) {
              const finalOptions = Object.create(baseOptions);
              const errors = [];
              const tips = [];
              let warn = (msg, range, tip) => {
                  (tip ? tips : errors).push(msg);
              };
              if (options) {
                  if (options.outputSourceRange) {
                      // $flow-disable-line
                      const leadingSpaceLength = template.match(/^\s*/)[0].length;
                      warn = (msg, range, tip) => {
                          const data = typeof msg === 'string' ? { msg } : msg;
                          if (range) {
                              if (range.start != null) {
                                  data.start = range.start + leadingSpaceLength;
                              }
                              if (range.end != null) {
                                  data.end = range.end + leadingSpaceLength;
                              }
                          }
                          (tip ? tips : errors).push(data);
                      };
                  }
                  // merge custom modules
                  if (options.modules) {
                      finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
                  }
                  // merge custom directives
                  if (options.directives) {
                      finalOptions.directives = extend$1(Object.create(baseOptions.directives || null), options.directives);
                  }
                  // copy other options
                  for (const key in options) {
                      if (key !== 'modules' && key !== 'directives') {
                          finalOptions[key] = options[key];
                      }
                  }
              }
              finalOptions.warn = warn;
              const compiled = baseCompile(template.trim(), finalOptions);
              {
                  detectErrors(compiled.ast, warn);
              }
              compiled.errors = errors;
              compiled.tips = tips;
              return compiled;
          }
          return {
              compile,
              compileToFunctions: createCompileToFunctionFn(compile)
          };
      };
  }

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  const createCompiler = createCompilerCreator(function baseCompile(template, options) {
      const ast = parse(template.trim(), options);
      if (options.optimize !== false) {
          optimize(ast, options);
      }
      const code = generate(ast, options);
      return {
          ast,
          render: code.render,
          staticRenderFns: code.staticRenderFns
      };
  });

  const { compile, compileToFunctions } = createCompiler(baseOptions);

  // check whether current browser encodes a char inside attribute values
  let div;
  function getShouldDecode(href) {
      div = div || document.createElement('div');
      div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
      return div.innerHTML.indexOf('&#10;') > 0;
  }
  // #3663: IE encodes newlines inside attribute values while other browsers don't
  const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  const shouldDecodeNewlinesForHref = inBrowser
      ? getShouldDecode(true)
      : false;

  const idToTemplate = cached(id => {
      const el = query(id);
      return el && el.innerHTML;
  });
  const mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function (el, hydrating) {
      el = el && query(el);
      /* istanbul ignore if */
      if (el === document.body || el === document.documentElement) {
          warn$2(`Do not mount Vue to <html> or <body> - mount to normal elements instead.`);
          return this;
      }
      const options = this.$options;
      // resolve template/el and convert to render function
      if (!options.render) {
          let template = options.template;
          if (template) {
              if (typeof template === 'string') {
                  if (template.charAt(0) === '#') {
                      template = idToTemplate(template);
                      /* istanbul ignore if */
                      if (!template) {
                          warn$2(`Template element not found or is empty: ${options.template}`, this);
                      }
                  }
              }
              else if (template.nodeType) {
                  template = template.innerHTML;
              }
              else {
                  {
                      warn$2('invalid template option:' + template, this);
                  }
                  return this;
              }
          }
          else if (el) {
              // @ts-expect-error
              template = getOuterHTML(el);
          }
          if (template) {
              /* istanbul ignore if */
              if (config.performance && mark) {
                  mark('compile');
              }
              const { render, staticRenderFns } = compileToFunctions(template, {
                  outputSourceRange: true,
                  shouldDecodeNewlines,
                  shouldDecodeNewlinesForHref,
                  delimiters: options.delimiters,
                  comments: options.comments
              }, this);
              options.render = render;
              options.staticRenderFns = staticRenderFns;
              /* istanbul ignore if */
              if (config.performance && mark) {
                  mark('compile end');
                  measure(`vue ${this._name} compile`, 'compile', 'compile end');
              }
          }
      }
      return mount.call(this, el, hydrating);
  };
  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML(el) {
      if (el.outerHTML) {
          return el.outerHTML;
      }
      else {
          const container = document.createElement('div');
          container.appendChild(el.cloneNode(true));
          return container.innerHTML;
      }
  }
  Vue.compile = compileToFunctions;

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (g && (g = 0, op[0] && (_ = 0)), _) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var rngBrowser = createCommonjsModule(function (module) {
  // Unique ID creation requires a high quality random # generator.  In the
  // browser this is a little complicated due to unknown quality of Math.random()
  // and inconsistent support for the `crypto` API.  We do the best we can via
  // feature-detection

  // getRandomValues needs to be invoked in a context where "this" is a Crypto
  // implementation. Also, find the complete implementation of crypto on IE11.
  var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                        (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

  if (getRandomValues) {
    // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
    var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    module.exports = function whatwgRNG() {
      getRandomValues(rnds8);
      return rnds8;
    };
  } else {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var rnds = new Array(16);

    module.exports = function mathRNG() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return rnds;
    };
  }
  });

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return ([
      bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]]
    ]).join('');
  }

  var bytesToUuid_1 = bytesToUuid;

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || rngBrowser)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid_1(rnds);
  }

  var v4_1 = v4;

  var SYSTEM_INFO$1 = Object.assign({}, {
      type: 2,
      appid: '',
      developId: '',
      channelid: 'weile',
      deviceCode: 'channel-sdk-js',
      fromChannel: 'minigame',
      platformid: 0,
      channelAppId: '',
      reqUrlIndex: 0,
      publicKey: '',
      timezone: (new Date().getTimezoneOffset() / 60) * -1 || 8,
      __RX_SDK_VERSION: 'v3.10.14',
      SDK_INIT_FINISHED: false,
      errMsg: {
          default: ''
      },
      _baseUrlList: [],
      single_player_mode: false,
      need_active: false,
      logSwitch: true,
      login_config: {},
      region_tag: '',
      cp_role_id: '',
      isMatch: false,
      miniVersion: ''
  });
  var USER_INFO = {};

  var ERROR_CODE = 1000000;
  /**
   * https://nctpoatgf0.feishu.cn/docx/WnVFdpQGcohpiLxd94zcDS9unfh
   */
  var COMMON_ERROR_CODE = {
      UNKNOW_NETWORK_ERROR: 1000,
      TIMEOUT: 1131,
      REQUEST_ABORTED: 1132,
      NETWORK_ERROR: 1100,
      NOT_FOUND: 1401,
      INTERNAL_SERVER_ERROR: 1500,
      PARAMS_ERROR: 2000,
      INIT_PARAMS_ERROR: 2001,
      API_NOT_EXIST: 2002,
      PAY_PARAMS_ERROR: 4000,
      SHARE_CANCEL: 5001,
      SHARE_TRIGGER_OVERTIME: 5003,
      USER_INFO_AUTH_DENY: 6003,
      LOCATION_FAIL: 6020,
      LOCATION_AUTH_DENY: 6021,
      FRIENDINTERACTION_AUTH_DENY: 6022,
      GAMECLUBDATA_AUTH_DENY: 6023,
      ADD_SHORT_CUT: 7000,
      AD_LOAD_OVERTIME: 10000,
      CANCEL_PAY: 4001,
      PAY_ERROR: 4002,
      UNKNOWN_PAY_ERROR: 4003,
      CANCEL_JUMP_MINIGAME: 4004,
      PAY_GIFT_FINISH: 4005,
      LOGIN_FAIL: 3002,
      LOGIN_DENY: 3001,
      UNKNOWN: 9000
  };

  function printLog() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      if (SYSTEM_INFO$1.logSwitch) {
          console.info(args);
      }
  }
  var qs = {
      stringify: function (obj) {
          var str = '';
          for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                  str += '&' + key + '=' + obj[key];
              }
          }
          return str.slice(1);
      },
      parse: function (params) {
          if (!params)
              return {};
          var query = params.split('&');
          var res = {};
          for (var key in query) {
              if (query.hasOwnProperty(key)) {
                  var arr = query[key].split('=');
                  res[arr[0]] = arr[1];
              }
          }
          return res;
      }
  };
  var getConfigErrMsg = function (code, thirdcode, thirdmsg) {
      var msg = SYSTEM_INFO$1.errMsg[code] || SYSTEM_INFO$1.errMsg.default || '';
      return msg.replace(/\$code\$/g, code || '').replace(/\$thirdcode\$/g, thirdcode || '').replace(/\$thirdmsg\$/g, thirdmsg || '');
  };
  var handleError = function (err, code) {
      var _code = code || err.code || err.errCode || err.errorCode || err.err_code || err.error || err.errNo || err.errno || ERROR_CODE;
      var _thirdcode = err.thirdcode || err.thirdCode || err.errCode || err.errorCode || err.err_code || err.errNo || err.errno || err.error || err.code;
      var _thirdmsg = err.message || err.errMsg || err.errorMsg || err.msg || err.errorMessage || err.errorDescription || err.data;
      if (_code == 2001) {
          return {
              isServerError: err.isServerError,
              thirdcode: _thirdcode || 9001,
              thirdmsg: _thirdmsg,
              code: err.isServerError ? _thirdcode : _code,
              msg: err.isServerError ? _thirdmsg : getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err || '初始化错误，或未初始化'
          };
      }
      if (err.isServerError) {
          console.log(err);
          return {
              isServerError: err.isServerError,
              thirdcode: err.code || 9001,
              thirdmsg: err.msg || err.message,
              code: err.code || 9001,
              msg: err.msg || err.message
          };
      }
      return {
          isServerError: err.isServerError || false,
          thirdcode: _thirdcode || 9001,
          thirdmsg: _thirdmsg,
          code: _code,
          msg: getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err
      };
  };

  var toString$1 = Object.prototype.toString;
  function is(val, type) {
      return toString$1.call(val) === "[object ".concat(type, "]");
  }
  function isString$1(val) {
      return is(val, 'String');
  }
  function isBoolean(val) {
      return is(val, 'Boolean');
  }
  function isFunction$1(val) {
      return typeof val === 'function';
  }
  function isObject$1(val) {
      return val !== null && is(val, 'Object');
  }
  function isArray$1(val) {
      return val && Array.isArray(val);
  }
  function isEmpty(val) {
      if (val == null) {
          return true;
      }
      if (isArray$1(val) || isString$1(val)) {
          return val.length === 0;
      }
      if (val instanceof Map || val instanceof Set) {
          return val.size === 0;
      }
      if (isObject$1(val)) {
          return Object.keys(val).length === 0;
      }
      return false;
  }
  /**
   * Object
   */
  function pick(obj) {
      var props = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          props[_i - 1] = arguments[_i];
      }
      var flattenProps = props.flat();
      return obj == null
          ? {}
          : flattenProps.reduce(function (iter, prop) { return (prop in obj && (iter[prop] = obj[prop]), iter); }, {});
  }
  function omit(obj) {
      var props = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          props[_i - 1] = arguments[_i];
      }
      // console.log('omit: ', obj, props.flat())
      var flattenProps = props.flat();
      var result = {};
      if (obj == null)
          return result;
      for (var key in obj) {
          if (!flattenProps.includes(key)) {
              result[key] = obj[key];
          }
      }
      return result;
  }

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv () { return false }
  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
          request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(
          timeoutErrorMessage,
          config,
          config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = config.responseType;
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  function stringifySafely(rawValue, parser, encoder) {
    if (utils.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  var defaults = {

    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },

    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');

      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
        setContentTypeIfUnset(headers, 'application/json');
        return stringifySafely(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

      if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw enhanceError(e, this, 'E_JSON_PARSE');
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    var context = this || defaults_1;
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn.call(context, data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = [
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
      'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
    ];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });

    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys)
      .concat(directMergeKeys);

    var otherKeys = Object
      .keys(config1)
      .concat(Object.keys(config2))
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils.forEach(otherKeys, mergeDeepProperties);

    return config;
  };

  var name = "axios";
  var version = "0.21.4";
  var description = "Promise based HTTP client for the browser and node.js";
  var main = "index.js";
  var scripts = {
  	test: "grunt test",
  	start: "node ./sandbox/server.js",
  	build: "NODE_ENV=production grunt build",
  	preversion: "npm test",
  	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
  	postversion: "git push && git push --tags",
  	examples: "node ./examples/server.js",
  	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
  	fix: "eslint --fix lib/**/*.js"
  };
  var repository = {
  	type: "git",
  	url: "https://github.com/axios/axios.git"
  };
  var keywords = [
  	"xhr",
  	"http",
  	"ajax",
  	"promise",
  	"node"
  ];
  var author = "Matt Zabriskie";
  var license = "MIT";
  var bugs = {
  	url: "https://github.com/axios/axios/issues"
  };
  var homepage = "https://axios-http.com";
  var devDependencies = {
  	coveralls: "^3.0.0",
  	"es6-promise": "^4.2.4",
  	grunt: "^1.3.0",
  	"grunt-banner": "^0.6.0",
  	"grunt-cli": "^1.2.0",
  	"grunt-contrib-clean": "^1.1.0",
  	"grunt-contrib-watch": "^1.0.0",
  	"grunt-eslint": "^23.0.0",
  	"grunt-karma": "^4.0.0",
  	"grunt-mocha-test": "^0.13.3",
  	"grunt-ts": "^6.0.0-beta.19",
  	"grunt-webpack": "^4.0.2",
  	"istanbul-instrumenter-loader": "^1.0.0",
  	"jasmine-core": "^2.4.1",
  	karma: "^6.3.2",
  	"karma-chrome-launcher": "^3.1.0",
  	"karma-firefox-launcher": "^2.1.0",
  	"karma-jasmine": "^1.1.1",
  	"karma-jasmine-ajax": "^0.1.13",
  	"karma-safari-launcher": "^1.0.0",
  	"karma-sauce-launcher": "^4.3.6",
  	"karma-sinon": "^1.0.5",
  	"karma-sourcemap-loader": "^0.3.8",
  	"karma-webpack": "^4.0.2",
  	"load-grunt-tasks": "^3.5.2",
  	minimist: "^1.2.0",
  	mocha: "^8.2.1",
  	sinon: "^4.5.0",
  	"terser-webpack-plugin": "^4.2.3",
  	typescript: "^4.0.5",
  	"url-search-params": "^0.10.0",
  	webpack: "^4.44.2",
  	"webpack-dev-server": "^3.11.0"
  };
  var browser = {
  	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
  };
  var jsdelivr = "dist/axios.min.js";
  var unpkg = "dist/axios.min.js";
  var typings = "./index.d.ts";
  var dependencies = {
  	"follow-redirects": "^1.14.0"
  };
  var bundlesize = [
  	{
  		path: "./dist/axios.min.js",
  		threshold: "5kB"
  	}
  ];
  var _package = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies,
  	browser: browser,
  	jsdelivr: jsdelivr,
  	unpkg: unpkg,
  	typings: typings,
  	dependencies: dependencies,
  	bundlesize: bundlesize
  };

  var _package$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    version: version,
    description: description,
    main: main,
    scripts: scripts,
    repository: repository,
    keywords: keywords,
    author: author,
    license: license,
    bugs: bugs,
    homepage: homepage,
    devDependencies: devDependencies,
    browser: browser,
    jsdelivr: jsdelivr,
    unpkg: unpkg,
    typings: typings,
    dependencies: dependencies,
    bundlesize: bundlesize,
    'default': _package
  });

  var pkg = getCjsExportFromNamespace(_package$1);

  var validators$2 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
    validators$2[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  var deprecatedWarnings = {};
  var currentVerArr = pkg.version.split('.');

  /**
   * Compare package versions
   * @param {string} version
   * @param {string?} thanVersion
   * @returns {boolean}
   */
  function isOlderVersion(version, thanVersion) {
    var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
    var destVer = version.split('.');
    for (var i = 0; i < 3; i++) {
      if (pkgVersionArr[i] > destVer[i]) {
        return true;
      } else if (pkgVersionArr[i] < destVer[i]) {
        return false;
      }
    }
    return false;
  }

  /**
   * Transitional option validator
   * @param {function|boolean?} validator
   * @param {string?} version
   * @param {string} message
   * @returns {function}
   */
  validators$2.transitional = function transitional(validator, version, message) {
    var isDeprecated = version && isOlderVersion(version);

    function formatMessage(opt, desc) {
      return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return function(value, opt, opts) {
      if (validator === false) {
        throw new Error(formatMessage(opt, ' has been removed in ' + version));
      }

      if (isDeprecated && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  /**
   * Assert object's properties type
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator = schema[opt];
      if (validator) {
        var value = options[opt];
        var result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new TypeError('option ' + opt + ' must be ' + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error('Unknown option ' + opt);
      }
    }
  }

  var validator = {
    isOlderVersion: isOlderVersion,
    assertOptions: assertOptions,
    validators: validators$2
  };

  var validators$1 = validator.validators;
  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    var transitional = config.transitional;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators$1.transitional(validators$1.boolean, '1.0.0'),
        forcedJSONParsing: validators$1.transitional(validators$1.boolean, '1.0.0'),
        clarifyTimeoutError: validators$1.transitional(validators$1.boolean, '1.0.0')
      }, false);
    }

    // filter out skipped interceptors
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    var promise;

    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, undefined];

      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);

      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }


    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }

    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios$1 = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios$1.Axios = Axios_1;

  // Factory for creating new instances
  axios$1.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel;

  // Expose all/spread
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;

  // Expose isAxiosError
  axios$1.isAxiosError = isAxiosError;

  var axios_1 = axios$1;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios$1;
  axios_1.default = default_1;

  var axios = axios_1;

  // 接口白名单：初始化未成功之前能走请求的接口
  var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/data/api/track'];
  var refreshCode = [302206, 302207, 302002];
  var refreshTokenReq = function () {
      return doRequest({
          method: 'POST',
          url: '/v1/passport/token/refresh'
      });
  };
  var getHeaders = function (path) {
      var _a, _b;
      var accessWhiteSpace = [
          '/v1/passport/account/login_by_credential',
          '/v1/passport/account/login_by_token'
      ];
      var getDevicecode = function () {
          try {
              var devicecode = customGetStorageSync('rx_devicecode');
              if (devicecode) {
                  // @ts-ignore
                  return devicecode.code;
              }
              else {
                  var code = v4_1();
                  customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                  return code;
              }
          }
          catch (err) {
              return v4_1();
          }
      };
      var devicecode = getDevicecode();
      var headers = (_a = {},
          _a['ruixue-language'] = 'zh-CN',
          _a['ruixue-cpid'] = SYSTEM_INFO$1.cpid,
          _a['ruixue-productid'] = SYSTEM_INFO$1.productId,
          _a['ruixue-channelid'] = SYSTEM_INFO$1.channelId,
          _a['ruixue-platformid'] = '4',
          _a['ruixue-devicecode'] = devicecode,
          _a['ruixue-version'] = SYSTEM_INFO$1.__RX_SDK_VERSION,
          _a['ruixue-traceid'] = v4_1(),
          _a['ruixue-tzoffset'] = SYSTEM_INFO$1.timezone + '',
          _a);
      var rxToken = customGetStorageSync('rxToken');
      if (!accessWhiteSpace.includes(path)) {
          // @ts-ignore
          Reflect.set(headers, 'ruixue-accesstoken', rxToken === null || rxToken === void 0 ? void 0 : rxToken.access);
      }
      if (path == '/v1/passport/token/refresh') {
          console.log('refresh');
          headers['ruixue-datacount'] = '1';
          // @ts-ignore
          headers['ruixue-refreshtoken'] = rxToken === null || rxToken === void 0 ? void 0 : rxToken.refresh;
      }
      if (path.includes('/v1/data/api/track')) {
          headers = (_b = {},
              _b['ruixue-datacount'] = '1',
              _b);
      }
      if (checkNeedAesEncrypt(path)) {
          headers['ruixue-encipher'] = '1';
          headers['ruixue-devicecode'] = devicecode;
          headers['ruixue-version'] = SYSTEM_INFO$1.__RX_SDK_VERSION;
          headers['ruixue-platformid'] = '4';
          headers['Content-Type'] = 'text/plan';
      }
      if (SYSTEM_INFO$1.region_tag) {
          headers['ruixue-region'] = "".concat(SYSTEM_INFO$1.region_tag);
      }
      if (SYSTEM_INFO$1.cp_role_id) {
          headers['ruixue-cp-role-id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
      }
      return headers;
  };
  var requestAxios = axios.create({
      timeout: 60000,
      responseType: 'json',
      withCredentials: false
  });
  var retryRequest = function (options, resolve, reject) {
      var headers = removeKeyFromObject(options.headers);
      printLog("".concat(options.url));
      printLog("options", options);
      requestAxios({
          url: options.url,
          method: options.method,
          headers: headers,
          params: options.params,
          data: options.data
      }).then(function (res) {
          printLog("".concat(options.url));
          printLog("res", res.data);
          resolve(res.data);
      }).catch(function (err) {
          printLog("".concat(options.url));
          printLog("err", JSON.stringify(err));
          reject(err);
      });
  };
  var myRequest = function (options) {
      var devicecode = getDevicecode();
      var key = generateMD5(devicecode + cpkey);
      printLog("".concat(options.url));
      printLog("options", options);
      return new Promise(function (resolve, reject) {
          var data = options.data;
          var isAes = checkNeedAesEncrypt(options.url);
          try {
              data = (isAes && options.method.toLowerCase() != 'get') ? aesEncryptBase64String(options.data, key) : options.data;
              if (isAes && options.method.toLowerCase() != 'get') {
                  printLog('Encrypt Data:', data);
                  printLog('Self Encrypt Data:', aesDecryptBase64String(data, key));
              }
          }
          catch (e) {
              // @ts-ignore
              trackEncrypt(options, "h5_ruixueh5", key);
              retryRequest(options, resolve, reject);
              return;
          }
          requestAxios({
              url: options.url,
              method: options.method,
              headers: options.headers,
              params: options.params,
              data: data
          }).then(function (res) {
              var _a, _b, _c, _d;
              if (res.status == 500) {
                  return Promise.reject({
                      code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
                      msg: res.statusText
                  });
              }
              else if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                  printLog('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                  // @ts-ignore
                  trackDecrypt(options, res, "h5_ruixueh5", key);
                  retryRequest(options, resolve, reject);
              }
              else {
                  var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                  if (isAes && data_1) {
                      try {
                          if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                              data_1 = aesDecryptBase64String(data_1, key);
                              printLog('Decrypt Data:', data_1);
                              var result = __assign(__assign({}, res.data), { data: isJsonString(data_1) ? JSON.parse(data_1) : data_1 });
                              printLog("".concat(options.url));
                              printLog("res", result);
                              resolve(result);
                          }
                          else {
                              resolve(res.data);
                          }
                      }
                      catch (e) {
                          printLog('response 解密失败', options.url, e);
                          // @ts-ignore
                          trackDecrypt(options, res, "h5_ruixueh5", key);
                          retryRequest(options, resolve, reject);
                      }
                  }
                  else {
                      printLog("".concat(options.url));
                      printLog("res", res.data);
                      resolve(res.data);
                  }
              }
          }).catch(function (err) {
              reject(err);
          });
      });
  };
  function isHttpOrHttps(url) {
      return /^(http:\/\/|https:\/\/)/.test(url);
  }
  function doRequest(options, urlIndex, refreshNum) {
      var _a, _b;
      if (urlIndex === void 0) { urlIndex = 0; }
      if (refreshNum === void 0) { refreshNum = 0; }
      return __awaiter(this, void 0, void 0, function () {
          var error, path, headers, url, res, msg, error, error_1;
          return __generator(this, function (_c) {
              switch (_c.label) {
                  case 0:
                      SYSTEM_INFO$1.reqUrlIndex = urlIndex;
                      if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !SYSTEM_INFO$1.SDK_INIT_FINISHED) {
                          console.info('sdk doRequest options: ', options);
                          error = new Error('初始化错误，或未初始化');
                          error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR;
                          return [2 /*return*/, Promise.reject(error)];
                      }
                      path = options.url;
                      headers = getHeaders(path);
                      url = isHttpOrHttps(path) ? path : SYSTEM_INFO$1.baseUrlList[urlIndex] + path;
                      _c.label = 1;
                  case 1:
                      _c.trys.push([1, 3, , 4]);
                      return [4 /*yield*/, myRequest(__assign(__assign({}, options), { url: url, headers: headers }))];
                  case 2:
                      res = _c.sent();
                      if (res.code == 0) {
                          return [2 /*return*/, Promise.resolve(res)];
                      }
                      if (refreshCode.includes(res.code)) {
                          if (refreshNum === 5) {
                              refreshNum = 0;
                              return [2 /*return*/, Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })];
                          }
                          else {
                              refreshNum++;
                              return [2 /*return*/, refreshTokenReq().then(function (refreshRes) {
                                      customSetStorageSync('rxToken', refreshRes.data);
                                      return doRequest(options, urlIndex, refreshNum);
                                  })];
                          }
                      }
                      else {
                          msg = res.msg || res.message || res.errorMsg || 'Error';
                          error = new Error(msg);
                          error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                          error.data = res.data || res;
                          error.thirdcode = ((_a = res.data) === null || _a === void 0 ? void 0 : _a.code) || (res === null || res === void 0 ? void 0 : res.code);
                          error.thirdmsg = ((_b = res.data) === null || _b === void 0 ? void 0 : _b.msg) || (res === null || res === void 0 ? void 0 : res.msg);
                          error.isServerError = true;
                          error.url = url;
                          error.request_header = headers;
                          error.request_body = options.data || options.params;
                          return [2 /*return*/, Promise.reject(error)];
                      }
                  case 3:
                      error_1 = _c.sent();
                      if (urlIndex < SYSTEM_INFO$1.baseUrlList.length - 1) {
                          urlIndex++;
                          return [2 /*return*/, doRequest(options, urlIndex, refreshNum)];
                      }
                      if (error_1.message == 'Network Error') {
                          return [2 /*return*/, Promise.reject({
                                  code: COMMON_ERROR_CODE.NETWORK_ERROR,
                                  msg: error_1.message
                              })];
                      }
                      if (error_1.message == 'timeout') {
                          return [2 /*return*/, Promise.reject({
                                  code: COMMON_ERROR_CODE.TIMEOUT,
                                  msg: error_1.message
                              })];
                      }
                      if (error_1.message == 'Request aborted') {
                          return [2 /*return*/, Promise.reject({
                                  code: COMMON_ERROR_CODE.REQUEST_ABORTED,
                                  msg: error_1.message
                              })];
                      }
                      return [2 /*return*/, Promise.reject(__assign({ url: url, request_header: headers, request_body: options.data || options.params, code: error_1.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: error_1.msg || error_1.message || error_1.errMsg || 'Error', thirdcode: error_1.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, thirdmsg: error_1.msg || error_1.message || error_1.errMsg || 'Error' }, error_1))];
                  case 4: return [2 /*return*/];
              }
          });
      });
  }

  var request;
  switch ("h5_ruixueh5") {
      default:
          request = doRequest;
  }
  function createFeedbackApi(data) {
      return request({
          url: '/v1/feedbackapi/player_feedback/create',
          method: 'POST',
          data: data
      });
  }
  function getFeedbackListApi(params) {
      return request({
          url: '/v1/feedbackapi/player_feedback/list',
          method: 'GET',
          params: params
      });
  }
  function getFeedbackDetailApi(params) {
      return request({
          url: '/v1/feedbackapi/player_feedback/detail',
          method: 'GET',
          params: params
      });
  }
  function collectPropsApi(data) {
      return request({
          url: '/v1/feedbackapi/player_feedback/getprop',
          method: 'PUT',
          data: data
      });
  }
  function getNoticeApi(params) {
      return request({
          url: '/v1/operationtoolsapi/maintain/get',
          method: 'GET',
          params: params
      });
  }
  function loginByTokenApi(data) {
      return request({
          url: '/v1/passport/account/login_by_token',
          method: 'POST',
          data: data
      });
  }
  function orderApi(data) {
      return request({
          url: '/v1/ke/order',
          method: 'POST',
          data: data
      });
  }
  //发送验证码
  var sendCaptcha = function (data) {
      return request({
          url: '/v1/passport/sms/send_captcha',
          method: 'POST',
          data: data
      });
  };
  //绑定手机
  var bindPhone = function (data) {
      return request({
          url: '/v1/passport/user/bind_phone',
          method: 'POST',
          data: data
      });
  };
  //解绑手机
  var unBindPhone = function (data) {
      return request({
          url: '/v1/passport/user/unbind_phone',
          method: 'POST',
          data: data
      });
  };
  //绑定邮箱
  var bindEmail = function (data) {
      return request({
          url: '/v1/passport/user/bind_email',
          method: 'POST',
          data: data
      });
  };
  //解绑邮箱
  var UnbindEmail = function (data) {
      return request({
          url: '/v1/passport/user/unbind_email',
          method: 'POST',
          data: data
      });
  };
  //申请注销
  function deregister(data) {
      return request({
          url: '/v1/passport/user/deregister',
          method: 'POST',
          data: data
      });
  }
  //取消注销
  function deregisterCancel() {
      return request({
          url: '/v1/passport/user/cancel_deregister',
          method: 'POST',
          data: {}
      });
  }
  //修改用户信息
  function updateInfoApi(data) {
      return request({
          url: '/v1/passport/user/update_info',
          method: 'POST',
          data: data
      });
  }
  //上报大数据
  var trackApi = function (data) {
      return request({
          method: 'POST',
          url: '/v1/data/api/track',
          data: data
      });
  };
  var getInfoApi = function () {
      return request({
          method: 'POST',
          url: '/v1/passport/user/get_info',
          data: {}
      });
  };
  var activated = function (data) {
      return request({
          method: 'POST',
          url: '/v1/attribution/user/activated',
          data: data
      });
  };
  //产品包版本检查
  var checkVersionGameLobbyByGet = function (data) {
      return request({
          url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region),
          method: 'GET',
          params: {
              type: data.type,
              format: data.format
          }
      });
  };
  //产品包版本检查
  var checkVersionGameLobbyByPost = function (data) {
      return request({
          url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region, "?type=").concat(data.type || '', "&format=").concat(data.format || ''),
          method: 'POST',
          data: {
              games: data.games,
              activities: data.activities
          }
      });
  };
  //游戏版本检查
  var checkGameVersion = function (data) {
      return request({
          url: "/v1/vcapi/update_game/".concat(data.gameid, "/").concat(data.gameversion, "/").concat(data.gamecheckversion),
          method: 'GET',
          data: {
              type: data.type,
              format: data.format
          }
      });
  };
  //活动版本检查
  var checkActivityVersion = function (data) {
      return request({
          url: "/v1/vcapi/update_activity/".concat(data.activityshortname, "/").concat(data.activityversion, "/").concat(data.activitycheckversion),
          method: 'GET',
          data: {
              type: data.type,
              format: data.format
          }
      });
  };
  // 获取公共属性
  var getInitConf = function (data) {
      return request({
          url: '/v1/sdkconfig/init',
          method: 'POST',
          data: data
      });
  };
  var setcustomApi = function (data) {
      return request({
          url: '/v1/social/user/setcustom',
          method: 'POST',
          data: data
      });
  };
  var addRelationApi = function (data) {
      return request({
          url: '/v1/social/relation/add',
          method: 'POST',
          data: data
      });
  };
  var deleteRelationApi = function (data) {
      return request({
          url: '/v1/social/relation/delete',
          method: 'POST',
          data: data
      });
  };
  var updateremarksApi = function (data) {
      return request({
          url: '/v1/social/relation/updateremarks',
          method: 'POST',
          data: data
      });
  };
  var hasrelationApi = function (data) {
      return request({
          url: '/v1/social/relation/hasrelation',
          method: 'POST',
          data: data
      });
  };
  var relationListApi = function (data) {
      return request({
          url: '/v1/social/relation/list',
          method: 'POST',
          data: data
      });
  };
  var addfriendApi = function (data) {
      return request({
          url: '/v1/social/relation/addfriend',
          method: 'POST',
          data: data
      });
  };
  var delfriendApi = function (data) {
      return request({
          url: '/v1/social/relation/delfriend',
          method: 'POST',
          data: data
      });
  };
  var updatefriendremarksApi = function (data) {
      return request({
          url: '/v1/social/relation/updatefriendremarks',
          method: 'POST',
          data: data
      });
  };
  var isfriendApi = function (data) {
      return request({
          url: '/v1/social/relation/isfriend',
          method: 'POST',
          data: data
      });
  };
  var friendsApi = function () {
      return request({
          url: '/v1/social/relation/friends',
          method: 'POST'
      });
  };
  var addscoreApi = function (data) {
      return request({
          url: '/v1/social/rank/addscore',
          method: 'POST',
          data: data
      });
  };
  var setscoreApi = function (data) {
      return request({
          url: '/v1/social/rank/setscore',
          method: 'POST',
          data: data
      });
  };
  var queryuserrankApi = function (data) {
      return request({
          url: '/v1/social/rank/queryuserrank',
          method: 'POST',
          data: data
      });
  };
  var getranklistApi = function (data) {
      return request({
          url: '/v1/social/rank/getranklist',
          method: 'POST',
          data: data
      });
  };
  var friendsrankApi = function (data) {
      return request({
          url: '/v1/social/rank/friendsrank',
          method: 'POST',
          data: data
      });
  };
  // 获取帮助中心首页信息
  var getMainlayoutApi = function () {
      return request({
          url: '/v1/service/helpcenter/mainlayout',
          method: 'GET'
      });
  };
  // 获取帮助中心问题一级列表页
  var getListlayoutApi = function (params) {
      return request({
          url: '/v1/service/helpcenter/listlayout',
          method: 'GET',
          params: params
      });
  };
  // 获取帮助中心问题详情
  var getInfolayoutApi = function (params) {
      return request({
          url: '/v1/service/helpcenter/infolayout',
          method: 'GET',
          params: params
      });
  };
  // 设置帮助中心问题解决状态
  var postResolutionApi = function (data) {
      return request({
          url: '/v1/service/helpcenter/resolution',
          method: 'POST',
          data: data
      });
  };
  // 获取窗口运营全部配置数据
  function getOperationSceneApi() {
      return request({
          url: '/v1/operationtoolsapi/user_data_operation_platform/scene/all',
          method: 'POST',
          data: {}
      });
  }
  // 游戏区服信息查询
  function getGameAreaApi(area_id) {
      return request({
          url: '/v1/report/sdk/cp/game_area',
          method: 'GET',
          params: {
              area_id: area_id
          }
      });
  }
  // 游戏区服信息修改
  function putGameAreaApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_area',
          method: 'PUT',
          data: data
      });
  }
  // 创建游戏区服
  function createGameAreaApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_area',
          method: 'POST',
          data: data
      });
  }
  // 删除游戏区服
  function delGameAreaApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_area',
          method: 'DELETE',
          data: data
      });
  }
  // 查询区服列表信息
  function getGameAreaListApi() {
      return request({
          url: '/v1/report/sdk/cp/game_area/list',
          method: 'GET'
      });
  }
  // 创建角色
  function createGameCharacterApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_character',
          method: 'POST',
          data: data
      });
  }
  // 修改游戏角色信息
  function putGameCharacterApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_character',
          method: 'PUT',
          data: data
      });
  }
  // 删除游戏角色
  function delGameCharacterApi(data) {
      return request({
          url: '/v1/report/sdk/cp/game_character',
          method: 'DELETE',
          data: data
      });
  }
  // 查询账号下角色信息列表
  function getGameCharacterAccountApi(params) {
      return request({
          url: '/v1/report/sdk/cp/game_character/account',
          method: 'GET',
          params: params
      });
  }
  // 查询账号下某个区服下的角色信息列表
  function getGameCharacterApi(params) {
      return request({
          url: '/v1/report/sdk/cp/game_character/account/area',
          method: 'GET',
          params: params
      });
  }
  // 查询具体角色信息
  function getGameAccountAreaCharacterApi(params) {
      return request({
          url: '/v1/report/sdk/cp/game_character/account/area/character',
          method: 'GET',
          params: params
      });
  }
  // 兑换道具
  function itemRedemptionApi(data) {
      return request({
          url: '/v1/operationtoolsapi/user_data_operation_platform/item_redemption',
          method: 'POST',
          data: data
      });
  }
  // 邮件列表
  function getEmailListApi(data) {
      return request({
          url: '/v1/operationtoolsapi/rxmail/cpuser/list',
          method: 'POST',
          data: data
      });
  }
  // 邮件详情
  function getEmailDetailApi(data) {
      return request({
          url: '/v1/operationtoolsapi/rxmail/cpuser/detail',
          method: 'POST',
          data: data
      });
  }
  // 邮件领取
  function receiveEmailApi(data) {
      return request({
          url: '/v1/operationtoolsapi/rxmail/cpuser/receive',
          method: 'POST',
          data: data
      });
  }
  // 邮件删除
  function delEmailApi(data) {
      return request({
          url: '/v1/operationtoolsapi/rxmail/cpuser/delete',
          method: 'POST',
          data: data
      });
  }
  //新版通用版本检查 v2
  var updateGameVersionApi = function (data) {
      return request({
          url: "/v1/vcapi/update_module_version",
          method: 'POST',
          data: data,
      });
  };
  function searchGameAccountApi() {
      return request({
          url: '/v1/report/sdk/cp_role',
          method: 'get'
      });
  }

  // var padStart = function padStart(string: string | number, length: number, pad: string) {
  //   var s = String(string)
  //   if (!s || s.length >= length) return string
  //   return '' + Array(length + 1 - s.length).join(pad) + string
  // }
  function utcOffset(data) {
      // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
      // https://github.com/moment/moment/pull/1871
      return -Math.round(data.getTimezoneOffset() / 15) * 15;
  }
  var padZoneStr = function (data) {
      var negMinutes = -utcOffset(data);
      var minutes = Math.abs(negMinutes);
      var hourOffset = Math.floor(minutes / 60);
      var minuteOffset = minutes % 60;
      // console.log(1111, negMinutes)
      return "".concat(negMinutes <= 0 ? '+' : '-').concat(String(hourOffset).padStart(2, '0'), ":").concat(String(minuteOffset).padStart(2, '0'));
  };
  function formatDate(format, data) {
      if (data === void 0) { data = new Date(); }
      var $Y = String(data.getFullYear());
      var $M = String(data.getMonth() + 1);
      var $D = String(data.getDate());
      var $H = String(data.getHours());
      var $m = String(data.getMinutes());
      var $s = String(data.getSeconds());
      var $ms = String(data.getMilliseconds());
      var zoneStr = padZoneStr(data);
      var matchs = {
          YY: $Y.slice(-2),
          YYYY: $Y,
          M: $M,
          MM: $M.padStart(2, '0'),
          D: $D,
          DD: $D.padStart(2, '0'),
          H: $H,
          HH: $H.padStart(2, '0'),
          m: $m,
          mm: $m.padStart(2, '0'),
          s: $s,
          ss: $s.padStart(2, '0'),
          SSS: $ms.padStart(3, '0'),
          Z: zoneStr,
      };
      return format.replace(/Y{1,4}|M{1,4}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|S{3}|Z{1}/g, function (match) {
          return matchs[match];
      });
  }
  // export function localISOTime() {
  //   // 当前时间
  //   const date = new Date()
  //   const time = date.getTime()
  //   // 与格林威治时时差,并转换为毫秒
  //   const offset = date.getTimezoneOffset() * 60 * 1000 // => 假设当前时区时区为东八区，-480 因为格林尼治时间比本地时间小8h
  //   //算出对应的格林尼治时间
  //   // const GMTDate = time + offset
  //   return new Date(time - offset).toISOString()
  // }

  // @ts-ignore
  function cryptoJS() {

    /*globals window, global, require*/

    /**
     * CryptoJS core components.
     */
    var CryptoJS = CryptoJS || (function (Math, undefined$1) {

      /*try {
        // Native crypto from window (Browser)
        if (typeof window !== 'undefined' && window.crypto) {
          try {
            crypto = window.crypto;
          } catch (err) {
          }
        }

        // Native crypto in web worker (Browser)
        if (typeof self !== 'undefined' && self.crypto) {
          try {
            crypto = self.crypto;
          } catch (err) {
          }
        }

        // Native crypto from worker
        if (typeof globalThis !== 'undefined' && globalThis.crypto) {
          try {
            crypto = globalThis.crypto;
          } catch (err) {
          }
        }

        // Native (experimental IE 11) crypto from window (Browser)
        if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
          try {
            crypto = window.msCrypto;
          } catch (err) {
          }
        }

        // Native crypto from global (NodeJS)
        if (!crypto && typeof global !== 'undefined' && global.crypto) {
          try {
            crypto = global.crypto;
          } catch (err) {
          }
        }

        // Native crypto import via require (NodeJS)
        if (!crypto && typeof require === 'function') {
          try {
            crypto = require('crypto');
          } catch (err) {
          }
        }
      } catch (e) {

      }*/

      /*
  	     * Cryptographically secure pseudorandom number generator
  	     *
  	     * As Math.random() is cryptographically not safe to use
  	     */
      var cryptoSecureRandomInt = function () {

        throw new Error('Native crypto module could not be used to get secure random number.');
      };

      /*
  	     * Local polyfill of Object.create

  	     */
      var create = Object.create || (function () {
        function F() {
        }

        return function (obj) {
          var subtype;

          F.prototype = obj;

          subtype = new F();

          F.prototype = null;

          return subtype;
        };
      }());

      /**
       * CryptoJS namespace.
       */
      var C = {};

      /**
       * Library namespace.
       */
      var C_lib = C.lib = {};

      /**
       * Base object for prototypal inheritance.
       */
      var Base = C_lib.Base = (function () {


        return {
          /**
           * Creates a new object that inherits from this object.
           *
           * @param {Object} overrides Properties to copy into the new object.
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         field: 'value',
           *
           *         method: function () {
           *         }
           *     });
           */
          extend: function (overrides) {
            // Spawn
            var subtype = create(this);

            // Augment
            if (overrides) {
              subtype.mixIn(overrides);
            }

            // Create default initializer
            if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
              subtype.init = function () {
                subtype.$super.init.apply(this, arguments);
              };
            }

            // Initializer's prototype is the subtype object
            subtype.init.prototype = subtype;

            // Reference supertype
            subtype.$super = this;

            return subtype;
          },

          /**
           * Extends this object and runs the init method.
           * Arguments to create() will be passed to init().
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var instance = MyType.create();
           */
          create: function () {
            var instance = this.extend();
            instance.init.apply(instance, arguments);

            return instance;
          },

          /**
           * Initializes a newly created object.
           * Override this method to add some logic when your objects are created.
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         init: function () {
           *             // ...
           *         }
           *     });
           */
          init: function () {
          },

          /**
           * Copies properties into this object.
           *
           * @param {Object} properties The properties to mix in.
           *
           * @example
           *
           *     MyType.mixIn({
           *         field: 'value'
           *     });
           */
          mixIn: function (properties) {
            for (var propertyName in properties) {
              if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
              }
            }

            // IE won't copy toString using the loop above
            if (properties.hasOwnProperty('toString')) {
              this.toString = properties.toString;
            }
          },

          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = instance.clone();
           */
          clone: function () {
            return this.init.prototype.extend(this);
          }
        };
      }());

      /**
       * An array of 32-bit words.
       *
       * @property {Array} words The array of 32-bit words.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */
      var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
          words = this.words = words || [];

          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 4;
          }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
          return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
          // Shortcuts
          var thisWords = this.words;
          var thatWords = wordArray.words;
          var thisSigBytes = this.sigBytes;
          var thatSigBytes = wordArray.sigBytes;

          // Clamp excess bits
          this.clamp();

          // Concat
          if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (var i = 0; i < thatSigBytes; i++) {
              var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
            }
          } else {
            // Copy one word at a time
            for (var j = 0; j < thatSigBytes; j += 4) {
              thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
            }
          }
          this.sigBytes += thatSigBytes;

          // Chainable
          return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
          // Shortcuts
          var words = this.words;
          var sigBytes = this.sigBytes;

          // Clamp
          words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
          words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
          var clone = Base.clone.call(this);
          clone.words = this.words.slice(0);

          return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
          var words = [];

          for (var i = 0; i < nBytes; i += 4) {
            words.push(cryptoSecureRandomInt());
          }

          return new WordArray.init(words, nBytes);
        }
      });

      /**
       * Encoder namespace.
       */
      var C_enc = C.enc = {};

      /**
       * Hex encoding strategy.
       */
      var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var hexChars = [];
          for (var i = 0; i < sigBytes; i++) {
            var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
          }

          return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
          // Shortcut
          var hexStrLength = hexStr.length;

          // Convert
          var words = [];
          for (var i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
          }

          return new WordArray.init(words, hexStrLength / 2);
        }
      };

      /**
       * Latin1 encoding strategy.
       */
      var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var latin1Chars = [];
          for (var i = 0; i < sigBytes; i++) {
            var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
          }

          return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
          // Shortcut
          var latin1StrLength = latin1Str.length;

          // Convert
          var words = [];
          for (var i = 0; i < latin1StrLength; i++) {
            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
          }

          return new WordArray.init(words, latin1StrLength);
        }
      };

      /**
       * UTF-8 encoding strategy.
       */
      var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
          try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
          } catch (e) {
            throw new Error('Malformed UTF-8 data');
          }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
          return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
      };

      /**
       * Abstract buffered block algorithm template.
       *
       * The property blockSize must be implemented in a concrete subtype.
       *
       * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
       */
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
          // Initial values
          this._data = new WordArray.init();
          this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
          // Convert string to WordArray, else assume WordArray already
          if (typeof data == 'string') {
            data = Utf8.parse(data);
          }

          // Append
          this._data.concat(data);
          this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
          var processedWords;

          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var dataSigBytes = data.sigBytes;
          var blockSize = this.blockSize;
          var blockSizeBytes = blockSize * 4;

          // Count blocks ready
          var nBlocksReady = dataSigBytes / blockSizeBytes;
          if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
          } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
          }

          // Count words ready
          var nWordsReady = nBlocksReady * blockSize;

          // Count bytes ready
          var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

          // Process blocks
          if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
              // Perform concrete-algorithm logic
              this._doProcessBlock(dataWords, offset);
            }

            // Remove processed words
            processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
          }

          // Return processed words
          return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
          var clone = Base.clone.call(this);
          clone._data = this._data.clone();

          return clone;
        },

        _minBufferSize: 0
      });

      /**
       * Abstract hasher template.
       *
       * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
       */
      C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
          // Apply config defaults
          this.cfg = this.cfg.extend(cfg);

          // Set initial values
          this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
          // Reset data buffer
          BufferedBlockAlgorithm.reset.call(this);

          // Perform concrete-hasher logic
          this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
          // Append
          this._append(messageUpdate);

          // Update the hash
          this._process();

          // Chainable
          return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
          // Final message update
          if (messageUpdate) {
            this._append(messageUpdate);
          }

          // Perform concrete-hasher logic
          var hash = this._doFinalize();

          return hash;
        },

        blockSize: 512 / 32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
          return function (message, cfg) {
            return new hasher.init(cfg).finalize(message);
          };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
          return function (message, key) {
            return new C_algo.HMAC.init(hasher, key).finalize(message);
          };
        }
      });

      /**
       * Algorithm namespace.
       */
      var C_algo = C.algo = {};

      return C;
    }(Math));


    (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var X32WordArray = C_lib.WordArray;

      /**
       * x64 namespace.
       */
      var C_x64 = C.x64 = {};

      /**
       * A 64-bit word.
       */
      C_x64.Word = Base.extend({
        /**
         * Initializes a newly created 64-bit word.
         *
         * @param {number} high The high 32 bits.
         * @param {number} low The low 32 bits.
         *
         * @example
         *
         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
         */
        init: function (high, low) {
          this.high = high;
          this.low = low;
        }

        /**
         * Bitwise NOTs this word.
         *
         * @return {X64Word} A new x64-Word object after negating.
         *
         * @example
         *
         *     var negated = x64Word.not();
         */
        // not: function () {
        // var high = ~this.high;
        // var low = ~this.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ANDs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to AND with this word.
         *
         * @return {X64Word} A new x64-Word object after ANDing.
         *
         * @example
         *
         *     var anded = x64Word.and(anotherX64Word);
         */
        // and: function (word) {
        // var high = this.high & word.high;
        // var low = this.low & word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to OR with this word.
         *
         * @return {X64Word} A new x64-Word object after ORing.
         *
         * @example
         *
         *     var ored = x64Word.or(anotherX64Word);
         */
        // or: function (word) {
        // var high = this.high | word.high;
        // var low = this.low | word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise XORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to XOR with this word.
         *
         * @return {X64Word} A new x64-Word object after XORing.
         *
         * @example
         *
         *     var xored = x64Word.xor(anotherX64Word);
         */
        // xor: function (word) {
        // var high = this.high ^ word.high;
        // var low = this.low ^ word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the left.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftL(25);
         */
        // shiftL: function (n) {
        // if (n < 32) {
        // var high = (this.high << n) | (this.low >>> (32 - n));
        // var low = this.low << n;
        // } else {
        // var high = this.low << (n - 32);
        // var low = 0;
        // }

        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the right.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftR(7);
         */
        // shiftR: function (n) {
        // if (n < 32) {
        // var low = (this.low >>> n) | (this.high << (32 - n));
        // var high = this.high >>> n;
        // } else {
        // var low = this.high >>> (n - 32);
        // var high = 0;
        // }

        // return X64Word.create(high, low);
        // },

        /**
         * Rotates this word n bits to the left.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotL(25);
         */
        // rotL: function (n) {
        // return this.shiftL(n).or(this.shiftR(64 - n));
        // },

        /**
         * Rotates this word n bits to the right.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotR(7);
         */
        // rotR: function (n) {
        // return this.shiftR(n).or(this.shiftL(64 - n));
        // },

        /**
         * Adds this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to add with this word.
         *
         * @return {X64Word} A new x64-Word object after adding.
         *
         * @example
         *
         *     var added = x64Word.add(anotherX64Word);
         */
        // add: function (word) {
        // var low = (this.low + word.low) | 0;
        // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
        // var high = (this.high + word.high + carry) | 0;

        // return X64Word.create(high, low);
        // }
      });

      /**
       * An array of 64-bit words.
       *
       * @property {Array} words The array of CryptoJS.x64.Word objects.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */
      C_x64.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.x64.WordArray.create();
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ]);
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ], 10);
         */
        init: function (words, sigBytes) {
          words = this.words = words || [];

          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 8;
          }
        },

        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        toX32: function () {
          // Shortcuts
          var x64Words = this.words;
          var x64WordsLength = x64Words.length;

          // Convert
          var x32Words = [];
          for (var i = 0; i < x64WordsLength; i++) {
            var x64Word = x64Words[i];
            x32Words.push(x64Word.high);
            x32Words.push(x64Word.low);
          }

          return X32WordArray.create(x32Words, this.sigBytes);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {X64WordArray} The clone.
         *
         * @example
         *
         *     var clone = x64WordArray.clone();
         */
        clone: function () {
          var clone = Base.clone.call(this);

          // Clone "words" array
          var words = clone.words = this.words.slice(0);

          // Clone each X64Word object
          var wordsLength = words.length;
          for (var i = 0; i < wordsLength; i++) {
            words[i] = words[i].clone();
          }

          return clone;
        }
      });
    }());


    (function () {
      // Check if typed arrays are supported
      if (typeof ArrayBuffer != 'function') {
        return;
      }

      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;

      // Reference original init
      var superInit = WordArray.init;

      // Augment WordArray.init to handle typed arrays
      var subInit = WordArray.init = function (typedArray) {
        // Convert buffers to uint8
        if (typedArray instanceof ArrayBuffer) {
          typedArray = new Uint8Array(typedArray);
        }

        // Convert other array views to uint8
        if (
          typedArray instanceof Int8Array ||
          (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
          typedArray instanceof Int16Array ||
          typedArray instanceof Uint16Array ||
          typedArray instanceof Int32Array ||
          typedArray instanceof Uint32Array ||
          typedArray instanceof Float32Array ||
          typedArray instanceof Float64Array
        ) {
          typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        }

        // Handle Uint8Array
        if (typedArray instanceof Uint8Array) {
          // Shortcut
          var typedArrayByteLength = typedArray.byteLength;

          // Extract bytes
          var words = [];
          for (var i = 0; i < typedArrayByteLength; i++) {
            words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
          }

          // Initialize this word array
          superInit.call(this, words, typedArrayByteLength);
        } else {
          // Else call normal init
          superInit.apply(this, arguments);
        }
      };

      subInit.prototype = WordArray;
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C.enc;

      /**
       * UTF-16 BE encoding strategy.
       */
      C_enc.Utf16 = C_enc.Utf16BE = {
        /**
         * Converts a word array to a UTF-16 BE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 BE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var utf16Chars = [];
          for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
            utf16Chars.push(String.fromCharCode(codePoint));
          }

          return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 BE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 BE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
         */
        parse: function (utf16Str) {
          // Shortcut
          var utf16StrLength = utf16Str.length;

          // Convert
          var words = [];
          for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
          }

          return WordArray.create(words, utf16StrLength * 2);
        }
      };

      /**
       * UTF-16 LE encoding strategy.
       */
      C_enc.Utf16LE = {
        /**
         * Converts a word array to a UTF-16 LE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 LE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var utf16Chars = [];
          for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
            utf16Chars.push(String.fromCharCode(codePoint));
          }

          return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 LE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 LE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
         */
        parse: function (utf16Str) {
          // Shortcut
          var utf16StrLength = utf16Str.length;

          // Convert
          var words = [];
          for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
          }

          return WordArray.create(words, utf16StrLength * 2);
        }
      };

      function swapEndian(word) {
        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
      }
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C.enc;

      /**
       * Base64 encoding strategy.
       */
      C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var map = this._map;

          // Clamp excess bits
          wordArray.clamp();

          // Convert
          var base64Chars = [];
          for (var i = 0; i < sigBytes; i += 3) {
            var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
            var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

            var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
              base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
            }
          }

          // Add padding
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            while (base64Chars.length % 4) {
              base64Chars.push(paddingChar);
            }
          }

          return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
          // Shortcuts
          var base64StrLength = base64Str.length;
          var map = this._map;
          var reverseMap = this._reverseMap;

          if (!reverseMap) {
            reverseMap = this._reverseMap = [];
            for (var j = 0; j < map.length; j++) {
              reverseMap[map.charCodeAt(j)] = j;
            }
          }

          // Ignore padding
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
              base64StrLength = paddingIndex;
            }
          }

          // Convert
          return parseLoop(base64Str, base64StrLength, reverseMap);

        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      };

      function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;
        for (var i = 0; i < base64StrLength; i++) {
          if (i % 4) {
            var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
            var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
            var bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
            nBytes++;
          }
        }
        return WordArray.create(words, nBytes);
      }
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C.enc;

      /**
       * Base64url encoding strategy.
       */
      C_enc.Base64url = {
        /**
         * Converts a word array to a Base64url string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @param {boolean} urlSafe Whether to use url safe
         *
         * @return {string} The Base64url string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
         */
        stringify: function (wordArray, urlSafe) {
          if (urlSafe === undefined) {
            urlSafe = true;
          }
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var map = urlSafe ? this._safe_map : this._map;

          // Clamp excess bits
          wordArray.clamp();

          // Convert
          var base64Chars = [];
          for (var i = 0; i < sigBytes; i += 3) {
            var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
            var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

            var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
              base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
            }
          }

          // Add padding
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            while (base64Chars.length % 4) {
              base64Chars.push(paddingChar);
            }
          }

          return base64Chars.join('');
        },

        /**
         * Converts a Base64url string to a word array.
         *
         * @param {string} base64Str The Base64url string.
         *
         * @param {boolean} urlSafe Whether to use url safe
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
         */
        parse: function (base64Str, urlSafe) {
          if (urlSafe === undefined) {
            urlSafe = true;
          }

          // Shortcuts
          var base64StrLength = base64Str.length;
          var map = urlSafe ? this._safe_map : this._map;
          var reverseMap = this._reverseMap;

          if (!reverseMap) {
            reverseMap = this._reverseMap = [];
            for (var j = 0; j < map.length; j++) {
              reverseMap[map.charCodeAt(j)] = j;
            }
          }

          // Ignore padding
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
              base64StrLength = paddingIndex;
            }
          }

          // Convert
          return parseLoop(base64Str, base64StrLength, reverseMap);

        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
      };

      function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;
        for (var i = 0; i < base64StrLength; i++) {
          if (i % 4) {
            var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
            var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
            var bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
            nBytes++;
          }
        }
        return WordArray.create(words, nBytes);
      }
    }());


    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Constants table
      var T = [];

      // Compute constants
      (function () {
        for (var i = 0; i < 64; i++) {
          T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
      }());

      /**
       * MD5 hash algorithm.
       */
      var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function () {
          this._hash = new WordArray.init([
            0x67452301, 0xefcdab89,
            0x98badcfe, 0x10325476
          ]);
        },

        _doProcessBlock: function (M, offset) {
          // Swap endian
          for (var i = 0; i < 16; i++) {
            // Shortcuts
            var offset_i = offset + i;
            var M_offset_i = M[offset_i];

            M[offset_i] = (
              (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
              (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
            );
          }

          // Shortcuts
          var H = this._hash.words;

          var M_offset_0 = M[offset + 0];
          var M_offset_1 = M[offset + 1];
          var M_offset_2 = M[offset + 2];
          var M_offset_3 = M[offset + 3];
          var M_offset_4 = M[offset + 4];
          var M_offset_5 = M[offset + 5];
          var M_offset_6 = M[offset + 6];
          var M_offset_7 = M[offset + 7];
          var M_offset_8 = M[offset + 8];
          var M_offset_9 = M[offset + 9];
          var M_offset_10 = M[offset + 10];
          var M_offset_11 = M[offset + 11];
          var M_offset_12 = M[offset + 12];
          var M_offset_13 = M[offset + 13];
          var M_offset_14 = M[offset + 14];
          var M_offset_15 = M[offset + 15];

          // Working variables
          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];

          // Computation
          a = FF(a, b, c, d, M_offset_0, 7, T[0]);
          d = FF(d, a, b, c, M_offset_1, 12, T[1]);
          c = FF(c, d, a, b, M_offset_2, 17, T[2]);
          b = FF(b, c, d, a, M_offset_3, 22, T[3]);
          a = FF(a, b, c, d, M_offset_4, 7, T[4]);
          d = FF(d, a, b, c, M_offset_5, 12, T[5]);
          c = FF(c, d, a, b, M_offset_6, 17, T[6]);
          b = FF(b, c, d, a, M_offset_7, 22, T[7]);
          a = FF(a, b, c, d, M_offset_8, 7, T[8]);
          d = FF(d, a, b, c, M_offset_9, 12, T[9]);
          c = FF(c, d, a, b, M_offset_10, 17, T[10]);
          b = FF(b, c, d, a, M_offset_11, 22, T[11]);
          a = FF(a, b, c, d, M_offset_12, 7, T[12]);
          d = FF(d, a, b, c, M_offset_13, 12, T[13]);
          c = FF(c, d, a, b, M_offset_14, 17, T[14]);
          b = FF(b, c, d, a, M_offset_15, 22, T[15]);

          a = GG(a, b, c, d, M_offset_1, 5, T[16]);
          d = GG(d, a, b, c, M_offset_6, 9, T[17]);
          c = GG(c, d, a, b, M_offset_11, 14, T[18]);
          b = GG(b, c, d, a, M_offset_0, 20, T[19]);
          a = GG(a, b, c, d, M_offset_5, 5, T[20]);
          d = GG(d, a, b, c, M_offset_10, 9, T[21]);
          c = GG(c, d, a, b, M_offset_15, 14, T[22]);
          b = GG(b, c, d, a, M_offset_4, 20, T[23]);
          a = GG(a, b, c, d, M_offset_9, 5, T[24]);
          d = GG(d, a, b, c, M_offset_14, 9, T[25]);
          c = GG(c, d, a, b, M_offset_3, 14, T[26]);
          b = GG(b, c, d, a, M_offset_8, 20, T[27]);
          a = GG(a, b, c, d, M_offset_13, 5, T[28]);
          d = GG(d, a, b, c, M_offset_2, 9, T[29]);
          c = GG(c, d, a, b, M_offset_7, 14, T[30]);
          b = GG(b, c, d, a, M_offset_12, 20, T[31]);

          a = HH(a, b, c, d, M_offset_5, 4, T[32]);
          d = HH(d, a, b, c, M_offset_8, 11, T[33]);
          c = HH(c, d, a, b, M_offset_11, 16, T[34]);
          b = HH(b, c, d, a, M_offset_14, 23, T[35]);
          a = HH(a, b, c, d, M_offset_1, 4, T[36]);
          d = HH(d, a, b, c, M_offset_4, 11, T[37]);
          c = HH(c, d, a, b, M_offset_7, 16, T[38]);
          b = HH(b, c, d, a, M_offset_10, 23, T[39]);
          a = HH(a, b, c, d, M_offset_13, 4, T[40]);
          d = HH(d, a, b, c, M_offset_0, 11, T[41]);
          c = HH(c, d, a, b, M_offset_3, 16, T[42]);
          b = HH(b, c, d, a, M_offset_6, 23, T[43]);
          a = HH(a, b, c, d, M_offset_9, 4, T[44]);
          d = HH(d, a, b, c, M_offset_12, 11, T[45]);
          c = HH(c, d, a, b, M_offset_15, 16, T[46]);
          b = HH(b, c, d, a, M_offset_2, 23, T[47]);

          a = II(a, b, c, d, M_offset_0, 6, T[48]);
          d = II(d, a, b, c, M_offset_7, 10, T[49]);
          c = II(c, d, a, b, M_offset_14, 15, T[50]);
          b = II(b, c, d, a, M_offset_5, 21, T[51]);
          a = II(a, b, c, d, M_offset_12, 6, T[52]);
          d = II(d, a, b, c, M_offset_3, 10, T[53]);
          c = II(c, d, a, b, M_offset_10, 15, T[54]);
          b = II(b, c, d, a, M_offset_1, 21, T[55]);
          a = II(a, b, c, d, M_offset_8, 6, T[56]);
          d = II(d, a, b, c, M_offset_15, 10, T[57]);
          c = II(c, d, a, b, M_offset_6, 15, T[58]);
          b = II(b, c, d, a, M_offset_13, 21, T[59]);
          a = II(a, b, c, d, M_offset_4, 6, T[60]);
          d = II(d, a, b, c, M_offset_11, 10, T[61]);
          c = II(c, d, a, b, M_offset_2, 15, T[62]);
          b = II(b, c, d, a, M_offset_9, 21, T[63]);

          // Intermediate hash value
          H[0] = (H[0] + a) | 0;
          H[1] = (H[1] + b) | 0;
          H[2] = (H[2] + c) | 0;
          H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

          var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
          var nBitsTotalL = nBitsTotal;
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
            (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
          );
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
            (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
          );

          data.sigBytes = (dataWords.length + 1) * 4;

          // Hash final blocks
          this._process();

          // Shortcuts
          var hash = this._hash;
          var H = hash.words;

          // Swap endian
          for (var i = 0; i < 4; i++) {
            // Shortcut
            var H_i = H[i];

            H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
              (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
          }

          // Return final computed hash
          return hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        }
      });

      function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.MD5('message');
       *     var hash = CryptoJS.MD5(wordArray);
       */
      C.MD5 = Hasher._createHelper(MD5);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacMD5(message, key);
       */
      C.HmacMD5 = Hasher._createHmacHelper(MD5);
    }(Math));


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Reusable object
      var W = [];

      /**
       * SHA-1 hash algorithm.
       */
      var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function () {
          this._hash = new WordArray.init([
            0x67452301, 0xefcdab89,
            0x98badcfe, 0x10325476,
            0xc3d2e1f0
          ]);
        },

        _doProcessBlock: function (M, offset) {
          // Shortcut
          var H = this._hash.words;

          // Working variables
          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];
          var e = H[4];

          // Computation
          for (var i = 0; i < 80; i++) {
            if (i < 16) {
              W[i] = M[offset + i] | 0;
            } else {
              var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
              W[i] = (n << 1) | (n >>> 31);
            }

            var t = ((a << 5) | (a >>> 27)) + e + W[i];
            if (i < 20) {
              t += ((b & c) | (~b & d)) + 0x5a827999;
            } else if (i < 40) {
              t += (b ^ c ^ d) + 0x6ed9eba1;
            } else if (i < 60) {
              t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
            } else /* if (i < 80) */ {
              t += (b ^ c ^ d) - 0x359d3e2a;
            }

            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = t;
          }

          // Intermediate hash value
          H[0] = (H[0] + a) | 0;
          H[1] = (H[1] + b) | 0;
          H[2] = (H[2] + c) | 0;
          H[3] = (H[3] + d) | 0;
          H[4] = (H[4] + e) | 0;
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Return final computed hash
          return this._hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA1('message');
       *     var hash = CryptoJS.SHA1(wordArray);
       */
      C.SHA1 = Hasher._createHelper(SHA1);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA1(message, key);
       */
      C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    }());


    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Initialization and round constants tables
      var H = [];
      var K = [];

      // Compute constants
      (function () {
        function isPrime(n) {
          var sqrtN = Math.sqrt(n);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n % factor)) {
              return false;
            }
          }

          return true;
        }

        function getFractionalBits(n) {
          return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n)) {
            if (nPrime < 8) {
              H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
            }
            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

            nPrime++;
          }

          n++;
        }
      }());

      // Reusable object
      var W = [];

      /**
       * SHA-256 hash algorithm.
       */
      var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
          this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
          // Shortcut
          var H = this._hash.words;

          // Working variables
          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];
          var e = H[4];
          var f = H[5];
          var g = H[6];
          var h = H[7];

          // Computation
          for (var i = 0; i < 64; i++) {
            if (i < 16) {
              W[i] = M[offset + i] | 0;
            } else {
              var gamma0x = W[i - 15];
              var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                ((gamma0x << 14) | (gamma0x >>> 18)) ^
                (gamma0x >>> 3);

              var gamma1x = W[i - 2];
              var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                ((gamma1x << 13) | (gamma1x >>> 19)) ^
                (gamma1x >>> 10);

              W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
            }

            var ch = (e & f) ^ (~e & g);
            var maj = (a & b) ^ (a & c) ^ (b & c);

            var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
            var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

            var t1 = h + sigma1 + ch + K[i] + W[i];
            var t2 = sigma0 + maj;

            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
          }

          // Intermediate hash value
          H[0] = (H[0] + a) | 0;
          H[1] = (H[1] + b) | 0;
          H[2] = (H[2] + c) | 0;
          H[3] = (H[3] + d) | 0;
          H[4] = (H[4] + e) | 0;
          H[5] = (H[5] + f) | 0;
          H[6] = (H[6] + g) | 0;
          H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Return final computed hash
          return this._hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA256('message');
       *     var hash = CryptoJS.SHA256(wordArray);
       */
      C.SHA256 = Hasher._createHelper(SHA256);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA256(message, key);
       */
      C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    }(Math));


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var SHA256 = C_algo.SHA256;

      /**
       * SHA-224 hash algorithm.
       */
      var SHA224 = C_algo.SHA224 = SHA256.extend({
        _doReset: function () {
          this._hash = new WordArray.init([
            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
            0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
          ]);
        },

        _doFinalize: function () {
          var hash = SHA256._doFinalize.call(this);

          hash.sigBytes -= 4;

          return hash;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA224('message');
       *     var hash = CryptoJS.SHA224(wordArray);
       */
      C.SHA224 = SHA256._createHelper(SHA224);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA224(message, key);
       */
      C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Hasher = C_lib.Hasher;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C.algo;

      function X64Word_create() {
        return X64Word.create.apply(X64Word, arguments);
      }

      // Constants
      var K = [
        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
      ];

      // Reusable objects
      var W = [];
      (function () {
        for (var i = 0; i < 80; i++) {
          W[i] = X64Word_create();
        }
      }());

      /**
       * SHA-512 hash algorithm.
       */
      var SHA512 = C_algo.SHA512 = Hasher.extend({
        _doReset: function () {
          this._hash = new X64WordArray.init([
            new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
            new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
            new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
            new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
          ]);
        },

        _doProcessBlock: function (M, offset) {
          // Shortcuts
          var H = this._hash.words;

          var H0 = H[0];
          var H1 = H[1];
          var H2 = H[2];
          var H3 = H[3];
          var H4 = H[4];
          var H5 = H[5];
          var H6 = H[6];
          var H7 = H[7];

          var H0h = H0.high;
          var H0l = H0.low;
          var H1h = H1.high;
          var H1l = H1.low;
          var H2h = H2.high;
          var H2l = H2.low;
          var H3h = H3.high;
          var H3l = H3.low;
          var H4h = H4.high;
          var H4l = H4.low;
          var H5h = H5.high;
          var H5l = H5.low;
          var H6h = H6.high;
          var H6l = H6.low;
          var H7h = H7.high;
          var H7l = H7.low;

          // Working variables
          var ah = H0h;
          var al = H0l;
          var bh = H1h;
          var bl = H1l;
          var ch = H2h;
          var cl = H2l;
          var dh = H3h;
          var dl = H3l;
          var eh = H4h;
          var el = H4l;
          var fh = H5h;
          var fl = H5l;
          var gh = H6h;
          var gl = H6l;
          var hh = H7h;
          var hl = H7l;

          // Rounds
          for (var i = 0; i < 80; i++) {
            var Wil;
            var Wih;

            // Shortcut
            var Wi = W[i];

            // Extend message
            if (i < 16) {
              Wih = Wi.high = M[offset + i * 2] | 0;
              Wil = Wi.low = M[offset + i * 2 + 1] | 0;
            } else {
              // Gamma0
              var gamma0x = W[i - 15];
              var gamma0xh = gamma0x.high;
              var gamma0xl = gamma0x.low;
              var gamma0h = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
              var gamma0l = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

              // Gamma1
              var gamma1x = W[i - 2];
              var gamma1xh = gamma1x.high;
              var gamma1xl = gamma1x.low;
              var gamma1h = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
              var gamma1l = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

              // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
              var Wi7 = W[i - 7];
              var Wi7h = Wi7.high;
              var Wi7l = Wi7.low;

              var Wi16 = W[i - 16];
              var Wi16h = Wi16.high;
              var Wi16l = Wi16.low;

              Wil = gamma0l + Wi7l;
              Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
              Wil = Wil + gamma1l;
              Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
              Wil = Wil + Wi16l;
              Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

              Wi.high = Wih;
              Wi.low = Wil;
            }

            var chh = (eh & fh) ^ (~eh & gh);
            var chl = (el & fl) ^ (~el & gl);
            var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

            var sigma0h = ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
            var sigma0l = ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
            var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
            var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

            // t1 = h + sigma1 + ch + K[i] + W[i]
            var Ki = K[i];
            var Kih = Ki.high;
            var Kil = Ki.low;

            var t1l = hl + sigma1l;
            var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
            var t1l = t1l + chl;
            var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
            var t1l = t1l + Kil;
            var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
            var t1l = t1l + Wil;
            var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

            // t2 = sigma0 + maj
            var t2l = sigma0l + majl;
            var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

            // Update working variables
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = (dl + t1l) | 0;
            eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = (t1l + t2l) | 0;
            ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
          }

          // Intermediate hash value
          H0l = H0.low = (H0l + al);
          H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
          H1l = H1.low = (H1l + bl);
          H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
          H2l = H2.low = (H2l + cl);
          H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
          H3l = H3.low = (H3l + dl);
          H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
          H4l = H4.low = (H4l + el);
          H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
          H5l = H5.low = (H5l + fl);
          H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
          H6l = H6.low = (H6l + gl);
          H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
          H7l = H7.low = (H7l + hl);
          H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
          dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Convert hash to 32-bit word array before returning
          var hash = this._hash.toX32();

          // Return final computed hash
          return hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        },

        blockSize: 1024 / 32
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA512('message');
       *     var hash = CryptoJS.SHA512(wordArray);
       */
      C.SHA512 = Hasher._createHelper(SHA512);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA512(message, key);
       */
      C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C.algo;
      var SHA512 = C_algo.SHA512;

      /**
       * SHA-384 hash algorithm.
       */
      var SHA384 = C_algo.SHA384 = SHA512.extend({
        _doReset: function () {
          this._hash = new X64WordArray.init([
            new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
            new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
            new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
            new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
          ]);
        },

        _doFinalize: function () {
          var hash = SHA512._doFinalize.call(this);

          hash.sigBytes -= 16;

          return hash;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA384('message');
       *     var hash = CryptoJS.SHA384(wordArray);
       */
      C.SHA384 = SHA512._createHelper(SHA384);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA384(message, key);
       */
      C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
    }());


    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var C_algo = C.algo;

      // Constants tables
      var RHO_OFFSETS = [];
      var PI_INDEXES = [];
      var ROUND_CONSTANTS = [];

      // Compute Constants
      (function () {
        // Compute rho offset constants
        var x = 1, y = 0;
        for (var t = 0; t < 24; t++) {
          RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

          var newX = y % 5;
          var newY = (2 * x + 3 * y) % 5;
          x = newX;
          y = newY;
        }

        // Compute pi index constants
        for (var x = 0; x < 5; x++) {
          for (var y = 0; y < 5; y++) {
            PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
          }
        }

        // Compute round constants
        var LFSR = 0x01;
        for (var i = 0; i < 24; i++) {
          var roundConstantMsw = 0;
          var roundConstantLsw = 0;

          for (var j = 0; j < 7; j++) {
            if (LFSR & 0x01) {
              var bitPosition = (1 << j) - 1;
              if (bitPosition < 32) {
                roundConstantLsw ^= 1 << bitPosition;
              } else /* if (bitPosition >= 32) */ {
                roundConstantMsw ^= 1 << (bitPosition - 32);
              }
            }

            // Compute next LFSR
            if (LFSR & 0x80) {
              // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
              LFSR = (LFSR << 1) ^ 0x71;
            } else {
              LFSR <<= 1;
            }
          }

          ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
        }
      }());

      // Reusable objects for temporary values
      var T = [];
      (function () {
        for (var i = 0; i < 25; i++) {
          T[i] = X64Word.create();
        }
      }());

      /**
       * SHA-3 hash algorithm.
       */
      var SHA3 = C_algo.SHA3 = Hasher.extend({
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   Only values permitted are: 224, 256, 384, 512.
         *   Default: 512
         */
        cfg: Hasher.cfg.extend({
          outputLength: 512
        }),

        _doReset: function () {
          var state = this._state = [];
          for (var i = 0; i < 25; i++) {
            state[i] = new X64Word.init();
          }

          this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
        },

        _doProcessBlock: function (M, offset) {
          // Shortcuts
          var state = this._state;
          var nBlockSizeLanes = this.blockSize / 2;

          // Absorb
          for (var i = 0; i < nBlockSizeLanes; i++) {
            // Shortcuts
            var M2i = M[offset + 2 * i];
            var M2i1 = M[offset + 2 * i + 1];

            // Swap endian
            M2i = (
              (((M2i << 8) | (M2i >>> 24)) & 0x00ff00ff) |
              (((M2i << 24) | (M2i >>> 8)) & 0xff00ff00)
            );
            M2i1 = (
              (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00ff00ff) |
              (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff00ff00)
            );

            // Absorb message into state
            var lane = state[i];
            lane.high ^= M2i1;
            lane.low ^= M2i;
          }

          // Rounds
          for (var round = 0; round < 24; round++) {
            // Theta
            for (var x = 0; x < 5; x++) {
              // Mix column lanes
              var tMsw = 0, tLsw = 0;
              for (var y = 0; y < 5; y++) {
                var lane = state[x + 5 * y];
                tMsw ^= lane.high;
                tLsw ^= lane.low;
              }

              // Temporary values
              var Tx = T[x];
              Tx.high = tMsw;
              Tx.low = tLsw;
            }
            for (var x = 0; x < 5; x++) {
              // Shortcuts
              var Tx4 = T[(x + 4) % 5];
              var Tx1 = T[(x + 1) % 5];
              var Tx1Msw = Tx1.high;
              var Tx1Lsw = Tx1.low;

              // Mix surrounding columns
              var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
              var tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
              for (var y = 0; y < 5; y++) {
                var lane = state[x + 5 * y];
                lane.high ^= tMsw;
                lane.low ^= tLsw;
              }
            }

            // Rho Pi
            for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
              var tMsw;
              var tLsw;

              // Shortcuts
              var lane = state[laneIndex];
              var laneMsw = lane.high;
              var laneLsw = lane.low;
              var rhoOffset = RHO_OFFSETS[laneIndex];

              // Rotate lanes
              if (rhoOffset < 32) {
                tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
              } else /* if (rhoOffset >= 32) */ {
                tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
              }

              // Transpose lanes
              var TPiLane = T[PI_INDEXES[laneIndex]];
              TPiLane.high = tMsw;
              TPiLane.low = tLsw;
            }

            // Rho pi at x = y = 0
            var T0 = T[0];
            var state0 = state[0];
            T0.high = state0.high;
            T0.low = state0.low;

            // Chi
            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                // Shortcuts
                var laneIndex = x + 5 * y;
                var lane = state[laneIndex];
                var TLane = T[laneIndex];
                var Tx1Lane = T[((x + 1) % 5) + 5 * y];
                var Tx2Lane = T[((x + 2) % 5) + 5 * y];

                // Mix rows
                lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
              }
            }

            // Iota
            var lane = state[0];
            var roundConstant = ROUND_CONSTANTS[round];
            lane.high ^= roundConstant.high;
            lane.low ^= roundConstant.low;
          }
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          var blockSizeBits = this.blockSize * 32;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
          dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Shortcuts
          var state = this._state;
          var outputLengthBytes = this.cfg.outputLength / 8;
          var outputLengthLanes = outputLengthBytes / 8;

          // Squeeze
          var hashWords = [];
          for (var i = 0; i < outputLengthLanes; i++) {
            // Shortcuts
            var lane = state[i];
            var laneMsw = lane.high;
            var laneLsw = lane.low;

            // Swap endian
            laneMsw = (
              (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00ff00ff) |
              (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff00ff00)
            );
            laneLsw = (
              (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00ff00ff) |
              (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff00ff00)
            );

            // Squeeze state to retrieve hash
            hashWords.push(laneLsw);
            hashWords.push(laneMsw);
          }

          // Return final computed hash
          return new WordArray.init(hashWords, outputLengthBytes);
        },

        clone: function () {
          var clone = Hasher.clone.call(this);

          var state = clone._state = this._state.slice(0);
          for (var i = 0; i < 25; i++) {
            state[i] = state[i].clone();
          }

          return clone;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA3('message');
       *     var hash = CryptoJS.SHA3(wordArray);
       */
      C.SHA3 = Hasher._createHelper(SHA3);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA3(message, key);
       */
      C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
    }(Math));


    /** @preserve
     (c) 2012 by Cédric Mesnil. All rights reserved.

     Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

     - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
     - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Constants table
      var _zl = WordArray.create([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
        3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
        1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
        4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
      var _zr = WordArray.create([
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
        6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
        15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
        8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
        12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
      var _sl = WordArray.create([
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
        7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
        11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
        11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
        9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
      var _sr = WordArray.create([
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
        9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
        9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
        15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
        8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

      var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
      var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

      /**
       * RIPEMD160 hash algorithm.
       */
      var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
        _doReset: function () {
          this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
        },

        _doProcessBlock: function (M, offset) {

          // Swap endian
          for (var i = 0; i < 16; i++) {
            // Shortcuts
            var offset_i = offset + i;
            var M_offset_i = M[offset_i];

            // Swap
            M[offset_i] = (
              (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
              (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
            );
          }
          // Shortcut
          var H = this._hash.words;
          var hl = _hl.words;
          var hr = _hr.words;
          var zl = _zl.words;
          var zr = _zr.words;
          var sl = _sl.words;
          var sr = _sr.words;

          // Working variables
          var al, bl, cl, dl, el;
          var ar, br, cr, dr, er;

          ar = al = H[0];
          br = bl = H[1];
          cr = cl = H[2];
          dr = dl = H[3];
          er = el = H[4];
          // Computation
          var t;
          for (var i = 0; i < 80; i += 1) {
            t = (al + M[offset + zl[i]]) | 0;
            if (i < 16) {
              t += f1(bl, cl, dl) + hl[0];
            } else if (i < 32) {
              t += f2(bl, cl, dl) + hl[1];
            } else if (i < 48) {
              t += f3(bl, cl, dl) + hl[2];
            } else if (i < 64) {
              t += f4(bl, cl, dl) + hl[3];
            } else {// if (i<80) {
              t += f5(bl, cl, dl) + hl[4];
            }
            t = t | 0;
            t = rotl(t, sl[i]);
            t = (t + el) | 0;
            al = el;
            el = dl;
            dl = rotl(cl, 10);
            cl = bl;
            bl = t;

            t = (ar + M[offset + zr[i]]) | 0;
            if (i < 16) {
              t += f5(br, cr, dr) + hr[0];
            } else if (i < 32) {
              t += f4(br, cr, dr) + hr[1];
            } else if (i < 48) {
              t += f3(br, cr, dr) + hr[2];
            } else if (i < 64) {
              t += f2(br, cr, dr) + hr[3];
            } else {// if (i<80) {
              t += f1(br, cr, dr) + hr[4];
            }
            t = t | 0;
            t = rotl(t, sr[i]);
            t = (t + er) | 0;
            ar = er;
            er = dr;
            dr = rotl(cr, 10);
            cr = br;
            br = t;
          }
          // Intermediate hash value
          t = (H[1] + cl + dr) | 0;
          H[1] = (H[2] + dl + er) | 0;
          H[2] = (H[3] + el + ar) | 0;
          H[3] = (H[4] + al + br) | 0;
          H[4] = (H[0] + bl + cr) | 0;
          H[0] = t;
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
            (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
            (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00)
          );
          data.sigBytes = (dataWords.length + 1) * 4;

          // Hash final blocks
          this._process();

          // Shortcuts
          var hash = this._hash;
          var H = hash.words;

          // Swap endian
          for (var i = 0; i < 5; i++) {
            // Shortcut
            var H_i = H[i];

            // Swap
            H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
              (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
          }

          // Return final computed hash
          return hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        }
      });


      function f1(x, y, z) {
        return ((x) ^ (y) ^ (z));

      }

      function f2(x, y, z) {
        return (((x) & (y)) | ((~x) & (z)));
      }

      function f3(x, y, z) {
        return (((x) | (~(y))) ^ (z));
      }

      function f4(x, y, z) {
        return (((x) & (z)) | ((y) & (~(z))));
      }

      function f5(x, y, z) {
        return ((x) ^ ((y) | (~(z))));

      }

      function rotl(x, n) {
        return (x << n) | (x >>> (32 - n));
      }


      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.RIPEMD160('message');
       *     var hash = CryptoJS.RIPEMD160(wordArray);
       */
      C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
       */
      C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var C_enc = C.enc;
      var Utf8 = C_enc.Utf8;
      var C_algo = C.algo;

      /**
       * HMAC algorithm.
       */
      C_algo.HMAC = Base.extend({
        /**
         * Initializes a newly created HMAC.
         *
         * @param {Hasher} hasher The hash algorithm to use.
         * @param {WordArray|string} key The secret key.
         *
         * @example
         *
         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
         */
        init: function (hasher, key) {
          // Init hasher
          hasher = this._hasher = new hasher.init();

          // Convert string to WordArray, else assume WordArray already
          if (typeof key == 'string') {
            key = Utf8.parse(key);
          }

          // Shortcuts
          var hasherBlockSize = hasher.blockSize;
          var hasherBlockSizeBytes = hasherBlockSize * 4;

          // Allow arbitrary length keys
          if (key.sigBytes > hasherBlockSizeBytes) {
            key = hasher.finalize(key);
          }

          // Clamp excess bits
          key.clamp();

          // Clone key for inner and outer pads
          var oKey = this._oKey = key.clone();
          var iKey = this._iKey = key.clone();

          // Shortcuts
          var oKeyWords = oKey.words;
          var iKeyWords = iKey.words;

          // XOR keys with pad constants
          for (var i = 0; i < hasherBlockSize; i++) {
            oKeyWords[i] ^= 0x5c5c5c5c;
            iKeyWords[i] ^= 0x36363636;
          }
          oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

          // Set initial values
          this.reset();
        },

        /**
         * Resets this HMAC to its initial state.
         *
         * @example
         *
         *     hmacHasher.reset();
         */
        reset: function () {
          // Shortcut
          var hasher = this._hasher;

          // Reset
          hasher.reset();
          hasher.update(this._iKey);
        },

        /**
         * Updates this HMAC with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {HMAC} This HMAC instance.
         *
         * @example
         *
         *     hmacHasher.update('message');
         *     hmacHasher.update(wordArray);
         */
        update: function (messageUpdate) {
          this._hasher.update(messageUpdate);

          // Chainable
          return this;
        },

        /**
         * Finalizes the HMAC computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The HMAC.
         *
         * @example
         *
         *     var hmac = hmacHasher.finalize();
         *     var hmac = hmacHasher.finalize('message');
         *     var hmac = hmacHasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
          // Shortcut
          var hasher = this._hasher;

          // Compute HMAC
          var innerHash = hasher.finalize(messageUpdate);
          hasher.reset();
          var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

          return hmac;
        }
      });
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var SHA256 = C_algo.SHA256;
      var HMAC = C_algo.HMAC;

      /**
       * Password-Based Key Derivation Function 2 algorithm.
       */
      var PBKDF2 = C_algo.PBKDF2 = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA256
         * @property {number} iterations The number of iterations to perform. Default: 250000
         */
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: SHA256,
          iterations: 250000
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.PBKDF2.create();
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
          this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
          // Shortcut
          var cfg = this.cfg;

          // Init HMAC
          var hmac = HMAC.create(cfg.hasher, password);

          // Initial values
          var derivedKey = WordArray.create();
          var blockIndex = WordArray.create([0x00000001]);

          // Shortcuts
          var derivedKeyWords = derivedKey.words;
          var blockIndexWords = blockIndex.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations;

          // Generate key
          while (derivedKeyWords.length < keySize) {
            var block = hmac.update(salt).finalize(blockIndex);
            hmac.reset();

            // Shortcuts
            var blockWords = block.words;
            var blockWordsLength = blockWords.length;

            // Iterations
            var intermediate = block;
            for (var i = 1; i < iterations; i++) {
              intermediate = hmac.finalize(intermediate);
              hmac.reset();

              // Shortcut
              var intermediateWords = intermediate.words;

              // XOR intermediate with block
              for (var j = 0; j < blockWordsLength; j++) {
                blockWords[j] ^= intermediateWords[j];
              }
            }

            derivedKey.concat(block);
            blockIndexWords[0]++;
          }
          derivedKey.sigBytes = keySize * 4;

          return derivedKey;
        }
      });

      /**
       * Computes the Password-Based Key Derivation Function 2.
       *
       * @param {WordArray|string} password The password.
       * @param {WordArray|string} salt A salt.
       * @param {Object} cfg (Optional) The configuration options to use for this computation.
       *
       * @return {WordArray} The derived key.
       *
       * @static
       *
       * @example
       *
       *     var key = CryptoJS.PBKDF2(password, salt);
       *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
       *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
       */
      C.PBKDF2 = function (password, salt, cfg) {
        return PBKDF2.create(cfg).compute(password, salt);
      };
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var MD5 = C_algo.MD5;

      /**
       * This key derivation function is meant to conform with EVP_BytesToKey.
       * www.openssl.org/docs/crypto/EVP_BytesToKey.html
       */
      var EvpKDF = C_algo.EvpKDF = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: MD5,
          iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.EvpKDF.create();
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
          this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
          var block;

          // Shortcut
          var cfg = this.cfg;

          // Init hasher
          var hasher = cfg.hasher.create();

          // Initial values
          var derivedKey = WordArray.create();

          // Shortcuts
          var derivedKeyWords = derivedKey.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations;

          // Generate key
          while (derivedKeyWords.length < keySize) {
            if (block) {
              hasher.update(block);
            }
            block = hasher.update(password).finalize(salt);
            hasher.reset();

            // Iterations
            for (var i = 1; i < iterations; i++) {
              block = hasher.finalize(block);
              hasher.reset();
            }

            derivedKey.concat(block);
          }
          derivedKey.sigBytes = keySize * 4;

          return derivedKey;
        }
      });

      /**
       * Derives a key from a password.
       *
       * @param {WordArray|string} password The password.
       * @param {WordArray|string} salt A salt.
       * @param {Object} cfg (Optional) The configuration options to use for this computation.
       *
       * @return {WordArray} The derived key.
       *
       * @static
       *
       * @example
       *
       *     var key = CryptoJS.EvpKDF(password, salt);
       *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
       *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
       */
      C.EvpKDF = function (password, salt, cfg) {
        return EvpKDF.create(cfg).compute(password, salt);
      };
    }());


    /**
     * Cipher core components.
     */
    CryptoJS.lib.Cipher || (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
      var C_enc = C.enc;
      C_enc.Utf8;
      var Base64 = C_enc.Base64;
      var C_algo = C.algo;
      var EvpKDF = C_algo.EvpKDF;

      /**
       * Abstract base cipher template.
       *
       * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
       * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
       * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
       * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
       */
      var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
          return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
          return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
          // Apply config defaults
          this.cfg = this.cfg.extend(cfg);

          // Store transform mode and key
          this._xformMode = xformMode;
          this._key = key;

          // Set initial values
          this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
          // Reset data buffer
          BufferedBlockAlgorithm.reset.call(this);

          // Perform concrete-cipher logic
          this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
          // Append
          this._append(dataUpdate);

          // Process available blocks
          return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
          // Final data update
          if (dataUpdate) {
            this._append(dataUpdate);
          }

          // Perform concrete-cipher logic
          var finalProcessedData = this._doFinalize();

          return finalProcessedData;
        },

        keySize: 128 / 32,

        ivSize: 128 / 32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: (function () {
          function selectCipherStrategy(key) {
            if (typeof key == 'string') {
              return PasswordBasedCipher;
            } else {
              return SerializableCipher;
            }
          }

          return function (cipher) {
            return {
              encrypt: function (message, key, cfg) {
                return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
              },

              decrypt: function (ciphertext, key, cfg) {
                return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
              }
            };
          };
        }())
      });

      /**
       * Abstract base stream cipher template.
       *
       * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
       */
      C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function () {
          // Process partial blocks
          var finalProcessedBlocks = this._process(!!'flush');

          return finalProcessedBlocks;
        },

        blockSize: 1
      });

      /**
       * Mode namespace.
       */
      var C_mode = C.mode = {};

      /**
       * Abstract base block cipher mode template.
       */
      var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function (cipher, iv) {
          return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function (cipher, iv) {
          return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function (cipher, iv) {
          this._cipher = cipher;
          this._iv = iv;
        }
      });

      /**
       * Cipher Block Chaining mode.
       */
      var CBC = C_mode.CBC = (function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
          /**
           * Processes the data block at offset.
           *
           * @param {Array} words The data words to operate on.
           * @param {number} offset The offset where the block starts.
           *
           * @example
           *
           *     mode.processBlock(data.words, offset);
           */
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            // XOR and encrypt
            xorBlock.call(this, words, offset, blockSize);
            cipher.encryptBlock(words, offset);

            // Remember this block to use with next block
            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
          /**
           * Processes the data block at offset.
           *
           * @param {Array} words The data words to operate on.
           * @param {number} offset The offset where the block starts.
           *
           * @example
           *
           *     mode.processBlock(data.words, offset);
           */
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            // Remember this block to use with next block
            var thisBlock = words.slice(offset, offset + blockSize);

            // Decrypt and XOR
            cipher.decryptBlock(words, offset);
            xorBlock.call(this, words, offset, blockSize);

            // This block becomes the previous block
            this._prevBlock = thisBlock;
          }
        });

        function xorBlock(words, offset, blockSize) {
          var block;

          // Shortcut
          var iv = this._iv;

          // Choose mixing block
          if (iv) {
            block = iv;

            // Remove IV for subsequent blocks
            this._iv = undefined$1;
          } else {
            block = this._prevBlock;
          }

          // XOR blocks
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= block[i];
          }
        }

        return CBC;
      }());

      /**
       * Padding namespace.
       */
      var C_pad = C.pad = {};

      /**
       * PKCS #5/7 padding strategy.
       */
      var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function (data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4;

          // Count padding bytes
          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

          // Create padding word
          var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

          // Create padding
          var paddingWords = [];
          for (var i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(paddingWord);
          }
          var padding = WordArray.create(paddingWords, nPaddingBytes);

          // Add padding
          data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function (data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

          // Remove padding
          data.sigBytes -= nPaddingBytes;
        }
      };

      /**
       * Abstract base block cipher template.
       *
       * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
       */
      C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
          mode: CBC,
          padding: Pkcs7
        }),

        reset: function () {
          var modeCreator;

          // Reset cipher
          Cipher.reset.call(this);

          // Shortcuts
          var cfg = this.cfg;
          var iv = cfg.iv;
          var mode = cfg.mode;

          // Reset block mode
          if (this._xformMode == this._ENC_XFORM_MODE) {
            modeCreator = mode.createEncryptor;
          } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            modeCreator = mode.createDecryptor;
            // Keep at least one block in the buffer for unpadding
            this._minBufferSize = 1;
          }

          if (this._mode && this._mode.__creator == modeCreator) {
            this._mode.init(this, iv && iv.words);
          } else {
            this._mode = modeCreator.call(mode, this, iv && iv.words);
            this._mode.__creator = modeCreator;
          }
        },

        _doProcessBlock: function (words, offset) {
          this._mode.processBlock(words, offset);
        },

        _doFinalize: function () {
          var finalProcessedBlocks;

          // Shortcut
          var padding = this.cfg.padding;

          // Finalize
          if (this._xformMode == this._ENC_XFORM_MODE) {
            // Pad data
            padding.pad(this._data, this.blockSize);

            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');
          } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');

            // Unpad data
            padding.unpad(finalProcessedBlocks);
          }

          return finalProcessedBlocks;
        },

        blockSize: 128 / 32
      });

      /**
       * A collection of cipher parameters.
       *
       * @property {WordArray} ciphertext The raw ciphertext.
       * @property {WordArray} key The key to this ciphertext.
       * @property {WordArray} iv The IV used in the ciphering operation.
       * @property {WordArray} salt The salt used with a key derivation function.
       * @property {Cipher} algorithm The cipher algorithm.
       * @property {Mode} mode The block mode used in the ciphering operation.
       * @property {Padding} padding The padding scheme used in the ciphering operation.
       * @property {number} blockSize The block size of the cipher.
       * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
       */
      var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
          this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (formatter) {
          return (formatter || this.formatter).stringify(this);
        }
      });

      /**
       * Format namespace.
       */
      var C_format = C.format = {};

      /**
       * OpenSSL formatting strategy.
       */
      var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
          var wordArray;

          // Shortcuts
          var ciphertext = cipherParams.ciphertext;
          var salt = cipherParams.salt;

          // Format
          if (salt) {
            wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
          } else {
            wordArray = ciphertext;
          }

          return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
          var salt;

          // Parse base64
          var ciphertext = Base64.parse(openSSLStr);

          // Shortcut
          var ciphertextWords = ciphertext.words;

          // Test for salt
          if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
            // Extract salt
            salt = WordArray.create(ciphertextWords.slice(2, 4));

            // Remove salt from ciphertext
            ciphertextWords.splice(0, 4);
            ciphertext.sigBytes -= 16;
          }

          return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
      };

      /**
       * A cipher wrapper that returns ciphertext as a serializable cipher params object.
       */
      var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
          format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Encrypt
          var encryptor = cipher.createEncryptor(key, cfg);
          var ciphertext = encryptor.finalize(message);

          // Shortcut
          var cipherCfg = encryptor.cfg;

          // Create and return serializable cipher params
          return CipherParams.create({
            ciphertext: ciphertext,
            key: key,
            iv: cipherCfg.iv,
            algorithm: cipher,
            mode: cipherCfg.mode,
            padding: cipherCfg.padding,
            blockSize: cipher.blockSize,
            formatter: cfg.format
          });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Convert string to CipherParams
          ciphertext = this._parse(ciphertext, cfg.format);

          // Decrypt
          var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

          return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
          if (typeof ciphertext == 'string') {
            return format.parse(ciphertext, this);
          } else {
            return ciphertext;
          }
        }
      });

      /**
       * Key derivation function namespace.
       */
      var C_kdf = C.kdf = {};

      /**
       * OpenSSL key derivation function.
       */
      var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function (password, keySize, ivSize, salt, hasher) {
          // Generate random salt
          if (!salt) {
            salt = WordArray.random(64 / 8);
          }

          // Derive key and IV
          if (!hasher) {
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
          } else {
            var key = EvpKDF.create({ keySize: keySize + ivSize, hasher: hasher }).compute(password, salt);
          }


          // Separate key and IV
          var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
          key.sigBytes = keySize * 4;

          // Return params
          return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
      };

      /**
       * A serializable cipher wrapper that derives the key from a password,
       * and returns ciphertext as a serializable cipher params object.
       */
      var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
          kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Derive key and other params
          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);

          // Add IV to config
          cfg.iv = derivedParams.iv;

          // Encrypt
          var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

          // Mix in derived params
          ciphertext.mixIn(derivedParams);

          return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Convert string to CipherParams
          ciphertext = this._parse(ciphertext, cfg.format);

          // Derive key and other params
          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);

          // Add IV to config
          cfg.iv = derivedParams.iv;

          // Decrypt
          var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

          return plaintext;
        }
      });
    }());


    /**
     * Cipher Feedback block mode.
     */
    CryptoJS.mode.CFB = (function () {
      var CFB = CryptoJS.lib.BlockCipherMode.extend();

      CFB.Encryptor = CFB.extend({
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;

          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

          // Remember this block to use with next block
          this._prevBlock = words.slice(offset, offset + blockSize);
        }
      });

      CFB.Decryptor = CFB.extend({
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;

          // Remember this block to use with next block
          var thisBlock = words.slice(offset, offset + blockSize);

          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

          // This block becomes the previous block
          this._prevBlock = thisBlock;
        }
      });

      function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
        var keystream;

        // Shortcut
        var iv = this._iv;

        // Generate keystream
        if (iv) {
          keystream = iv.slice(0);

          // Remove IV for subsequent blocks
          this._iv = undefined;
        } else {
          keystream = this._prevBlock;
        }
        cipher.encryptBlock(keystream, 0);

        // Encrypt
        for (var i = 0; i < blockSize; i++) {
          words[offset + i] ^= keystream[i];
        }
      }

      return CFB;
    }());


    /**
     * Counter block mode.
     */
    CryptoJS.mode.CTR = (function () {
      var CTR = CryptoJS.lib.BlockCipherMode.extend();

      var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter;

          // Generate keystream
          if (iv) {
            counter = this._counter = iv.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
          }
          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0);

          // Increment counter
          counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

          // Encrypt
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });

      CTR.Decryptor = Encryptor;

      return CTR;
    }());


    /** @preserve
     * Counter block mode compatible with  Dr Brian Gladman fileenc.c
     * derived from CryptoJS.mode.CTR
     * Jan Hruby jhruby.web@gmail.com
     */
    CryptoJS.mode.CTRGladman = (function () {
      var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

      function incWord(word) {
        if (((word >> 24) & 0xff) === 0xff) { //overflow
          var b1 = (word >> 16) & 0xff;
          var b2 = (word >> 8) & 0xff;
          var b3 = word & 0xff;

          if (b1 === 0xff) // overflow b1
          {
            b1 = 0;
            if (b2 === 0xff) {
              b2 = 0;
              if (b3 === 0xff) {
                b3 = 0;
              } else {
                ++b3;
              }
            } else {
              ++b2;
            }
          } else {
            ++b1;
          }

          word = 0;
          word += (b1 << 16);
          word += (b2 << 8);
          word += b3;
        } else {
          word += (0x01 << 24);
        }
        return word;
      }

      function incCounter(counter) {
        if ((counter[0] = incWord(counter[0])) === 0) {
          // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
          counter[1] = incWord(counter[1]);
        }
        return counter;
      }

      var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter;

          // Generate keystream
          if (iv) {
            counter = this._counter = iv.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
          }

          incCounter(counter);

          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0);

          // Encrypt
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });

      CTRGladman.Decryptor = Encryptor;

      return CTRGladman;
    }());


    /**
     * Output Feedback block mode.
     */
    CryptoJS.mode.OFB = (function () {
      var OFB = CryptoJS.lib.BlockCipherMode.extend();

      var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var keystream = this._keystream;

          // Generate keystream
          if (iv) {
            keystream = this._keystream = iv.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
          }
          cipher.encryptBlock(keystream, 0);

          // Encrypt
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });

      OFB.Decryptor = Encryptor;

      return OFB;
    }());


    /**
     * Electronic Codebook block mode.
     */
    CryptoJS.mode.ECB = (function () {
      var ECB = CryptoJS.lib.BlockCipherMode.extend();

      ECB.Encryptor = ECB.extend({
        processBlock: function (words, offset) {
          this._cipher.encryptBlock(words, offset);
        }
      });

      ECB.Decryptor = ECB.extend({
        processBlock: function (words, offset) {
          this._cipher.decryptBlock(words, offset);
        }
      });

      return ECB;
    }());


    /**
     * ANSI X.923 padding strategy.
     */
    CryptoJS.pad.AnsiX923 = {
      pad: function (data, blockSize) {
        // Shortcuts
        var dataSigBytes = data.sigBytes;
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

        // Compute last byte position
        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

        // Pad
        data.clamp();
        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
        data.sigBytes += nPaddingBytes;
      },

      unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
      }
    };


    /**
     * ISO 10126 padding strategy.
     */
    CryptoJS.pad.Iso10126 = {
      pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

        // Pad
        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
      },

      unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
      }
    };


    /**
     * ISO/IEC 9797-1 Padding Method 2.
     */
    CryptoJS.pad.Iso97971 = {
      pad: function (data, blockSize) {
        // Add 0x80 byte
        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

        // Zero pad the rest
        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
      },

      unpad: function (data) {
        // Remove zero padding
        CryptoJS.pad.ZeroPadding.unpad(data);

        // Remove one more byte -- the 0x80 byte
        data.sigBytes--;
      }
    };


    /**
     * Zero padding strategy.
     */
    CryptoJS.pad.ZeroPadding = {
      pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Pad
        data.clamp();
        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
      },

      unpad: function (data) {
        // Shortcut
        var dataWords = data.words;

        // Unpad
        var i = data.sigBytes - 1;
        for (var i = data.sigBytes - 1; i >= 0; i--) {
          if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
            data.sigBytes = i + 1;
            break;
          }
        }
      }
    };


    /**
     * A noop padding strategy.
     */
    CryptoJS.pad.NoPadding = {
      pad: function () {
      },

      unpad: function () {
      }
    };


    (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var CipherParams = C_lib.CipherParams;
      var C_enc = C.enc;
      var Hex = C_enc.Hex;
      var C_format = C.format;

      C_format.Hex = {
        /**
         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The hexadecimally encoded string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
          return cipherParams.ciphertext.toString(Hex);
        },

        /**
         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
         *
         * @param {string} input The hexadecimally encoded string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
         */
        parse: function (input) {
          var ciphertext = Hex.parse(input);
          return CipherParams.create({ ciphertext: ciphertext });
        }
      };
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C.algo;

      // Lookup tables
      var SBOX = [];
      var INV_SBOX = [];
      var SUB_MIX_0 = [];
      var SUB_MIX_1 = [];
      var SUB_MIX_2 = [];
      var SUB_MIX_3 = [];
      var INV_SUB_MIX_0 = [];
      var INV_SUB_MIX_1 = [];
      var INV_SUB_MIX_2 = [];
      var INV_SUB_MIX_3 = [];

      // Compute lookup tables
      (function () {
        // Compute double table
        var d = [];
        for (var i = 0; i < 256; i++) {
          if (i < 128) {
            d[i] = i << 1;
          } else {
            d[i] = (i << 1) ^ 0x11b;
          }
        }

        // Walk GF(2^8)
        var x = 0;
        var xi = 0;
        for (var i = 0; i < 256; i++) {
          // Compute sbox
          var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
          sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
          SBOX[x] = sx;
          INV_SBOX[sx] = x;

          // Compute multiplication
          var x2 = d[x];
          var x4 = d[x2];
          var x8 = d[x4];

          // Compute sub bytes, mix columns tables
          var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
          SUB_MIX_0[x] = (t << 24) | (t >>> 8);
          SUB_MIX_1[x] = (t << 16) | (t >>> 16);
          SUB_MIX_2[x] = (t << 8) | (t >>> 24);
          SUB_MIX_3[x] = t;

          // Compute inv sub bytes, inv mix columns tables
          var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
          INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
          INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
          INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
          INV_SUB_MIX_3[sx] = t;

          // Compute next counter
          if (!x) {
            x = xi = 1;
          } else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
          }
        }
      }());

      // Precomputed Rcon lookup
      var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

      /**
       * AES block cipher algorithm.
       */
      var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function () {
          var t;

          // Skip reset of nRounds has been set before and key did not change
          if (this._nRounds && this._keyPriorReset === this._key) {
            return;
          }

          // Shortcuts
          var key = this._keyPriorReset = this._key;
          var keyWords = key.words;
          var keySize = key.sigBytes / 4;

          // Compute number of rounds
          var nRounds = this._nRounds = keySize + 6;

          // Compute number of key schedule rows
          var ksRows = (nRounds + 1) * 4;

          // Compute key schedule
          var keySchedule = this._keySchedule = [];
          for (var ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keySize) {
              keySchedule[ksRow] = keyWords[ksRow];
            } else {
              t = keySchedule[ksRow - 1];

              if (!(ksRow % keySize)) {
                // Rot word
                t = (t << 8) | (t >>> 24);

                // Sub word
                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                // Mix Rcon
                t ^= RCON[(ksRow / keySize) | 0] << 24;
              } else if (keySize > 6 && ksRow % keySize == 4) {
                // Sub word
                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
              }

              keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
            }
          }

          // Compute inv key schedule
          var invKeySchedule = this._invKeySchedule = [];
          for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
            var ksRow = ksRows - invKsRow;

            if (invKsRow % 4) {
              var t = keySchedule[ksRow];
            } else {
              var t = keySchedule[ksRow - 4];
            }

            if (invKsRow < 4 || ksRow <= 4) {
              invKeySchedule[invKsRow] = t;
            } else {
              invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
            }
          }
        },

        encryptBlock: function (M, offset) {
          this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },

        decryptBlock: function (M, offset) {
          // Swap 2nd and 4th rows
          var t = M[offset + 1];
          M[offset + 1] = M[offset + 3];
          M[offset + 3] = t;

          this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

          // Inv swap 2nd and 4th rows
          var t = M[offset + 1];
          M[offset + 1] = M[offset + 3];
          M[offset + 3] = t;
        },

        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
          // Shortcut
          var nRounds = this._nRounds;

          // Get input, add round key
          var s0 = M[offset] ^ keySchedule[0];
          var s1 = M[offset + 1] ^ keySchedule[1];
          var s2 = M[offset + 2] ^ keySchedule[2];
          var s3 = M[offset + 3] ^ keySchedule[3];

          // Key schedule row counter
          var ksRow = 4;

          // Rounds
          for (var round = 1; round < nRounds; round++) {
            // Shift rows, sub bytes, mix columns, add round key
            var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
            var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
            var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
            var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

            // Update state
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
          }

          // Shift rows, sub bytes, add round key
          var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
          var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
          var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
          var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

          // Set output
          M[offset] = t0;
          M[offset + 1] = t1;
          M[offset + 2] = t2;
          M[offset + 3] = t3;
        },

        keySize: 256 / 32
      });

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
       */
      C.AES = BlockCipher._createHelper(AES);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C.algo;

      // Permuted Choice 1 constants
      var PC1 = [
        57, 49, 41, 33, 25, 17, 9, 1,
        58, 50, 42, 34, 26, 18, 10, 2,
        59, 51, 43, 35, 27, 19, 11, 3,
        60, 52, 44, 36, 63, 55, 47, 39,
        31, 23, 15, 7, 62, 54, 46, 38,
        30, 22, 14, 6, 61, 53, 45, 37,
        29, 21, 13, 5, 28, 20, 12, 4
      ];

      // Permuted Choice 2 constants
      var PC2 = [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
      ];

      // Cumulative bit shift constants
      var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

      // SBOXes and round permutation constants
      var SBOX_P = [
        {
          0x0: 0x808200,
          0x10000000: 0x8000,
          0x20000000: 0x808002,
          0x30000000: 0x2,
          0x40000000: 0x200,
          0x50000000: 0x808202,
          0x60000000: 0x800202,
          0x70000000: 0x800000,
          0x80000000: 0x202,
          0x90000000: 0x800200,
          0xa0000000: 0x8200,
          0xb0000000: 0x808000,
          0xc0000000: 0x8002,
          0xd0000000: 0x800002,
          0xe0000000: 0x0,
          0xf0000000: 0x8202,
          0x8000000: 0x0,
          0x18000000: 0x808202,
          0x28000000: 0x8202,
          0x38000000: 0x8000,
          0x48000000: 0x808200,
          0x58000000: 0x200,
          0x68000000: 0x808002,
          0x78000000: 0x2,
          0x88000000: 0x800200,
          0x98000000: 0x8200,
          0xa8000000: 0x808000,
          0xb8000000: 0x800202,
          0xc8000000: 0x800002,
          0xd8000000: 0x8002,
          0xe8000000: 0x202,
          0xf8000000: 0x800000,
          0x1: 0x8000,
          0x10000001: 0x2,
          0x20000001: 0x808200,
          0x30000001: 0x800000,
          0x40000001: 0x808002,
          0x50000001: 0x8200,
          0x60000001: 0x200,
          0x70000001: 0x800202,
          0x80000001: 0x808202,
          0x90000001: 0x808000,
          0xa0000001: 0x800002,
          0xb0000001: 0x8202,
          0xc0000001: 0x202,
          0xd0000001: 0x800200,
          0xe0000001: 0x8002,
          0xf0000001: 0x0,
          0x8000001: 0x808202,
          0x18000001: 0x808000,
          0x28000001: 0x800000,
          0x38000001: 0x200,
          0x48000001: 0x8000,
          0x58000001: 0x800002,
          0x68000001: 0x2,
          0x78000001: 0x8202,
          0x88000001: 0x8002,
          0x98000001: 0x800202,
          0xa8000001: 0x202,
          0xb8000001: 0x808200,
          0xc8000001: 0x800200,
          0xd8000001: 0x0,
          0xe8000001: 0x8200,
          0xf8000001: 0x808002
        },
        {
          0x0: 0x40084010,
          0x1000000: 0x4000,
          0x2000000: 0x80000,
          0x3000000: 0x40080010,
          0x4000000: 0x40000010,
          0x5000000: 0x40084000,
          0x6000000: 0x40004000,
          0x7000000: 0x10,
          0x8000000: 0x84000,
          0x9000000: 0x40004010,
          0xa000000: 0x40000000,
          0xb000000: 0x84010,
          0xc000000: 0x80010,
          0xd000000: 0x0,
          0xe000000: 0x4010,
          0xf000000: 0x40080000,
          0x800000: 0x40004000,
          0x1800000: 0x84010,
          0x2800000: 0x10,
          0x3800000: 0x40004010,
          0x4800000: 0x40084010,
          0x5800000: 0x40000000,
          0x6800000: 0x80000,
          0x7800000: 0x40080010,
          0x8800000: 0x80010,
          0x9800000: 0x0,
          0xa800000: 0x4000,
          0xb800000: 0x40080000,
          0xc800000: 0x40000010,
          0xd800000: 0x84000,
          0xe800000: 0x40084000,
          0xf800000: 0x4010,
          0x10000000: 0x0,
          0x11000000: 0x40080010,
          0x12000000: 0x40004010,
          0x13000000: 0x40084000,
          0x14000000: 0x40080000,
          0x15000000: 0x10,
          0x16000000: 0x84010,
          0x17000000: 0x4000,
          0x18000000: 0x4010,
          0x19000000: 0x80000,
          0x1a000000: 0x80010,
          0x1b000000: 0x40000010,
          0x1c000000: 0x84000,
          0x1d000000: 0x40004000,
          0x1e000000: 0x40000000,
          0x1f000000: 0x40084010,
          0x10800000: 0x84010,
          0x11800000: 0x80000,
          0x12800000: 0x40080000,
          0x13800000: 0x4000,
          0x14800000: 0x40004000,
          0x15800000: 0x40084010,
          0x16800000: 0x10,
          0x17800000: 0x40000000,
          0x18800000: 0x40084000,
          0x19800000: 0x40000010,
          0x1a800000: 0x40004010,
          0x1b800000: 0x80010,
          0x1c800000: 0x0,
          0x1d800000: 0x4010,
          0x1e800000: 0x40080010,
          0x1f800000: 0x84000
        },
        {
          0x0: 0x104,
          0x100000: 0x0,
          0x200000: 0x4000100,
          0x300000: 0x10104,
          0x400000: 0x10004,
          0x500000: 0x4000004,
          0x600000: 0x4010104,
          0x700000: 0x4010000,
          0x800000: 0x4000000,
          0x900000: 0x4010100,
          0xa00000: 0x10100,
          0xb00000: 0x4010004,
          0xc00000: 0x4000104,
          0xd00000: 0x10000,
          0xe00000: 0x4,
          0xf00000: 0x100,
          0x80000: 0x4010100,
          0x180000: 0x4010004,
          0x280000: 0x0,
          0x380000: 0x4000100,
          0x480000: 0x4000004,
          0x580000: 0x10000,
          0x680000: 0x10004,
          0x780000: 0x104,
          0x880000: 0x4,
          0x980000: 0x100,
          0xa80000: 0x4010000,
          0xb80000: 0x10104,
          0xc80000: 0x10100,
          0xd80000: 0x4000104,
          0xe80000: 0x4010104,
          0xf80000: 0x4000000,
          0x1000000: 0x4010100,
          0x1100000: 0x10004,
          0x1200000: 0x10000,
          0x1300000: 0x4000100,
          0x1400000: 0x100,
          0x1500000: 0x4010104,
          0x1600000: 0x4000004,
          0x1700000: 0x0,
          0x1800000: 0x4000104,
          0x1900000: 0x4000000,
          0x1a00000: 0x4,
          0x1b00000: 0x10100,
          0x1c00000: 0x4010000,
          0x1d00000: 0x104,
          0x1e00000: 0x10104,
          0x1f00000: 0x4010004,
          0x1080000: 0x4000000,
          0x1180000: 0x104,
          0x1280000: 0x4010100,
          0x1380000: 0x0,
          0x1480000: 0x10004,
          0x1580000: 0x4000100,
          0x1680000: 0x100,
          0x1780000: 0x4010004,
          0x1880000: 0x10000,
          0x1980000: 0x4010104,
          0x1a80000: 0x10104,
          0x1b80000: 0x4000004,
          0x1c80000: 0x4000104,
          0x1d80000: 0x4010000,
          0x1e80000: 0x4,
          0x1f80000: 0x10100
        },
        {
          0x0: 0x80401000,
          0x10000: 0x80001040,
          0x20000: 0x401040,
          0x30000: 0x80400000,
          0x40000: 0x0,
          0x50000: 0x401000,
          0x60000: 0x80000040,
          0x70000: 0x400040,
          0x80000: 0x80000000,
          0x90000: 0x400000,
          0xa0000: 0x40,
          0xb0000: 0x80001000,
          0xc0000: 0x80400040,
          0xd0000: 0x1040,
          0xe0000: 0x1000,
          0xf0000: 0x80401040,
          0x8000: 0x80001040,
          0x18000: 0x40,
          0x28000: 0x80400040,
          0x38000: 0x80001000,
          0x48000: 0x401000,
          0x58000: 0x80401040,
          0x68000: 0x0,
          0x78000: 0x80400000,
          0x88000: 0x1000,
          0x98000: 0x80401000,
          0xa8000: 0x400000,
          0xb8000: 0x1040,
          0xc8000: 0x80000000,
          0xd8000: 0x400040,
          0xe8000: 0x401040,
          0xf8000: 0x80000040,
          0x100000: 0x400040,
          0x110000: 0x401000,
          0x120000: 0x80000040,
          0x130000: 0x0,
          0x140000: 0x1040,
          0x150000: 0x80400040,
          0x160000: 0x80401000,
          0x170000: 0x80001040,
          0x180000: 0x80401040,
          0x190000: 0x80000000,
          0x1a0000: 0x80400000,
          0x1b0000: 0x401040,
          0x1c0000: 0x80001000,
          0x1d0000: 0x400000,
          0x1e0000: 0x40,
          0x1f0000: 0x1000,
          0x108000: 0x80400000,
          0x118000: 0x80401040,
          0x128000: 0x0,
          0x138000: 0x401000,
          0x148000: 0x400040,
          0x158000: 0x80000000,
          0x168000: 0x80001040,
          0x178000: 0x40,
          0x188000: 0x80000040,
          0x198000: 0x1000,
          0x1a8000: 0x80001000,
          0x1b8000: 0x80400040,
          0x1c8000: 0x1040,
          0x1d8000: 0x80401000,
          0x1e8000: 0x400000,
          0x1f8000: 0x401040
        },
        {
          0x0: 0x80,
          0x1000: 0x1040000,
          0x2000: 0x40000,
          0x3000: 0x20000000,
          0x4000: 0x20040080,
          0x5000: 0x1000080,
          0x6000: 0x21000080,
          0x7000: 0x40080,
          0x8000: 0x1000000,
          0x9000: 0x20040000,
          0xa000: 0x20000080,
          0xb000: 0x21040080,
          0xc000: 0x21040000,
          0xd000: 0x0,
          0xe000: 0x1040080,
          0xf000: 0x21000000,
          0x800: 0x1040080,
          0x1800: 0x21000080,
          0x2800: 0x80,
          0x3800: 0x1040000,
          0x4800: 0x40000,
          0x5800: 0x20040080,
          0x6800: 0x21040000,
          0x7800: 0x20000000,
          0x8800: 0x20040000,
          0x9800: 0x0,
          0xa800: 0x21040080,
          0xb800: 0x1000080,
          0xc800: 0x20000080,
          0xd800: 0x21000000,
          0xe800: 0x1000000,
          0xf800: 0x40080,
          0x10000: 0x40000,
          0x11000: 0x80,
          0x12000: 0x20000000,
          0x13000: 0x21000080,
          0x14000: 0x1000080,
          0x15000: 0x21040000,
          0x16000: 0x20040080,
          0x17000: 0x1000000,
          0x18000: 0x21040080,
          0x19000: 0x21000000,
          0x1a000: 0x1040000,
          0x1b000: 0x20040000,
          0x1c000: 0x40080,
          0x1d000: 0x20000080,
          0x1e000: 0x0,
          0x1f000: 0x1040080,
          0x10800: 0x21000080,
          0x11800: 0x1000000,
          0x12800: 0x1040000,
          0x13800: 0x20040080,
          0x14800: 0x20000000,
          0x15800: 0x1040080,
          0x16800: 0x80,
          0x17800: 0x21040000,
          0x18800: 0x40080,
          0x19800: 0x21040080,
          0x1a800: 0x0,
          0x1b800: 0x21000000,
          0x1c800: 0x1000080,
          0x1d800: 0x40000,
          0x1e800: 0x20040000,
          0x1f800: 0x20000080
        },
        {
          0x0: 0x10000008,
          0x100: 0x2000,
          0x200: 0x10200000,
          0x300: 0x10202008,
          0x400: 0x10002000,
          0x500: 0x200000,
          0x600: 0x200008,
          0x700: 0x10000000,
          0x800: 0x0,
          0x900: 0x10002008,
          0xa00: 0x202000,
          0xb00: 0x8,
          0xc00: 0x10200008,
          0xd00: 0x202008,
          0xe00: 0x2008,
          0xf00: 0x10202000,
          0x80: 0x10200000,
          0x180: 0x10202008,
          0x280: 0x8,
          0x380: 0x200000,
          0x480: 0x202008,
          0x580: 0x10000008,
          0x680: 0x10002000,
          0x780: 0x2008,
          0x880: 0x200008,
          0x980: 0x2000,
          0xa80: 0x10002008,
          0xb80: 0x10200008,
          0xc80: 0x0,
          0xd80: 0x10202000,
          0xe80: 0x202000,
          0xf80: 0x10000000,
          0x1000: 0x10002000,
          0x1100: 0x10200008,
          0x1200: 0x10202008,
          0x1300: 0x2008,
          0x1400: 0x200000,
          0x1500: 0x10000000,
          0x1600: 0x10000008,
          0x1700: 0x202000,
          0x1800: 0x202008,
          0x1900: 0x0,
          0x1a00: 0x8,
          0x1b00: 0x10200000,
          0x1c00: 0x2000,
          0x1d00: 0x10002008,
          0x1e00: 0x10202000,
          0x1f00: 0x200008,
          0x1080: 0x8,
          0x1180: 0x202000,
          0x1280: 0x200000,
          0x1380: 0x10000008,
          0x1480: 0x10002000,
          0x1580: 0x2008,
          0x1680: 0x10202008,
          0x1780: 0x10200000,
          0x1880: 0x10202000,
          0x1980: 0x10200008,
          0x1a80: 0x2000,
          0x1b80: 0x202008,
          0x1c80: 0x200008,
          0x1d80: 0x0,
          0x1e80: 0x10000000,
          0x1f80: 0x10002008
        },
        {
          0x0: 0x100000,
          0x10: 0x2000401,
          0x20: 0x400,
          0x30: 0x100401,
          0x40: 0x2100401,
          0x50: 0x0,
          0x60: 0x1,
          0x70: 0x2100001,
          0x80: 0x2000400,
          0x90: 0x100001,
          0xa0: 0x2000001,
          0xb0: 0x2100400,
          0xc0: 0x2100000,
          0xd0: 0x401,
          0xe0: 0x100400,
          0xf0: 0x2000000,
          0x8: 0x2100001,
          0x18: 0x0,
          0x28: 0x2000401,
          0x38: 0x2100400,
          0x48: 0x100000,
          0x58: 0x2000001,
          0x68: 0x2000000,
          0x78: 0x401,
          0x88: 0x100401,
          0x98: 0x2000400,
          0xa8: 0x2100000,
          0xb8: 0x100001,
          0xc8: 0x400,
          0xd8: 0x2100401,
          0xe8: 0x1,
          0xf8: 0x100400,
          0x100: 0x2000000,
          0x110: 0x100000,
          0x120: 0x2000401,
          0x130: 0x2100001,
          0x140: 0x100001,
          0x150: 0x2000400,
          0x160: 0x2100400,
          0x170: 0x100401,
          0x180: 0x401,
          0x190: 0x2100401,
          0x1a0: 0x100400,
          0x1b0: 0x1,
          0x1c0: 0x0,
          0x1d0: 0x2100000,
          0x1e0: 0x2000001,
          0x1f0: 0x400,
          0x108: 0x100400,
          0x118: 0x2000401,
          0x128: 0x2100001,
          0x138: 0x1,
          0x148: 0x2000000,
          0x158: 0x100000,
          0x168: 0x401,
          0x178: 0x2100400,
          0x188: 0x2000001,
          0x198: 0x2100000,
          0x1a8: 0x0,
          0x1b8: 0x2100401,
          0x1c8: 0x100401,
          0x1d8: 0x400,
          0x1e8: 0x2000400,
          0x1f8: 0x100001
        },
        {
          0x0: 0x8000820,
          0x1: 0x20000,
          0x2: 0x8000000,
          0x3: 0x20,
          0x4: 0x20020,
          0x5: 0x8020820,
          0x6: 0x8020800,
          0x7: 0x800,
          0x8: 0x8020000,
          0x9: 0x8000800,
          0xa: 0x20800,
          0xb: 0x8020020,
          0xc: 0x820,
          0xd: 0x0,
          0xe: 0x8000020,
          0xf: 0x20820,
          0x80000000: 0x800,
          0x80000001: 0x8020820,
          0x80000002: 0x8000820,
          0x80000003: 0x8000000,
          0x80000004: 0x8020000,
          0x80000005: 0x20800,
          0x80000006: 0x20820,
          0x80000007: 0x20,
          0x80000008: 0x8000020,
          0x80000009: 0x820,
          0x8000000a: 0x20020,
          0x8000000b: 0x8020800,
          0x8000000c: 0x0,
          0x8000000d: 0x8020020,
          0x8000000e: 0x8000800,
          0x8000000f: 0x20000,
          0x10: 0x20820,
          0x11: 0x8020800,
          0x12: 0x20,
          0x13: 0x800,
          0x14: 0x8000800,
          0x15: 0x8000020,
          0x16: 0x8020020,
          0x17: 0x20000,
          0x18: 0x0,
          0x19: 0x20020,
          0x1a: 0x8020000,
          0x1b: 0x8000820,
          0x1c: 0x8020820,
          0x1d: 0x20800,
          0x1e: 0x820,
          0x1f: 0x8000000,
          0x80000010: 0x20000,
          0x80000011: 0x800,
          0x80000012: 0x8020020,
          0x80000013: 0x20820,
          0x80000014: 0x20,
          0x80000015: 0x8020000,
          0x80000016: 0x8000000,
          0x80000017: 0x8000820,
          0x80000018: 0x8020820,
          0x80000019: 0x8000020,
          0x8000001a: 0x8000800,
          0x8000001b: 0x0,
          0x8000001c: 0x20800,
          0x8000001d: 0x820,
          0x8000001e: 0x20020,
          0x8000001f: 0x8020800
        }
      ];

      // Masks that select the SBOX input
      var SBOX_MASK = [
        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
      ];

      /**
       * DES block cipher algorithm.
       */
      var DES = C_algo.DES = BlockCipher.extend({
        _doReset: function () {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words;

          // Select 56 bits according to PC1
          var keyBits = [];
          for (var i = 0; i < 56; i++) {
            var keyBitPos = PC1[i] - 1;
            keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
          }

          // Assemble 16 subkeys
          var subKeys = this._subKeys = [];
          for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
            // Create subkey
            var subKey = subKeys[nSubKey] = [];

            // Shortcut
            var bitShift = BIT_SHIFTS[nSubKey];

            // Select 48 bits according to PC2
            for (var i = 0; i < 24; i++) {
              // Select from the left 28 key bits
              subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

              // Select from the right 28 key bits
              subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
            }

            // Since each subkey is applied to an expanded 32-bit input,
            // the subkey can be broken into 8 values scaled to 32-bits,
            // which allows the key to be used without expansion
            subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
            for (var i = 1; i < 7; i++) {
              subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
            }
            subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
          }

          // Compute inverse subkeys
          var invSubKeys = this._invSubKeys = [];
          for (var i = 0; i < 16; i++) {
            invSubKeys[i] = subKeys[15 - i];
          }
        },

        encryptBlock: function (M, offset) {
          this._doCryptBlock(M, offset, this._subKeys);
        },

        decryptBlock: function (M, offset) {
          this._doCryptBlock(M, offset, this._invSubKeys);
        },

        _doCryptBlock: function (M, offset, subKeys) {
          // Get input
          this._lBlock = M[offset];
          this._rBlock = M[offset + 1];

          // Initial permutation
          exchangeLR.call(this, 4, 0x0f0f0f0f);
          exchangeLR.call(this, 16, 0x0000ffff);
          exchangeRL.call(this, 2, 0x33333333);
          exchangeRL.call(this, 8, 0x00ff00ff);
          exchangeLR.call(this, 1, 0x55555555);

          // Rounds
          for (var round = 0; round < 16; round++) {
            // Shortcuts
            var subKey = subKeys[round];
            var lBlock = this._lBlock;
            var rBlock = this._rBlock;

            // Feistel function
            var f = 0;
            for (var i = 0; i < 8; i++) {
              f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
            }
            this._lBlock = rBlock;
            this._rBlock = lBlock ^ f;
          }

          // Undo swap from last round
          var t = this._lBlock;
          this._lBlock = this._rBlock;
          this._rBlock = t;

          // Final permutation
          exchangeLR.call(this, 1, 0x55555555);
          exchangeRL.call(this, 8, 0x00ff00ff);
          exchangeRL.call(this, 2, 0x33333333);
          exchangeLR.call(this, 16, 0x0000ffff);
          exchangeLR.call(this, 4, 0x0f0f0f0f);

          // Set output
          M[offset] = this._lBlock;
          M[offset + 1] = this._rBlock;
        },

        keySize: 64 / 32,

        ivSize: 64 / 32,

        blockSize: 64 / 32
      });

      // Swap bits across the left and right words
      function exchangeLR(offset, mask) {
        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
        this._rBlock ^= t;
        this._lBlock ^= t << offset;
      }

      function exchangeRL(offset, mask) {
        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
        this._lBlock ^= t;
        this._rBlock ^= t << offset;
      }

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
       */
      C.DES = BlockCipher._createHelper(DES);

      /**
       * Triple-DES block cipher algorithm.
       */
      var TripleDES = C_algo.TripleDES = BlockCipher.extend({
        _doReset: function () {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words;
          // Make sure the key length is valid (64, 128 or >= 192 bit)
          if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
            throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
          }

          // Extend the key according to the keying options defined in 3DES standard
          var key1 = keyWords.slice(0, 2);
          var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
          var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

          // Create DES instances
          this._des1 = DES.createEncryptor(WordArray.create(key1));
          this._des2 = DES.createEncryptor(WordArray.create(key2));
          this._des3 = DES.createEncryptor(WordArray.create(key3));
        },

        encryptBlock: function (M, offset) {
          this._des1.encryptBlock(M, offset);
          this._des2.decryptBlock(M, offset);
          this._des3.encryptBlock(M, offset);
        },

        decryptBlock: function (M, offset) {
          this._des3.decryptBlock(M, offset);
          this._des2.encryptBlock(M, offset);
          this._des1.decryptBlock(M, offset);
        },

        keySize: 192 / 32,

        ivSize: 64 / 32,

        blockSize: 64 / 32
      });

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
       */
      C.TripleDES = BlockCipher._createHelper(TripleDES);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo;

      /**
       * RC4 stream cipher algorithm.
       */
      var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function () {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words;
          var keySigBytes = key.sigBytes;

          // Init sbox
          var S = this._S = [];
          for (var i = 0; i < 256; i++) {
            S[i] = i;
          }

          // Key setup
          for (var i = 0, j = 0; i < 256; i++) {
            var keyByteIndex = i % keySigBytes;
            var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

            j = (j + S[i] + keyByte) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;
          }

          // Counters
          this._i = this._j = 0;
        },

        _doProcessBlock: function (M, offset) {
          M[offset] ^= generateKeystreamWord.call(this);
        },

        keySize: 256 / 32,

        ivSize: 0
      });

      function generateKeystreamWord() {
        // Shortcuts
        var S = this._S;
        var i = this._i;
        var j = this._j;

        // Generate keystream word
        var keystreamWord = 0;
        for (var n = 0; n < 4; n++) {
          i = (i + 1) % 256;
          j = (j + S[i]) % 256;

          // Swap
          var t = S[i];
          S[i] = S[j];
          S[j] = t;

          keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
        }

        // Update counters
        this._i = i;
        this._j = j;

        return keystreamWord;
      }

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
       */
      C.RC4 = StreamCipher._createHelper(RC4);

      /**
       * Modified RC4 stream cipher algorithm.
       */
      var RC4Drop = C_algo.RC4Drop = RC4.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        cfg: RC4.cfg.extend({
          drop: 192
        }),

        _doReset: function () {
          RC4._doReset.call(this);

          // Drop
          for (var i = this.cfg.drop; i > 0; i--) {
            generateKeystreamWord.call(this);
          }
        }
      });

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
       */
      C.RC4Drop = StreamCipher._createHelper(RC4Drop);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo;

      // Reusable objects
      var S = [];
      var C_ = [];
      var G = [];

      /**
       * Rabbit stream cipher algorithm
       */
      var Rabbit = C_algo.Rabbit = StreamCipher.extend({
        _doReset: function () {
          // Shortcuts
          var K = this._key.words;
          var iv = this.cfg.iv;

          // Swap endian
          for (var i = 0; i < 4; i++) {
            K[i] = (((K[i] << 8) | (K[i] >>> 24)) & 0x00ff00ff) |
              (((K[i] << 24) | (K[i] >>> 8)) & 0xff00ff00);
          }

          // Generate initial state values
          var X = this._X = [
            K[0], (K[3] << 16) | (K[2] >>> 16),
            K[1], (K[0] << 16) | (K[3] >>> 16),
            K[2], (K[1] << 16) | (K[0] >>> 16),
            K[3], (K[2] << 16) | (K[1] >>> 16)
          ];

          // Generate initial counter values
          var C = this._C = [
            (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
            (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
            (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
            (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
          ];

          // Carry bit
          this._b = 0;

          // Iterate the system four times
          for (var i = 0; i < 4; i++) {
            nextState.call(this);
          }

          // Modify the counters
          for (var i = 0; i < 8; i++) {
            C[i] ^= X[(i + 4) & 7];
          }

          // IV setup
          if (iv) {
            // Shortcuts
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1];

            // Generate four subvectors
            var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
            var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
            var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
            var i3 = (i2 << 16) | (i0 & 0x0000ffff);

            // Modify counter values
            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
          }
        },

        _doProcessBlock: function (M, offset) {
          // Shortcut
          var X = this._X;

          // Iterate the system
          nextState.call(this);

          // Generate four keystream words
          S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
          S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
          S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
          S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

          for (var i = 0; i < 4; i++) {
            // Swap endian
            S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
              (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

            // Encrypt
            M[offset + i] ^= S[i];
          }
        },

        blockSize: 128 / 32,

        ivSize: 64 / 32
      });

      function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C;

        // Save old counter values
        for (var i = 0; i < 8; i++) {
          C_[i] = C[i];
        }

        // Calculate new counter values
        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

        // Calculate the g-values
        for (var i = 0; i < 8; i++) {
          var gx = X[i] + C[i];

          // Construct high and low argument for squaring
          var ga = gx & 0xffff;
          var gb = gx >>> 16;

          // Calculate high and low result of squaring
          var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
          var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

          // High XOR low
          G[i] = gh ^ gl;
        }

        // Calculate new state values
        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
        X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
        X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
        X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
        X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
      }

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
       */
      C.Rabbit = StreamCipher._createHelper(Rabbit);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo;

      // Reusable objects
      var S = [];
      var C_ = [];
      var G = [];

      /**
       * Rabbit stream cipher algorithm.
       *
       * This is a legacy version that neglected to convert the key to little-endian.
       * This error doesn't affect the cipher's security,
       * but it does affect its compatibility with other implementations.
       */
      var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
        _doReset: function () {
          // Shortcuts
          var K = this._key.words;
          var iv = this.cfg.iv;

          // Generate initial state values
          var X = this._X = [
            K[0], (K[3] << 16) | (K[2] >>> 16),
            K[1], (K[0] << 16) | (K[3] >>> 16),
            K[2], (K[1] << 16) | (K[0] >>> 16),
            K[3], (K[2] << 16) | (K[1] >>> 16)
          ];

          // Generate initial counter values
          var C = this._C = [
            (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
            (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
            (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
            (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
          ];

          // Carry bit
          this._b = 0;

          // Iterate the system four times
          for (var i = 0; i < 4; i++) {
            nextState.call(this);
          }

          // Modify the counters
          for (var i = 0; i < 8; i++) {
            C[i] ^= X[(i + 4) & 7];
          }

          // IV setup
          if (iv) {
            // Shortcuts
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1];

            // Generate four subvectors
            var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
            var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
            var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
            var i3 = (i2 << 16) | (i0 & 0x0000ffff);

            // Modify counter values
            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
          }
        },

        _doProcessBlock: function (M, offset) {
          // Shortcut
          var X = this._X;

          // Iterate the system
          nextState.call(this);

          // Generate four keystream words
          S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
          S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
          S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
          S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

          for (var i = 0; i < 4; i++) {
            // Swap endian
            S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
              (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

            // Encrypt
            M[offset + i] ^= S[i];
          }
        },

        blockSize: 128 / 32,

        ivSize: 64 / 32
      });

      function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C;

        // Save old counter values
        for (var i = 0; i < 8; i++) {
          C_[i] = C[i];
        }

        // Calculate new counter values
        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

        // Calculate the g-values
        for (var i = 0; i < 8; i++) {
          var gx = X[i] + C[i];

          // Construct high and low argument for squaring
          var ga = gx & 0xffff;
          var gb = gx >>> 16;

          // Calculate high and low result of squaring
          var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
          var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

          // High XOR low
          G[i] = gh ^ gl;
        }

        // Calculate new state values
        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
        X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
        X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
        X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
        X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
      }

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
       */
      C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
    }());


    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C.algo;

      const N = 16;

      //Origin pbox and sbox, derived from PI
      const ORIG_P = [
        0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
        0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
        0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
        0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917,
        0x9216D5D9, 0x8979FB1B
      ];

      const ORIG_S = [
        [0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
          0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
          0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16,
          0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E,
          0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE,
          0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013,
          0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF,
          0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E,
          0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60,
          0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440,
          0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE,
          0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A,
          0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E,
          0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677,
          0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193,
          0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032,
          0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88,
          0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239,
          0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E,
          0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0,
          0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3,
          0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98,
          0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88,
          0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE,
          0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6,
          0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D,
          0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B,
          0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7,
          0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA,
          0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463,
          0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F,
          0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09,
          0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3,
          0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB,
          0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279,
          0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8,
          0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB,
          0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82,
          0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB,
          0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573,
          0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0,
          0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B,
          0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790,
          0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8,
          0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4,
          0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0,
          0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7,
          0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C,
          0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD,
          0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1,
          0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299,
          0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9,
          0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477,
          0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF,
          0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49,
          0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF,
          0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA,
          0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5,
          0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41,
          0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915,
          0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400,
          0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915,
          0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664,
          0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A],
        [0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623,
          0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266,
          0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1,
          0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E,
          0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6,
          0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1,
          0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E,
          0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1,
          0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737,
          0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8,
          0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF,
          0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD,
          0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701,
          0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7,
          0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41,
          0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331,
          0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF,
          0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF,
          0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E,
          0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87,
          0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C,
          0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2,
          0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16,
          0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD,
          0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B,
          0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509,
          0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E,
          0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3,
          0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F,
          0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A,
          0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4,
          0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960,
          0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66,
          0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28,
          0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802,
          0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84,
          0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510,
          0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF,
          0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14,
          0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E,
          0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50,
          0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7,
          0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8,
          0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281,
          0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99,
          0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696,
          0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128,
          0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73,
          0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0,
          0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0,
          0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105,
          0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250,
          0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3,
          0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285,
          0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00,
          0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061,
          0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB,
          0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E,
          0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735,
          0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC,
          0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9,
          0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340,
          0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20,
          0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7],
        [0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934,
          0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068,
          0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF,
          0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840,
          0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45,
          0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504,
          0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A,
          0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB,
          0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE,
          0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6,
          0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42,
          0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B,
          0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2,
          0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB,
          0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527,
          0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B,
          0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33,
          0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C,
          0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3,
          0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC,
          0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17,
          0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564,
          0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B,
          0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115,
          0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922,
          0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728,
          0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0,
          0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E,
          0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37,
          0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D,
          0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804,
          0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B,
          0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3,
          0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB,
          0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D,
          0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C,
          0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350,
          0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9,
          0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A,
          0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE,
          0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D,
          0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC,
          0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F,
          0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61,
          0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2,
          0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9,
          0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2,
          0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C,
          0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E,
          0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633,
          0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10,
          0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169,
          0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52,
          0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027,
          0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5,
          0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62,
          0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634,
          0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76,
          0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24,
          0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC,
          0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4,
          0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C,
          0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837,
          0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0],
        [0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B,
          0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE,
          0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B,
          0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4,
          0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8,
          0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6,
          0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304,
          0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22,
          0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4,
          0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6,
          0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9,
          0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59,
          0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593,
          0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51,
          0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28,
          0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C,
          0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B,
          0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28,
          0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C,
          0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD,
          0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A,
          0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319,
          0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB,
          0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F,
          0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991,
          0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32,
          0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680,
          0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166,
          0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE,
          0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB,
          0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5,
          0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47,
          0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370,
          0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D,
          0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84,
          0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048,
          0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8,
          0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD,
          0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9,
          0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7,
          0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38,
          0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F,
          0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C,
          0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525,
          0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1,
          0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442,
          0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964,
          0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E,
          0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8,
          0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D,
          0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F,
          0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299,
          0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02,
          0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC,
          0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614,
          0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A,
          0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6,
          0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B,
          0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0,
          0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060,
          0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E,
          0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9,
          0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F,
          0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6]
      ];

      var BLOWFISH_CTX = {
        pbox: [],
        sbox: []
      };

      function F(ctx, x) {
        let a = (x >> 24) & 0xFF;
        let b = (x >> 16) & 0xFF;
        let c = (x >> 8) & 0xFF;
        let d = x & 0xFF;

        let y = ctx.sbox[0][a] + ctx.sbox[1][b];
        y = y ^ ctx.sbox[2][c];
        y = y + ctx.sbox[3][d];

        return y;
      }

      function BlowFish_Encrypt(ctx, left, right) {
        let Xl = left;
        let Xr = right;
        let temp;

        for (let i = 0; i < N; ++i) {
          Xl = Xl ^ ctx.pbox[i];
          Xr = F(ctx, Xl) ^ Xr;

          temp = Xl;
          Xl = Xr;
          Xr = temp;
        }

        temp = Xl;
        Xl = Xr;
        Xr = temp;

        Xr = Xr ^ ctx.pbox[N];
        Xl = Xl ^ ctx.pbox[N + 1];

        return { left: Xl, right: Xr };
      }

      function BlowFish_Decrypt(ctx, left, right) {
        let Xl = left;
        let Xr = right;
        let temp;

        for (let i = N + 1; i > 1; --i) {
          Xl = Xl ^ ctx.pbox[i];
          Xr = F(ctx, Xl) ^ Xr;

          temp = Xl;
          Xl = Xr;
          Xr = temp;
        }

        temp = Xl;
        Xl = Xr;
        Xr = temp;

        Xr = Xr ^ ctx.pbox[1];
        Xl = Xl ^ ctx.pbox[0];

        return { left: Xl, right: Xr };
      }

      /**
       * Initialization ctx's pbox and sbox.
       *
       * @param {Object} ctx The object has pbox and sbox.
       * @param {Array} key An array of 32-bit words.
       * @param {int} keysize The length of the key.
       *
       * @example
       *
       *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
       */
      function BlowFishInit(ctx, key, keysize) {
        for (let Row = 0; Row < 4; Row++) {
          ctx.sbox[Row] = [];
          for (let Col = 0; Col < 256; Col++) {
            ctx.sbox[Row][Col] = ORIG_S[Row][Col];
          }
        }

        let keyIndex = 0;
        for (let index = 0; index < N + 2; index++) {
          ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
          keyIndex++;
          if (keyIndex >= keysize) {
            keyIndex = 0;
          }
        }

        let Data1 = 0;
        let Data2 = 0;
        let res = 0;
        for (let i = 0; i < N + 2; i += 2) {
          res = BlowFish_Encrypt(ctx, Data1, Data2);
          Data1 = res.left;
          Data2 = res.right;
          ctx.pbox[i] = Data1;
          ctx.pbox[i + 1] = Data2;
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 256; j += 2) {
            res = BlowFish_Encrypt(ctx, Data1, Data2);
            Data1 = res.left;
            Data2 = res.right;
            ctx.sbox[i][j] = Data1;
            ctx.sbox[i][j + 1] = Data2;
          }
        }

        return true;
      }

      /**
       * Blowfish block cipher algorithm.
       */
      var Blowfish = C_algo.Blowfish = BlockCipher.extend({
        _doReset: function () {
          // Skip reset of nRounds has been set before and key did not change
          if (this._keyPriorReset === this._key) {
            return;
          }

          // Shortcuts
          var key = this._keyPriorReset = this._key;
          var keyWords = key.words;
          var keySize = key.sigBytes / 4;

          //Initialization pbox and sbox
          BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
        },

        encryptBlock: function (M, offset) {
          var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
          M[offset] = res.left;
          M[offset + 1] = res.right;
        },

        decryptBlock: function (M, offset) {
          var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
          M[offset] = res.left;
          M[offset + 1] = res.right;
        },

        blockSize: 64 / 32,

        keySize: 128 / 32,

        ivSize: 64 / 32
      });

      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
       */
      C.Blowfish = BlockCipher._createHelper(Blowfish);
    }());


    return CryptoJS;

  }

  try {
    if (my) {
      my.crypto = crypto();
    }
  }catch (e){}

  try {
    if (wx) {
      wx.crypto = crypto();
    }
  }catch (e){}

  try {
    if (swan) {
      swan.crypto = crypto();
    }
  }catch (e){}

  try {
    if (ks) {
      ks.crypto = crypto();
    }
  }catch (e){}

  try {
    if (bl) {
      bl.crypto = crypto();
    }
  }catch (e){}

  try {
    if (jd) {
      jd.crypto = crypto();
    }
  }catch (e){}

  try {
    if (tt) {
      tt.crypto = crypto();
    }
  }catch (e){}

  try {
    if (gamebox) {
      gamebox.crypto = crypto();
    }
  }catch (e){}

  try {
    if (qg) {
      qg.crypto = crypto();
    }
  }catch (e){}

  try {
    if (window) {
      window.msCrypto = crypto();
    }
  }catch (e){}

  var cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
  function crypto$1() {
      // @ts-ignore
      return cryptoJS();
  }
  /**
   * AES-CBC 加密字符串
   * @param {string} data 需要加密的字符串
   * @param {string} key 加密密钥
   * @param {string} iv 初始化向量
   * @returns {string} 加密后的 Base64 编码字符串
   */
  function AesEncryptBase64String(data, key, iv) {
      var CryptoJS = crypto$1();
      // 将密钥和初始化向量转换为 WordArray
      var keyWordArray = CryptoJS.enc.Utf8.parse(key);
      var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
      // 使用 AES-CBC 加密
      var encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
          iv: ivWordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      // 返回 Base64 编码的加密结果
      return encrypted.toString();
  }
  /**
   * AES-CBC 解密字符串
   * @param {string} encryptedData 加密后的 Base64 编码字符串
   * @param {string} key 加密密钥
   * @param {string} iv 初始化向量
   * @returns {string} 解密后的原始字符串
   */
  function AesDecryptBase64String(encryptedData, key, iv) {
      var CryptoJS = crypto$1();
      // 将密钥和初始化向量转换为 WordArray
      var keyWordArray = CryptoJS.enc.Utf8.parse(key);
      var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
      // 使用 AES-CBC 解密
      var decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
          iv: ivWordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      // 将解密结果转换为 UTF-8 字符串
      return decrypted.toString(CryptoJS.enc.Utf8);
  }
  /**
   * 生成 MD5 加密字符串
   * @param {string} message - 需要加密的字符串
   * @returns {string} - 加密后的 MD5 字符串
   */
  function generateMD5(message) {
      var CryptoJS = crypto$1();
      if (CryptoJS)
          return CryptoJS.MD5(message).toString();
      return '';
  }
  /**
   * 获取系统设备信息(同步)
   * */
  var getUCSystemInfoSync = function () {
      var uc = window.uc || null;
      if (!uc)
          return {};
      try {
          var data = uc.getSystemInfoSync();
          return JSON.parse(data);
      }
      catch (err) {
      }
      return {};
  };
  function getQueryParams() {
      var url = window.location.href;
      var index = url.indexOf('?');
      if (index === -1)
          return {};
      var queryString = url.substring(index + 1);
      var params = {};
      var pairs = queryString.split('&');
      for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
          var pair = pairs_1[_i];
          var _a = pair.split('='), key = _a[0], value = _a[1];
          params[key] = decodeURIComponent(value || '');
      }
      return params;
  }
  function getSearchQueries(ifStringify) {
      var query = {};
      switch ("h5_ruixueh5") {
          case 'h5_uc':
              try {
                  var launchOptions = uc.getLaunchOptionsSync();
                  if (typeof launchOptions === 'string') {
                      launchOptions = JSON.parse(launchOptions);
                      query = launchOptions.query ? qs.parse(launchOptions.query) : {};
                      query = __assign(__assign({}, query), { entry: launchOptions.entry, state: launchOptions.state });
                  }
              }
              catch (e) {
                  query = __assign(__assign({}, query), { entry: 'unkown' });
              }
              break;
          case 'h5_huawei':
              query = {};
              break;
          default:
              query = getQueryParams();
      }
      return ifStringify ? qs.stringify(query) : query;
  }
  var customGetStorageSync = function (key) {
      var str = localStorage.getItem(key);
      try {
          return JSON.parse(str);
      }
      catch (e) {
          return str;
      }
  };
  var customSetStorageSync = function (key, value) {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  };
  var removeStorageSync = function (key) {
      localStorage.removeItem(key);
  };
  var getDevicecode = function () {
      var devicecode = customGetStorageSync('rx_devicecode');
      if (devicecode) {
          return devicecode.code;
      }
      else {
          var code = v4_1();
          customSetStorageSync('rx_devicecode', { code: code });
          return code;
      }
  };
  function validateNumber(num) {
      var numStr = num.toString();
      var isSixDigits = /^\d{6}$/.test(numStr);
      if (!isSixDigits) {
          return false;
      }
      var thirdDigit = parseInt(numStr[2]);
      var fourthDigit = parseInt(numStr[3]);
      return "".concat(thirdDigit).concat(fourthDigit) === '20';
  }
  var handleTrackError = function (platform, error_action, error, code) {
      if (error_action === void 0) { error_action = ''; }
      var handle_error = handleError(error, code);
      if (validateNumber(handle_error.code) || !handle_error.isServerError) {
          trackApi([
              {
                  event: '#rx_error',
                  type: 'track',
                  time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                  uuid: v4_1(),
                  sub_channel_id: USER_INFO.subchannelid,
                  distinct_id: USER_INFO.openid,
                  platform_id: 4,
                  product_id: SYSTEM_INFO$1.productId,
                  cpid: Number(SYSTEM_INFO$1.cpid),
                  channel_id: SYSTEM_INFO$1.channelId,
                  devicecode: getDevicecode(),
                  properties: {
                      error_action: error_action,
                      error_type: 'sdk',
                      trace_id: v4_1(),
                      rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                      type_tripartite: platform,
                      request_address: handle_error.url || '',
                      request_header: handle_error.request_header || '',
                      request_body: handle_error.request_body || '',
                      error_code: handle_error.code,
                      error_message: handle_error.msg || '',
                      error_code_tripartite: handle_error.thirdcode || '',
                      error_message_tripartite: handle_error.thirdmsg || '',
                      cp_userid: USER_INFO.cp_user_id,
                      error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
                  }
              }
          ]).catch(function (e) {
              console.log(e);
          });
      }
      return {
          code: handle_error.code,
          msg: handle_error.msg,
          thirdcode: handle_error.thirdcode,
          thirdmsg: handle_error.thirdmsg,
      };
  };
  function checkNeedAesEncrypt(url) {
      if (!crypto$1()) {
          return false;
      }
      if (!SYSTEM_INFO$1.CP_OF) {
          return false;
      }
      return !url.includes('/v1/sdkconfig/init');
  }
  function removeKeyFromObject(obj) {
      return Object.fromEntries(Object.entries(obj).filter(function (_a) {
          var key = _a[0];
          return key !== 'ruixue-encipher';
      }));
  }
  function isJsonString(str) {
      try {
          var parsed = JSON.parse(str);
          return true;
      }
      catch (e) {
          return false;
      }
  }
  function aesEncryptBase64String(data, key) {
      return AesEncryptBase64String(JSON.stringify(data), key, key.slice(0, 16));
  }
  function aesDecryptBase64String(data, key) {
      return AesDecryptBase64String(data, key, key.slice(0, 16));
  }
  function trackEncrypt(options, platform, key) {
      trackApi([
          {
              event: '#rx_error',
              type: 'track',
              time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              uuid: v4_1(),
              sub_channel_id: USER_INFO.subchannelid,
              distinct_id: USER_INFO.openid,
              platform_id: 4,
              product_id: SYSTEM_INFO$1.productId,
              cpid: Number(SYSTEM_INFO$1.cpid),
              channel_id: SYSTEM_INFO$1.channelId,
              devicecode: getDevicecode(),
              properties: {
                  error_action: 'encrypt',
                  error_type: 'sdk',
                  trace_id: v4_1(),
                  rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                  type_tripartite: platform,
                  request_address: options.url || '',
                  request_header: options.header || '',
                  request_body: options.data || '',
                  key: key
              }
          }
      ]).catch(function (e) {
          console.log(e);
      });
  }
  function trackDecrypt(options, res, platform, key) {
      if (options.url.includes('/v1/data/api/track')) {
          return;
      }
      trackApi([
          {
              event: '#rx_error',
              type: 'track',
              time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              uuid: v4_1(),
              sub_channel_id: USER_INFO.subchannelid,
              distinct_id: USER_INFO.openid,
              platform_id: 4,
              product_id: SYSTEM_INFO$1.productId,
              cpid: Number(SYSTEM_INFO$1.cpid),
              channel_id: SYSTEM_INFO$1.channelId,
              devicecode: getDevicecode(),
              properties: {
                  error_action: 'decrypt',
                  error_type: 'sdk',
                  trace_id: v4_1(),
                  rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                  type_tripartite: platform,
                  request_address: options.url || '',
                  request_header: options.header || '',
                  request_body: options.data || '',
                  request_response: res === null || res === void 0 ? void 0 : res.data,
                  key: key
              }
          }
      ]).catch(function (e) {
          console.log(e);
      });
  }

  var getSystemInfo = function () {
      switch ("h5_ruixueh5") {
          case 'h5_uc':
              return getUCSystemInfoSync();
          default:
              return {};
      }
  };
  var systemInfo = getSystemInfo();
  var getPlatformId = function () {
      var map = { android: 1, ios: 2, windows: 3, mac: 4 };
      return map[systemInfo.platform] || 0;
  };
  var SYSTEM_INFO = Object.assign(getSystemInfo, {
      fromChannel: 'minigame',
      platformid: getPlatformId()
  });

  var sendCaptchaParamsCheck = {
      email: {
          type: 'email',
      },
      phone: {
          asyncValidator: function (rule, value) {
              return new Promise(function (resolve, reject) {
                  if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
                      resolve();
                  }
                  else {
                      reject('phone params is not invalid');
                  }
              });
          },
      },
      purpose: {
          type: 'enum',
          enum: [
              'register',
              'bindphone',
              'unbindphone',
              'resetpwd',
              'bindemail',
              'unbindemail',
              'login',
              'setpwd',
          ],
      },
  };
  var bindPhoneParamsCheck = {
      phone: {
          type: 'string',
          required: true,
      },
      captcha_code: {
          type: 'string',
          required: true,
      },
      // password: {
      //   type: 'string',
      //   required: true,
      // },
  };
  var unBindPhoneParamsCheck = {
      phone: {
          type: 'string',
          required: true,
      },
      captcha_code: {
          type: 'string',
          required: true,
      },
  };
  var bindEmailParamsCheck = {
      email: {
          type: 'string',
          required: true,
      },
      captcha_code: {
          type: 'string',
          required: true,
      },
      password: {
          type: 'string',
          required: true,
      },
  };
  var unbindemailParamsCheck = {
      email: {
          type: 'string',
          required: true,
      },
      captcha_code: {
          type: 'string',
          required: true,
      },
  };

  var formatRegExp = /%[sdj%]/g;
  function format(template) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      var i = 0;
      if (typeof template === 'function') {
          return template.apply(null, args);
      }
      if (typeof template === 'string') {
          var str = template.replace(formatRegExp, function (x) {
              switch (x) {
                  case '%s':
                      return String(args[i++]);
                  default:
                      return x;
              }
          });
          return str;
      }
      return template;
  }
  var AsyncValidationError = /** @class */ (function (_super) {
      __extends(AsyncValidationError, _super);
      // fields: Record<string, ValidateError[]>
      function AsyncValidationError(errors) {
          var _this = _super.call(this, 'Async Validation Error') || this;
          _this.errors = errors;
          return _this;
          // this.fields = fields
      }
      return AsyncValidationError;
  }(Error));
  function isNativeStringType(type) {
      return type === 'string' || type === 'email';
  }
  function isEmptyValue(val, type) {
      if (val == null) {
          return true;
      }
      if (type === 'array' && Array.isArray(val) && !val.length) {
          return true;
      }
      if (type && isNativeStringType(type) && typeof val === 'string' && !val) {
          return true;
      }
      return false;
  }

  function newMessages() {
      return {
          required: '%s is required',
          enum: '%s must be one of %s',
          types: {
              string: '%s is not a %s',
              method: '%s is not a %s (function)',
              array: '%s is not an %s',
              object: '%s is not an %s',
              number: '%s is not a %s',
              date: '%s is not a %s',
              boolean: '%s is not a %s',
              integer: '%s is not an %s',
              float: '%s is not a %s',
              regexp: '%s is not a valid %s',
              email: '%s is not a valid %s',
              url: '%s is not a valid %s',
              hex: '%s is not a valid %s',
          },
          string: {
              len: '%s must be exactly %s characters',
              min: '%s must be at least %s characters',
              max: '%s cannot be longer than %s characters',
              range: '%s must be between %s and %s characters',
          },
      };
  }
  var messages = newMessages();

  var required$1 = function (rule, value, source, errors, type) {
      if (rule.required &&
          (!source.hasOwnProperty(rule === null || rule === void 0 ? void 0 : rule.field) ||
              isEmptyValue(value, type || rule.type))) {
          errors.push(format(messages.required, rule === null || rule === void 0 ? void 0 : rule.field));
      }
  };

  var ENUM$1 = 'enum';
  var enumerable$1 = function (rule, value, source, errors) {
      var _a, _b;
      rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
      if (((_a = rule[ENUM$1]) === null || _a === void 0 ? void 0 : _a.indexOf(value)) === -1) {
          errors.push(format(messages[ENUM$1], rule === null || rule === void 0 ? void 0 : rule.field, (_b = rule[ENUM$1]) === null || _b === void 0 ? void 0 : _b.join(', ')));
      }
  };

  var pattern = {
      // http://emailregex.com/
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  };
  var types = {
      array: function (value) {
          return Array.isArray(value);
      },
      number: function (value) {
          if (isNaN(value)) {
              return false;
          }
          return typeof value === 'number';
      },
      object: function (value) {
          return typeof value === 'object' && !types.array(value);
      },
      method: function (value) {
          return typeof value === 'function';
      },
      email: function (value) {
          return (typeof value === 'string' &&
              value.length <= 320 &&
              !!value.match(pattern.email));
      },
  };
  var type$1 = function (rule, value, source, errors) {
      if (rule.required && value === undefined) {
          required$1(rule, value, source, errors);
          return;
      }
      var custom = [
          'array',
          'object',
          'method',
          'email',
          'number',
      ];
      var ruleType = rule.type;
      if (custom.indexOf(ruleType) > -1) {
          if (!types[ruleType](value)) {
              errors.push(format(messages.types[ruleType], rule.field, rule.type));
          }
          // straight typeof check
      }
      else if (ruleType && typeof value !== rule.type) {
          errors.push(format(messages.types[ruleType], rule.field, rule.type));
      }
  };

  var rules = {
      required: required$1,
      type: type$1,
      enum: enumerable$1,
  };

  var string = function (rule, value, source) {
      // console.log('string rule: ', rule)
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          // 值为空字符串 并且 不是必填 直接返回
          if (isEmptyValue(value, 'string') && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors, 'string');
          // 不是必填，但是值不为空，校验类型
          if (!isEmptyValue(value, 'string')) {
              rules.type(rule, value, source, errors);
          }
      }
      return errors;
  };

  var number = function (rule, value, source) {
      // console.log('number rule: ', rule)
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          if (value === '') {
              value = undefined;
          }
          // 值为空 并且 不是必填 直接返回
          if (isEmptyValue(value) && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors);
          // 不是必填，但是值不为空，校验类型
          if (value !== undefined) {
              rules.type(rule, value, source, errors);
          }
      }
      return errors;
  };

  var boolean = function (rule, value, source) {
      // console.log('boolean rule: ', rule)
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          // 值为空 并且 不是必填 直接返回
          if (isEmptyValue(value) && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors);
          // 不是必填，但是值不为空，校验类型
          if (value !== undefined) {
              rules.type(rule, value, source, errors);
          }
      }
      return errors;
  };

  var array = function (rule, value, source) {
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          // 值为null/undefined 并且 不是必填 直接返回
          if ((value === undefined || value === null) && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors, 'array');
          // 不是必填，但是值不为空，校验类型
          if (value !== undefined && value !== null) {
              rules.type(rule, value, source, errors);
          }
      }
      // console.log('string: ', errors)
      return errors;
  };

  var object = function (rule, value, source) {
      // console.log('object rule: ', isEmptyValue(value))
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          // 值为空 并且 不是必填 直接返回
          if (isEmptyValue(value) && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors);
          // 不是必填，但是值不为空，校验类型
          if (value !== undefined) {
              rules.type(rule, value, source, errors);
          }
      }
      return errors;
  };

  var ENUM = 'enum';
  var enumerable = function (rule, value, source) {
      // console.log('enum rule: ', rule)
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          // 值为空 并且 不是必填 直接返回
          if (isEmptyValue(value) && !rule.required) {
              return true;
          }
          // 是必填 检验required
          rules.required(rule, value, source, errors);
          // 不是必填，但是值不为空，校验类型
          if (value !== undefined) {
              rules[ENUM](rule, value, source, errors);
          }
      }
      return errors;
  };

  var type = function (rule, value, source) {
      var ruleType = rule.type;
      var errors = [];
      var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
      if (validate) {
          if (isEmptyValue(value, ruleType) && !rule.required) {
              return true;
          }
          rules.required(rule, value, source, errors, ruleType);
          if (!isEmptyValue(value, ruleType)) {
              rules.type(rule, value, source, errors);
          }
      }
      return errors;
  };

  var required = function (rule, value, source) {
      var errors = [];
      var type = Array.isArray(value) ? 'array' : typeof value;
      rules.required(rule, value, source, errors, type);
      return errors;
  };

  var validators = {
      string: string,
      number: number,
      boolean: boolean,
      array: array,
      object: object,
      enum: enumerable,
      email: type,
      required: required,
  };

  var Schema = /** @class */ (function () {
      function Schema(descriptor) {
          this.rules = {};
          this.define(descriptor);
      }
      Schema.prototype.define = function (rules) {
          if (!rules) {
              throw new Error('Cannot configure a schema with no rules');
          }
          if (typeof rules !== 'object' || Array.isArray(rules)) {
              throw new Error('Rules must be an object');
          }
          this.rules = rules;
      };
      Schema.prototype.validate = function (source) {
          var _this = this;
          if (!this.rules || Object.keys(this.rules).length === 0) {
              return Promise.resolve(source);
          }
          var series = {};
          var keys = Object.keys(this.rules);
          var total = 0;
          var length = keys.length;
          var results = [];
          keys.forEach(function (z) {
              var rule = _this.rules[z];
              var value = source[z];
              rule = __assign({}, rule);
              rule.validator = _this.getValidationMethod(rule);
              if (!rule.validator) {
                  return;
              }
              rule.field = z;
              rule.type = _this.getType(rule);
              series[z] = __assign(__assign({}, series[z]), { rule: rule, value: value, source: source, field: z });
          });
          // console.log('series: ', series)
          return new Promise(function (resolve, reject) {
              keys.forEach(function (key) {
                  var _a;
                  var res;
                  var data = series[key];
                  var rule = data.rule;
                  function cb(e) {
                      if (e === void 0) { e = []; }
                      total++;
                      var errorList = Array.isArray(e) ? e : [e];
                      // console.log('cb:', total, data, errorList)
                      results = results.concat(errorList.map(function (error) {
                          return {
                              message: error,
                              field: data.field,
                              fieldValue: data.value,
                          };
                      }));
                      if (total === length) {
                          console.log('validate finished: ', results, source);
                          return results.length ? reject(new AsyncValidationError(results)) : resolve(source);
                      }
                  }
                  if (rule.asyncValidator) {
                      res = rule.asyncValidator(rule, data.value, data.source);
                  }
                  else if (rule.validator) {
                      try {
                          res = rule.validator(rule, data.value, data.source);
                      }
                      catch (error) {
                          (_a = console.error) === null || _a === void 0 ? void 0 : _a.call(console, 'validator error:', error);
                          throw error;
                      }
                      if (res === true) {
                          cb();
                      }
                      else if (res === false) {
                          cb("".concat(rule.field, " fails"));
                      }
                      else if (res instanceof Array) {
                          cb(res);
                      }
                      else if (res instanceof Error) {
                          cb(res.message);
                      }
                  }
                  if (res && res.then) {
                      res.then(function () { return cb(); }, function (e) { return cb(e); });
                  }
              });
          });
      };
      Schema.prototype.getType = function (rule) {
          if (typeof rule.validator !== 'function' &&
              rule.type &&
              !validators.hasOwnProperty(rule.type)) {
              throw new Error("Unknown rule type ".concat(rule.type));
          }
          return rule.type || 'string';
      };
      Schema.prototype.getValidationMethod = function (rule) {
          if (typeof rule.validator === 'function') {
              return rule.validator;
          }
          var keys = Object.keys(rule);
          if (keys.length === 1 && keys[0] === 'required') {
              return validators.required;
          }
          // @ts-ignore
          return validators[this.getType(rule)] || undefined;
      };
      Schema.validators = validators;
      return Schema;
  }());

  function TypeOfValue(value) {
      var type = Object.prototype.toString.call(value);
      return type.substring(8, type.length - 1).toLowerCase();
  }
  var checkAppVersionParams = {
      clientversion: {
          type: 'string',
          required: true,
      },
      devicecode: {
          type: 'string',
          required: true,
      },
      region: {
          type: 'number',
      },
      type: {
          type: 'enum',
          enum: ['js', 'lua', 'u3d'],
      },
      format: {
          type: 'enum',
          enum: ['json', 'lua'],
      },
      games: {
          type: 'object',
      },
      activities: {
          type: 'object',
      },
  };
  var checkGameVersionParams = {
      gameid: {
          type: 'number',
          required: true,
      },
      gameversion: {
          type: 'number',
          required: true,
      },
      gamecheckversion: {
          type: 'number',
      },
      type: {
          type: 'enum',
          enum: ['js', 'lua', 'u3d'],
      },
      format: {
          type: 'enum',
          enum: ['json', 'lua'],
      },
  };
  var checkActivityVersionParams = {
      activityshortname: {
          type: 'string',
          required: true,
      },
      activityversion: {
          type: 'number',
          required: true,
      },
      activitycheckversion: {
          type: 'number',
      },
      type: {
          type: 'enum',
          enum: ['js', 'lua', 'u3d'],
      },
      format: {
          type: 'enum',
          enum: ['json', 'lua'],
      },
  };

  // use for check params is valid
  function checkParamsValid(rules, checkValue) {
      var checkSchema = new Schema(rules);
      return checkSchema.validate(checkValue);
  }
  function ThrowError(errors, isJoin) {
      var str = '';
      if (isArray$1(errors)) {
          errors.forEach(function (o) {
              if (isJoin) {
                  str += "".concat(o.message, "; \n");
              }
              else {
                  console.error(o.message);
              }
          });
      }
      console.log(str);
      if (isJoin) {
          return str;
      }
  }
  function pubCheck(paramsCheck, callback, params) {
      // console.log('pubCheck rules: ', paramsCheck)
      return new Promise(function (resolve, reject) {
          if (!isObject$1(callback) || !callback.hasOwnProperty('complete')) {
              console.error('callback must be Object and had complete property');
              // reject()
              return;
          }
          if (!isFunction$1(callback.complete)) {
              console.error("callback complete property must be function type but got ".concat(TypeOfValue(callback.complete)));
              return;
          }
          checkParamsValid(paramsCheck, params)
              .then(function () {
              console.log('sdk 参数检查通过');
              //passed check
              resolve(1);
          })
              .catch(function (_a) {
              var errors = _a.errors;
              console.error('sdk 参数检查报错：', errors);
              //params is invalid callback to cp
              callback === null || callback === void 0 ? void 0 : callback.complete({
                  code: COMMON_ERROR_CODE.PARAMS_ERROR,
                  data: null,
                  errorMsg: ThrowError(errors, true),
              });
          });
      });
  }

  var setcustomCheck = {
      custom: {
          type: 'string',
          required: true,
      },
  };
  var relationTypesCheck = function (rule, value) {
      return new Promise(function (resolve, reject) {
          if (!isObject$1(value)) {
              reject('types must be Object');
          }
          for (var key in value) {
              var item = value[key];
              if (!isBoolean(item)) {
                  reject('types member value must be boolean');
              }
          }
          resolve(true);
      });
  };
  var relationCommonRule = {
      //对方 OpenID
      target: {
          type: 'string',
          required: true,
      },
      // CP 自定义关系类型
      type: {
          type: 'string',
          required: true,
      },
      //用户给Target设置的备注信息（最长512字符）
      target_remarks: {
          type: 'string',
      },
      //Target给用户设置的备注信息（最长512字符）
      user_remarks: {
          type: 'string',
      },
  };
  var addRelationCheck = __assign({ types: {
          //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
          required: true,
          asyncValidator: relationTypesCheck,
      } }, omit(relationCommonRule, 'type'));
  var deleteRelationCheck = __assign({ types: {
          //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
          required: true,
          asyncValidator: relationTypesCheck,
      } }, pick(relationCommonRule, 'target'));
  var updateremarksCheck = omit(relationCommonRule, 'user_remarks');
  var hasRelationCheck = pick(relationCommonRule, ['target', 'type']);
  var relationListCheck = pick(relationCommonRule, 'type');
  var addFriendCheck = omit(relationCommonRule, 'type');
  var delfriendCheck = pick(relationCommonRule, 'target');
  var updatefriendremarksCheck = pick(relationCommonRule, ['target', 'target_remarks']);
  var addscoreCheck = {
      rank_id: {
          type: 'string',
          required: true,
      },
      score: {
          type: 'number',
          required: true,
      },
  };
  var queryuserrankCheck = {
      rank_id: {
          type: 'string',
          required: true,
      },
      open_id: {
          type: 'string',
          required: true,
      },
  };
  var getranklimitlistCheck = {
      rank_id: {
          type: 'string',
          required: true,
      },
      start_rank: {
          type: 'number',
          required: true,
      },
      end_rank: {
          type: 'number',
          required: true,
      },
  };
  var getranklistCheck = {
      rank_id: {
          type: 'string',
          required: true,
      },
  };

  var SdkCommon = /** @class */ (function () {
      function SdkCommon(platform) {
          this.platform = platform;
      }
      // 用户管理
      SdkCommon.prototype.setcustom = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_1;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(setcustomCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, setcustomApi({ custom: params.custom })];
                      case 2:
                          result = _b.sent();
                          console.log(result);
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_1 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_1));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 添加自定义关系
      SdkCommon.prototype.addRelation = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_2;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(addRelationCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, addRelationApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_2 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_2));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 删除自定义关系
      SdkCommon.prototype.deleteRelation = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_3;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(deleteRelationCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, deleteRelationApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_3 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_3));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 更新自定关系备注
      SdkCommon.prototype.updateremarks = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_4;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(updateremarksCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, updateremarksApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_4 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_4));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 判断两用户是否存在某自定关系
      SdkCommon.prototype.hasRelation = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_5;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(hasRelationCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, hasrelationApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_5 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_5));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取自定关系列表
      SdkCommon.prototype.relationList = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_6;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(relationListCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, relationListApi({ type: params.type })];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_6 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_6));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 添加好友关系
      SdkCommon.prototype.addFriend = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_7;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(addFriendCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, addfriendApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_7 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_7));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 删除好友关系
      SdkCommon.prototype.delfriend = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_8;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(delfriendCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, delfriendApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_8 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_8));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 更新好友备注
      SdkCommon.prototype.updatefriendremarks = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_9;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(updatefriendremarksCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, updatefriendremarksApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_9 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_9));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 判断两用户是否为好友
      SdkCommon.prototype.isfriend = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_10;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(delfriendCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, isfriendApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_10 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_10));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取好友关系列表
      SdkCommon.prototype.friends = function (_a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_11;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, friendsApi()];
                      case 1:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          err_11 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_11));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 排行榜相关接口
       */
      // 增加用户分数
      SdkCommon.prototype.addscore = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_12;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(addscoreCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, addscoreApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_12 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_12));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 设置用户分数
      SdkCommon.prototype.setscore = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_13;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(addscoreCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, setscoreApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_13 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_13));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 查询用户分数
      SdkCommon.prototype.queryuserrank = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_14;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(queryuserrankCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, queryuserrankApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_14 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_14));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取排行榜列表
      SdkCommon.prototype.getranklist = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_15;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(getranklimitlistCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, getranklistApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_15 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_15));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取好友排行榜列表
      SdkCommon.prototype.friendsrank = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_16;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(getranklistCheck, { complete: complete }, params)];
                      case 1:
                          _b.sent();
                          return [4 /*yield*/, friendsrankApi(params)];
                      case 2:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          err_16 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_16));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 帮助中心
       */
      SdkCommon.prototype.getHelpcenterMainLayout = function (_a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_17;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getMainlayoutApi()];
                      case 1:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          err_17 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_17));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.getHelpcenterQuestionLayout = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_18;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getListlayoutApi(params)];
                      case 1:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          err_18 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_18));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.getHelpcenterInfoLayout = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_19;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getInfolayoutApi(params)];
                      case 1:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          err_19 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_19));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.helpcenterResolution = function (params, _a) {
          var complete = _a.complete;
          return __awaiter(this, void 0, void 0, function () {
              var result, err_20;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _b.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, postResolutionApi(params)];
                      case 1:
                          result = _b.sent();
                          complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          err_20 = _b.sent();
                          complete(handleTrackError(this.platform, '', err_20));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 玩家意见反馈
       */
      SdkCommon.prototype.addFeedback = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var res, err_21;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, createFeedbackApi(params)];
                      case 1:
                          res = _a.sent();
                          console.log(res);
                          callback && callback.complete(res);
                          return [3 /*break*/, 3];
                      case 2:
                          err_21 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_21));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.getFeedbackList = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var res, err_22;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getFeedbackListApi(params)];
                      case 1:
                          res = _a.sent();
                          console.log(res);
                          callback && callback.complete(res);
                          return [3 /*break*/, 3];
                      case 2:
                          err_22 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_22));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.getFeedbackDetail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var res, err_23;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getFeedbackDetailApi(params)];
                      case 1:
                          res = _a.sent();
                          console.log(res);
                          callback && callback.complete(res);
                          return [3 /*break*/, 3];
                      case 2:
                          err_23 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_23));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 领取道具
      SdkCommon.prototype.collectProps = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var res, err_24;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, collectPropsApi(params)];
                      case 1:
                          res = _a.sent();
                          console.log(res);
                          callback && callback.complete(res);
                          return [3 /*break*/, 3];
                      case 2:
                          err_24 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_24));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取公告列表
      SdkCommon.prototype.getAnnouncement = function (limit, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var productId, channelId, res, err_25;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
                              callback && callback.complete(handleError({
                                  code: 2000,
                                  data: null,
                                  message: 'limit 必须填1 - 100整数'
                              }));
                              return [2 /*return*/];
                          }
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                          return [4 /*yield*/, getNoticeApi({
                                  limit: limit,
                                  product_id: productId,
                                  channel_id: channelId
                              })];
                      case 2:
                          res = _a.sent();
                          console.log(res);
                          return [3 /*break*/, 4];
                      case 3:
                          err_25 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_25));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 用于设置自定义返回错误 Msg
       */
      SdkCommon.prototype.setErrorMsg = function (errMsg) {
          SYSTEM_INFO$1.errMsg = errMsg;
      };
      /**
       * 清空返回错误 Msg
       */
      SdkCommon.prototype.clearErrorMsg = function () {
          SYSTEM_INFO$1.errMsg = {
              default: ''
          };
      };
      // 发送验证码
      SdkCommon.prototype.sendCaptcha = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_1;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(sendCaptchaParamsCheck, callback, params)];
                      case 1:
                          _a.sent();
                          return [4 /*yield*/, sendCaptcha(params)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_1 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_1));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 绑定手机
      SdkCommon.prototype.bindPhone = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_2;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(bindPhoneParamsCheck, callback, params)];
                      case 1:
                          _a.sent();
                          return [4 /*yield*/, bindPhone(params)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_2 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_2));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 解绑手机
      SdkCommon.prototype.unBindPhone = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_3;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(unBindPhoneParamsCheck, callback, params)];
                      case 1:
                          _a.sent();
                          return [4 /*yield*/, unBindPhone(params)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_3 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_3));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 绑定邮箱
      SdkCommon.prototype.bindEmail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var data, error_4;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(bindEmailParamsCheck, callback, params)];
                      case 1:
                          _a.sent();
                          return [4 /*yield*/, bindEmail(params)];
                      case 2:
                          data = _a.sent();
                          callback.complete(data);
                          return [3 /*break*/, 4];
                      case 3:
                          error_4 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_4));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 解绑邮箱
      SdkCommon.prototype.UnbindEmail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var data, error_5;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(unbindemailParamsCheck, callback, params)];
                      case 1:
                          _a.sent();
                          return [4 /*yield*/, UnbindEmail(params)];
                      case 2:
                          data = _a.sent();
                          callback.complete(data);
                          return [3 /*break*/, 4];
                      case 3:
                          error_5 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_5));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 注销账号
      SdkCommon.prototype.deregister = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_6;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, deregister(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_6 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_6));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 撤销账号注销申请
      SdkCommon.prototype.deregisterCancel = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_7;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, deregisterCancel()];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_7 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_7));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 获得用户信息
      SdkCommon.prototype.getInfo = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_8;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getInfoApi()];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_8 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_8));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 修改瑞雪通行证用户信息。
      SdkCommon.prototype.updateInfo = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_9;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, updateInfoApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_9 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_9));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 游戏大厅版本检查-get
      SdkCommon.prototype.checkAppVersion = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var req, result, error_10;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(checkAppVersionParams, callback, params)];
                      case 1:
                          _a.sent();
                          req = __assign(__assign({}, params), { productid: SYSTEM_INFO$1.productId, channelid: SYSTEM_INFO$1.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                          return [4 /*yield*/, checkVersionGameLobbyByGet(req)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_10 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_10));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 游戏大厅版本检查-post
      SdkCommon.prototype.checkVersion = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var req, result, error_11;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(checkAppVersionParams, callback, params)];
                      case 1:
                          _a.sent();
                          req = __assign(__assign({}, params), { productid: SYSTEM_INFO$1.productId, channelid: SYSTEM_INFO$1.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                          return [4 /*yield*/, checkVersionGameLobbyByPost(req)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_11 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_11));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 游戏版本检查
      SdkCommon.prototype.checkGameVersion = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var req, result, error_12;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(checkGameVersionParams, callback, params)];
                      case 1:
                          _a.sent();
                          req = __assign(__assign({}, params), { gamecheckversion: (params === null || params === void 0 ? void 0 : params.gamecheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                          return [4 /*yield*/, checkGameVersion(req)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_12 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_12));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 活动版本检查
      SdkCommon.prototype.checkActivityVersion = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var req, result, error_13;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          return [4 /*yield*/, pubCheck(checkActivityVersionParams, callback, params)];
                      case 1:
                          _a.sent();
                          req = __assign(__assign({}, params), { activitycheckversion: (params === null || params === void 0 ? void 0 : params.activitycheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                          return [4 /*yield*/, checkActivityVersion(req)];
                      case 2:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 4];
                      case 3:
                          error_13 = _a.sent();
                          callback.complete(handleTrackError(this.platform, '', error_13));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.calculateValueSizeWithEncoding = function (key) {
          var value = localStorage.getItem(key);
          if (value === null) {
              return 0;
          }
          var size = 0;
          for (var i = 0; i < value.length; i++) {
              var charCode = value.charCodeAt(i);
              if (charCode <= 127) {
                  size++;
              }
              else {
                  size += 3;
              }
          }
          return size;
      };
      SdkCommon.prototype.track = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var p1, p2, getDevicecode, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, new_properties, reqarr, useCache, size, rx_track_queue, result, err_26;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          p1 = null;
                          p2 = null;
                          try {
                              if (params.complete) {
                                  p2 = params;
                                  p1 = callback;
                              }
                              else {
                                  p1 = params;
                                  p2 = callback;
                              }
                          }
                          catch (err) {
                              p1 = params;
                              p2 = callback;
                          }
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          getDevicecode = function () {
                              var devicecode = customGetStorageSync('rx_devicecode');
                              if (devicecode) {
                                  return devicecode.code;
                              }
                              else {
                                  var code = v4_1();
                                  customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                                  return code;
                              }
                          };
                          devicecode = getDevicecode();
                          type = 'track';
                          time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
                          uuids = v4_1();
                          platform_id = 4;
                          copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId, channel_id = SYSTEM_INFO$1.channelId;
                          cpid = Number(copyCpid);
                          publicProps = customGetStorageSync('rx_public_props');
                          new_properties = {};
                          if (SYSTEM_INFO$1.region_tag) {
                              new_properties.rx_region_tag = "".concat(SYSTEM_INFO$1.region_tag);
                          }
                          if (SYSTEM_INFO$1.cp_role_id) {
                              new_properties['#role_id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
                          }
                          reqarr = [
                              __assign({ type: type, time: time, uuid: uuids, distinct_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.openid, sub_channel_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign(__assign({}, new_properties), p1.properties), publicProps) }))
                          ];
                          !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid);
                          useCache = SYSTEM_INFO$1.single_player_mode;
                          size = this.calculateValueSizeWithEncoding('rx_track_queue');
                          console.log('rx_track_queue size:', size);
                          if (useCache && size <= 2 * 1024 * 1024) {
                              rx_track_queue = customGetStorageSync('rx_track_queue') || [];
                              rx_track_queue = rx_track_queue.concat(reqarr);
                              customSetStorageSync('rx_track_queue', rx_track_queue);
                              p2.complete({ code: 0, data: null, msg: 'track cache' });
                              return [2 /*return*/];
                          }
                          return [4 /*yield*/, trackApi(reqarr)];
                      case 2:
                          result = _a.sent();
                          p2.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                          return [3 /*break*/, 4];
                      case 3:
                          err_26 = _a.sent();
                          p2.complete(handleError(err_26));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.multipleTrack = function () {
          return __awaiter(this, void 0, void 0, function () {
              var rx_track_queue, err_27;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 3, , 4]);
                          rx_track_queue = customGetStorageSync('rx_track_queue') || [];
                          if (!rx_track_queue.length) return [3 /*break*/, 2];
                          console.log('批量补上报大数据');
                          return [4 /*yield*/, trackApi(rx_track_queue)];
                      case 1:
                          _a.sent();
                          removeStorageSync('rx_track_queue');
                          _a.label = 2;
                      case 2: return [3 /*break*/, 4];
                      case 3:
                          err_27 = _a.sent();
                          console.log(err_27);
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      // 获取商业化接口
      SdkCommon.prototype.getOperationScene = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var res, err_28;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getOperationSceneApi()];
                      case 1:
                          res = _a.sent();
                          callback && callback.complete(res);
                          return [3 /*break*/, 3];
                      case 2:
                          err_28 = _a.sent();
                          callback && callback.complete(handleTrackError(this.platform, '', err_28));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 商业化上报接口
      SdkCommon.prototype.reportWindowExposure = function (properties, callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  this.track({
                      complete: function (data) {
                          callback && callback.complete(data);
                      }
                  }, {
                      event: '#window_exposure',
                      properties: properties
                  });
                  return [2 /*return*/];
              });
          });
      };
      // 游戏区服信息查询
      SdkCommon.prototype.getGameArea = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_14;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getGameAreaApi(params.area_id)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_14 = _a.sent();
                          callback.complete(handleError(error_14));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 游戏区服信息修改
      SdkCommon.prototype.putGameArea = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_15;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, putGameAreaApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_15 = _a.sent();
                          callback.complete(handleError(error_15));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 创建游戏区服
      SdkCommon.prototype.createGameArea = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_16;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, createGameAreaApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_16 = _a.sent();
                          callback.complete(handleError(error_16));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 删除游戏区服
      SdkCommon.prototype.delGameArea = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_17;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, delGameAreaApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_17 = _a.sent();
                          callback.complete(handleError(error_17));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 查询区服列表信息
      SdkCommon.prototype.getGameAreaList = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_18;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getGameAreaListApi()];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_18 = _a.sent();
                          callback.complete(handleError(error_18));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 创建角色
      SdkCommon.prototype.createGameCharacter = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_19;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, createGameCharacterApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_19 = _a.sent();
                          callback.complete(handleError(error_19));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 修改游戏角色信息
      SdkCommon.prototype.putGameCharacter = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_20;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, putGameCharacterApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_20 = _a.sent();
                          callback.complete(handleError(error_20));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 删除游戏角色
      SdkCommon.prototype.delGameCharacter = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_21;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, delGameCharacterApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_21 = _a.sent();
                          callback.complete(handleError(error_21));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 查询账号下角色信息列表
      SdkCommon.prototype.getGameCharacterAccount = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_22;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getGameCharacterAccountApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_22 = _a.sent();
                          callback.complete(handleError(error_22));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 查询账号下某个区服下的角色信息列表
      SdkCommon.prototype.getGameCharacter = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_23;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getGameCharacterApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_23 = _a.sent();
                          callback.complete(handleError(error_23));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 查询具体角色信息
      SdkCommon.prototype.getGameAccountAreaCharacter = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_24;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getGameAccountAreaCharacterApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_24 = _a.sent();
                          callback.complete(handleError(error_24));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.exchangeItemProp = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_25;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, itemRedemptionApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_25 = _a.sent();
                          callback.complete(handleError(error_25));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.getDevicecode = function () {
          try {
              var devicecode = customGetStorageSync('rx_devicecode');
              if (devicecode) {
                  // @ts-ignore
                  return devicecode.code;
              }
              else {
                  var code = v4_1();
                  customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                  return code;
              }
          }
          catch (err) {
              return v4_1();
          }
      };
      // 邮件列表
      SdkCommon.prototype.getEmailList = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_26;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getEmailListApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_26 = _a.sent();
                          callback.complete(handleError(error_26));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 邮件详情
      SdkCommon.prototype.getEmailDetail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_27;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, getEmailDetailApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_27 = _a.sent();
                          callback.complete(handleError(error_27));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 邮件领取
      SdkCommon.prototype.receiveEmail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_28;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, receiveEmailApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_28 = _a.sent();
                          callback.complete(handleError(error_28));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 邮件删除
      SdkCommon.prototype.delEmail = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_29;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, delEmailApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_29 = _a.sent();
                          callback.complete(handleError(error_29));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      // 新版通用版本检查 v2
      SdkCommon.prototype.updateGameVersion = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_30;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, updateGameVersionApi(params)];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_30 = _a.sent();
                          callback.complete(handleError(error_30));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkCommon.prototype.setCpOf = function (bool) {
          SYSTEM_INFO$1.CP_OF = bool;
      };
      SdkCommon.prototype.getCpOf = function () {
          return SYSTEM_INFO$1.CP_OF || false;
      };
      SdkCommon.prototype.setGameInfo = function (cp_role_id, region_tag) {
          SYSTEM_INFO$1.cp_role_id = cp_role_id;
          SYSTEM_INFO$1.region_tag = region_tag;
      };
      SdkCommon.prototype.searchGameAccount = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var result, error_31;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, searchGameAccountApi()];
                      case 1:
                          result = _a.sent();
                          callback.complete(result);
                          return [3 /*break*/, 3];
                      case 2:
                          error_31 = _a.sent();
                          callback.complete(handleError(error_31));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      return SdkCommon;
  }());

  var PLATFORM = 'ruixueh5';
  // @ts-ignore
  var SdkH5Ruixue = /** @class */ (function (_super) {
      __extends(SdkH5Ruixue, _super);
      function SdkH5Ruixue(initParams) {
          var _this = _super.call(this, PLATFORM) || this;
          _this._hasAd = {
              rewarded: undefined
          };
          _this._ad = null;
          // 默认刷新时间 10 分钟
          _this.businessRuleDefaultRefreshTime = 600000;
          // 商业广告规则信息
          _this.businessRulesInfo = {
              // 定时器的编号
              timerId: 0,
              // 时间间隔
              refresh_time: _this.businessRuleDefaultRefreshTime,
              // 主窗口配置信息
              main_window_list: [],
              // 窗口配置信息
              window_list: [],
              // 版本-服务端缓存使用
              version: '',
              // 是否命中缓存
              hit_cache: false
          };
          // 商业化接口是否返回结果
          _this.businessRuleInvoking = false;
          // 条件获取商业化窗口队列
          _this.businessWindowsQueue = [];
          // 上报公共属性接口失败次数
          _this.trackPublicPropsFailCount = 0;
          _this.funcs = [];
          _this.initConfig = {};
          // 调度埋点
          _this.scheduleInitMap = {};
          // 获取分享数据缓存调度上报参数
          _this.scheuleReportProps = {};
          // 子渠道id
          _this.subChannelId = null;
          // 是否为推广员
          _this.is_promoter = false;
          _this.game_id = '';
          // 推广员福利码相关信息
          _this.promoInfo = {
              timer: null,
              refresh_period_exp: 0,
              polling: 0,
              promo_code: ''
          };
          _this.game_user_id = '';
          _this.theme = 'light';
          Object.assign(SYSTEM_INFO$1, SYSTEM_INFO, __assign({}, initParams));
          _this.getInitConfig({ complete: initParams.complete });
          console.log('getSearchQueries', getSearchQueries());
          return _this;
      }
      /**
       * 用于设置自定义返回错误 Msg
       */
      SdkH5Ruixue.prototype.setErrorMsg = function (errMsg) {
          SYSTEM_INFO$1.errMsg = errMsg;
      };
      /**
       * 清空返回错误 Msg
       */
      SdkH5Ruixue.prototype.clearErrorMsg = function () {
          SYSTEM_INFO$1.errMsg = {
              default: ''
          };
      };
      SdkH5Ruixue.prototype.calculateValueSizeWithEncoding = function (key) {
          var value = localStorage.getItem(key);
          if (value === null) {
              return 0;
          }
          var size = 0;
          for (var i = 0; i < value.length; i++) {
              var charCode = value.charCodeAt(i);
              if (charCode <= 127) {
                  size++;
              }
              else {
                  size += 3;
              }
          }
          return size;
      };
      SdkH5Ruixue.prototype.track = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var p1, p2, getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, reqarr, useCache, size, rx_track_queue, result, err_1;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          p1 = null;
                          p2 = null;
                          try {
                              if (params.complete) {
                                  p2 = params;
                                  p1 = callback;
                              }
                              else {
                                  p1 = params;
                                  p2 = callback;
                              }
                          }
                          catch (err) {
                              p1 = params;
                              p2 = callback;
                          }
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          getDevicecode_1 = function () {
                              var devicecode = customGetStorageSync('rx_devicecode');
                              if (devicecode) {
                                  return devicecode.code;
                              }
                              else {
                                  var code = v4_1();
                                  customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                                  return code;
                              }
                          };
                          devicecode = getDevicecode_1();
                          type = 'track';
                          time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
                          uuids = v4_1();
                          platform_id = 3;
                          copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId, channel_id = SYSTEM_INFO$1.channelId;
                          cpid = Number(copyCpid);
                          publicProps = customGetStorageSync('rx_public_props');
                          reqarr = [
                              __assign({ type: type, time: time, uuid: uuids, distinct_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.openid, sub_channel_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign({}, p1.properties), publicProps) }))
                          ];
                          !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid);
                          useCache = SYSTEM_INFO$1.single_player_mode;
                          size = this.calculateValueSizeWithEncoding('rx_track_queue');
                          console.log('rx_track_queue size:', size);
                          if (useCache && size <= 2 * 1024 * 1024) {
                              rx_track_queue = customGetStorageSync('rx_track_queue') || [];
                              rx_track_queue = rx_track_queue.concat(reqarr);
                              customSetStorageSync('rx_track_queue', rx_track_queue);
                              p2.complete({ code: 0, data: null, msg: 'track cache' });
                              return [2 /*return*/];
                          }
                          return [4 /*yield*/, trackApi(reqarr)];
                      case 2:
                          result = _a.sent();
                          p2.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                          return [3 /*break*/, 4];
                      case 3:
                          err_1 = _a.sent();
                          p2.complete(handleError(err_1));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 检测是否是微信浏览器
       */
      SdkH5Ruixue.prototype.isWeChatBrowser = function () {
          return /MicroMessenger/i.test(navigator.userAgent);
      };
      SdkH5Ruixue.prototype.isMobileWechat = function () {
          var isWeixin = this.isWeChatBrowser();
          var isMobile = this.isMobile();
          return isWeixin && isMobile;
      };
      SdkH5Ruixue.prototype.isMobile = function () {
          return typeof window.orientation !== 'undefined';
      };
      // 检测横竖屏并显示提示
      SdkH5Ruixue.prototype.checkOrientation = function () {
          // 小于这个值认为是竖屏
          var portraitRatio = 0.75;
          // 获取当前窗口的宽高比
          var ratio = window.innerWidth / window.innerHeight;
          return ratio < portraitRatio;
      };
      SdkH5Ruixue.prototype.getIframeSrc = function (_a) {
          var path = _a.path, base = _a.base;
          // return `http://localhost:666/static/passporth5/#/${path}`
          return "".concat(SYSTEM_INFO$1.baseUrlList[0], "/static/").concat(base, "#/").concat(path);
      };
      SdkH5Ruixue.prototype.getInitParams = function () {
          var token = USER_INFO.token;
          var timezone = SYSTEM_INFO$1.timezone, channelId = SYSTEM_INFO$1.channelId, productId = SYSTEM_INFO$1.productId, cpid = SYSTEM_INFO$1.cpid, version = SYSTEM_INFO$1.__RX_SDK_VERSION, baseUrlList = SYSTEM_INFO$1.baseUrlList, cpof = SYSTEM_INFO$1.CP_OF, region_tag = SYSTEM_INFO$1.region_tag, cp_role_id = SYSTEM_INFO$1.cp_role_id, language = SYSTEM_INFO$1.language;
          return __assign(__assign(__assign(__assign({ width: window.innerWidth, height: window.innerHeight, isWechat: this.isWeChatBrowser(), isMobile: this.isMobile(), isMobileWechat: this.isMobileWechat(), isVertical: this.checkOrientation(), initConfig: this.initConfig, devicecode: getDevicecode(), timezone: timezone, channelId: channelId, productId: productId, cpid: cpid, version: version, baseUrlList: baseUrlList, cpof: cpof, language: language || 'zh' }, (region_tag && { region_tag: "".concat(region_tag) })), (cp_role_id && { cp_role_id: "".concat(cp_role_id) })), ((token === null || token === void 0 ? void 0 : token.access) && { accesstoken: token.access })), { loginData: USER_INFO });
      };
      SdkH5Ruixue.prototype.createModalIframe = function (params) {
          return __awaiter(this, void 0, void 0, function () {
              var _this = this;
              return __generator(this, function (_a) {
                  return [2 /*return*/, new Promise(function (resolve, reject) {
                          // 常量定义
                          var CONTAINER_ID = 'sdk-container'; // 容器元素ID
                          var IFRAME_ID = 'dynamic-iframe'; // iframe元素ID
                          var IFRAME_NAME = 'dynamicFrame'; // iframe名称
                          // 获取目标容器元素
                          var container = document.getElementById(CONTAINER_ID);
                          if (!container) {
                              reject(new Error('未找到sdk-container元素'));
                              return;
                          }
                          // 保存原始body样式以便后续恢复
                          var originalBodyStyle = {
                              overflow: document.body.style.overflow,
                              position: document.body.style.position,
                              width: document.body.style.width,
                              height: document.body.style.height
                          };
                          // 禁止body滚动
                          document.body.style.overflow = 'hidden';
                          // 设置容器样式 - 固定定位、居中显示
                          var updateContainerStyle = function () {
                              var width = window.innerWidth;
                              var height = window.innerHeight;
                              Object.assign(container.style, {
                                  position: 'fixed',
                                  top: '50%',
                                  left: '50%',
                                  width: "".concat(width, "px"),
                                  height: "".concat(height, "px"),
                                  zIndex: '9999',
                                  backgroundColor: params.backgroundColor || 'rgba(0, 0, 0, 0.3)',
                                  overflow: 'hidden',
                                  transform: 'translate(-50%, -50%)',
                                  margin: '0',
                                  padding: '0'
                              });
                          };
                          updateContainerStyle();
                          // 创建iframe元素
                          var iframe = document.createElement('iframe');
                          // 保存当前路径参数以便重载
                          var currentPathParams = {
                              path: params.path,
                              base: params.base || 'passporth5'
                          };
                          // 初始化iframe
                          var initIframe = function () {
                              iframe.src = _this.getIframeSrc(currentPathParams);
                              iframe.frameBorder = '0';
                              iframe.id = IFRAME_ID;
                              iframe.name = IFRAME_NAME;
                              Object.assign(iframe.style, {
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                  display: 'block'
                              });
                              container.appendChild(iframe);
                          };
                          // 重载iframe
                          var reloadIframe = function () {
                              if (container.contains(iframe)) {
                                  container.removeChild(iframe);
                              }
                              iframe = document.createElement('iframe');
                              initIframe();
                          };
                          initIframe();
                          // 清理函数 - 移除事件监听、iframe和恢复样式
                          var cleanup = function () {
                              window.removeEventListener('message', handleMessage);
                              window.removeEventListener('resize', handleResize);
                              window.removeEventListener('resize', handleMobileResize);
                              // 移除移动端方向变化监听
                              if (typeof window.orientation !== 'undefined') {
                                  window.removeEventListener('orientationchange', handleOrientationChange);
                              }
                              if (container.contains(iframe)) {
                                  container.removeChild(iframe);
                              }
                              container.style.cssText = '';
                              // 恢复body原始样式
                              Object.assign(document.body.style, originalBodyStyle);
                          };
                          // 防抖函数
                          var debounce = function (func, delay) {
                              var timer;
                              return function () {
                                  var _this = this;
                                  var args = [];
                                  for (var _i = 0; _i < arguments.length; _i++) {
                                      args[_i] = arguments[_i];
                                  }
                                  clearTimeout(timer);
                                  timer = window.setTimeout(function () { return func.apply(_this, args); }, delay);
                              };
                          };
                          // 处理屏幕方向/尺寸变化
                          var handleViewportChange = debounce(function () {
                              originHeight = window.innerHeight;
                              updateContainerStyle();
                              reloadIframe();
                          }, 200);
                          // PC端窗口大小变化处理
                          var handleResize = function () {
                              handleViewportChange();
                          };
                          var originHeight = window.innerHeight;
                          // 移动端窗口大小变化处理
                          var handleMobileResize = function () {
                              var _a, _b;
                              if (currentPathParams.base === 'passporth5') {
                                  if (window.innerHeight < originHeight) {
                                      container.style.top = "calc(50% + ".concat(originHeight - container.getBoundingClientRect().bottom, "px)");
                                  }
                                  else {
                                      container.style.top = '50%';
                                  }
                                  (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
                                      type: 'KEY_BOARD_CHANGE_PASSPORT',
                                      data: container.getBoundingClientRect().top
                                  }, '*');
                              }
                              if (currentPathParams.base === 'service') {
                                  (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                                      type: 'KEY_BOARD_CHANGE_SERVICE',
                                      data: window.innerHeight < originHeight ? container.getBoundingClientRect().bottom : 0
                                  }, '*');
                              }
                          };
                          // 移动端方向变化处理
                          var handleOrientationChange = function () {
                              handleViewportChange();
                          };
                          // 消息处理器 - 处理来自iframe的各种消息
                          var handleMessage = function (event) {
                              var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                              console.log('收到来自iframe的消息:', event.data);
                              // 处理iframe加载完成消息
                              if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'LOADED') {
                                  var initParams = _this.getInitParams();
                                  if (params.theme) {
                                      initParams.theme = params.theme;
                                  }
                                  if (params.game_user_id) {
                                      initParams.game_user_id = params.game_user_id;
                                  }
                                  // 发送初始化参数
                                  (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                                      type: 'INIT_PARAMS',
                                      data: initParams
                                  }, '*');
                                  // 根据路径发送不同参数
                                  if (['login'].includes(params.path)) {
                                      (_c = iframe.contentWindow) === null || _c === void 0 ? void 0 : _c.postMessage({
                                          type: 'LOGIN_PARAMS',
                                          data: params.loginParams
                                      }, '*');
                                  }
                                  else {
                                      (_d = iframe.contentWindow) === null || _d === void 0 ? void 0 : _d.postMessage({
                                          type: 'LOGIN_DATA',
                                          data: USER_INFO || {}
                                      }, '*');
                                  }
                              }
                              // 处理登录成功消息
                              if (((_e = event.data) === null || _e === void 0 ? void 0 : _e.type) === 'login_success') {
                                  resolve(event.data);
                                  cleanup();
                                  // 检查是否需要实名认证
                                  var needRealName = ((_h = (_g = (_f = _this.initConfig) === null || _f === void 0 ? void 0 : _f.channel) === null || _g === void 0 ? void 0 : _g.ra) === null || _h === void 0 ? void 0 : _h.of) !== false;
                                  if (needRealName && (((_j = event.data.data) === null || _j === void 0 ? void 0 : _j.attr) & (1 << 0)) === 0) {
                                      _this.realName({
                                          complete: function (res) {
                                              console.log(res);
                                          }
                                      });
                                  }
                              }
                              // 处理登录关闭消息
                              if (((_k = event.data) === null || _k === void 0 ? void 0 : _k.type) === 'login_close') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理实名认证完成消息
                              if (((_l = event.data) === null || _l === void 0 ? void 0 : _l.type) === 'real_name_complete') {
                                  getInfoApi()
                                      .then(function (res) {
                                      var _a, _b, _c, _d, _e;
                                      if (res.code === 0) {
                                          // 更新用户信息
                                          USER_INFO.attr = (_a = res.data) === null || _a === void 0 ? void 0 : _a.attr;
                                          USER_INFO.age = (_b = res.data) === null || _b === void 0 ? void 0 : _b.age;
                                          USER_INFO.sex = (_c = res.data) === null || _c === void 0 ? void 0 : _c.sex;
                                          USER_INFO.ext = __assign(__assign({}, USER_INFO.ext), { idcard: (_d = res.data) === null || _d === void 0 ? void 0 : _d.idCard, realname: (_e = res.data) === null || _e === void 0 ? void 0 : _e.realName });
                                      }
                                  })
                                      .catch(console.error)
                                      .finally(function () {
                                      resolve(event.data);
                                  });
                                  cleanup();
                              }
                              // 处理实名认证关闭消息
                              if (((_m = event.data) === null || _m === void 0 ? void 0 : _m.type) === 'real_name_close') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理注销完成消息
                              if (((_o = event.data) === null || _o === void 0 ? void 0 : _o.type) === 'log_off_complete') {
                                  resolve(event.data);
                                  cleanup();
                              }
                              // 处理注销关闭消息
                              if (((_p = event.data) === null || _p === void 0 ? void 0 : _p.type) === 'log_off_close') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理忘记密码关闭消息
                              if (((_q = event.data) === null || _q === void 0 ? void 0 : _q.type) === 'close_forget') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理修改密码关闭消息
                              if (((_r = event.data) === null || _r === void 0 ? void 0 : _r.type) === 'close_reset') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理重置密码成功消息
                              if (((_s = event.data) === null || _s === void 0 ? void 0 : _s.type) === 'reset_password_success') {
                                  reject(event.data);
                                  cleanup();
                              }
                              // 处理帮助中心关闭消息
                              if (((_t = event.data) === null || _t === void 0 ? void 0 : _t.type) === 'close_help_center') {
                                  cleanup();
                              }
                              // 处理跳转客服中心消息
                              if (((_u = event.data) === null || _u === void 0 ? void 0 : _u.type) === 'open_service') {
                                  cleanup();
                                  _this.openService(__assign({}, event.data.data));
                              }
                              // 处理客服中心关闭消息
                              if (((_v = event.data) === null || _v === void 0 ? void 0 : _v.type) === 'close_service') {
                                  cleanup();
                              }
                              // 处理返回帮助中心消息
                              if (((_w = event.data) === null || _w === void 0 ? void 0 : _w.type) === 'close_service_from_help') {
                                  cleanup();
                                  _this.openHelpCenter({
                                      theme: _this.theme,
                                      game_user_id: _this.game_user_id
                                  });
                              }
                          };
                          // 添加事件监听
                          window.addEventListener('message', handleMessage);
                          // 根据设备类型添加不同的事件监听
                          if (_this.isMobile()) {
                              // 移动设备 - 监听方向变化
                              window.addEventListener('orientationchange', handleOrientationChange);
                              window.addEventListener('resize', handleMobileResize);
                          }
                          else {
                              // PC设备 - 监听窗口大小变化
                              window.addEventListener('resize', handleResize);
                          }
                          // iframe加载完成回调
                          iframe.onload = function () { return console.log('iframe加载完成'); };
                          // iframe加载错误处理
                          iframe.onerror = function () {
                              reject({
                                  code: 1000,
                                  msg: 'iframe加载失败'
                              });
                              cleanup();
                          };
                      })];
              });
          });
      };
      SdkH5Ruixue.prototype.realName = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  if (!USER_INFO.token) {
                      callback && callback.complete({
                          code: 3003,
                          msg: '未登录，请先登录'
                      });
                      return [2 /*return*/];
                  }
                  return [2 /*return*/, this.createModalIframe({
                          path: 'realname'
                      }).then(function (res) {
                          callback && callback.complete(res);
                      }).catch(function (err) {
                          callback && callback.complete(err);
                      })];
              });
          });
      };
      SdkH5Ruixue.prototype.forgetPassword = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/, this.createModalIframe({
                          path: 'forget?from_application=sdkh5'
                      }).then(function (res) {
                          callback && callback.complete(res);
                      }).catch(function (err) {
                          callback && callback.complete(err);
                      })];
              });
          });
      };
      SdkH5Ruixue.prototype.resetPassword = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  if (!USER_INFO.token) {
                      callback && callback.complete({
                          code: 3003,
                          msg: '未登录，请先登录'
                      });
                      return [2 /*return*/];
                  }
                  return [2 /*return*/, this.createModalIframe({
                          path: 'reset?from_application=sdkh5'
                      }).then(function (res) {
                          callback && callback.complete(res);
                      }).catch(function (err) {
                          callback && callback.complete(err);
                      })];
              });
          });
      };
      SdkH5Ruixue.prototype.logoff = function (callback) {
          var _a, _b;
          return __awaiter(this, void 0, void 0, function () {
              var res, error_1;
              return __generator(this, function (_c) {
                  switch (_c.label) {
                      case 0:
                          if (!USER_INFO.token) {
                              callback && callback.complete({
                                  code: 3003,
                                  msg: '未登录，请先登录'
                              });
                              return [2 /*return*/];
                          }
                          _c.label = 1;
                      case 1:
                          _c.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, getInfoApi()];
                      case 2:
                          res = _c.sent();
                          if ((((_a = res.data) === null || _a === void 0 ? void 0 : _a.user_state) & 1) === 1) {
                              callback && callback.complete({
                                  code: 0,
                                  msg: '已提交注销申请'
                              });
                              this.createModalIframe({
                                  path: 'logoff?flag=1',
                                  backgroundColor: '#fff'
                              }).then(function (res) {
                                  callback && callback.complete(res);
                              }).catch(function (err) {
                                  callback && callback.complete(err);
                              });
                              return [2 /*return*/];
                          }
                          if ((((_b = res.data) === null || _b === void 0 ? void 0 : _b.user_state) & (1 << 1)) !== 0) {
                              callback && callback.complete({
                                  code: 0,
                                  msg: '已注销'
                              });
                              return [2 /*return*/];
                          }
                          return [3 /*break*/, 4];
                      case 3:
                          error_1 = _c.sent();
                          console.log(error_1);
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/, this.createModalIframe({
                              path: 'logoff',
                              backgroundColor: '#fff'
                          }).then(function (res) {
                              callback && callback.complete(res);
                          }).catch(function (err) {
                              callback && callback.complete(err);
                          })];
                  }
              });
          });
      };
      SdkH5Ruixue.prototype.openHelpCenter = function (params) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  this.theme = params.theme || 'light';
                  this.game_user_id = params.game_user_id || '';
                  return [2 /*return*/, this.createModalIframe({
                          path: 'helpcenter/questioncatalogue-new',
                          base: 'helpcenterh5',
                          backgroundColor: '#fff',
                          theme: params.theme || 'light',
                          game_user_id: params.game_user_id || ''
                      })];
              });
          });
      };
      SdkH5Ruixue.prototype.openService = function (params) {
          return __awaiter(this, void 0, void 0, function () {
              var _a, channelId, productId, cpid, cpof, region_tag, cp_role_id, accesstoken, devicecode, isMobileWechat, searchQuery, queryParams_1, queryParams_2;
              return __generator(this, function (_b) {
                  this.theme = params.theme || 'light';
                  this.game_user_id = params.game_user_id || '';
                  _a = this.getInitParams(), channelId = _a.channelId, productId = _a.productId, cpid = _a.cpid, cpof = _a.cpof, region_tag = _a.region_tag, cp_role_id = _a.cp_role_id, accesstoken = _a.accesstoken, devicecode = _a.devicecode, isMobileWechat = _a.isMobileWechat;
                  searchQuery = __assign({ devicecode: devicecode, minimized: 0, region_tag: region_tag || '', theme: params.theme || 'light', game_user_id: cp_role_id || params.game_user_id || '', 'ruixue-language': params.default_lang || 'zh', 'ruixue-accesstoken': accesstoken || '', 'ruixue-cpid': cpid || '', 'ruixue-productid': productId || '', 'ruixue-channelid': channelId || '', 'ruixue-region': region_tag || '', 'ruixue-cp-role-id': cp_role_id || '' }, (cpof ? { cpof: '1' } : {}));
                  searchQuery.from_application = params.from_application || 'sdkh5';
                  new URLSearchParams(searchQuery);
                  /*return this.createModalIframe({
                    path: `?${queryParams.toString()}`,
                    base: 'service',
                    backgroundColor: '#fff',
                    theme: params.theme || 'light',
                    game_user_id: cp_role_id || params.game_user_id || ''
                  })*/
                  if (isMobileWechat) {
                      searchQuery.from_application = params.from_application || 'sdkh5';
                      queryParams_1 = new URLSearchParams(searchQuery);
                      return [2 /*return*/, this.createModalIframe({
                              path: "?".concat(queryParams_1.toString()),
                              base: 'service',
                              backgroundColor: '#fff',
                              theme: params.theme || 'light',
                              game_user_id: cp_role_id || params.game_user_id || ''
                          })];
                  }
                  else {
                      searchQuery.from_application = 'browser';
                      queryParams_2 = new URLSearchParams(searchQuery);
                      window.open(this.getIframeSrc({
                          path: "?".concat(queryParams_2.toString()),
                          base: 'service'
                      }));
                  }
                  return [2 /*return*/];
              });
          });
      };
      SdkH5Ruixue.prototype.h5Login = function (loginParams) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/, this.createModalIframe({
                          path: 'login',
                          loginParams: loginParams
                      })];
              });
          });
      };
      /**
       * H5瑞雪登录方法
       * @param params 登录参数
       * @param callback 可选回调函数
       */
      SdkH5Ruixue.prototype.login = function (params, callback) {
          var _a, _b, _c, _d;
          return __awaiter(this, void 0, void 0, function () {
              var user_source, now, distinct_id, requestParams, queryJson, user_info, reflowEnabled, source_ad, reqLogin, _e, custom_ext, rest_ext, err_2;
              return __generator(this, function (_f) {
                  switch (_f.label) {
                      case 0:
                          _f.trys.push([0, 5, , 6]);
                          user_source = this.getLoginQsAndGenerateStruct();
                          now = Date.now();
                          distinct_id = customGetStorageSync('rx_distinct_id') || v4_1() // 获取或生成设备唯一ID
                          ;
                          // 如果本地没有存储过distinct_id，则进行存储
                          if (!customGetStorageSync('rx_distinct_id')) {
                              customSetStorageSync('rx_distinct_id', distinct_id);
                          }
                          requestParams = __assign({ ts: now, method: params.method, distinct_id: distinct_id, ext: params.ext }, user_source);
                          // 2. 处理子渠道信息
                          try {
                              if (this.subChannelId !== null) {
                                  queryJson = getSearchQueries();
                                  requestParams.user_source = {
                                      guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                  };
                                  // 合并查询参数
                                  if (queryJson) {
                                      requestParams.user_source.guide = __assign(__assign({}, requestParams.user_source.guide), queryJson);
                                  }
                              }
                          }
                          catch (err) {
                              // 子渠道信息处理出错时忽略，不影响主流程
                          }
                          user_info = {};
                          if (!params.login_openid) return [3 /*break*/, 2];
                          // 3.1 使用openid登录
                          requestParams.login_openid = params.login_openid;
                          return [4 /*yield*/, loginByTokenApi(this.ActivePrefix(requestParams))];
                      case 1:
                          user_info = _f.sent();
                          return [3 /*break*/, 4];
                      case 2:
                          reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1 // 投放开关检查
                          ;
                          source_ad = this.getAttributionData();
                          reqLogin = reflowEnabled ? __assign(__assign({}, requestParams), { device: source_ad }) : requestParams;
                          _e = reqLogin.ext || {}, custom_ext = _e.custom_ext, rest_ext = __rest(_e, ["custom_ext"]);
                          reqLogin.custom_ext = custom_ext || {};
                          reqLogin.ext = __assign({}, (rest_ext || {}));
                          return [4 /*yield*/, this.h5Login(this.ActivePrefix(reqLogin))];
                      case 3:
                          user_info = _f.sent();
                          _f.label = 4;
                      case 4:
                          // 4. 处理登录结果
                          Object.assign(USER_INFO, user_info.data);
                          // 检查是否为推广员
                          if ((((_c = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _c === void 0 ? void 0 : _c.user_flag) & 1) === 1) {
                              this.is_promoter = true;
                              this.game_id = ((_d = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _d === void 0 ? void 0 : _d.cp_user_id) || '';
                          }
                          // 5. 持久化登录状态
                          customSetStorageSync('rx-loginState', 1);
                          customSetStorageSync('rxToken', user_info.data.token);
                          // 6. 执行回调
                          callback === null || callback === void 0 ? void 0 : callback.complete(user_info);
                          return [3 /*break*/, 6];
                      case 5:
                          err_2 = _f.sent();
                          console.error('登录失败:', err_2);
                          // 错误处理回调
                          callback === null || callback === void 0 ? void 0 : callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err_2));
                          return [3 /*break*/, 6];
                      case 6: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * H5瑞雪支付方法
       * @param params 支付参数
       * @param callback 可选回调函数
       */
      SdkH5Ruixue.prototype.pay = function (params, callback) {
          return __awaiter(this, void 0, void 0, function () {
              var reqOrder, result, err_3;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          if (params.indulge_auth == 1 && !params.age) {
                              throw Error('when indulge_auth equal 1,the age must be required');
                          }
                          reqOrder = __assign(__assign({}, params), { currency: params.currency || 'CNY', openid: USER_INFO.openid, sub_channel_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, ext: __assign({}, params.ext || {}) });
                          switch (params.pay_type) {
                              case 'aums':
                                  reqOrder.ext = {
                                      pay_type: 'h5'
                                  };
                                  break;
                          }
                          return [4 /*yield*/, orderApi(reqOrder)];
                      case 1:
                          result = _a.sent();
                          window.open(result.data.ext.url, '_blank');
                          callback.complete({ code: 0 });
                          return [3 /*break*/, 3];
                      case 2:
                          err_3 = _a.sent();
                          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
                              code: COMMON_ERROR_CODE.PAY_ERROR,
                              msg: '支付错误',
                              thirdcode: err_3.code
                          }));
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      SdkH5Ruixue.prototype.share = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/];
              });
          });
      };
      // 激励广告
      SdkH5Ruixue.prototype.rewardedVideoAd = function (data, callback) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/];
              });
          });
      };
      SdkH5Ruixue.prototype.setScheuleReportProps = function (data) {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          this.scheuleReportProps = {
              trigger_tag: ((_a = data === null || data === void 0 ? void 0 : data.trigger) === null || _a === void 0 ? void 0 : _a.tag) || '',
              trigger_id: ((_b = data === null || data === void 0 ? void 0 : data.trigger) === null || _b === void 0 ? void 0 : _b.id) || 0,
              trigger_type: ((_c = data === null || data === void 0 ? void 0 : data.trigger) === null || _c === void 0 ? void 0 : _c.type) || 0,
              material_type: ((_d = data === null || data === void 0 ? void 0 : data.content) === null || _d === void 0 ? void 0 : _d.material_type) || '',
              material_id: ((_e = data === null || data === void 0 ? void 0 : data.content) === null || _e === void 0 ? void 0 : _e.material_id) || 0,
              landing_id: ((_f = data === null || data === void 0 ? void 0 : data.content) === null || _f === void 0 ? void 0 : _f.landing_id) || 0,
              strategy_id: ((_g = data === null || data === void 0 ? void 0 : data.strategy) === null || _g === void 0 ? void 0 : _g.id) || 0,
              strategy_type: ((_h = data === null || data === void 0 ? void 0 : data.strategy) === null || _h === void 0 ? void 0 : _h.type) || 0,
              platform: (data === null || data === void 0 ? void 0 : data.platform) || PLATFORM
          };
      };
      // 获得公共属性
      SdkH5Ruixue.prototype.getPublicProperties = function () {
          var data = customGetStorageSync("rx_public_props");
          return { code: 0, data: data };
      };
      /**
       * 设置公共属性
       * 设置后CP无需每次上报都传，由SDK填入properties中。
       */
      SdkH5Ruixue.prototype.setPublicProperties = function (params) {
          if (!isObject$1(params)) {
              var error = new Error('params must be object');
              error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
              return handleTrackError(PLATFORM, '', error);
          }
          try {
              customSetStorageSync('rx_public_props', params);
              return { code: 0 };
          }
          catch (error) {
              return handleTrackError(PLATFORM, '', error);
          }
      };
      /**
       * 修改设置的公共数据。
       */
      SdkH5Ruixue.prototype.updatePublicProperties = function (params) {
          if (!isObject$1(params)) {
              var error = new Error('params must be object');
              error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
              return handleTrackError(PLATFORM, '', error);
          }
          try {
              var cache = customGetStorageSync('rx_public_props');
              // @ts-ignore
              customSetStorageSync('rx_public_props', __assign(__assign({}, cache), params));
              return { code: 0 };
          }
          catch (error) {
              return handleTrackError(PLATFORM, '', error);
          }
      };
      /**
       * 删除公共属性
       */
      SdkH5Ruixue.prototype.deletePublicProperties = function (params) {
          try {
              var cache = customGetStorageSync('rx_public_props');
              // @ts-ignore
              var rest = omit(cache, params);
              customSetStorageSync('rx_public_props', rest);
              return { code: 0 };
          }
          catch (error) {
              return handleTrackError(PLATFORM, '', error);
          }
      };
      SdkH5Ruixue.prototype.getInitConfig = function (callback) {
          var _a, _b, _c, _d, _e;
          return __awaiter(this, void 0, void 0, function () {
              var initParams, res, config, version, _i, _f, key, prop_version, err_4, error;
              return __generator(this, function (_g) {
                  switch (_g.label) {
                      case 0:
                          initParams = customGetStorageSync('rx-init-params') || {};
                          _g.label = 1;
                      case 1:
                          _g.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, getInitConf({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                      case 2:
                          res = _g.sent();
                          config = res.data || {};
                          version = {};
                          for (_i = 0, _f = Object.keys(config); _i < _f.length; _i++) {
                              key = _f[_i];
                              prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                              if (prop_version) {
                                  version[key] = prop_version;
                                  this.initConfig[key] = { timerId: 0 };
                              }
                              this.initConfig[key] = config[key];
                          }
                          //检查是否需要传递subchannleid
                          this.publicSubchannelCheck(res);
                          customSetStorageSync('rx-init-params', { version: version });
                          SYSTEM_INFO$1.SDK_INIT_FINISHED = true;
                          SYSTEM_INFO$1.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                          if (SYSTEM_INFO$1.need_active) {
                              // 检查是否需要激活
                              this.checkNeedActivate();
                          }
                          callback.complete({ code: 0, data: this.initConfig });
                          return [3 /*break*/, 4];
                      case 3:
                          err_4 = _g.sent();
                          error = __assign(__assign({}, (err_4 || {})), { msg: '初始化错误，或未初始化', code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_4.code || err_4.errCode, message: err_4.message || err_4.msg || err_4.errMsg, thirdmsg: err_4.message || err_4.msg || err_4.errMsg });
                          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_init', error));
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      SdkH5Ruixue.prototype.publicSubchannelCheck = function (res) {
          var _a, _b;
          try {
              var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
              var queryString = getSearchQueries(true);
              var query = queryString ? queryString.split('&') : [];
              if ((sub_channel === null || sub_channel === void 0 ? void 0 : sub_channel.length) && (query === null || query === void 0 ? void 0 : query.length)) {
                  for (var a = 0; a < sub_channel.length; a++) {
                      var item = sub_channel[a];
                      var reflectStringArr = item === null || item === void 0 ? void 0 : item.map;
                      if (reflectStringArr === null || reflectStringArr === void 0 ? void 0 : reflectStringArr.length) {
                          var arr = item === null || item === void 0 ? void 0 : item.map;
                          var sub_channel_id = item === null || item === void 0 ? void 0 : item.id;
                          for (var k in arr) {
                              var str = arr[k];
                              for (var c in query) {
                                  if (str.includes(query[c])) {
                                      this.subChannelId = sub_channel_id;
                                      return;
                                  }
                              }
                          }
                      }
                  }
              }
          }
          catch (err) {
              // 忽略错误
          }
      };
      // 获取归因数据
      SdkH5Ruixue.prototype.getAttributionData = function () {
          var universal = getSearchQueries();
          var source_ad = {};
          if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
              source_ad.ad_rawargs = omit(universal, ['ad_platform']);
              source_ad.ad_platform = universal.ad_platform;
          }
          return source_ad;
      };
      SdkH5Ruixue.prototype.checkNeedActivate = function () {
          return __awaiter(this, void 0, void 0, function () {
              var activeResult, source_ad, distinct_id, req, result;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          activeResult = customGetStorageSync('rx-active-result');
                          if (!!activeResult) return [3 /*break*/, 4];
                          source_ad = this.getAttributionData();
                          distinct_id = v4_1();
                          customSetStorageSync('rx_distinct_id', distinct_id);
                          req = {
                              stage: 'init',
                              distinct_id: distinct_id,
                              source_ad: source_ad
                          };
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, activated(req)];
                      case 2:
                          result = _a.sent();
                          customSetStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data });
                          return [3 /*break*/, 4];
                      case 3:
                          _a.sent();
                          customSetStorageSync('rx-active-result', { isSuccess: false, activeResult: req });
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      //格式化queryString
      SdkH5Ruixue.prototype.getLoginQsAndGenerateStruct = function () {
          var _a;
          var universal = getSearchQueries();
          var user_source = {};
          if (universal.hasOwnProperty('user_source')) {
              var omitKeys = (universal === null || universal === void 0 ? void 0 : universal.user_source) === 'transmits' ? ['user_source'] : ['user_source', 'type', 'transmits'];
              var leftProps = __assign({}, omit(universal, omitKeys));
              /**
               * url 上有user_source字段并且除了'user_source', 'type', 'transmits'等字段外还有属性，则将剩余属性全部放到universal['user_source']属性下
               * 多包了一层'user_source',使用的地方直接 ...
               */
              if (!isEmpty(leftProps)) {
                  // 用户透传参数
                  if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'transmits') {
                      user_source = {
                          user_transmits: Object.assign(leftProps, { transmits: decodeURIComponent(leftProps.transmits || '') })
                      };
                  }
                  else if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'attr') {
                      user_source = {
                          user_attrs: leftProps
                      };
                  }
                  else {
                      user_source = {
                          user_source: (_a = {},
                              _a[universal['user_source']] = leftProps,
                              _a)
                      };
                  }
                  return user_source;
              }
          }
          var subPackageInfo = customGetStorageSync('rx_sub_package_info');
          if (!isEmpty(subPackageInfo)) {
              user_source = {
                  user_source: {
                      sub_package: subPackageInfo
                  }
              };
              return user_source;
          }
          return null;
      };
      SdkH5Ruixue.prototype.ActivePrefix = function (reqParams) {
          var loginState = customGetStorageSync('rx-loginState');
          var activeSave = customGetStorageSync('rx-active-result');
          if (loginState || !activeSave) {
              return reqParams;
          }
          else {
              if (activeSave === null || activeSave === void 0 ? void 0 : activeSave.isSuccess) {
                  return __assign(__assign({}, reqParams), { activate: { result: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
              }
              else {
                  return __assign(__assign({}, reqParams), { activate: { args: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
              }
          }
      };
      /**
       * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
       */
      SdkH5Ruixue.prototype.setSubChannelId = function (subChannelId) {
          try {
              customSetStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId });
              return { code: 0 };
          }
          catch (error) {
              return handleTrackError(PLATFORM, '', error);
          }
      };
      return SdkH5Ruixue;
  }(SdkCommon));

  // @ts-ignore
  function Web () {
      var sdk;
      Vue.component('Demo', {
          template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u745E\u96EAh5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u745E\u96EAh5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='loginByOpenid'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='forgetPassword'>\n                \u5FD8\u8BB0\u5BC6\u7801\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='resetPassword'>\n                \u4FEE\u6539\u5BC6\u7801\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='logoff'>\n                \u6CE8\u9500\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='realName'>\n                \u5B9E\u540D\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openHelpCenter'>\n                \u5E2E\u52A9\u4E2D\u5FC3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openService'>\n                \u5BA2\u670D\u4E2D\u5FC3\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
          data: function () {
              return {
                  sdkLoaded: false
              };
          },
          methods: {
              init: function () {
                  // @ts-ignore
                  sdk = new SdkH5Ruixue({
                      productId: '1002',
                      channelId: '100',
                      cpid: '114',
                      baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                      // productId: '266',
                      // channelId: 'h5test',
                      // cpid: '1000336',
                      // baseUrlList: ['https://ghmf2.weileyurtr.com'],
                      // logSwitch: false,
                      complete: function (res) {
                          console.log('初始化:', res);
                      }
                  });
                  sdk.setGameInfo('test_role_id', 'test_region_tag');
              },
              login: function () {
                  sdk.login({
                      method: 'ruixue'
                  }, {
                      complete: function (res) {
                          console.log('登录: ', res);
                          if (res.code === 0) {
                              localStorage.setItem('login_openid', res.data.login_openid);
                          }
                      }
                  });
              },
              forgetPassword: function () {
                  sdk.forgetPassword({
                      complete: function (res) {
                          console.log('忘记密码: ', res);
                      }
                  });
              },
              resetPassword: function () {
                  sdk.resetPassword({
                      complete: function (res) {
                          console.log('修改密码: ', res);
                      }
                  });
              },
              loginByOpenid: function () {
                  var _this = this;
                  sdk.login({
                      method: 'ruixue',
                      login_openid: localStorage.getItem('login_openid')
                  }, {
                      complete: function (res) {
                          console.log('登录: ', res);
                          if (res.code === 0) {
                              localStorage.setItem('login_openid', res.data.login_openid);
                          }
                          else if (res.code !== 3001) {
                              _this.login();
                          }
                      }
                  });
              },
              logoff: function () {
                  sdk.logoff({
                      complete: function (res) {
                          console.log('注销: ', res);
                      }
                  });
              },
              realName: function () {
                  sdk.realName({
                      complete: function (res) {
                          console.log('实名: ', res);
                      }
                  });
              },
              openHelpCenter: function () {
                  sdk.openHelpCenter({
                      theme: 'light'
                  });
              },
              openService: function () {
                  sdk.openService({
                      theme: 'light'
                  });
              },
              pay: function () {
                  sdk.pay({
                      pay_type: 'aums',
                      goods_tag: '830001101',
                      trade_no: "".concat(new Date().getTime()),
                      currency: 'CNY'
                  }, {
                      complete: function (res) {
                          console.log('支付: ', res);
                      }
                  });
              }
          }
      });
      new Vue({
          el: '#app'
      });
  }

  Web();

}));
//# sourceMappingURL=index.h5_ruixueh5.umd.js.map
