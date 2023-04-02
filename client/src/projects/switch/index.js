import React, { useState, useEffect } from 'react';
import { Input, Button, Alert, TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload, List } from 'antd'
import {cronToText, textToCron, epochToTime, formatEpoch} from './helpers'
import EditModal from './editModal';
import CreateModal from './createModal'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { Panel } = Collapse;
import dummyData from './dummyData.json'
import '../../styles/switchStyle.less'

const Switch = () => {
  const [switchData, setSwitchData] = useState([])
  const [modalOpen, setOpen] = useState(false)
  const [editModalOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState({})

  const showModal = () => {
    setOpen(true);
  }

  const showEditModal = () => {
    setEditOpen(true);
  }
  
  const editClick = (e, item) => {
    console.log('editClick')
    setEditData(item)
    showEditModal()
  }

  const activateSwitch = () => {
    console.log('activate switch')
  }
  const checkInClick = () => {
    console.log('check in')
  }

  useEffect( async () => {
    setSwitchData(dummyData.data)
  }, [])
  return (
    <div>
      <Alert
        message='Please note that this project is still under construction, and this project does not look, feel or work as expected yet'
        type={'warning'}
        closable/>
      
      <Divider>The Dead Man Switch!</Divider>
      {switchData.map((item, i) => {
        const {id, status, checkIn, start, invoked} = item
        return(
          <div className='switchBox' key={id}>
            <div className='textBox'>
              <p>Status: <Badge status={status && "proacessing"} color={status ? 'green' : 'red'}/></p>
              <p>Schedule: {cronToText(checkIn)}</p>
              {status &&
                <p>Next check in before: soon</p>
              }
              {invoked > 0 &&
                <p>Was invoked on: {epochToTime(invoked)}</p>
              }
              {start > 0 &&
                <p>Will start: {epochToTime(start)}</p>
              }
              <input type='button' value='Edit' onClick={(e) => editClick(e, item)}/>
            </div>
            <div className='buttonBox'>
              {!status ?
              <input type='button' value='Activate' style={{backgroundColor:'orange'}} onClick={() => activateSwitch()}/>
              :
              <input type='button' value='Check In' onClick={() => checkInClick()}/>
              }              
            </div>
            <Collapse>
              <Panel header="Attached documents" key="1">
                {item.documents.map((doc, i) => {
                  return(
                    <div key={`${doc}${i}`}>{doc}</div>
                  )
                })}
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Contacts" key="2">
                {item.emails.map((mail, i) => {
                  return(
                    <div key={`${mail}${i}`}>{mail}</div>
                  )
                })}
              </Panel>
            </Collapse>
          </div>
        )
      })}
      <div className='newSwitch switchBox' onClick={showModal}>
        Create new switch
      </div>
      <CreateModal 
        modalOpen={modalOpen}
        setOpen={setOpen}
      />
      <EditModal 
        editModalOpen={editModalOpen}
        editData={editData}
        setEditOpen={setEditOpen}
        />
    </div>
  )
}

export default Switch