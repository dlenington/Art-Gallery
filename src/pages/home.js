import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Painting from "../components/Painting.jsx";

class home extends Component {
  state = {
    paintings: null
  };
  componentDidMount() {
    axios
      .get("/paintings")
      .then(res => {
        this.setState({
          paintings: res.data
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    let recentPaintingsMarkup = this.state.paintings ? (
      this.state.paintings.map(painting => (
        <Painting key={painting.paintingId} painting={painting} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentPaintingsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
