import React, {Component} from 'react';

import '../styles/Upcoming.css';
import Expand from 'react-expand-animated';
// import {Link} from 'react-router-dom';
// import EventDetails from './EventDetails';

// cBAqMrONkv-xAZwnXFUQfWpUoXOcU1KZ6QPzI77Cr9E0jfyDisA

class Upcoming extends Component {
    constructor(props){
        super(props) // Passes 'props' to the parent
        this.state = {
            items: [],
            isLoaded: false,

            // Keeps track of which event has been opened
            clicked: -1,

            // Keeps track of the number of events per page
            lower: 0,
            upper: 10,

            // Gathers sorting categories by lists
            sortByGame: [],
            sortByTeam: [],

            // Keeps track of the information on games according to current selection
            currentSelection: [],

            selection: 0, // Sort by game selection
            teamSelection: "---", // Sort by team selection

            // Keeps track of which event id to get.
            getTournamentInfoID: -1
        }
    }


    handleClick(num) {
        let n = this.state.clicked
        if (num === this.state.clicked){
            n = -1
        }
        else {
            n = num
        }
        this.setState({ clicked: n})
    }

    setPages (left) {
        let l = this.state.lower
        let u = this.state.upper
        if (left === true && l !== 0) {
            l = l - 10
            u = u - 10
        }
        
        if (left === false && u < this.state.currentSelection.length) {
            l = l + 10
            u = u + 10
        }
        this.setState({ lower: l, upper: u, clicked: -1})
    }

    componentDidMount() {
        fetch(`https://api.pandascore.co/tournaments/upcoming?token=${process.env.REACT_APP_SECRET_KEY}`)
            .then(res => res.json())
            .then(json =>{
                this.setState({
                    items: json,
                    isLoaded: true
                })
                let g = ["All"];
                let t = ["---"];
                json.map(item => {
                    for (let i = 0; i < item.teams.length; i ++){
                        if (t.includes(item.teams[i].name) === false){
                            t.push(item.teams[i].name);
                        }
                    }
                    if (g.includes(item.videogame.name) === false){
                        g.push(item.videogame.name);
                    }

                })
                this.setState({sortByGame: g, sortByTeam: t.sort(), selection: g[0], currentSelection: json});
            })   
    }

    createGameItems() {     
        let optionItems = this.state.sortByGame.map((item) =>
            <option key={item}>{item}</option>
        );
        return optionItems;
    } 

    createTeamItems () {
        let optionItems = this.state.sortByTeam.map((item) =>
            <option key={item}>{item}</option>
        );
        return optionItems;
    }

    setGameSelection (e) {
        let x = [];
        if (e.target.value === "All"){
            x = this.state.items;
        }
        else {
            for (let i = 0; i < this.state.items.length; i ++){
                if (this.state.items[i].videogame.name === e.target.value){
                    x.push(this.state.items[i]);
                }
            }
        }
        this.setState({selection: e.target.value, currentSelection: x, clicked: -1, lower: 0, upper: 10});
    }

    setTeamSelection (e) {
        let x = [];
        console.log(e.target.value)
        if (e.target.value === "---"){
            x = this.state.items;
        }
        else {
            for (let i = 0; i < this.state.items.length; i ++){
                console.log(this.state.items[i].teams);
                for (let j = 0; j < this.state.items[i].teams.length; j++){
                    if (this.state.items[i].teams[j].name === e.target.value){
                        x.push(this.state.items[i]);
                        break;
                    }
                    
                }
            }
        }
        console.log(x)
        this.setState({selection: "All", teamSelection: e.target.value, currentSelection: x, clicked: -1, lower: 0, upper: 10});
        this.setState({teamSelection: e.target.value})
    }
    // 
    openLivestream (e) {
        e.preventDefault()
        let link;
        let id = this.state.clicked;
        let tid = this.state.currentSelection[id].league_id;
        fetch(`https://api.pandascore.co/leagues/${tid}/matches?token=${process.env.REACT_APP_SECRET_KEY}`)
        .then(res => res.json()).then(json => 
            {
                link = json[0]; 
                console.log(json[0])
                link = link.official_stream_url
                window.open(link, '_blank');
            });
    }
    
    render () {
        var {isLoaded, currentSelection} = this.state;  

        if (!isLoaded){
            return(
                <div>
                    Loading...
                </div>
            )
        }

       

        else {
            this.state.items.forEach((item, i) => item.id = i + 1);
            return(
                <div>
                    <div className="top-bar">
                        <select onChange={this.setGameSelection.bind(this)} disabled={this.state.teamSelection !== "---"} className="dropdown-games" style={{marginRight: "5rem"}}>
                            {this.createGameItems()}
                        </select>
                      
                        <div className="page-navigation">                    
                            <div style= {{textAlign: 'left'}}>
                                <button className="l-r" onClick={this.setPages.bind(this,true)} disabled={this.state.lower === 0}>{"<"}</button>
                            </div>
                            <div style= {{textAlign: 'right'}}>
                                <button className="l-r" onClick={this.setPages.bind(this, false)} disabled={this.state.upper >= this.state.currentSelection.length}>{">"}</button>
                            </div>
                        </div>
                        <select onChange={this.setTeamSelection.bind(this)} className="dropdown-games" style={{marginLeft: "5rem"}}>
                            {this.createTeamItems()}
                        </select>
                    </div>

                    {this.state.items.length === 0
                    ? 
                    <div>Nothing to see here...</div>
                    :
                    <div>
                        <div className="event-display">
                            {currentSelection.slice(this.state.lower,this.state.upper).map(item => (
                                <div>
                                    <button className="button" onClick={this.handleClick.bind(this, item.id - 1)}>
                                        <div className="event">
                                            <img src={`/images/${item.videogame.slug}.png`} alt="" height={75} width={75} className="game-image"/>
                                            {item.serie.slug.replace(/-/g," ").toUpperCase()}
                                        </div>
                                    </button>
                                    {/* Expand the div for when it's clicked */}
                                    <Expand open={this.state.clicked === item.id - 1} className={this.state.clicked === item.id - 1 ? 'event-details' : ''}>
                                        {this.state.clicked === item.id - 1 ? 
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div>
                                                <div style={{textAlign: "left", color: 'black', fontWeight: 'bold', marginTop: '2rem', marginLeft: "8rem"}}>Teams</div>
                                                {item.teams.length !== 0 ?
                                                <div>
                                                    {item.teams.map(team => (
                                                        <div style={{marginLeft: "8rem", textAlign: 'left'}}>
                                                            {team.acronym !== null ? <div>{team.name} ({team.acronym})</div> : <div>{team.name}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                                :
                                                <div>Hmm... There are no competitors here at the moment!</div>}
                                            </div>
                                            
                                            <div style={{textAlign: "left", marginRight: "8rem"}}>
                                                {item.name !== null ? <div style={{marginTop: '2rem', color: 'black', fontWeight: 'bold'}}>{item.name}</div>:<div></div>}
                                                {item.begin_at !== null ? <div>Begins at: {item.begin_at.replace(/T/," at ").replace(/Z/, " (UTC)")}</div>:<div></div>}                                                
                                                <button onClick={this.openLivestream.bind(this)} className= "ls-button">See who's livestreaming</button></div>
                                            </div>
                                        :
                                        <div></div>
                                        }
                                    </Expand>
                                </div>
                            ))}
                        </div>
                    </div>
                    }
                </div>
            )
        }
    }
}

export default Upcoming