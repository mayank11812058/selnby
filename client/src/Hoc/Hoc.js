import { Component } from 'react'

class Hoc extends Component {
    render() {
        return (
            this.props.children
        );
    }
}

export default Hoc;