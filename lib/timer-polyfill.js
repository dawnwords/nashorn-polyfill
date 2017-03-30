/*
 Source is originated from https://github.com/morungos/java-xmlhttprequest

 Articles about Nashorn:
 - https://blog.codecentric.de/en/2014/06/project-nashorn-javascript-jvm-polyglott/

 How it work:
  in https://github.com/morungos/java-xmlhttprequest, it uses Timer to run setTimeout and setInterval task,
  but they are run in a separate thread of the Timer creates that is different with the main JavaScript thread.

  This implementation uses ScheduledExecutorService instead of Timer so the threads for task scheduling can be
  reused instead of each JavasScript thread create a Timer thread when using Timer.

  And most important thing is this adds global.nashornEventLoop and scheduled tasks only add function callback
  object in eventLoop (ArrayQueue), and it is main JavaScript thread to run these function callback by calling
  `global.nashornEventLoop.process();` at the end of JavaScript Application. It is just like browser or NodeJS
  that event loop is called when the main stack is cleared.

  When runs on server with Promise, remember to call `nashornEventLoop.process()` when waiting for Promise by
  Thread.sleep(), and call `nashornEventLoop.reset()` if server thread (e.g. Servlet thread) decides to be
  timeout so that eventLoop will be clean for next request.
 */
(function nashornEventLoopMain(context) {
  'use strict';
  var eventLoop = context.__NASHORN_EVENT_LOOP__;
  context.setTimeout = eventLoop.setTimeout;
  context.clearTimeout = eventLoop.clearTimeout;
  context.setImmediate = eventLoop.setImmediate;
  context.clearImmediate = eventLoop.clearImmediate;
  context.setInterval = eventLoop.setInterval;
  context.clearInterval = eventLoop.clearInterval;
})(typeof global !== "undefined" && global || typeof self !== "undefined" && self || this);
