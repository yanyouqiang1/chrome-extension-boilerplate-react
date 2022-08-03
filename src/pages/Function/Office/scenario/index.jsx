import {render} from "react-dom";
import React from "react";
import { Card,Col, Divider, Row } from 'antd';
import 'antd/dist/antd.css';




const Scenario = () => {
  return (
      <div className="site-card-wrapper" style={{background: "gray"}}>
          <Row gutter={16}>
              <Col span={8}>
                  <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                  </Card>

              </Col>
              <Col span={8}>
                  <Card size="small" title="Small size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                  </Card>
              </Col>
              <Col span={8}>
                  <Card title="Card title" bordered={false}>
                      Card content
                  </Card>
              </Col>              <
              Col span={8}>
                  <Card title="Card title" bordered={false}>
                      Card content
                  </Card>
              </Col>
          </Row>
      </div>
  )
}


render(<Scenario/>, window.document.querySelector('#app-container'));