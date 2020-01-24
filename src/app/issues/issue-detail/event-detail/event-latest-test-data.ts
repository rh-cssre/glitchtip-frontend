import { EventDetail } from "../../interfaces";

/* tslint:disable */
export const latestEvent: EventDetail = {
  eventID: "e4c096c4940d4d3e96c7560592cdad96",
  dist: null,
  userReport: null,
  projectID: "138267",
  previousEventID: "b8139ffe559443399931535b1c6ab97e",
  message: "",
  id: "e4c096c4940d4d3e96c7560592cdad96",
  size: 32501,
  errors: [],
  culprit: "I.next(main)",
  title: "TypeError: Actions must have a type property",
  sdkUpdates: [
    {
      enables: [],
      sdkUrl: "https://docs.sentry.io/platforms/javascript",
      sdkName: "sentry.javascript.browser",
      newSdkVersion: "5.11.1",
      type: "updateSdk"
    }
  ],
  platform: "javascript",
  location: "/main.0aa02efa52a79a1f9c59.js",
  nextEventID: null,
  type: "error",
  metadata: {
    function: "I.next",
    type: "TypeError",
    value: "Actions must have a type property",
    filename: "/main.0aa02efa52a79a1f9c59.js"
  },
  groupingConfig: {
    enhancements: "eJybzDhxY05qemJypZWRgaGlroGxrqHRBABbEwcC",
    id: "legacy:2019-03-12"
  },
  crashFile: null,
  tags: [
    { value: "Chrome 79.0.3945", key: "browser", _meta: null },
    { value: "Chrome", key: "browser.name", _meta: null },
    { value: "production", key: "environment", _meta: null },
    { value: "yes", key: "handled", _meta: null },
    { value: "error", key: "level", _meta: null },
    { value: "instrument", key: "mechanism", _meta: null },
    { value: "Windows 10", key: "os", _meta: null },
    { value: "Windows", key: "os.name", _meta: null },
    { value: "1.13.3", key: "release", _meta: null },
    { value: "https://app.passit.io/account/login", key: "url", _meta: null },
    {
      query: 'user.ip:"165.225.114.83"',
      value: "ip:165.225.114.83",
      key: "user",
      _meta: null
    }
  ],
  dateCreated: "2020-01-14T00:19:54.387854Z",
  dateReceived: "2020-01-14T00:19:54.387854Z",
  user: {
    username: null,
    name: null,
    ip_address: "165.225.114.83",
    email: null,
    data: null,
    id: null
  },
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  function: "XMLHttpRequest.k",
                  errors: null,
                  colNo: 20458,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} st e=o.slice();for(let o=0;o<e.length&&(!t||!0!==t[W]);o++)y(e[o],n,t)}},b=function(t){if(!(t=t||e.event))return;const n=this||t.target||e,o {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "y",
                  errors: null,
                  colNo: 20137,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} t&&(e.callback=e=>o.handleEvent(e),e.originalDelegate=o),e.invoke(e,t,[n]);const r=e.options;r&&"object"==typeof r&&r.once&&t[s].call(t,n.ty {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "c.invokeTask [as invoke]",
                  errors: null,
                  colNo: 8063,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ry{return e.runCount++,e.zone.runTask(e,t,n)}finally{1==j&&_(),j--}}get zone(){return this._zone}get state(){return this._state}cancelSchedu {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "_",
                  errors: null,
                  colNo: 8978,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} f;f=[];for(let n=0;n<t.length;n++){const o=t[n];try{o.zone.runTask(o,null,null)}catch(e){O.onUnhandledError(e)}}}O.microtaskDrainDone(),d=!1 {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "s.runTask",
                  errors: null,
                  colNo: 2539,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} eriodic&&(e.cancelFn=void 0);try{return this._zoneDelegate.invokeTask(this,e,t,n)}catch(s){if(this._zoneDelegate.handleError(this,s))throw s {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a.invokeTask",
                  errors: null,
                  colNo: 6954,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} Task(e,t,n,o){return this._invokeTaskZS?this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt,this._invokeTaskCurrZone,e,t,n,o):t.callback.ap {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "Object.onInvokeTask",
                  errors: null,
                  colNo: 241350,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} arZone:!0},onInvokeTask:(e,n,r,i,s,o)=>{try{return c_(t),e.invokeTask(r,i,s,o)}finally{u_(t)}},onInvoke:(e,n,r,i,s,o,a)=>{try{return c_(t),e {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a.invokeTask",
                  errors: null,
                  colNo: 7033,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} nvokeTaskDlgt,this._invokeTaskCurrZone,e,t,n,o):t.callback.apply(n,o)}cancelTask(e,t){let n;if(this._cancelTaskZS)n=this._cancelTaskZS.onCan {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: null,
                  errors: null,
                  colNo: 12741,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} ry{const o=e[_],r=n&&m===n[m];r&&(n[y]=o,n[k]=s);const a=t.run(i,void 0,r&&i!==d&&i!==f?[]:[o]);P(n,!0,a)}catch(o){P(n,!1,o)}},n)}const I="f {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "s.run",
                  errors: null,
                  colNo: 1924,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ,n,o){P={parent:P,zone:this};try{return this._zoneDelegate.invoke(this,e,t,n,o)}finally{P=P.parent}}runGuarded(e,t=null,n,o){P={parent:P,zon {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a.invoke",
                  errors: null,
                  colNo: 6355,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ):t}invoke(e,t,n,o,r){return this._invokeZS?this._invokeZS.onInvoke(this._invokeDlgt,this._invokeCurrZone,e,t,n,o,r):t.apply(n,o)}handleErro {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "Object.onInvoke",
                  errors: null,
                  colNo: 241432,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} ally{u_(t)}},onInvoke:(e,n,r,i,s,o,a)=>{try{return c_(t),e.invoke(r,i,s,o,a)}finally{u_(t)}},onHasTask:(e,n,r,i)=>{e.hasTask(r,i),n===r&&("m {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a.invoke",
                  errors: null,
                  colNo: 6415,
                  vars: null,
                  package: null,
                  absPath:
                    "https://app.passit.io/polyfills.5f194581390fcad97fb1.js",
                  inApp: false,
                  lineNo: 1,
                  module: "polyfills",
                  filename: "/polyfills.5f194581390fcad97fb1.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} nInvoke(this._invokeDlgt,this._invokeCurrZone,e,t,n,o,r):t.apply(n,o)}handleError(e,t){return!this._handleErrorZS||this._handleErrorZS.onHan {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: null,
                  errors: null,
                  colNo: 471548,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} e);if(Object(l.a)(e))return(e=>t=>(e.then(e=>{t.closed||(t.next(e),t.complete())},e=>t.error(e)).then(null,i.a),t))(e);if(e&&"function"==typ {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i._next",
                  errors: null,
                  colNo: 20917,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} alue=t,this.outerIndex=n,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.pa {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.notifyNext",
                  errors: null,
                  colNo: 498774,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ,this.unsubscribe()}notifyNext(e,t,n,r,i){this.destination.next(t)}notifyError(e){this.destination.error(e)}notifyComplete(e){this.destinati {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "l.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "l._next",
                  errors: null,
                  colNo: 38100,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} sStopped=!0,super.unsubscribe())}_next(e){this.destination.next(e)}_error(e){this.destination.error(e),this.unsubscribe()}_complete(){this.d {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "a._next",
                  errors: null,
                  colNo: 551469,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ends r.a{constructor(e){super(e)}_next(e){this.destination.next(i.a.createNext(e))}_error(e){const t=this.destination;t.next(i.a.createError {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o._next",
                  errors: null,
                  colNo: 745552,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} (n){return void this.destination.error(n)}this.destination.next(t)}}},lW6c:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){r {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i._next",
                  errors: null,
                  colNo: 20917,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} alue=t,this.outerIndex=n,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.pa {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.notifyNext",
                  errors: null,
                  colNo: 20525,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ,this.unsubscribe()}notifyNext(e,t,n,r,i){this.destination.next(t)}notifyComplete(e){const t=this.buffer;this.remove(e),this.active--,t.leng {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i._next",
                  errors: null,
                  colNo: 20917,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} alue=t,this.outerIndex=n,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.pa {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.notifyNext",
                  errors: null,
                  colNo: 498774,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ,this.unsubscribe()}notifyNext(e,t,n,r,i){this.destination.next(t)}notifyError(e){this.destination.error(e)}notifyComplete(e){this.destinati {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o._next",
                  errors: null,
                  colNo: 745552,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} (n){return void this.destination.error(n)}this.destination.next(t)}}},lW6c:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){r {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o._next",
                  errors: null,
                  colNo: 762220,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} {return void this.destination.error(n)}t&&this.destination.next(e)}}},pMnS:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));va {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "o._next",
                  errors: null,
                  colNo: 739775,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} ))}}class o extends r.a{constructor(e){super(e)}_next(e){e.observe(this.destination)}}},kiQV:function(e){e.exports=JSON.parse(\'{"name":"pass {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "e.observe",
                  errors: null,
                  colNo: 491072,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} ===e}observe(e){switch(this.kind){case"N":return e.next&&e.next(this.value);case"E":return e.error&&e.error(this.error);case"C":return e.com {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "i._next",
                  errors: null,
                  colNo: 20917,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} alue=t,this.outerIndex=n,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.pa {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.notifyNext",
                  errors: null,
                  colNo: 20525,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} ,this.unsubscribe()}notifyNext(e,t,n,r,i){this.destination.next(t)}notifyComplete(e){const t=this.buffer;this.remove(e),this.active--,t.leng {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "c.next",
                  errors: null,
                  colNo: 37874,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} urn r.syncErrorThrowable=!1,r}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){t {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "c._next",
                  errors: null,
                  colNo: 38100,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} sStopped=!0,super.unsubscribe())}_next(e){this.destination.next(e)}_error(e){this.destination.error(e),this.unsubscribe()}_complete(){this.d {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.next",
                  errors: null,
                  colNo: 38929,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} s.__tryOrSetError(t,this._next,e)&&this.unsubscribe():this.__tryOrUnsub(this._next,e)}}error(e){if(!this.isStopped){const{_parentSubscriber: {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "u.__tryOrUnsub",
                  errors: null,
                  colNo: 39708,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} scribe())}else this.unsubscribe()}}__tryOrUnsub(e,t){try{e.call(this._context,t)}catch(n){if(this.unsubscribe(),a.a.useDeprecatedSynchronous {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "X.next",
                  errors: null,
                  colNo: 316773,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      "{snip} {this.actionsObserver.next(e)}next(e){this.actionsObserver.next(e)}error(e){this.actionsObserver.error(e)}complete(){this.actionsObserver.co {snip}"
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                },
                {
                  function: "I.next",
                  errors: null,
                  colNo: 312881,
                  vars: null,
                  package: null,
                  absPath: "https://app.passit.io/main.0aa02efa52a79a1f9c59.js",
                  inApp: false,
                  lineNo: 1,
                  module: "main",
                  filename: "/main.0aa02efa52a79a1f9c59.js",
                  platform: null,
                  instructionAddr: null,
                  context: [
                    [
                      1,
                      '{snip} eError("Actions must be objects");if(void 0===e.type)throw new TypeError("Actions must have a type property");super.next(e)}complete(){}ngOn {snip}'
                    ]
                  ],
                  symbolAddr: null,
                  trust: null,
                  symbol: null,
                  rawFunction: null
                }
              ],
              framesOmitted: null,
              registers: null,
              hasSystemFrames: false
            },
            module: null,
            rawStacktrace: null,
            mechanism: {
              data: { function: "<anonymous>" },
              type: "instrument",
              handled: true
            },
            threadId: null,
            value: "Actions must have a type property",
            type: "TypeError"
          }
        ],
        excOmitted: null,
        hasSystemFrames: false
      }
    }
    // {
    //   type: "breadcrumbs",
    //   data: {
    //     values: [
    //       {
    //         category: "ui.click",
    //         level: "info",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.235000Z",
    //         data: null,
    //         message: "[Filtered]",
    //         type: "default"
    //       },
    //       {
    //         category: "xhr",
    //         level: "info",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.514000Z",
    //         data: {
    //           url: "https://app.passit.io/api/confirm-email-short-code/",
    //           status_code: 403,
    //           method: "PUT"
    //         },
    //         message: null,
    //         type: "http"
    //       },
    //       {
    //         category: "navigation",
    //         level: "info",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.517000Z",
    //         data: {
    //           to:
    //             "/account/confirm-email/N-YFW3Re_dthvgJXfAZ7dqOA704jb9z_yJqHg1_n_YfYg9vacboGsA",
    //           from:
    //             "/account/confirm-email/N-YFW3Re_dthvgJXfAZ7dqOA704jb9z_yJqHg1_n_YfYg9vacboGsA"
    //         },
    //         message: null,
    //         type: "default"
    //       },
    //       {
    //         category: "navigation",
    //         level: "info",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.523000Z",
    //         data: {
    //           to: "/account/login",
    //           from:
    //             "/account/confirm-email/N-YFW3Re_dthvgJXfAZ7dqOA704jb9z_yJqHg1_n_YfYg9vacboGsA"
    //         },
    //         message: null,
    //         type: "default"
    //       },
    //       {
    //         category: "console",
    //         level: "warning",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.542000Z",
    //         data: {
    //           logger: "console",
    //           extra: {
    //             arguments: [
    //               "Did not send error report because user did not opt in."
    //             ]
    //           }
    //         },
    //         message: "Did not send error report because user did not opt in.",
    //         type: "default"
    //       },
    //       {
    //         category: "console",
    //         level: "error",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.543000Z",
    //         data: {
    //           extra: {
    //             arguments: [
    //               {
    //                 message:
    //                   'Effect "t.VerifyEmail$" dispatched an invalid action: "To validate via confirmation code, please log in first."',
    //                 name: "Error",
    //                 stack:
    //                   'Error: Effect "t.VerifyEmail$" dispatched an invalid action: "To validate via confirmation code, please log in first."\n    at https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:509330\n    at o.project (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:509567)\n    at o._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:745454)\n    at o.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:498774)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20525)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at o._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:745552)\n    at o.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at a._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:551469)\n    at a.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at l._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:38100)\n    at l.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:498774)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:471548\n    at a.invoke (https://app.passit.io/polyfills.5f194581390fcad97fb1.js:1:6415)\n    at Object.onInvoke (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:241432)\n    at a.invoke (https://app.passit.io/polyfills.5f194581390fcad97fb1.js:1:6355)\n    at s.run (https://app.passit.io/pol...'
    //               }
    //             ]
    //           }
    //         },
    //         message:
    //           'Error: Effect "t.VerifyEmail$" dispatched an invalid action: "To validate via confirmation code, please log in first."',
    //         type: "default"
    //       },
    //       {
    //         category: "xhr",
    //         level: "info",
    //         event_id: null,
    //         timestamp: "2020-01-14T00:19:53.565000Z",
    //         data: {
    //           url: "https://app.passit.io/assets/svg/check.svg",
    //           status_code: 200,
    //           method: "GET"
    //         },
    //         message: null,
    //         type: "http"
    //       }
    //     ]
    //   }
    // },
    // {
    //   type: "request",
    //   data: {
    //     fragment: null,
    //     cookies: [],
    //     inferredContentType: null,
    //     env: null,
    //     headers: [
    //       [
    //         "User-Agent",
    //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
    //       ]
    //     ],
    //     url: "https://app.passit.io/account/login",
    //     query: [],
    //     data: null,
    //     method: null
    //   }
    // }
  ],
  packages: {},
  sdk: { version: "5.7.1", name: "sentry.javascript.browser" },
  _meta: {
    user: null,
    context: null,
    entries: {
      "1": {
        data: {
          values: {
            "0": {
              message: {
                "": {
                  chunks: [
                    {
                      text: "[Filtered]",
                      remark: "s",
                      type: "redaction",
                      rule_id: "@password:filter"
                    }
                  ],
                  len: 69,
                  rem: [["@password:filter", "s", 0, 10]]
                }
              }
            },
            "5": {
              data: {
                "": { len: 2 },
                extra: {
                  arguments: {
                    "0": {
                      stack: {
                        "": {
                          chunks: [
                            {
                              text:
                                'Error: Effect "t.VerifyEmail$" dispatched an invalid action: "To validate via confirmation code, please log in first."\n    at https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:509330\n    at o.project (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:509567)\n    at o._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:745454)\n    at o.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:498774)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20525)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at o._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:745552)\n    at o.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at a._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:551469)\n    at a.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at l._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:38100)\n    at l.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at u.notifyNext (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:498774)\n    at i._next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:20917)\n    at i.next (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:37874)\n    at https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:471548\n    at a.invoke (https://app.passit.io/polyfills.5f194581390fcad97fb1.js:1:6415)\n    at Object.onInvoke (https://app.passit.io/main.0aa02efa52a79a1f9c59.js:1:241432)\n    at a.invoke (https://app.passit.io/polyfills.5f194581390fcad97fb1.js:1:6355)\n    at s.run (https://app.passit.io/pol',
                              type: "text"
                            },
                            {
                              text: "...",
                              remark: "s",
                              type: "redaction",
                              rule_id: "!limit"
                            }
                          ],
                          len: 2709,
                          rem: [["!limit", "s", 1923, 1926]]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    contexts: null,
    message: null,
    packages: null,
    tags: {},
    sdk: null
  },
  contexts: {
    os: { version: "10", type: "os", name: "Windows" },
    browser: { version: "79.0.3945", type: "browser", name: "Chrome" }
  },
  fingerprints: ["7f00d063dcd902623557a6a4357d04ad"],
  context: { arguments: [] },
  release: {
    dateReleased: null,
    commitCount: 0,
    url: null,
    data: {},
    lastDeploy: null,
    deployCount: 0,
    dateCreated: "2019-11-20T20:52:46.688000Z",
    lastEvent: "2020-01-14T00:19:54Z",
    version: "1.13.3",
    firstEvent: "2019-12-20T18:57:49Z",
    lastCommit: null,
    shortVersion: "1.13.3",
    authors: [],
    owner: null,
    newGroups: 10,
    ref: null,
    projects: [{ slug: "passit", name: "passit" }]
  },
  groupID: "1442468897"
};
