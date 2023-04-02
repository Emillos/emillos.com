import React, { useState } from 'react';
import {cronToText, textToCron, epochToTime, formatEpoch, draggerProps} from './helpers'
import { Input, Button, Alert, TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload, List } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const { Dragger } = Upload;

const EditModal = (props) => {
  const {editModalOpen, editData, setEditOpen} = props
  const [editSwitchData, setEditSwitchData] = useState({})
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleEditModalOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setEditOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleSelectEditChange = (value, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id].unit = value
    setEditSwitchData({...editSwitchData, ...a})
  };

  const handleModalEditCancel = () => {
    console.log('Clicked cancel button');
    setEditOpen(false);
  }

  const onNumberEditChange = (value, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id]['frequency'] = value
    setEditSwitchData({...editSwitchData, ...a})
  }

  const onEditTimeChange = (time, timeString, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id].time = timeString
    setEditSwitchData({...editSwitchData, ...a})
  }

  const getStyle = (id, item, component) => {
    let style = {
      'color':'black'
    }
    if(editSwitchData[id]?.[component]){
      if(editSwitchData[id]?.[component].includes(item)){
        style.color = 'red'
      }
    }
    return style
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

  const removeItem = (val, id, component) => {
    let a = Object.assign({}, editSwitchData)
    if(a[id][component] && a[id][component].includes(val)){
      let index = a[id][component].indexOf(val);
      a[id][component].splice(index, 1);
    } else {
      a[id][component] = a[id][component] ? a[id][component].concat([val]) : [val]
    }
    setEditSwitchData({...editSwitchData, ...a})
  }

  const onEditDateChange = (date, dateString, id) => {
    let a = Object.assign({}, editSwitchData)
    a[id].date = dateString
    setEditSwitchData({...editSwitchData, ...a})
  }

  const setInitalSwitchEditData = (editData, editSwitchData) => {
    if(editData.id && !editSwitchData.hasOwnProperty(editData.id)){
      setEditSwitchData({[editData.id]:{}})
    }
  }

  return (
    <Modal
    title="Edit switch"
    destroyOnClose
    open={editModalOpen}
    onCancel={handleModalEditCancel}
    footer={[
      <Button key="back" onClick={handleModalEditCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" loading={confirmLoading} onClick={handleEditModalOk}>
        Save Changes
      </Button>
    ]}>
      {setInitalSwitchEditData(editData, editSwitchData)}
      {/* {console.log('editSwitchData', editSwitchData)} */}
      {editData?.status &&
        <Space wrap>
          <Button type="primary" danger onClick={(e) => deactivateSwitch(e, editData.id)}>
            Deactivate switch!
          </Button>
        </Space>
      }
      <Divider>Edit Check-in Time</Divider>
        {checkForChange(
          cronToText(editData?.checkIn).split(' ').slice(1),
          [editSwitchData[editData?.id]?.frequency, editSwitchData[editData?.id]?.unit ]
        )}
        <div className='editScection short'>
          <label>Current: </label>
          <p>{cronToText(editData?.checkIn)}</p>
        </div>
        <div className='editScection wide'>
          <p>New:</p>
          <Space wrap>
            <InputNumber 
              min={1} 
              defaultValue={cronToText(editData?.checkIn).split(' ')[1]} 
              onChange={(e) => onNumberEditChange(e, editData?.id)}
            />
            <Select
              defaultValue={cronToText(editData?.checkIn).split(' ')[2]}
              onChange={(e) => handleSelectEditChange(e, editData?.id)}
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
          epochToTime(editData?.start).split(' '), 
          [editSwitchData[editData?.id]?.date, editSwitchData[editData?.id]?.time]
        )}
      <div className='editScection short'>
        <label>Current: </label>
        {editData?.start > 0 ?
          <p>{epochToTime(editData?.start)}</p>
        :
          <p>Switch is active</p>
        }
      </div>
      <div className='editScection wide'>
        <p>New: </p>
        {editData?.start > 0 ?
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
        dataSource={editData?.documents}
        renderItem={(item) => <List.Item style={getStyle(editData?.id, item, 'documents')}><DeleteOutlined onClick={() => removeItem(item, editData.id, 'documents')}/>{item}</List.Item>}
      />
      <Space wrap>
      <p>Upload</p>
      </Space>
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single or bulk upload</p>
      </Dragger>
      <Divider>Edit Contacts</Divider>
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder="Email" onChange={(e) => emailInput(e)} value={editData?.emailInput || ''} />
        <Button type="primary" onClick={() => addMail()}>Add Email</Button>
      </Space.Compact>

      {editData?.emails && 
        <List
          size="small"
          bordered
          dataSource={editData?.emails}
          renderItem={(item) => <List.Item style={getStyle(editData?.id, item, 'emails')}><DeleteOutlined onClick={() => removeItem(item, editData.id, 'emails')}/>{item}</List.Item>}
        />
      }
    </Modal>
  )
}

export default EditModal