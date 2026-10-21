/* עץ האורן — Service Worker (Web Push) */
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e){ data = { title: "עץ האורן", body: (event.data && event.data.text()) || "" }; }
  var title = data.title || "עץ האורן";
  var options = {
    body: data.body || "",
    icon: data.icon || "icon-192.png",
    badge: data.badge || "icon-192.png",
    dir: "rtl",
    lang: "he",
    tag: data.tag || "etz-notify",
    renotify: true,
    vibrate: [80, 40, 80],
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        var c = list[i];
        if ("focus" in c){ try{ c.navigate && c.navigate(url); }catch(e){} return c.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
