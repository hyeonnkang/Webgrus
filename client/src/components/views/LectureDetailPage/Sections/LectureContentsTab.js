import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import LectureContentsList from './LectureContentsList.js'
import LectureContentsPost from './LectureContentsPost.js'

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

const { Panel } = Collapse;
const { Title } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

function LectureContentsTab(props) {
  const user = useSelector(state => state.user)

  const [LectureContents, setLectureContents] = useState([])

  useEffect(() => {
    const variable = {
      lectureId: props.ThisLecture._id
    }

    axios.post('/api/lectureContents/get', variable).then(response => {
      if (response.data.success) {
        setLectureContents(response.data.lectureContents)
        console.log(response.data);
      } else {
        message.error('Lecture List Error! Please contact the site manager')
        window.location.reload();
      }
    })
  }, [])

  var contentsList = (<div></div>)
  var postLectureContent = (<div></div>)

  if (user.userData._id === props.ThisLecture.teacher._id && LectureContents) {
    contentsList = (
      <LectureContentsList LectureContents={LectureContents} />
    )
    postLectureContent = (
      <LectureContentsPost ThisLecture={props.ThisLecture} user={user} />
    )
  } else if (LectureContents) {
    contentsList = (
      <div style={{ width: '100%' }}>
      <Collapse
        bordered={true}
        defaultActiveKey={[1]}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        accordion
      >
        {LectureContents.map((contents, index) => {
          return <Panel header={contents.title} key={index} style={{ fontSize: 'large' }} className="site-collapse-custom-panel">
            <p style={{ fontSize: 'large' }}>{contents.content}</p>
            <br />
            <Meta avatar={<Avatar src={contents.writer.image} />} title={contents.writer.name} description="" />
          </Panel>
        })}
      </Collapse>
      </div>
    )
  }

  return(
    <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Divider><h2>Lecture Contents</h2></Divider>
      {contentsList}
      <br />
      {postLectureContent}
      <Divider />
    </div>
  )
}

export default withRouter(LectureContentsTab);
