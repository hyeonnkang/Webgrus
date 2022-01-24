import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import StudyGroupContentsList from './StudyGroupContentsList.js'
import StudyGroupContentsPost from './StudyGroupContentsPost.js'

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

function StudyGroupContentsTab(props) {
  const user = useSelector(state => state.user)

  const [StudyGroupContents, setStudyGroupContents] = useState([])

  useEffect(() => {
    const variable = {
      studygroupId: props.ThisStudyGroup._id
    }

    axios.post('/api/studygroupContents/get', variable).then(response => {
      if (response.data.success) {
        setStudyGroupContents(response.data.studygroupContents)
        console.log(response.data);
      } else {
        message.error('Study Group List Error! Please contact the site manager')
        window.location.reload();
      }
    })
  }, [])

  var contentsList = (<div></div>)
  var postStudyGroupContent = (<div></div>)

  if (user.userData._id === props.ThisStudyGroup.manager._id && StudyGroupContents) {
    contentsList = (
      <StudyGroupContentsList StudyGroupContents={StudyGroupContents} />
    )
    postStudyGroupContent = (
      <StudyGroupContentsPost ThisStudyGroup={props.ThisStudyGroup} user={user} />
    )
  } else if (StudyGroupContents) {
    contentsList = (
      <div style={{ width: '100%' }}>
      <Collapse
        bordered={true}
        defaultActiveKey={[0]}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        accordion
      >
        {StudyGroupContents.map((contents, index) => {
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
      <Divider><h2>Study Group Contents</h2></Divider>
      {contentsList}
      <br />
      {postStudyGroupContent}
      <Divider />
    </div>
  )
}

export default withRouter(StudyGroupContentsTab);
