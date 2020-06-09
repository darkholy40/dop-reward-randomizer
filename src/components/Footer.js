import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import footerImage from '../images/footer/logodopv3.png'
import { Icon, Modal } from 'antd'
import useInterval from './functions/useInterval'
import colorsOfTheDay from './functions/colorsOfTheDay'
import hexColorToRgbValue from './functions/hexColorToRgbValue'
import getDayString from './functions/getDayString'
import getMonthString from './functions/getMonthString'

const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem 2rem 1.5rem 2rem;
    margin-top: auto;
    background-color: ${props => props.theme === 'sun' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)'};
    color: ${props => props.theme === 'sun' ? 'rgb(0, 0, 0)' : 'rgb(225, 225, 225)'};
    position: relative;
    box-shadow: 0px -5px 10px rgba(0,0,0,0.1);
    transition: 0.3s;

    &.hidden {
        opacity: 0;
    }
`

const Row = styled.div`
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    @media (max-width: 767px) {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
`

const FooterImageContainer = styled.div`
    border-radius: 5rem;
    overflow: hidden;
`

const ProfileImageBlock = styled.div`
    cursor: pointer;
`

const ProfileImage = styled.img`
    max-width: 6rem;
    max-height: 6rem;

    &:hover {
        opacity: 0.9;
    }
`

const CustomizedModal = styled(Modal)`
    max-width: 520px;

    .ant-modal-close-x {
        width: 30px;
        height: 30px;
        line-height: 30px;

        ${props => props.settheme !== 'sun' && `
            color: rgb(225, 225, 225);
            &:hover {
                color: rgb(175, 175, 175);
            }
        `}
    }

    .ant-modal-content {
        background-color: ${props => props.settheme !== 'sun' && 'rgb(75, 75, 75)'};
        color: ${props => props.settheme !== 'sun' && 'rgb(225, 225, 225)'};
    }
`

const ClockModal = styled(Modal)`
    .ant-modal-content {
        overflow: hidden;
    }

    .ant-modal-close-x {
        width: 45px;
        height: 45px;
        line-height: 45px;
    }

    .ant-modal-body {
        width: 100%;
        background: ${props => `linear-gradient(225deg, rgba(255, 255, 255, 1) 0%, rgba(${props.thisBackgroundColor}, 0.25) 100%);` || 'none'};
        padding: 3rem;
        transition: 0.5s;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span.date {
            padding: 0.5rem 0;
            font-size: 2rem;
        }

        span.clock {
            padding: 0.5rem 0;
            font-size: 6rem;
        }
    }

    @media (max-width: 767px) {
        .ant-modal-body {
            padding: 3rem 2rem;
        }

        div {
            span.date {
                font-size: 1.25rem;
                white-space: nowrap;
            }
    
            span.clock {
                font-size: 4rem;
            }
        }
    }
`

const ModalImage = styled.img`
    max-height: 100%;
    max-width: 100%;
`

const FooterContent = styled.span`
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
        margin-bottom: 0.25rem;
    }
`

const TopContainer = styled(Row)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const FooterTimeString = styled.span`
    font-size: 0.85rem;
    cursor: pointer;
    padding: 5px;

    &:hover {
        box-shadow: 0px 0px 5px  rgba(${props => `${props.thisBorderColor}` || '0, 0, 0'}, 0.9);
        border-radius: 5px;
    }

    @media (max-width: 767px) {
        margin-bottom: 1rem;
    }
`

function mapStateToProps(state) {
    return state
}

function Footer(props) {
    const [footerContainerState, setFooterContainerState] = useState('hidden')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalClockVisible, setModalClockVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setFooterContainerState('animated fadeIn')
        }, 500)

        fetchClock()
    }, [])

    useInterval(() => {
        fetchClock()
    }, 1000)

    function fetchClock() {
        props.dispatch({ type: 'FETCH_CLOCK' })
    }

    function getClock() {
        const hr = props.newDate.hour < 10 ? `0${props.newDate.hour}` : props.newDate.hour
        const min = props.newDate.minute < 10 ? `0${props.newDate.minute}` : props.newDate.minute
        const sec = props.newDate.second < 10 ? `0${props.newDate.second}` : props.newDate.second
        const time = `${hr}:${min}:${sec}`

        return `${time}`
    }

    function getLocaleString() {
        const dayString = getDayString(props.newDate.day)
        const time = getClock()

        const year = props.newDate.year
        const month = getMonthString(props.newDate.month)
        const day = props.newDate.date

        return `${dayString}, ${month} ${day}, ${year} ${time}`
    }

    function getLongString() {
        const longDayString = getDayString(props.newDate.day, 'long')
        const longMonthString = getMonthString(props.newDate.month, 'long')

        return `${longDayString}, ${longMonthString} ${props.newDate.date}, ${props.newDate.year}`
    }

    return (
        <FooterContainer className={footerContainerState} theme={props.theme}>
            <TopContainer>
                <ClockModal
                    centered
                    width="100%"
                    visible={modalClockVisible}
                    footer={null}
                    onCancel={() => setModalClockVisible(false)}
                    thisBackgroundColor={hexColorToRgbValue(colorsOfTheDay(props.newDate.day))}
                >
                    <div>
                        <span className="clock">{getClock()}</span>
                        <span className="date">{getLongString()}</span>
                    </div>
                </ClockModal>
                <FooterTimeString onClick={() => setModalClockVisible(true)} thisBorderColor={hexColorToRgbValue(colorsOfTheDay(props.newDate.day))}>
                    <Icon type="clock-circle" theme="twoTone" twoToneColor={colorsOfTheDay(props.newDate.day)} style={{marginRight: '0.5rem'}} />{getLocaleString()}
                </FooterTimeString>
            </TopContainer>
            <Row>
                <FooterImageContainer>
                    <ProfileImageBlock onClick={() => setModalVisible(true)}>
                        <ProfileImage src={footerImage} alt="2Lt. Apirak Suwanyotee" />
                    </ProfileImageBlock>
                    <CustomizedModal
                        centered
                        width="auto"
                        visible={modalVisible}
                        footer={null}
                        onCancel={() => setModalVisible(false)}
                        settheme={props.theme}
                    >
                        <ModalImage src={footerImage} alt="2Lt. Apirak Suwanyotee" />
                    </CustomizedModal>
                </FooterImageContainer>
            </Row>
            <Row>
                <FooterContent>
                    <span>จัดทำโดย กสท.สพบ.กพ.ทบ.</span>
                    <span>Powered by React.js</span>
                </FooterContent>
            </Row>
        </FooterContainer>
    )
}

export default connect(mapStateToProps)(Footer)