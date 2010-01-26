// ==========================================================================
// Project: MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
//require('configurator');
//require('models/core_document_node');
 
/**
Define Log levels
*/
MvoEdge.LOG_ERROR = 40000;
MvoEdge.LOG_WARN = 30000;
MvoEdge.LOG_INFO = 20000;
MvoEdge.LOG_DEBUG = 10000;


/**
  @class
 
  Object logger.
 
  @author {CHE}
  @extends {Object}
  @since {0.1.0}
*/
 
MvoEdge.logger = SC.Object.create(
/** @scope MvoEdge.logger.prototype */ {
 
  errorLogger: undefined,
  warningLogger: undefined,
  infoLogger: undefined,
  debugLogger: undefined,
 
  loggers: [],
 
  /**
    @method
 
    Initialize loggers, set level and add appender(s)

    We use 4 loggers => error, warning, info, debug; each one corresponds to a
    log level. The use of several loggers, one per log level, instead of a
    single global logger, is because log4js does not allow different appenders
    to receive different log levels.
  */
  init: function () {
    
    this.errorLogger = Log4js.getLogger("error");
    this.errorLogger.setLevel(Log4js.Level.ERROR);
    this.loggers.push(this.errorLogger);
    
    this.warningLogger = Log4js.getLogger("warning");
    this.warningLogger.setLevel(Log4js.Level.WARN);
    this.loggers.push(this.warningLogger);
    
    this.infoLogger = Log4js.getLogger("info");
    this.infoLogger.setLevel(Log4js.Level.INFO);
    this.loggers.push(this.infoLogger);
    
    this.debugLogger = Log4js.getLogger("debug");
    this.debugLogger.setLevel(Log4js.Level.DEBUG);
    this.loggers.push(this.debugLogger);
 
    // create appenders according to the configuration in MvoEdge.CONFIG.log
    // (see file core.js)
    var appenders = MvoEdge.configurator.getPath('logParameters.log');
    for (var appender in appenders) {
      if (appenders.hasOwnProperty(appender)) {
        var level = MvoEdge.get(appenders[appender]);
        var appenderObject = undefined;
        switch (appender) {
        // TODO check if the ajax appender is removed in case a server is not available
        case 'ajax':
          appenderObject = new Log4js.AjaxAppender(
              MvoEdge.configurator.getPath('logParameters.logFile'));
          appenderObject.setLayout(new Log4js.BasicLayout());
          //appenderObject.setLayout(new Log4js.JSONLayout());
          break;
        case 'console' :
          appenderObject = new Log4js.ConsoleAppender(false);
          break;
        case 'browserConsole':
          appenderObject = new Log4js.BrowserConsoleAppender(true);
          break;
        }
        if (appenderObject) this._attachAppender(appenderObject, level);
      }
    }
    this.info('end of logger.init');
  },
  
  /**
    @method
 
    Attach the given appender to the appropriate log level logger
 
    It also attaches it to all log levels above it. For example, if log level =
    LOG_INFO, then the appender should also be attached to warningLogger and
    errorLogger.
 
    @private
    @param Object appender
  */
  _attachAppender: function (appender, level) {
    for (var i = 0; i < this.loggers.length; i++) {
      var aLogger = this.loggers[i];
      if (aLogger.level.level >= level) {
        aLogger.addAppender(appender);
      }
    }
  },
  
  error: function (message) {
    this.errorLogger.error(message);
  },
 
  warning: function (message) {
    this.warningLogger.warn(message);
  },
 
  info: function (message) {
    this.infoLogger.info(message);
  },
 
  debug: function (message) {
    this.debugLogger.debug(message);
  },
 
  logException: function (ex, customMessage) {
    var exDetails = "\n\t{";
    for (var key in ex) {
      if (ex.hasOwnProperty(key)) {
        exDetails += "'%@': '%@',\n ".fmt(key, ex[key]);
      }
    }
    if (exDetails.length > 4) {
      // remove ", " at the end of last property
      exDetails = exDetails.substring(0, exDetails.length - 4);
    }
    exDetails += "}\n";
    this.error("Exception Caught %@ \"custom message\": \"%@\""
    .loc(exDetails, customMessage));
  }
 
});
 
