// import { EventDetail } from "../../../interfaces";

/*tslint:disable */
export const socialApp = {
  eventID: "8f3cfd79bbf44390abda117725c96e57",
  id: "8f3cfd79bbf44390abda117725c96e57",
  issue: 32,
  contexts: {
    trace: {
      op: "django.middleware",
      span_id: "b8cbb053b30fb09b",
      trace_id: "f9e158b9a93644f1aa5eecb7bd02bd95",
      description:
        "glitchtip.middleware.proxy.DecompressBodyMiddleware.__call__",
      parent_span_id: "93b86622ccd9cb61",
    },
    runtime: {
      name: "CPython",
      build: "3.8.2 (default, Feb 26 2020, 15:09:34) \n[GCC 8.3.0]",
      version: "3.8.2",
    },
  },
  culprit: "/rest-auth/gitlab/",
  dateCreated: "2020-03-23T11:18:36.817518Z",
  dateReceived: "2020-03-23T11:18:36.895859Z",
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            type: "SocialApp.DoesNotExist",
            value: "SocialApp matching query does not exist.",
            module: "allauth.socialaccount.models",
            mechanism: {
              type: "django",
              handled: false,
            },
            stacktrace: {
              frames: [
                {
                  vars: {
                    exc: "DoesNotExist('SocialApp matching query does not exist.')",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    get_response:
                      "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f233073c9d0>>",
                  },
                  in_app: true,
                  module: "django.core.handlers.exception",
                  filename: "django/core/handlers/exception.py",
                  function: "inner",
                  context_line: "            response = get_response(request)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/exception.py",
                  lineNo: 34,
                  context: [
                    [
                      29,
                      "    can rely on getting a response instead of an exception.",
                    ],
                    [30, '    """'],
                    [31, "    @wraps(get_response)"],
                    [32, "    def inner(request):"],
                    [33, "        try:"],
                    [34, "            response = get_response(request)"],
                    [35, "        except Exception as exc:"],
                    [
                      36,
                      "            response = response_for_exception(request, exc)",
                    ],
                    [37, "        return response"],
                    [38, "    return inner"],
                    [39, ""],
                  ],
                },
                {
                  vars: {
                    self: "<django.core.handlers.wsgi.WSGIHandler object at 0x7f233073c9d0>",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    callback: "<function GitlabLogin at 0x7f232ff24940>",
                    resolver: "<URLResolver 'glitchtip.urls' (None:None) '^/'>",
                    response: "None",
                    callback_args: [],
                    resolver_match:
                      "ResolverMatch(func=glitchtip.social.GitlabLogin, args=(), kwargs={}, url_name=gitlab_login, app_names=[], namespaces=[], route=rest-auth/gitlab/)",
                    callback_kwargs: {},
                    wrapped_callback:
                      "<function GitlabLogin at 0x7f232ff24940>",
                    middleware_method:
                      "<function CsrfViewMiddleware.process_view at 0x7f23306bc5e0>",
                  },
                  in_app: true,
                  module: "django.core.handlers.base",
                  filename: "django/core/handlers/base.py",
                  function: "_get_response",
                  context_line:
                    "                response = self.process_exception_by_middleware(e, request)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/base.py",
                  lineNo: 115,
                  context: [
                    [110, "        if response is None:"],
                    [
                      111,
                      "            wrapped_callback = self.make_view_atomic(callback)",
                    ],
                    [112, "            try:"],
                    [
                      113,
                      "                response = wrapped_callback(request, *callback_args, **callback_kwargs)",
                    ],
                    [114, "            except Exception as e:"],
                    [
                      115,
                      "                response = self.process_exception_by_middleware(e, request)",
                    ],
                    [116, ""],
                    [
                      117,
                      "        # Complain if the view returned None (a common error).",
                    ],
                    [118, "        if response is None:"],
                    [
                      119,
                      "            if isinstance(callback, types.FunctionType):    # FBV",
                    ],
                    [120, "                view_name = callback.__name__"],
                  ],
                },
                {
                  vars: {
                    self: "<django.core.handlers.wsgi.WSGIHandler object at 0x7f233073c9d0>",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    callback: "<function GitlabLogin at 0x7f232ff24940>",
                    resolver: "<URLResolver 'glitchtip.urls' (None:None) '^/'>",
                    response: "None",
                    callback_args: [],
                    resolver_match:
                      "ResolverMatch(func=glitchtip.social.GitlabLogin, args=(), kwargs={}, url_name=gitlab_login, app_names=[], namespaces=[], route=rest-auth/gitlab/)",
                    callback_kwargs: {},
                    wrapped_callback:
                      "<function GitlabLogin at 0x7f232ff24940>",
                    middleware_method:
                      "<function CsrfViewMiddleware.process_view at 0x7f23306bc5e0>",
                  },
                  in_app: true,
                  module: "django.core.handlers.base",
                  filename: "django/core/handlers/base.py",
                  function: "_get_response",
                  context_line:
                    "                response = wrapped_callback(request, *callback_args, **callback_kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/core/handlers/base.py",
                  lineNo: 113,
                  context: [
                    [108, "                break"],
                    [109, ""],
                    [110, "        if response is None:"],
                    [
                      111,
                      "            wrapped_callback = self.make_view_atomic(callback)",
                    ],
                    [112, "            try:"],
                    [
                      113,
                      "                response = wrapped_callback(request, *callback_args, **callback_kwargs)",
                    ],
                    [114, "            except Exception as e:"],
                    [
                      115,
                      "                response = self.process_exception_by_middleware(e, request)",
                    ],
                    [116, ""],
                    [
                      117,
                      "        # Complain if the view returned None (a common error).",
                    ],
                    [118, "        if response is None:"],
                  ],
                },
                {
                  vars: {
                    args: ["<WSGIRequest: POST '/rest-auth/gitlab/'>"],
                    kwargs: {},
                    view_func: "<function GitlabLogin at 0x7f232ff1ca60>",
                  },
                  in_app: true,
                  module: "django.views.decorators.csrf",
                  filename: "django/views/decorators/csrf.py",
                  function: "wrapped_view",
                  context_line: "        return view_func(*args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/views/decorators/csrf.py",
                  lineNo: 54,
                  context: [
                    [49, "def csrf_exempt(view_func):"],
                    [
                      50,
                      '    """Mark a view function as being exempt from the CSRF view protection."""',
                    ],
                    [
                      51,
                      "    # view_func.csrf_exempt = True would also work, but decorators are nicer",
                    ],
                    [
                      52,
                      "    # if they don't have side effects, so return a new function.",
                    ],
                    [53, "    def wrapped_view(*args, **kwargs):"],
                    [54, "        return view_func(*args, **kwargs)"],
                    [55, "    wrapped_view.csrf_exempt = True"],
                    [56, "    return wraps(view_func)(wrapped_view)"],
                  ],
                },
                {
                  vars: {
                    cls: "<class 'glitchtip.social.GitlabLogin'>",
                    args: [],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    initkwargs: {},
                  },
                  in_app: true,
                  module: "django.views.generic.base",
                  filename: "django/views/generic/base.py",
                  function: "view",
                  context_line:
                    "            return self.dispatch(request, *args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/views/generic/base.py",
                  lineNo: 71,
                  context: [
                    [66, "            if not hasattr(self, 'request'):"],
                    [67, "                raise AttributeError("],
                    [
                      68,
                      "                    \"%s instance has no 'request' attribute. Did you override \"",
                    ],
                    [
                      69,
                      '                    "setup() and forget to call super()?" % cls.__name__',
                    ],
                    [70, "                )"],
                    [
                      71,
                      "            return self.dispatch(request, *args, **kwargs)",
                    ],
                    [72, "        view.view_class = cls"],
                    [73, "        view.view_initkwargs = initkwargs"],
                    [74, ""],
                    [75, "        # take name and docstring from class"],
                    [76, "        update_wrapper(view, cls, updated=())"],
                  ],
                },
                {
                  vars: {
                    dec: "<function sensitive_post_parameters.<locals>.decorator at 0x7f232ffb19d0>",
                    args: ["<WSGIRequest: POST '/rest-auth/gitlab/'>"],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    method: "<function LoginView.dispatch at 0x7f232ffb1d30>",
                    decorators: [
                      "<function sensitive_post_parameters.<locals>.decorator at 0x7f232ffb19d0>",
                    ],
                    bound_method:
                      "<function sensitive_post_parameters.<locals>.decorator.<locals>.sensitive_post_parameters_wrapper at 0x7f233371c550>",
                  },
                  in_app: true,
                  module: "django.utils.decorators",
                  filename: "django/utils/decorators.py",
                  function: "_wrapper",
                  context_line: "        return bound_method(*args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/utils/decorators.py",
                  lineNo: 43,
                  context: [
                    [
                      38,
                      "        # 'func'. Also, wrap method.__get__() in a function because new",
                    ],
                    [
                      39,
                      "        # attributes can't be set on bound method objects, only on functions.",
                    ],
                    [
                      40,
                      "        bound_method = partial(method.__get__(self, type(self)))",
                    ],
                    [41, "        for dec in decorators:"],
                    [42, "            bound_method = dec(bound_method)"],
                    [43, "        return bound_method(*args, **kwargs)"],
                    [44, ""],
                    [
                      45,
                      "    # Copy any attributes that a decorator adds to the function it decorates.",
                    ],
                    [46, "    for dec in decorators:"],
                    [47, "        _update_method_wrapper(_wrapper, dec)"],
                    [
                      48,
                      "    # Preserve any existing attributes of 'method', including the name.",
                    ],
                  ],
                },
                {
                  vars: {
                    args: [],
                    view: "functools.partial(<bound method LoginView.dispatch of <glitchtip.social.GitlabLogin object at 0x7f232fe5c100>>)",
                    kwargs: {},
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    parameters: [
                      "'password'",
                      "'old_password'",
                      "'new_password1'",
                      "'new_password2'",
                    ],
                  },
                  in_app: true,
                  module: "django.views.decorators.debug",
                  filename: "django/views/decorators/debug.py",
                  function: "sensitive_post_parameters_wrapper",
                  context_line:
                    "            return view(request, *args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/views/decorators/debug.py",
                  lineNo: 76,
                  context: [
                    [71, "            )"],
                    [72, "            if parameters:"],
                    [
                      73,
                      "                request.sensitive_post_parameters = parameters",
                    ],
                    [74, "            else:"],
                    [
                      75,
                      "                request.sensitive_post_parameters = '__ALL__'",
                    ],
                    [76, "            return view(request, *args, **kwargs)"],
                    [77, "        return sensitive_post_parameters_wrapper"],
                    [78, "    return decorator"],
                  ],
                },
                {
                  vars: {
                    args: ["<WSGIRequest: POST '/rest-auth/gitlab/'>"],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    __class__: "<class 'rest_auth.views.LoginView'>",
                  },
                  in_app: true,
                  module: "rest_auth.views",
                  filename: "rest_auth/views.py",
                  function: "dispatch",
                  context_line:
                    "        return super(LoginView, self).dispatch(*args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_auth/views.py",
                  lineNo: 49,
                  context: [
                    [44, "    serializer_class = LoginSerializer"],
                    [45, "    token_model = TokenModel"],
                    [46, ""],
                    [47, "    @sensitive_post_parameters_m"],
                    [48, "    def dispatch(self, *args, **kwargs):"],
                    [
                      49,
                      "        return super(LoginView, self).dispatch(*args, **kwargs)",
                    ],
                    [50, ""],
                    [51, "    def process_login(self):"],
                    [52, "        django_login(self.request, self.user)"],
                    [53, ""],
                    [54, "    def get_response_serializer(self):"],
                  ],
                },
                {
                  vars: {
                    args: [],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    handler:
                      "<bound method LoginView.post of <glitchtip.social.GitlabLogin object at 0x7f232fe5c100>>",
                    request:
                      "<rest_framework.request.Request object at 0x7f232fe5c490>",
                  },
                  in_app: true,
                  module: "rest_framework.views",
                  filename: "rest_framework/views.py",
                  function: "dispatch",
                  context_line:
                    "            response = self.handle_exception(exc)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/views.py",
                  lineNo: 505,
                  context: [
                    [
                      500,
                      "                handler = self.http_method_not_allowed",
                    ],
                    [501, ""],
                    [
                      502,
                      "            response = handler(request, *args, **kwargs)",
                    ],
                    [503, ""],
                    [504, "        except Exception as exc:"],
                    [505, "            response = self.handle_exception(exc)"],
                    [506, ""],
                    [
                      507,
                      "        self.response = self.finalize_response(request, response, *args, **kwargs)",
                    ],
                    [508, "        return self.response"],
                    [509, ""],
                    [510, "    def options(self, request, *args, **kwargs):"],
                  ],
                },
                {
                  vars: {
                    exc: "DoesNotExist('SocialApp matching query does not exist.')",
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    context: {
                      args: [],
                      view: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                      kwargs: {},
                      request:
                        "<rest_framework.request.Request object at 0x7f232fe5c490>",
                    },
                    response: "None",
                    exception_handler:
                      "<function exception_handler at 0x7f233005b550>",
                  },
                  in_app: true,
                  module: "rest_framework.views",
                  filename: "rest_framework/views.py",
                  function: "handle_exception",
                  context_line:
                    "            self.raise_uncaught_exception(exc)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/views.py",
                  lineNo: 465,
                  context: [
                    [460, ""],
                    [
                      461,
                      "        context = self.get_exception_handler_context()",
                    ],
                    [462, "        response = exception_handler(exc, context)"],
                    [463, ""],
                    [464, "        if response is None:"],
                    [465, "            self.raise_uncaught_exception(exc)"],
                    [466, ""],
                    [467, "        response.exception = True"],
                    [468, "        return response"],
                    [469, ""],
                    [470, "    def raise_uncaught_exception(self, exc):"],
                  ],
                },
                {
                  vars: {
                    exc: "DoesNotExist('SocialApp matching query does not exist.')",
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                  },
                  in_app: true,
                  module: "rest_framework.views",
                  filename: "rest_framework/views.py",
                  function: "raise_uncaught_exception",
                  context_line: "        raise exc",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/views.py",
                  lineNo: 476,
                  context: [
                    [471, "        if settings.DEBUG:"],
                    [472, "            request = self.request"],
                    [
                      473,
                      "            renderer_format = getattr(request.accepted_renderer, 'format')",
                    ],
                    [
                      474,
                      "            use_plaintext_traceback = renderer_format not in ('html', 'api', 'admin')",
                    ],
                    [
                      475,
                      "            request.force_plaintext_errors(use_plaintext_traceback)",
                    ],
                    [476, "        raise exc"],
                    [477, ""],
                    [
                      478,
                      "    # Note: Views are made CSRF exempt from within `as_view` as to prevent",
                    ],
                    [
                      479,
                      "    # accidental removal of this exemption in cases where `dispatch` needs to",
                    ],
                    [480, "    # be overridden."],
                    [481, "    def dispatch(self, request, *args, **kwargs):"],
                  ],
                },
                {
                  vars: {
                    args: [],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    handler:
                      "<bound method LoginView.post of <glitchtip.social.GitlabLogin object at 0x7f232fe5c100>>",
                    request:
                      "<rest_framework.request.Request object at 0x7f232fe5c490>",
                  },
                  in_app: true,
                  module: "rest_framework.views",
                  filename: "rest_framework/views.py",
                  function: "dispatch",
                  context_line:
                    "            response = handler(request, *args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/views.py",
                  lineNo: 502,
                  context: [
                    [
                      497,
                      "                handler = getattr(self, request.method.lower(),",
                    ],
                    [
                      498,
                      "                                  self.http_method_not_allowed)",
                    ],
                    [499, "            else:"],
                    [
                      500,
                      "                handler = self.http_method_not_allowed",
                    ],
                    [501, ""],
                    [
                      502,
                      "            response = handler(request, *args, **kwargs)",
                    ],
                    [503, ""],
                    [504, "        except Exception as exc:"],
                    [505, "            response = self.handle_exception(exc)"],
                    [506, ""],
                    [
                      507,
                      "        self.response = self.finalize_response(request, response, *args, **kwargs)",
                    ],
                  ],
                },
                {
                  vars: {
                    args: [],
                    self: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    kwargs: {},
                    request:
                      "<rest_framework.request.Request object at 0x7f232fe5c490>",
                  },
                  in_app: true,
                  module: "rest_auth.views",
                  filename: "rest_auth/views.py",
                  function: "post",
                  context_line:
                    "        self.serializer.is_valid(raise_exception=True)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_auth/views.py",
                  lineNo: 103,
                  context: [
                    [98, ""],
                    [99, "    def post(self, request, *args, **kwargs):"],
                    [100, "        self.request = request"],
                    [
                      101,
                      "        self.serializer = self.get_serializer(data=self.request.data,",
                    ],
                    [
                      102,
                      "                                              context={'request': request})",
                    ],
                    [
                      103,
                      "        self.serializer.is_valid(raise_exception=True)",
                    ],
                    [104, ""],
                    [105, "        self.login()"],
                    [106, "        return self.get_response()"],
                    [107, ""],
                    [108, ""],
                  ],
                },
                {
                  vars: {
                    self: "SocialLoginSerializer(context={'request': <rest_framework.request.Request object>, 'format': None, 'view': <glitchtip.social.GitlabLogin object>}, data={'access_token': '7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'}):\n    access_token = CharField(allow_blank=True, required=False)\n    code = CharField(allow_blank=True, required=False)",
                    raise_exception: "True",
                  },
                  in_app: true,
                  module: "rest_framework.serializers",
                  filename: "rest_framework/serializers.py",
                  function: "is_valid",
                  context_line:
                    "                self._validated_data = self.run_validation(self.initial_data)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/serializers.py",
                  lineNo: 234,
                  context: [
                    [
                      229,
                      "            'passed when instantiating the serializer instance.'",
                    ],
                    [230, "        )"],
                    [231, ""],
                    [232, "        if not hasattr(self, '_validated_data'):"],
                    [233, "            try:"],
                    [
                      234,
                      "                self._validated_data = self.run_validation(self.initial_data)",
                    ],
                    [235, "            except ValidationError as exc:"],
                    [236, "                self._validated_data = {}"],
                    [237, "                self._errors = exc.detail"],
                    [238, "            else:"],
                    [239, "                self._errors = {}"],
                  ],
                },
                {
                  vars: {
                    data: {
                      access_token:
                        "'7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'",
                    },
                    self: "SocialLoginSerializer(context={'request': <rest_framework.request.Request object>, 'format': None, 'view': <glitchtip.social.GitlabLogin object>}, data={'access_token': '7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'}):\n    access_token = CharField(allow_blank=True, required=False)\n    code = CharField(allow_blank=True, required=False)",
                    value: {
                      access_token:
                        "'7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'",
                    },
                    is_empty_value: "False",
                  },
                  in_app: true,
                  module: "rest_framework.serializers",
                  filename: "rest_framework/serializers.py",
                  function: "run_validation",
                  context_line: "            value = self.validate(value)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_framework/serializers.py",
                  lineNo: 436,
                  context: [
                    [431, "            return data"],
                    [432, ""],
                    [433, "        value = self.to_internal_value(data)"],
                    [434, "        try:"],
                    [435, "            self.run_validators(value)"],
                    [436, "            value = self.validate(value)"],
                    [
                      437,
                      "            assert value is not None, '.validate() should return the validated data'",
                    ],
                    [
                      438,
                      "        except (ValidationError, DjangoValidationError) as exc:",
                    ],
                    [
                      439,
                      "            raise ValidationError(detail=as_serializer_error(exc))",
                    ],
                    [440, ""],
                    [441, "        return value"],
                  ],
                },
                {
                  vars: {
                    self: "SocialLoginSerializer(context={'request': <rest_framework.request.Request object>, 'format': None, 'view': <glitchtip.social.GitlabLogin object>}, data={'access_token': '7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'}):\n    access_token = CharField(allow_blank=True, required=False)\n    code = CharField(allow_blank=True, required=False)",
                    view: "<glitchtip.social.GitlabLogin object at 0x7f232fe5c100>",
                    attrs: {
                      access_token:
                        "'7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007'",
                    },
                    adapter:
                      "<allauth.socialaccount.providers.gitlab.views.GitLabOAuth2Adapter object at 0x7f232fe5c6a0>",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    adapter_class:
                      "<class 'allauth.socialaccount.providers.gitlab.views.GitLabOAuth2Adapter'>",
                  },
                  in_app: true,
                  module: "rest_auth.registration.serializers",
                  filename: "rest_auth/registration/serializers.py",
                  function: "validate",
                  context_line:
                    "        app = adapter.get_provider().get_app(request)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/rest_auth/registration/serializers.py",
                  lineNo: 75,
                  context: [
                    [
                      70,
                      "        adapter_class = getattr(view, 'adapter_class', None)",
                    ],
                    [71, "        if not adapter_class:"],
                    [
                      72,
                      '            raise serializers.ValidationError(_("Define adapter_class in view"))',
                    ],
                    [73, ""],
                    [74, "        adapter = adapter_class(request)"],
                    [
                      75,
                      "        app = adapter.get_provider().get_app(request)",
                    ],
                    [76, ""],
                    [77, "        # More info on code vs access_token"],
                    [
                      78,
                      "        # http://stackoverflow.com/questions/8666316/facebook-oauth-2-0-code-and-token",
                    ],
                    [79, ""],
                    [80, "        # Case 1: We received the access_token"],
                  ],
                },
                {
                  vars: {
                    self: "<allauth.socialaccount.providers.gitlab.provider.GitLabProvider object at 0x7f232fe5c4f0>",
                    adapter:
                      "<allauth.socialaccount.adapter.DefaultSocialAccountAdapter object at 0x7f232fe5c760>",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                  },
                  in_app: true,
                  module: "allauth.socialaccount.providers.base",
                  filename: "allauth/socialaccount/providers/base.py",
                  function: "get_app",
                  context_line:
                    "        return adapter.get_app(request, self.id)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/allauth/socialaccount/providers/base.py",
                  lineNo: 49,
                  context: [
                    [44, '        """'],
                    [
                      45,
                      '        raise NotImplementedError("get_login_url() for " + self.name)',
                    ],
                    [46, ""],
                    [47, "    def get_app(self, request):"],
                    [48, "        adapter = get_adapter(request)"],
                    [49, "        return adapter.get_app(request, self.id)"],
                    [50, ""],
                    [51, "    def media_js(self, request):"],
                    [52, '        """'],
                    [
                      53,
                      "        Some providers may require extra scripts (e.g. a Facebook connect)",
                    ],
                    [54, '        """'],
                  ],
                },
                {
                  vars: {
                    self: "<allauth.socialaccount.adapter.DefaultSocialAccountAdapter object at 0x7f232fe5c760>",
                    config: "None",
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    provider: "'gitlab'",
                    SocialApp:
                      "<class 'allauth.socialaccount.models.SocialApp'>",
                  },
                  in_app: true,
                  module: "allauth.socialaccount.adapter",
                  filename: "allauth/socialaccount/adapter.py",
                  function: "get_app",
                  context_line:
                    "            app = SocialApp.objects.get_current(provider, request)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/allauth/socialaccount/adapter.py",
                  lineNo: 203,
                  context: [
                    [198, "        if config:"],
                    [199, "            app = SocialApp(provider=provider)"],
                    [
                      200,
                      "            for field in ['client_id', 'secret', 'key']:",
                    ],
                    [
                      201,
                      "                setattr(app, field, config.get(field))",
                    ],
                    [202, "        else:"],
                    [
                      203,
                      "            app = SocialApp.objects.get_current(provider, request)",
                    ],
                    [204, "        return app"],
                    [205, ""],
                    [206, ""],
                    [207, "def get_adapter(request=None):"],
                    [
                      208,
                      "    return import_attribute(app_settings.ADAPTER)(request)",
                    ],
                  ],
                },
                {
                  vars: {
                    app: "None",
                    self: "<allauth.socialaccount.models.SocialAppManager object at 0x7f2330858e80>",
                    site: "<Site: example.com>",
                    cache: {},
                    request: "<WSGIRequest: POST '/rest-auth/gitlab/'>",
                    provider: "'gitlab'",
                  },
                  in_app: true,
                  module: "allauth.socialaccount.models",
                  filename: "allauth/socialaccount/models.py",
                  function: "get_current",
                  context_line: "            app = self.get(",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/allauth/socialaccount/models.py",
                  lineNo: 32,
                  context: [
                    [
                      27,
                      "            cache = getattr(request, '_socialapp_cache', {})",
                    ],
                    [28, "            request._socialapp_cache = cache"],
                    [29, "        app = cache.get(provider)"],
                    [30, "        if not app:"],
                    [31, "            site = get_current_site(request)"],
                    [32, "            app = self.get("],
                    [33, "                sites__id=site.id,"],
                    [34, "                provider=provider)"],
                    [35, "            cache[provider] = app"],
                    [36, "        return app"],
                    [37, ""],
                  ],
                },
                {
                  vars: {
                    args: [],
                    name: "'get'",
                    self: "<allauth.socialaccount.models.SocialAppManager object at 0x7f2330858e80>",
                    kwargs: {
                      provider: "'gitlab'",
                      sites__id: "1",
                    },
                  },
                  in_app: true,
                  module: "django.db.models.manager",
                  filename: "django/db/models/manager.py",
                  function: "manager_method",
                  context_line:
                    "                return getattr(self.get_queryset(), name)(*args, **kwargs)",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/db/models/manager.py",
                  lineNo: 82,
                  context: [
                    [77, ""],
                    [78, "    @classmethod"],
                    [79, "    def _get_queryset_methods(cls, queryset_class):"],
                    [80, "        def create_method(name, method):"],
                    [
                      81,
                      "            def manager_method(self, *args, **kwargs):",
                    ],
                    [
                      82,
                      "                return getattr(self.get_queryset(), name)(*args, **kwargs)",
                    ],
                    [
                      83,
                      "            manager_method.__name__ = method.__name__",
                    ],
                    [84, "            manager_method.__doc__ = method.__doc__"],
                    [85, "            return manager_method"],
                    [86, ""],
                    [87, "        new_methods = {}"],
                  ],
                },
                {
                  vars: {
                    num: "0",
                    args: [],
                    self: "<QuerySet from django.db.models.query at 0x7f232fe5c7c0>",
                    clone:
                      "<QuerySet from django.db.models.query at 0x7f232fe5caf0>",
                    limit: "21",
                    kwargs: {
                      provider: "'gitlab'",
                      sites__id: "1",
                    },
                  },
                  in_app: true,
                  module: "django.db.models.query",
                  filename: "django/db/models/query.py",
                  function: "get",
                  context_line: "            raise self.model.DoesNotExist(",
                  absPath:
                    "/usr/local/lib/python3.8/site-packages/django/db/models/query.py",
                  lineNo: 415,
                  context: [
                    [410, "            clone.query.set_limits(high=limit)"],
                    [411, "        num = len(clone)"],
                    [412, "        if num == 1:"],
                    [413, "            return clone._result_cache[0]"],
                    [414, "        if not num:"],
                    [415, "            raise self.model.DoesNotExist("],
                    [
                      416,
                      '                "%s matching query does not exist." %',
                    ],
                    [417, "                self.model._meta.object_name"],
                    [418, "            )"],
                    [419, "        raise self.model.MultipleObjectsReturned("],
                    [
                      420,
                      "            'get() returned more than one %s -- it returned %s!' % (",
                    ],
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: "request",
      data: {
        env: {
          SERVER_NAME: "glitchtip-staging-6787c7c74c-7pdfb",
          SERVER_PORT: "8080",
        },
        url: "https, https://staging.glitchtip.com/rest-auth/gitlab/",
        data: {
          access_token:
            "7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007",
        },
        method: "POST",
        headers: [
          ["Accept", "application/json, text/plain, */*"],
          ["Accept-Encoding", "gzip"],
          ["Accept-Language", "en-US,en;q=0.5"],
          ["Cdn-Loop", "cloudflare"],
          ["Cf-Connecting-Ip", "93.157.248.128"],
          ["Cf-Ipcountry", "RU"],
          ["Cf-Ray", "5787c0afbc0174ab-EWR"],
          ["Cf-Visitor", '{"scheme":"https"}'],
          ["Connection", "close"],
          ["Content-Length", "83"],
          ["Content-Type", "application/json"],
          ["Cookie", ""],
          ["Dnt", "1"],
          ["Host", "staging.glitchtip.com"],
          ["Origin", "https://staging.glitchtip.com"],
          ["Referer", "https://staging.glitchtip.com/login/gitlab"],
          [
            "User-Agent",
            "Mozilla/5.0 (X11; NetBSD i686; rv:68.0) Gecko/20100101 Firefox/68.0",
          ],
          ["X-Forwarded-For", ""],
          ["X-Forwarded-Port", "443"],
          ["X-Forwarded-Proto", "https, https"],
        ],
        query_string: "",
        inferredContentType: "application/json",
      },
    },
  ],
  metadata: {
    type: "SocialApp.DoesNotExist",
    value: "SocialApp matching query does not exist.",
    filename: "django/db/models/query.py",
    function: "get",
  },
  packages: {
    pip: "20.0.2",
    six: "1.14.0",
    amqp: "2.5.2",
    cleo: "0.7.6",
    idna: "2.8",
    pytz: "2019.3",
    vine: "1.3.0",
    attrs: "19.3.0",
    boto3: "1.12.0",
    cachy: "0.3.0",
    kombu: "4.6.7",
    pylev: "1.3.0",
    redis: "3.3.11",
    uwsgi: "2.0.18",
    wheel: "0.34.2",
    celery: "4.4.0",
    clikit: "0.4.3",
    django: "3.0.3",
    pastel: "0.2.0",
    poetry: "1.0.5",
    stripe: "2.43.0",
    asgiref: "3.2.3",
    certifi: "2019.11.28",
    chardet: "3.0.4",
    jeepney: "0.4.3",
    keyring: "20.0.1",
    msgpack: "1.0.0",
    pkginfo: "1.5.0.1",
    tomlkit: "0.5.11",
    urllib3: "1.25.8",
    billiard: "3.6.2.0",
    botocore: "1.15.0",
    docutils: "0.15.2",
    html5lib: "1.0.1",
    jmespath: "0.9.4",
    lockfile: "0.12.2",
    oauthlib: "3.1.0",
    requests: "2.22.0",
    sqlparse: "0.3.0",
    "dj-stripe": "2.2.3",
    jsonfield: "3.1.0",
    pyparsing: "2.4.6",
    defusedxml: "0.6.0",
    "django-csp": "3.6",
    jsonschema: "3.2.0",
    pyrsistent: "0.15.7",
    s3transfer: "0.3.3",
    "sentry-sdk": "0.13.5",
    setuptools: "45.2.0",
    simplejson: "3.17.0",
    whitenoise: "5.0.1",
    shellingham: "1.3.2",
    cachecontrol: "0.12.6",
    cryptography: "2.8",
    webencodings: "0.5.1",
    "django-filter": "2.2.0",
    secretstorage: "3.1.2",
    "django-allauth": "0.41.0",
    "django-environ": "0.4.5",
    "python3-openid": "3.1.0",
    "django-storages": "1.9.1",
    "psycopg2-binary": "2.8.4",
    "python-dateutil": "2.8.1",
    "django-rest-auth": "0.9.5",
    "django-extensions": "2.2.8",
    "requests-oauthlib": "1.3.0",
    "requests-toolbelt": "0.8.0",
    "django-redis-cache": "2.1.0",
    "drf-nested-routers": "0.91",
    "django-cors-headers": "3.2.1",
    djangorestframework: "3.11.0",
    "django-debug-toolbar": "2.2",
    "django-organizations": "1.1.2",
    "django-celery-results": "1.2.0",
  },
  platform: "python",
  sdk: {
    name: "sentry.python",
    version: "0.13.5",
    packages: [
      {
        name: "pypi:sentry-sdk",
        version: "0.13.5",
      },
    ],
    integrations: [
      "argv",
      "atexit",
      "dedupe",
      "django",
      "excepthook",
      "logging",
      "modules",
      "stdlib",
      "threading",
    ],
  },
  tags: [],
  title: "SocialApp.DoesNotExist: SocialApp matching query does not exist.",
  type: "error",
  nextEventID: null,
  previousEventID: "cd12ee1200fb41dfa6133b2254118892",
};
