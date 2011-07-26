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
		var pos = this.pos = [40, 50];
		
		var body;
		
		this.init = function()
		{
		}

		this.run = function()
		{
			body = createBall(worldOut, pos[0], pos[1], 10);
			body.SetLinearVelocity(new b2Vec2(100, -100));
		}
		
		this.getBody = function ()
		{
			return body;
		}

		this.reset = function()
		{
			worldOut.DestroyBody(body);
			body = null;
			pos[0] = 40;
			pos[1] = 50;
		}
		
		// draw the ball every frame
		this.draw = function(c)
		{
			if (body)
			{
				drawBody(body, c, "rgba(0, 0, 255, 1)");
			}
			else
			{
				c.fillStyle = "rgba(0, 0, 255, 1)";
				c.beginPath();
				c.moveTo(pos[0], pos[1]);
				c.arc(pos[0], pos[1], 10, 0, Math.PI*2, true);
				c.closePath();
				c.fill();
			}
		}
		
		this.updateanimation = function() {

		}
		
		// update the ball position every frame
		this.update = function()
		{
			if (body)
			{
				pos[0] = body.m_position.x;
				pos[1] = body.m_position.y;
			}
		}
				
	}
	
	/*** The Adamastor class ***/
	function Adamastor(world, position) {
		this.type = 'adamastor';

		var dead = false;
		var liveImgLoaded = false;
		var deadImgLoaded = false;

		var liveImg = new Image();
		liveImg.onload = function() { liveImgLoaded = true; };
		liveImg.src = 'img/shark_live.png';
		
		var deadImg = new Image();
		deadImg.onload = function() { deadImgLoaded = true; };
		deadImg.src = 'img/shark_dead.png';
		
		this.width = 100;
		this.height = 80;
		
		// constants
		var adamastor = this;
		
		// position
		var pos = this.pos = position || [(gs.width / 2)+40, gs.height / 2];
		var startingPos = [pos[0], pos[1]];
		
		var body = this.body = null;
		
		this.init = function() {
			//body = createBox(worldOut, pos[0], pos[1], 50, 50, false);
			//body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [50, 0], [50, 50], [0, 50]]], true);
			adamastor.reset();
		}
		
		// sprite which represents the Adamastor
		// var p = this.p = new Sprite(["center", "center"], {
			// "stand": [["img/adamastor.png", 0],],
		// },
		// function() {
			// p.action("stand");
		// });

		this.getBody = function ()
		{
			return body;
		}

		this.die = function ()
		{
			if (!dead)
			{
				worldOut.DestroyBody(body);
				// body = createPoly(worldOut, startingPos[0], startingPos[1], [[[0, 0], [adamastor.width, 0], [adamastor.width, adamastor.height], [0, adamastor.height]]], false);
				body = createShark(worldOut, startingPos[0], startingPos[1], false);
				body.SetLinearVelocity(new b2Vec2(0, -100));
				body.SetAngularVelocity(5);
				//dumpObject(body);
				dead = true;
			}
		}
		
		// draw the adamastor sprite every frame
		this.draw = function(c)
		{
			if (body && (liveImgLoaded || deadImgLoaded))
			{
				// drawBody(body, c, "rgba(0, 0, 255, 1)");
				c.translate(pos[0] , pos[1] );
				c.rotate(body.GetRotation());
				if (!dead && liveImgLoaded)
				{
					c.drawImage(liveImg, 0, 0, adamastor.width, adamastor.height);
				}
				else if (dead && deadImgLoaded)
				{
					c.drawImage(deadImg, - (adamastor.width/2), - (adamastor.height/2), adamastor.width, adamastor.height);
				}
			}
		}
		
		this.updateanimation = function() {
			// Updates the sprite if necessary
		}
		
		// update the adamastor position every frame
		this.update = function()
		{
			if (body)
			{
				pos[0] = body.m_position.x;
				pos[1] = body.m_position.y;
			}
		}

		this.run = function ()
		{
			// body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [p.width, 0], [p.width, p.height], [0, p.height]]], true);
		}
		
		this.reset = function ()
		{
			dead = false;
			if (body != null)
			{
				worldOut.DestroyBody(body);
			}
			pos[0] = startingPos[0];
			pos[1] = startingPos[1];
			// body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [adamastor.width, 0], [adamastor.width, adamastor.height], [0, adamastor.height]]], true);
			body = createShark(worldOut, startingPos[0], startingPos[1], true);
		}
		
		this.destroy = function ()
		{
			if (body != null)
			{
				worldOut.DestroyBody(body);
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
			
			// body = this.body = createPoly(
				// worldOut,
				// 20,
				// 100,
				// [
					// [[0, 0], [10, 0], [35, 90], [30, 100]],
					// [[35, 90], [300, 140], [300, 150], [30, 100]],
					// [[300, 140], [390, 140], [390, 150], [300, 150]]
				// ],
				// true);
		}
		
		// update this platform's position every frame
		this.update = function() {

		}
		
		// draw this platform's sprite every frame
		this.draw = function(c) {
			//p.draw(c, world.camera(pos));
			if (body)
			{
				drawBody(body, c, "rgba(255, 0, 0, 1)");
			}
		}
		
	}
	
	/*** Platform ***/
	function Object()
	{
		this.type = 'object';
		this.dragging = false;
		
		this._init();
	}

	Object.prototype._init = function ()
	{
		this.pointerDownListeners = [ ];
	}
	
	Object.prototype.addPointerDown = function (obj, func)
	{
		var info = {o: obj, f: func};
		this.pointerDownListeners.push(info);
	}
	
	Object.prototype.removePointerDown = function (obj, func)
	{
		var info = {o: obj, f: func};
		this.pointerDownListeners.splice(this.pointerDownListeners.indexOf(info), 1);
	}
	
	Object.prototype.onPointerDown = function ()
	{
		for (var i = 0; i < this.pointerDownListeners.length; i++)
		{
			this.pointerDownListeners[i].f.call(this.pointerDownListeners[i].o, this);
		}
	}
	
	Object.prototype.setup = function(world, pos)
	{
		this.pos = pos;
		this.world = world;
	}
	
	Object.prototype.init = function()
	{
		//body = this.body = createPoly(worldOut, pos[0], pos[1], [[[0, 0], [width, 0], [width, height], [0, height]]], false);
		//body = this.body = function() {	}
	}
		
	// update this platform's position every frame
	Object.prototype.update = function()
	{
		if (this.body != null)
		{
			this.pos[0] = this.body.m_position.x;
			this.pos[1] = this.body.m_position.y;
		}
	}
		
		// draw this platform's sprite every frame
	Object.prototype.draw = function(c)
	{
	}
		
	Object.prototype.pointerDown = function(i)
	{
		this.onPointerDown();
		// if (!this.body && !this.dragging)
		// {
			// this.dragging = true;
			
			// this.posOffSet[0] = this.pos[0] - gs.pointerPosition[0];
			// this.posOffSet[1] = this.pos[1] - gs.pointerPosition[1];						
		// }			
	}
		
	Object.prototype.pointerMove = function()
	{
		// if (!this.body && this.dragging)
		// {
			// this.pos[0] = gs.pointerPosition[0] + this.posOffSet[0];
			// this.pos[1] = gs.pointerPosition[1] + this.posOffSet[1];
		// }
		
	}
		
	Object.prototype.pointerUp = function(i)
	{
		// if (this.dragging)
		// {
			// this.dragging = false;
		// }
	}

	Object.prototype.run = function ()
	{
		this.droppedPos[0] = this.pos[0];
		this.droppedPos[1] = this.pos[1];
		this.body = this.createBody();
	}

	Object.prototype.reset = function ()
	{
		worldOut.DestroyBody(this.body);
		this.body = null;
		this.pos[0] = this.droppedPos[0];
		this.pos[1] = this.droppedPos[1];
	}
	
	Object.prototype.createBody = function ()
	{
	}

	function Box()
	{
		this.red = r.nextInt(0, 255);
		this.green = r.nextInt(0, 255);
		this.blue = r.nextInt(0, 255);
		
		this.width = 114;
		this.height = 34;

		this.droppedPos = [0,0];
		this.posOffSet = [0,0];

		this.wallImgLoaded = false;
		this.wallImg = new Image()
		this.wallImg.onload = function(box) { return function () { box.wallImgLoaded = true; } }(this);
		this.wallImg.src = "img/wall_tool.png";
	}
	
	Box.prototype = new Object();
	
	Box.prototype.setup = function (world, position, rotation)
	{
		Object.prototype.setup.call(this, world, position);
		
		this.rotation = rotation || 0;
	}

	Box.prototype.draw = function (c)
	{
		var color = "rgba("+ this.red +"," + this.green + "," + this.blue + ", 1)";
		if (this.wallImgLoaded)
		{
			c.translate(this.pos[0], this.pos[1]);
			c.rotate(this.rotation);
			c.drawImage(this.wallImg, 0, 0, this.width, this.height);
		}
		// if (this.body)
		// {
			// drawBody(this.body, c, color);
		// }
	}

	Box.prototype.createBody = function ()
	{
		var box = createPoly(worldOut, this.pos[0], this.pos[1], [[[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]]], true);
		box.SetCenterPosition(new b2Vec2(this.pos[0], this.pos[1]), this.rotation);
		return box;
	}

	Box.prototype.pointerPoly = function()
	{
		var result =
		[
			[this.pos[0], this.pos[1]],
			[this.pos[0] + (Math.cos(this.rotation)*this.width), this.pos[1]+(Math.sin(this.rotation)*this.width)],
			[this.pos[0] + (Math.cos(this.rotation)*this.width) - (Math.sin(this.rotation)*this.height), this.pos[1]+(Math.sin(this.rotation)*this.width) + (Math.sin(this.rotation)*this.height)],
			[this.pos[0] - (Math.sin(this.rotation)*this.height), this.pos[1] + (Math.sin(this.rotation)*this.height)],
		];

		return result;
	}

	function Ramp()
	{
		this.red = r.nextInt(0, 255);
		this.green = r.nextInt(0, 255);
		this.blue = r.nextInt(0, 255);
		
		this.width = 70;
		this.height = 70;

		this.rotation = 0;
		
		this.droppedPos = [0,0];
		this.posOffSet = [0,0];
		
		this.points = [[0, 0],[this.width/5, this.height*3/5],[this.width*2/5, this.height*4/5],[this.width, this.height],[0, this.height]];
		this.bodyPoints =
		[
			[[0, 0],[this.width/5, this.height*3/5],[this.width/5, this.height],[0, this.height]],
			[[(this.width/5) - 1, this.height*3/5],[this.width*2/5, this.height*4/5],[this.width*2/5, this.height],[(this.width/5) - 1, this.height]],
			[[(this.width*2/5) - 1, this.height*4/5],[this.width, this.height],[(this.width*2/5) - 1, this.height]]
		];
	}
	
	Ramp.prototype = new Object();

	Ramp.prototype.setup = function (world, position, rotation)
	{
		Object.prototype.setup.call(this, world, position);
		
		this.rotation = rotation || 0;
	}
	
	Ramp.prototype.draw = function (c)
	{
		var color = "rgba("+ this.red +"," + this.green + "," + this.blue + ", 1)";
		if (this.body)
		{
			drawBody(this.body, c, color);
		}
		else
		{
			var fill = c.fillStyle;
			c.fillStyle = color;
			c.beginPath();
			drawSimplePoly(c, this.pos[0], this.pos[1], this.points);
			c.closePath();
			c.fill();
			c.fillStyle = fill;
		}
	}

	Ramp.prototype.createBody = function ()
	{
		return createPoly(worldOut, this.pos[0], this.pos[1], this.bodyPoints, true);
	}

	Ramp.prototype.pointerPoly = function()
	{
		var absolutePoints = [ ];
		for (var i = 0; i < this.points.length; i++)
		{
			absolutePoints.push([this.pos[0]+this.points[i][0], this.pos[1]+this.points[i][1]]);
		}
		return absolutePoints;
	}

	function Spring()
	{
		this.red = r.nextInt(0, 255);
		this.green = r.nextInt(0, 255);
		this.blue = r.nextInt(0, 255);
		
		this.width = 20;
		this.height = 40;

		this.droppedPos = [0,0];
		this.posOffSet = [0,0];
	}
	
	Spring.prototype = new Object();
	
	Spring.prototype.draw = function (c)
	{
		var color = "rgba("+ this.red +"," + this.green + "," + this.blue + ", 1)";
		if (this.body)
		{
			drawBody(this.body, c, color);
		}
		else
		{
			var fill = c.fillStyle;
			c.fillStyle = color;
			c.beginPath();
			c.rect(this.pos[0],this.pos[1],this.width,this.height);
			c.closePath();
			c.fill();
		
			c.fillStyle = fill;
		}
	}

	Spring.prototype.createBody = function ()
	{
		return createPoly(worldOut, this.pos[0], this.pos[1], [[[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]]], true, 1.2);
	}

	Spring.prototype.pointerBox = function()
	{
		return [this.pos[0], this.pos[1], this.pos[0]+this.width, this.pos[1]+this.height];
	}
		
	
	/*** World ***/
	function World()
	{
		var thisWorld = this;

		var playerWon = false;
		var running = false;
		// how much gravity to apply to objects each frame
		this.gravity = 0.4;
		
		// where the camera is centered
		this.cpos = gs.width / 2;
		
		// background colour
		//var bg = 'rgba(240, 255, 255, 1.0)';
		//var bg = 'white';
		
		var player = this.player = new Ball(this);
		var adamastor = new Adamastor(this, [400 + (Math.random() * 180), 50 + (Math.random() * 200)]);
		
		var platforms = [];
		var objects = [];
		
		// box2d world
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set( -200, -200 );
		worldAABB.maxVertex.Set( gs.width + 200, gs.height + 200 );
		worldOut = new b2World( worldAABB, new b2Vec2( 0, 200 ), true );

		// floor, ceiling, and walls
		// createBox(worldOut, gs.width / 2, gs.height + 200, gs.width, 200); //top
		// createBox(worldOut, gs.width / 2, -200, gs.width, 200); //bottom
		// createBox(worldOut, - 200, gs.height / 2, 200, gs.height); //left
		// createBox(worldOut, gs.width + 200, gs.height / 2, 200, gs.height);	//right

		// var imgBg = new Image();
		// imgBgIsReady = false;
		// imgBg.onload = function() { imgBgIsReady = true; };
		// imgBg.src = 'img/bg.png';
		
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
		
		// this.draw = function (c)
		// {
				// alert("e");
			// if (imgBgIsReady)
			// {
				// alert("d");
				// c.drawImage(imgBg,0,0);
			// }
		// }

		this.startDrag = function (obj)
		{
			if (!running && !playerWon)
			{
				thisWorld.drag = {o: obj, x:obj.pos[0] - gs.pointerPosition[0], y:obj.pos[1] - gs.pointerPosition[1]};
			}
		}

		this.pointerMove = function ()
		{
			if (!running && !playerWon && thisWorld.drag)
			{
				thisWorld.drag.o.pos[0] = gs.pointerPosition[0] + thisWorld.drag.x;
				thisWorld.drag.o.pos[1] = gs.pointerPosition[1] + thisWorld.drag.y;
			}
		}
		
		this.pointerUp = function ()
		{
			thisWorld.drag = null;
		}
		
		this.pointerBox = function()
		{
			return [0, 0, gs.width, gs.height];
		}

		
		this.addRamp = function(pos)
		{
			if (!running && !playerWon)
			{
				var object = new Ramp();
				object.addPointerDown(thisWorld, thisWorld.startDrag);
				object.setup(this, pos);
				objects.push(object);
				gs.addEntity(object);
			}
		} 
		
		this.addWall = function(pos, rotation)
		{
			if (!running && !playerWon)
			{
				var object = new Box();
				object.addPointerDown(thisWorld, thisWorld.startDrag);
				object.setup(this, pos, rotation);
				objects.push(object);
				gs.addEntity(object);
			}
		} 
		
		this.addSpring = function(pos)
		{
			if (!running && !playerWon)
			{
				var object = new Spring();
				object.addPointerDown(thisWorld, thisWorld.startDrag);
				object.setup(this, pos);
				objects.push(object);
				gs.addEntity(object);
			}
		} 
		
		// called every frame to draw the background
		// this.draw = function() {
			// gs.background(bg);
		// }
		
		// called every frame to run the game, collisions, etc.
		this.update = function()
		{
			if (running && !playerWon && player.getBody())
			{
				var m = player.getBody().GetContactList();
				if (m != null)
				{
					while (m != null)
					{
						if (m.other == adamastor.getBody())
						{
							adamastor.die();
							thisWorld.gameEnd();
							break;
						}
						m = m.next;
					}
				}
			}
		}

		this.gameEnd = function ()
		{
			playerWon = true;
			setTimeout(function() { document.getElementById("winScreen").style.display = "block"; }, 3000);
		}
		
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
		
		this.run = function ()
		{
			if (!running && !playerWon)
			{
				running = true;
				player.run();
				adamastor.run();
				for (var i = 0; i < objects.length; i++)
				{
					objects[i].run();
				}
			}
		}
		
		this.reset = function ()
		{
			if (running && !playerWon)
			{
				running = false;
				player.reset();
				adamastor.reset();
				for (var i = 0; i < objects.length; i++)
				{
					objects[i].reset();
				}
			}
		}
		
		this.restart = function ()
		{
			document.getElementById("winScreen").style.display = "none";
			playerWon = false;
			adamastor.destroy();
			gs.delEntity(adamastor);
			adamastor = new Adamastor(this, [400 + (Math.random() * 180), 50 + (Math.random() * 200)]);
			gs.addEntity(adamastor);
			thisWorld.reset();
			for (var i = 0; i < objects.length; i++)
			{
				gs.delEntity(objects[i]);
			}
			objects = [ ];
		}
	}
	
	// preload all of the sprites we will use in this game
	Sprite.preload([
			"img/adamastor.png",
			"img/bg.png"
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
	gameSoup_World.addWall([50,50], Math.PI * 30 / 180);	
}

function createSpring() {
	gameSoup_World.addSpring([50,50]);	
}

function createShark(world, x, y, fixed)
{
	var polyBd = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.localPosition = new b2Vec2(40, 40);
	circle.radius = 40;
	if (!fixed)
	{
		circle.density = 1;
	}
	circle.restitution = 0.5;
	
	polyBd.AddShape(circle);

	var points = [[[60, 20],[100,80],[40,80]]];
	for (var j = 0; j < points.length; j++)
	{
		var polyPoints = points[j];
		var polySd = new b2PolyDef();
		
		if (!fixed) 
			polySd.density = 1;
		
		polySd.vertexCount = polyPoints.length;
		polySd.restitution = 0.5;
		for (var i = 0; i < polyPoints.length; i++)
		{
			polySd.vertices[i].Set(polyPoints[i][0], polyPoints[i][1]);
		}
		polyBd.AddShape(polySd);
	}
	polyBd.position.Set(x,y);
	return world.CreateBody(polyBd)
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
	circle.density = 10;

	circle.friction = 0.01;
	
	//circle.restitution = 0.2;
	circle.restitution = 0.3;
	
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

function drawSimplePoly(ctx, x, y, points)
{
	ctx.moveTo(x, y);
	for (var i = 0; i < points.length; i++)
	{
		ctx.lineTo(x + points[i][0], y + points[i][1]);
	}
	ctx.lineTo(x, y);
}

function launch() {
	gs = new JSGameSoup(document.getElementById("canvas"), 30);
	QGame(gs);
	gs.launch();
}

function doRun()
{
	gameSoup_World.run();
}

function doReset()
{
	gameSoup_World.reset();
}

function doRestart()
{
	gameSoup_World.restart();
}

function dumpObject(obj)
{
	console.log("Dumping object %s", obj);
	for (var key in obj)
	{
		console.log("%s: %s", key, obj[key]);
	}
	console.log("%s dump ended", obj);
}

