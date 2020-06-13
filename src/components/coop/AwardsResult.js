import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Col,
    Popconfirm
} from 'antd'

import CardShield from '../layouts/CardShield'
import Card from '../layouts/Card'
import DataNotFound from './DataNotFound'

const StyledCardShield = styled(CardShield)`
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledCard = styled(Card)`
    width: 960px;
`

const Label = styled.p`
    text-align: left;
    font-size: 1.5rem;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};

    @media (max-width: 767px) {
        font-size: 1rem;
    }
`

const Block = styled.div`
    text-align: left;

    p {
        display: flex;
        font-size: 1.25rem;
        
        span.left {
            width: 40%;
        }

        span.right {
            width: 60%;
            margin-left: 0.5rem;
            ${props => props.isAbleToDisqualified && `
                display: flex;
                justify-content: space-between;
            `}

            span.first-picked-up {
                animation-duration: 2s;
                animation-name: ${props => props.theme === 'sun' ? 'highlight-green-day' : 'highlight-green-night'};
                animation-delay: 0;
                animation-iteration-count: infinite;
                animation-direction: forward;
            }
        }
    }

    @media (max-width: 767px) {
        p {
            font-size: 0.85rem;
        }
    }
`

const DisqualifyButton = styled.span`
    min-width: 65px;
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-decoration: underline;
    color: #ff4d4f;
    transition: 0.3s;

    &:hover {
        color: #ff7875;
    }

    @media (max-width: 767px) {
        min-width: 45px;
    }
`

const ListItemsNotificationText = styled.p`
    text-align: center;
    font-size: 1.25rem;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(175, 175, 175)'};
    margin: 0;
    display: ${props => props.display || 'none'};
    transition: 0.3s;

    @media (max-width: 767px) {
        font-size: 1rem;
    }
`

function mapStateToProps(state) {
    return state
}

function AwardsResult(props) {
    const awardsList = props.data || {}
    const cardClass = props.setclass || {}

    return (
        <>
            {Object.keys(awardsList).length > 0
            ?
            <Col md={props.display === "split" ? 12 : 24} sm={24}>
                <StyledCardShield className={cardClass}>
                    <StyledCard theme={props.theme}>
                        <Label theme={props.theme}>ผลการจับรางวัลใหญ่</Label>
                        <ListItemsNotificationText display={awardsList.amount.awards_remain === awardsList.amount.big_awards_max ? 'block' : 'none'} theme={props.theme}>
                            ยังไม่ทำการจับรางวัล
                        </ListItemsNotificationText>
                        <Block theme={props.theme} isAbleToDisqualified={props.isAbleToDisqualified}>
                            {awardsList.data.big_awards_result.map((bigAwardPerson, bigAwardPersonIndex) => {
                                return (
                                    <p key={bigAwardPersonIndex}>
                                        <span className="left">{bigAwardPerson.award_name}</span>
                                        <span className="right">
                                            <span className={bigAwardPersonIndex === 0 ? "first-picked-up" : ""}>{bigAwardPerson.person_fullname}</span>
                                            {props.isAbleToDisqualified &&
                                            <Popconfirm
                                                placement="bottomRight"
                                                title="ท่านกำลังตัดสิทธิ์กำลังพลรายนี้ออกจากรายการรับรางวัล?"
                                                onConfirm={() => props.disqualificationCallBack(bigAwardPerson.award_id_bonus, bigAwardPerson.person_id, 'bonus')}
                                                okText="ตกลง"
                                                okType="danger"
                                                cancelText="ยกเลิก"
                                            >
                                                <DisqualifyButton>ตัดสิทธิ์</DisqualifyButton>
                                            </Popconfirm>
                                            }
                                        </span>
                                    </p>
                                )
                            })}
                        </Block>
                    </StyledCard>
                </StyledCardShield>

                <StyledCardShield className={cardClass}>
                    <StyledCard theme={props.theme}>
                        <Label theme={props.theme}>ผลการจับรางวัล</Label>
                        <ListItemsNotificationText display={awardsList.amount.awards_remain === awardsList.amount.awards_max ? 'block' : 'none'} theme={props.theme}>
                            ยังไม่ทำการจับรางวัล
                        </ListItemsNotificationText>
                        <Block theme={props.theme} isAbleToDisqualified={props.isAbleToDisqualified}>
                            {awardsList.data.awards_result.map((pickedupPerson, pickedupPersonIndex) => {
                                return (
                                    <p key={pickedupPersonIndex}>
                                        <span className="left">{pickedupPerson.award_name}</span>
                                        <span className="right">
                                            <span className={pickedupPersonIndex === 0 ? "first-picked-up" : ""}>{pickedupPerson.person_fullname}</span>
                                            {props.isAbleToDisqualified &&
                                            <Popconfirm
                                                placement="bottomRight"
                                                title="ท่านกำลังตัดสิทธิ์กำลังพลรายนี้ออกจากรายการรับรางวัล?"
                                                onConfirm={() => props.disqualificationCallBack(pickedupPerson.award_id, pickedupPerson.person_id)}
                                                okText="ตกลง"
                                                okType="danger"
                                                cancelText="ยกเลิก"
                                            >
                                                <DisqualifyButton>ตัดสิทธิ์</DisqualifyButton>
                                            </Popconfirm>
                                            }
                                        </span>
                                    </p>
                                )
                            })}
                        </Block>
                    </StyledCard>
                </StyledCardShield>
            </Col>
            :
            <Col md={props.display === "split" ? 12 : 24} sm={24}>
                <DataNotFound />
            </Col>
            }
        </>
    )
}

export default connect(mapStateToProps)(AwardsResult)