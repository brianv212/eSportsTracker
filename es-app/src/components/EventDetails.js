import React, {Component} from 'react';

class EventDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoaded: false
        }
    } 

    componentDidMount () {
        fetch('API goes here')
        .then(res => res.json())
        .then((json) => {
            this.setState({data: json, isLoaded: true});
        })
    }

    render () {
        if (this.state.isLoaded === false){
            return (<div>Loading!</div>)
        }
        else {
            return (
                <div>Working!</div>
            )
        }
    }
}

export default EventDetails