import React, { useState, useEffect } from 'react';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Alert, TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload, List } from 'antd'
import {cronToText, textToCron, epochToTime, formatEpoch} from './helpers'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// TODO CLEAN THIS MESSY CODE!!!!1

const { Panel } = Collapse;
const { Dragger } = Upload;
import dummyData from './dummyData.json'
import '../../styles/switchStyle.less'
import { getStyle } from 'antd/es/checkbox/style';

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
}

const Switch = () => {
  const [switchData, setSwitchData] = useState([])
  const [modalOpen, setOpen] = useState(false)
  const [editModalOpen, setEditOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [editData, setEditData] = useState({})
  const [editSwitchData, setEditSwitchData] = useState({})
  const [createData, setCreateData] = useState({})

  const handleModalOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleEditModalOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setEditOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleSelectChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleSelectEditChange = (value, id) => {
    console.log(`selected ${value}`, id);
    let a = Object.assign({}, editSwitchData)
    a[id].unit = value
    setEditSwitchData({...editSwitchData, ...a})
  };

  const handleModalEditCancel = () => {
    console.log('Clicked cancel button');
    setEditOpen(false);
  }

  const handleModalCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  }

  const showModal = () => {
    setOpen(true);
  }

  const showEditModal = () => {
    setEditOpen(true);
  }

  const onNumberChange = (value) => {
    console.log('changed', value);
  }

  const onNumberEditChange = (value, id) => {
    console.log('changed', value,  id);
    setEditSwitchData({...editSwitchData, ...editSwitchData[id]['frequency'] = value})
  }

  const onTimeChange = (time, timeString) => {
    console.log(time, timeString);
  }

  const addMail = () => {
    console.log(createData)
    let a = Object.assign({}, createData)
    if(a.emails){
      console.log('1')
      a.emails = a.emails.concat([a.emailInput])
    } else {
      console.log('2')
      a.emails = [a.emailInput]
    }
    a.emailInput = ''
    setCreateData({...createData, ...a})
  }

  const onEditTimeChange = (time, timeString, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id].time = timeString
    setEditSwitchData({...editSwitchData, ...a})
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  }

  const onEditDateChange = (date, dateString, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id].date = dateString
    setEditSwitchData({...editSwitchData, ...a})
  }

  const getStyle = (id, item) => {
    console.log('id', id, item)
    console.log('doku1', editSwitchData[id].documents)
    let style = {
      'color':'black'
    }
    if(editSwitchData[id].documents){
      console.log('docus', editSwitchData[id].documents)
      if(editSwitchData[id].documents.includes(item)){
        style.color = 'red'
      }
    }
    return style
  }

  const emailInput = (e) => {
    let a = Object.assign({}, createData)
    a.emailInput = e.target.value
    setCreateData({...createData, ...a})
  }
  
  const editClick = (e, item) => {
    console.log('t')
    setEditData(item)
    setEditSwitchData({[item.id]:{}})
    showEditModal()
  }
  const deactivateSwitch = (e, id) => {
    console.log('deactivate switch with id:', id)
  }

  const removeItem = (val, id) => {
    let a = Object.assign({}, editSwitchData)
    console.log('a', a)
    if(a[id].documents && a[id].documents.includes(val)){
      let index = a[id].documents.indexOf(val);
      a[id].documents.splice(index, 1);
    } else {
      a[id].documents = a[id].documents ? a[id].documents.concat([val]) : [val]
    }
    setEditSwitchData({...editSwitchData, ...a})
  }
  const activateSwitch = () => {
    console.log('activate switch')
  }
  const checkInClick = () => {
    console.log('check in')
  }
  const checkForChange = (origVals, newVals) => {
    // origVala is the original value as aerray
    // values is new values as an array
    let changes = []
    for(let i = 0;i<newVals.length;i++){
      if(Boolean(newVals[i])){
        changes.splice(i,0,String(newVals[i]))
      }
    }
    let changeDetected = false
    for(let o = 0;o<changes.length;o++){
      if(!origVals.includes(changes[o])){
        changeDetected = true
      }
    }
    if(changeDetected){
      return (
        <Alert
          message='This section has been modified'
          type={'success'}
        />
      )
    }

    return false

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
      {/* Create Modal*/}
      <Modal
        title="Create new switch"
        open={modalOpen}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleModalOk}>
            Create Switch
          </Button>
        ]}>
        {console.log(createData)}
        <div className='scheduleCreate'>
          <Space wrap>
            <label>Check-in every:</label>
            <InputNumber min={1} defaultValue={1} onChange={onNumberChange} />
            <Select
              defaultValue="hours"
              style={{ width: 120 }}
              onChange={handleSelectChange}
              options={[
                {value: 'Hours', label: 'Hours'}, 
                {value: 'Days', label: 'Days'}, 
                {value: 'Weeks', label: 'Weeks'},
                {value: 'Months', label: 'Months'},
                {value: 'Years', label: 'Years'}
              ]}
            />
          </Space>
          <Space wrap>
            <label>Start time: </label>
            <DatePicker onChange={onDateChange} defaultValue={dayjs('2015/01/01')} />
            <TimePicker onChange={onTimeChange} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
          </Space>
        </div>
        <Divider>Documents</Divider>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload</p>
        </Dragger>
        <Divider>Contacts</Divider>
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Email" onChange={(e) => emailInput(e)} value={createData.emailInput || ''} />
          <Button type="primary" onClick={() => addMail()}>Add Email</Button>
        </Space.Compact>

        {createData.emails && 
          <List
            size="small"
            bordered
            dataSource={createData.emails}
            renderItem={(item) => <List.Item><DeleteOutlined onClick={() => console.log(item)}/>{item}</List.Item>}
          />
        }
      </Modal>
       {/* Edit Modal */}
      <Modal
        title="Edit switch"
        destroyOnClose
        open={editModalOpen}
        footer={[
          <Button key="back" onClick={handleModalEditCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleEditModalOk}>
            Save Changes
          </Button>
        ]}>
          {console.log(editSwitchData)}
          {editData.status &&
            <Space wrap>
              <Button type="primary" danger onClick={(e) => deactivateSwitch(e, editData.id)}>
                Deactivate switch!
              </Button>
            </Space>
          }
          <Divider>Edit Check-in Time</Divider>
            {checkForChange(
              cronToText(editData.checkIn).split(' ').slice(1), 
              [editSwitchData[editData.id]?.frequency, editSwitchData[editData.id]?.unit ]
            )}
            <div className='editScection short'>
              <label>Current: </label>
              <p>{cronToText(editData.checkIn)}</p>
            </div>
            <div className='editScection wide'>
              <p>New:</p>
              <Space wrap>
                <InputNumber 
                  min={1} 
                  defaultValue={cronToText(editData.checkIn).split(' ')[1]} 
                  onChange={(e) => onNumberEditChange(e, editData.id)}
                />
                <Select
                  defaultValue={cronToText(editData.checkIn).split(' ')[2]}
                  onChange={(e) => handleSelectEditChange(e, editData.id)}
                  options={[
                    {value: 'Hours', label: 'Hours'}, 
                    {value: 'Days', label: 'Days'}, 
                    {value: 'Weeks', label: 'Weeks'},
                    {value: 'Months', label: 'Months'},
                    {value: 'Years', label: 'Years'}
                  ]}
                />
              </Space>
            </div>
          <Divider>Edit Start Time</Divider>
          {checkForChange(
              epochToTime(editData.start).split(' '), 
              [editSwitchData[editData.id]?.date, editSwitchData[editData.id]?.time]
            )}
          <div className='editScection short'>
            <label>Current: </label>
            {editData.start > 0 ?
              <p>{epochToTime(editData.start)}</p>
            :
              <p>Switch is active</p>
            }
          </div>
          <div className='editScection wide'>
            <p>New: </p>
            {editData.start > 0 ?
              <Space wrap>
                <DatePicker onChange={(date, dateString) => onEditDateChange(date, dateString, editData.id)} defaultValue={dayjs(epochToTime(editData.start).slice(0, 10))} />
                <TimePicker onChange={(time, timeString) => onEditTimeChange(time, timeString, editData.id)} defaultValue={dayjs(epochToTime(editData.start).slice(10), 'HH:mm:ss')} />
              </Space>
            :
            <p>Deactivate switch to add a start time</p>
          }
          </div>
          <Divider>Edit Documents</Divider>
          <p>Current</p>
          <List
            size="small"
            bordered
            dataSource={editData.documents}
            renderItem={(item) => <List.Item style={getStyle(editData.id, item)}><DeleteOutlined onClick={() => removeItem(item, editData.id)}/>{item}</List.Item>}
          />
          <Space wrap>
          <p>Upload</p>
          </Space>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload</p>
          </Dragger>
          <Divider>Edit Contacts</Divider>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Email" onChange={(e) => emailInput(e)} value={editData.emailInput || ''} />
            <Button type="primary" onClick={() => addMail()}>Add Email</Button>
          </Space.Compact>

          {editData.emails && 
            <List
              size="small"
              bordered
              dataSource={editData.emails}
              renderItem={(item) => <List.Item><DeleteOutlined onClick={() => console.log(item)}/>{item}</List.Item>}
            />
          }
      </Modal>
    </div>
  )
}

export default Switch