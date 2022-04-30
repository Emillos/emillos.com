import React from 'react'

const HighScores = (props) => {
  return (
    <div id='highscoreWrapper'>
      <div className='highscore'>
          <h3>Highscores</h3>
          <ul>
          {props.scores.map((i, index) => (
            <li className='scoreItem' key={i.name+index}>
              {index + 1}. {i.name} - {i.score}
            </li>
          ))}
        </ul>
      </div>
    </div>)
}

export default HighScores