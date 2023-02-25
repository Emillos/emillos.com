import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import data from '../fakeData/fetchAll.json'
import '../styles/itemStyle.less'

const Item = () => {
  const [item, setItem] = useState({});
  let params = useParams();
  //console.log(params)
  useEffect(() => {
    {/* this data will come from a dynamodb query*/}
    let item = {}
    data.data.map(i => {
      if(i.id === params.id){
        item = i
      }
    })
    setItem(item)
  });
  const ping = (e) => {
    console.log(e)
    console.log('x: ',e.pageX, 'y: ', e.pageY)
  }
  return (
    <div className='main'>
      <div id='itemWrapper' onClick={(e) => ping(e)}>
        {item ?
          <div className='itemDetails'>
            <img src={item.url}/>
            <div className='itemData'>
              <div className='itemDataBox'>Eye</div>
            </div>
          </div>
          :
          <div>
            Item not found
          </div>
        }
      </div>
    </div>
  )
}


export default Item