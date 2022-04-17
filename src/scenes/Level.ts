// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import TileMapLayerPhysics from "../components/TileMapLayerPhysics";
import Player from "../prefabs/Player";
import Enemy from "../prefabs/Enemy";
import FollowTarget from "../components/FollowTarget";
/* START-USER-IMPORTS */
import KeyboardInput from "../components/KeyboardInput";
import JustMovement from "../components/JustMovement";
import AnimationV2 from "../components/AnimationV2";
import DepthSortY from "../components/DepthSortY";
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
		const floor_1 = cave_test_map_1.createLayer("floor", ["Gamdev jam cate tiles test 1"], 0, -960);

		// wall_1
		const wall_1 = cave_test_map_1.createLayer("wall", ["Gamdev jam cate tiles test 1"], 0, -960);

		// player
		const player = new Player(this, 159, 436);
		this.add.existing(player);

		// enemy_3
		const enemy_3 = new Enemy(this, 173, 55);
		this.add.existing(enemy_3);

		// silver
		const silver = this.add.image(120, 192, "raw-break-interact", 0);

		// copper
		const copper = this.add.image(200, 192, "raw-break-interact", 8);

		// gold
		const gold = this.add.image(124, -88, "raw-break-interact", 16);

		// lists
		const enemyTeam = [enemy_3];
		const silverList: Array<any> = [];

		// wall_1 (components)
		new TileMapLayerPhysics(wall_1);

		// enemy_3 (components)
		const enemy_3FollowTarget = FollowTarget.getComponent(enemy_3);
		enemy_3FollowTarget.target = player;
		enemy_3FollowTarget.deadRangeX = 35;

		this.floor_1 = floor_1;
		this.wall_1 = wall_1;
		this.player = player;
		this.silver = silver;
		this.copper = copper;
		this.gold = gold;
		this.cave_test_map_1 = cave_test_map_1;
		this.enemyTeam = enemyTeam;
		this.silverList = silverList;

		this.events.emit("scene-awake");
	}

	private floor_1!: Phaser.Tilemaps.TilemapLayer;
	private wall_1!: Phaser.Tilemaps.TilemapLayer;
	public player!: Player;
	private silver!: Phaser.GameObjects.Image;
	private copper!: Phaser.GameObjects.Image;
	private gold!: Phaser.GameObjects.Image;
	private enemyTeam!: Enemy[];
	private silverList!: Array<any>;

	/* START-USER-CODE */
	public platformer_fun!: Phaser.Tilemaps.Tilemap
	cave_test_map_1!: Phaser.Tilemaps.Tilemap
	// Write your code here

	create() {

		this.editorCreate();
		this.player.play('player-front-idle')
		this.floor_1.depth = this.wall_1.y * 2
		this.wall_1.depth = this.wall_1.y * 2
/* 
		const playerKeyboardInput = KeyboardInput.getComponent(this.player)
		const playerMove = JustMovement.getComponent(this.player)
		const playerAnims = AnimationV2.getComponent(this.player)

		playerKeyboardInput.executeLeft = () => {
			playerMove.moveLeft()
			playerAnims.playAnims({
				character: 'player',
				direction: 'left',
				state: 'walk'
			})
		}
		playerKeyboardInput.executeRight = () => {
			playerMove.moveRight()
			playerAnims.playAnims({
				character: 'player',
				direction: 'right',
				state: 'walk'
			})
		}
		playerKeyboardInput.executeUp = () => {
			playerMove.moveUp()
			playerAnims.playAnims({
				character: 'player',
				direction: 'back',
				state: 'walk'
			})
		}
		playerKeyboardInput.executeDown = () => {
			playerMove.moveDown()
			playerAnims.playAnims({
				character: 'player',
				direction: 'front',
				state: 'walk'
			})
		}
		playerKeyboardInput.executeKeyUp = () => {
			playerMove.stayStill()
			playerAnims.playIdleFromWalk()
		} */

		this.physics.add.collider(this.player, this.wall_1);
		this.physics.add.collider(this.player, this.enemyTeam)
		this.physics.add.collider(this.enemyTeam, this.enemyTeam)
		this.physics.add.collider(this.enemyTeam, this.wall_1)
	}

	update()
	{
		this.handleDepthSort()
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

	private handleDepthSort()
	{
		this.children.each(c => {
			const child = c as Phaser.GameObjects.Sprite;

			if(!DepthSortY.getComponent(child))
			{
				return
			}

			child.setDepth(child.y)
		})
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here