const fs = require('fs')
const path = require('path')

const projectsPath = './src/projects/' 
const filename = 'footerData.json'

const fetchData = () => {
  const initalFooterData = fs.readFileSync(path.resolve('./src/components/', filename)); 
  let footerData = JSON.parse(initalFooterData)
  fs.readdirSync(projectsPath).forEach(file => {
    const getFile = fs.readFileSync(path.resolve(projectsPath + file +'/', filename));
    footerData = {...footerData, ...JSON.parse(getFile)}
  })
  return footerData
}

const buildFile = (data) => {
  fs.writeFile('footerData.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('footerData has been created');
  });
}

const createFooterData = async () => {
  console.log('Creating footerData')
  const jsonfile = await fetchData()
  await buildFile(jsonfile)
}

createFooterData()
module.exports = createFooterData