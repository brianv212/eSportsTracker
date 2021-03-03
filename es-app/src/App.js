import React, {useState, useEffect} from 'react';

import './styles/App.css';

import Historical from './components/Historical'
import Upcoming from './components/Upcoming';

import PulseLoader from "react-spinners/PulseLoader";
import {Spring} from 'react-spring/renderprops'

function App() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(<Upcoming/>)
  const [id, setID] = useState(2)

  const handlePageChange = (page, int) => {
    setPage(page)
    setID(int)
  }

  useEffect(() =>{
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div className="ES-APP">
      {/* <Header /> */}
      <div className="navigation">
        <button disabled={id === 0} onClick={() => handlePageChange(<Historical/>, 0)} className="timeline-button">Past Games</button>
        {/* <button disabled={id === 1} onClick={() => handlePageChange(<Live/>, 1)} className="timeline-button">Live Now!</button> */}
        <button disabled={id === 2} onClick={() => handlePageChange(<Upcoming/>, 2)} className="timeline-button">Upcoming Events</button>
      </div>

      <div style={{display: 'flex'}}>
        <div className="App">
          { loading 
            ?
              <Spring config={{duration: 2000}} from={{opacity: 1}} to={{opacity: 0.5}}>
                {props => (
                  <div style={props}>
                    <div>
                      <PulseLoader
                          // css={override}
                          size={75}
                          margin={64}
                          color={"#B11124"}
                          loading={loading}
                      />
                    </div>
                    <div style={{color: 'white', fontSize: '25px'}}>Stay Updated. Get Event Information</div>
                  </div>
                )}
              </Spring>
            :
              // In the future we would add different pages
              <Spring config={{duration: 2000}} from={{opacity: 0}} to={{opacity: 1}}>
                {props => (
                  <div style={props}>
                    <header className="App-header">
                      {page}
                    </header>
                  </div>
                )}
              </Spring>
          }
        </div>
      </div>

    </div>
  );
}

export default App;