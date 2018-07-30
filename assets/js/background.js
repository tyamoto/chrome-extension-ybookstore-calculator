(function () {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // console.log(request);
        switch (request.type) {
            case 'setSettings':
                let _settings = { limit: request.limit };
                chrome.storage.local.set(
                    _settings, function() {}
                );
                sendResponse(_settings);
                break;
            /*
             * case 'getSettings':
             *     var _settings = {};
             *     chrome.storage.local.get(
             *         null,
             *         function(value) {
             *             sendResponse(value);
             *         }
             *     );
             *     break;
             */
            /*
             * case 'getSettings':
             *     storage.getSettings(function(settings) {
             *         return sendResponse(settings);
             *     });
             *     break;
             * case 'setSettings':
             *     storage.setSettings(request.settings, function(settings) {
             *         return sendResponse(settings);
             *     });
             */
        }
    });
}).call(this);
