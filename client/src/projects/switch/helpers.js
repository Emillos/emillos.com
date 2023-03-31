
export const cronToText = (cronish) => {
  if(cronish == undefined){
    return ''
  }
  const cronishExp = cronish.split(' ');
  const frequency = ["Hour", "Day", "Week", "Month", "Year"] 
  let returnText = ''
  cronishExp.forEach((element, i) => {
    if(element !== '0'){
      returnText = `Every ${element} ${frequency[i]}s`
    }
  })
  return returnText
}

export const textToCronish = (text) => {
  const parts = text.split(' ');
  const frequency = Number(parts[0])
  const unit = parts[1].toLowerCase()

  const units = {
    'hour': {
      'cron': '0 * * * *',
      'max': 24
    },
    'day': {
      'cron': '0 0 * * *',
      'max': 31
    },
    'week': {
      'cron': '0 0 * * 0',
      'max': 7
    },
    'month': {
      'cron': '0 0 1 * *',
      'max': 12
    },
    'year': {
      'cron': '0 0 1 1 *',
      'max': 1000
    }
  };

  const selectedUnit = units[unit];
  const interval = Math.ceil(selectedUnit.max / frequency);
  const cronParts = selectedUnit.cron.split(' ');
  cronParts[0] = `*/${interval}`;

  return cronParts.join(' ');
}

export const epochToTime = (epoch) => {
  const timestamp = epoch * 1000
  const dateObj = new Date(timestamp)

  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1 // add 1 to account for zero-based indexing
  const date = dateObj.getDate()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const seconds = dateObj.getSeconds()

  // Format the date and time components
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Return the formatted date and time
  return `${formattedDate} ${formattedTime}`;
}