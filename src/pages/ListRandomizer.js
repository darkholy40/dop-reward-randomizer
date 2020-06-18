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
import sortResultArrayToDisplay from '../components/functions/sortResultArrayToDisplay'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import LoadingModal from '../components/layouts/LoadingModal'

import NextAward from '../components/coop/NextAward'
import AwardsResult from '../components/coop/AwardsResult'
import DataNotFound from '../components/coop/DataNotFound'
import SlotMachine from '../components/coop/SlotMachine'
import SlotMachineDummy from '../components/coop/SlotMachineDummy'

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

const SlotMachineModal = styled(Modal)`
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
    const [dataForSending, setDataForSending] = useState({
        theChosenId: 0,
        theChosenName: '',
        option: ''
    })

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

    useEffect(() => {
        if(swappedData.length > 0) {
            setLoadingModal({
                ...loadingModal,
                status: false
            })
            props.dispatch({
                type: 'SET_RANDOMIZING_MODAL',
                visible: true
            })
            setTimeout(() => {
                setTurn(true)
            }, 250)
        }
    }, [swappedData])

    useEffect(() => {
        if(props.slotMachine.hasFinished === true) {
            if(dataForSending.option === 'save-bonus-award') {
                saveBonusAward(dataForSending.theChosenId)
            } else {
                saveAward(dataForSending.theChosenId)
            }

            setTimeout(() => {
                props.dispatch({
                    type: 'SET_SLOT_MACHINE_STATUS',
                    currentState: props.slotMachine,
                    status: false
                })

                props.dispatch({
                    type: 'SET_INTERVAL_STATUS',
                    status: true
                })

                props.dispatch({
                    type: 'SET_RANDOMIZING_MODAL',
                    visible: false
                })

                setTimeout(() => {
                    setTurn(false)
                    props.dispatch({
                        type: 'SET_RANDOM_TIMES',
                        times: Math.ceil(Math.random()*3)+2
                    })
                    setSwappedData([])
                }, 100)
            }, 2500)
        }
    }, [props.slotMachine.hasFinished])

    useInterval(() => {
        fetchData()
    }, props.intervalIsActived ? 1000 : null)

    function initialState(stateName) {
        switch (stateName) {
            case 'startBtnIcon':
                return 'caret-right'

            default:
                break
        }
    }

    function fetchData() {
        // ดึงข้อมูล รายชื่อกำลังพลใน กพ.ทบ. ทั้งหมด
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

        // ดึงข้อมูล รายการรางวัลทั้งหมด
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

        // ดึงสถานะ กำลังสุ่ม
        axios.get(`${props.url}/get/activestatus`)
        .then(res => {
            const response = res.data
            console.log(response.data[0].active)

            props.dispatch({
                type: 'SET_IS_RANDOMIZING',
                activeStatus: response.data[0].active === 1 ? true : false
            })
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

        axios.post(`${props.url}/save/award`, {
            awardId: currentAwardId,
            personId: theChosenId
        })
        .then(res => {
            // console.log(res.data)

            axios.post(`${props.url}/save/status/active`, {
                activeStatus: 0,
                randomizedIndex: 0,
                fullname: '',
                rankLevel: ''
            })
            .then(res => {
                fetchData()
                stopProcess()
                message.success("สุ่มรายชื่อกำลังพลสำเร็จ")
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
            notification['error']({
                message: 'แจ้งเตือน',
                description: 'บันทึกข้อมูลไม่สำเร็จ',
                duration: 3,
            })
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

            axios.post(`${props.url}/save/status/active`, {
                activeStatus: 0,
                randomizedIndex: 0,
                fullname: '',
                rankLevel: ''
            })
            .then(res => {
                fetchData()
                stopProcess()
                message.success("สุ่มรายชื่อกำลังพลสำเร็จ")
            })
            .catch((err) => {
                console.log(err)
            })
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
            message.success("ตัดสิทธิ์กำลังพลสำเร็จ")
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function startButtonHandleClick(Arraydata, option) {
        setStartBtnIcon('loading')

        setLoadingModal({
            title: 'กำลังเตรียมรายชื่อ...',
            status: true
        })

        props.dispatch({
            type: 'SET_INTERVAL_STATUS',
            status: false
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

        setLoadingModal({
            ...loadingModal,
            status: false
        })

        props.dispatch({
            type: 'SET_INTERVAL_STATUS',
            status: true
        })
    }

    function goRandomize(arrayData, option) {
        let listItemsSize = arrayData.length // array length
        let randomizedIndex = Math.floor(Math.random()*listItemsSize)
        let theChosen = arrayData[randomizedIndex]

        axios.post(`${props.url}/save/status/active`, {
            activeStatus: 1,
            randomizedIndex: randomizedIndex,
            fullname: theChosen.fullname,
            rankLevel: awardsList.data.awards_remain[0].type
        })
        .then(res => {
            console.log(res.data)
            
            setSwappedData(sortResultArrayToDisplay(arrayData, randomizedIndex, props.slotMachine.selectedRow, props.slotMachine.transparentWallSize, props.randomTimes))
            console.log(theChosen)
    
            setDataForSending({
                theChosenId: theChosen.id,
                theChosenName: theChosen.fullname,
                option: option
            })
        })
        .catch((err) => {
            console.log(err)

            stopProcess()
            notification['error']({
                message: 'แจ้งเตือน',
                description: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้',
                duration: 3,
            })
        })
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
                            <Label theme={props.theme}>จับรางวัลกำลังพลชั้นประทวนและพนักงานราชการ</Label>
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
                    <DataNotFound setclass={secondCardClass} />
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
            <SlotMachineModal
                centered
                width="100%"
                visible={props.randomzingModal}
                footer={null}
                closable={false}
                theme={props.theme}
            >
                {props.randomzingModal
                ?
                    Object.keys(personsList).length > 0 &&
                    <SlotMachine
                        title="กำลังสุ่มรายชื่อผู้โชคดี"
                        data={swappedData}
                        start={turn}
                        loopTimes={props.randomTimes}
                    />
                : // ต้องเคลียร์ elements เดิมออก ไม่งั้นจะ error ในส่วนการ scrolling
                    <SlotMachineDummy
                        title="กำลังสุ่มรายชื่อผู้โชคดี"
                        theChosenName={dataForSending.theChosenName}
                        theme={props.theme}
                    />
                }
            </SlotMachineModal>
            <LoadingModal title={loadingModal.title} visibility={loadingModal.status} theme={props.theme} />
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)