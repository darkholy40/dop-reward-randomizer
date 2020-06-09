import React from 'react'
import { connect } from 'react-redux'
import Routes from './components/Router'
import Header from './components/Header'
import Footer from './components/Footer'
import styled from 'styled-components'
import 'animate.css/animate.min.css'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: ${props => props.theme === 'sun' ? 'rgb(255, 255, 255)' : 'rgb(25, 25, 25)'};
  transition: 0.3s;

  .ant-btn-ghost {
    background-color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, 0);' : 'rgb(255, 255, 255)'};
  }

  .ant-progress-text {
    color: ${props => props.theme === 'sun' ? 'rgba(0, 0, 0, .45)' : 'rgba(255, 255, 255, .45)'};
    transition: 0.3s;
  }
`

function mapStateToProps(state) {
  return state
}

function App(props) {
  return (
    <AppContainer theme={props.theme}>
      <Header />
      <Routes />
      <Footer />
    </AppContainer>
  )
}

export default connect(mapStateToProps)(App)
