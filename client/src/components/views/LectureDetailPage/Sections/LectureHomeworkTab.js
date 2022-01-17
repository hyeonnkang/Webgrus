import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import LectureHomeworkList from './LectureHomeworkList.js'
import LectureHomeworkPost from './LectureHomeworkPost.js'

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

function LectureHomeworkTab(props) {
  const user = useSelector(state => state.user)

  const [LectureHomework, setLectureHomework] = useState([])

  useEffect(() => {
    const variable = {
      lectureId: props.ThisLecture._id
    }

    axios.post('/api/lectureHomework/get', variable).then(response => {
      if (response.data.success) {
        setLectureHomework(response.data.lectureHomework)
        console.log(response.data);
      } else {
        message.error('Homework List Error! Please contact the site manager')
        window.location.reload();
      }
    })
  }, [])

  var homeworkList = (<div></div>)
  var postLectureHomework = (<div></div>)

  if (user.userData._id === props.ThisLecture.teacher._id && LectureHomework) {
    homeworkList = (
      <LectureHomeworkList LectureHomework={LectureHomework} />
    )
    postLectureHomework = (
      <LectureHomeworkPost ThisLecture={props.ThisLecture} user={user} />
    )
  } else if (LectureHomework) {
    homeworkList = (
      <div style={{ width: '100%' }}>
      <Collapse
        bordered={true}
        defaultActiveKey={[1]}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        accordion
      >
        {LectureHomework.map((homework, index) => {
          return <Panel header={homework.title} key={index} style={{ fontSize: 'large' }} className="site-collapse-custom-panel">
            <p style={{ fontSize: 'large' }}>{homework.content}</p>
            <br />
            <Meta avatar={<Avatar src={homework.writer.image} />} title={homework.writer.name} description="" />
          </Panel>
        })}
      </Collapse>
      </div>
    )
  }

  return(
    <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Divider><h2>Homeworks</h2></Divider>
      {homeworkList}
      <br />
      {postLectureHomework}
      <Divider />
    </div>
  )
}

export default withRouter(LectureHomeworkTab);
