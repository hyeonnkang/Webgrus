import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerStudyGroup } from "../../../../_actions/studygroup_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Typography, message, InputNumber, Icon } from 'antd';
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

function StudyGroupUploadPage(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user) // redux state에서 유저정보 가져옴

  const [formErrorMessage, setFormErrorMessage] = useState('')

  const [StudyGroupFilePath, setStudyGroupFilePath] = useState("")

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

  return (
      <Formik
        initialValues={{
          manager: '',
          title: '',
          description: '',
          contactInfo: '',
          capacity: 5,
          filePath: ''
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
              manager: user.userData._id,
              title: values.title,
              description: values.description,
              contactInfo: values.contactInfo,
              capacity: values.capacity,
              filePath: StudyGroupFilePath
            };

            dispatch(registerStudyGroup(dataToSubmit)).then(response => {
              if (response.payload.success) {
                message.success('Study Group has been registered successfully')
                setTimeout(() => {
                  navigate('/studygroups')
                }, 2000)
              } else {
                setFormErrorMessage('Study Group Register Error! Check out your input')
              }
            })
            .catch(err => {
              setFormErrorMessage('Study Group Register Error! Check out your input')
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
              <Title level={2}>Register Study Group</Title>
            </div>
            <br />
            <div>
              <Form style={{ minWidth: '375px' }} onSubmit={handleSubmit} >
                <Form.Item required label="Thumnail">
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
                    placeholder="Enter title of your study group"
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
                    placeholder="Enter description of your study group"
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
                    placeholder="Enter your contact infomation"
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
                    placeholder="Enter capacity of your study group"
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
                <br />
                <Form.Item {...tailFormItemLayout}>
                  <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                    Register
                  </Button>
                </Form.Item>
              </Form>
              </div>
              </div>
          );
        }}
    </Formik>
  )
};


export default withRouter(StudyGroupUploadPage);
