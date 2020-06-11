import React from 'react'
import { connect } from 'react-redux'
import Routes from './components/Router'
import Header from './components/Header'
import Footer from './components/Footer'
import styled from 'styled-components'
import 'animate.css/animate.min.css'

const myKeyframes = `
  @keyframes highlight-yellow-day {
    0% {
      background-color: rgba(255, 255, 0, 1);
    }

    50% {
      background-color: rgb(255, 255, 255);
    }

    100% {
      background-color: rgba(255, 255, 0, 1);
    }
  }

  @keyframes highlight-yellow-night {
    0% {
      background-color: rgba(255, 255, 0, 0.5);
    }

    50% {
      background-color: rgb(45, 45, 45);
    }

    100% {
      background-color: rgba(255, 255, 0, 0.5);
    }
  }

  @keyframes highlight-green-day {
    0% {
      background-color: rgba(0, 255, 0, 1);
    }

    50% {
      background-color: rgb(255, 255, 255);
    }

    100% {
      background-color: rgba(0, 255, 0, 1);
    }
  }

  @keyframes highlight-green-night {
    0% {
      background-color: rgba(0, 255, 0, 0.5);
    }

    50% {
      background-color: rgb(45, 45, 45);
    }

    100% {
      background-color: rgba(0, 255, 0, 0.5);
    }
  }

  @keyframes highlight-blue-day {
    0% {
      background-color: rgba(0, 255, 255, 1);
    }

    50% {
      background-color: rgb(255, 255, 255);
    }

    100% {
      background-color: rgba(0, 255, 255, 1);
    }
  }

  @keyframes highlight-blue-night {
    0% {
      background-color: rgba(0, 255, 255, 0.5);
    }

    50% {
      background-color: rgb(45, 45, 45);
    }

    100% {
      background-color: rgba(0, 255, 255, 0.5);
    }
  }

  @keyframes highlight-red-day {
    0% {
      background-color: rgba(255, 0, 0, 1);
    }

    50% {
      background-color: rgb(255, 255, 255);
    }

    100% {
      background-color: rgba(255, 0, 0, 1);
    }
  }

  @keyframes highlight-red-night {
    0% {
      background-color: rgba(255, 0, 0, 0.5);
    }

    50% {
      background-color: rgb(45, 45, 45);
    }

    100% {
      background-color: rgba(255, 0, 0, 0.5);
    }
  }
`
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

  ${myKeyframes}
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
