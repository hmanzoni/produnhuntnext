import styled from '@emotion/styled'

export const Formulario = styled.form`
    max-width: 600px;
    width: 95%;
    margin: 5rem auto 0 auto;
    fieldset {
        margin: 2rem 0;
        padding: 2rem;
        font-size: 1.8rem;
        border: 1px solid #e1e1e1;
    }
`;

export const Campo = styled.div`
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    label {
        flex: 0 0 150px;
        font-size: 1.8rem;
    }
    input, textarea {
        flex: 1;
        padding: 1rem;
    }
    textarea {
        height: 400px;
    }
`;

export const InputSubmit = styled.input`
    background-color: var(--naranja);
    width: 100%;
    padding: 1.5rem;
    text-align: center;
    color: #fff;
    font-size: 1.8rem;
    text-transform: uppercase;
    border: none;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    &:hover {
        cursor: pointer;
    }
`;

export const Error = styled.p`
    background-color: red;
    padding: 1rem;
    margin: 2rem 0;
    width: 100%;
    color: #fff;
    border: none;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
`;