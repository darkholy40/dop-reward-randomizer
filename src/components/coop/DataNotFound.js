import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import CardShield from '../layouts/CardShield'
import Card from '../layouts/Card'

const StyledCardShield = styled(CardShield)`
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledCard = styled(Card)`
    width: 960px;
`

const StyledText = styled.p`
    text-align: center;
    font-size: 1.25rem;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(175, 175, 175)'};
    margin: 0;
    display: block;
    transition: 0.3s;

    @media (max-width: 767px) {
        font-size: 1rem;
    }
`


function mapStateToProps(state) {
    return state
}

function DataNotFound(props) {
    return (
        <StyledCardShield className={props.setclass}>
            <StyledCard theme={props.theme}>
                <StyledText theme={props.theme}>
                    ไม่พบข้อมูลหรือไม่สามารถอ่านข้อมูลจากเซิร์ฟเวอร์ได้
                </StyledText>
            </StyledCard>
        </StyledCardShield>
    )
}

export default connect(mapStateToProps)(DataNotFound)