import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { 
    Col,
    message
} from 'antd'
import 'antd/dist/antd.min.css'
import RandomizeIcon from '../components/icons/Randomize'
import LotteryIcon from '../components/icons/Lottery'
import hexColorToRgba from '../components/functions/hexColorToRgba'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import CardShield from '../components/layouts/CardShield'
import Card from '../components/layouts/Card'
import MainTitle from '../components/layouts/MainTitle'

const ModifiedCardShield = styled(CardShield)`
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
`

const ModifiedCard = styled(Card)`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    div {
        transition: 0.2s;
    }
    
    &:hover,
    &:active {
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
        transform: scaleY(1.25);

        div {
            transform: scaleX(1.25);
        }
    }

    @media (max-width: 767px) {
        &:hover,
        &:active {
            transform: none;

            div {
                transform: scaleX(1.25) scaleY(1.25);
            }
        }
    }
`

const Title = styled.p`
    color: #000;
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 5px;
    margin-bottom: 5px;
`

function mapStateToProps(state) {
    return state
}

function Home(props) {
    const [leftColumnClass, setLeftColumnClass] = useState('hidden')
    const [rightColumnClass, setRightColumnClass] = useState('hidden')

    const cards = [
        {
            page: 'List Randomizer',
            url: '/list-randomizer',
            icon: <RandomizeIcon color={hexColorToRgba('#1890ff', 0.8)} setWidth="4rem" setHeight="4rem" />
        },
        {
            page: 'Lottery Randomizer',
            url: '/lottery-randomizer',
            icon: <LotteryIcon color={hexColorToRgba('#1890ff', 0.8)} setWidth="4rem" setHeight="4rem" />
        },
    ]

    useEffect(() => {
        props.dispatch({
            type: 'SET_BREADCRUMB',
            data: [
                {
                    page: 'Home',
                    url: ''
                }
            ]
        })

        const classNames = {
            first: "animated fadeIn",
            second: "animated fadeIn",
        }

        setTimeout(() => {
            setLeftColumnClass(classNames.first)
            setRightColumnClass(classNames.second)
        }, 150)

        message.destroy()
    }, [])

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                <MainTitle title="Choose a program..."/>
                {cards.map((card, index) => {
                    return (
                        <Col md={12} sm={24} key={index}>
                            <ModifiedCardShield className={index%2 === 0 ? leftColumnClass : rightColumnClass}>
                                <Link to={card.url}>
                                    <ModifiedCard>
                                        <div>
                                            {card.icon}
                                            <Title>{card.page}</Title>
                                        </div>
                                    </ModifiedCard>
                                </Link>
                            </ModifiedCardShield>
                        </Col>
                    )
                })}
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(Home)