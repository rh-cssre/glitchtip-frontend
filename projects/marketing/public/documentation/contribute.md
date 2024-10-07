# Contributing to GlitchTip

GlitchTip is a reimplementation of Sentry's proprietary backend. It uses a very small amount of Sentry ported code from when Sentry was BSD. A reimplementation was chosen over a fork in order to value simplicity over scale.

Contributors to GlitchTip should never read nor copy proprietary Business Source License (BSL) Sentry code as this may violate their license. Viewing Sentry BSD licensed code is fine. Attribute code in a NOTICES file.

## Repository

GlitchTip's source code is hosted on [GitLab](https://gitlab.com/glitchtip/). The main repos here are:

- [GlitchTip backend](https://gitlab.com/glitchtip/glitchtip-backend/) - Django API backend that powers event intake, full text searching, authentication, and much more. This repo's CI also builds the final public Docker images.
- [GlitchTip frontend](https://gitlab.com/glitchtip/glitchtip-frontend/) - Angular frontend that powers what you see when you use GlitchTip.

## Best practices

GlitchTip has guidelines for both [backend](https://gitlab.com/glitchtip/glitchtip-backend/-/blob/master/CONTRIBUTING.md) and [frontend](https://gitlab.com/glitchtip/glitchtip-frontend/-/blob/master/CONTRIBUTING.md) contributions. Keeping these in mind can help in deciding how to structure your code and make the code review process quicker. Our documentation style guide can be found [here](https://gitlab.com/glitchtip/glitchtip/-/wikis/Documentation-Style-Guide).

## Submitting a client SDK test case for the backend

GlitchTip attempts to maintain compatibility with the open source Sentry client SDK. If you find a problem where GlitchTip doesn't store an event as expected, it can be helpful to submit a test case.

1. Find the appropriate language/framework [error factory](https://gitlab.com/glitchtip/error-factories). For example, if you are using the Python Sentry SDK with Django, use our [django-error-factory](https://gitlab.com/glitchtip/error-factories/django-error-factory). If you don't see your language/framework's project open an issue on our [meta project](https://gitlab.com/glitchtip/meta/-/issues) and we can help create one for you. If you start your own project, please consider using Docker Compose to run the project. This allows developers who may not be familiar with your framework to easily gather test data and debug problems.
2. Create an error (or other event) that demonstrates the event you are having trouble with. For example, if a Python `division by zero` error was not producing the correct event you might [recreate this](https://gitlab.com/glitchtip/error-factories/django-error-factory/-/blob/b38f8f9b918ae1ccbbc4af249aa31adaa3abbfe0/errors/views.py#L17) in the project. Remember to set the Sentry DSN to your GlitchTip instance. Typically this is done in the docker-compose.yml file.
3. In your GlitchTip instance, set the environment variable `EVENT_STORE_DEBUG` to "True". If using Docker Compose, this can be done in the docker-compose.yml file and restarting the service.
4. Next capture the raw JSON event from the SDK. Create the event again in the error factory. It will output in the GlitchTip instance's log. If using docker-compose this will be the console output from running `docker-compose logs web`. Copy this.
5. Copy the raw JSON event from the SDK to the backend repo. Save it in the directory [event_store/test_data/incoming_events](https://gitlab.com/glitchtip/glitchtip-backend/-/tree/master/event_store/test_data/incoming_events). Pick a good name, such as `python_zero_division.json`.
6. If the event views properly in the older BSD version of [Sentry](https://gitlab.com/glitchtip/sentry-open-source/sentry), it can be helpful to view the event data there. Submit the exact same data again using a tool such as [Postwoman](https://postwoman.io/). Do not submit it from the client SDK again, as the data will vary just slightly. Copy the JSON version of the event from Sentry into the [event_store/test_data/oss_sentry_json/](https://gitlab.com/glitchtip/glitchtip-backend/-/tree/master/event_store/test_data/oss_sentry_json) directory. Finally, use your web brower's development tools to inspect the Sentry event API (`/api/0/issues/<issue-id>/events/latest/`) and copy the json here to `event_store/test_data/oss_sentry_events`. Use the same file name for each folder's JSON.
7. Add a unit test in [issues/tests/test_sentry_api_compat.py](https://gitlab.com/glitchtip/glitchtip-backend/-/blob/master/issues/tests/test_sentry_api_compat.py) in the backend. Review existing tests and mimic their style.

Finally submit a merge request for the error factory and backend repos for review.
