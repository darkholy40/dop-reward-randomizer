import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { 
    Col,
    Button,
    Icon,
    message
} from 'antd'
import 'antd/dist/antd.min.css'
// import swal from 'sweetalert'
import swalCustomize from '@sweetalert/with-react'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import MainTitle from '../components/layouts/MainTitle'
import LoadingSwal from '../components/layouts/LoadingSwal'

const Label = styled.p`
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const Description = styled.p`
    display: inline-block;
    margin: 0;
    
    &.ranStrLen {
        padding-left: 5px;
    }

    @media (max-width: 414px) {
        display: block;
        &.ranStrLen {
            padding-left: 0;
        }
    }
`

const VerticalSpace = styled.div`
    margin-bottom: 10px;
`

const HorizontalContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const VerticalContainer = styled(HorizontalContainer)`
    flex-direction: column;
    padding: ${props => props.padding || 0};
`

const CustomizeRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`

const ButtonRow = styled(CustomizeRow)`
    width: 200px;
    margin-bottom: 0.75rem;
`

const ResultRow = styled(CustomizeRow)`
    display: ${props => props.display || 'flex'};
    justify-content: center;
    width: 100%;

    span {
        font-size: 1.2rem;
    }

    &.ranStr {
        animation-duration: 2s;
        animation-name: highlight;
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    /* Safari 4.0 - 8.0 */
    @-webkit-keyframes highlight {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: white;
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
    }

    /* Standard syntax */
    @keyframes highlight {
        0% {
            background-color: rgba(255, 255, 0, 0.3);
        }

        50% {
            background-color: white;
        }

        100% {
            background-color: rgba(255, 255, 0, 0.3);
        }
    }
`

const DisplayRandomStringLength = styled.div`
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0 0.5rem;
    font-size: 1.2rem;
`

const ModalResultBlock = styled.div`
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    padding: 0.5rem 0px;
`

const ResultDescription = styled.p`
    display: ${props => props.display || 'flex'};
    font-size: 0.85rem;
    margin: 0;
    padding: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    justify-content: center;
`

const DummyResult = styled.span`
    color: rgba(0,0,0,0.3);
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
`

const TitleIcon = styled(Icon)`
    color: ${props => props.color || '#000000'};
    font-size: 4rem;
`

const SuccessContent = styled.p`
    color: rgba(0, 0, 0, 0.65);
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const SwalResultContainer = styled.div`
    padding: ${props => props.padding || '0'};
    border: 0;
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

function LotteryRandomizer(props) {
    const [randomStringLength, setRandomStringLength] = useState(initialState('randomStringLength'))
    const [listCharacters, setListCharacters] = useState(initialState('listCharacters'))
    const [percent, setPercent] = useState(initialState('percent'))
    const [getStringsIcon, setGetStringsIcon] = useState(initialState('getStringsIcon'))
    const [getStringsIsDisabled, setGetStringsIsDisabled] = useState(initialState('getStringsIsDisabled'))
    const [cardClass, setCardClass] = useState({
        left: 'hidden',
        right: 'hidden'
    })
    const stringLengthDefaultValue = {
        min: 1,
        max: 6
    }
    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown"
    }

    useEffect(() => {
        props.dispatch({
            type: 'SET_BREADCRUMB',
            data: [
                {
                    page: 'Home',
                    url: '/'
                },
                {
                    page: 'Lottery Randomizer',
                    url: ''
                }
            ]
        })

        setTimeout(() => {
            setCardClass({
                left: classNames.first,
                right: classNames.second
            })
        }, 150)
    }, [])

    useEffect(() => {
        if(getStringsIsDisabled === false && listCharacters.length > 0) {
            displayResultModal()
        }
    }, [getStringsIsDisabled])

    function initialState(stateName) {
        switch (stateName) {
            case 'randomStringLength':
                return 2

            case 'listCharacters':
                return []

            case 'percent':
                return 0

            case 'getStringsIcon':
                return 'caret-right'

            case 'getStringsIsDisabled':
                return false

            default:
                break
        }
    }

    function changeRandomStringLength(value) {
        switch (value) {
            case 'increase':
                setRandomStringLength(randomStringLength + 1)
                break

            case 'decrease':
                setRandomStringLength(randomStringLength - 1)
                break

            case 'max':
                setRandomStringLength(stringLengthDefaultValue.max)
                break

            case 'min':
                setRandomStringLength(stringLengthDefaultValue.min)
                break

            default:
                break
        }
    }

    function handleClickStartButton() {
        setGetStringsIsDisabled(true)
        setGetStringsIcon('loading')
        setListCharacters(initialState('listCharacters'))
        setPercent(initialState('percent'))

        LoadingSwal("Randomizing...")

        setTimeout(() => {
            randomizeStrings()
        }, 500)
    }

    function stopProcess() {
        setGetStringsIsDisabled(initialState('getStringsIsDisabled'))
        setGetStringsIcon(initialState('getStringsIcon'))
    }

    function randomizeStrings() {
        const randomCharacters = '0123456789'
        const characters = randomCharacters.split('');
        let randomStringItems = []

        for(let i=0; i<randomStringLength; i++) {
            let randomString = characters[Math.floor(Math.random()*characters.length)]
            randomStringItems = [...randomStringItems, randomString]
        }

        setListCharacters(randomStringItems)
        setPercent(100)
        stopProcess()
    }

    function takeResultToInitialState() {
        setListCharacters(initialState('listCharacters'))
        setPercent(initialState('percent'))
    }

    function displayDummyResult() {
        let elements = ''

        for(let i=0; i<randomStringLength; i++) {
            elements += 'X'
        }

        return elements
    }

    function displayResultModal() {
        swalCustomize({
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
                <SwalResultContainer padding="0.5rem 1rem 0 1rem">
                    <TitleIcon type="check-circle" theme="filled" color="#52c41a" />
                    <SuccessContent>Successfully Randomized</SuccessContent>
                    <ModalResultBlock>
                        <ResultDescription>
                            {displayResultDescription()}
                        </ResultDescription>
                        <ResultRow className="ranStr">
                            {listCharacters.map((item, index) => {
                                return (
                                <span key={index}>{item}</span>
                                )
                            })}
                        </ResultRow>
                    </ModalResultBlock>
                </SwalResultContainer>
            )
        })
        .then((value) => {
            switch(value) {
                case "random":
                    handleClickStartButton()
                    break

                default:
                    message.destroy()
                    successMessage('Have a good luck 😊')
                    break
            }
        })
    }

    function displayResultDescription() {
        return 'Here is your lucky number'
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
                <MainTitle title="Lottery Randomizer"/>
                <Col md={12} sm={24}>
                    <CardShield className={cardClass.left}>
                        <Card>
                            <Label>Set of numbers</Label>
                            <Description>The set of numbers will contain</Description>
                            <Description className="ranStrLen">{randomStringLength} {randomStringLength > 1 ? 'characters' : 'character'}.</Description>
                            <VerticalContainer padding="1.25rem 0">
                                <ButtonRow>
                                    {/* <Button
                                        size='small'
                                        type='default'
                                        shape='round'
                                        onClick={() => changeRandomStringLength('min')} // min
                                        disabled={randomStringLength > stringLengthDefaultValue.min ? false : true}
                                    >
                                        Min
                                    </Button> */}
                                    <Button
                                        size='small'
                                        type='danger'
                                        icon='minus'
                                        shape='circle'
                                        onClick={() => changeRandomStringLength('decrease')} // decrease
                                        disabled={randomStringLength > stringLengthDefaultValue.min ? false : true}
                                    >
                                    </Button>
                                    <DisplayRandomStringLength>
                                        {randomStringLength}
                                    </DisplayRandomStringLength>
                                    <Button
                                        size='small'
                                        type='primary'
                                        icon='plus'
                                        shape='circle'
                                        onClick={() => changeRandomStringLength('increase')} // increase
                                        disabled={randomStringLength < stringLengthDefaultValue.max ? false : true}
                                    >
                                    </Button>
                                    {/* <Button
                                        size='small'
                                        type='default'
                                        shape='round'
                                        onClick={() => changeRandomStringLength('max')} // max
                                        disabled={randomStringLength < stringLengthDefaultValue.max ? false : true}
                                    >
                                        Max
                                    </Button> */}
                                </ButtonRow>
                                <ResultRow>
                                    <DummyResult>
                                        {displayDummyResult()}
                                    </DummyResult>
                                </ResultRow>
                            </VerticalContainer>
                            <HorizontalContainer>
                                <Button
                                    onClick={() => handleClickStartButton()} // ถ้าจะส่ง event ให้ใช้แบบนี้ {handleClickStartButton}
                                    size='large'
                                    shape='round'
                                    type='primary'
                                    icon={getStringsIcon}
                                    disabled={getStringsIsDisabled}
                                >
                                    Get Lucky Number
                                </Button>
                            </HorizontalContainer>
                        </Card>
                    </CardShield>
                </Col>
                <Col md={12} sm={24}>
                    <CardShield className={cardClass.right}>
                        <Card>
                            <ClearResultButton
                                size='small'
                                type='ghost'
                                icon='close'
                                shape='circle'
                                thisdisplay={listCharacters.length > 0 ? 'block' : 'none'}
                                onClick={() => {
                                    takeResultToInitialState()
                                    warningMessage('The result has been cleared.')
                                }}
                            >
                            </ClearResultButton>
                            <Label>Result</Label>
                            <TitleIcon type={percent === 100 ? "check-circle" : "question-circle"} theme="filled" color={percent === 100 ? "#52c41a" : "#dddddd"} />
                            <VerticalSpace />
                            <VerticalContainer>
                                <ResultDescription display={percent === 0 ? 'flex' : 'none'}>
                                    <DummyResult>Your result will be display here.</DummyResult>
                                </ResultDescription>
                                <ResultDescription display={percent === 0 ? 'none' : 'flex'}>
                                    {displayResultDescription()}
                                </ResultDescription>
                                <ResultRow className="ranStr" display={percent === 0 ? 'none' : 'flex'}>
                                    {listCharacters.map((item, index) => {
                                        return (
                                        <span key={index}>{item}</span>
                                        )
                                    })}
                                </ResultRow>
                            </VerticalContainer>
                        </Card>
                    </CardShield>
                </Col>
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(LotteryRandomizer)