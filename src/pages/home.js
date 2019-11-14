import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

class home extends Component {
  state = {
    paintings: null
  };
  componentDidMount() {
    axios
      .get("/paintings")
      .then(res => {
        console.log(res.data);
        this.setState({
          paintings: res.data
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    let recentPaintingsMarkup = this.state.paintings ? (
      this.state.paintings.map(painting => <p>{painting.body}</p>)
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
