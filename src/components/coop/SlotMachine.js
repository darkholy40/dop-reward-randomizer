import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Slot from './class/Slot'

const height = 72
const transparentWallSize = 2
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
    position: relative;
    height: ${height*((transparentWallSize*2)+1)}px;

    .ribbon {
        position: absolute;
        top: ${height*transparentWallSize}px;
        height: ${height}px;
        width: 100%;
        background-color: ${props => props.theme === 'sun' ? 'rgb(165, 214, 167)' : 'rgb(56, 142, 60)'};

        &.finished {
            animation-duration: 0.5s;
            animation-name: ${props => props.theme === 'sun' ? 'blink-day' : 'blink-night'};
            animation-delay: 0;
            animation-iteration-count: infinite;
            animation-direction: forward;
        }

        @keyframes blink-day {
            0% {
              background-color: rgb(165, 214, 167);
            }
            50% {
              background-color: rgb(255, 255, 255);
            }
            100% {
              background-color: rgb(165, 214, 167);
            }
        }
        @keyframes blink-night {
            0% {
              background-color: rgb(56, 142, 60);
            }
            50% {
              background-color: rgb(75, 75, 75);
            }
            100% {
              background-color: rgb(56, 142, 60);
            }
        }
    }

    .transparent-wall-top {
        position: absolute;
        top: 0;
        height: ${height*transparentWallSize}px;
        width: 100%;
        background-color: ${props => props.theme === 'sun' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(75, 75, 75, 0.5)'};
        z-index: 100;
    }

    .transparent-wall-bottom {
        position: absolute;
        top: ${height*(transparentWallSize+1)}px;
        height: ${height*transparentWallSize}px;
        width: 100%;
        background-color: ${props => props.theme === 'sun' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(75, 75, 75, 0.5)'};
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

    @media (max-width: 767px) {
        .slot {
            font-size: 1.75rem;

            .slot-item {
                div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }        
    }
`

function mapStateToProps(state) {
    return state
}

function SlotMachine(props) {
    const [isFinished, setIsFinished] = useState(false)

    return (
        <>
            {props.title !== undefined &&
            <Title>
                <p>กำลังสุ่มรายชื่อผู้โชคดี</p>
            </Title>
            }
            <Block theme={props.theme}>
                <div className="transparent-wall-top" />
                <div className="transparent-wall-bottom" />
                <div className={isFinished ? "ribbon finished" : "ribbon"} />
                <Slot
                    className="slot"
                    duration={3000}
                    target={props.start ? 50 : 0} // use the 50 index of array
                    times={1} // 1 time loop
                    height={height*(transparentWallSize+1)}
                    onEnd={() => {
                        setIsFinished(true)
                    }}
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
        </>
    )
}

export default connect(mapStateToProps)(SlotMachine)