import { connect } from 'react-redux'
import styled from 'styled-components'

function mapStateToProps(state) {
    return state
}

const MainRow = styled.div`
    width: ${props => props.setwidth ? props.setwidth : `100%`};
    padding: 0.5rem 1rem;
    transition: 0.3s;

    @media (max-width: 767px) {
        padding: 0.5rem 0;
    }
`

export default connect(mapStateToProps)(MainRow)