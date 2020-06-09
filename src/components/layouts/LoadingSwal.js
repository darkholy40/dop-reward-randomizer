import React from 'react'
import styled from 'styled-components'
import swalCustomize from '@sweetalert/with-react'
import { Spin } from 'antd'

const SwalResultContainer = styled.div`
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0.65)' : 'rgb(225, 225, 225)'};
    padding: ${props => props.padding || '0'};
    border: 0;
`

const SuccessContent = styled.p`
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 1rem;
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

function LoadingSwal(title, theme) {
    return swalCustomize({
        className: theme !== 'sun' && "night",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        content: (
            <SwalResultContainer padding="0.5rem 1rem" theme={theme}>
                <SuccessContent>{title}</SuccessContent>
                <CustomizedSpin size="large" theme={theme} />
            </SwalResultContainer>
        )
    })
}

export default LoadingSwal