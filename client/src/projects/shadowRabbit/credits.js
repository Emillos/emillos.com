let fontColor = '#d6a247'

class Credits extends Phaser.Scene{
  constructor(){
    super('Credits')
  }

  create(data){
    const {width, height} = this.game.config
    this.add.image(width / 2, height / 2, 'box').setScale(1)
    this.add.image(100, 160, 'button').setScale(0.7)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('Menu')
    })
    this.add.rectangle(499, 319, 593, 433, 0x5d7205);
    this.add.text(225, 120, 'Credits & Thanks:', { fontSize: '32px', fill: fontColor })
    this.add.text(225, 160, 'Game design: Filtenborg', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 185, 'Programing: Filtenborg', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 225, 'https://www.dreamstime.com (Artwork)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 250, 'https://www.freepik.com (Artwork)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 275, 'https://clipart-library.com (Artwork)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 300, '"Chewing, Carrot, A.wav" by InspectorJ (Audio)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 325, '"Power Up, Bright, A.wav" by InspectorJ (Audio)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 350, 'https://freesound.org (Audio)', { fontSize: '20px', fill: fontColor })
    this.add.text(225, 375, 'https://stock.adobe.com (Music)', { fontSize: '20px', fill: fontColor })
    this.add.text(50, 152, 'Main Menu', { fontSize: '18px', fill: '#333333' })
  }
}

export default Credits