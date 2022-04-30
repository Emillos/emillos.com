import React, { useState, useEffect } from 'react';
import configs from '../../configs/apiConfigs.json'
import axios from 'axios'

const Conclusion = props => {
  const {initialSeconds, setSeconds, setShowGame, clicks, setClickCount,
  highScores, setHighscores} = props

  const [ userName, setUserName ] = useState('')
  const [ showYay, setShowYay ] = useState(false)
  const [ hideBox, setHideBox ] = useState(false)

  useEffect( () => {
    if ( (highScores.length < 5) || (clicks >= highScores.at(-1).score) ){
      console.log('setting show yay to true')
      setShowYay(true)
    } else {
      setShowYay(false)
    }
  })

  const restart = () => {
    setSeconds(initialSeconds)
    setShowGame(true)
    setClickCount(0)
    setHideBox(false)
  }

  const setHighScore = async () => {
    setHideBox(true)
    const body = {
      project: "clickacat",
      score: clicks,
      userName,
      userId: `${Date.now()}-${userName}`
    }
    const req = await axios.post(`${configs.apiBaseUrl}/setHighscoreEndpoint`, body, {headers: configs.standardHeaders})
    setHighscores(req.data.message)
  }

  const setValue = (e) => {
    setUserName(e.target.value)
  }

  return (
    <div id='conclusion'>
      <h4>{`You made ${clicks} click${clicks > 1 ? 's' : ''}`}</h4>
      {showYay && !hideBox &&
        <div>
          <div>CONGRATULATIONS</div>
          <div>You made it on the highscore!</div>
          <input type='text' placeholder='Name' value={userName} onChange={setValue} />
          <button className='okButton' onClick={setHighScore}>Submit</button>
        </div>
      }
      <button onClick={() => restart()}>Try again</button>
    </div>
  )
}

export default Conclusion