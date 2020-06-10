import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import {
    notification
} from 'antd'
import 'antd/dist/antd.min.css'
import swalCustomize from '@sweetalert/with-react'
import useInterval from '../components/functions/useInterval'

import MainContainer from '../components/layouts/MainContainer'
import MainRow from '../components/layouts/MainRow'
import LoadingSwal from '../components/layouts/LoadingSwal'

import NextAward from '../components/coop/NextAward'
import AwardsResult from '../components/coop/AwardsResult'

function mapStateToProps(state) {
    return state
}

function Home(props) {
    const [firstCardClass, setFirstCardClass] = useState('hidden')
    const [secondCardClass, setSecondCardClass] = useState('hidden')

    const [awardsList, setAwardsList] = useState({})
    const [connectionIsLost, setConnectionIsLost] = useState(0)

    const classNames = {
        first: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeInDown",
        second: window.innerWidth < 768 ? "animated fadeInUp" : "animated fadeIn",
    }

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

        fetchData()

        setTimeout(() => {
            setFirstCardClass(classNames.first)
            setSecondCardClass(classNames.second)
        }, 150)
    }, [])

    useEffect(() => {
        switch (connectionIsLost) {
            case 1:
                LoadingSwal("การเชื่อมต่อไม่เสถียร... กำลังเชื่อมต่ออีกครั้ง...", props.theme)
                break

            case 2:
                notification['success']({
                    message: 'แจ้งเตือน',
                    description: 'การเชื่อมต่อสำเร็จ',
                    duration: 3,
                })
                break
        
            default:
                break
        }
    }, [connectionIsLost])

    useInterval(() => {
        fetchData()
    }, 1000)

    function fetchData() {
        // ดึกข้อมูล รายการรางวัลทั้งหมด
        axios.get(`${props.url}/getawardslist`)
        .then(res => {
            const response = res.data
            
            if(response.code === "00200") {
                // console.log(response.data)
                setAwardsList(response.data)

                if(connectionIsLost === 1) {
                    reconnect()
                }
            }
        })
        .catch((err) => {
            console.log(err)
            setConnectionIsLost(1)
        })
    }

    function reconnect() {
        swalCustomize.close()
        setConnectionIsLost(2)
    }

    return (
        <MainContainer className="animated fadeIn">
            <MainRow>
                <NextAward data={awardsList} setclass={firstCardClass} />
            </MainRow>
            <MainRow>
                <AwardsResult data={awardsList} setclass={secondCardClass} />
            </MainRow>
        </MainContainer>
    )
}

export default connect(mapStateToProps)(Home)