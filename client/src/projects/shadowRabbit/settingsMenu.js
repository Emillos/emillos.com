let soundOn = true
let soundOptionText
let fontColor = '#d6a247'

class SettingsMenu extends Phaser.Scene{
  constructor(){
    super('SettingsMenu')
  }

  create(){
    const {width, height} = this.game.config
    this.add.image(width / 2, height / 2, 'box')
    this.add.rectangle(499, 319, 593, 433, 0x5d7205);
    this.add.text(225, 120, 'Settings', { fontSize: '32px', fill: fontColor })
    this.add.text(225, 160, 'Sounds and music:', { fontSize: '20px', fill: fontColor })
    
    soundOn = this.registry.get('soundOn')
    soundOptionText = this.add.text(460, 160, `${soundOn ? 'On' : 'Off'}`, { fontSize: '20px', fill: fontColor })
    .setInteractive()
    .on('pointerdown', () => {
      soundOn = soundOn ? false : true
      soundOptionText.setText(`${soundOn ? 'On' : 'Off'}`)
      this.registry.set('soundOn', soundOn)
    })

    if(this.registry.get('fromScene') == 'menu'){
      this.add.image(100, 160, 'button').setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu')
      })
      this.add.text(50, 152, 'Main Menu', { fontSize: '18px', fill: '#333333' })
    }else{
      this.add.image(100, 160, 'button').setScale(0.7)
      this.add.text(25, 152, '"ESC" to resume', { fontSize: '16px', fill: '#333333' })
    }

    if(this.registry.get('fromScene') == 'game'){
      this.input.keyboard.on('keydown-ESC', function (event) {
        this.scene.switch('Game');
      }, this);
    }
  }
}

export default SettingsMenu