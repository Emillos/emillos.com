let baseUrl = 'https://client-images-emillos.s3.eu-west-1.amazonaws.com/shadowrabbit/'
let fontColor = '#d6a247'

class GameOver extends Phaser.Scene {
  constructor () {
      super('GameOver');
  }

  preload() {
    this.load.image('box', `${baseUrl}start_screen.png`)
    this.load.image('button', `${baseUrl}button.png`)
  }

  create(data) {
    const {width, height} = this.game.config
    this.add.image(width / 2, height / 2, 'box')
    this.add.rectangle(499, 319, 593, 433, 0x5d7205);
    this.add.text(300, 140, 'Game Over', { fontSize: '32px', fill: fontColor });
    this.add.text(300, 190, `Score: ${data.score}`, { fontSize: '24px', fill: fontColor });

    this.add.image(100, 160, 'button').setScale(0.7)
    .setInteractive()
    .on('pointerdown', () => { 
      this.scene.start('Game')
    });
    this.add.text(50, 152, 'Try Again', { fontSize: '18px', fill: '#333333' })

  }
}

export default GameOver;