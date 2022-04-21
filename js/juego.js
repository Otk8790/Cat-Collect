var fondoJuego;
var cursores;
var persona;
var detener = "arriba"

var bala;
var balas;
var tiempoBala = 100; 
var botonDisparo;

var malos;
var timer;
var monedas;

var arboles;

var balaEnemi;
var balasEnemi;
var tempBala = 0; //temporizador de disparo de la bala enemiga
var malosVivos = []; //enemigos vivos

var puntos;
var score = 0;
var contador = 0;
var txtPuntos;
var txtMonedas;
var iconMoneda;

var vidas;
var txtVidas;

var Juego = {

	preload: function() {
			juego.load.image("fondo", "img/bgbig2.png");
		    juego.load.spritesheet("personas", "img/persona3.png", 64, 64);
			juego.load.spritesheet("monedas", "img/coin3.png", 32, 32);
			juego.load.spritesheet("malos", "img/enemy1.png", 96, 114);
			juego.load.image("balas", "img/bullet.png", 24, 24)
			juego.load.spritesheet("kaboom", "img/explode2.png", 128, 128);
			juego.load.image("life", "img/life.png");
			juego.load.image("life1", "img/life2.png");
			juego.load.image("arbol", "img/arbol.png");
			juego.load.image("enemyBullet", "img/enemy-bullet.png", 14, 14);


	},

	create: function() {
			
			fondoJuego = juego.add.tileSprite(0, 0, 1360, 1120, "fondo");
			
			juego.world.setBounds(0, 0, 1360, 1120);
			juego.physics.startSystem(Phaser.Physics.P2JS);
			
			persona = juego.add.sprite(680, 560, "personas");
			persona.anchor.setTo(0.5);
			persona.animations.add("arriba", [0, 1, 2], 10, true);
			persona.animations.add("derecha", [9, 10, 11], 10, true);
			persona.animations.add("izquierda", [3, 4, 5], 10, true);
			persona.animations.add("abajo", [6, 7, 8], 10, true);
			cursores = juego.input.keyboard.createCursorKeys();
			
			//Aqui se crean las balas cada vez que oprimimos SPACEBAR
			botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			balas = juego.add.group();
			//Le damos un cuerpo a las balas
			balas.enableBody = true;
			//Hacemos que detecte las colisiones
			balas.physicsBodyType = Phaser.Physics.ARCADE;
			//Creamos las balas con su respectiva imagen
			balas.createMultiple(1, "balas", 0, false);
			//Le damos el origen, la mitad en "x" y la ultima coordenada en "y"
			balas.setAll("anchor.x", 0.5);
			balas.setAll("anchor.y", 0.5);
			//Tenemos que decirle a las balas que cada vez que se salgan del área del juego seran destruidas
			balas.setAll("outOfBoundsKill", true);
			//Verificamos que las balas estén dentro de los límites del juego
			balas.setAll("checkWorldBounds", true);

			//Enemigos
			malos = juego.add.group();
        	malos.enableBody = true;
        	malos.physicsBodyType = Phaser.Physics.ARCADE;
			
			//Tiempo en el que se generan enemigos
			timer = juego.time.events.loop(5000, crearEnemigo, this);

			balasEnemi = juego.add.group();
			balasEnemi.enableBody = true;
			balasEnemi.physicsBodyType = Phaser.Physics.ARCADE;
			balasEnemi.createMultiple(30, "enemyBullet");
			balasEnemi.setAll("anchor.x", 0.5);
			balasEnemi.setAll("anchor.y", 0.5);
			balasEnemi.setAll("outOfBoundsKill", true);
			balasEnemi.setAll("checkWorldBounds", true);
			
			juego.physics.arcade.enable(persona, Phaser.Physics.ARCADE);
			juego.physics.p2.enable(persona);
			persona.body.collideWorldBounds = true
   			juego.camera.follow(persona);

			//Agregamos el grupo de monedas
			monedas = juego.add.group();
			monedas.enableBody = true;
			monedas.physicsBodyType = Phaser.Physics.ARCADE;

			createMonedas();

			arboles = juego.add.group();
			arboles.enableBody = true;

			for (var i = 0; i < 8; i++){
				var arbol = arboles.create(juego.world.randomX, juego.world.randomY, 'arbol', 80);;
				arbol.anchor.setTo(0.5);
				arbol.body.collideWorldBounds = true;
				arbol.body.immovable = true;
				arbol.physicsBodyType = Phaser.Physics.ARCADE;
				arbol.enableBody = true;
				
			}
			
			//Puntos
			puntos = 0;
			txtPuntos = juego.add.text(10, 10, "Puntos: 0 ", {font: "20px Candara Black", fill: "#FFF"}); 
			txtPuntos.fixedToCamera = true;
			
			contador = 0;
			score = 0;
			iconMoneda = juego.add.group();
			txtMonedas = juego.add.text(40, 33, " = 0", {font: "20px Candara Black", fill: "#FFF"});
			iconMoneda.fixedToCamera = true;
			txtMonedas.fixedToCamera = true; 

			for (var i = 0; i < 1; i++)
		{
			var iconM = iconMoneda.create(25 + (30 * i), 45, "life1");
            iconM.anchor.setTo(0.5, 0.5);
            iconM.alpha = 1;
		}
			
			//Vidas
			vidas = juego.add.group();
			txtVidas = juego.add.text(724, 10, "Vidas ", {font: "20px Candara Black", fill: "#FFF"});
			vidas.fixedToCamera = true;
			txtVidas.fixedToCamera = true;
			
			for (var i = 0; i < 3; i++) 
        {
            var life = vidas.create(720 + (30 * i), 45, "life");
            life.anchor.setTo(0.5, 0.5);
            life.alpha = 1;
		}

		 //Explosion
		 explosions = juego.add.group();
		 explosions.createMultiple(30, "kaboom");
		 explosions.forEach(setupInvader, this);
			
	},

	update: function() {
			
			//Colisiones
			juego.physics.arcade.overlap(persona, monedas, recolectar, null, this);
			juego.physics.arcade.overlap(balasEnemi, persona, colisionEnemi, null, this);
			juego.physics.arcade.collide(malos, arboles);
			

		
			if(persona.alive){

			if(cursores.right.isDown)
			{
			 persona.position.x += 3;
			 persona.animations.play("derecha");
			 
			 var bala;
			 if(botonDisparo.isDown)
			 {
				 if(juego.time.now > tiempoBala)
				 {
					 bala = balas.getFirstExists(false);
				 }
	 
				if(bala)
				{
					//Nos da la posicion de la nave, para disparar desde ella
					bala.reset(persona.x, persona.y);
						bala.body.velocity.x = 600;
					 
					//El tiempo se da en milisegundos
					tiempoEntreBalas = juego.time.now + 100;
				}
			 }

			if(detener != "derecha")
			 {
			 	detener = "derecha";
			 }
			}
			
			else if(cursores.left.isDown)
			{
			 persona.position.x -= 3;
			 persona.animations.play("izquierda");

			

			 var bala;
			 if(botonDisparo.isDown)
			 {
				 if(juego.time.now > tiempoBala)
				 {
					 bala = balas.getFirstExists(false);
				 }
	 
				if(bala)
				{
					//Nos da la posicion de la nave, para disparar desde ella
					bala.reset(persona.x, persona.y);
						bala.body.velocity.x = -600;
					 
					//El tiempo se da en milisegundos
					tiempoEntreBalas = juego.time.now + 100;
				}
			 }
			 
			 if(detener != "izquierda")
			 {
			 	detener = "izquierda";
			 }
			}
			
			else if(cursores.up.isDown)
			{
			 persona.position.y -= 3;
			 persona.animations.play("arriba");
			 
			 var bala;
			 if(botonDisparo.isDown)
			 {
				 if(juego.time.now > tiempoBala)
				 {
					 bala = balas.getFirstExists(false);
				 }
	 
				if(bala)
				{
					//Nos da la posicion de la nave, para disparar desde ella
					bala.reset(persona.x, persona.y);
						bala.body.velocity.y = -600; 
					 
					//El tiempo se da en milisegundos
					tiempoEntreBalas = juego.time.now + 100;
				}
			 }

			 if(detener != "arriba")
			 {
			 	detener = "arriba";
			 }
			}
			
			else if(cursores.down.isDown)
			{
			 persona.position.y += 3;
			 persona.animations.play("abajo");
			 
			 var bala;
			 if(botonDisparo.isDown)
			 {
				 if(juego.time.now > tiempoBala)
				 {
					 bala = balas.getFirstExists(false);
				 }
	 
				if(bala)
				{
					//Nos da la posicion de la nave, para disparar desde ella
					bala.reset(persona.x, persona.y);
						bala.body.velocity.y = 600;		 
					 
					//El tiempo se da en milisegundos
					tiempoEntreBalas = juego.time.now + 100;
				}
			 }

			 if(detener != "abajo")
			 {
			 	detener = "abajo";
			 }
			}
			
			else
			{
			 if(detener != "espera")
			 {
			 	persona.animations.stop();
			 }
			 detener= "espera";
			}

			if (juego.time.now > tempBala){
				fuegoEnemi();
			}
	
			juego.physics.arcade.overlap(balas, malos, colision, null, this);
			juego.physics.arcade.overlap(balasEnemi, persona, colisionEnemi, null, this);
			juego.physics.arcade.collide(persona, arboles);
		}
	}
		
};

function createMonedas(){
	for (var i = 0; i < 50; i++)
    {
			var moneda = monedas.create(juego.world.randomX, juego.world.randomY, 'monedas', 0);
			moneda.body.collideWorldBounds = true;
            moneda.anchor.setTo(0.5, 0.5);
			moneda.animations.add("girar", [0, 1, 2, 3, 4], 10, true);
			moneda.play("girar");
	}

}
			

function crearEnemigo () {

	for (var i = 0; i < 1; i++){
		var malo = malos.create(juego.world.randomX, juego.world.randomY, "malos", 0);
		//Colisiona con el mundo
		malo.body.collideWorldBounds = true;
		malos.forEach(juego.physics.arcade.moveToPointer, juego.physics.arcade, false, 200);
		juego.physics.arcade.moveToObject(malo, persona);
		malo.animations.add("volar", [ 0, 1, 2 ], 10, true);
		malo.play("volar");
	}
}

function colision(bala, malos){
    bala.kill();
    malos.kill();

    puntos += 10;
	txtPuntos.text = "Puntos: " + puntos;

	//Creamos la explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(malos.body.x, malos.body.y);
    explosion.play("kaboom", 30, false, true);

}

function recolectar(persona, monedas){
	monedas.kill();

	score += 1;
	txtMonedas.text = " = " + score;
	contador += 1;
	if(contador == 50){
		juego.state.start("Ganaste");
	}
}

function colisionEnemi(persona, bala){

    bala.kill();

    vida = vidas.getFirstAlive();

    if (vida)
    {
        vida.kill();
    }

	//Creamos la explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(persona.body.x, persona.body.y);
    explosion.play("kaboom", 30, false, true);

	if (vidas.countLiving() < 1)
    {
        persona.kill(); //Sirve para que la nave no aparezca cuando muere
        balasEnemi.callAll("kill");
		juego.state.start("Perdiste");
	}

}

function fuegoEnemi() {
    balaEnemi = balasEnemi.getFirstExists(false);
    malosVivos.length=0;
    malos.forEachAlive(function(malos){
        malosVivos.push(malos);
    });
    
    if (balaEnemi && malosVivos.length > 0)
    {
        var random=juego.rnd.integerInRange(0,malosVivos.length-1);
        var disparo=malosVivos[random];
        balaEnemi.reset(disparo.body.x, disparo.body.y);
        juego.physics.arcade.moveToObject(balaEnemi,persona,120);
        tempBala = juego.time.now + 3000;
    }

}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add("kaboom");

}