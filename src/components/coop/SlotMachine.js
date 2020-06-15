import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Slot from './class/Slot'

const height = 72
const Block = styled.div`
    position: relative;
    height: ${height*3}px;

    .ribbon {
        position: absolute;
        top: ${height}px;
        height: ${height}px;
        width: 100%;
        background-color: rgba(0, 255, 0, 0.5);
    }

    .transparent-wall-top {
        position: absolute;
        top: 0;
        height: ${height}px;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
    }

    .transparent-wall-bottom {
        position: absolute;
        top: ${height*2}px;
        height: ${height}px;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
    }

    .slot {
        font-size: 2.5rem;
        height: ${height*3}px;

        .slot-item {
            height: ${height}px
            display: flex;
            align-items: center;
        }
    }
`

const randomTimer = [
    15000,
    20000,
    20000,
    22250,
    22250,
    25000,
    25000,
    30000
]

const duration = randomTimer[Math.floor(Math.random()*randomTimer.length)]

function mapStateToProps(state) {
    return state
}

function SlotMachine(props) {
    return (
        <Block>
            <div className="transparent-wall-top" />
            <div className="transparent-wall-bottom" />
            <div className="ribbon" />
            <Slot
                className="slot"
                duration={duration}
                target={props.start ? 50 : 0} // use the 50 index of array
                times={1} // 1 time loop
                height={height}
                onEnd={() => console.log('Complete')}
            >
            {props.data.map((item, index) => (
                <div key={index} className="slot-item">
                    {item.fullname.split('\n').map((v, i) => (
                        <div key={i}>
                            {v}
                        </div>
                    ))}
                </div>
            ))}
            </Slot>
        </Block>
    )
}

export default connect(mapStateToProps)(SlotMachine)