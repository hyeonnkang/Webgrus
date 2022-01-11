import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Typography, message, InputNumber } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

function LectureUploadPage(props) {
  const user = useSelector(state => state.user) // redux state에서 유저정보 가져옴

  const [formErrorMessage, setFormErrorMessage] = useState('')

  const [LectureTitle, setLectureTitle] = useState("")
  const [LectureDescription, setLectureDescription] = useState("")
  const [LectureContact, setLectureContact] = useState("")
  const [LectureCapacity, setLectureCapacity] = useState(5)
  const [LectureFilePath, setLectureFilePath] = useState("")

  const onTitleChange = (event) => {
    setLectureTitle(event.currentTarget.value)
  }
  const onDescriptionChange = (event) => {
    setLectureDescription(event.currentTarget.value)
  }
  const onContactChange = (event) => {
    setLectureContact(event.currentTarget.value)
  }
  const onCapacityChange = (event) => {
    setLectureCapacity(event.currentTarget.value)
  }

  const onDropFile = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/formdata'}
    }
    formData.append("file", files[0])

    axios.post('/api/lectures/uploadThumnail', formData, config).then(response => {
      if (response.data.success) {
       setLectureFilePath(response.data.url)
      } else {
        setFormErrorMessage('Lecture Thumnail Upload Error! Check out your input')
      }
    })
    .catch(err => {
      setFormErrorMessage('Lecture Thumnail Upload Error! Check out your input')
      setTimeout(() => {
        setFormErrorMessage("")
      }, 3000);
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const variable = {
      teacher: user.userData._id,
      title: LectureTitle,
      description: LectureDescription,
      contactInfo: LectureContact,
      capacity: LectureCapacity,
      filePath: LectureFilePath
    }
    axios.post('/api/lectures/uploadLecture', variable).then(response => {
      if (response.data.success) {
        message.success('Lecture has been registered successfully')
        setTimeout(() => {
          props.history.push('/')
        }, 2000)
      } else {
        setFormErrorMessage('Lecture Register Error! Check out your input')
      }
    })
    .catch(err => {
      setFormErrorMessage('Lecture Register Error! Check out your input')
      setTimeout(() => {
        setFormErrorMessage("")
      }, 3000);
    });
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rme' }}>
        <Title level={2}>Register Lecture</Title>
      </div>
      <Form onSubmit={onSubmit}>
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
          { LectureFilePath &&
            <div style={{ display: 'flex', maxHeight: '500px', maxWidth: '700px' }}>
              <img src={`http://localhost:5000/${LectureFilePath}`} alt="thumanail_lecuture" />
            </div>
          }
        </div>
        <br />
        <br />
        <label>Lecture Title</label>
        <Input value={LectureTitle} onChange={onTitleChange} />
        <br />
        <br />
        <label>Lecture Description</label>
        <TextArea value={LectureDescription} onChange={onDescriptionChange} />
        <br />
        <br />
        <label>Contact Info</label>
        <TextArea value={LectureContact} onChange={onContactChange} />
        <br />
        <br />
        <label>Capacity</label>
        <Input type="number" value={LectureCapacity} onChange={onCapacityChange} />
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Register
        </Button>
      </Form>
    </div>
  )
};

export default withRouter(LectureUploadPage);
