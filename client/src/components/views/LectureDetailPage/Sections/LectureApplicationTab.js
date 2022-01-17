import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row } from 'antd';
import axios from 'axios';
import { useDispatch } from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import LectureContentsTab from './LectureContentsTab.js'
import LectureHomeworkTab from './LectureHomeworkTab.js'

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

function LectureApplicationTab(props) {
  let navigate = useNavigate();

  const [ThisLecture, setThisLecture] = useState(props.ThisLecture)
  const [LectureApplicants, setLectureApplicants] = useState(0)
  const [AppliedLecture, setAppliedLecture] = useState(false)
  const [LectureApplicantsInfo, setLectureApplicantsInfo] = useState([])

  const { Meta } = Card;

  const StatusUpdate = () => {
    let updateVariable = {
      LectureId: ThisLecture._id,
      Capacity: ThisLecture.capacity,
      Applicants: LectureApplicants
    }
    axios.post('/api/lectures/updateApplicationStatus', updateVariable).then(response => {
      if (response.data.success) {
        console.log(ThisLecture)
        console.log(response.data)
      } else {
        message.error('Lecture Infomation Error! Please contact the site manager')
        window.location.reload();
      }
    })
  }

  const applicantsVariable = {
    LectureId: ThisLecture._id
  }
  const appliedVariable = {
    LectureId: ThisLecture._id,
    ApplicantInfo: localStorage.getItem('userId')
  }

  useEffect(() => {
    axios.post('/api/lectureApplication/getLectureApplicants', applicantsVariable).then(response => {
      if (response.data.success) {
        setLectureApplicants(response.data.Apply)
        setLectureApplicantsInfo(response.data.ApplicantsInfo)
        console.log(LectureApplicantsInfo)
        console.log(response.data.ApplicantsInfo)
      } else {
        message.error('Lecture Infomation Error! Please contact the site manager')
        navigate('/lectures')
      }
    })

    axios.post('/api/lectureApplication/getAppliedLecture', appliedVariable).then(response => {
      if (response.data.success) {
        setAppliedLecture(response.data.isApplied)
      } else {
        message.error('Lecture Infomation Error! Please contact the site manager')
        navigate('/lectures')
      }
    })

    StatusUpdate()
  }, [LectureApplicants, AppliedLecture])

  const onApply = () => {
    let applyVariable = {
      LectureId: ThisLecture._id,
      ApplicantInfo: localStorage.getItem('userId')
    }

    if (AppliedLecture) {
      axios.post('/api/lectureApplication/cancleApply', applyVariable).then(response => {
        if (response.data.success) {
          setLectureApplicants(LectureApplicants - 1)
          setAppliedLecture(!AppliedLecture)

          window.location.reload();
        } else {
          message.error('Application Error! Please contact the site manager')
          window.location.reload();
        }
      })
    } else {
      axios.post('/api/lectureApplication/toApply', applyVariable).then(response => {
        if (response.data.success) {
          setLectureApplicants(LectureApplicants + 1)
          setAppliedLecture(!AppliedLecture)

          window.location.reload();
        } else {
          message.error('Application Error! Please contact the site manager')
          window.location.reload();
        }
      })
    }
  }

  if (ThisLecture && LectureApplicantsInfo) {
    if (localStorage.getItem('userId') === ThisLecture.teacher._id) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <br />
        <h3> 강의 신청자가 여기에 표시됩니다 </h3>
        <p />
        <Row gutter={[8, 8]}>
          {LectureApplicantsInfo.map((applicants, index) => {
            return <Col xs={24} key={index}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 2fr' }}>
                <div />
                <Meta avatar={<Avatar src={applicants.ApplicantInfo.image} />}
                title={applicants.ApplicantInfo.name} description="" />
                <h3 style={{ position: 'relative', bottom: '4px' }}>
                Contact - {applicants.ApplicantInfo.email} / 0{applicants.ApplicantInfo.phonenumber}</h3>
              </div>
            </Col>
          })}
        </Row>
        <br />
        <Divider />
        <LectureContentsTab ThisLecture={ThisLecture} />
        <LectureHomeworkTab ThisLecture={ThisLecture} />
        </div>
      )
    } else if (ThisLecture.applicationPeriod === true) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <h2>{LectureApplicants}  /  {ThisLecture.capacity}</h2>
        <p />
        <Button style={{ height: 'auto', minWidth: '275px'}} onClick={onApply}>
          <h3 style={{ color: 'deepskyblue', fontWeight: 550, marginTop: '5px'  }}>모집 중</h3>
          {AppliedLecture
          ? <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 완료</h3>
          : <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청하기</h3>}
        </Button>
        <Divider />
        {AppliedLecture &&
        <LectureContentsTab ThisLecture={ThisLecture} />}
        {AppliedLecture &&
        <LectureHomeworkTab ThisLecture={ThisLecture} />}
        </div>
      )
    } else if (ThisLecture.applicationPeriod === false) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <h2>{LectureApplicants}  /  {ThisLecture.capacity}</h2>
        <p />
        <Button style={{ height: 'auto', minWidth: '275px'}}>
          <h3 style={{ color: 'coral', fontWeight: 550, marginTop: '5px'  }}>모집 마감</h3>
          {AppliedLecture
          ? <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 완료</h3>
          : <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 불가</h3>}
        </Button>
        <Divider />
        {AppliedLecture &&
        <LectureContentsTab ThisLecture={ThisLecture} />}
        {AppliedLecture &&
        <LectureHomeworkTab ThisLecture={ThisLecture} />}
        </div>
      )
    }
  } else {
    return (<div className="app" style={{ width: '50%', margin: 'auto' }}><Skeleton active /></div>)
  }
}

export default withRouter(LectureApplicationTab);
