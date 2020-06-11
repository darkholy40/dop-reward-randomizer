import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Col,
    Popconfirm
} from 'antd'

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

const Label = styled.p`
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
`

const Block = styled.div`
    text-align: left;

    p {
        display: flex;
        
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
`

const DisqualifyButton = styled.span`
    min-width: 45px;
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
`

const ListItemsNotificationText = styled.p`
    text-align: center;
    font-size: 0.85rem;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(175, 175, 175)'};
    margin: 0;
    display: ${props => props.display || 'none'};
    transition: 0.3s;
`

function mapStateToProps(state) {
    return state
}

function AwardsResult(props) {
    const awardsList = props.data || {}
    const cardClass = props.setclass || {}

    return (
        <Col md={props.display === "split" ? 12 : 24} sm={24}>
            <StyledCardShield className={cardClass}>
                <StyledCard theme={props.theme}>
                    <Label theme={props.theme}>ผลการจับรางวัล</Label>
                    <ListItemsNotificationText display={awardsList.remain === awardsList.max ? 'block' : 'none'} theme={props.theme}>
                        ยังไม่ทำการจับรางวัล
                    </ListItemsNotificationText>
                    <Block theme={props.theme} isAbleToDisqualified={props.isAbleToDisqualified}>
                        {Object.keys(awardsList).length > 0 && awardsList.data.persons_whom_are_picked_up.map((pickedupPerson, pickedupPersonIndex) => {
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
    )
}

export default connect(mapStateToProps)(AwardsResult)