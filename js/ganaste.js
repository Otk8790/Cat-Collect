var Ganaste = {

	preload: function(){
	juego.load.image("ganaste", "img/ganaste.jpg");
	juego.load.spritesheet("gato", "img/nais.png", 192, 192);


	},

	create: function(){
	//Vamos a dejar nuestra pantalla de color rojo para indicar que perdimos
		var ganaste = this.add.button(juego.width/2, juego.height/2, "ganaste", this.iniciarJuego, this);
		ganaste.anchor.setTo(0.5);

		var gato = juego.add.sprite(400, 450, "gato");
		gato.anchor.setTo(0.5);
		gato.animations.add("mover", [1, 0, 1, 2], 5, true);
		gato.play("mover");
	},

	iniciarJuego: function(){
		this.state.start("Menu");
	}
};