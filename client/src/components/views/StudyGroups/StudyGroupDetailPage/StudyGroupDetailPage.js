import React, { useEffect, useState } from 'react';
import { FaCode } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Row, Col, List, Avatar, Typography, Divider, Button, Skeleton, Popconfirm, message, Icon } from 'antd';
import axios from 'axios';
import StudyGroupApplicationTab from './Sections/StudyGroupApplicationTab.js'
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

function StudyGroupDetailPage(props) {
    let navigate = useNavigate();

    const [StudyGroupDetail, setStudyGroupDetail] = useState([])

    const user = useSelector(state => state.user)
    const { studygroupId } = useParams();
    const variable = {
      studygroupId: studygroupId
    }

    useEffect(() => {
      axios.post('/api/studygroups/getStudyGroupDetail', variable).then(response => {
        if (response.data.success) {
          setStudyGroupDetail(response.data.studygroupDetail)
        } else {
          message.error('Study Group Infomation Error! Please contact the site manager')
          navigate('/studygroups')
        }
      })
    }, [])

    const onDelete = () => {
      axios.post('/api/StudyGroups/deleteStudyGroup', variable).then(response => {
        if (response.data.success) {
          message.warning('Study Group deleted')
          navigate('/studygroups')
        } else {
          message.error('Study Group Deletion Error! Please contact the site manager')
          navigate('/studygroups')
        }
      })
    }

    if(StudyGroupDetail.manager && user.userData) {
      var buttons = (<></>)
      if (StudyGroupDetail.manager._id === user.userData._id) {
        buttons = (
          <div tyle={{ width: '90%', display: 'flex', flexDirection: 'column'  }}>
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr'}}>
            <div>
              <a href={`/studygroups/${studygroupId}/edit`}>
                <Button type="default" style={{ minWidth: '100%' }} style={{ marginRight: '20px' }}>
                  Edit this Study Group
                </Button>
              </a>
            </div>
            <div>
              <Popconfirm title="Are you sure？ This operation is irreversible."
               onConfirm={onDelete} icon={<Icon type="question" style={{ color: 'red' }} />}>
                <Button style={{ minWidth: '100%', color: 'red', borderColor: 'coral' }}>
                  Delete this Study Group
                </Button>
              </Popconfirm>
            </div>
          </div>
          <Divider />
          </div>
        )
      } else if (user.userData.isAdmin == true) {
        buttons = (
          <div style={{ width: '90%', display: 'flex', flexDirection: 'column'  }}>
          <Divider />
          <div>
            <Popconfirm title="Are you sure？ This operation is irreversible. \nIt is recommended to contact the manager before deleting it."
             onConfirm={onDelete} icon={<Icon type="question" style={{ color: 'red' }} />} >
              <Button style={{ minWidth: '100%', color: 'red', borderColor: 'coral' }}>
                Delete this Study Group
              </Button>
            </Popconfirm>
          </div>
          <Divider />
          </div>
        )
      }

      return (
        <Row gutter={[16,16]}>
          <Col lg={24} xs={24}>
            <div className="app" style={{ width: '85%', margin: 'auto' }}>
              <Title level={2} style={{ marginTop: '25px' }}> {StudyGroupDetail.title} </Title>
              <Divider />
              <br />
              <img style={{ width: '50%'}} src={`http://localhost:3001/${StudyGroupDetail.filePath}`} controls />
              <br />
              <Divider><h2>Group Manager</h2></Divider>
              <List.Item actions>
                <List.Item.Meta avatar={<Avatar src={StudyGroupDetail.manager.image} />}
                title={StudyGroupDetail.manager.name} description="" />
              </List.Item>
              <Divider />
              <Divider><h2>Description</h2></Divider>
              <br />
              <h3>{StudyGroupDetail.description}</h3>
              <br />
              <Divider />
              <Divider><h2>Manager Conatact Infomation</h2></Divider>
              <br />
              <h3>{StudyGroupDetail.contactInfo}</h3>
              <br />
              <Divider />
              <StudyGroupApplicationTab ThisStudyGroup={StudyGroupDetail} />
              {buttons}
            </div>
          </Col>
        </Row>
      )
    } else {
      return (<div className="app" style={{ width: '50%', margin: 'auto' }}><Skeleton active /></div>)
    }
}

export default withRouter(StudyGroupDetailPage)
