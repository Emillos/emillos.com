import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card, Col, Row } from 'antd';
import '../styles/frontStyle.less'

const { Meta } = Card;
const Front = () => {
  return (
    <div id='front'>
      <Row gutter={16}>
        <Col span={8}>
          <Link to='/clickacat'>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img src='https://client-images-emillos.s3.eu-west-1.amazonaws.com/towerdefence/cat.png' />}>
              <Meta title="Click-A-Cat" description='Game'/>
            </Card>
          </Link> 
        </Col>
        <Col span={8}>
          <Link to='/shadowrabbit'>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src='https://client-images-emillos.s3.eu-west-1.amazonaws.com/shadowrabbit/carrotBlue.png' />}>
              <Meta title="A rabbit and its shadow" description='Game' />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to='/switch'>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src='https://www.shutterstock.com/image-illustration/dirty-torn-pirates-flag-illustration-260nw-1770408863.jpg' />}>
              <Meta title="Dead man switch" description='Tool' />
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export default Front