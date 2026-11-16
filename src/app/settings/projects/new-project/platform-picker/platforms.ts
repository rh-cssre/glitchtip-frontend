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
        link: "/sdkdocs/csharp-aspnetcore",
      },
      {
        id: "csharp",
        name: "C#",
        type: "language",
        link: "/sdkdocs/csharp",
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
        link: "/sdkdocs/electron",
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
        link: "/sdkdocs/elixir",
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
        link: "/sdkdocs/go",
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
        link: "/sdkdocs/java-android",
      },
      {
        id: "java",
        name: "Java",
        type: "language",
        link: "/sdkdocs/java",
      },
      {
        id: "java-logging",
        name: "java.util.logging",
        type: "framework",
        link: "/sdkdocs/java-logging",
      },
      {
        id: "java-log4j",
        name: "Log4j 1.x",
        type: "framework",
        link: "/sdkdocs/java-log4j",
      },
      {
        id: "java-log4j2",
        name: "Log4j 2.x",
        type: "framework",
        link: "/sdkdocs/java-log4j2",
      },
      {
        id: "java-logback",
        name: "Logback",
        type: "framework",
        link: "/sdkdocs/java-logback",
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
        link: "/sdkdocs/javascript-angular",
      },
      {
        id: "javascript",
        name: "JavaScript",
        type: "language",
        link: "/sdkdocs/javascript",
      },
      {
        id: "javascript-react",
        name: "React",
        type: "framework",
        link: "/sdkdocs/javascript-react",
      },
      {
        id: "javascript-nextjs",
        name: "Next.js",
        type: "framework",
        link: "/sdkdocs/javascript-nextjs",
      },
      {
        id: "javascript-vue",
        name: "Vue",
        type: "framework",
        link: "/sdkdocs/javascript-vue",
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
        link: "/sdkdocs/native",
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
        link: "/sdkdocs/node-connect",
      },
      {
        id: "node-express",
        name: "Express",
        type: "framework",
        link: "/sdkdocs/node-express",
      },
      {
        id: "node-koa",
        name: "Koa",
        type: "framework",
        link: "/sdkdocs/node-koa",
      },
      {
        id: "node",
        name: "Node.js",
        type: "language",
        link: "/sdkdocs/node",
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
        link: "/sdkdocs/cocoa",
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
        link: "/sdkdocs/php-laravel",
      },
      {
        id: "php",
        name: "PHP",
        type: "language",
        link: "/sdkdocs/php",
      },
      {
        id: "php-symfony",
        name: "Symfony",
        type: "framework",
        link: "/sdkdocs/php-symfony",
      },
      {
        id: "php-drupal",
        name: "Drupal",
        type: "framework",
        link: "/sdkdocs/php-drupal",
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
        link: "/sdkdocs/python-aiohttp",
      },
      {
        id: "python-asgi",
        name: "ASGI",
        type: "framework",
        link: "/sdkdocs/python-asgi",
      },
      {
        id: "python-pythonawslambda",
        name: "AWS Lambda",
        type: "framework",
        link: "/sdkdocs/python-pythonawslambda",
      },
      {
        id: "python-bottle",
        name: "Bottle",
        type: "framework",
        link: "/sdkdocs/python-bottle",
      },
      {
        id: "python-celery",
        name: "Celery",
        type: "library",
        link: "/sdkdocs/python-celery",
      },
      {
        id: "python-django",
        name: "Django",
        type: "framework",
        link: "/sdkdocs/python-django",
      },
      {
        id: "python-falcon",
        name: "Falcon",
        type: "framework",
        link: "/sdkdocs/python-falcon",
      },
      {
        id: "python-fastapi",
        name: "FastAPI",
        type: "framework",
        link: "/sdkdocs/python-fastapi",
      },
      {
        id: "python-flask",
        name: "Flask",
        type: "framework",
        link: "/sdkdocs/python-flask",
      },
      {
        id: "python-pyramid",
        name: "Pyramid",
        type: "framework",
        link: "/sdkdocs/python-pyramid",
      },
      {
        id: "python",
        name: "Python",
        type: "language",
        link: "/sdkdocs/python",
      },
      {
        id: "python-rq",
        name: "RQ (Redis Queue)",
        type: "library",
        link: "/sdkdocs/python-rq",
      },
      {
        id: "python-sanic",
        name: "Sanic",
        type: "framework",
        link: "/sdkdocs/python-sanic",
      },
      {
        id: "python-pythonserverless",
        name: "Serverless (Python)",
        type: "framework",
        link: "/sdkdocs/python-pythonserverless",
      },
      {
        id: "python-tornado",
        name: "Tornado",
        type: "framework",
        link: "/sdkdocs/python-tornado",
      },
      {
        id: "python-wsgi",
        name: "WSGI",
        type: "framework",
        link: "/sdkdocs/python-wsgi",
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
        link: "/sdkdocs/react-native",
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
        link: "/sdkdocs/dart-flutter",
      },
    ],
  },
  {
    id: "ruby",
    name: "Ruby",
    integrations: [
      {
        id: "ruby-rails",
        name: "Rails",
        type: "framework",
        link: "/sdkdocs/ruby-rails",
      },
      {
        id: "ruby",
        name: "Ruby",
        type: "language",
        link: "/sdkdocs/ruby",
      },
    ],
  },
  {
    id: "swift",
    name: "Swift",
    integrations: [
      {
        id: "swift",
        name: "Swift",
        type: "language",
        link: "/sdkdocs/swift",
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
        link: "/sdkdocs/rust",
      },
    ],
  },
];
