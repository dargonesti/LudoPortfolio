/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts(
  "/portfolio/precache-manifest.ac22f36587c15805bb20395b8ccb2a19.js"
);

workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/portfolio/index.html", {
  
  blacklist: [/^\/_/,/\/[^/]+\.[^/]+$/],
});


self.addEventListener("push", e => {
  const data = e.data.json();
  //console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./logo64.png"//"http://image.ibb.co/frYOFd/tmlogo.png"
  });
});
self.addEventListener("notificationclose", function (e) {
  var notification = e.notification;
  var data = notification.data || {};
  var primaryKey = data.primaryKey;
  console.debug("Closed notification: " + primaryKey);
});
self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var data = notification.data || {};
  var primaryKey = data.primaryKey;
  var action = e.action;
  console.debug("Clicked notification: " + primaryKey);
  if (action === "close") {
    console.debug("Notification clicked and closed", primaryKey);
    notification.close();
  } else {
    console.debug("Notification actioned", primaryKey);
    clients.openWindow('/');
    notification.close();
  }
});
/** UPDATE FOUND Example : 
///// Prompt Update SW
if(self.active) {
  // Check if an updated sw.js was found
  self.addEventListener('updatefound', (e) => {
    console.log('Update found. Waiting for install to complete.');
    const installingWorker = self.installing;

    // Watch for changes to the worker's state. Once it is "installed", our cache
    // has been updated with our new files, so we can prompt the user to instantly
    // reload.
    installingWorker.addEventListener('statechange', (e) => {
      if(installingWorker.state === 'installed') {
        console.log('Install complete. Triggering update prompt.');
        onUpdateFound();
      }
    });
  });
}


function onUpdateFound() {
  ons.notification.confirm('A new update is ready. Do you want to update now?')
    .then(buttonIndex => {
      if(buttonIndex === 1) {
        location.reload();
      }
    });
}
 */