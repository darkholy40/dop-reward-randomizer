import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { 
    Icon,
    Modal
} from 'antd'
import version from '../static_data/version'
import hexColorToRgba from './functions/hexColorToRgba'
import MainTitle from './layouts/MainTitle'
import SunIcon from './icons/theme/Sun'
import MoonIcon from './icons/theme/Moon'

const HeaderContainer = styled.div`
    background-color: ${props => props.theme === 'sun' ? '#0059A6' : 'rgb(50, 50, 50)'};
    color: #ffffff;
    transition: 0.3s;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    position: relative;

    &.hidden {
        opacity: 0;
    }
`

const HeaderContent = styled.span`
    font-size: 1rem;
    margin-bottom: 0.25rem;
`

const BreadCrumb = styled.span`
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
`

const BreadCrumbIcon = styled(Icon)`
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`

const ControlPanel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 75px;
    color: rgb(104, 104, 104);
    transition: 0.1s;

    div.switch_container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        svg {
            padding: 3px;
            border: 1px solid ${props => props.theme === 'sun' ? 'rgba(36, 172, 242, 0.5)' : 'rgba(250, 173, 20, 0.5)'};
            border-radius: 30px;
        }
    }

    div.pipe {
        border-left: 1px solid #eee;
        height: 24px;
    }

    @media (max-width: 767px) {
        margin-top: 0.25rem;
    }
`

const IconContainer = styled.div`
    display: flex;
    color: rgb(225, 225, 225);
    cursor: pointer;
    transition: 0.1s;

    &:hover, &:active {
        color: rgb(255, 255, 255);
    }    
`

const InfoModal = styled(Modal)`
    max-width: 520px;

    .ant-modal-close-x {
        width: 45px;
        height: 45px;
        line-height: 45px;

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

const InfoContent = styled.div`
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;

    p.title {
        font-weight: bold;
    }
`

function mapStateToProps(state) {
    return state
}

function Header(props) {
    const [headerContainerState, setHeaderContainerState] = useState('hidden')
    const [modalVisibility, setModalVisibility] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setHeaderContainerState('animated fadeIn')
        }, 250)
    }, [])

    function switchTheme() {
        if(props.theme === 'sun') {
            props.dispatch({
                type: 'SET_THEME',
                data: 'moon'
            })
        } else {
            props.dispatch({
                type: 'SET_THEME',
                data: 'sun'
            })
        }
    }

    function displayThemeIcon(value) {
        switch (value) {
            case 'sun':
                return <MoonIcon color={hexColorToRgba('#24ACF2', 1)} setWidth="1.5rem" setHeight="1.5rem" />
        
            default:
                return <SunIcon color={hexColorToRgba('#faad14', 1)} setWidth="1.5rem" setHeight="1.5rem" />
        }
    }

    return (
        <HeaderContainer className={headerContainerState} theme={props.theme}>
            <HeaderContent>
                {props.breadcrumb !== undefined && props.breadcrumb.map((item, index) => {
                    if(index === props.breadcrumb.length - 1) {
                        return <BreadCrumb key={index} theme={props.theme}>{item.page}</BreadCrumb>
                    }

                    return (
                        <BreadCrumb key={index}>
                            <Link to={item.url}>{item.page}</Link>
                            <BreadCrumbIcon type="caret-right" />
                        </BreadCrumb>
                    )
                })}
            </HeaderContent>
            <HeaderContent>
                <ControlPanel theme={props.theme}>
                    <div className="switch_container" onClick={() => switchTheme()}>
                        {displayThemeIcon(props.theme)}
                    </div>
                    <div className="pipe" />
                    <IconContainer theme={props.theme}>
                        <Icon
                            type="info-circle"
                            theme={modalVisibility === true ? 'filled' : ''}
                            style={{fontSize: '1.25rem'}}
                            onClick={() => setModalVisibility(true)}
                        />
                    </IconContainer>
                </ControlPanel>
                <InfoModal
                    style={{ top: 20 }}
                    width="auto"
                    visible={modalVisibility}
                    footer={null}
                    onCancel={() => setModalVisibility(false)}
                    settheme={props.theme}
                >
                    <MainTitle title="ประวัติเวอร์ชัน" marginBottom="10px" />
                    {version.map((item, index) => {
                        return (
                            <InfoContent key={index}>
                                <p className="title">{item.title}</p>
                                {item.content.map((itm, idx) => {
                                    return (
                                        <p key={idx}>- {itm}.</p>
                                    )
                                })}
                            </InfoContent>
                        )
                    })}
                    <p style={{
                        textAlign: 'right',
                        marginTop: 30,
                        marginRight: 14
                    }}>
                        กสท.สพบ.กพ.ทบ.
                    </p>
                    <p style={{
                        textAlign: 'right'
                    }}>
                        ร.ต. อภิรักษ์ สุวรรณโยธี
                    </p>
                </InfoModal>
            </HeaderContent>
        </HeaderContainer>
    )
}

export default connect(mapStateToProps)(Header)