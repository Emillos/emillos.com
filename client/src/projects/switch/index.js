import React, { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

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
  useEffect( async () => {
    setSwitchData(dummyData.data)
  }, [])
  return (
    <div>
      <Divider>The Dead Man Switch!</Divider>
      {switchData.map((item, i) => {
        const {id, status, epoch, invoked} = item
        return(
          <div className='switchBox' key={id}>
            <div className='textBox'>
              <p>Status: <Badge status={status && "processing"} color={status ? 'green' : 'red'}/></p>
              <p>Schedule: {epoch}</p>
              {status &&
                <p>Next check in before: soon</p>
              }
              {invoked &&
                <p>Was invoked on:</p>
              }
              <input type='button' value='Edit' onClick={(e) => editClick(e, item)}/>
            </div>
            <div className='buttonBox'>
              {!status ?
              <input type='button' value='Activate' style={{backgroundColor:'orange'}}/>
              :
              <input type='button' value='Check In' />
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
      <Modal
        title="Create new switch"
        open={modalOpen}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}>
        <div className='scheduleCreate'>
          <Space wrap>
            <label>Check-in every:</label>
            <InputNumber min={1} max={23} defaultValue={1} onChange={onNumberChange} />
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
      <Modal
        title="Edit switch"
        destroyOnClose
        open={editModalOpen}
        onOk={handleEditModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalEditCancel}>
        {editData.id}
      </Modal>
    </div>
  )
}

export default Switch