import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
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
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-yellow-day' : 'highlight-yellow-night'};
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

    span {
        font-size: 1.5rem;
    }
`

const SuccessContent = styled.p`
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const SwalResultContainer = styled.div`
    padding: ${props => props.padding || '0'};
    border: 0;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.65)' : 'rgb(225, 225, 225)'};
`

const DisplayMainData = styled.div`
    text-align: left;

    .list_items_notice_container {
        text-align: center;
    }

    .list_items_container {
        p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
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

const LeftCol = styled(Col)`
    text-align: left;
`

const RightCol = styled(Col)`
    text-align: right;
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

const ShowProgressBar = styled.div`
    text-align: center;
    margin-bottom: 15px;

    .ant-progress-inner {
        transition: 0.3s;
        ${props => props.theme !== 'sun' && 'background-color: #999999;'}
    }
`

const TitleIcon = styled(Icon)`
    color: ${props => props.color || '#000000'};
    font-size: 4rem;
    transition: 0.3s;
`

const ListItemsNotificationIcon = styled(Icon)`
    color: ${props => props.color || '#000000'};
`

const MedalIcon = styled(Icon)`
    svg {
        max-width: 1rem;
        max-height: 1rem;
    }
`

const ClearButton = styled(Button)`
    padding: 0;
`

const ClearResultButton = styled(Button)`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: ${props => props.thisdisplay};
`

function mapStateToProps(state) {
    return state
}

function ListRandomizer(props) {
    const [listItems, setListItems] = useState(initialState('listItems'))
    const [listItemsNotice, setListItemsNotice] = useState(initialState('listItemsNotice'))
    const [randomizedListItems, setRandomizedListItems] = useState(initialState('randomizedListItems'))
    const [startBtnIcon, setStartBtnIcon] = useState(initialState('startBtnIcon'))
    const [startBtnDisplay, setStartBtnDisplay] = useState(initialState('startBtnDisplay'))
    const [clearBtnDisplay, setClearBtnDisplay] = useState(initialState('clearBtnDisplay'))
    const [percent, setPercent] = useState(initialState('percent'))
    const [startBtnDisabled, setStartBtnDisabled] = useState(initialState('startBtnDisabled'))
    const [elementDisabled, setElementDisabled] = useState(initialState('elementDisabled'))

    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')
    const [thirdCardClass, setThirdCardClass] = useState('hidden')

    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        third: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown"
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

            case 'elementDisabled':
                return false

            default:
                break
        }
    }

    function getBackToInitialState() {
        setListItems(initialState('listItems'))
        setListItemsNotice(initialState('listItemsNotice'))
        setStartBtnIcon(initialState('startBtnIcon'))
        setStartBtnDisplay(initialState('startBtnDisplay'))
        setClearBtnDisplay(initialState('clearBtnDisplay'))
        setStartBtnDisabled(initialState('startBtnDisabled'))
        setElementDisabled(initialState('elementDisabled'))
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
        setElementDisabled(true)
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
        setElementDisabled(initialState('elementDisabled'))
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
                                จำนวนรางวัลคงเหลือ: 21
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                <p className="block">
                                    รางวัลรายการถัดไป: <span className="next-award">เงินจำนวน 1000 บาท</span>
                                </p>
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                จำนวนรางวัลคงเหลือ: <span className="next-award">21</span>
                            </Card>
                        </CardShield>
                    </NextAward>
                </Col>
            </MainRow>
            <MainRow>
                <Col md={12} sm={24}>
                    <CardShield className={secondCardClass}>
                        <Card>
                            <Label theme={props.theme}>จำนวนกำลังพลของ กพ.ทบ.</Label>
                            <PersonsAmountBlock>
                                <span>
                                    38 / 40
                                </span>
                            </PersonsAmountBlock>
                            <ButtonContainer display={startBtnDisplay}>
                                <Col xs={24} className="animated fadeIn">
                                    <Button
                                        onClick={() => startButtonHandleClick(1500)}
                                        size='large'
                                        shape='round'
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
                            <ClearResultButton
                                size='small'
                                type='ghost'
                                icon='close'
                                shape='circle'
                                thisdisplay={randomizedListItems.length > 0 ? 'block' : 'none'}
                                onClick={() => {
                                    takeResultToInitialState()
                                    warningMessage('The result has been cleared.')
                                }}
                            >
                            </ClearResultButton>
                            <Label theme={props.theme}>ผลการจับรางวัล</Label>
                            <ListItemsNotificationText display={randomizedListItems.length === 0 ? 'block' : 'none'} theme={props.theme}>
                                ยังไม่ทำการจับรางวัล
                            </ListItemsNotificationText>
                            <DisplayRandomizedResultContent padding={randomizedListItems.length > 0 ? '0.5rem 0' : '0'}>
                                {randomizedListItems.length > 0 && displayAllRandomizedListItems()}
                                {randomizedListItems.map((item, index) => {
                                    if(index < 3) {
                                        return (
                                            <RandomizedResultContent key={index} className={index === 0 && 'firstPrize'} theme={props.theme}>
                                                <span className="orderedIcon">{renderMedalIcon(index+1)}</span>
                                                <span>{item}</span>
                                            </RandomizedResultContent>
                                        )
                                    } else {
                                        return (
                                            <RandomizedResultContent key={index}>
                                                <span className="orderedNumber">{index+1})</span>
                                                <span>{item}</span>
                                            </RandomizedResultContent>
                                        )
                                    }
                                })}
                            </DisplayRandomizedResultContent>
                        </Card>
                    </CardShield>
                </Col>
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(ListRandomizer)