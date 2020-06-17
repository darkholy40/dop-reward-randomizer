import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Slot from './class/Slot'

const random = {
    duration: [
        15000,
        16250,
        17500,
        18750,
        20000
    ]
}

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
    ${props => `
    position: relative;
    height: ${props.slotMachine.height*((props.slotMachine.transparentWallSize*2)+1)}px;

    .ribbon {
        position: absolute;
        top: ${props.slotMachine.height*props.slotMachine.transparentWallSize}px;
        height: ${props.slotMachine.height}px;
        width: 100%;
        background-color: ${props.theme === 'sun' ? 'rgb(165, 214, 167)' : 'rgb(56, 142, 60)'};

        &.finished {
            animation-duration: 0.5s;
            animation-name: ${props.theme === 'sun' ? 'blink-day' : 'blink-night'};
            animation-delay: 0;
            animation-iteration-count: 5;
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
        height: ${props.slotMachine.height*props.slotMachine.transparentWallSize}px;
        width: 100%;
        background-color: ${props.theme === 'sun' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(75, 75, 75, 0.5)'};
        z-index: 100;
    }

    .transparent-wall-bottom {
        position: absolute;
        top: ${props.slotMachine.height*(props.slotMachine.transparentWallSize+1)}px;
        height: ${props.slotMachine.height*props.slotMachine.transparentWallSize}px;
        width: 100%;
        background-color: ${props.theme === 'sun' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(75, 75, 75, 0.5)'};
        z-index: 100;
    }

    .slot {
        font-size: 2.5rem;
        height: ${props.slotMachine.height*((props.slotMachine.transparentWallSize*2)+1)}px;

        .slot-item {
            height: ${props.slotMachine.height}px;
            display: flex;
            align-items: center;

            div {
                margin-left: 2rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }

    @media (max-width: 767px) {
        .slot {
            font-size: 1.75rem;

            .slot-item {
                div {
                    margin-left: 0.5rem;
                }
            }
        }        
    }
    `}
`

function mapStateToProps(state) {
    return state
}

function SlotMachine(props) {
    const duration = random.duration[Math.floor(Math.random()*random.duration.length)]

    return (
        <>
            {props.title !== undefined &&
            <Title>
                <p>{props.title}</p>
            </Title>
            }
            <Block theme={props.theme} slotMachine={props.slotMachine}>
                <div className="transparent-wall-top" />
                <div className="transparent-wall-bottom" />
                <div className={props.slotMachine.hasFinished ? "ribbon finished" : "ribbon"} />
                <Slot
                    className="slot"
                    duration={duration}
                    target={props.start ? props.slotMachine.selectedRow*props.loopTimes : 0} // Ex. if selected row to display result is 50th, then use index at 49 of array
                    // times={1} // ไม่ใช้ props จำนวนครั้ง ของ Slot -> เนื่องจาก ไม่ smooth
                    height={props.slotMachine.height*(props.slotMachine.transparentWallSize+1)}
                    onEnd={() => {
                        props.dispatch({
                            type: 'SET_SLOT_MACHINE_STATUS',
                            currentState: props.slotMachine,
                            status: true
                        })
                    }}
                >
                    {props.data.map((item, index) => {
                        return (
                            <div key={index} className="slot-item">
                                <div>{item.fullname}</div>
                            </div>
                        )
                    })}
                </Slot>
            </Block>
        </>
    )
}

export default connect(mapStateToProps)(SlotMachine)