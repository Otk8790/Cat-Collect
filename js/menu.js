var Menu = {

    preload: function(){
        juego.load.image("fondo", "img/menu.jpg");
        juego.load.image("boton", "img/start1.png");
        juego.load.spritesheet("personas", "img/logo1.png", 192, 192);
        

    },

    create: function(){
        fondo = juego.add.tileSprite(0, 0, 800, 600, "fondo");
        var botonIniciar = juego.add.button(400, 410, "boton", this.iniciarJuego, this);
        botonIniciar.anchor.setTo(0.5);

        var persona = juego.add.sprite(405, 125, "personas");
		persona.anchor.setTo(0.5);
		persona.animations.add("mover", [0, 1, 2], 10, true);
        persona.play("mover");
        
    },

    update: function(){
      
    },

    iniciarJuego: function(){
        this.state.start("Juego");
    },
};