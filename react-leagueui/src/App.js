import React from "react";

import axios from "axios";

export default class PersonList extends React.Component {
  state = {
    champInfo: [],
    loaded: false,
  };

  componentDidMount() {
    axios.get(`http://localhost:4040/champions`).then((res) => {
      const champInfo = res.data;
      console.log(res.data);
      this.setState({ champInfo });
      this.setState({ loaded: !this.state.loaded });
      console.log(this.state.loaded);
    });
  }

  render() {
    if (this.state.loaded === "false") {
      return this.state.loaded;
    } else {
      return (
        <div>
          {this.state.champInfo.map((champion) => (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/${champion.image.full}`}
            />
          ))}
        </div>
      );
    }
  }
}
