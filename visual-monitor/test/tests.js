'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  }
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://www.economist.com/digital';

var resultsCallback = process.env.DEBUG ? console.log : shoovWebdrivercss.processResults;

describe('Visual monitor testing', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps);
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the home page',function(done) {
    client
      .url(baseUrl)
      .setCookie({name: 'ec-overlay-close', value: '1'})
      .webdrivercss(testName + '.homepage', {
        name: '1',
        exclude:
          [
            // Subscription offer.
            '#gpt_pencil_slug_ad',
            // The Economist Espresso app and digital editions img.
            '.digitalchinamodule h2',
            '.digitalespressomodule h2',
            '.digitalproductimage',
            '.digitalthirdrow',
          ],
        remove:
          [
            // Top ad.
            '#block-ec_ads-leaderboard_ad',
            '.usabilla_live_button_container',
            '#ec-cookie-messages-container',
          ],
        hide:
          [
            // The Economist Espresso app and digital editions text.
            '.digitalchinamodule h3',
            '.digitalchinamodule p',
            '.digitalespressomodule h3',
            '.digitalespressomodule p',
          ],
        screenWidth: selectedCaps == 'chrome' ? [960] : undefined,
      }, resultsCallback)
      .call(done);
  });
});
