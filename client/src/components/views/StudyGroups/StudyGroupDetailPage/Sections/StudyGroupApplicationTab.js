import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Divider, Tooltip, message, Col, Card, Avatar, Row } from 'antd';
import axios from 'axios';
import { useDispatch } from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import StudyGroupContentsTab from './StudyGroupContentsTab.js'

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

function StudyGroupApplicationTab(props) {
  let navigate = useNavigate();

  const [ThisStudyGroup, setThisStudyGroup] = useState(props.ThisStudyGroup)
  const [StudyGroupApplicants, setStudyGroupApplicants] = useState(0)
  const [StudyGroupApplicantsInfo, setStudyGroupApplicantsInfo] = useState([])
  const [AppliedStudyGroup, setAppliedStudyGroup] = useState(false)

  const { Meta } = Card;

  const applicantsVariable = {
    studygroupId: ThisStudyGroup._id
  }
  const appliedVariable = {
    studygroupId: ThisStudyGroup._id,
    ApplicantInfo: localStorage.getItem('userId')
  }
  let updateVariable = {
    studygroupId: ThisStudyGroup._id,
    Boolean: false,
  }
  if (StudyGroupApplicants >= ThisStudyGroup.capacity) {
    updateVariable.Boolean = false
  } else {
    updateVariable.Boolean = true
  }

  useEffect(() => {
    console.log(StudyGroupApplicants);

    axios.post('/api/studygroupApplication/getStudyGroupApplicants', applicantsVariable).then(response => {
      if (response.data.success) {
        setStudyGroupApplicants(response.data.Apply)
        setStudyGroupApplicantsInfo(response.data.ApplicantsInfo)
      } else {
        message.error('Study Group Infomation Error! Please contact the site manager')
        navigate('/studygroups')
      }
    })

    axios.post('/api/studygroupApplication/getAppliedStudyGroup', appliedVariable).then(response => {
      if (response.data.success) {
        setAppliedStudyGroup(response.data.isApplied)
      } else {
        message.error('Study Group Infomation Error! Please contact the site manager')
        navigate('/studygroups')
      }
    })

    console.log(StudyGroupApplicants);
    axios.post('/api/studygroups/updateApplicationStatus', updateVariable).then(response => {
      if (response.data.success) {
        const variable = {
          studygroupId: ThisStudyGroup._id
        }
        axios.post('/api/studygroups/getStudyGroupDetail', variable).then(response => {
          if (response.data.success) {
            if (ThisStudyGroup.applicationPeriod != response.data.studygroupDetail.applicationPeriod) {
              window.location.reload()
            }
          } else {
            message.error('StudyGroup Infomation Error! Please contact the site manager')
            navigate('studygroups')
          }
        })
      } else {
        message.error('StudyGroup Infomation Error! Please contact the site manager')
        window.location.reload();
      }
    })
  }, [StudyGroupApplicants])

  const onApply = () => {
    let applyVariable = {
      studygroupId: ThisStudyGroup._id,
      ApplicantInfo: localStorage.getItem('userId')
    }

    if (AppliedStudyGroup) {
      axios.post('/api/studygroupApplication/cancleApply', applyVariable).then(response => {
        if (response.data.success) {
          setStudyGroupApplicants(StudyGroupApplicants - 1)
          setAppliedStudyGroup(!AppliedStudyGroup)
        } else {
          message.error('Application Error! Please contact the site manager')
          window.location.reload();
        }
      })
    } else {
      axios.post('/api/studygroupApplication/toApply', applyVariable).then(response => {
        if (response.data.success) {
          setStudyGroupApplicants(StudyGroupApplicants + 1)
          setAppliedStudyGroup(!AppliedStudyGroup)
        } else {
          message.error('Application Error! Please contact the site manager')
          window.location.reload();
        }
      })
    }
  }

  if (ThisStudyGroup && StudyGroupApplicantsInfo) {
    if (localStorage.getItem('userId') === ThisStudyGroup.manager._id) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <br />
        <h3> 강의 신청자가 여기에 표시됩니다 </h3>
        <p />
        <Row gutter={[8, 8]}>
          {StudyGroupApplicantsInfo.map((applicants, index) => {
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
        <StudyGroupContentsTab ThisStudyGroup={ThisStudyGroup} />
        </div>
      )
    } else if (ThisStudyGroup.applicationPeriod === true) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <h2>{StudyGroupApplicants}  /  {ThisStudyGroup.capacity}</h2>
        <p />
        <Button style={{ height: 'auto', minWidth: '275px'}} onClick={onApply}>
          <h3 style={{ color: 'deepskyblue', fontWeight: 550, marginTop: '5px'  }}>모집 중</h3>
          {AppliedStudyGroup
          ? <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 완료</h3>
          : <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청하기</h3>}
        </Button>
        <Divider />
        {AppliedStudyGroup &&
        <StudyGroupContentsTab ThisStudyGroup={ThisStudyGroup} />}
        </div>
      )
    } else if (ThisStudyGroup.applicationPeriod === false) {
      return (
        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Divider><h2>Application</h2></Divider>
        <h2>{StudyGroupApplicants}  /  {ThisStudyGroup.capacity}</h2>
        <p />
        <Button style={{ height: 'auto', minWidth: '275px'}}>
          <h3 style={{ color: 'coral', fontWeight: 550, marginTop: '5px'  }}>모집 마감</h3>
          {AppliedStudyGroup
          ? <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 완료</h3>
          : <h3 style={{ marginBottom: '5px', fontWeight: 550  }}>신청 불가</h3>}
        </Button>
        <Divider />
        {AppliedStudyGroup &&
        <StudyGroupContentsTab ThisStudyGroup={ThisStudyGroup} />}
        </div>
      )
    }
  } else {
    return (<div className="app" style={{ width: '50%', margin: 'auto' }}><Skeleton active /></div>)
  }
}

export default withRouter(StudyGroupApplicationTab);
