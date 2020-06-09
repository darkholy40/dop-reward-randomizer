import styled from 'styled-components'

const CardShield = styled.div`
    text-align: center;
    padding: 0 15px;
    margin-bottom: 30px;

    &.hidden {
        opacity: 0;
    }

    @media (max-width: 767px) {
        padding: 0;
    }
`

export default CardShield