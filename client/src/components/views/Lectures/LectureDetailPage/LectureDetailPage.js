import React, { useEffect, useState } from 'react';
import { FaCode } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Row, Col, List, Avatar, Typography, Divider, Button, Skeleton, Popconfirm, message, Icon } from 'antd';
import axios from 'axios';
import LectureApplicationTab from './Sections/LectureApplicationTab.js'
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

function LectureDetailPage(props) {
    let navigate = useNavigate();

    const [LectureDetail, setLectureDetail] = useState([])

    const user = useSelector(state => state.user)
    const { lectureId } = useParams();
    const variable = {
      lectureId: lectureId
    }

    useEffect(() => {
      axios.post('/api/lectures/getLectureDetail', variable).then(response => {
        if (response.data.success) {
          setLectureDetail(response.data.lectureDetail)
        } else {
          message.error('Lecture Infomation Error! Please contact the site manager')
          navigate('/lectures')
        }
      })
    }, [])

    const onDelete = () => {
      axios.post('/api/lectures/deleteLecture', variable).then(response => {
        if (response.data.success) {
          message.warning('Lecture deleted')
          navigate('/lectures')
        } else {
          message.error('Lecture Deletion Error! Please contact the site manager')
          navigate('/lectures')
        }
      })
    }

    if(LectureDetail.teacher && user.userData) {
      var buttons = (<></>)
      if (LectureDetail.teacher._id === user.userData._id) {
        buttons = (
          <div tyle={{ width: '90%', display: 'flex', flexDirection: 'column'  }}>
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr'}}>
            <div>
              <a href={`/lectures/${lectureId}/edit`}>
                <Button type="default" style={{ minWidth: '100%' }} style={{ marginRight: '20px' }}>
                  Edit this lecture
                </Button>
              </a>
            </div>
            <div>
              <Popconfirm title="Are you sure？ This operation is irreversible."
               onConfirm={onDelete} icon={<Icon type="question" style={{ color: 'red' }} />}>
                <Button style={{ minWidth: '100%', color: 'red', borderColor: 'coral' }}>
                  Delete this lecture
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
            <Popconfirm title="Are you sure？ This operation is irreversible. \nIt is recommended to contact the lecturer before deleting it."
             onConfirm={onDelete} icon={<Icon type="question" style={{ color: 'red' }} />} >
              <Button style={{ minWidth: '100%', color: 'red', borderColor: 'coral' }}>
                Delete this lecture
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
              <Title level={2} style={{ marginTop: '25px' }}> {LectureDetail.title} </Title>
              <Divider />
              <br />
              <img style={{ width: '50%'}} src={`http://localhost:3001/${LectureDetail.filePath}`} controls />
              <br />
              <Divider><h2>Lecturer</h2></Divider>
              <List.Item actions>
                <List.Item.Meta avatar={<Avatar src={LectureDetail.teacher.image} />}
                title={LectureDetail.teacher.name} description="" />
              </List.Item>
              <Divider />
              <Divider><h2>Description</h2></Divider>
              <br />
              <h3>{LectureDetail.description}</h3>
              <br />
              <Divider />
              <Divider><h2>Lecturer Conatact Infomation</h2></Divider>
              <br />
              <h3>{LectureDetail.contactInfo}</h3>
              <br />
              <Divider />
              <LectureApplicationTab ThisLecture={LectureDetail} />
              {buttons}
            </div>
          </Col>
        </Row>
      )
    } else {
      return (<div className="app" style={{ width: '50%', margin: 'auto' }}><Skeleton active /></div>)
    }
}

export default withRouter(LectureDetailPage)
