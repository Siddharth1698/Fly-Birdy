
var mainState = {
	preload: function(){
		game.load.image('bird','assets/redbird.gif');
		game.load.image('pipe','assets/pipe1.png');
		game.load.audio('jump', 'assets/jump.wav'); 
		game.load.audio('bg', 'assets/bg1.m4a'); 
		game.load.audio('dead', 'assets/dead1.m4a');



	},
	create: function()
	{
		game.stage.backgroundColor = '#ffffff';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bird = game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 600;
		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump,this);
		this.pipes = game.add.group();
		this.timer = game.time.events.loop(2000, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "Score is: ", 
          { font: "30px Arial", fill: "#191970" }); 
        
       
        this.bird.anchor.setTo(-0.2, 0.5); 
        this.jumpSound = game.add.audio('jump'); 
         this.bgSound = game.add.audio('bg'); 
         this.bgSound.play();
           this.deadSound = game.add.audio('dead'); 
			},
			
	update: function()
	{   
		if (this.bird.y < 0 || this.bird.y > 490)
            	this.restartGame();
        if (this.bird.angle < 20)
                this.bird.angle += 1;     
    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitpipe, null, this);
	},
	jump: function()
	{
		if (this.bird.alive == false)
           return;
		this.bird.body.velocity.y = -200;
		var animation = game.add.tween(this.bird);
		animation.to({angle: -20}, 100);
		animation.start(); 
		this.jumpSound.play(); 
	},
	restartGame:function()
	{
		this.bgSound.resume();

		
		game.state.start('main');
		

	},
	addOnePipe:function(x,y)
	{   
		var pipe = game.add.sprite(x,y,'pipe');
		this.pipes.add(pipe);
		game.physics.arcade.enable(pipe);
		pipe.body.velocity.x = -200;
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	addRowOfPipes: function()
	{
		var hole = Math.floor(Math.random()*5)+1;
		for(var i=0;i<8;i++)
		{
		   if(i != hole && i != hole+1)
				{this.addOnePipe(400,i*60+10);}}
			this.score += 1;
			
	

            this.labelScore.text =  "Score is: "+this.score;  
            
            
            
		
	},

	

	hitpipe: function()
	{
		if(this.bird.alive == false)
		{

			return;
		}
		this.bird.alive = false;
        game.time.events.remove(this.timer);

        this.pipes.forEach(function(p){
        	p.body.velocity.x = 0;
        	this.bgSound.pause();
        	
        	this.deadSound.play(); 


        },this);


	},
};


var game = new Phaser.Game(400, 490);
game.state.add('main',mainState);
game.state.start('main');
