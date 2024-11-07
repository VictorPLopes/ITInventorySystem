import Login, { Username, Password, Submit, Title, Logo} from '@react-login-page/base';

import './App.css';

function App() {
    return (
        <Login style={
            {
                padding: '30px',
                borderRadius: '25px',
                boxShadow: '0 0 100px 0 rgba(0, 0, 0, 0.3)',
            }
        }>
            <Username placeholder="E-Mail" name="userEmail" />
            <Password placeholder="Senha" name="userPassword" />
            <Submit>Entrar</Submit>
            <Title>Acesso ao Sistema</Title>
            <Logo visible={false}></Logo>
        </Login>
    )
}

export default App
