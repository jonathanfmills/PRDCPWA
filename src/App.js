import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
  }
  componentDidMount() {

  }
  onClick = () => {
    this.setState({ books: [], loading: true });
    axios.get('json/data.json').then(data => {
      setTimeout(()=>{console.log('hi')
      this.setState({
        loading: false,
        books: data.data
      })}, 1000)
      
    });
  }
  render() {
    return (
      <section className="container">
        {this.state.loading ? <h1>Loading</h1> : (<div>
          <h1>Library</h1>
          <button onClick={this.onClick}>refresh</button>
          <div>
            {this.state.books.map(b => (
              <div key={b.title}>
                <h2>{b.title}</h2>
                <p><span style={{ color: 'grey' }}>Author: {b.author}</span></p>
                <p><span style={{ color: 'grey' }}>Genre: {b.genre}</span></p>

              </div>
            ))}
          </div>
        </div>
      )}
      </section>
    )
  }
}

export default App;
