import React, {Component} from 'react';
import '../styles/Upcoming.css';

import Expand from 'react-expand-animated';


class Historical extends Component{
    constructor(props){
        super(props) // Passes 'props' to the parent
        this.state = {
            items: [],
            isLoaded: false,
            clicked: -1,

            winner: null,

            lower: 0,
            upper: 10
        }
    }

    handleClick(num) {
        let n = this.state.clicked
        if (num === this.state.clicked){
            n = -1
        }
        else {
            n = num

            // Get the winning team of the event
            let winning_team = this.findWinner(this.state.items[n])
            this.setState({winner: winning_team})
        }
        // Keep track of which one was clicked
        this.setState({ clicked: n})

        // Testing purposes
        console.log(n)
        console.log(this.state.items[n])
    }

    findWinner(item){
        let container = item.teams;
        let winner = item.winner_id;
        console.log(winner);
        if (winner === null){
            return null
        }
        else {
            for (let i = 0; i < container.length; i++){
                if (container[i].id === winner){
                    console.log(container[i].name)
                    return container[i].name
                }
            }
        }
    }

    componentDidMount() {
        fetch(`https://api.pandascore.co/tournaments/past?token=${process.env.REACT_APP_SECRET_KEY}`)
            .then(res => res.json())
            .then(json =>{
                this.setState({
                    items: json,
                    isLoaded: true
                })
            })
    }

    render () {
        var {items, isLoaded} = this.state;  

        if (!isLoaded){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else {
            this.state.items.forEach((item, i) => item.id = i + 1);
            return (
                <div>
                    {this.state.items.length === 0 ? 
                    <div>Huh, that's weird... Nothing to see here!</div>
                    :
                    <div className="event-display">
                        {items.slice(this.state.lower,this.state.upper).map(item => (
                            <div>
                                <button className="button" onClick={this.handleClick.bind(this, item.id - 1)}>
                                <div className="event">
                                    <img src={`/images/${item.videogame.slug}.png`} alt="" height={75} width={75} className="game-image"/>
                                    {item.serie.slug.replace(/-/g," ").toUpperCase()}
                                </div>
                                </button>
                                <Expand open={this.state.clicked === item.id - 1} className={this.state.clicked === item.id - 1 ? 'event-details' : ''}>
                                    {this.state.clicked === item.id - 1 ? 
                                    <div>
                                        <br></br>
                                        {item.name !== null ? <div style={{color: 'black', fontWeight: 'bold'}}>{item.name}</div>:<div></div>}
                                        {item.end_at !== null ? <div>Concluded: {item.end_at.replace(/T/," at ").replace(/Z/, " (UTC)")}</div>:<div></div>}

                                        <br></br>
                                        {this.state.winner !== null ? <div>Congratulations {this.state.winner}!</div> : <div>Hmm... There seems to be no winner</div>}
                                    </div>
                                    :
                                    <div></div>
                                    }
                                </Expand>
                            </div>
                        ))
                        }
                    </div>
                    }
                </div>
            )            
        }

    }
}

export default Historical