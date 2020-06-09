import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Button,
    Row,
    Col,
    Progress,
    Icon,
    Popconfirm,
    message
} from 'antd'
import 'antd/dist/antd.min.css'
// import swal from 'sweetalert'
import swalCustomize from '@sweetalert/with-react'
import FirstPrize from '../components/icons/medal/FirstPrize'
import SecondPrize from '../components/icons/medal/SecondPrize'
import ThirdPrize from '../components/icons/medal/ThirdPrize'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import MainTitle from '../components/layouts/MainTitle'
import LoadingSwal from '../components/layouts/LoadingSwal'

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

const DisplayRandomizedResultContent = styled.div`
    text-align: left;
    padding: ${props => props.padding || '0'};

    ${({ hasShadow }) => hasShadow && `
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    `}
`

const ListItemsNotificationText = styled.p`
    text-align: center;
    font-size: 0.85rem;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(175, 175, 175)'};
    margin: 0;
    display: ${props => props.display || 'none'};
    transition: 0.3s;
`

const ButtonContainer = styled(Row)`
    text-align: center;
    display: ${props => props.display || 'none'};
    ${props => props.hasmarginbottom && 'margin-bottom: 15px;'}
`

const RandomizedResultContent = styled.p`
    font-size: 0.85rem;
    margin: 0;
    padding: 5px;
    text-overflow: ellipsis;
    overflow: hidden;

    span.orderedIcon {
        padding-right: 0.3rem;
    }

    span.orderedNumber {
        padding-right: 0.5rem;
    }

    &.firstPrize {
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-green-day' : 'highlight-green-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }
`

const MedalIcon = styled(Icon)`
    svg {
        max-width: 1rem;
        max-height: 1rem;
    }
`

function mapStateToProps(state) {
    return state
}

function ListRandomizer(props) {
    const [listItems, setListItems] = useState(initialState('listItems'))
    const [randomizedListItems, setRandomizedListItems] = useState(initialState('randomizedListItems'))
    const [startBtnIcon, setStartBtnIcon] = useState(initialState('startBtnIcon'))
    const [startBtnDisplay, setStartBtnDisplay] = useState(initialState('startBtnDisplay'))
    const [percent, setPercent] = useState(initialState('percent'))
    const [startBtnDisabled, setStartBtnDisabled] = useState(initialState('startBtnDisabled'))

    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')
    const [thirdCardClass, setThirdCardClass] = useState('hidden')

    const [personsList, setPersonsList] = useState({})
    const [awardsList, setAwardsList] = useState({})

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

        getPersonsAndAwardsList()

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
        if(startBtnDisabled === false && listItems.length === 0) {
            backToBasic()
        }

        if(listItems.length > 1) {
            setStartBtnDisplay('block')
        } else {
            setStartBtnDisplay(initialState('startBtnDisplay'))
        }
    }, [listItems])

    function getPersonsAndAwardsList() {
        // ดึกข้อมูล รายชื่อกำลังพลใน กพ.ทบ. ทั้งหมด
        axios.get(`${props.url}/getpersons`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                console.log(response.data)
                setPersonsList(response.data)
            }
        })
        .catch((err) => {
            console.log(err)
        })

        // ดึกข้อมูล รายการรางวัลทั้งหมด
        axios.get(`${props.url}/getawardslist`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                console.log(response.data)
                setAwardsList(response.data)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function initialState(stateName) {
        switch (stateName) {
            case 'currentListItem':
                return ''

            case 'plusButtonDisabledStatus':
                return true

            case 'listItems':
                return ['0', '1', '2']

            case 'listItemsNotice':
                return `There's no any list items.`

            case 'randomizedListItems':
                return []

            case 'startBtnIcon':
                return 'caret-right'

            case 'startBtnDisplay':
                return ''

            case 'clearBtnDisplay':
                return ''

            case 'percent':
                return 0

            case 'startBtnDisabled':
                return true

            default:
                break
        }
    }

    function getBackToInitialState() {
        setListItems(initialState('listItems'))
        setStartBtnIcon(initialState('startBtnIcon'))
        setStartBtnDisplay(initialState('startBtnDisplay'))
        setStartBtnDisabled(initialState('startBtnDisabled'))
    }

    function takeResultToInitialState() {
        setRandomizedListItems(initialState('randomizedListItems'))
        setPercent(initialState('percent'))
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

    function removeListItem(arrChoicesIndex) {
        const markedItem = listItems[arrChoicesIndex]
        setListItems(listItems.filter((item, index) => arrChoicesIndex !== index))

        errorMessage(`Remove "${markedItem}" from your list.`)
    }

    function removeAllListItems() {
        backToBasic()
        warningMessage('All items have been removed.')
    }

    function backToBasic() {
        getBackToInitialState()
    }

    function startButtonHandleClick(time) {
        setStartBtnDisabled(initialState('startBtnDisabled'))
        setStartBtnIcon('loading')
        setRandomizedListItems(initialState('randomizedListItems'))
        setPercent(0)

        LoadingSwal("กำลังสุ่มรายชื่อ...", props.theme)

        setTimeout(() => {
            goRandomize()
        }, time || 500)
    }

    function stopProcess() {
        setStartBtnDisabled(false)
        setStartBtnIcon(initialState('startBtnIcon'))
    }

    function goRandomize() {
        let listItemsSize = listItems.length // array length
        let characters = []
        let randomizedItems = []
        
        for(let i=0; i<listItemsSize; i++) {
            characters = [...characters, i]
        }
        
        for(let i=0; i<listItemsSize; i++) {
            let charactersLength = characters.length // array length
            let randomizedIndex = characters[Math.floor(Math.random()*charactersLength)]

            characters = characters.filter(item => randomizedIndex !== item)
            randomizedItems = [...randomizedItems, listItems[randomizedIndex]]
        }

        setRandomizedListItems(randomizedItems)
        setPercent(100)
        stopProcess()
    }

    function displayAllRandomizedListItems() {
        return (
            <RandomizedResultContent>
                There were {randomizedListItems.length} items in your list. Here they are in random order:
            </RandomizedResultContent>
        )
    }

    function renderMedalIcon(prizeValue) {
        switch (prizeValue) {
            case 1:
                return <MedalIcon component={FirstPrize} />
            
            case 2:
                return <MedalIcon component={SecondPrize} />

            case 3:
                return <MedalIcon component={ThirdPrize} />
        
            default:
                break
        }
    }

    function successMessage(str) {
        message.success(str)
    }

    function errorMessage(str) {
        message.error(str)
    }
      
    function warningMessage(str) {
        message.warning(str)
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
                                    รางวัลรายการถัดไป: <span className="next-award">{awardsList.remain > 0 && awardsList.data.awards_remain[0].name}</span>
                                </p>
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                จำนวนรางวัลคงเหลือ: <span className="remain-awards">{awardsList.remain}</span>
                            </Card>
                        </CardShield>
                    </NextAward>
                </Col>
            </MainRow>
            <MainRow>
                <Col md={12} sm={24}>
                    <CardShield className={secondCardClass}>
                        <Card>
                            <Label theme={props.theme}>จำนวนกำลังพลของ กพ.ทบ. (ทั้งหมด {personsList.max} นาย)</Label>
                            <PersonsAmountBlock>
                                <div>
                                    {Object.keys(personsList).length > 0 && personsList.data.map((person, personIndex) => {
                                        return (
                                            <p key={personIndex} className={person.is_picked_up > 0 ? "is-picked-up" : ""}>
                                                {person.fullname}
                                            </p>
                                        )
                                    })}
                                </div>
                            </PersonsAmountBlock>
                            <ButtonContainer display={startBtnDisplay}>
                                <Col xs={24} className="animated fadeIn">
                                    <Button
                                        onClick={() => startButtonHandleClick(1500)}
                                        size='large'
                                        type='primary'
                                        icon={startBtnIcon}
                                    >
                                        สุ่มจับรางวัล
                                    </Button>
                                </Col>
                            </ButtonContainer>
                        </Card>
                    </CardShield>
                </Col>
                <Col md={12} sm={24}>
                    <CardShield className={thirdCardClass}>
                        <Card>
                            <Label theme={props.theme}>ผลการจับรางวัล</Label>
                            <ListItemsNotificationText display={randomizedListItems.length === 0 ? 'block' : 'none'} theme={props.theme}>
                                ยังไม่ทำการจับรางวัล
                            </ListItemsNotificationText>
                            
                        </Card>
                    </CardShield>
                </Col>
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)