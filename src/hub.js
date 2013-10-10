var subscriptions = {};
var rSplit = /\s+/;
var clean = function () {
  //
};

/**
 * Hub
 * @public
 */

var Hub = {};

Hub['pub'] = function (channels) {
  channels = trim(channels).split(rSplit);

  var channelsCount = channels.length;
  var channel;
  var i = -1;

  var j, subscribers, subscriber, subscribersCount;

  while (++i < channelsCount) {
    channel = channels[i];

    subscribers = subscriptions[channel] || [];
    subscribersCount = subscribers.length;
    j = -1;

    while (++j < subscribersCount) {
      subscriber = subscribers[j];
      subscriber.handler.apply(subscriber.context, arguments);
    }
  }

  return this;
};

Hub['reset'] = function () {
  subscriptions = {};
  return this;
};

Hub['sub'] =  function (channels, handler, context) {
  channels = trim(channels).split(rSplit);

  var channelsCount = channels.length;
  var channel;
  var i = -1;

  while (++i < channelsCount) {
    channel = channels[i];
    subscriptions[channel] = subscriptions[channel] || [];
    subscriptions[channel].push({
      handler: handler,
      context: context
    });
  }

  return this;
};

Hub['unsub'] = function (channels, handler) {
  channels = trim(channels).split(rSplit);

  var channelsCount = channels.length;
  var channel;
  var i = -1;

  var j, subscribers, subscriber, subscribersCount;
  var retain;

  while (++i < channelsCount) {
    channel = channels[i];

    subscribers = subscriptions[channel] || [];
    subscribersCount = subscribers.length;
    j = -1;

    retain = [];

    if (handler !== undefined) {
      while (++j < subscribersCount) {
        subscriber = subscribers[j];
        if (subscriber.handler !== handler) {
          retain.push(subscriber);
        }
      }
      subscriptions[channel] = retain;
    } else {
      subscriptions[channel] = [];
    }
  }

  return this;
};