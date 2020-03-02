import React from 'react';

class Icons extends React.Component {
  shouldComponentUpdate() {
    // This component doesn't need to re-render because
    // everything is static
    return false;
  }

  render() {
    return (
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
        <defs>
          <symbol id="icon-login" viewBox="0 0 29 32">
            <title>login</title>
            <path stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="4" stroke-width="2.6667" d="M14.667 16v0c-3.681 0-6.667-2.985-6.667-6.667v-1.333c0-3.681 2.985-6.667 6.667-6.667v0c3.681 0 6.667 2.985 6.667 6.667v1.333c0 3.681-2.985 6.667-6.667 6.667z"></path>
            <path stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="4" stroke-width="2.6667" d="M28 27.877c0-2.4-1.596-4.511-3.912-5.141-2.525-0.689-5.973-1.403-9.421-1.403s-6.896 0.713-9.421 1.403c-2.316 0.631-3.912 2.741-3.912 5.141v2.789h26.667v-2.789z"></path>
          </symbol>
          <symbol id="icon-logo" viewBox="0 0 90 32">
            <title>logo</title>
            <path fill="none" stroke="#8e3721" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="4" stroke-width="1.7391" d="M50.139 1.391h-41.443c-4.034 0-7.304 3.27-7.304 7.304s3.27 7.304 7.304 7.304h72.275c4.034 0 7.304 3.27 7.304 7.304s-3.27 7.304-7.304 7.304h-70.027"></path>
            <path fill="#8e3721" d="M14.068 10.659c0-0.314-0.084-0.551-0.251-0.712s-0.472-0.327-0.914-0.5c-0.806-0.293-1.386-0.636-1.739-1.029s-0.53-0.858-0.53-1.394c0-0.649 0.24-1.17 0.72-1.564s1.090-0.59 1.83-0.59c0.493 0 0.933 0.1 1.32 0.299s0.684 0.481 0.892 0.844c0.208 0.363 0.312 0.776 0.312 1.238h-1.618c0-0.36-0.080-0.634-0.24-0.823s-0.391-0.283-0.693-0.283c-0.283 0-0.504 0.080-0.663 0.241s-0.237 0.377-0.237 0.648c0 0.212 0.088 0.403 0.265 0.574s0.49 0.348 0.939 0.532c0.784 0.272 1.354 0.605 1.709 1s0.533 0.898 0.533 1.508c0 0.67-0.223 1.194-0.668 1.572s-1.051 0.566-1.816 0.566c-0.519 0-0.992-0.102-1.419-0.307s-0.761-0.497-1.002-0.878c-0.241-0.381-0.362-0.831-0.362-1.349h1.629c0 0.444 0.090 0.767 0.271 0.968s0.475 0.302 0.883 0.302c0.567 0 0.85-0.288 0.85-0.863zM25.453 9.521c0 1.034-0.255 1.836-0.765 2.408s-1.217 0.857-2.123 0.857c-0.902 0-1.61-0.283-2.126-0.849s-0.777-1.359-0.784-2.379v-1.318c0-1.058 0.256-1.885 0.767-2.479s1.222-0.892 2.131-0.892c0.894 0 1.599 0.292 2.115 0.876s0.777 1.403 0.784 2.458v1.318zM23.824 8.23c0-0.695-0.103-1.212-0.309-1.55s-0.526-0.508-0.961-0.508c-0.431 0-0.749 0.163-0.955 0.489s-0.313 0.823-0.32 1.49v1.371c0 0.674 0.105 1.17 0.315 1.49s0.534 0.479 0.972 0.479c0.423 0 0.738-0.156 0.944-0.468s0.311-0.796 0.315-1.453v-1.339zM31.328 12.68h-1.623v-7.705h1.623v7.705zM37.33 11.389h2.849v1.291h-4.472v-7.705h1.623v6.414zM47.528 10.659c0-0.314-0.084-0.551-0.251-0.712s-0.472-0.327-0.914-0.5c-0.806-0.293-1.386-0.636-1.739-1.029s-0.53-0.858-0.53-1.394c0-0.649 0.24-1.17 0.721-1.564s1.090-0.59 1.83-0.59c0.493 0 0.933 0.1 1.32 0.299s0.684 0.481 0.892 0.844c0.208 0.363 0.312 0.776 0.312 1.238h-1.618c0-0.36-0.080-0.634-0.24-0.823s-0.391-0.283-0.693-0.283c-0.283 0-0.504 0.080-0.663 0.241s-0.237 0.377-0.237 0.648c0 0.212 0.088 0.403 0.265 0.574s0.49 0.348 0.939 0.532c0.784 0.272 1.354 0.605 1.709 1s0.533 0.898 0.533 1.508c0 0.67-0.223 1.194-0.668 1.572s-1.051 0.566-1.816 0.566c-0.519 0-0.992-0.102-1.419-0.307s-0.761-0.497-1.002-0.878c-0.241-0.381-0.362-0.831-0.362-1.349h1.629c0 0.444 0.090 0.767 0.271 0.968s0.475 0.302 0.883 0.302c0.567 0 0.85-0.288 0.85-0.863zM13.107 24.315h-0.806v2.815h-1.623v-7.705h2.589c0.813 0 1.442 0.202 1.885 0.606s0.665 0.978 0.665 1.722c0 1.023-0.388 1.739-1.165 2.148l1.408 3.154v0.074h-1.745l-1.209-2.815zM12.301 23.019h0.922c0.324 0 0.567-0.103 0.729-0.31s0.243-0.482 0.243-0.828c0-0.773-0.315-1.159-0.944-1.159h-0.95v2.297zM24.1 23.797h-2.529v2.043h2.992v1.291h-4.616v-7.705h4.605v1.297h-2.981v1.82h2.529v1.254zM31.129 25.014l1.353-5.588h1.811l-2.319 7.705h-1.689l-2.302-7.705h1.8l1.347 5.588zM42.216 23.797h-2.529v2.043h2.992v1.291h-4.616v-7.705h4.605v1.297h-2.981v1.82h2.529v1.254zM50.466 25.553h-2.214l-0.431 1.577h-1.717l2.512-7.705h1.485l2.529 7.705h-1.734l-0.431-1.577zM48.605 24.257h1.502l-0.751-2.746-0.751 2.746zM58.019 25.839h2.849v1.291h-4.472v-7.705h1.623v6.414zM68.974 23.797h-2.529v2.043h2.992v1.291h-4.616v-7.705h4.605v1.297h-2.981v1.82h2.529v1.254zM73.386 27.13v-7.705h2.126c0.939 0 1.687 0.286 2.244 0.857s0.842 1.355 0.853 2.35v1.249c0 1.012-0.279 1.807-0.836 2.384s-1.326 0.865-2.305 0.865h-2.081zM75.009 20.722v5.117h0.486c0.541 0 0.922-0.137 1.143-0.41s0.337-0.745 0.348-1.416v-1.339c0-0.72-0.105-1.222-0.315-1.506s-0.567-0.433-1.071-0.447h-0.591z"></path>
          </symbol>
        </defs>
      </svg>
    );
  }
}

export default Icons;
