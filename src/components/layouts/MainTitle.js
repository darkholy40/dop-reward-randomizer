import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Container = styled.div`
    display: inline-block;
    box-sizing: border-box;
    padding: 0 15px;
    margin-bottom: ${props => props.marginBottom || '30px'};
    width: 100%;
`

const Block = styled.div`
    padding: 0.5rem 0;
    display: flex;
    border-bottom: 2px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
    color: ${props => props.theme === 'sun' ? 'rgb(0, 0, 0)' : 'rgb(225, 225, 225)'};
    transition: 0.3s;
`

const Label = styled.span`
    font-size: 22px;
    font-weight: 600;
    line-height: 28px;
`

function mapStateToProps(state) {
    return state
}

function MainTitle(props) {
    return (
        <Container marginBottom={props.marginBottom}>
            <Block theme={props.theme}>
                <Label>
                    {props.title}
                </Label>
            </Block>
        </Container>
    )
}

export default connect(mapStateToProps)(MainTitle)