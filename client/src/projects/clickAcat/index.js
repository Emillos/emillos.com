import React, { useState, useEffect } from 'react';
import './style.less'
import ScoreBoard from './scoreBoard'
import GameBoard from './gameBoard'
import HighScores from './highScores'
import Conclusion from './conclusion'
import axios from 'axios'
import configs from '../../configs/apiConfigs.json'

const elementStyles = {
  board:{
    width: '500px',
    height: '550px'
  },
  scoreBoard: {
    height: '60px',
    lineHeight:'60px'
  },
  catStyle: {
    bottom: '0',
    left: '200px',
    height: '70px',
    width: '50px'
  }
}

const initialSeconds = 10

const getHighScoresAPI = async (setHighscores) => {
  const req = await axios.get(`${configs.apiBaseUrl}/fetchHighscoreEndpoint?project=clickacat`, {headers: configs.standardHeaders})
  setHighscores(req.data.message)
}

const Front = () => {
  const [ clickCount, setClickCount ] = useState(0)
  const [ timerBool, setTimerBool ] = useState(false)
  const [ seconds, setSeconds ] = useState(initialSeconds)
  const [ showGame, setShowGame ] = useState(true)
  const [ highScores, setHighscores ] = useState([])

  useEffect( async () => {
    await getHighScoresAPI(setHighscores)
  }, [])
  useEffect( () => {
    let interval = null
    if(timerBool && seconds > 0){
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    } else if(seconds <= 0){
      clearInterval(interval)
      setTimerBool(false)
      setShowGame(false)
    }
    return () => clearInterval(interval)
  }, [timerBool, seconds])

  return (
    <div className='main'>
      <div id='gameWrapper' style={elementStyles.board}>
        {showGame ?
          <div>
            <ScoreBoard 
              clickCounter={clickCount} 
              gameSize={elementStyles} 
              seconds={seconds} 
              setTimerBool={setTimerBool}
            />
            <GameBoard 
              clickCounter={clickCount} 
              setClickCounter={setClickCount} 
              gameSize={elementStyles} 
              timer={timerBool}
              setTimer={setTimerBool}
            />
          </div>
          :
          <Conclusion 
            clicks={clickCount}
            setShowGame={setShowGame}
            setSeconds={setSeconds}
            initialSeconds={initialSeconds}
            setClickCount={setClickCount}
            highScores={highScores}
            setHighscores={setHighscores}
          />
        }
      </div>
      <HighScores scores={highScores}/>
    </div>
  )
}

export default Front
