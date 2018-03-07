import React, { Component } from 'react';

const styles = {
  brand: {
    width: 256,
    height: 56,
    lineHeight: '56px',
    fontWeight: 800,
    fontSize: '1.35em',
    paddingLeft: 6,
  },
};

class TopNav extends Component {
  render() {
    return (
      <header id="topnav" className="navbar navbar-default navbar-fixed-top">
        <div href="#dashboard" style={styles.brand}>
          MunchDeck Admin
        </div>
      </header>
    );
  }
}

export default TopNav;
