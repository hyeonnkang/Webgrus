import React, { useState, useEffect } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row, Button, Divider, message } from 'antd';
import axios from 'axios';

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

const { Title } = Typography;
const { Meta } = Card;

function LecturePage(props) {
    let navigate = useNavigate();
    const [Lecture, setLecture] = useState([])

    useEffect(() => {
      axios.get('/api/lectures/getLectures').then(response => {
        if (response.data.success) {
          setLecture(response.data.lectures)
        } else {
          message.error('Lecture Infomation Error! Please contact the site manager')
          navigate('/')
        }
      })
    }, [])

    return (
      <div className="app" style={{ display: 'flex', width: '85%', margin: 'auto' }}>
        <Title level={2} style={{ marginTop: '25px' }}> Lectures </Title>
        <Divider />
        <br />
        <Row gutter={[32, 16]}>
          {Lecture.map((lectures, index) => {
            return <Col lg={6} md={8} xs={24} key={index}>
              <a href={`/lectures/${lectures._id}`}>
                <div>
                  <img style={{ width: '100%' }} src={`http://localhost:3001/${lectures.filePath}`} />
                </div>
                <br />
                <span><h2>{lectures.title}</h2></span>
              </a>
              <br />
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
                <Meta avatar={<Avatar src={lectures.teacher.image} />} title={lectures.teacher.name} description="" />
                {lectures.applicationPeriod ? <h3 className="applicationPeriodMarker" style={{backgroundColor: 'green'}}>모집</h3>
                 : <h3 className="applicationPeriodMarker" style={{backgroundColor: 'coral'}}>마감</h3>}
              </div>
              <br />
            </Col>
          })}
        </Row>
        <br />
        <Divider />
        <br />
        <Divider />
        <a href="/lectures/register">
          <Button type="default" style={{ minWidth: '100%' }}>
            Register new lecture
          </Button>
        </a>
        <Divider />
      </div>
    )
}

export default withRouter(LecturePage);
