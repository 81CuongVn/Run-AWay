
// You can write more code here
/* START OF COMPILED CODE */

import Phaser from "phaser";
import KeyboardInput from "../components/KeyboardInput";
import Physics from "../components/Physics";
import JustMovement from "../components/JustMovement";
import DepthSortY from "../components/DepthSortY";
import CameraFollow from "../components/CameraFollow";
import SelectionSquare from "../components/SelectionSquare";
import JustPlayer from "./JustPlayer";
import Gun from "./Gun";
import BackpackPSD from "./BackpackPSD";
/* START-USER-IMPORTS */
import StateMachine from "../stateMachine";
import { PLAYER_STATE } from "../types/playerState";
import { DIRECTION, getDirectionName } from "../types/direction";
import { DARK_BROWN } from "../types/colors";
import eventsCenter from "../EventsCenter";
import { AUDIO_PLAY_EVENTS } from "../types/scenes";

const mudcolor = DARK_BROWN
/* END-USER-IMPORTS */

export default class PlayerContainer extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// player
		const player = new JustPlayer(scene, 0, 0);
		this.add(player);

		// gun
		const gun = new Gun(scene, 0, 0);
		this.add(gun);

		// backpackPSD
		const backpackPSD = new BackpackPSD(scene, 0, 0);
		this.add(backpackPSD);

		// this (components)
		new KeyboardInput(this);
		const thisPhysics = new Physics(this);
		thisPhysics.width = 28;
		thisPhysics.height = 28;
		thisPhysics.offsetX = 18;
		thisPhysics.offsetY = 26;
		const thisJustMovement = new JustMovement(this);
		thisJustMovement.speed = 155;
		new DepthSortY(this);
		new CameraFollow(this);
		new SelectionSquare(this);

		this.player = player;
		this.gun = gun;
		this.backpackPSD = backpackPSD;

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.physicComp = thisPhysics;
		this.movement = thisJustMovement;

		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.Update, this);

		/* END-USER-CTR-CODE */
	}

	public player: JustPlayer;
	public gun: Gun;
	public backpackPSD: BackpackPSD;

	/* START-USER-CODE */

	// Write your code here.
	private stateMachine?: StateMachine
	private physicComp: Physics
	private movement: JustMovement
	private keyboard?: KeyboardInput
	private flipSwitch = false
	private isHold = false
	//@ts-ignore
	private direction: number

	start()
	{
		this.direction = DIRECTION.LEFT
		this.isHold = false
		this.stateMachine = new StateMachine(this, 'player')
		this.stateMachine.addState(PLAYER_STATE.IDLE, {
			onEnter: this.onIdleEnter
		})
		.addState(PLAYER_STATE.WALK, {
			onEnter: this.onWalkEnter,
			onUpdate: this.onWalkUpdate,
			onExit: this.onWalkExit
		})

		this.stateMachine.setState(PLAYER_STATE.IDLE)

		const body = this.player.body as Phaser.Physics.Arcade.Body
		body.pushable = false

		this.keyboard = KeyboardInput.getComponent(this)

		this.assignKeyCommands()
		
	}

	Update(dt: number)
	{
		if(this.stateMachine)
		{
			this.stateMachine.update(dt)
			const selectSquareComp = SelectionSquare.getComponent(this.player)
			selectSquareComp.setDir(this.direction)
		}
	}

	private assignKeyCommands()
	{
		const {keyboard} = this

		if(!keyboard)
		{
			return
		}

		keyboard.executeKeyUp = () => {
			this.stateMachine?.setState(PLAYER_STATE.IDLE)
		}

		keyboard.executeLeft = () => {
			this.setWalkWithDirection(DIRECTION.LEFT)
		}

		keyboard.executeRight = () => {
			this.setWalkWithDirection(DIRECTION.RIGHT)
		}

		keyboard.executeUp = () => {
			this.setWalkWithDirection(DIRECTION.BACK)
		}

		keyboard.executeDown = () => {
			this.setWalkWithDirection(DIRECTION.FRONT)
		}
	}

	private setWalkWithDirection(dir: number)
	{
		this.direction = dir
		this.stateMachine?.setState(PLAYER_STATE.WALK)
	}

	setHoldState(boo: boolean)
	{
		this.isHold = boo
	}

	private onWalkEnter()
	{
		eventsCenter.emit(AUDIO_PLAY_EVENTS.PLAYER_FOOT)
	}

	private onWalkExit()
	{
		eventsCenter.emit(AUDIO_PLAY_EVENTS.PLAYER_FOOT_STOP)
	}

	inMudCondition()
	{
		console.log('in mud con')
		// this.setTint(this.mudcolor)
		this.player.tint = 0x654321;
		const move = JustMovement.getComponent(this.player)
		move.speed = 155 * 0.5
	}

	outMudCondition()
	{
		this.player.clearTint()
		const move = JustMovement.getComponent(this.player)
		move.speed = 155
	}

	/* private handleAimModeAnims(isWalk: boolean)
	{
		const dirname = getDirectionName(this.direction)

		if(!dirname)
		{
			return
		}

		if(isWalk)
		{
			this.playerAnims.playAnims({
				character: 'player',
				direction: dirname,
				state: 'walk',
				holdState: 'hold'
			})
		}
		else
		{
			this.playerAnims.playAnims({
				character: 'player',
				direction: dirname,
				state: 'idle',
				holdState: 'hold'
			})
		}


	} */

	private getHoldStateString()
	{
		if(this.isHold)
		{
			return 'hold'
		}

		return 'none'
	}

	private makePlayerWalk(boo: boolean)
	{
		let walkState = ''
		
		const dirName = getDirectionName(this.direction)

		const holdName = this.getHoldStateString()

		const {direction} = this

		if(!dirName)
		{
			console.warn('direction should be defined')
			return
		}

		// player physically move
		this.handlePlayerMovement()
		
		if(boo)
		{
			walkState = 'walk'
			this.gun.setToWalkWithDir(direction)
			this.backpackPSD.setToWalkWithDir(direction)
		}
		else
		{
			walkState = 'idle'
			this.gun.setToIdleWithDir(direction)
			this.backpackPSD.setToIdleWithDir(direction)
		}

		this.player.play(`player-${dirName}-${walkState}-${holdName}`, true)

	}

	private onIdleEnter()
	{
		this.makePlayerWalk(false)
	}

	private handlePlayerMovement()
	{
		if(this.stateMachine?.isCurrentState(PLAYER_STATE.IDLE))
		{
			return
		}
		
		switch (this.direction) {
			case DIRECTION.BACK: {
				this.movement.moveUp()
				break
			}

			case DIRECTION.FRONT: {
				this.movement.moveDown()
				break
			}

			case DIRECTION.LEFT: {
				this.movement.moveLeft()
				break
			}

			case DIRECTION.RIGHT: {
				this.movement.moveRight()
				break
			}
		}
	}

	private onWalkUpdate()
	{
		this.makePlayerWalk(true)
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
