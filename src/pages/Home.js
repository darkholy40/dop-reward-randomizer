import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Modal,
    notification
} from 'antd'
import 'antd/dist/antd.min.css'
import useInterval from '../components/functions/useInterval'
import sortResultArrayToDisplay from '../components/functions/sortResultArrayToDisplay'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import LoadingModal from '../components/layouts/LoadingModal'

import NextAward from '../components/coop/NextAward'
import AwardsResult from '../components/coop/AwardsResult'
import SlotMachine from '../components/coop/SlotMachine'
import SlotMachineDummy from '../components/coop/SlotMachineDummy'

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

function Home(props) {
    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')

    const [personsList, setPersonsList] = useState({})
    const [awardsList, setAwardsList] = useState({})
    const [connectionIsLost, setConnectionIsLost] = useState(0)
    const [loadingModal, setLoadingModal] = useState({
        title: '',
        status: false
    })

    const [turn, setTurn] = useState(false)
    const [swappedData, setSwappedData] = useState([])
    const [theChosenName, setTheChosenName] = useState('')

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
                setLoadingModal({
                    title: 'การเชื่อมต่อไม่เสถียร... กำลังเชื่อมต่ออีกครั้ง...',
                    status: true
                })
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
            fetchAwardsList()
            
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

    useEffect(() => {
        if(props.isRandomizing === true) {
            setLoadingModal({
                title: 'กำลังเตรียมรายชื่อ...',
                status: true
            })
    
            props.dispatch({
                type: 'SET_INTERVAL_STATUS',
                status: false
            })
        }
    }, [props.isRandomizing])

    useInterval(() => {
        fetchData()
    }, props.intervalIsActived ? 1000 : null)

    function fetchData() {
        // ดึงข้อมูล รายชื่อกำลังพลใน กพ.ทบ. ทั้งหมด
        axios.get(`${props.url}/getpersons`)
        .then(res => {
            const responseOfPersonsList = res.data
            
            if(responseOfPersonsList.code === "00200") {
                // console.log(responseOfPersonsList.data)
                setPersonsList(responseOfPersonsList.data)

                if(connectionIsLost === 1) {
                    reconnect()
                }

                // ดึงสถานะ กำลังสุ่ม
                axios.get(`${props.url}/get/activestatus`)
                .then(res => {
                    const response = res.data
                    // console.log(response.data[0].active)

                    props.dispatch({
                        type: 'SET_IS_RANDOMIZING',
                        activeStatus: response.data[0].active === 1 ? true : false
                    })

                    if(response.data[0].active === 1) {
                        setTimeout(() => {
                            setSwappedData(sortResultArrayToDisplay(responseOfPersonsList.data.data[`${response.data[0].rank_level}_remain`], response.data[0].randomzing_index, props.slotMachine.selectedRow, props.slotMachine.transparentWallSize, props.randomTimes))
                            setTheChosenName(response.data[0].fullname)
                        }, 3000)
                    } else {
                        setSwappedData([])
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setConnectionIsLost(1)
                })
            }
        })
        .catch((err) => {
            console.log(err)
            setConnectionIsLost(1)
        })

        fetchAwardsList()
    }

    function fetchAwardsList() {
        // ดึงข้อมูล รายการรางวัลทั้งหมด
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
        setLoadingModal({
            ...loadingModal,
            status: false
        })
        setConnectionIsLost(2)
    }

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                <NextAward data={awardsList} setclass={firstCardClass} />
            </MainRow>
            <MainRow>
                <AwardsResult data={awardsList} setclass={secondCardClass} />
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
                        theChosenName={theChosenName}
                        theme={props.theme}
                    />
                }
            </SlotMachineModal>
            <LoadingModal title={loadingModal.title} visibility={loadingModal.status} theme={props.theme} />
        </MainContainer>
    )
}

export default connect(mapStateToProps)(Home)