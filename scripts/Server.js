/**
* used to expose memebers of a namespace
* @param {string} namespace name
* @param {method} method name
*/
function exposeRun (namespace, method , argArray ) {
  var func = (namespace ? this[namespace][method] : this[method])
  if (argArray && argArray.length) {
    return func.apply(this,argArray);
  }
  else {
    return func();
  }
}

/**
* generate some slides from the data in the ephex store
*/

var Server = (function(ns) {
  /**
   * return stats about how long to do some operation
   */
  ns.dataFetch = function () {
    
    var then = new Date().getTime();
    
    // get the sheet and data
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // all done - but we'll return the data too 
    var now = new Date().getTime();
    return {
      executing:now - then,
      received:then,
      sent:now,
      package:data
    };
    
  };
  return ns;
})(Server || {});