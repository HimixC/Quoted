'use strict';

/**
 * Initializes the Quoted app.
 */
class Quoted {
  constructor() {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

    if (isLocalhost) {
      /*
        TODO: Set up local debug token
      */
    }

    var that = this;
    that.initAppCheck();

    firebase.auth().signInAnonymously().then(function () {
      that.initTemplates();
      that.initHomeQuote();
    }).catch(function (err) {
      console.log(err);
    });

    globalThis.db = firebase.firestore();
    globalThis.quotesRef = globalThis.db.collection('quotes');
  }

  getCleanPath(dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
      return dirtyPath.split('/').slice(1).join('/');
    } else {
      return dirtyPath;
    }
  }

  getFirebaseConfig() {
    return firebase.app().options;
  }
}

window.onload = function() {
  window.app = new Quoted();
};
