import React, { Component, Fragment } from "react";

class WebLayout extends Component {
  componentDidMount() {
    document.body.classList.add("background");
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }

  render() {
    return (
      <Fragment>
        <div className='fixed-background-web' />
        <main>
          <div className='container'>{this.props.children}</div>
        </main>
      </Fragment>
    );
  }
}

export default WebLayout;
