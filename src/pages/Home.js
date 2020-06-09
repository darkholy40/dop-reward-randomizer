import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Col,
    notification
} from 'antd'
import 'antd/dist/antd.min.css'
import swalCustomize from '@sweetalert/with-react'
import useInterval from '../components/functions/useInterval'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import LoadingSwal from '../components/layouts/LoadingSwal'

const StyledCardShield = styled(CardShield)`
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledCard = styled(Card)`
    width: 960px;
`

const NextAward = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    p.block {
        margin: 0;
    }

    span.next-award {
        font-size: 1.5rem;
        padding: 0 0.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-yellow-day' : 'highlight-yellow-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    span.remain-awards {
        font-size: 1.5rem;
        padding: 0 0.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-blue-day' : 'highlight-blue-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    .dummy {
        opacity: 0;
    }

    @media (max-width: 767px) {
        flex-direction: column;

        .dummy {
            display: none;
        }
    }
`

const Label = styled.p`
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
`

const ListItemsNotificationText = styled.p`
    text-align: center;
    font-size: 0.85rem;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(175, 175, 175)'};
    margin: 0;
    display: ${props => props.display || 'none'};
    transition: 0.3s;
`

const AwardsResult = styled.div`
    text-align: left;

    p {
        display: flex;
        
        span.left {
            width: 40%;
        }

        span.right {
            width: 60%;
            margin-left: 0.5rem;

            span.first-picked-up {
                animation-duration: 2s;
                animation-name: ${props => props.theme === 'sun' ? 'highlight-green-day' : 'highlight-green-night'};
                animation-delay: 0;
                animation-iteration-count: infinite;
                animation-direction: forward;
            }
        }
    }
`

function mapStateToProps(state) {
    return state
}

function Home(props) {
    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')

    const [awardsList, setAwardsList] = useState({})
    const [connectionIsLost, setConnectionIsLost] = useState(0)

    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeIn",
    }

    useEffect(() => {
        props.dispatch({
            type: 'SET_BREADCRUMB',
            data: [
                {
                    page: 'ระบบสุ่มจับรางวัล กพ.ทบ.',
                    url: ''
                }
            ]
        })

        fetchData()

        setTimeout(() => {
            setFirstCardClass(classNames.first)
            setSecondCardClass(classNames.second)
        }, 150)
    }, [])

    useEffect(() => {
        switch (connectionIsLost) {
            case 1:
                LoadingSwal("การเชื่อมต่อไม่เสถียร... กำลังเชื่อมต่ออีกครั้ง...", props.theme)
                break

            case 2:
                notification['success']({
                    message: 'แจ้งเตือน',
                    description: 'การเชื่อมต่อสำเร็จ',
                    duration: 3,
                })
                break
        
            default:
                break
        }
    }, [connectionIsLost])

    useInterval(() => {
        fetchData()
    }, 1000)

    function fetchData() {
        // ดึกข้อมูล รายการรางวัลทั้งหมด
        axios.get(`${props.url}/getawardslist`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                // console.log(response.data)
                setAwardsList(response.data)

                if(connectionIsLost === 1) {
                    reconnect()
                }
            }
        })
        .catch((err) => {
            console.log(err)
            setConnectionIsLost(1)
        })
    }

    function reconnect() {
        swalCustomize.close()
        setConnectionIsLost(2)
    }

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                <Col xs={24}>
                    <NextAward theme={props.theme}>
                        <CardShield className="dummy">
                            <Card>
                                จำนวนรางวัลคงเหลือ: {awardsList.remain}
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                <p className="block">
                                    {Object.keys(awardsList).length > 0
                                    ?
                                        awardsList.remain > 0
                                        ?
                                        <>รางวัลรายการถัดไป: <span className="next-award">{awardsList.data.awards_remain[0].name}</span></>
                                        :
                                        <span className="next-award">จับรางวัลหมดแล้ว</span>
                                    :
                                        <span>ไม่สามารถอ่านข้อมูลได้</span>
                                    }
                                </p>
                            </Card>
                        </CardShield>
                        <CardShield className={Object.keys(awardsList).length > 0 ? firstCardClass : "dummy"}>
                            <Card>
                            {Object.keys(awardsList).length > 0
                                ?
                                    <>จำนวนรางวัลคงเหลือ: <span className="remain-awards">{awardsList.remain}</span></>
                                :
                                    <span>ไม่สามารถอ่านข้อมูลได้</span>
                            }
                            </Card>
                        </CardShield>
                    </NextAward>
                </Col>
            </MainRow>
            <MainRow>
                <Col md={24} sm={24}>
                    <StyledCardShield className={secondCardClass}>
                        <StyledCard theme={props.theme}>
                            <Label theme={props.theme}>ผลการจับรางวัล</Label>
                            <ListItemsNotificationText display={awardsList.remain === awardsList.max ? 'block' : 'none'} theme={props.theme}>
                                ยังไม่ทำการจับรางวัล
                            </ListItemsNotificationText>
                            <AwardsResult theme={props.theme}>
                                {Object.keys(awardsList).length > 0 && awardsList.data.persons_whom_are_picked_up.map((pickedupPerson, pickedupPersonIndex) => {
                                    return (
                                        <p key={pickedupPersonIndex}>
                                            <span className="left">{pickedupPerson.name}</span>
                                            <span className="right">
                                                <span className={pickedupPersonIndex === 0 ? "first-picked-up" : ""}>{pickedupPerson.fullname}</span>
                                            </span>
                                        </p>
                                    )
                                })}
                            </AwardsResult>
                        </StyledCard>
                    </StyledCardShield>
                </Col>
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(Home)