import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    p {
        font-size: 2rem;
        margin: 0;
    }

    @media (max-width: 767px) {
        p {
            font-size: 1.25rem;
        }        
    }
`

const Block = styled.div`
    font-size: 2.5rem;
    background-color: ${props => props.theme === 'sun' ? 'rgb(165, 214, 167)' : 'rgb(56, 142, 60)'};
    height: ${props => props.slotMachine.height}px;
    display: flex;
    align-items: center;

    div {
        margin-left: 2rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    @media (max-width: 767px) {
        font-size: 1.75rem;

        div {
            margin-left: 0.5rem;
        } 
    }
`

function mapStateToProps(state) {
    return state
}

function SlotMachineDummy(props) {
    return (
        <>
            {props.title !== undefined &&
            <Title>
                <p>{props.title}</p>
            </Title>
            }
            <Block
                slotMachine={props.slotMachine}
                theme={props.theme}
            >
                <div>{props.theChosenName}</div>
            </Block>
        </>
    )
}

export default connect(mapStateToProps)(SlotMachineDummy)