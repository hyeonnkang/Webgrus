import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editStudyGroup } from "../../../../_actions/studygroup_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Typography, message, InputNumber, Icon, Skeleton, Checkbox } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

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

const { TextArea } = Input;
const { Title } = Typography;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function StudyGroupEditPage(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user) // redux state에서 유저정보 가져옴

  const [StudyGroupDetail, setStudyGroupDetail] = useState([])
  const [StudyGroupFilePath, setStudyGroupFilePath] = useState("")

  const { studygroupId } = useParams();
  const variable = {
    studygroupId: studygroupId
  }

  useEffect(() => {
    axios.post('/api/studygroups/getStudyGroupDetail', variable).then(response => {
      if (response.data.success) {
        setStudyGroupDetail(response.data.studygroupDetail)
        setStudyGroupFilePath(response.data.studygroupDetail.filePath)
      } else {
        message.error('Study Group Infomation Error! Please contact the site manager')
        navigate('/studygroups')
      }
    })
  }, [])

  const [formErrorMessage, setFormErrorMessage] = useState('')

  const onDropFile = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/formdata'}
    }
    formData.append("file", files[0])

    axios.post('/api/studygroups/uploadThumnail', formData, config).then(response => {
      if (response.data.success) {
       setStudyGroupFilePath(response.data.url)
      } else {
        setFormErrorMessage('Study Group Thumnail Upload Error! Check out your input')
      }
    })
    .catch(err => {
      setFormErrorMessage('Study Group Thumnail Upload Error! Check out your input')
      setTimeout(() => {
        setFormErrorMessage("")
      }, 3000);
    });
  }

  if(StudyGroupDetail.manager && user.userData) {
      return (
          <Formik
            initialValues={{
              _id: StudyGroupDetail._id,
              manager: user.userData._id,
              title: StudyGroupDetail.title,
              description: StudyGroupDetail.description,
              contactInfo: StudyGroupDetail.contactInfo,
              capacity: StudyGroupDetail.capacity,
              filePath: StudyGroupFilePath
            }}
            validationSchema={Yup.object().shape({
              manager: Yup.string(),
              title: Yup.string()
                .required('Study Group title is required'),
              description: Yup.string()
                .required('Study Group description is required')
                .min(10, 'description must be at least 10 characters'),
              contactInfo: Yup.string()
                .required('Contact infomation is required'),
              capacity: Yup.number()
                .required('Study Group capacity is required'),
              filePath: Yup.string()
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {

                let dataToSubmit = {
                  _id: StudyGroupDetail._id,
                  manager: user.userData._id,
                  title: values.title,
                  description: values.description,
                  contactInfo: values.contactInfo,
                  capacity: values.capacity,
                  filePath: StudyGroupFilePath
                };

                dispatch(editStudyGroup(dataToSubmit)).then(response => {
                  if (response.payload.success) {
                    message.success('Study Group has been edited successfully')
                    setTimeout(() => {
                      navigate('/')
                    }, 2000)
                  } else {
                    setFormErrorMessage('Study Group Edit Error! Check out your input')
                  }
                })
                .catch(err => {
                  setFormErrorMessage('Study Group Edit Error! Check out your input')
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
                <div className="app" style={{ minWidth: '575px',maxWidth: '1000px', margin: '2rem auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rme' }}>
                  <Title level={2}>Edit Study Group</Title>
                </div>
                <br />
                <div>
                  <Form style={{ minWidth: '375px' }} onSubmit={handleSubmit} >
                    <Form.Item label="Thumnail">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Dropzone onDrop={onDropFile} multiple={false} maxSize={100000000000}>
                          {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            {...getRootProps()}
                            >
                              <input {...getInputProps()} />
                              <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                          )}
                        </Dropzone>
                        { StudyGroupFilePath &&
                          <div style={{ display: 'flex', maxHeight: '500px', maxWidth: '700px' }}>
                            <img src={`http://localhost:3001/${StudyGroupFilePath}`} alt="thumanail_lecuture" />
                          </div>
                        }
                      </div>
                    </Form.Item>
                    <br />
                    <Form.Item required label="Title">
                        <Input
                          id="title"
                          placeholder="Enter new title of your study group"
                          type="text"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.title && touched.title ? 'text-input error' : 'text-input'
                          }
                        />
                        {errors.title && touched.title && (
                          <div className="input-feedback">{errors.title}</div>
                        )}
                    </Form.Item>
                    <br />
                    <Form.Item required label="Description">
                      <Input
                        id="description"
                        placeholder="Enter new description of your study group"
                        type="text"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.description && touched.description ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.description && touched.description && (
                        <div className="input-feedback">{errors.description}</div>
                      )}
                    </Form.Item>
                    <br />
                    <Form.Item required label="Contact info" hasFeedback validateStatus={errors.contactInfo && touched.contactInfo ? "error" : 'success'}>
                      <Input
                        id="contactInfo"
                        placeholder="Modify your contact infomation"
                        type="text"
                        value={values.contactInfo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.contactInfo && touched.contactInfo ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.contactInfo && touched.contactInfo && (
                        <div className="input-feedback">{errors.contactInfo}</div>
                      )}
                    </Form.Item>
                    <br />
                    <Form.Item required label="Capacity" hasFeedback validateStatus={errors.capacity && touched.capacity ? "error" : 'success'}>
                      <Input
                        id="capacity"
                        placeholder="Modify capacity of your study group"
                        type="number"
                        value={values.capacity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.capacity && touched.capacity ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.capacity && touched.capacity && (
                        <div className="input-feedback">{errors.capacity}</div>
                      )}
                    </Form.Item>

                    {formErrorMessage && (
                      <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                    )}
                    <br />
                    <Form.Item {...tailFormItemLayout}>
                      <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                        Edit
                      </Button>
                    </Form.Item>
                  </Form>
                  </div>
                  </div>
              );
            }}
        </Formik>
      )
    } else {
      return (<div className="app" style={{ width: '50%', margin: 'auto' }}><Skeleton active /></div>)
    }
};


export default withRouter(StudyGroupEditPage);
