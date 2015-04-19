// states for the BalloonCanvas object
var CREATION = 0;
var AIMING = 1; 


// global context
var context = undefined;

window.onload = function() {
    var canvas = document.getElementById("ballcanvas");
    var b = new BalloonCanvas(canvas);
   
}

/**
 * Balloon representation that shouldn't be mutated
 */
var Balloon = function(x,y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
}

Balloon.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x + 360,
		this.y + 360,
		this.radius,
		0,
		2 * Math.PI,
		false);
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
}

/**
 * Methods for drawing balloons and zap-o-matic trajectory on canvas
 */

var BalloonCanvas = function(canvas) {
    this.balloons = [];
    context = canvas.getContext("2d");
    this.canvas = canvas;
    this.state = AIMING;
    this.trajectory = {x: 0, y: 0};
    var b = this;
    canvas.onclick = function(e) {
	if(b.state === AIMING) {
	    b.createBalloon(e.layerX, e.layerY);
	} else if (b.state === CREATION) {
	    b.setRadius(e.layerX, e.layerY);
	}
    }

    canvas.onmousemove = function(e) {
	if(b.state === AIMING) {
	    b.trajectory.x = e.layerX;
	    b.trajectory.y = e.layerY;
	    b.draw();
	} else {
	    b.drawNewBalloon(e.layerX, e.layerY);
	}
    }
}

BalloonCanvas.prototype.clear = function() {
    context.clearRect(0,0,this.canvas.width, this.canvas.height);
}

BalloonCanvas.prototype.setRadius = function() {
    this.clear();
    this.balloons.push(this.newBalloon.toBalloon())
    console.debug(this.newBalloon);
    this.state = AIMING;
}

BalloonCanvas.prototype.draw = function() {
    this.clear();
    this.drawBalloons();
    this.drawTrajectory();
    console.debug("wat");
}

BalloonCanvas.prototype.drawBalloons = function() {
    for(b in this.balloons) {
	this.balloons[b].draw()
    }
}

BalloonCanvas.prototype.createBalloon = function(x,y) {
    this.state = CREATION;
    var generateColor = function() {
	// Random random = new Random();
	var mix = {
	    "red": 255,
	    "green": 255,
	    "blue": 255}
	
	var red = Math.floor(Math.random() * 256);
	var green = Math.floor(Math.random() * 256);
	var blue = Math.floor(Math.random() * 256);
	
	// mix the color
	if (mix != null) {
            red = Math.round((red + mix.red) / 2);
            green = Math.round((green + mix.green) / 2);
            blue = Math.round((blue + mix.blue) / 2);
	}

	return "rgb(" +red+ ", " +green+ ", " +blue+ ")";
    }
    this.newBalloon = {
	"x": x,
	"y": y,
	"color": generateColor(),
	"radius": 0,
	"toBalloon": function() {
	    return new Balloon(this.x - 360, this.y - 360,
			       this.color, this.radius);
	}
    }

}

BalloonCanvas.prototype.drawNewBalloon = function(x,y) {
    this.newBalloon.radius =
	Math.sqrt(Math.pow(this.newBalloon.x - x,2)
		  + Math.pow(this.newBalloon.y - y, 2));
    this.clear();
    this.drawBalloons();
    this.newBalloon.toBalloon().draw();
}

BalloonCanvas.prototype.drawTrajectory = function() {
    
    this.showXY(this.trajectory.x, this.trajectory.y);
    context.beginPath();
    context.moveTo(360,360);
    context.lineTo(this.trajectory.x, this.trajectory.y);
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
}

BalloonCanvas.prototype.showXY = function(x,y) {
    document.getElementById("xpos").innerText = x -360;
    document.getElementById("ypos").innerText = y -360;
}
