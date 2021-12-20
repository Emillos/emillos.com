import React, { useState } from 'react';


const GameBoard = props => {
  const { clickCounter, setClickCounter,  gameSize: {board, scoreBoard, catStyle}, timer, setTimer} = props
  console.log(props)
  const [catPosition, setCatPosition] = useState(catStyle);
  const [catImage, setCatImage] = useState('https://jngnposwzs-flywheel.netdna-ssl.com/wp-content/uploads/2019/05/Transparent-OrangeWhiteCat-764x1024.png');
  let randomizePos = (min, max) => {
    let pos = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.floor(min))
    return pos
  }

  const unPx = style => {
    return style.replace('px', '')
  }

  const catClicked = () => {
    let newPosition = {
      bottom: randomizePos(0, unPx(board.height) - unPx(scoreBoard.height) - unPx(catStyle.height)) + 'px',
      left: randomizePos(0, unPx(board.width) - unPx(catStyle.width)) + 'px'
    }
    if(!timer){
      setTimer(true)
    }
    setClickCounter(clickCounter + 1)
    setCatPosition({...catStyle, ...newPosition})
  }

  return (
    <div id='gameBoard'>
      <div id='cat' draggable='false' onClick={() => catClicked()} style={catPosition}>
        <img src={catImage} draggable='false'/>
      </div>
    </div>
  )
}

export default GameBoard