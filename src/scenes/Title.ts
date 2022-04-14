
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Title extends Phaser.Scene {

	constructor() {
		super("Title");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// image
		this.add.image(144, 101, "gamedevjs");

		// text
		const text = this.add.text(451, 101, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Gamedev JS Game Jam\n2022";
		text.setStyle({ "align": "center", "fontFamily": "Arial", "fontSize": "3em" });

		// startGame
		const startGame = this.add.text(214, 229, "", {});
		startGame.text = "Start Game!";
		startGame.setStyle({ "fontSize": "32px" });

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here