import { connect } from 'react-redux'
import styled from 'styled-components'

function mapStateToProps(state) {
    return state
}

const Card = styled.div`
    position: relative;
    padding: 30px 15px;
    border-radius: 5px;
    background-color: ${props => props.theme === 'sun' ? 'rgb(255, 255, 255)' : 'rgb(75, 75, 75)'};
    color: ${props => props.theme === 'sun' ? 'rgb(0, 0, 0)' : 'rgb(225, 225, 225)'};
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    
    text-overflow: ellipsis;
    overflow: hidden;

    p {
        margin: 0;
    }
`

export default connect(mapStateToProps)(Card)