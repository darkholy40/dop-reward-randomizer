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

    span.award-type {
        display: block;
        margin-top: 0.5rem;
        color: ${props => props.theme === 'sun' ? 'rgb(56, 142, 60)' : 'rgb(165, 214, 167)'};
        transition: 0.3s;
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

    function displayAwardType(value) {
        switch (value) {
            case 'high':
                return 'ชั้นสัญญาบัตร'

            case 'normal':
                return 'ชั้นต่ำกว่าสัญญาบัตร'

            case 'all':
                return 'รางวัลใหญ่'
        
            default:
                break
        }
    }

    return (
        <Col xs={24}>
            {Object.keys(awardsList).length > 0 ?
            <Block theme={props.theme}>
                <CardShield className="dummy">
                    <Card>
                        <p className="block">
                            จำนวนรางวัลคงเหลือ: {awardsList.amount.awards_remain}
                        </p>
                    </Card>
                </CardShield>
                <CardShield className={cardClass}>
                    <Card>
                        <p className="block">
                            {awardsList.amount.awards_remain > 0
                            ?
                            <span>
                                รางวัลรายการถัดไป: <span className="next-award">{awardsList.data.awards_remain[0].name}</span>
                                <br />
                                <span className="award-type">{displayAwardType(awardsList.data.awards_remain[0].type)}</span>
                            </span>
                            :
                            <span className="next-award">จับรางวัลหมดแล้ว</span>}
                        </p>
                    </Card>
                </CardShield>
                <CardShield className={cardClass}>
                    <Card>
                        <p className="block">
                            จำนวนรางวัลคงเหลือ: <span className="remain-awards">{awardsList.amount.awards_remain}</span>
                        </p>
                    </Card>
                </CardShield>
            </Block>
            :
            <Block theme={props.theme}>
                <CardShield className="dummy" />
                <CardShield className={cardClass}>
                    <Card>
                        <p className="block">
                            <span>ไม่พบข้อมูลหรือไม่สามารถอ่านข้อมูลจากเซิร์ฟเวอร์ได้</span>
                        </p>
                    </Card>
                </CardShield>
                <CardShield className="dummy" />
            </Block>
            }
        </Col>
    )
}

export default connect(mapStateToProps)(NextAward)