import React from 'react';

export default class PureCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    
  }

  shouldComponentUpdate() {
    return false;
  }

  onKeyPress(ev) {
    switch (ev.charCode) {
      case 97:
        this.props.moveLeft()
        break
      case 119:
        this.props.moveUp()
        break
      case 100:
        this.props.moveRight()
        break
      case 115:
        this.props.moveDown()
        break
      default: 
        break
    }
  }

  render() {
    return (
      <canvas
        tabIndex="0" 
        onKeyPress={this.onKeyPress}
        width={this.props.width}
        height={this.props.height}
        ref={node =>
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}