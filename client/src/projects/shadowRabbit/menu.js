const Phaser = require('phaser')
let settings = {
  sound: true
}

class Menu extends Phaser.Scene{
  constructor(){
    super('Menu')
  }

  create(data){
    if(this.registry.get('soundOn') == undefined){
      this.registry.set('soundOn', settings.sound);
    }

    const {width, height} = this.game.config
    this.add.image(width / 2, height / 2, 'box').setScale(1)
    
    // Start Game
    this.add.image(100, 160, 'button').setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game')
      })
    this.add.text(45, 152, 'Start Game', { fontSize: '18px', fill: '#333333' })

    // Settings
    this.add.image(100, 260, 'button').setScale(0.7)
    .setInteractive()
    .on('pointerdown', () => {
      this.registry.set('fromScene', 'menu')
      this.scene.start('SettingsMenu')
    })
    this.add.text(55, 252, `Settings`, { fontSize: '18px', fill: '#333333' })

      // Credits
    this.add.image(100, 360, 'button').setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Credits')
      })
    this.add.text(62, 352 , 'Credits', { fontSize: '18px', fill: '#333333' })

    this.add.text(45, 510, 'Version: 1.0.0', { fontSize: '12px', fill: '#333333' })

  }
}

export default Menu