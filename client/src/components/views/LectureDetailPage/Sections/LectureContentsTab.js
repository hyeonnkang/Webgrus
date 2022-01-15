import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";

const { Panel } = Collapse;
const { Title } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

function LectureContentsTab(props) {
  const user = useSelector(state => state.user)

  const [Title, setTitle] = useState("")
  const [Contents, setContents] = useState("")
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

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value)
  }
  const onContentsChange = (event) => {
    setContents(event.currentTarget.value)
  }
  const onPost = (event) => {
    event.preventDefault()

    let variable = {
      writer: user.userData._id,
      lectureId: props.ThisLecture._id,
      title: Title,
      content: Contents
    }

    axios.post('/api/lectureContents/post', variable).then(response => {
      if (response.data.success) {
        message.success('Cotents post success!')
        window.location.reload()
      } else {
        message.error('Cotents Post Error! Please contact the site manager')
        window.location.reload()
      }
    })
  }
  const onDelete = (event, postId) => {
    event.preventDefault()

    let variable = {
      postId: postId
    }

    axios.post('/api/lectureContents/delete', variable).then(response => {
      if (response.data.success) {
        message.warning('Cotents deleted!')
        window.location.reload()
      } else {
        message.error('Cotents deletion Error! Please contact the site manager')
        window.location.reload()
      }
    })
  }
  const onEdit = (event, postId) => {
    event.preventDefault()

    let variable = {
      postId: postId,
      title: Title,
      content: Contents
    }

    axios.post('/api/lectureContents/edit', variable).then(response => {
      if (response.data.success) {
        message.success('Cotents edit success!')
        window.location.reload()
      } else {
        message.error('Cotents edit Error! Please contact the site manager')
        window.location.reload()
      }
    })
  }

  const [IsPostVisible, setIsPostVisible] = useState(false);
  const showPost = () => {
    setIsPostVisible(true);
  }
  const postCancle = () => {
    setIsPostVisible(false);
  }
  const [IsEditVisible, setIsEditVisible] = useState(false);
  const showEdit = () => {
    setIsEditVisible(true);
  }
  const editCancle = () => {
    setIsEditVisible(false);
  }

  var contentsList = (<div></div>)
  var postLectureCotents = (<div></div>)

  if (user.userData._id === props.ThisLecture.teacher._id && LectureContents) {
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
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1fr'}}>
              <Meta avatar={<Avatar src={contents.writer.image} />} title={contents.writer.name} description="" />

              <Popconfirm
                title="Are you sure？ deletion is irreversible."
                placement="topRight"
                icon={<Icon type="question" style={{ color: 'red' }} />}
                onConfirm={(event) => onDelete(event, contents._id)}
              >
              <Button type="link" style={{ color: 'red', width: '60px' }}>
                <Icon type="close" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'flex-end', alignItems: 'right' }} />
              </Button>
              </Popconfirm>

              <Button type="link" style={{ width: '60px' }} onClick={showEdit}>
                <Icon type="edit" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'flex-end', alignItems: 'right' }} />
              </Button>

              <Modal title="Edit lecture content" visible={IsEditVisible} onOk={(event) => onEdit(event, contents._id)} onCancel={editCancle}
              okText="Post" cancelText="Cancle">
                <Form style={{ display: 'grid', gridTemplateRows: '1fr 1fr', width: '90%' }} onSubmit={onEdit}>
                  <Form.Item label="Title">
                    <Input
                      id="title"
                      placeholder="Enter title of this lecture"
                      type="text"
                      value={Title}
                      onChange={onTitleChange}
                      style={{ wdith: '90%', borderRadius: '4px' }}
                    />
                  </Form.Item>
                  <Form.Item label="Contents">
                    <TextArea
                      id="contents"
                      placeholder="Enter contents of this lecture"
                      type="text"
                      value={Contents}
                      onChange={onContentsChange}
                      style={{ wdith: '90%', borderRadius: '4px' }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Panel>
        })}
      </Collapse>
      </div>
    )
    postLectureCotents = (
      <div>
        <Button type="link" onClick={showPost} style={{ width: '20vh' }}>
          <Icon type="plus-square" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'center', alignItems: 'center' }} />
        </Button>

        <Modal title="Post lecture content" visible={IsPostVisible} onOk={onPost} onCancel={postCancle}
        okText="Post" cancelText="Cancle">
          <Form style={{ display: 'grid', gridTemplateRows: '1fr 1fr', width: '90%' }} onSubmit={onPost}>
            <Form.Item label="Title">
              <Input
                id="title"
                placeholder="Enter title of this lecture"
                type="text"
                value={Title}
                onChange={onTitleChange}
                style={{ wdith: '90%', borderRadius: '4px' }}
              />
            </Form.Item>
            <Form.Item label="Contents">
              <TextArea
                id="contents"
                placeholder="Enter contents of this lecture"
                type="text"
                value={Contents}
                onChange={onContentsChange}
                style={{ wdith: '90%', borderRadius: '4px' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
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
      {postLectureCotents}
      <Divider />
    </div>
  )
}

export default withRouter(LectureContentsTab);
