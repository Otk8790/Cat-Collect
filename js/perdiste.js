var Perdiste = {

	preload: function(){
	juego.load.image("perdiste", "img/perdiste.jpg");
	juego.load.spritesheet("bat", "img/enemybig.png", 192, 228);

	},

	create: function(){
	//Vamos a dejar nuestra pantalla de color rojo para indicar que perdimos
		var perdiste = this.add.button(juego.width/2, juego.height/2, "perdiste", this.iniciarJuego, this);
		perdiste.anchor.setTo(0.5);

		var bat = juego.add.sprite(400, 450, "bat");
		bat.anchor.setTo(0.5);
		bat.animations.add("mover", [0, 1, 2], 5, true);
		bat.play("mover");
	},

	iniciarJuego: function(){
		this.state.start("Menu");
	}
};