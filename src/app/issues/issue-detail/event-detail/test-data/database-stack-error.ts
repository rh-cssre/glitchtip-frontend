import { EventDetail } from "../../../interfaces";

/*tslint:disable */
export const databaseStackError: EventDetail = {
  eventID: "96152e3aebb94c54803a35a4ffa513a2",
  dist: null,
  userReport: null,
  projectID: "2",
  previousEventID: null,
  message:
    "get User.DoesNotExist User matching query does not exist. django/db/models/query.py /database-stack-error/",
  id: "5",
  size: 12720,
  errors: [],
  culprit: "/database-stack-error/",
  title: "User.DoesNotExist: User matching query does not exist.",
  platform: "python",
  location: "django/db/models/query.py",
  nextEventID: null,
  type: "error",
  metadata: {
    function: "get",
    type: "User.DoesNotExist",
    value: "User matching query does not exist.",
    filename: "django/db/models/query.py"
  },
  groupingConfig: { id: "legacy:2019-03-12" },
  crashFile: null,
  tags: [
    { value: "Firefox 72.0", key: "browser", _meta: null },
    { value: "Firefox", key: "browser.name", _meta: null },
    { value: "no", key: "handled", _meta: null },
    { value: "error", key: "level", _meta: null },
    { value: "django", key: "mechanism", _meta: null },
    { value: "Linux", key: "os.name", _meta: null },
    { value: "CPython 3.8.0", key: "runtime", _meta: null },
    { value: "CPython", key: "runtime.name", _meta: null },
    { value: "ab3aadbbc567", key: "server_name", _meta: null },
    { value: "/database-stack-error/", key: "transaction", _meta: null },
    {
      value: "http://localhost:8001/database-stack-error/",
      key: "url",
      _meta: null
    }
  ],
  dateCreated: "2020-01-27T19:17:51.356Z",
  dateReceived: "2020-01-27T19:17:51.592Z",
  user: null,
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  function: "inner",
                  colNo: null,
                  vars: {
                    get_response:
                      "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f500f0a8580>>",
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    exc: "DoesNotExist('User matching query does not exist.')"
                  },
                  symbol: null,
                  module: "django.core.handlers.exception",
                  lineNo: 34,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/exception.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/core/handlers/exception.py",
                  platform: null,
                  context: [
                    [
                      29,
                      "    can rely on getting a response instead of an exception."
                    ],
                    [30, '    """'],
                    [31, "    @wraps(get_response)"],
                    [32, "    def inner(request):"],
                    [33, "        try:"],
                    [34, "            response = get_response(request)"],
                    [35, "        except Exception as exc:"],
                    [
                      36,
                      "            response = response_for_exception(request, exc)"
                    ],
                    [37, "        return response"],
                    [38, "    return inner"],
                    [39, ""]
                  ],
                  symbolAddr: null
                },
                {
                  function: "_get_response",
                  colNo: null,
                  vars: {
                    resolver_match:
                      "ResolverMatch(func=errors.views.DatabaseStackErrorView, args=(), kwargs={}, url_name=database_stack_error, app_names=[], namespaces=[], route=database-stack-error/)",
                    callback_args: [],
                    middleware_method:
                      "<function CsrfViewMiddleware.process_view at 0x7f500e257a60>",
                    self:
                      "<django.core.handlers.wsgi.WSGIHandler object at 0x7f500f0a8580>",
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    callback:
                      "<function DatabaseStackErrorView at 0x7f500ebcef70>",
                    wrapped_callback:
                      "<function DatabaseStackErrorView at 0x7f500ebcef70>",
                    resolver:
                      "<URLResolver 'django_error_factory.urls' (None:None) '^/'>",
                    callback_kwargs: {},
                    response: "None"
                  },
                  symbol: null,
                  module: "django.core.handlers.base",
                  lineNo: 115,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/base.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/core/handlers/base.py",
                  platform: null,
                  context: [
                    [110, "        if response is None:"],
                    [
                      111,
                      "            wrapped_callback = self.make_view_atomic(callback)"
                    ],
                    [112, "            try:"],
                    [
                      113,
                      "                response = wrapped_callback(request, *callback_args, **callback_kwargs)"
                    ],
                    [114, "            except Exception as e:"],
                    [
                      115,
                      "                response = self.process_exception_by_middleware(e, request)"
                    ],
                    [116, ""],
                    [
                      117,
                      "        # Complain if the view returned None (a common error)."
                    ],
                    [118, "        if response is None:"],
                    [
                      119,
                      "            if isinstance(callback, types.FunctionType):    # FBV"
                    ],
                    [120, "                view_name = callback.__name__"]
                  ],
                  symbolAddr: null
                },
                {
                  function: "_get_response",
                  colNo: null,
                  vars: {
                    resolver_match:
                      "ResolverMatch(func=errors.views.DatabaseStackErrorView, args=(), kwargs={}, url_name=database_stack_error, app_names=[], namespaces=[], route=database-stack-error/)",
                    callback_args: [],
                    middleware_method:
                      "<function CsrfViewMiddleware.process_view at 0x7f500e257a60>",
                    self:
                      "<django.core.handlers.wsgi.WSGIHandler object at 0x7f500f0a8580>",
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    callback:
                      "<function DatabaseStackErrorView at 0x7f500ebcef70>",
                    wrapped_callback:
                      "<function DatabaseStackErrorView at 0x7f500ebcef70>",
                    resolver:
                      "<URLResolver 'django_error_factory.urls' (None:None) '^/'>",
                    callback_kwargs: {},
                    response: "None"
                  },
                  symbol: null,
                  module: "django.core.handlers.base",
                  lineNo: 113,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/base.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/core/handlers/base.py",
                  platform: null,
                  context: [
                    [108, "                break"],
                    [109, ""],
                    [110, "        if response is None:"],
                    [
                      111,
                      "            wrapped_callback = self.make_view_atomic(callback)"
                    ],
                    [112, "            try:"],
                    [
                      113,
                      "                response = wrapped_callback(request, *callback_args, **callback_kwargs)"
                    ],
                    [114, "            except Exception as e:"],
                    [
                      115,
                      "                response = self.process_exception_by_middleware(e, request)"
                    ],
                    [116, ""],
                    [
                      117,
                      "        # Complain if the view returned None (a common error)."
                    ],
                    [118, "        if response is None:"]
                  ],
                  symbolAddr: null
                },
                {
                  function: "view",
                  colNo: null,
                  vars: {
                    initkwargs: {},
                    self:
                      "<errors.views.DatabaseStackErrorView object at 0x7f500e14ff70>",
                    args: [],
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    kwargs: {},
                    cls: "<class 'errors.views.DatabaseStackErrorView'>"
                  },
                  symbol: null,
                  module: "django.views.generic.base",
                  lineNo: 71,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/views/generic/base.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/views/generic/base.py",
                  platform: null,
                  context: [
                    [66, "            if not hasattr(self, 'request'):"],
                    [67, "                raise AttributeError("],
                    [
                      68,
                      "                    \"%s instance has no 'request' attribute. Did you override \""
                    ],
                    [
                      69,
                      '                    "setup() and forget to call super()?" % cls.__name__'
                    ],
                    [70, "                )"],
                    [
                      71,
                      "            return self.dispatch(request, *args, **kwargs)"
                    ],
                    [72, "        view.view_class = cls"],
                    [73, "        view.view_initkwargs = initkwargs"],
                    [74, ""],
                    [75, "        # take name and docstring from class"],
                    [76, "        update_wrapper(view, cls, updated=())"]
                  ],
                  symbolAddr: null
                },
                {
                  function: "dispatch",
                  colNo: null,
                  vars: {
                    self:
                      "<errors.views.DatabaseStackErrorView object at 0x7f500e14ff70>",
                    handler:
                      "<bound method DatabaseStackErrorView.get of <errors.views.DatabaseStackErrorView object at 0x7f500e14ff70>>",
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    args: [],
                    kwargs: {}
                  },
                  symbol: null,
                  module: "django.views.generic.base",
                  lineNo: 97,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/views/generic/base.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/views/generic/base.py",
                  platform: null,
                  context: [
                    [
                      92,
                      "        # request method isn't on the approved list."
                    ],
                    [
                      93,
                      "        if request.method.lower() in self.http_method_names:"
                    ],
                    [
                      94,
                      "            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)"
                    ],
                    [95, "        else:"],
                    [96, "            handler = self.http_method_not_allowed"],
                    [97, "        return handler(request, *args, **kwargs)"],
                    [98, ""],
                    [
                      99,
                      "    def http_method_not_allowed(self, request, *args, **kwargs):"
                    ],
                    [100, "        logger.warning("],
                    [
                      101,
                      "            'Method Not Allowed (%s): %s', request.method, request.path,"
                    ],
                    [
                      102,
                      "            extra={'status_code': 405, 'request': request}"
                    ]
                  ],
                  symbolAddr: null
                },
                {
                  function: "get",
                  colNo: null,
                  vars: {
                    self:
                      "<errors.views.DatabaseStackErrorView object at 0x7f500e14ff70>",
                    args: [],
                    request: "<WSGIRequest: GET '/database-stack-error/'>",
                    users:
                      "<QuerySet from django.db.models.query at 0x7f500e1660a0>",
                    kwargs: {}
                  },
                  symbol: null,
                  module: "errors.views",
                  lineNo: 28,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "/code/errors/views.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "errors/views.py",
                  platform: null,
                  context: [
                    [23, ""],
                    [24, ""],
                    [25, "class DatabaseStackErrorView(View):"],
                    [26, "    def get(self, request, *args, **kwargs):"],
                    [27, "        users = User.objects.all()"],
                    [28, "        self.make_error(users)"],
                    [29, ""],
                    [30, "    def make_error(self, users):"],
                    [31, "        User.objects.get(id=users.count() + 10000)"],
                    [32, ""],
                    [33, ""]
                  ],
                  symbolAddr: null
                },
                {
                  function: "make_error",
                  colNo: null,
                  vars: {
                    self:
                      "<errors.views.DatabaseStackErrorView object at 0x7f500e14ff70>",
                    users:
                      "<QuerySet from django.db.models.query at 0x7f500e1660a0>"
                  },
                  symbol: null,
                  module: "errors.views",
                  lineNo: 31,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "/code/errors/views.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "errors/views.py",
                  platform: null,
                  context: [
                    [26, "    def get(self, request, *args, **kwargs):"],
                    [27, "        users = User.objects.all()"],
                    [28, "        self.make_error(users)"],
                    [29, ""],
                    [30, "    def make_error(self, users):"],
                    [31, "        User.objects.get(id=users.count() + 10000)"],
                    [32, ""],
                    [33, ""],
                    [34, "class TemplateErrorView(TemplateView):"],
                    [35, '    template_name = "template_error.html"'],
                    [36, ""]
                  ],
                  symbolAddr: null
                },
                {
                  function: "manager_method",
                  colNo: null,
                  vars: {
                    self: "[Filtered]",
                    args: [],
                    name: "'get'",
                    kwargs: { id: "10000" }
                  },
                  symbol: null,
                  module: "django.db.models.manager",
                  lineNo: 82,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/db/models/manager.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/db/models/manager.py",
                  platform: null,
                  context: [
                    [77, ""],
                    [78, "    @classmethod"],
                    [79, "    def _get_queryset_methods(cls, queryset_class):"],
                    [80, "        def create_method(name, method):"],
                    [
                      81,
                      "            def manager_method(self, *args, **kwargs):"
                    ],
                    [
                      82,
                      "                return getattr(self.get_queryset(), name)(*args, **kwargs)"
                    ],
                    [
                      83,
                      "            manager_method.__name__ = method.__name__"
                    ],
                    [84, "            manager_method.__doc__ = method.__doc__"],
                    [85, "            return manager_method"],
                    [86, ""],
                    [87, "        new_methods = {}"]
                  ],
                  symbolAddr: null
                },
                {
                  function: "get",
                  colNo: null,
                  vars: {
                    clone:
                      "<QuerySet from django.db.models.query at 0x7f500e156a90>",
                    args: [],
                    num: "0",
                    limit: "21",
                    kwargs: { id: "10000" },
                    self:
                      "<QuerySet from django.db.models.query at 0x7f500e166400>"
                  },
                  symbol: null,
                  module: "django.db.models.query",
                  lineNo: 415,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/db/models/query.py",
                  inApp: false,
                  instructionAddr: null,
                  filename: "django/db/models/query.py",
                  platform: null,
                  context: [
                    [410, "            clone.query.set_limits(high=limit)"],
                    [411, "        num = len(clone)"],
                    [412, "        if num == 1:"],
                    [413, "            return clone._result_cache[0]"],
                    [414, "        if not num:"],
                    [415, "            raise self.model.DoesNotExist("],
                    [
                      416,
                      '                "%s matching query does not exist." %'
                    ],
                    [417, "                self.model._meta.object_name"],
                    [418, "            )"],
                    [419, "        raise self.model.MultipleObjectsReturned("],
                    [
                      420,
                      "            'get() returned more than one %s -- it returned %s!' % ("
                    ]
                  ],
                  symbolAddr: null
                }
              ],
              framesOmitted: null,
              registers: null,
              hasSystemFrames: false
            },
            module: "django.contrib.auth.models",
            rawStacktrace: null,
            mechanism: { type: "django", handled: false },
            threadId: null,
            value: "User matching query does not exist.",
            type: "User.DoesNotExist"
          }
        ],
        excOmitted: null,
        hasSystemFrames: false
      }
    },
    {
      type: "breadcrumbs",
      data: {
        values: [
          {
            category: "query",
            level: "info",
            event_id: null,
            timestamp: "2020-01-27T19:17:51.349Z",
            data: null,
            message: "[Filtered]",
            type: "default"
          },
          {
            category: "query",
            level: "info",
            event_id: null,
            timestamp: "2020-01-27T19:17:51.352Z",
            data: null,
            message: "[Filtered]",
            type: "default"
          }
        ]
      }
    },
    {
      type: "request",
      data: {
        fragment: "",
        cookies: [],
        inferredContentType: "text/plain",
        env: { SERVER_NAME: "ab3aadbbc567", SERVER_PORT: "8001" },
        headers: [
          [
            "Accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
          ],
          ["Accept-Encoding", "gzip, deflate"],
          ["Accept-Language", "en-US,en;q=0.5"],
          ["Connection", "keep-alive"],
          ["Content-Length", ""],
          ["Content-Type", "text/plain"],
          ["Host", "localhost:8001"],
          ["Referer", "http://localhost:8001/"],
          ["Upgrade-Insecure-Requests", "1"],
          [
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0"
          ]
        ],
        url: "http://localhost:8001/database-stack-error/",
        query: [],
        data: null,
        method: "GET"
      }
    }
  ],
  packages: {
    cffi: "1.13.2",
    "ipython-genutils": "0.2.0",
    pygments: "2.5.2",
    cleo: "0.7.6",
    pip: "19.3.1",
    "prompt-toolkit": "3.0.2",
    parso: "0.5.2",
    jeepney: "0.4.2",
    click: "7.0",
    appdirs: "1.4.3",
    "requests-toolbelt": "0.8.0",
    regex: "2020.1.8",
    pastel: "0.1.1",
    msgpack: "0.6.2",
    pexpect: "4.8.0",
    "sentry-sdk": "0.14.0",
    ipdb: "0.12.3",
    six: "1.14.0",
    poetry: "1.0.0",
    ptyprocess: "0.6.0",
    html5lib: "1.0.1",
    jedi: "0.15.2",
    traitlets: "4.3.3",
    asgiref: "3.2.3",
    cachy: "0.3.0",
    pathspec: "0.7.0",
    cachecontrol: "0.12.6",
    certifi: "2019.11.28",
    chardet: "3.0.4",
    wheel: "0.33.6",
    backcall: "0.1.0",
    cryptography: "2.8",
    sqlparse: "0.3.0",
    pycparser: "2.19",
    secretstorage: "3.1.2",
    urllib3: "1.25.7",
    webencodings: "0.5.1",
    pytz: "2019.3",
    clikit: "0.4.1",
    ipython: "7.11.1",
    lockfile: "0.12.2",
    pickleshare: "0.7.5",
    decorator: "4.4.1",
    tomlkit: "0.5.8",
    jsonschema: "3.2.0",
    "typed-ast": "1.4.1",
    keyring: "19.3.0",
    wcwidth: "0.1.8",
    django: "3.0.2",
    pyrsistent: "0.14.11",
    pyparsing: "2.4.6",
    pylev: "1.3.0",
    toml: "0.10.0",
    setuptools: "41.6.0",
    pkginfo: "1.5.0.1",
    black: "19.10b0",
    requests: "2.22.0",
    shellingham: "1.3.1",
    idna: "2.8",
    attrs: "19.3.0"
  },
  sdk: {
    version: "0.14.0",
    name: "sentry.python",
    upstream: { url: null, isNewer: false, name: "sentry.python" }
  },
  _meta: {
    user: null,
    context: null,
    entries: {},
    contexts: null,
    message: null,
    packages: null,
    tags: {},
    sdk: null
  },
  contexts: {
    runtime: {
      version: "3.8.0",
      type: "runtime",
      build: "3.8.0 (default, Nov 23 2019, 05:49:00) \n[GCC 8.3.0]",
      name: "CPython"
    },
    os: { type: "os", name: "Linux" },
    trace: {
      description:
        "django.middleware.clickjacking.XFrameOptionsMiddleware.__call__",
      parent_span_id: "8389073c493a6c42",
      trace_id: "6be83775186f443e8a98307ea2aad108",
      span_id: "b058a47b707ea888",
      type: "default",
      op: "django.middleware"
    },
    browser: { version: "72.0", type: "browser", name: "Firefox" }
  },
  fingerprints: ["4ddcc5b498f08c9d703a5816c7c76ecd"],
  context: { "sys.argv": ["./manage.py", "runserver", "0.0.0.0:8001"] },
  release: null,
  groupID: "5"
};