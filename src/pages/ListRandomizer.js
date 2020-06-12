import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Button,
    Col,
    message,
    notification
} from 'antd'
import 'antd/dist/antd.min.css'
import useInterval from '../components/functions/useInterval'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import LoadingModal from '../components/layouts/LoadingModal'

import NextAward from '../components/coop/NextAward'
import AwardsResult from '../components/coop/AwardsResult'

const Label = styled.p`
    text-align: left;
    font-size: 1.5rem;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};

    @media (max-width: 767px) {
        font-size: 1rem;
    }
`

const PersonsRemainNotice = styled.p`
    text-align: left;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;

    @media (max-width: 767px) {
        font-size: 0.85rem;
    }
`

const PersonsAmountBlock = styled.div`
    border: 1px solid ${props => props.theme === 'sun' ? "#cccccc" : "#696969"};
    border-radius: 3px;
    margin-bottom: 1.5rem;

    div {
        height: 300px;
        min-height: 100px;
        overflow: auto;
        text-align: left;
        padding: 0 5rem;
        resize: vertical;

        p {
            font-size: 1.25rem;
            margin: 0;

            &.is-picked-up {
                background-color: rgba(0, 255, 0, 0.5);
            }
        }
        
        @media (max-width: 991px) {
            padding: 0;

            p {
                font-size: 0.85rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
`

const NoMoreRandomizing = styled.div`
    display: inline-block
    margin-top: 1rem;

    span {
        font-size: 1.25rem;
        padding: 0 0.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-red-day' : 'highlight-red-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }
`

function mapStateToProps(state) {
    return state
}

function ListRandomizer(props) {
    const [listItems, setListItems] = useState(initialState('listItems'))
    const [startBtnIcon, setStartBtnIcon] = useState(initialState('startBtnIcon'))
    const [percent, setPercent] = useState(initialState('percent'))

    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')
    const [thirdCardClass, setThirdCardClass] = useState('hidden')

    const [personsList, setPersonsList] = useState({})
    const [awardsList, setAwardsList] = useState({})
    const [connectionIsLost, setConnectionIsLost] = useState(0)
    const [loadingModal, setLoadingModal] = useState({
        title: '',
        status: false
    })

    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInLeft",
        third: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInRight"
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
            setThirdCardClass(classNames.third)
        }, 150)

        message.config({
            top: 50,
            duration: 2,
            maxCount: 3,
        })
    }, [])

    useEffect(() => {
        if(percent === 100) {
            setLoadingModal({
                ...loadingModal,
                status: false
            })
            successMessage("สุ่มรายชื่อกำลังพลสำเร็จ")
        }
    }, [percent])

    useEffect(() => {
        switch (connectionIsLost) {
            case 1:
                setLoadingModal({
                    title: 'การเชื่อมต่อไม่เสถียร... กำลังเชื่อมต่ออีกครั้ง...',
                    status: true
                })
                setStartBtnIcon(initialState('startBtnIcon'))
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

    function initialState(stateName) {
        switch (stateName) {
            case 'listItems':
                return []

            case 'startBtnIcon':
                return 'caret-right'

            case 'percent':
                return 0

            default:
                break
        }
    }

    function getPersonsAndAwardsList() {
        // ดึกข้อมูล รายชื่อกำลังพลใน กพ.ทบ. ทั้งหมด
        axios.get(`${props.url}/getpersons`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                // console.log(response.data)
                setPersonsList(response.data)

                setListItems(response.data.data.remain)

                if(connectionIsLost === 1) {
                    reconnect()
                }
            }
        })
        .catch((err) => {
            console.log(err)
            setListItems(initialState('listItems'))
            setConnectionIsLost(1)
        })

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

    function fetchData() {
        getPersonsAndAwardsList()
    }

    function reconnect() {
        setLoadingModal({
            ...loadingModal,
            status: false
        })
        setConnectionIsLost(2)
    }

    function saveData(theChosenId) {
        const currentAwardId = awardsList.data.awards_remain[0].id

        // console.log(`the chosen: ${theChosenId}`)
        // console.log(`the current award id: ${currentAwardId}`)

        axios.post(`${props.url}/save/pickedup-person`, {
            awardId: currentAwardId,
            personId: theChosenId
        })
        .then(res => {
            // console.log(res.data)
            fetchData()
            stopProcess()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function disqualification(getAwardId, getPersonId) {
        axios.post(`${props.url}/save/disqualification`, {
            awardId: getAwardId,
            personId: getPersonId
        })
        .then(res => {
            // console.log(res.data)
            fetchData()
            successMessage("ตัดสิทธิ์กำลังพลสำเร็จ")
        })
        .catch((err) => {
            console.log(err)
        })
    }

    // function swapListItems() {
    //     let listItemsSize = listItems.length // array length
    //     let characters = []
    //     let swappedItems = []
        
    //     for(let i=0; i<listItemsSize; i++) {
    //         characters = [...characters, i]
    //     }
        
    //     for(let i=0; i<listItemsSize; i++) {
    //         let charactersLength = characters.length // array length
    //         let randomizedIndex = i === 0 ? Math.floor(Math.random() * (charactersLength-1)) + 1 : characters[Math.floor(Math.random()*charactersLength)]

    //         characters = characters.filter(item => randomizedIndex !== item)
    //         swappedItems = [...swappedItems, listItems[randomizedIndex]]
    //     }

    //     setListItems(swappedItems)
    // }

    function startButtonHandleClick(time) {
        setStartBtnIcon('loading')
        setPercent(initialState('percent'))

        setLoadingModal({
            title: 'กำลังสุ่มรายชื่อ...',
            status: true
        })

        setTimeout(() => {
            goRandomize()
        }, time || 500)
    }

    function stopProcess() {
        setStartBtnIcon(initialState('startBtnIcon'))
        setPercent(100)
    }

    function goRandomize() {
        let listItemsSize = listItems.length // array length
        let theChosen = listItems[Math.floor(Math.random()*listItemsSize)]

        saveData(theChosen.id)
    }

    function successMessage(str) {
        message.success(str)
    }

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                <NextAward data={awardsList} setclass={firstCardClass} />
            </MainRow>
            <MainRow>
                <Col md={12} sm={24}>
                    <CardShield className={secondCardClass}>
                        <Card>
                            <Label theme={props.theme}>จำนวนกำลังพลของ กพ.ทบ. (ทั้งหมด {personsList.max} นาย)</Label>
                            <PersonsRemainNotice>
                                ยอดคงเหลือที่สามารถถูกสุ่มจับรางวัล: {personsList.remain} นาย
                            </PersonsRemainNotice>
                            <PersonsAmountBlock theme={props.theme}>
                                <div>
                                    {Object.keys(personsList).length > 0 && personsList.data.all.map((person, personIndex) => {
                                        return (
                                            <p key={personIndex} className={person.is_picked_up > 0 ? "is-picked-up" : ""}>
                                                {`${personIndex+1}.)`} {person.fullname}
                                            </p>
                                        )
                                    })}
                                </div>
                            </PersonsAmountBlock>
                            <Col xs={24}>
                                <Button
                                    onClick={() => startButtonHandleClick(1500)}
                                    size='large'
                                    type='primary'
                                    icon={startBtnIcon}
                                    disabled={Object.keys(personsList).length === 0 || personsList.remain === 0 || awardsList.remain === 0 || startBtnIcon === 'loading' || connectionIsLost === 1}
                                >
                                    สุ่มจับรางวัล
                                </Button>
                            </Col>
                            {personsList.remain === 0 &&
                            <NoMoreRandomizing theme={props.theme}>
                                <span>รายชื่อทั้งหมด ถูกจับฉลากแล้ว</span>
                            </NoMoreRandomizing>
                            }
                        </Card>
                    </CardShield>
                </Col>
                <AwardsResult
                    data={awardsList}
                    setclass={thirdCardClass}
                    display="split"
                    
                    // comments 2 line below to disable disqualification function
                    isAbleToDisqualified={true}
                    disqualificationCallBack={disqualification}
                />
            </MainRow>
            <LoadingModal title={loadingModal.title} visibility={loadingModal.status} theme={props.theme} />
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)