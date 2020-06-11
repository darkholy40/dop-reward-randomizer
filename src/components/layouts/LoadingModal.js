import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Modal,
    Spin
} from 'antd'

const CustomizedModal = styled(Modal)`
    max-width: 520px;
    padding: 0 1rem;

    .ant-modal-content {
        background-color: ${props => props.theme !== 'sun' && 'rgb(75, 75, 75)'};
        color: ${props => props.theme !== 'sun' && 'rgb(225, 225, 225)'};
    }
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.65)' : 'rgb(225, 225, 225)'};
    padding: ${props => props.padding || '0'};
    border: 0;
`

const Content = styled.p`
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`

const CustomizedSpin = styled(Spin)`
    margin-top: 15px;
    margin-bottom: 15px;

    .ant-spin-dot {
        font-size: 65px;

        .ant-spin-dot-item {
            width: 30px;
            height: 30px;
            background-color: ${props => props.theme === 'sun' ? '#1890ff' : '#52c41a'};
        }
    }
`

function mapStateToProps(state) {
    return state
}

function LoadingModal(props) {
    return (
        <CustomizedModal
            centered
            width="100%"
            visible={props.visibility}
            footer={null}
            closable={false}
            theme={props.theme}
        >
            <Container padding="0.5rem 1rem" theme={props.theme}>
                <CustomizedSpin size="large" theme={props.theme} />
                <Content>{props.title}</Content>
             </Container>
        </CustomizedModal>
    )
}

export default connect(mapStateToProps)(LoadingModal)