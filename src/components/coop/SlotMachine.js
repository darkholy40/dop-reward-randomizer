import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Slot from './class/Slot'

const height = 72
const transparentWallSize = 2
const Block = styled.div`
    position: relative;
    height: ${height*((transparentWallSize*2)+1)}px;

    .ribbon {
        position: absolute;
        top: ${height*transparentWallSize}px;
        height: ${height}px;
        width: 100%;
        background-color: rgba(0, 255, 0, 0.5);
    }

    .transparent-wall-top {
        position: absolute;
        top: 0;
        height: ${height*transparentWallSize}px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 100;
    }

    .transparent-wall-bottom {
        position: absolute;
        top: ${height*(transparentWallSize+1)}px;
        height: ${height*transparentWallSize}px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 100;
    }

    .slot {
        font-size: 2.5rem;
        height: ${height*((transparentWallSize*2)+1)}px;

        .slot-item {
            height: ${height}px;
            display: flex;
            align-items: center;
        }
    }
`

const random = {
    duration: [
        15000,
        20000,
        20000,
        22250,
        22250,
        25000,
        25000,
        30000
    ],
    times: [
        1,
        2
    ]
}

const duration = random.duration[Math.floor(Math.random()*random.duration.length)]
const time = random.times[Math.floor(Math.random()*random.times.length)]

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
                duration={5000}
                target={props.start ? 50 : 0} // use the 50 index of array
                times={time} // 1 time loop
                height={height*(transparentWallSize+1)}
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