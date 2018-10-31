/**
* draw sine viz 
* @param {Canvas} canvas canvas  to use
* 
*/
function Osc  (ns) {
  var ns= this, summaryCanvas_ , canvas_, observations_ =[],  summaryCount_ = 0, summary_ =[0,0,0] , options_ = {
    backgroundColor:'white',
    size:100,
    lineWidth:1,
    lineColors:['#455A64','#1976D2','#FF5722'],    // this must equal the number of series
    errorColor:'red',
    legend:['roundtrip', 'transport', 'executing'],
    legendColor:'white',
    legendFont:'8pt sans'
  };
  
  ns.clear = function () {
    canvas_.getContext('2d').clearRect(0,0,canvas_.width,canvas_.height);
    observations_ =[];
    summary_ =[0,0,0];
    summaryCount_ = 0;
  };
  
  ns.init = function (canvas, summaryCanvas) {
    canvas_ = canvas;
    summaryCanvas_ = summaryCanvas;
    return ns;
  };
  
  ns.add = function (low,high, values, err) {
    summaryCount_++;
    observations_.push (values.map(function (d,i) { 
      summary_[i] += d;
      var v= {
        value: d/(high-low), 
        error:err
      };
      return v;
    }));
    if (observations_.length > options_.size) observations_.shift();
    return ns;
  };
  
  ns.drawSummary = function () {
    const ctx = summaryCanvas_.getContext("2d");
    ctx.save();
    // dimensions of canvas
    const width = summaryCanvas_.width;
    const height = summaryCanvas_.height;
    
    // skip the 1st summary
    var x = 0;
    
    summary_.forEach (function (d,i) {
      if (i) {
        var p = d/summary_[0] * width;
        ctx.fillStyle = options_.lineColors[i];
        ctx.fillRect (x,0,p,height);
        ctx.fillStyle = options_.legendColor;
        ctx.font = options_.legendFont;
        ctx.textAlign="center"; 
        ctx.fillText (options_.legend[i],x + p/2,4+height/2);
        x +=p;
      }
    });
    ctx.restore();
    return ns;
  };
  
  ns.draw = function () {
    
    const ctx = canvas_.getContext("2d");
    ctx.save();
    // dimensions of canvas
    const width = canvas_.width;
    const height = canvas_.height;
    
    ctx.fillStyle = options_.backgroundColor;
        
    // fill it
    ctx.fillRect(0, 0, width, height);
    
    // start drawing
    ctx.beginPath();
    
    // each tick moves along
    var tickWidth = width / options_.size;

    
    // make graph line
    ctx.lineWidth = options_.lineWidth;
    
    // plot each bar

    options_.lineColors.forEach (function (d,i) {
      var x=0;
      ctx.beginPath();
      observations_.forEach( function (e,j){
        var y = (1 - e[i].value)  * height;
        ctx[j ? 'lineTo' : 'moveTo'](x, y);
        x += tickWidth;
      });
      ctx.strokeStyle = d;
      ctx.stroke();
    });

    ctx.restore();
    return ns;
  };

}
    
