import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Col
} from 'antd'

import CardShield from '../layouts/CardShield'
import Card from '../layouts/Card'

const Block = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    p.block {
        font-size: 1.5rem;
        margin: 0;
    }

    span.next-award {
        font-size: 2rem;
        padding: 0 0.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-yellow-day' : 'highlight-yellow-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    span.remain-awards {
        font-size: 2rem;
        padding: 0 0.5rem;
        animation-duration: 2s;
        animation-name: ${props => props.theme === 'sun' ? 'highlight-blue-day' : 'highlight-blue-night'};
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-direction: forward;
    }

    .dummy {
        opacity: 0;
    }

    @media (max-width: 767px) {
        flex-direction: column;

        p.block {
            font-size: 1rem;
        }

        span.next-award,
        span.remain-awards {
            font-size: 1.5rem;
        }

        .dummy {
            display: none;
        }
    }
`

function mapStateToProps(state) {
    return state
}

function NextAward(props) {
    const awardsList = props.data || {}
    const cardClass = props.setclass || {}

    return (
        <Col xs={24}>
            <Block theme={props.theme}>
                <CardShield className="dummy">
                    <Card>
                        <p className="block">
                            จำนวนรางวัลคงเหลือ: {awardsList.remain}
                        </p>
                    </Card>
                </CardShield>
                <CardShield className={cardClass}>
                    <Card>
                        <p className="block">
                            {Object.keys(awardsList).length > 0
                            ?
                                awardsList.remain > 0
                                ?
                                <>รางวัลรายการถัดไป: <span className="next-award">{awardsList.data.awards_remain[0].name}</span></>
                                :
                                <span className="next-award">จับรางวัลหมดแล้ว</span>
                            :
                                <span>ไม่สามารถอ่านข้อมูลได้</span>
                            }
                        </p>
                    </Card>
                </CardShield>
                <CardShield className={Object.keys(awardsList).length > 0 ? cardClass : "dummy"}>
                    <Card>
                        <p className="block">
                        {Object.keys(awardsList).length > 0
                            ?
                                <>จำนวนรางวัลคงเหลือ: <span className="remain-awards">{awardsList.remain}</span></>
                            :
                                <span>ไม่สามารถอ่านข้อมูลได้</span>
                        }
                        </p>
                    </Card>
                </CardShield>
            </Block>
        </Col>
    )
}

export default connect(mapStateToProps)(NextAward)