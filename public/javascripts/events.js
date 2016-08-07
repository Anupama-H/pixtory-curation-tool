/*
    Event Publisher/Subscriber Implementation
    Reference : https://davidwalsh.name/pubsub-javascript
*/
(function(_window){
    var events = {};
    var hOP = events.hasOwnProperty;

    var appEventApi = {
        subscribe: function(event, listener) {
            // Create the event's object if not yet created
            if(!hOP.call(events, event)) events[event] = [];

            // Add the listener to queue
            var index = events[event].push(listener) - 1;

            // Provide handle back for removal of event
            return {
                remove: function() {
                    delete events[event][index];
                }
            };
        },
        publish: function(event, data) {
          // If the event doesn't exist, or there's no listeners in queue, just leave
          if(!hOP.call(events, event)) return;

          // Cycle through events queue, fire!
          events[event].forEach(function(handler) {
                handler(typeof(data) !== "undefined" ? data : {});
          });
        }
    };

    _window.AppEvent = appEventApi;
})(window);
