import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
    Col
} from 'antd'
import 'antd/dist/antd.min.css'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'

function mapStateToProps(state) {
    return state
}

function Home(props) {
    useEffect(() => {
        props.dispatch({
            type: 'SET_BREADCRUMB',
            data: [
                {
                    page: 'ระบบสุ่มจับรางวัล กพ.ทบ.',
                    url: ''
                }
            ]
        })
    }, [])

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(Home)