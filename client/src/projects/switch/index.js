import React, { useState, useEffect } from 'react';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Alert, TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload, List } from 'antd'
import {cronToText, textToCron, epochToTime, formatEpoch} from './helpers'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// TODO CLEAN THIS MESSY CODE!!!!1

const { Panel } = Collapse;
const { Dragger } = Upload;
import dummyData from './dummyData.json'
import '../../styles/switchStyle.less'

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
  const [ switchData, setSwitchData ] = useState([])
  const [ modalOpen, setOpen] = useState(false)
  const [ editModalOpen, setEditOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [ modalText, setModalText] = useState('Content of the modal')
  const [ editModalText, setEditModalText] = useState('Content of the modal')
  const [ editData, setEditData ] = useState({})
  const [ updateSwitchData, setUpdateSwitchData ] = useState({})

  const handleModalOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleEditModalOk = () => {
    setEditModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setEditOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleSelectChange = (value) => {
    console.log(`selected ${value}`);
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

  const onTimeChange = (time, timeString) => {
    console.log(time, timeString);
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const editClick = (e, item) => {
    setEditData(item)
    showEditModal()
  }
  const deactivateSwitch = () => {
    console.log('deactivate switch')
  }

  const deleteItem = () => {
    console.log('deleteItem')
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
        message='Please note that this project is still under construction, and may not work as expected'
        type={'warning'}
        closable/>
      
      <Divider>The Dead Man Switch!</Divider>
      {switchData.map((item, i) => {
        const {id, status, checkIn, start, invoked} = item
        return(
          <div className='switchBox' key={id}>
            <div className='textBox'>
              <p>Status: <Badge status={status && "processing"} color={status ? 'green' : 'red'}/></p>
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
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}>
        <div className='scheduleCreate'>
          <Space wrap>
            <label>Check-in every:</label>
            <InputNumber min={1} defaultValue={1} onChange={onNumberChange} />
            <Select
              defaultValue="hours"
              style={{ width: 120 }}
              onChange={handleSelectChange}
              options={[
                {value: 'hours', label: 'Hours'}, 
                {value: 'days', label: 'Days'}, 
                {value: 'weeks', label: 'Weeks'},
                {value: 'Months', label: 'Months'},
                {value: 'years', label: 'Years'}
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
      </Modal>
       {/* Edit Modal */}
      <Modal
        title="Edit switch"
        destroyOnClose
        open={editModalOpen}
        onOk={handleEditModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalEditCancel}>
          {editData.status &&
            <Space wrap>
              <Button type="primary" danger onClick={() => deactivateSwitch()}>
                Deactivate switch!
              </Button>
            </Space>
          }
          <Divider>Edit Check-in Time</Divider>
            <div className='editScection short'>
              <label>Current: </label>
              <p>{cronToText(editData.checkIn)}</p>
            </div>
            <div className='editScection wide'>
              <p>New:</p>
              <Space wrap>
                <InputNumber 
                  min={1} 
                  defaultValue={1} 
                  onChange={onNumberChange}
                />
                <Select
                  defaultValue="hours"
                  onChange={handleSelectChange}
                  options={[
                    {value: 'hours', label: 'Hours'}, 
                    {value: 'days', label: 'Days'}, 
                    {value: 'weeks', label: 'Weeks'},
                    {value: 'Months', label: 'Months'},
                    {value: 'years', label: 'Years'}
                  ]}
                />
              </Space>
            </div>
          <Divider>Edit Start Time</Divider>
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
                <DatePicker onChange={onDateChange} defaultValue={dayjs(epochToTime(editData.start).slice(0, 10))} />
                <TimePicker onChange={onTimeChange} defaultValue={dayjs(epochToTime(editData.start).slice(10), 'HH:mm:ss')} />
              </Space>
            :
            <p>Deactivate switch to add a start time</p>
          }
          </div>
          <Divider>Documents</Divider>
          <p>Current</p>
          <List
            size="small"
            bordered
            dataSource={editData.documents}
            renderItem={(item) => <List.Item><DeleteOutlined onClick={() => deleteItem()}/> {item}</List.Item>}
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
      </Modal>
    </div>
  )
}

export default Switch