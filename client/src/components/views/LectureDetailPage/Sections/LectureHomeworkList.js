import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import Linkify from "react-linkify"; // URL을 링크로 만듬

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

function LectureHomeworkList(props) {
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const LectureHomework = props.LectureHomework

  const [IsEditVisible, setIsEditVisible] = useState(false);
  const showEdit = () => {
    setIsEditVisible(true);
  }
  const editCancle = () => {
    setIsEditVisible(false);
  }

  const onDelete = (event, postId) => {
    event.preventDefault()

    let variable = {
      postId: postId
    }

    axios.post('/api/lectureHomework/delete', variable).then(response => {
      if (response.data.success) {
        message.warning('Homework deleted!')
        window.location.reload()
      } else {
        message.error('Homework deletion Error! Please contact the site manager')
        window.location.reload()
      }
    })
  }

  return(<div style={{ width: '100%' }}>
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
        Homework must be submitted here :
        <p style={{ fontSize: 'large' }}><Linkify>{homework.link}</Linkify></p>
        <br />
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1fr'}}>
          <Meta avatar={<Avatar src={homework.writer.image} />} title={homework.writer.name} description="" />

          <Popconfirm
            title="Are you sure？ deletion is irreversible."
            placement="topRight"
            icon={<Icon type="question" style={{ color: 'red' }} />}
            onConfirm={(event) => onDelete(event, homework._id)}
          >
          <Button type="link" style={{ color: 'red', width: '60px' }}>
            <Icon type="close" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'flex-end', alignItems: 'right' }} />
          </Button>
          </Popconfirm>

          <Button type="link" style={{ width: '60px' }} onClick={showEdit}>
            <Icon type="edit" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'flex-end', alignItems: 'right' }} />
          </Button>

          <Formik
            initialValues={{
              postId: homework._id,
              title: homework.title,
              content: homework.content,
              link: homework.link
            }}
            validationSchema={Yup.object().shape({
              postId: Yup.string(),
              title: Yup.string()
                .required('Title is required'),
              content: Yup.string()
                .required('Content is required'),
              link: Yup.string()
                .required('Homework submit link is required')
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                let dataToSubmit = {
                  postId: homework._id,
                  title: values.title,
                  content: values.content,
                  link: values.link
                }

                axios.post('/api/lectureHomework/edit', dataToSubmit).then(response => {
                  if (response.data.success) {
                    message.success('Homework edit success!')
                    window.location.reload()
                  } else {
                    setFormErrorMessage('Homework Edit Error! Check out your input')
                  }
                })
                .catch(err => {
                  setFormErrorMessage('Homework Edit Error! Check out your input')
                  setTimeout(() => {
                    setFormErrorMessage("")
                  }, 3000);
                });

                setSubmitting(false);
              }, 500);
            }}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props;
              return (
                <Modal title="Edit lecture homework" visible={IsEditVisible} onOk={handleSubmit} onCancel={editCancle}
                okText="Edit" cancelText="Cancle">
                  <Form style={{ display: 'grid', gridTemplateRows: '1fr 1fr', width: '90%' }} onSubmit={handleSubmit}>
                    <Form.Item label="Title" hasFeedback validateStatus={errors.title && touched.title ? "error" : 'success'}>
                      <Input
                        id="title"
                        placeholder="Enter title of this"
                        type="text"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.title && touched.title ? 'text-input error' : 'text-input'
                        }
                        style={{ wdith: '90%', borderRadius: '4px' }}
                      />
                      {errors.title && touched.title && (
                        <div className="input-feedback">{errors.title}</div>
                      )}
                    </Form.Item>
                    <Form.Item label="Content" hasFeedback validateStatus={errors.content && touched.content ? "error" : 'success'}>
                      <TextArea
                        id="content"
                        placeholder="Enter content of this"
                        type="text"
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.content && touched.content ? 'text-input error' : 'text-input'
                        }
                        style={{ wdith: '90%', borderRadius: '4px' }}
                      />
                      {errors.content && touched.content && (
                        <div className="input-feedback">{errors.content}</div>
                      )}
                    </Form.Item>
                    <Form.Item label="homework submit link" hasFeedback validateStatus={errors.link && touched.link ? "error" : 'success'}>
                      <Input
                        id="link"
                        placeholder="Enter link for homework submission"
                        type="text"
                        value={values.link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.link && touched.link ? 'text-input error' : 'text-input'
                        }
                        style={{ wdith: '90%', borderRadius: '4px' }}
                      />
                      {errors.link && touched.link && (
                        <div className="input-feedback">{errors.link}</div>
                      )}
                    </Form.Item>

                    {formErrorMessage && (
                      <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                    )}
                  </Form>
                </Modal>
              );
            }}
          </Formik>
        </div>
      </Panel>
    })}
  </Collapse>
  </div>)
}

export default withRouter(LectureHomeworkList);
