
var Client = (function (ns) {
  
  var meter_,averageMeter_, schedule_ = 3000, stopped_ = true, stats_;
  var initialStats_ = {
    roundTrip: {
      count:0,
      cumulative:0
    }
  };
  
  var meterOptions_ = {
      meter: {
        offsets: {
          tick: 8,
          tickLabel: 34,
          value: 0,
          pointer: 44,
          label:-130
        },
        ramp: [{
            stop: 0,
            color: '#303F9F'
          }, {
            stop: .2,
            color: '#388E3C'
          }, {
            stop: .7,
            color: '#FFA000'
          }, {
            stop: 1,
            color: '#D32F2F'
          }],
        colors: {
          background: '#FFFFFF',
          tickLabel: '#212121',
          label:'#212121'
        },
        ticks: {
          major: {
            count: 11
          },
          minor: {
            count: 4,
            width: 1
          },
          pointer: {
            height: 36,
            width: 8
          }
        },
        formatters: {
          value: function(v) {
            return Math.round(v.toString()) + 'ms';
          },
          ideal: function(v) {
            return "";
          }
        }
      }
    };
  
  /**
   * clear the stats
   */
  ns.clear = function () {
    // initialize the counts
    stats_ = JSON.parse(JSON.stringify(initialStats_));
  };
  
  /**
   * set up everything
   */
  ns.init = function () {
    meter_ = new CanvasMeter(DomUtils.elem("meter"));
    averageMeter_ = new CanvasMeter(DomUtils.elem("average-meter"));
    
    // customize the meter
    meter_.setOptions (meterOptions_);
    averageMeter_.setOptions (meterOptions_);
    
    // initialize the counts
    ns.clear();
    
    resetCursor();
    return ns;
  };
  
  /**
   * start polling
   */
  ns.start = function () {
    stopped_ = false;
    circle_(ns.poke);
    return ns;
  };
  
  /**
   * stop polling
   */
  ns.stop = function () {
    stopped_ = true;
    return ns;
  };
  
 
  
  /**
   * provoke some activity and record how long it took
   * @return {Promise
   */
  ns.poke = function () {
    
    var start = new Date().getTime();
    return Provoke.run ("Server", "dataFetch")
    .then (function (result) {
      var now = new Date().getTime();
      // the result should contain info about what the server did
      // {received:stamp , executing:duration , sent:stamp}
      // client->server = start - result.received , server->executing = result.executing, server->client = now = result.sent
      // round trip = now - start
      var roundTrip = now - start;
      stats_.roundTrip.count++;
      stats_.roundTrip.cumulative += roundTrip;
      
      // update the meters
      meter_.draw (roundTrip,0,1000,"","now");
      averageMeter_.draw (stats_.roundTrip.cumulative/stats_.roundTrip.count,0,1000,0,"average");
    });
    
  };
  /**
   * endlessly repeat the same thing
   */
  function  circle_(func) {

    if (!ns.isStopped() ) {
      func()
      .then (function(stopIt) {
        if (stopIt) {
          ns.stop();
        }
        else {
          ns.schedule();
        }
      })
      .then (function () {
          circle_(func);
      });
    }
  };
  
  /**
   * check if the polling is stopped
   * @return {boolean} it is
   */
  ns.isStopped = function () {
    return stopped_;
  };
  /**
  * @param {*} idx will be returned when scheduled time is over
  * @return {Promise} when the wait time is over
  */
  ns.schedule = function (idx) {
    return new Promise (function (resolve, reject) {
      setTimeout ( function () {
        resolve (idx);
      }, schedule_);
    });
  };
  

  function resetCursor() {
    DomUtils.hide ('spinner',true);
  }
  function spinCursor() {
    DomUtils.hide ('spinner',false);
  }
  
  return ns;
})(Client || {});