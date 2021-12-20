import React from 'react'

const Conclusion = props => {
  const {initialSeconds, setSeconds, setShowGame, clicks, setClickCount} = props
  const restart = () => {
    setSeconds(initialSeconds)
    setShowGame(true)
    setClickCount(0)
  }
  return (
    <div id='conclusion'>
      <h4>{`You made ${clicks} click${clicks > 1 ? 's' : ''}`}</h4>
      <button onClick={() => restart()}>Try again</button>
    </div>
  )
}

export default Conclusion