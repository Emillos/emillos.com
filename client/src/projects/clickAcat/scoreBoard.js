import React from 'react'

const ScoreBoard = props => {
  const { clickCounter, gameSize, seconds, setTimerBool } = props
  return (
  <div id='scoreBoard' style={gameSize.scoreBoard}>
    <div className='clickCounter'>{`Clicks: ${clickCounter}`}</div>
    <div id='timer'>Time: {seconds}</div>
  </div>)
}

export default ScoreBoard