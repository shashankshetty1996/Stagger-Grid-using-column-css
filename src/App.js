import React, { Component, Fragment } from "react";
import axios from "axios";

import Card from "./components/Card/Card";

import "./App.css";

class App extends Component {
  state = {
    data: [],
    numberOfCard: 30
  };

  async componentDidMount() {
    const jsonPlaceHolder = "https://jsonplaceholder.typicode.com";
    try {
      const photos = await axios.get(`${jsonPlaceHolder}/photos`);
      const posts = await axios.get(`${jsonPlaceHolder}/posts`);
      const data = this.generateData(photos.data, posts.data);
      this.setState({ data });
    } catch (error) {
      console.log(error);
    }
  }

  generateData = (photos, posts) => {
    const { numberOfCard } = this.state;
    let data = [];
    for (let i = 0; i < numberOfCard; i++) {
      if (i % 3 === 0) {
        data.push({ ...photos[i], ...posts[i] });
      } else {
        data.push({ ...posts[i] });
      }
    }
    return data;
  };

  render() {
    const { data } = this.state;
    if (data.length === 0) {
      return <h1>Loading data</h1>;
    }
    return (
      <Fragment>
        <h1 className="title">Staggered Grid POC</h1>
        <div className="container">
          {data.map(card => (
            <Card
              key={card.id}
              title={card.title}
              url={card.url}
              body={card.body}
            />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default App;
