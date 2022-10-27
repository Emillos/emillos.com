import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import Game from './game.js'
import GameOver from './gameOver.js'
import Menu from './menu.js'
import Credits from './credits.js'
import SettingsMenu from './settingsMenu.js'
import Preloader from './preloader.js'

const gameWidth = 800
const gameHeight = 540

class App extends Component {
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      canvasStyle:{
        position:"absolute",
        top:0
      },
      parent: 'phaser',
      title: 'a Rabbit and its Shadow',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      dom: {
        createContainer: true
      },
      input: {
        queue: true
      },
      scene: [Preloader, Menu, Game, GameOver, SettingsMenu, Credits]
    }
  }

  render() {
    const { initialize, game } = this.state
    return (
      <div id='shadowRabbit'>
       <IonPhaser game={game} initialize={initialize} />
      </div>
    )
  }
}

export default App;