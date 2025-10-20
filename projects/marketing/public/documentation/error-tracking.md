# Setting up Error Tracking

Your web app can send any errors it encounters to GlitchTip, which will notify you and record the error as an issue so you can see the details.

## Configuring your app

Once you have created your GlitchTip project, the next step is to set up your web app so it can send error notifications to GlitchTip. If you previously selected a platform for your project and visit the Issues page, you will see detailed instructions for installing an SDK and configuring it to work with GlitchTip. If you did not select a platform, you can do that now on the project settings page, or you can read our SDK documentation [here](/sdkdocs). When you first visit the issues page you will also see the DSN for your project. If you need to view your DSN later, you will be able to find it on the project settings page. Follow the SDK instructions to get your app set up and give it your DSN.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
   <picture>
       <source
           type="image/webp"
           srcset="
               /assets/screenshots/start-project@1x.webp,
               /assets/screenshots/start-project@2x.webp,
               /assets/screenshots/start-project@3x.webp,
           "
       />
       <img
           src="/assets/screenshots/start-project@1xpng"
           srcset="
               /assets/screenshots/start-project@1xpng,
               /assets/screenshots/start-project@2xpng 2x,
               /assets/screenshots/start-project@3xpng 3x,
           "
           loading="lazy"
           alt="Screenshot of GlitchTip configuration instructions on issues page."
       />
   </picture>
</div>

## Try it out

Next, add some code to your project that will generate an error, such as dividing by zero. Once the error has been generated, navigate back to the issues page and verify that GlitchTip is now keeping a watchful eye on your app. Make sure to remove your test error once you’ve confirmed everything is working.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
   <picture>
       <source
           type="image/webp"
           srcset="
               /assets/screenshots/one-issue@1x.webp,
               /assets/screenshots/one-issue@2x.webp,
               /assets/screenshots/one-issue@3x.webp,
           "
       />
       <img
           src="/assets/screenshots/one-issue@1xpng"
           srcset="
               /assets/screenshots/one-issue@1xpng,
               /assets/screenshots/one-issue@2xpng 2x,
               /assets/screenshots/one-issue@3xpng 3x,
           "
           loading="lazy"
           alt="Screenshot of GlitchTip's issues page with a new issue displayed."
       />
   </picture>
</div>

## Turn on alerts

Now that GlitchTip is receiving your project’s errors, you will probably want to activate project alerts. Navigate to your organization’s Projects page and click the settings button on your project. Then scroll down to the Project Alerts section and click “Create New Alert”.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
   <picture>
       <source
           type="image/webp"
           srcset="
               /assets/screenshots/new-project-alert@1x.webp,
               /assets/screenshots/new-project-alert@2x.webp,
               /assets/screenshots/new-project-alert@3x.webp,
           "
       />
       <img
           src="/assets/screenshots/new-project-alert@1xpng"
           srcset="
               /assets/screenshots/new-project-alert@1xpng,
               /assets/screenshots/new-project-alert@2xpng 2x,
               /assets/screenshots/new-project-alert@3xpng 3x,
           "
           loading="lazy"
           alt="Screenshot of GlitchTip's project alert form."
       />
   </picture>
</div>

Here you can specify when you want to receive alerts based on the frequency of errors. By default, new project alerts send emails to a project’s team members, but you can also add a webhook URL by clicking “Add An Alert Recipient.”
