const Phaser = require('phaser')
let baseUrl = 'https://client-images-emillos.s3.eu-west-1.amazonaws.com/shadowrabbit/'

class Preloader extends Phaser.Scene{
  constructor(){
    super('Preloader')
  }
  preload() {
    var progressBar = this.add.graphics()
    var progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5)

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5)

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    })
    assetText.setOrigin(0.5, 0.5)

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%')
        progressBar.clear()
        progressBar.fillStyle(0xffffff, 1)
        progressBar.fillRect(250, 280, 300 * value, 30)
    })
    
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key)
    })
    this.load.on('complete', function () {
        progressBar.destroy()
        progressBox.destroy()
        loadingText.destroy()
        percentText.destroy()
        assetText.destroy()
    })

    this.load.image('box', `${baseUrl}start_screen.png`)
    this.load.image('button', `${baseUrl}button.png`)
    this.load.image('bg', `${baseUrl}dummy_bg.png`)
    this.load.image('carrot', `${baseUrl}carrot.png`)
    this.load.image('carrot2', `${baseUrl}carrot.png`)
    this.load.image('carrotGold', `${baseUrl}carrotGold.png`)
    this.load.image('carrotWhite', `${baseUrl}carrotWhite.png`)
    this.load.image('carrotBlue', `${baseUrl}carrotBlue.png`)
    this.load.image('carrotRed', `${baseUrl}carrotRed.png`)
    this.load.image('colliderSprite',`${baseUrl}collider.png`)
    this.load.image('bgGrass', `${baseUrl}cartoon-bg.png`)
    this.load.image('explodeDotOrange', `${baseUrl}explodeDotOrange.png`)
    this.load.image('explodeDotRed', `${baseUrl}explodeDotRed.png`)

    this.load.spritesheet('rabbitAnim', `${baseUrl}rabbit-anim-spritesheet.png`, { frameWidth: 480, frameHeight: 480 })
    this.load.spritesheet('rabbitAnimShadow', `${baseUrl}rabbit-anim-spritesheet-shadow.png`, { frameWidth: 480, frameHeight: 480 })
    this.load.spritesheet('dustCloudAnim', `${baseUrl}dust-spritesheet.png`, { frameWidth: 100, frameHeight: 100 })

    this.load.audio('music', [`${baseUrl}music.mp3`, `${baseUrl}music.ogg`])
    this.load.audio('crunch_1', [`${baseUrl}crunch_1.mp3`, `${baseUrl}crunch_1.ogg`])
    this.load.audio('crunch_2', [`${baseUrl}crunch_2.mp3`, `${baseUrl}crunch_2.ogg`])
    this.load.audio('thump', [`${baseUrl}thump.mp3`, `${baseUrl}thump.ogg`])
    this.load.audio('explotion', [`${baseUrl}small_explotion.mp3`, `${baseUrl}small_explotion.ogg`])
    this.load.audio('powerup', [`${baseUrl}powerup.mp3`, `${baseUrl}powerup.ogg`])
    this.load.audio('speedup', [`${baseUrl}speedup.mp3`, `${baseUrl}speedup.ogg`])
    this.load.audio('multiplier', [`${baseUrl}multiplier.mp3`, `${baseUrl}multiplier.ogg`])
  }
  create(){

    this.scene.switch('Menu')
  }
}

export default Preloader