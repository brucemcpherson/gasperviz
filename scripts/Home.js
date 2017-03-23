/**
* sets up all listeners
* @constructor Home
*/

var Home = (function (ns) {
  'use strict';

  // The initialize function must be run to activate elements
  ns.init = function () {

    DomUtils.elem("clear")
    .addEventListener('click' , function () {
      Client.clear();
    });
    
  };
  
  return ns;
  
})(Home || {});
