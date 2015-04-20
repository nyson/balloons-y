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

Balloon.prototype.maxToIntersect = function(nextBalloon) {
    return Math.sqrt(Math.pow(this.x - nextBalloon.x, 2) +
		     Math.pow(this.y - nextBalloon.y, 2))
	- nextBalloon.radius;

}

Balloon.prototype.hasInside = function(nextBalloon) {
    var distance = Math.sqrt(Math.pow(this.x - nextBalloon.x, 2) +
			     Math.pow(this.y - nextBalloon.y, 2));
    return distance < this.radius; 
}
 
Balloon.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x,
		this.y,
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
    var bc = this;
    
    // shoot or finish creating a balloon
    canvas.onclick = function(e) {
	if(bc.state === AIMING) {
	    bc.createBalloon(e.layerX, e.layerY);
	} else if (bc.state === CREATION) {
	    bc.setRadius(e.layerX, e.layerY);
	}
    }

    // aim or create a balloon
    canvas.onmousemove = function(e) {
	if(bc.state === AIMING) {
	    bc.trajectory.x = e.layerX;
	    bc.trajectory.y = e.layerY;
	    bc.draw();
	} else {
	    bc.drawNewBalloon(e.layerX, e.layerY);
	}
    }
}

/**
 * Clear drawing board
 */
BalloonCanvas.prototype.clear = function() {
    context.clearRect(0,0,this.canvas.width, this.canvas.height);
}

/**
 * Set radius of new balloon 
 */
BalloonCanvas.prototype.setRadius = function() {
    this.balloons.push(this.newBalloon)
    this.newBalloon = null;
    this.clear();
    this.drawBalloons();
    this.state = AIMING;
}

/**
 * Draw the entire canvas
 */
BalloonCanvas.prototype.draw = function() {
    this.clear();
    this.drawBalloons();
    this.drawTrajectory();
}

/**
 * Draw all balloons
 */
BalloonCanvas.prototype.drawBalloons = function() {
    for(b in this.balloons) {
	this.balloons[b].draw()
    }
}

/**
 * Find max intersect of balloons, ie how large the argument balloon can be
 * before it intersect with other balloons
 */
BalloonCanvas.prototype.findMaxIntersect = function(balloon) {
    var mi = Infinity;
    for(b in this.balloons) {
	var bmi = balloon.maxToIntersect(this.balloons[b]);
	if(bmi < mi)
	    mi = bmi;
    }

    return mi;
}

/**
 * Start creating a new balloon
 */
BalloonCanvas.prototype.createBalloon = function(x,y) {
    var generateColor = function() {
	var mix = {
	    "red": 255,
	    "green": 255,
	    "blue": 255
	}
	
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
    
    this.newBalloon = new Balloon(x, y, generateColor(), 0);

    for(b in this.balloons) {
	if(this.balloons[b].hasInside(this.newBalloon)) {
	    alert("There's already a balloon there!");
	    this.newBalloon = null;
	    return;
	}
    }

    this.state = CREATION;
    this.newBalloon.maxRadius = this.findMaxIntersect(this.newBalloon);
}

/**
 * Draws the new balloon, according to the current radius
 */
BalloonCanvas.prototype.drawNewBalloon = function(x,y) {
    this.newBalloon.radius =
	Math.sqrt(Math.pow(this.newBalloon.x - x,2)
		  + Math.pow(this.newBalloon.y - y, 2));
    
    if(this.newBalloon.radius > this.newBalloon.maxRadius) {
	this.newBalloon.radius = Math.floor(this.newBalloon.maxRadius);
    }
    
    this.clear();
    this.drawBalloons();
    this.newBalloon.draw();
}

/**
 * Draws a trajectory for the zap-o-matic
 */
BalloonCanvas.prototype.drawTrajectory = function() {
    this.showXY(this.trajectory.x, this.trajectory.y);
    context.beginPath();
    context.moveTo(360,360);
    context.lineTo(this.trajectory.x, this.trajectory.y);
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
}

/**
 * Show x and y coordinates
 */
BalloonCanvas.prototype.showXY = function(x,y) {
    document.getElementById("xpos").innerText = x;
    document.getElementById("ypos").innerText = y;
}
