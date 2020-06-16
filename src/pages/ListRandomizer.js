import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Button,
    Col,
    Modal,
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
import DataNotFound from '../components/coop/DataNotFound'
import SlotMachine from '../components/coop/SlotMachine'

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
        height: 100px;
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

const CustomizedModal = styled(Modal)`
    max-width: 700px;
    padding: 0 1rem;

    .ant-modal-content {
        background-color: ${props => props.theme !== 'sun' && 'rgb(75, 75, 75)'};
        color: ${props => props.theme !== 'sun' && 'rgb(225, 225, 225)'};

        .ant-modal-body {
            padding: 8px;
        }
    }
`

function mapStateToProps(state) {
    return state
}

function ListRandomizer(props) {
    const [startBtnIcon, setStartBtnIcon] = useState(initialState('startBtnIcon'))
    const [percent, setPercent] = useState(initialState('percent'))

    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')
    const [thirdCardClass, setThirdCardClass] = useState('hidden')

    const [personsList, setPersonsList] = useState({})
    const [awardsList, setAwardsList] = useState({})
    const [currentAwardType, setCurrentAwardType] = useState('all')
    const [remainAwardsAmount, setRemainAwardsAmount] = useState(0)
    const [connectionIsLost, setConnectionIsLost] = useState(0)
    const [loadingModal, setLoadingModal] = useState({
        title: '',
        status: false
    })
    const [turn, setTurn] = useState(false)
    const [swappedData, setSwappedData] = useState([])
    const [randomzingModal, setRandomzingModal] = useState(false)

    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeIn",
        third: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeIn"
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
            case 'startBtnIcon':
                return 'caret-right'

            case 'percent':
                return 0

            default:
                break
        }
    }

    function fetchData() {
        // ดึกข้อมูล รายชื่อกำลังพลใน กพ.ทบ. ทั้งหมด
        axios.get(`${props.url}/getpersons`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                // console.log(response.data)
                setPersonsList(response.data)

                if(connectionIsLost === 1) {
                    reconnect()
                }
            }
        })
        .catch((err) => {
            console.log(err)
            setConnectionIsLost(1)
        })

        // ดึกข้อมูล รายการรางวัลทั้งหมด
        axios.get(`${props.url}/getawardslist`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                // console.log(response.data)
                setAwardsList(response.data)
                setRemainAwardsAmount(response.data.amount.awards_remain)
                
                if (response.data.data.awards_remain.length > 0) {
                    setCurrentAwardType(response.data.data.awards_remain[0].type)
                }

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
        setLoadingModal({
            ...loadingModal,
            status: false
        })
        setConnectionIsLost(2)
    }

    function saveAward(theChosenId) {
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

    function saveBonusAward(theChosenId) {
        const currentAwardId = awardsList.data.awards_remain[0].id

        axios.post(`${props.url}/save/bonus-award`, {
            bigAwardId: currentAwardId,
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

    function disqualification(getAwardId, getPersonId, getOption) {
        axios.post(`${props.url}/save/disqualification`, {
            awardId: getAwardId,
            personId: getPersonId,
            option: getOption
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

    function startButtonHandleClick(Arraydata, option) {
        setStartBtnIcon('loading')
        setPercent(initialState('percent'))

        setLoadingModal({
            title: 'กำลังเตรียมรายชื่อ...',
            status: true
        })

        setTimeout(() => {
            if(option === 'special') {
                goRandomize(Arraydata, 'save-bonus-award')
            } else {
                goRandomize(Arraydata)
            }
        }, 1000)
    }

    function stopProcess() {
        setStartBtnIcon(initialState('startBtnIcon'))
        setPercent(100)
    }

    function goRandomize(arrayData, option) {
        let listItemsSize = arrayData.length // array length
        let randomizedIndex = Math.floor(Math.random()*listItemsSize)
        let theChosen = arrayData[randomizedIndex]

        sortResultArrayToDisplay(arrayData, randomizedIndex)
        console.log(theChosen)

        // if(option === 'save-bonus-award') {
        //     saveBonusAward(theChosen.id)
        // } else {
        //     saveAward(theChosen.id)
        // }
    }

    function sortResultArrayToDisplay(data, randomizedIndex) {
        const selectedIndex = 49 // select 50th
        const transparentWllSize = 2

        let arrayResult = []
        let selectedIndexCount = selectedIndex
        let randomizedIndexCount = randomizedIndex

        if(data.length <= (selectedIndex + transparentWllSize)) {
            const loopTimes = Math.ceil((selectedIndex + transparentWllSize)/data.length)

            for(let i=0; i<(loopTimes*data.length); i++) {
                arrayResult[selectedIndexCount] = data[randomizedIndexCount]

                selectedIndexCount++
                randomizedIndexCount++

                if(selectedIndexCount > (loopTimes*data.length) - 1) {
                    selectedIndexCount = 0
                }

                if((randomizedIndexCount+1) > data.length) {
                    randomizedIndexCount = 0
                }
            }
        } else {
            for(let i=0; i<data.length; i++) {
                arrayResult[selectedIndexCount] = data[randomizedIndexCount]

                selectedIndexCount++
                randomizedIndexCount++

                if(selectedIndexCount > data.length-1) {
                    selectedIndexCount = 0
                }

                if((randomizedIndexCount+1) > data.length) {
                    randomizedIndexCount = 0
                }
            }
        }

        // console.log(arrayResult)
        // console.log(arrayResult.length)
        setSwappedData(arrayResult)
        setLoadingModal({
            ...loadingModal,
            status: false
        })
        setRandomzingModal(true)
        setTimeout(() => {
            setTurn(true)
        }, 250)
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
                {Object.keys(personsList).length > 0
                ?
                <Col md={12} sm={24}>
                    <CardShield className={currentAwardType === 'high' ? secondCardClass : 'disappeared'}>
                        <Card>
                            <Label theme={props.theme}>จับรางวัลกำลังพลชั้นสัญญาบัตร</Label>
                            <PersonsRemainNotice>
                                ทั้งหมด: {personsList.amount.high_max} นาย<br />
                                คงเหลือ: {personsList.amount.high_remain} นาย
                            </PersonsRemainNotice>
                            <PersonsAmountBlock theme={props.theme}>
                                <div>
                                    {Object.keys(personsList).length > 0 && personsList.data.high_max.map((person, personIndex) => {
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
                                    onClick={() => startButtonHandleClick(personsList.data.high_remain)}
                                    size='large'
                                    type='primary'
                                    icon={startBtnIcon}
                                    disabled={
                                        Object.keys(personsList).length === 0 ||
                                        personsList.amount.high_remain === 0 ||
                                        remainAwardsAmount === 0 ||
                                        currentAwardType !== 'high' ||
                                        startBtnIcon === 'loading' ||
                                        connectionIsLost === 1
                                    }
                                >
                                    สุ่มจับรางวัล
                                </Button>
                            </Col>
                            {personsList.amount.high_remain === 0 &&
                            <NoMoreRandomizing theme={props.theme}>
                                <span>รายชื่อทั้งหมด ถูกจับฉลากแล้ว</span>
                            </NoMoreRandomizing>
                            }
                        </Card>
                    </CardShield>

                    <CardShield className={currentAwardType === 'normal' ? secondCardClass : 'disappeared'}>
                        <Card>
                            <Label theme={props.theme}>จับรางวัลกำลังพลชั้นต่ำกว่าสัญญาบัตร</Label>
                            <PersonsRemainNotice>
                                ทั้งหมด: {personsList.amount.normal_max} นาย<br />
                                คงเหลือ: {personsList.amount.normal_remain} นาย
                            </PersonsRemainNotice>
                            <PersonsAmountBlock theme={props.theme}>
                                <div>
                                    {Object.keys(personsList).length > 0 && personsList.data.normal_max.map((person, personIndex) => {
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
                                    onClick={() => startButtonHandleClick(personsList.data.normal_remain)}
                                    size='large'
                                    type='primary'
                                    icon={startBtnIcon}
                                    disabled={
                                        Object.keys(personsList).length === 0 ||
                                        personsList.amount.normal_remain === 0 ||
                                        remainAwardsAmount === 0 ||
                                        currentAwardType !== 'normal' ||
                                        startBtnIcon === 'loading' ||
                                        connectionIsLost === 1
                                    }
                                >
                                    สุ่มจับรางวัล
                                </Button>
                            </Col>
                            {personsList.amount.normal_remain === 0 &&
                            <NoMoreRandomizing theme={props.theme}>
                                <span>รายชื่อทั้งหมด ถูกจับฉลากแล้ว</span>
                            </NoMoreRandomizing>
                            }
                        </Card>
                    </CardShield>

                    <CardShield className={currentAwardType === 'all' ? secondCardClass : 'disappeared'}>
                        <Card>
                            <Label theme={props.theme}>จับรางวัลใหญ่</Label>
                            <PersonsRemainNotice>
                                ทั้งหมด: {personsList.amount.all_max} นาย<br />
                                คงเหลือ: {personsList.amount.all_remain} นาย
                            </PersonsRemainNotice>
                            <PersonsAmountBlock theme={props.theme}>
                                <div>
                                    {Object.keys(personsList).length > 0 && personsList.data.all_max.map((person, personIndex) => {
                                        return (
                                            <p key={personIndex} className={person.is_picked_up_bonus > 0 ? "is-picked-up" : ""}>
                                                {`${personIndex+1}.)`} {person.fullname}
                                            </p>
                                        )
                                    })}
                                </div>
                            </PersonsAmountBlock>
                            <Col xs={24}>
                                <Button
                                    onClick={() => startButtonHandleClick(personsList.data.all_remain, 'special')}
                                    size='large'
                                    type='primary'
                                    icon={startBtnIcon}
                                    disabled={
                                        Object.keys(personsList).length === 0 ||
                                        personsList.amount.all_remain === 0 ||
                                        remainAwardsAmount === 0 ||
                                        currentAwardType !== 'all' ||
                                        startBtnIcon === 'loading' ||
                                        connectionIsLost === 1
                                    }
                                >
                                    สุ่มจับรางวัล
                                </Button>
                            </Col>
                            {personsList.amount.all_remain === 0 &&
                            <NoMoreRandomizing theme={props.theme}>
                                <span>รายชื่อทั้งหมด ถูกจับฉลากแล้ว</span>
                            </NoMoreRandomizing>
                            }
                        </Card>
                    </CardShield>
                </Col>
                :
                <Col md={12} sm={24}>
                    <DataNotFound />
                </Col>
                }
                <AwardsResult
                    data={awardsList}
                    setclass={thirdCardClass}
                    display="split"
                    
                    // comments 2 line below to disable disqualification function
                    isAbleToDisqualified={true}
                    disqualificationCallBack={disqualification}
                />
            </MainRow>
            <CustomizedModal
                centered
                width="100%"
                visible={randomzingModal}
                footer={null}
                closable={false}
                theme={props.theme}
            >
                {Object.keys(personsList).length > 0 &&
                <SlotMachine
                    title="กำลังสุ่มรายชื่อผู้โชคดี"
                    data={swappedData}
                    start={turn}
                />
                }
            </CustomizedModal>
            <LoadingModal title={loadingModal.title} visibility={loadingModal.status} theme={props.theme} />
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)