
// You can write more code here

/* START OF COMPILED CODE */

import UserComponent from "./UserComponent";
import Phaser from "phaser";

export default class Physics extends UserComponent {
	
	constructor(gameObject: Phaser.GameObjects.Sprite) {
		super(gameObject);
		
		this.gameObject = gameObject;
		(gameObject as any)["__Physics"] = this;
		
		/* START-USER-CTR-CODE */
		//const scene = this.gameObject.scene
		//scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this)
		
		/* END-USER-CTR-CODE */
	}
	
	static getComponent(gameObject: Phaser.GameObjects.Sprite): Physics {
		return (gameObject as any)["__Physics"];
	}
	
	private gameObject: Phaser.GameObjects.Sprite;
	public static: boolean = false;
	public width: number = 0;
	public height: number = 0;
	public offsetX: number = 0;
	public offsetY: number = 0;
	
	/* START-USER-CODE */
	start()
	{
		const scene = this.gameObject.scene
		scene.physics.add.existing(this.gameObject, this.static)

		const body = this.gameObject.body as Phaser.Physics.Arcade.Body
		body.setSize(this.width, this.height)
		body.setOffset(this.offsetX, this.offsetY)
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
