# Getting started with uptime monitoring

An uptime monitor will send requests to or await requests from your app at regular intervals to confirm your app is up and running. Having GlitchTip monitor your site’s status is as easy as filling out the “Create a New Uptime Monitor” form. Here are some tips in case you are wondering what settings you should choose.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
    <picture>
        <source
            type="image/webp"
            srcset="
                /assets/screenshots/new-monitor@1x.webp,
                /assets/screenshots/new-monitor@2x.webp 2x,
                /assets/screenshots/new-monitor@3x.webp 3x,
            "
        />
        <img
            src="/assets/screenshots/new-monitor@1xpng"
            srcset="
                /assets/screenshots/new-monitor@1x.png,
                /assets/screenshots/new-monitor@2x.png 2x,
                /assets/screenshots/new-monitor@3x.png 3x,
            "
            loading="lazy"
            alt="Screenshot of GlitchTip's new uptime monitor creation form."
        />
    </picture>
</div>

## Monitor type

**Ping:** The most common type of uptime monitoring. GlitchTip will "ping" the specified URL using an HTTP HEAD request with no payload.

**POST:** GlitchTip will send an HTTP POST request to the specified URL. If the expected response is not received, the site will be marked as Down.

**GET:** GlitchTip will send an HTTP GET request to the specified URL. If the expected response is not received, the site will be marked as Down.

**Heartbeat:** GlitchTip will await requests from your site to ensure it is active. If it doesn't receive the request, the site will be marked as Down. After you create the request you will be shown a URL for your site to send its requests to.

## Associated project

While this field is optional, it is important for making sure you receive email notifications when there is a change in the status of your app. Make sure to select a project that has email alerts configured. Alternatively, you could also set up a new project just for this purpose. And don’t worry: an associated project can be added after you have created your uptime monitor.

## Expected status

This is for POST and GET monitors. When it sends a request to your app, GlitchTip will expect the response it receives to match this status. If the response does not match this status, your app will be marked as down.

## Interval

The frequency at which requests will be sent to or expected from your app. For those using GlitchTip's hosted service, it is worth bearing in mind that each request counts as event for your organization’s subscription.
