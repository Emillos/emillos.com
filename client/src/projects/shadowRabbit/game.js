const Phaser = require('phaser')

const carrotSpecials = [
  {
    effect: 'health',
    image: 'carrotWhite'
  },
  {
    effect: 'multiplier',
    image: 'carrotGold'
  },
  {
    effect: 'speed',
    image: 'carrotBlue'
  },
  {
    effect: 'clear',
    image: 'carrotRed'
  }
]

let initialValues = {
  gameSpeed:2,
  score: 0,
  scoreText: '',
  health: 5,
  healthText: '',
  initialCarrotTimer: 1300,
  initialGameTimer: 1000,
  initialShadowSpeed: 5,
  initialMultiplier:1
}

const shadowSpecs = {
  speed:initialValues.initialShadowSpeed,
  x:400,
  y:295
}

const animFrameRate = 16
let carrotCatchEmitter
let explodeEmit1
let explodeEmit2
let gameSpeed = initialValues.gameSpeed
let score = initialValues.score
let scoreText = initialValues.scoreText
let health = initialValues.health
let healthText = initialValues.healthText
let timerText
let gameTime = 0
let gameIncraseTime = 3
let carrotTimer
let scene
let backgroundMusic
let crunch1
let crunch2
let thump
let multiplier = initialValues.initialMultiplier
let multiplierText
let carrotNumber = 0
let explotion
let powerup
let speedup
let multiplierAudio
let scoreArray = []

class Game extends Phaser.Scene {
  constructor () {
      super('Game');
  }

  create(data) {
    this.populateInitialData()
    this.registry.events.on('changedata', this.updateData, this);

    // music
    crunch1 = this.sound.add('crunch_1', {volume: 0.3})
    crunch2 = this.sound.add('crunch_2', {volume: 0.3})
    powerup = this.sound.add('powerup', {volume: 0.3})
    explotion = this.sound.add('explotion', {volume: 0.7})
    speedup = this.sound.add('speedup', {volume: 0.7})
    thump = this.sound.add('thump')
    multiplierAudio = this.sound.add('multiplier')
    backgroundMusic = this.sound.add('music');
    backgroundMusic.loop = true
    if(this.registry.get('soundOn')){
      backgroundMusic.play();
    }
    this.add.image(400, 280, 'bg')
    scene = this
  
    this.grassGroup = this.add.group({
      key: 'bgGrass',
      setXY: {x:400, y:455}
    })
  
    // rabbit anim
    this.anims.create({
      key: 'rabbitRun',
      frames: this.anims.generateFrameNumbers('rabbitAnim'),
      frameRate: animFrameRate
    });
  
    const rabbitSprite = this.add.sprite(400, 220, 'rabbitAnim').setScale(0.2);
    rabbitSprite.play({ key: 'rabbitRun', repeat: -1});
  
    // shadow anim
    this.anims.create({
      key: 'shadowRun',
      frames: this.anims.generateFrameNumbers('rabbitAnimShadow'),
      frameRate: animFrameRate
    });
  
    this.shadowImg = this.physics.add.sprite(shadowSpecs.x, shadowSpecs.y, 'rabbitAnimShadow').setScale(0.2);
    this.shadowImg.play({ key: 'shadowRun', repeat: -1}) 
    this.shadowImg.flipY = true
    this.shadowImg.body.setAllowGravity(false)
    this.shadowImg.setDepth(1)

    // dustCloud Anim
    this.anims.create({
      key: 'dustCloud',
      frames: this.anims.generateFrameNumbers('dustCloudAnim'),
      frameRate: 8
    });
    const dustCloudSprite = this.add.sprite(360, 240, 'dustCloudAnim').setScale(0.3)
    dustCloudSprite.play({ key: 'dustCloud', repeat: -1})

    this.carrots = this.physics.add.group()
    
    //Keys
    this.keys = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,ESC')

    this.collider = this.physics.add.image(400, 540, 'colliderSprite')
    this.collider.body.setAllowGravity(false)
    this.collider.setScale(8, 1)
    this.collider.visible = false

    // timers and stuff
    this.time.addEvent({ delay: initialValues.initialGameTimer, loop: true, callback: this.updateTime})
    carrotTimer = this.time.addEvent({ delay: initialValues.initialCarrotTimer, loop: true, callback: this.spawnCarrot})
    timerText = this.add.text(300, 16, `Spawn time: ${carrotTimer.delay}`, { fontSize: '20px', fill: '#FFF' });

    this.physics.add.overlap(this.shadowImg, this.carrots, this.collectCarrot, null, this);
    this.physics.add.overlap(this.collider, this.carrots, this.missedCarrot, null, this);
  
    scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#FFF' });
    multiplierText = this.add.text(scoreText.x + scoreText.width + 20, 16, `X ${multiplier}`, { fontSize: '18px', fill: '#f5cb42' });
    healthText = this.add.text(600, 16, `Lives: ${health}`, { fontSize: '32px', fill: '#FFF' });
    
    // Emitters
    carrotCatchEmitter = this.add.particles('carrot2')
    .setDepth(2)
    .createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 600,
      gravityY: 800
    })
    
    explodeEmit1 = this.add.particles('explodeDotOrange')
    .setDepth(2)
    .createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 600,
      gravityY: 800
    })

    explodeEmit2 = this.add.particles('explodeDotRed')
    .setDepth(2)
    .createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 600,
      gravityY: 800
    })

    this.input.keyboard.on('keydown-ESC', function () {
      this.registry.set('fromScene', 'game')
      this.scene.switch('SettingsMenu')
    }, this);
  }

  update(time, delta){
    const { LEFT, RIGHT, UP, DOWN } = this.keys
    const {shadowImg, grassGroup } = this

    if (LEFT.isDown){
      if(this.borderControl(shadowImg.x - 50, 0)){
        shadowImg.setX(shadowImg.x - shadowSpecs.speed, 0)
      }
      shadowImg.flipX = true
    }
    if (DOWN.isDown){
      if(this.borderControl(this.game.config.height, shadowImg.y + 40)){
        shadowImg.setY(shadowImg.y + shadowSpecs.speed, 0)
      }
    }
    if (UP.isDown){
      if(this.borderControl(shadowImg.y, shadowSpecs.y)){
        shadowImg.setY(shadowImg.y - shadowSpecs.speed, 0)
      }
    }
    if (RIGHT.isDown){
      if(this.borderControl(this.game.config.width, shadowImg.x + 50)){
        shadowImg.setX(shadowImg.x + shadowSpecs.speed, 0)
      }
      shadowImg.flipX = false
    }
    
    grassGroup.children.entries.forEach(element => {
      element.x -= gameSpeed
      if(element.x == 300){
        this.grassGroup.create(1290, 455, 'bgGrass');
      }
      if(element.x == -500){
        element.destroy()
      }
    })
  }

  updateTime(){
    gameTime += 1
    if(gameTime % gameIncraseTime == 0 && carrotTimer.delay>800){
      carrotTimer.delay -= 10
      timerText.setText('Spawn time: ' + carrotTimer.delay)
    }
  }
  borderControl(val1, val2){
    return val1 > val2
  }

  specialHealth(){
    health += 1
    healthText.setText('Lives: ' + health)
    if(this.registry.get('soundOn')){
      powerup.play()
    }
    explodeEmit1.active = true
    explodeEmit1.setPosition(healthText.x + (healthText.width / 2), healthText.y + (healthText.height / 2))
    explodeEmit1.setQuantity(10)
    explodeEmit1.explode()
  }

  specialSpeed(){
    this.time.addEvent({ delay: 5000, loop: false, callback: this.endSpeed})
    shadowSpecs.speed += 5
    if(this.registry.get('soundOn')){
      speedup.play()
    }
  }
  endSpeed(){
    shadowSpecs.speed -= 5
  }
  
  specialMultiplier(x,y){
    multiplier += 1
    if(this.registry.get('soundOn')){
      multiplierAudio.play()
    }
    explodeEmit1.active = true
    explodeEmit1.setPosition(multiplierText.x, multiplierText.y)
    explodeEmit1.setQuantity(10)
    explodeEmit1.explode()
  }

  endScoreShow(){
    let scoreItem = scoreArray.shift()
    scoreItem.destroy()
  }

  specialClear(x,y){
    let elements = scene.carrots.children.entries
    let amount = elements.length - 1 
    for(let i=0;i<amount;i++){
      let y = elements[i].y
      let x = elements[i].x
      carrotCatchEmitter.active = true
      carrotCatchEmitter.setPosition(x, y)
      carrotCatchEmitter.explode()
    }
    score += amount * multiplier
    scoreText.setText('Score: ' + score)
    this.cameras.main.shake(200)
    scene.carrots.clear(true, true)
    if(this.registry.get('soundOn')){
      explotion.play()
    }
  }

  collectCarrot(shadow, carrot){
    const {special, y, x} = carrot
    if(special == 'health'){
      this.specialHealth()
      this.handleScore(10,y,x)
    }
    if(special == 'speed'){
      this.specialSpeed()
      this.handleScore(10,y,x)
    }
    if(special == 'multiplier'){
      this.specialMultiplier(x,y)
      this.handleScore(10,y,x)
    }
    if(special == 'clear'){
      this.specialClear(x, y)
      this.handleScore(10,y,x)
    }
    if(!special){
      this.handleScore(1,y,x)
    }
    carrotCatchEmitter.active = true
    carrotCatchEmitter.setPosition(x, y)
    carrotCatchEmitter.explode()
    if(this.registry.get('soundOn') && !special){
      let randomNumber = Phaser.Math.Between(0, 1)
      randomNumber < 1 ? crunch1.play() : crunch2.play()
    }
    carrot.destroy()
  }

  handleScore(point, y, x){
    score += point * multiplier
    scoreText.setText('Score: ' + score)
    multiplierText.setText(`X ${multiplier}`)
    multiplierText.x = scoreText.x + scoreText.width + 20

    let moneyText = this.add.text(x, y, `${point * multiplier}`, { fontSize: '20px', fill: '#FFF' });
    moneyText.setDepth(2)
    this.tweens.add({
      targets: moneyText,
      y: y-50,
      duration: 1000
    })
    scoreArray.push(moneyText)
    this.time.addEvent({ delay: 600, loop: false, callback: this.endScoreShow})
  }

  spawnCarrot(){
    let carrotFlyY = Phaser.Math.Between(-100, -300)
    let carrotFlyX = Phaser.Math.Between(-160, 200)
    let randomRotation = Phaser.Math.Between(0, 360)
    let carrot 
    if((carrotNumber + 1) % 5 == 0){
      let randomNumber = Phaser.Math.Between(0, 3)
      let specialEffect = carrotSpecials[randomNumber]
      carrot = scene.carrots.create(350, 220, specialEffect.image)
      carrot.texture.key = specialEffect.image
      carrot.special = specialEffect.effect
    } else {
      carrot = scene.carrots.create(350, 220, 'carrot')
    }
    carrot.setScale(.4)
    carrot.rotation = randomRotation
    carrot.setBounce(0.2)
    carrot.setCollideWorldBounds(true)
    carrot.setDepth(1)
    carrot.body.setVelocity(carrotFlyX, carrotFlyY)
    carrotNumber += 1
    carrot.name = `carrot${carrotNumber}`
    scene.physics.add.collider(carrot, scene.shadowImg)
    scene.physics.add.collider(carrot, scene.collider)
  }

  missedCarrot(collider, carrot){
    explodeEmit1.active = true
    explodeEmit1.setPosition(carrot.x, carrot.y)
    explodeEmit1.explode()

    explodeEmit2.active = true
    explodeEmit2.setPosition(carrot.x, carrot.y)
    explodeEmit2.explode()
    
    if(this.registry.get('soundOn')){
      thump.play()
    }

    health -= 1
    healthText.setText('Lives: ' + health)
    carrot.destroy()
    if(health <= 0){
      backgroundMusic.stop();
      this.scene.stop('Game')
      this.scene.start('GameOver', { score });
    }
  }

  populateInitialData(){
    gameSpeed = initialValues.gameSpeed
    score = initialValues.score
    scoreText = initialValues.scoreText
    health = initialValues.health
    healthText = initialValues.healthText
    multiplier = initialValues.initialMultiplier
    shadowSpecs.speed = initialValues.initialShadowSpeed
  }
  
  updateData(parent, key, data){
    if(this.registry.get('soundOn')){
      backgroundMusic.play()
    } else {
      backgroundMusic.stop()
    }
  }
}

export default Game;