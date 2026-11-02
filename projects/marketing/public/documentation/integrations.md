# Integrations

GlitchTip aims to be Sentry API compatible. Anything that works with Sentry should also work with GlitchTip. The following integrations have been verified to work. Please considering [adding more](https://gitlab.com/glitchtip/glitchtip-marketing/-/tree/master/documentation/integrations.md).

## GitLab Error Tracking

In GitLab, navigate to a project's Settings > Monitor > Error Tracking. Click to enable tracking. Select "Sentry" and enter the GlitchTip URL (for example, https://app.glitchtip.com). Get your Auth Token from GlitchTip by navigating to Profile > Auth Tokens. Note that Auth Tokens give access to any project your user has permission to. You may select all permission scopes or limit them (giving GitLab less access, such as read only access). Select Connect and then pick the Project you want to associate with the GitLab Project.

<img style="max-width: 400px" src="/assets/documentation/gitlab.png" alt="GitLab settings example"></img>

## Data source in Grafana

In Grafana, navigate to Configuration > Data sources, click "Add data source". In the search field, type "Sentry". Enter the GlitchTip URL (for example, https://app.glitchtip.com) in the Sentry URL field (no slash in the end). Enter what org the data source is going to fetch data from in GlitchTip (if you want to add several organizations, you need to add seperate Sentry Data sources for each organization). Get your Auth Token from GlitchTip by navigating to Profile > Auth Tokens (you need at least read only permissions). Click "Save & Test". Now you should be able to explore your GlitchTip data in Grafana.
