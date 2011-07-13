/**
	@class QGame - The best game evar!
*/
var worldOut;
var gameSoup_World;

function QGame(gs) {
	// Global vars
	var r = new SeedableRandom();
	var d = new Date;
	r.seed(d.getTime());
	
	/*** The Ball class ***/
	function Ball(world) {
		this.type = 'ball';
		// constants
		var FALL_FRAMES = 2;
		
		// position
		var pos = this.pos = [gs.width / 2, gs.height / 2];
		
		var body;
		
		this.init = function() {
			body = createBall(worldOut, 40, 50, 10);
		}
		
		// sprite which represents the ball
		var p = new Sprite(["center", "bottom"], {
			"stand": [["img/adamastor.png", 0],],
		},
		// callback gets called when everything is loaded
		function() {
			p.action("stand");
		});
		
		// draw the ball every frame
		this.draw = function(c) {
			//p.draw(c, world.camera(pos));
			drawBody(body, c, "rgba(0, 0, 255, 1)");
		}
		
		this.updateanimation = function() {

		}
		
		// update the ball position every frame
		this.update = function() {
			pos[0] = body.m_position.x;
			pos[1] = body.m_position.y;
		}
				
	}
	
	/*** The Adamastor class ***/
	function Adamastor(world, pos) {
		this.type = 'adamastor';
		
		// constants
		var adamastor = this;
		
		// position
		var pos = this.pos = [(gs.width / 2)+40, gs.height / 2];
				
		var body = this.body = null;
		
		this.init = function() {
			//body = createBox(worldOut, pos[0], pos[1], 50, 50, false);
			
		}
		
		// sprite which represents the Adamastor
		var p = this.p = new Sprite(["center", "center"], {
			"stand": [["img/adamastor.png", 0],],
		},
		// callback gets called when everything is loaded
		function() {
			p.action("stand");
			body = adamastor.body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [0, -p.height], [p.width, -p.height], [p.width, 0]]], false);
		});
		
		// draw the adamastor sprite every frame
		this.draw = function(c) {
			p.draw(c, [pos[0],pos[1]]);
			//drawBody(body, c, "rgba(0, 255, 0, 1)");
		}
		
		this.updateanimation = function() {
			// Updates the sprite if necessary
		}
		
		// update the adamastor position every frame
		this.update = function() {
			if (body)
			{
				pos[0] = body.m_position.x;
				pos[1] = body.m_position.y;
			}
		}
				
	}
	
	/*** Platform ***/
	function Platform(world, pos) {
		this.type = 'platform';
		
		// the list of props sitting on this platform
		var props = [];
		
		// current position
		this.pos = pos;
		
		// closureify
		var platform = this;
		
		var body = this.body;
			
		// sprite which represents the Platform
		var p = this.p = new Sprite(["center", "center"], {
			"stand": [["img/adamastor.png", 0],],
		},
		// callback gets called when everything is loaded
		function() {
			p.action("stand");
		});
		
		// called when this entity is added
		this.init = function() {
			
			body = this.body = createPoly(
				worldOut,
				20,
				100,
				[
					[[0, 0], [10, 0], [35, 90], [30, 100]],
					[[35, 90], [300, 140], [300, 150], [30, 100]],
					[[300, 140], [390, 140], [390, 150], [300, 150]]
				],
				true);
		}
		
		// update this platform's position every frame
		this.update = function() {

		}
		
		// draw this platform's sprite every frame
		this.draw = function(c) {
			//p.draw(c, world.camera(pos));
			drawBody(body, c, "rgba(255, 0, 0, 1)");
		}
		
	}
	
	/*** Platform ***/
	function Object(world, pos) {
		this.type = 'object';
				
		// constants
		var red = r.nextInt(0, 255);
		var green = r.nextInt(0, 255);
		var blue = r.nextInt(0, 255);
		
		var width = 50;
		var height = 50;
		
		this.dragging = false;
		
		// current position
		var pos = this.pos = pos;
		
		var posOffSet = [0,0];
		
		// closureify
		var object = this;
		
		var body = this.body;
			
		// sprite which represents the Object
		var p = this.p = new Sprite(["center", "center"], {
			"stand": [["img/adamastor.png", 0],],
		},
		// callback gets called when everything is loaded
		function() {
			//p.action("stand");
		});
		
		// called when this entity is added
		this.init = function() {
			//body = this.body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [width, 0], [width, height], [0, height]]], false);
			//body = this.body = function() {	}
		}
		
		// update this platform's position every frame
		this.update = function() {
			if (body)
			{
				//alert("old: " + pos[0] + " " + pos[1]);
				pos[0] = body.m_position.x;
				pos[1] = body.m_position.y;
				//pos[0] = (body.m_position.x + gs.canvas.height) % gs.canvas.height;
				//pos[1] = (body.m_position.x + gs.canvas.width) % gs.canvas.width;
				//alert("new: " + pos[0] + " " + pos[1]);
			}
		}
		
		// draw this platform's sprite every frame
		this.draw = function(c) {
			//p.draw(c, world.camera(pos));
			//drawBody(body, c, "rgba(0, 255, 0, 1)");
			//drawBody(body, c, "rgba("+ red +"," + green + "," + blue + ", 1)");
			
			var fill = c.fillStyle;
			c.fillStyle = "#444444";
			c.beginPath();
		 	c.rect(pos[0],pos[1],width,height);
		 	c.closePath();
		 	c.fill();
		
			c.fillStyle = fill;
			

		}
		
		this.pointerBox = function() {
			return [pos[0], pos[1], pos[0]+width, pos[1]+height];
		}
		
		this.pointerDown = function(i) {
			//alert("dragging started");
			if (!this.dragging){
				this.dragging = true;
				
				posOffSet[0] = pos[0] - gs.pointerPosition[0];
				posOffSet[1] = pos[1] - gs.pointerPosition[1];						
				
				//body.m_position.x = gs.pointerPosition[0];
				//body.m_position.y = gs.pointerPosition[1];
			}			
		}
		
		this.pointerMove = function() {
			if (this.dragging){
				
				pos[0] = gs.pointerPosition[0] + posOffSet[0];
				pos[1] = gs.pointerPosition[1] + posOffSet[1];
				//body.m_position.x = gs.pointerPosition[0];
				//body.m_position.y = gs.pointerPosition[1];
			}
			
		}
		
		this.pointerUp = function(i) {
			//alert("dragging ended");
			if (this.dragging)
				this.dragging = false;
		}
		
	}
	
	/*** World ***/
	function World() {
		
		this.playerWon = false;
		// how much gravity to apply to objects each frame
		this.gravity = 0.4;
		
		// where the camera is centered
		this.cpos = gs.width / 2;
		
		// background colour
		//var bg = 'rgba(240, 255, 255, 1.0)';
		var bg = 'white';
		
		var player = new Ball(this);
		var adamastor = new Adamastor(this);
		
		var platforms = [];
		var objects = [];
		
		// box2d world
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set( -200, -200 );
		worldAABB.maxVertex.Set( gs.width + 200, gs.height + 200 );
		worldOut = new b2World( worldAABB, new b2Vec2( 0, 200 ), true );

		// floor, ceiling, and walls
		createBox(worldOut, gs.width / 2, gs.height + 200, gs.width, 200); //top
		createBox(worldOut, gs.width / 2, -200, gs.width, 200); //bottom
		createBox(worldOut, - 200, gs.height / 2, 200, gs.height); //left
		createBox(worldOut, gs.width + 200, gs.height / 2, 200, gs.height);	//right

		// entity to invoke box2d step function
		gs.addEntity({
			"update" : function(gs)	{
					worldOut.Step(1/gs.framerate, 1);
				}
		});
		
		// defines a simple screen-relative camera method
		this.camera = function(pos) {
			return [pos[0] - this.cpos + gs.width / 2, pos[1]];
		}
		
		// called when we are first added
		this.init = function() {
			// Added ball to the World
			gs.addEntity(player);
			
			// Added Adamastor to the World
			gs.addEntity(adamastor);
			
			// Static platforms added to the World
			platforms.push(gs.addEntity(new Platform(this, [gs.width / 2, gs.height / 2])));
			
			// Moveable platforms added to the world
			//objects.push
		}
		
		this.addRamp = function(pos) {
			//var adam2 = (new Adamastor(this, [50,50]));
			var object = new Object(this, [50,50]);
			objects.push(object);
			gs.addEntity(object);
		} 
		
		// called every frame to draw the background
		this.draw = function() {
			gs.background(bg);
		}
		
		// called every frame to run the game, collisions, etc.
		this.update = function() {
			//testWinningConditions();
			if (adamastor.body)
				if (adamastor.body.m_position.y+adamastor.p.height/2>gs.height)
				{
					if (!this.playerWon)
					{
						alert("YEAH YOU WON");
						this.playerWon = true;
					}
				/*
				level_one.paused_text =
				{
					draw: function (ctx, gs)
					{
						ctx.font = "bold 32px sans-serif";
						ctx.fillText("GANHASTE!", 300, 300);
					}
				}
				gs.addEntity(level_one.paused_text);
				gameStarted = false;
				*/
				}
		}
		
		/*** mouse/finger detection ***/
		
		/*
		this.pointerDown = function() {
			if (gs.pointerPosition[0] < gs.width / 2) {
				//player.keyDown_37();
			} else {
				//player.keyDown_39();
			}
		}
		
		this.pointerUp = function() {
			//player.keyUp_37();
		}
		
		this.pointerBox = function() {
			return [0, 0, gs.width, gs.height];
		}
		*/
		
		// remove a platform from the world
		this.remove = function(which) {
			platforms.remove(which);
			//console.log(platforms.length);
			gs.delEntity(which);
		}
		
		// add a new random row of platforms to the world
		this.addrow = function(y) {
			//for (var x = player.pos[0] - gs.width / 2; x < player.pos[0] + gs.width / 2; x += X_SEPARATION) {
			//	platforms.push(gs.addEntity(new Platform(this, [x, y])));
			//}
		}
	}
	
	// preload all of the sprites we will use in this game
	Sprite.preload([
			"img/adamastor.png",
		],
		// create the world
		function() { 
			gameSoup_World = new World();
			gs.addEntity(gameSoup_World);
			//gs.addEntity(new World());
		}
	);
}

function createRamp() {
	gameSoup_World.addRamp([50,50]);	
}

function createWall(){
	alert("Creating wall, please wait...");
}

function createPoly(world, x, y, points, fixed, restitution)
{
	var polyBd = new b2BodyDef();

	for (var j = 0; j < points.length; j++)
	{
		var polyPoints = points[j];
		var polySd = new b2PolyDef();
		
		if (!fixed) 
			polySd.density = 1;
		
		polySd.vertexCount = polyPoints.length;
		polySd.restitution = restitution || 0.5;
		for (var i = 0; i < polyPoints.length; i++)
		{
			polySd.vertices[i].Set(polyPoints[i][0], polyPoints[i][1]);
		}
		polyBd.AddShape(polySd);
	}
	polyBd.position.Set(x,y);
	return world.CreateBody(polyBd)
}

function createBox(world, x, y, width, height) {

	var boxSd = new b2BoxDef();

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();

	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);
}

function createBall(world, x, y, rad, fixed)
{
	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = rad;
	circle.density = 1;

	circle.friction = 0.1;
	
	//circle.restitution = 0.2;
	circle.restitution = 0.2;
	
	b2body.AddShape(circle);

	b2body.position.Set(x, y);
	//b2body.linearVelocity.Set( gs.random(-3, 3), gs.random(-3, 3) );

	return world.CreateBody(b2body);
}

function drawBody(body, context, color)
{
	for (var shape = body.GetShapeList(); shape != null; shape = shape.GetNext())
	{
		drawShape(shape, context, color);
	}
}

function drawShape(shape, context, color) {
	context.fillStyle = color;
	context.beginPath();
	switch (shape.m_type)
	{
		case b2Shape.e_circleShape:
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++)
			{
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
			// draw radius
			// context.moveTo(pos.x, pos.y);
			// var ax = circle.m_R.col1;
			// var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			// context.lineTo(pos2.x, pos2.y);

			break;
		case b2Shape.e_polyShape:

			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++)
			{
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);

			break;
	}
	context.closePath();
	context.fill();
}


function launch() {
	gs = new JSGameSoup(document.getElementById("canvas"), 30);
	QGame(gs);
	gs.launch();
}
