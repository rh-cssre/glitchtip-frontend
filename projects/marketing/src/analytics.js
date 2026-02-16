if (!navigator.webdriver) {
  window.plausible =
    window.plausible ||
    function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

  (function (d, t) {
    var BASE_URL = "https://app.chatwoot.com";
    var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/packs/js/sdk.js";
    s.parentNode.insertBefore(g, s);
    g.onload = function () {
      window.chatwootSDK.run({
        websiteToken: "Nh1Q6ZEPmduVP4c4Zmj7W9b4",
        baseUrl: BASE_URL,
      });
    };
  })(document, "script");
}
