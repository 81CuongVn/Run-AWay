// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import TileMapLayerPhysics from "../components/TileMapLayerPhysics";
import Physics from "../components/Physics";
import KeyboardInput from "../components/KeyboardInput";
import JustMovement from "../components/JustMovement";
import Animation from "../components/Animation";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// cave_test_map_1
		const cave_test_map_1 = this.add.tilemap("cave-test-map-1");
		cave_test_map_1.addTilesetImage("Gamdev jam cate tiles test 1", "cave-test-tileset-1");

		// floor_1
		const floor_1 = cave_test_map_1.createLayer("floor", ["Gamdev jam cate tiles test 1"], 0, 0);

		// wall_1
		const wall_1 = cave_test_map_1.createLayer("wall", ["Gamdev jam cate tiles test 1"], 0, 0);

		// player
		const player = this.add.sprite(160, 175, "dude-front-walk-1");

		// enemy
		const enemy = this.add.sprite(136, 71, "swarm-front-walk-1");

		// lists
		const enemyTeam = [enemy];

		// wall_1 (components)
		new TileMapLayerPhysics(wall_1);

		// player (components)
		const playerPhysics = new Physics(player);
		playerPhysics.width = 32;
		playerPhysics.height = 40;
		playerPhysics.offsetX = 16;
		playerPhysics.offsetY = 26;
		new KeyboardInput(player);
		const playerJustMovement = new JustMovement(player);
		playerJustMovement.speed = 100;
		const playerAnimation = new Animation(player);
		playerAnimation.frontWalk = "dude-front-walk";
		playerAnimation.backWalk = "dude-back-walk";
		playerAnimation.leftWalk = "dude-left-walk";
		playerAnimation.rightWalk = "dude-right-walk";

		// enemy (components)
		const enemyPhysics = new Physics(enemy);
		enemyPhysics.width = 32;
		enemyPhysics.height = 32;
		enemyPhysics.offsetX = 16;
		enemyPhysics.offsetY = 32;

		this.floor_1 = floor_1;
		this.wall_1 = wall_1;
		this.player = player;
		this.enemy = enemy;
		this.cave_test_map_1 = cave_test_map_1;
		this.enemyTeam = enemyTeam;

		this.events.emit("scene-awake");
	}

	private floor_1!: Phaser.Tilemaps.TilemapLayer;
	private wall_1!: Phaser.Tilemaps.TilemapLayer;
	public player!: Phaser.GameObjects.Sprite;
	private enemy!: Phaser.GameObjects.Sprite;
	private enemyTeam!: Phaser.GameObjects.Sprite[];

	/* START-USER-CODE */
	public platformer_fun!: Phaser.Tilemaps.Tilemap
	// Write your code here

	create() {

		this.editorCreate();
		this.player.play('dude-front-idle')

		const playerKeyboardInput = KeyboardInput.getComponent(this.player)
		const playerMove = JustMovement.getComponent(this.player)
		const playerAnims = Animation.getComponent(this.player)

		playerKeyboardInput.executeLeft = () => {
			playerMove.moveLeft()
			playerAnims.playLeft()
		}
		playerKeyboardInput.executeRight = () => {
			playerMove.moveRight()
			playerAnims.playRight()
		}
		playerKeyboardInput.executeUp = () => {
			playerMove.moveUp()
			playerAnims.playBack()
		}
		playerKeyboardInput.executeDown = () => {
			playerMove.moveDown()
			playerAnims.playFront()
		}
		playerKeyboardInput.executeKeyUp = () => {
			playerMove.stayStill()
			playerAnims.playIdleFromWalk()
		}

		this.physics.add.collider(this.player, this.wall_1);
	}

	private layerDebug(layer: Phaser.Tilemaps.TilemapLayer)
	{
		const debugGraphics = this.add.graphics().setAlpha(0.75);
		layer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here