export interface Integration {
  link: string;
  type: "framework" | "language" | "library";
  id: string;
  name: string;
}

export interface Platform {
  id: string;
  name: string;
  integrations: Integration[];
}

export const platforms: Platform[] = [
  {
    id: "csharp",
    name: "C#",
    integrations: [
      {
        id: "csharp-aspnetcore",
        name: "ASP.NET Core",
        type: "framework",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=aspnetcore",
      },
      {
        id: "csharp",
        name: "C#",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=csharp",
      },
    ],
  },
  {
    id: "cordova",
    name: "Cordova",
    integrations: [
      {
        id: "cordova",
        name: "Cordova",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=cordova",
      },
    ],
  },
  {
    id: "electron",
    name: "Electron",
    integrations: [
      {
        id: "electron",
        name: "Electron",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=electron",
      },
    ],
  },
  {
    id: "elixir",
    name: "Elixir",
    integrations: [
      {
        id: "elixir",
        name: "Elixir",
        type: "language",
        link: "https://docs.sentry.io/clients/elixir/",
      },
    ],
  },
  {
    id: "go",
    name: "Go",
    integrations: [
      {
        id: "go",
        name: "Go",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=go",
      },
      {
        id: "go-http",
        name: "net/http",
        type: "framework",
        link: "https://docs.sentry.io/platforms/go/http/",
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    integrations: [
      {
        id: "java-android",
        name: "Android",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/android/",
      },
      {
        id: "java-appengine",
        name: "Google App Engine",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/appengine/",
      },
      {
        id: "java",
        name: "Java",
        type: "language",
        link: "https://docs.sentry.io/clients/java/",
      },
      {
        id: "java-logging",
        name: "java.util.logging",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/jul/",
      },
      {
        id: "java-log4j",
        name: "Log4j 1.x",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/log4j/",
      },
      {
        id: "java-log4j2",
        name: "Log4j 2.x",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/log4j2/",
      },
      {
        id: "java-logback",
        name: "Logback",
        type: "framework",
        link: "https://docs.sentry.io/clients/java/modules/logback/",
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    integrations: [
      {
        id: "javascript-angular",
        name: "Angular",
        type: "framework",
        link: "https://docs.sentry.io/platforms/javascript/angular/",
      },
      {
        id: "javascript-backbone",
        name: "Backbone",
        type: "framework",
        link: "https://docs.sentry.io/clients/javascript/integrations/#backbone",
      },
      {
        id: "javascript-ember",
        name: "Ember",
        type: "framework",
        link: "https://docs.sentry.io/platforms/javascript/ember/",
      },
      {
        id: "javascript",
        name: "JavaScript",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=javascript",
      },
      {
        id: "javascript-react",
        name: "React",
        type: "framework",
        link: "https://docs.sentry.io/platforms/javascript/react/",
      },
      {
        id: "javascript-nextjs",
        name: "Next.js",
        type: "framework",
        link: "https://github.com/getsentry/sentry-javascript/tree/master/packages/nextjs",
      },
      {
        id: "javascript-vue",
        name: "Vue",
        type: "framework",
        link: "https://docs.sentry.io/platforms/javascript/vue/",
      },
    ],
  },
  {
    id: "minidump",
    name: "Minidump",
    integrations: [
      {
        id: "minidump",
        name: "Minidump",
        type: "framework",
        link: "https://docs.sentry.io/platforms/native/minidump/",
      },
    ],
  },
  {
    id: "native",
    name: "Native (C/C++)",
    integrations: [
      {
        id: "native",
        name: "Native (C/C++)",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=native",
      },
    ],
  },
  {
    id: "node",
    name: "Node.js",
    integrations: [
      {
        id: "node-connect",
        name: "Connect",
        type: "framework",
        link: "https://docs.sentry.io/platforms/node/connect/",
      },
      {
        id: "node-express",
        name: "Express",
        type: "framework",
        link: "https://docs.sentry.io/platforms/node/express/",
      },
      {
        id: "node-koa",
        name: "Koa",
        type: "framework",
        link: "https://docs.sentry.io/platforms/node/koa/",
      },
      {
        id: "node",
        name: "Node.js",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=node",
      },
    ],
  },
  {
    id: "cocoa",
    name: "Objective-C",
    integrations: [
      {
        id: "cocoa",
        name: "Objective-C",
        type: "language",
        link: "https://docs.sentry.io/clients/cocoa/",
      },
    ],
  },
  {
    id: "php",
    name: "PHP",
    integrations: [
      {
        id: "php-laravel",
        name: "Laravel",
        type: "framework",
        link: "https://docs.sentry.io/platforms/php/laravel/",
      },
      {
        id: "php-monolog",
        name: "Monolog",
        type: "framework",
        link: "https://docs.sentry.io/clients/php/integrations/monolog/",
      },
      {
        id: "php",
        name: "PHP",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=php",
      },
      {
        id: "php-symfony",
        name: "Symfony",
        type: "framework",
        link: "https://docs.sentry.io/platforms/php/guides/symfony/",
      },
      {
        id: "php-drupal",
        name: "Drupal",
        type: "framework",
        link: "https://drupal.org/project/raven",
      },
    ],
  },
  {
    id: "python",
    name: "Python",
    integrations: [
      {
        id: "python-aiohttp",
        name: "AIOHTTP",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/aiohttp/",
      },
      {
        id: "python-asgi",
        name: "ASGI",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/asgi/",
      },
      {
        id: "python-pythonawslambda",
        name: "AWS Lambda",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/aws_lambda/",
      },
      {
        id: "python-bottle",
        name: "Bottle",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/bottle/",
      },
      {
        id: "python-celery",
        name: "Celery",
        type: "library",
        link: "https://docs.sentry.io/platforms/python/celery/",
      },
      {
        id: "python-django",
        name: "Django",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/django/",
      },
      {
        id: "python-falcon",
        name: "Falcon",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/falcon/",
      },
      {
        id: "python-flask",
        name: "Flask",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/flask/",
      },
      {
        id: "python-pylons",
        name: "Pylons",
        type: "framework",
        link: "https://docs.sentry.io/clients/python/integrations/pylons/",
      },
      {
        id: "python-pyramid",
        name: "Pyramid",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/pyramid/",
      },
      {
        id: "python",
        name: "Python",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=python",
      },
      {
        id: "python-rq",
        name: "RQ (Redis Queue)",
        type: "library",
        link: "https://docs.sentry.io/platforms/python/rq/",
      },
      {
        id: "python-sanic",
        name: "Sanic",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/sanic/",
      },
      {
        id: "python-pythonserverless",
        name: "Serverless (Python)",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/serverless/",
      },
      {
        id: "python-tornado",
        name: "Tornado",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/tornado/",
      },
      {
        id: "python-wsgi",
        name: "WSGI",
        type: "framework",
        link: "https://docs.sentry.io/platforms/python/wsgi/",
      },
    ],
  },
  {
    id: "react-native",
    name: "React-Native",
    integrations: [
      {
        id: "react-native",
        name: "React-Native",
        type: "language",
        link: "https://docs.sentry.io/platforms/react-native/",
      },
    ],
  },
  {
    id: "dart-flutter",
    name: "Flutter",
    integrations: [
      {
        id: "dart-flutter",
        name: "Flutter",
        type: "language",
        link: "",
      },
    ],
  },
  {
    id: "ruby",
    name: "Ruby",
    integrations: [
      {
        id: "ruby-rack",
        name: "Rack",
        type: "framework",
        link: "https://docs.sentry.io/clients/ruby/integrations/rack/",
      },
      {
        id: "ruby-rails",
        name: "Rails",
        type: "framework",
        link: "https://docs.sentry.io/clients/ruby/integrations/rails/",
      },
      {
        id: "ruby",
        name: "Ruby",
        type: "language",
        link: "https://docs.sentry.io/clients/ruby/",
      },
    ],
  },
  {
    id: "rust",
    name: "Rust",
    integrations: [
      {
        id: "rust",
        name: "Rust",
        type: "language",
        link: "https://docs.sentry.io/error-reporting/quickstart/?platform=rust",
      },
    ],
  },
];
