import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Button,
    Row,
    Col,
    message,
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

import NextAward from '../components/coop/NextAward'
import AwardsResult from '../components/coop/AwardsResult'

const Label = styled.p`
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
`

const PersonsAmountBlock = styled.div`
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;

    div {
        height: 300px;
        overflow: auto;
        text-align: left;
        margin: 0 5rem;

        p {
            margin: 0;

            &.is-picked-up {
                background-color: rgba(0, 255, 0, 0.5);
            }
        }
        
        @media (max-width: 991px) {
            margin: 0;

            p {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
`

const ButtonContainer = styled(Row)`
    text-align: center;
    display: ${props => props.display || 'none'};
    ${props => props.hasmarginbottom && 'margin-bottom: 15px;'}
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
            swalCustomize.close()
            successMessage("สุ่มรายชื่อกำลังพลสำเร็จ")
        }
    }, [percent])

    useEffect(() => {
        switch (connectionIsLost) {
            case 1:
                LoadingSwal("การเชื่อมต่อไม่เสถียร... กำลังเชื่อมต่ออีกครั้ง...", props.theme)
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
        swalCustomize.close()
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

    function swapListItems() {
        let listItemsSize = listItems.length // array length
        let characters = []
        let swappedItems = []
        
        for(let i=0; i<listItemsSize; i++) {
            characters = [...characters, i]
        }
        
        for(let i=0; i<listItemsSize; i++) {
            let charactersLength = characters.length // array length
            let randomizedIndex = i === 0 ? Math.floor(Math.random() * (charactersLength-1)) + 1 : characters[Math.floor(Math.random()*charactersLength)]

            characters = characters.filter(item => randomizedIndex !== item)
            swappedItems = [...swappedItems, listItems[randomizedIndex]]
        }

        setListItems(swappedItems)
    }

    function startButtonHandleClick(time) {
        setStartBtnIcon('loading')
        setPercent(initialState('percent'))

        LoadingSwal("กำลังสุ่มรายชื่อ...", props.theme)

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
                            <PersonsAmountBlock>
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
                            <ButtonContainer display="block">
                                <Col xs={24} className="animated fadeIn">
                                    <Button
                                        onClick={() => startButtonHandleClick(1500)}
                                        size='large'
                                        type='primary'
                                        icon={startBtnIcon}
                                        disabled={awardsList.remain === 0 || startBtnIcon === 'loading' || connectionIsLost === 1}
                                    >
                                        สุ่มจับรางวัล
                                    </Button>
                                </Col>
                            </ButtonContainer>
                        </Card>
                    </CardShield>
                </Col>
                <AwardsResult data={awardsList} setclass={thirdCardClass} display="split" />
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)