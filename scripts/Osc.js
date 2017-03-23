/**
* draw sine viz 
* @param {Canvas} canvas canvas  to use
* 
*/
function Osc  (ns) {
  var ns= this, canvas_, observations_ =[],  options_ ={
    backgroundColor:'white',
    size:100,
    lineWidth:1,
    lineColor:'#455A64',
    errorColor:'red'
  };
  
  ns.clear = function () {
    canvas_.getContext('2d').clearRect(0,0,canvas_.width,canvas_.height);
    observations_ =[];
  };
  
  ns.init = function (canvas) {
    canvas_ = canvas;
    return ns;
  };
  
  ns.add = function (low,high, value, err) {
    observations_.push ({
      value: (value - (high-low)/2) / (high-low), 
      error:err
    });
    if (observations_.length > options_.size) observations_.shift();
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
    var x = 0,y;
    
    // make graph line
    ctx.lineWidth = options_.lineWidth;
    ctx.strokeStyle = options_.lineColor;
    
    // plot each bar
    observations_.forEach(function (d, i){
      // the buffer values center around 0
      y = -1 * d.value  * height/ 2 + height/2;
      ctx[i ? 'lineTo' : 'moveTo'](x, y);
      x += tickWidth;
    });
    ctx.stroke();
    ctx.restore();
    return ns;
  };

}
    
