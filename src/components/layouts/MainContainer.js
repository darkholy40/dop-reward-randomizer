import styled from 'styled-components'

const MainContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${props => props.padding || '2rem 1rem'};
    z-index: 1;
`

export default MainContainer