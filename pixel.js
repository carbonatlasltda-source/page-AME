// Pixel da Meta: carrega só quando há um ID configurado em config.js.
(function () {
  var id = window.ASB_CONFIG && window.ASB_CONFIG.pixelId;
  window.asbTrack = function () {};
  if (!id || id === "SEU_PIXEL_ID") return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", id);
  fbq("track", "PageView");

  window.asbTrack = function (evento, dados) {
    fbq("track", evento, dados || {});
  };
})();
