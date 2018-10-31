/**
 * IMPORTANT
 * to allow a function to be run from the client side, 
 * add it to the whitelist
 */


/**
* used to expose memebers of a namespace
* @param {string} namespace name
* @param {method} method name
*/
function exposeRun (namespace, method , argArray ) {
  
  // I'm using whitelisting to ensure that only namespaces 
  // authorized to be run from the client are enabled
  // why? to avoid mistakes, or potential poking somehow from the dev tools
  var whitelist = [ 
    {namespace:"Server", method:["dataFetch", "evalCode"]}
  ];
  
  // check allowed
  if (whitelist && !whitelist.some(function(d) {
    return namespace === d.namespace && 
      (!d.method || d.method.some(function(e) { return e===method}));
  })) {
    throw (namespace || "this") + "." + method + " is not whitelisted to be run from the client";
  }
  
  var func = (namespace ? this[namespace][method] : this[method]);
  if (typeof func !== 'function' ) {
    throw (namespace || "this") + "." + method + " should be a function";
  }
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
   * REMEMBER .. anything could be executed here!!
   * even properties service.
   * to disable, remove it from the whitelist
   * evaluate some code sent from client side
   * and wrap it in stats
   * @param {string} code
   */
  ns.evalCode = function(code) {
  /**
   * return stats about how long to do some operation
   */
    var then = new Date().getTime();
    var ok = true;
    try {
      // passing start time in case it's of some use to the code
      var wrap = '(function(arg) {' + code + '})('+then+')';
      var result = eval (wrap);
    }
    catch (err) {
      var result = err;
      var ok =false;
    }
    
    // all done - but we'll return the data too 
    var now = new Date().getTime();
    return {
      executing:now - then,
      received:then,
      sent:now,
      package:result,
      ok:ok
    };
   
    
  }
  ns.dataFetch = function () {
    
    var then = new Date().getTime();
    
    // get the sheet and data
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getDisplayValues();
    
    // all done - but we'll return the data too 
    var now = new Date().getTime();
    return {
      executing:now - then,
      received:then,
      sent:now,
      package:data,
      ok:true
    };
    
  };
  return ns;
})(Server || {});