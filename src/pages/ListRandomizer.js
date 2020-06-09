import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Input,
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

const NextReward = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    .next-award {
        font-size: 1.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlightday' : 'highlightnight'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    /* Standard syntax */
    @keyframes highlightday {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: rgb(255, 255, 255);
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
    }

    @keyframes highlightnight {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: rgb(75, 75, 75);
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
    }
`

const Label = styled.p`
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
`

const VerticalSpace = styled.div`
    margin-bottom: 10px;
`

const ListItemsInput = styled(Input)`
    width: '100%';
    color: ${props => props.theme !== 'sun' && 'rgb(255, 255, 255)'};
    background-color: ${props => props.theme !== 'sun' && 'rgb(90, 90, 90)'};
    border-color: ${props => props.theme !== 'sun' && 'rgb(125, 125, 125)'};
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
        animation-name: ${props => props.theme === 'sun' ? 'highlightday' : 'highlightnight'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    /* Standard syntax */
    @keyframes highlightday {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: rgb(255, 255, 255);
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
    }

    @keyframes highlightnight {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: rgb(75, 75, 75);
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
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

const ListItemsInputContainer = styled.div`
    display: flex;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const CustomizedLabel = styled.div`
    width: 20%;
    min-width: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-weight: 500;
    color: ${props => props.theme === 'sun' ? 'rgb(0, 0, 0)' : 'rgb(225, 225, 225)'};
    transition: 0.3s;

    @media (max-width: 767px) {
        width: 100%;
        justify-content: flex-start;
    }
`

const CustomizedInputBlock = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    margin-left: 10px;

    .sub_customized_input_block {
        width: 80%;
    }

    .add_button_layout {
        margin-left: 10px;
        width: 20%;
    }

    @media (max-width: 767px) {
        width: 100%;
        margin-left: 0;
    }
`

const PlusButton = styled(Button)`
    transition: 0.3s;

    &:disabled {
        cursor: default;
        border-color: ${props => props.settheme !== 'sun' && 'rgb(125, 125, 125)'};
        background-color: ${props => props.settheme !== 'sun' && 'rgb(75, 75, 75)'};

        &:active,
        &:focus,
        &:hover {
            border-color: ${props => props.settheme !== 'sun' && 'rgb(125, 125, 125)'};
            background-color: ${props => props.settheme !== 'sun' && 'rgb(75, 75, 75)'};
        }
    }
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
    const [currentListItem, setCurrentListItem] = useState(initialState('currentListItem'))
    const [plusButtonDisabledStatus, setPlusButtonDisabledStatus] = useState(initialState('plusButtonDisabledStatus'))
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
            displayResultModal()
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
                return []

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
        setCurrentListItem(initialState('currentListItem'))
        setPlusButtonDisabledStatus(initialState('plusButtonDisabledStatus'))
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

    function listItemsHandleChange(event) {
        const value = event.target.value
        setCurrentListItem(value)

        if(value !== '') {
            setPlusButtonDisabledStatus(false)
        } else {
            setPlusButtonDisabledStatus(initialState('plusButtonDisabledStatus'))
        }
    }

    function listItemsHandleKeyPress(event) {
        if(currentListItem !== '') {
            if (event.key === 'Enter') {
                addListItem()
            }
        }
    }

    function addListItem() {
        setListItems([...listItems, currentListItem])
        setCurrentListItem('')
        setListItemsNotice('')
        setClearBtnDisplay('block')
        setStartBtnDisabled(false)
        setPlusButtonDisabledStatus(initialState('plusButtonDisabledStatus'))

        successMessage(`Add "${currentListItem}" to your list.`)
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

        LoadingSwal("Randomizing...", props.theme)

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

    function displayTopThreeRandomizedListItems() {
        return (
            <RandomizedResultContent>
                There were {randomizedListItems.length} items in your list. Here is the top 3 of them:
            </RandomizedResultContent>
        )
    }

    function displayAllRandomizedListItems() {
        return (
            <RandomizedResultContent>
                There were {randomizedListItems.length} items in your list. Here they are in random order:
            </RandomizedResultContent>
        )
    }

    function displayResultModal() {
        swalCustomize({
            className: props.theme !== 'sun' && "night",
            buttons: {
                cancel: 'Close',
                randomAgain: {
                    text: 'Again!',
                    value: 'random'
                }
            },
            closeOnClickOutside: false,
            closeOnEsc: false,
            content: (
                <SwalResultContainer padding="0.5rem 1rem 0 1rem" theme={props.theme}>
                    <TitleIcon type="check-circle" theme="filled" color="#52c41a" />
                    <SuccessContent theme={props.theme}>Successfully Randomized</SuccessContent>
                    <DisplayRandomizedResultContent padding={randomizedListItems.length > 0 ? '0.5rem 0' : '0'} hasShadow={true}>
                        {randomizedListItems.length > 0
                            && randomizedListItems.length > 3 
                                ? displayTopThreeRandomizedListItems()
                                : displayAllRandomizedListItems()}
                        {randomizedListItems.slice(0, 3).map((item, index) => {
                            return (
                                <RandomizedResultContent key={index} className={index === 0 && 'firstPrize'} theme={props.theme}>
                                    <span className="orderedIcon">{renderMedalIcon(index+1)}</span>
                                    <span>{item}</span>
                                </RandomizedResultContent>
                            )
                        })}
                    </DisplayRandomizedResultContent>
                </SwalResultContainer>
            )
        })
        .then((value) => {
            switch(value) {
                case "random":
                    startButtonHandleClick(500)
                    break

                default:
                    break
            }
        })
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
                    <NextReward theme={props.theme}>
                        <CardShield style={{ opacity: 0 }}>
                            <Card>
                                จำนวนรางวัลคงเหลือ: 21
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                <p>
                                    รางวัลรายการถัดไป: <span className="next-award">เงินจำนวน 1000 บาท</span>
                                </p>
                            </Card>
                        </CardShield>
                        <CardShield className={firstCardClass}>
                            <Card>
                                จำนวนรางวัลคงเหลือ: <span className="next-award">21</span>
                            </Card>
                        </CardShield>
                    </NextReward>
                </Col>
            </MainRow>
            <MainRow>
                <Col md={12} sm={24}>
                    <CardShield className={firstCardClass}>
                        <Card>
                            <ListItemsInputContainer>
                                <CustomizedLabel theme={props.theme}>
                                    Add an item
                                </CustomizedLabel>
                                <CustomizedInputBlock>
                                    <div className="sub_customized_input_block">
                                        <ListItemsInput
                                            theme={props.theme}
                                            aria-label="List Items"
                                            size='large'
                                            disabled={elementDisabled}
                                            value={currentListItem}
                                            placeholder='Enter an item'
                                            onChange={listItemsHandleChange}
                                            onKeyPress={listItemsHandleKeyPress}
                                        />
                                    </div>
                                    <div className="add_button_layout">
                                        <PlusButton
                                            style={{ width: '100%' }}
                                            disabled={plusButtonDisabledStatus}
                                            onClick={addListItem}
                                            size='large'
                                            type='primary'
                                            icon="plus"
                                            settheme={props.theme}
                                        >
                                        </PlusButton>
                                    </div>
                                </CustomizedInputBlock>
                            </ListItemsInputContainer>
                        </Card>
                    </CardShield>
                    <CardShield className={secondCardClass}>
                        <Card>
                            <Label theme={props.theme}>List Items</Label>
                            <DisplayMainData>
                                <Row className="list_items_notice_container">
                                    <ListItemsNotificationText className="animated fadeIn" display={listItems.length === 0 ? "block" : "none"} theme={props.theme}>
                                        {listItemsNotice}
                                    </ListItemsNotificationText>
                                </Row>
                                <ButtonContainer display={clearBtnDisplay} hasmarginbottom="true" className="animated fadeIn">
                                    <LeftCol xs={12}>
                                        <Button
                                            className="animated fadeIn"
                                            size='small'
                                            shape='round'
                                            type='ghost'
                                            icon='swap'
                                            disabled={elementDisabled}
                                            onClick={() => swapListItems()}
                                            style={listItems.length > 1 ? {display: 'block'} : {display : 'none'}}
                                        >
                                            Swap
                                        </Button>
                                    </LeftCol>
                                    <RightCol xs={12}>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title="Are you sure to remove all items?"
                                            onConfirm={removeAllListItems}
                                            okText="Confirm"
                                            okType="danger"
                                            cancelText="Cancel"
                                        >
                                            <ClearButton
                                                style={{padding: 0}}
                                                size='small'
                                                shape='round'
                                                type='link'
                                                disabled={elementDisabled}
                                            >
                                                Clear
                                            </ClearButton>
                                        </Popconfirm>
                                    </RightCol>
                                </ButtonContainer>
                                {listItems.map((item, index) => 
                                    <Row key={`list_items_${index}`} className="list_items_container animated fadeIn">
                                        <LeftCol xs={20}>
                                            <p>{index+1}) {item}</p>
                                        </LeftCol>
                                        <RightCol xs={4}>
                                            <Button
                                                size='small'
                                                type='danger'
                                                icon='minus'
                                                shape='circle'
                                                onClick={() => removeListItem(index)}
                                                disabled={elementDisabled}
                                            >
                                            </Button>
                                        </RightCol>
                                    </Row>
                                )}
                                <ButtonContainer display={startBtnDisplay}>
                                    <Col xs={24} className="animated fadeIn">
                                        <Button
                                            disabled={startBtnDisabled}
                                            onClick={() => startButtonHandleClick(1000)}
                                            size='large'
                                            shape='round'
                                            type='primary'
                                            icon={startBtnIcon}
                                        >
                                            Randomize
                                        </Button>
                                    </Col>
                                </ButtonContainer>
                                <ListItemsNotificationText className="animated fadeIn" display={listItems.length === 1 ? 'block' : 'none'} theme={props.theme}>
                                    <ListItemsNotificationIcon type="info-circle" theme="twoTone" twoToneColor="#faad14" /> Need one or more items to randomize.
                                </ListItemsNotificationText>
                            </DisplayMainData>
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
                            <Label theme={props.theme}>Result</Label>
                            <TitleIcon type={percent === 100 ? "check-circle" : "question-circle"} theme="filled" color={percent === 100 ? "#52c41a" : props.theme === 'sun' ? "#dddddd" : "#999999"} />
                            <VerticalSpace />
                            <ShowProgressBar theme={props.theme}>
                                <Progress percent={percent} status="active" />
                            </ShowProgressBar>
                            <ListItemsNotificationText display={randomizedListItems.length === 0 ? 'block' : 'none'} theme={props.theme}>
                                Your result will be display here.
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