import React, { useState } from 'react';
import {cronToText, textToCron, epochToTime, formatEpoch, draggerProps} from './helpers'
import { Input, Button, Alert, TimePicker, DatePicker, Space, Select, InputNumber, Divider, Badge, Collapse, Modal, message, Upload, List } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { Dragger } = Upload;

const CreateModal = (props) => {
  const {modalOpen, setOpen} = props
  const [createData, setCreateData] = useState({})
  const [confirmLoading, setConfirmLoading] = useState(false)

  const change = (value, field) => {
    let a = Object.assign({}, createData)
    a[field] = value
    setCreateData({...createData, ...a})
  }

  const handleModalOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleModalCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  }

  const removeMail = (e, val) => {
    let a = Object.assign({}, createData)
    let index = a.emails.indexOf(val);
    a.emails.splice(index, 1);
    setCreateData({...createData, ...a})
  }

  const addMail = () => {
    let a = Object.assign({}, createData)
    if(a.emailInput){
      if(a.emails){
        a.emails = a.emails.concat([a.emailInput])
      } else {
        a.emails = [a.emailInput]
      }
      a.emailInput = ''
      setCreateData({...createData, ...a})
    }
  }

  return (
    <Modal
    title="Create new switch"
    open={modalOpen}
    onCancel={handleModalCancel}
    footer={[
      <Button key="back" onClick={handleModalCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" loading={confirmLoading} onClick={handleModalOk}>
        Create Switch
      </Button>
    ]}>
    <div className='scheduleCreate'>
      <Space wrap>
        <label>Check-in every:</label>
        <InputNumber min={1} defaultValue={1} onChange={(e) => change(e, 'frequency')} />
        <Select
          defaultValue="hours"
          style={{ width: 120 }}
          onChange={(e) => change(e, 'unit')}
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
        <DatePicker onChange={(e, h) => change(h, 'date')} defaultValue={dayjs('2015/01/01')} />
        <TimePicker onChange={(e, h) => change(h, 'time')} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
      </Space>
    </div>
    <Divider>Documents</Divider>
    <Dragger {...draggerProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Support for a single or bulk upload</p>
    </Dragger>
    <Divider>Contacts</Divider>
    <Space.Compact style={{ width: '100%' }}>
      <Input placeholder="Email" onChange={(e) => change(e.target.value, 'emailInput')} value={createData.emailInput || ''} />
      <Button type="primary" onClick={() => addMail()}>Add Email</Button>
    </Space.Compact>

    {createData.emails && 
      <List
        size="small"
        bordered
        dataSource={createData.emails}
        renderItem={(item) => <List.Item><DeleteOutlined onClick={(e) => removeMail(e, item)}/>{item}</List.Item>}
      />
    }
  </Modal>
 )

}

export default CreateModal