import { connect } from 'react-redux'
import styled from 'styled-components'

function mapStateToProps(state) {
    return state
}

const MainRow = styled.div`
    width: 960px;
    padding: 0.5rem 1rem;
    background-color: ${props => props.theme === 'sun' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)'};
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .12);
    transition: 0.3s;
`

export default connect(mapStateToProps)(MainRow)