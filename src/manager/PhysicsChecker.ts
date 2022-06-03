import Phaser from "phaser";
import Bullet from "../prefabs/Bullet";
import Enemy from "../prefabs/Enemy";
import PlayerContainer from "../prefabs/PlayerContainer";
import Rock from "../prefabs/Rock";
import eventsCenter from "../EventsCenter";
import { AUDIO_PLAY_EVENTS } from "../types/scenes";
import PSDField from "../prefabs/psdField";
import FollowTarget from "../components/FollowTarget";
import { ENEMY_STATE_KEYS } from "../types/enemyStateKeys";
import { SCENE_SWITCH_EVENTS } from "../types/scenes";

export interface IDataInput {
    player: PlayerContainer,
    wall: Phaser.Tilemaps.TilemapLayer,
    swarm: Phaser.GameObjects.Group,
    bullets: Phaser.GameObjects.Group,
    rocks: Rock[],
    exit: Phaser.GameObjects.Zone,
    psdfield: Phaser.GameObjects.Image[],
    exitzone: Phaser.GameObjects.Zone
}

export default class PhysicsChecker {
    private scene: Phaser.Scene
    private data: IDataInput

    constructor(scene: Phaser.Scene, data: IDataInput)
    {
        this.scene = scene
        this.data = data

        this.playerPairCheck()

        this.swarmSelfCheck()
        this.swarmWall()
        this.swarmRocks()
        this.swarmBullets()
        this.swarmPSDField()

        this.bulletPairCheck()
    }

    private handlePlayerExit()
    {
        // go to chunks
        eventsCenter.emit(SCENE_SWITCH_EVENTS.GO_YOUSURVIVED, "Level")
    }

    private bulletPairCheck()
    {
        const { bullets, wall, rocks } = this.data

        if(!bullets)
        {
            console.error('bullets are not defined in PhysicsChecker')
            return
        }

        if(!wall)
        {
            console.error('bullets are not defined in PhysicsChecker')
            return
        }

        this.scene.physics.add.collider( bullets, wall, this.checkLogicBulletWall, undefined, this );
        this.scene.physics.add.collider( bullets, rocks, this.checkLogicBulletRocks, this.processBulletRocks, this )
    }

    private checkLogicBulletRocks(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const bullet = a as Bullet
		const rock = b as Rock

		bullet.despawn()

		eventsCenter.emit(AUDIO_PLAY_EVENTS.TARGET_HIT)
		rock.damage(1)
    }

    private processBulletRocks(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const rock = b as Rock
		return !rock.isPickable
    }

    private checkLogicBulletWall(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const bullet = a as Bullet
        bullet.despawn()
    }

    private swarmPSDField()
    {
        const { swarm, psdfield } = this.data
        if(!swarm || psdfield)
        {
            console.error('either swarm or field is undefined')
            return
        }

        this.scene.physics.add.collider( swarm, psdfield, this.checkSwarmFieldLogic, undefined, this );
    }

    private checkSwarmFieldLogic(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const enemy = a as Enemy
		const field = b as Phaser.Physics.Arcade.Image
		const fieldCon = field.parentContainer as PSDField
		const follow = FollowTarget.getComponent(enemy)
		follow.deactivate()
		enemy.enrage()

		let ty = 5
		const t = this.scene.tweens.create({
			targets: enemy,
			duration: 200,
			onStart: () => {
				enemy.setSMState(ENEMY_STATE_KEYS.IDLE)
				const b = enemy.body as Phaser.Physics.Arcade.Body
				b.setVelocity(ty)
			},
			onComplete: () => {
				enemy.setSMState(ENEMY_STATE_KEYS.WALK)
			}
		})


		fieldCon.damage(enemy.attack)
		this.scene.time.delayedCall(500, () => {
			if(field.y < enemy.y)
			{
				ty = 4
				t.play()
			}
			else if(field.y > enemy.y)
			{
				ty = -4
				t.play()
			}
		})

    }

    private swarmBullets()
    {
        const { swarm, bullets } = this.data
        if(!swarm || !bullets)
        {
            console.error('either swarm or bullets is undefined')
            return
        }

        this.scene.physics.add.collider( swarm, bullets, this.checkSwarmBulletsLogic, undefined, this );
    }

    private checkSwarmBulletsLogic(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const swarm = a as Enemy
        const bullet = b as Bullet

        bullet.despawn()

		eventsCenter.emit(AUDIO_PLAY_EVENTS.TARGET_HIT)

		swarm.emit('stay-still')
		swarm.despawn()
    }

    private playerPairCheck()
    {
        const { player, wall, rocks, exitzone } = this.data

        if(!player)
        {
            console.error('player container is undefined in PhysicsChecker')
            return
        }

        if(!wall)
        {
            console.error('wall is undefined in PhysicsChecker')
            return
        }

        if(!rocks)
        {
            console.error('rocks array is undefined in PhysicsChecker')
            return
        }

        if(!exitzone)
        {
            console.error('exit zone is undefined in PhysicsChecker')
            return
        }

        this.scene.physics.add.collider( player, wall );
        this.scene.physics.add.collider( player, rocks, this.handlePlayerRocks, this.checkPlayerRocks, this )
        this.scene.physics.add.collider( player, exitzone, this.handlePlayerExit)
    }

    private handlePlayerRocks(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const rocks = b as Rock

		eventsCenter.emit(AUDIO_PLAY_EVENTS.COLLECT)
		rocks.beingPickedUp()
    }

    private checkPlayerRocks(
        a: Phaser.Types.Physics.Arcade.GameObjectWithBody, b: Phaser.Types.Physics.Arcade.GameObjectWithBody
    )
    {
        const rocks = b as Rock
        return rocks.isPickable
    }

    private swarmSelfCheck()
    {
        const { swarm } = this.data
        if(!swarm)
        {
            console.error('either player or wall is undefined')
            return
        }

        this.scene.physics.add.collider( swarm, swarm );
    }

    private swarmWall()
    {
        const { swarm, wall } = this.data
        if(!swarm || !wall)
        {
            console.error('either player or wall is undefined')
            return
        }

        this.scene.physics.add.collider( swarm, wall );
    }

    private swarmRocks()
    {
        const { swarm, rocks } = this.data
        if(!swarm || !rocks)
        {
            console.error('either player or wall is undefined')
            return
        }

        this.scene.physics.add.collider( swarm, rocks );
    }
}