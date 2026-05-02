import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
}

/* MOBILE */

@media (max-width: 768px) {

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 18px;
  }

}
`;

