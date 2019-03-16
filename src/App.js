import React, { Component, Fragment } from "react";
import axios from "axios";
import InputMaterialUi from "input-material-ui";

import Card from "./components/Card/Card";
import Loader from "./components/Loader/Loader";

import "./App.css";

class App extends Component {
  state = {
    data: [],
    numberOfCards: 30,
    imageInterval: 3,
    loaderDelay: 3000
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.checkComponentUpdated(prevState)) {
      this.fetchData();
    }
  }

  checkComponentUpdated = prevState => {
    console.log(prevState, this.state);
    return (
      this.state.numberOfCards !== prevState.numberOfCards ||
      this.state.imageInterval !== prevState.imageInterval
    );
  };

  fetchData = async () => {
    const jsonPlaceHolder = "https://jsonplaceholder.typicode.com";
    try {
      const photos = await axios.get(`${jsonPlaceHolder}/photos`);
      const posts = await axios.get(`${jsonPlaceHolder}/posts`);
      const data = this.generateData(photos.data, posts.data);
      this.loadData(data);
    } catch (error) {
      console.log(error);
    }
  };

  generateData = (photos, posts) => {
    const { numberOfCards, imageInterval } = this.state;
    let data = [];
    for (let i = 0; i < numberOfCards; i++) {
      if (i % imageInterval === 0) {
        data.push({ ...photos[i], ...posts[i] });
      } else {
        data.push({ ...posts[i] });
      }
    }
    return data;
  };

  loadData = data => {
    const { loaderDelay } = this.state;
    setTimeout(() => {
      this.setState({ data });
    }, loaderDelay);
  };

  getFormData = () => {
    const { imageInterval, numberOfCards, loaderDelay } = this.state;
    return [
      {
        label: "Image Offset",
        type: "text",
        value: imageInterval,
        name: "imageInterval",
        placeholder: "Enter number of image's offset between each cards",
        validation: {
          maxValue: 10,
          nonNegative: true
        }
      },
      {
        label: "Number of Cards",
        type: "text",
        value: numberOfCards,
        name: "numberOfCards",
        placeholder: "Enter number of cards to be displayed",
        validation: {
          maxValue: 100,
          nonNegative: true
        }
      },
      {
        label: "Loading delay(in ms)",
        type: "text",
        value: loaderDelay,
        name: "loaderDelay",
        placeholder: "Delay after data has been loaded",
        validation: {
          minValue: 10,
          nonNegative: true
        }
      }
    ];
  };

  getStateValueByName = name => {
    if (name === "imageInterval") {
      return this.state.imageInterval;
    }
    if (name === "numberOfCards") {
      return this.state.numberOfCards;
    }
    if (name === "loaderDelay") {
      return this.state.loaderDelay;
    }
    return "";
  };

  inputChange = (name, value) => {
    if (parseInt(value, 0) === this.getStateValueByName(name)) {
      console.log("Value type number is only valid", value);
      return;
    }
    this.setState({ [name]: value === "" ? 0 : parseInt(value, 0) });
  };

  render() {
    const { data, numberOfCards } = this.state;
    const formData = this.getFormData();
    if (data.length === 0 && numberOfCards !== 0) {
      return <Loader />;
    }
    return (
      <Fragment>
        <h1 className="title">Staggered Grid POC</h1>
        <div className="form">
          {formData.map((form, index) => (
            <InputMaterialUi
              key={index}
              type={form.type}
              label={form.label}
              value={form.value}
              placeholder={form.placeholder}
              onChange={value => this.inputChange(form.name, value)}
            />
          ))}
        </div>
        <div className="container">
          {data.map(card => (
            <Card
              index={card.id}
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
