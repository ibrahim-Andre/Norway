import styled from "styled-components";
import logout from "../../utils/logout";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const User = styled.div`
  font-weight: bold;
`;

const Button = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

function Header({ username }) {
  return (
    <Wrapper>
      <h1>Dashboard</h1>
      <div>
        <User>{username}</User>
        <Button onClick={logout}>Çıkış</Button>
      </div>
    </Wrapper>
  );
}

export default Header;
