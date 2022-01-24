import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row, Input,
  Form, Typography, Collapse, Icon, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";

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

function LectureContentsList(props) {
  const [formErrorMessage, setFormErrorMessage] = useState('')

  const [IsPostVisible, setIsPostVisible] = useState(false);
  const showPost = () => {
    setIsPostVisible(true);
  }
  const postCancle = () => {
    setIsPostVisible(false);
  }

  return(
    <div>
      <Button type="link" onClick={showPost} style={{ width: '20vh' }}>
        <Icon type="plus-square" style={{ display: 'flex', fontSize: 'x-large', justifyContent: 'center', alignItems: 'center' }} />
      </Button>

      <Formik
        initialValues={{
          writer: props.user.userData._id,
          lectureId: props.ThisLecture._id,
          title: '',
          content: ''
        }}
        validationSchema={Yup.object().shape({
          writer: Yup.string(),
          lectureId: Yup.string(),
          title: Yup.string()
            .required('Title is required'),
          content: Yup.string()
            .required('Content is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            let dataToSubmit = {
              writer: props.user.userData._id,
              lectureId: props.ThisLecture._id,
              title: values.title,
              content: values.content
            }

            axios.post('/api/lectureContents/post', dataToSubmit).then(response => {
              if (response.data.success) {
                message.success('Cotents post success!')
                window.location.reload()
              } else {
                setFormErrorMessage('Cotents Post Error! Check out your input')
              }
            })
            .catch(err => {
              setFormErrorMessage('Cotents Post Error! Check out your input')
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
            <Modal title="Post lecture content" visible={IsPostVisible} onOk={handleSubmit} onCancel={postCancle}
            okText="Post" cancelText="Cancle">
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

              {formErrorMessage && (
                <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
              )}
            </Form>
            </Modal>
          );
        }}
      </Formik>
    </div>
  )
}

export default withRouter(LectureContentsList);
