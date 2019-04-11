import React, { Component } from "react";
import "./App.css";
import { csv } from "d3-request";
import url from "./free-zipcode-database.csv";
import FileName from "./fileName";
import ReactDOM from "react-dom";
import swal from "sweetalert";
const DEFAULT_INPUT_TEXT = "";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCodes: [],
      cityName: "",
      codes: [],
      csvData: []
    };
    this.onChangeCityName = this.onChangeCityName.bind(this);
    this.onSearchCity = this.onSearchCity.bind(this);
    this.fetchGoolgeAPI = this.fetchGoolgeAPI.bind(this);
    this.downLoadCSV = this.downLoadCSV.bind(this);
  }
  componentDidMount() {
    const self = this;
    csv(url, function(err, data) {
      self.setState({ zipCodes: data });
    });
  }
  fetchGoolgeAPI() {
    const self = this;
    const { codes } = this.state;
    const csvData = [];
    codes.map((code, index) => {
      var geocoder = new window.google.maps.Geocoder();
      var address = code;
      geocoder.geocode({ address: address }, function(results, status) {
        if (status == window.google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          csvData.push([`${code}`, `${latitude}`, `${longitude}`]);
          if (codes.length - 1 == index) {
            self.setState({ csvData });
          }
        } else {
          alert("Request failed.");
        }
      });
    });
  }
  downLoadCSV(csvData) {
    let wrapper = document.createElement("div");
    ReactDOM.render(<FileName />, wrapper);
    let el = wrapper.firstChild;
    console.log(csvData);
    swal({
      text: "Enter File Name",
      content: el,
      buttons: {
        confirm: {
          value: DEFAULT_INPUT_TEXT
        }
      }
    }).then(value => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvData.forEach(function(rowArray) {
        console.log(rowArray);
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${value}.csv`);
      document.body.appendChild(link); // Required for FF
      link.click();
      swal(`You typed: ${value}`);
    });
  }
  onSearchCity() {
    const { zipCodes, cityName } = this.state;
    const codes = [];
    zipCodes.map(singleZipcode => {
      if (
        singleZipcode["Country"] == "US" &&
        singleZipcode["City"] == cityName.toUpperCase() &&
        singleZipcode["State"] == "MI" &&
        singleZipcode["ZipCodeType"] == "STANDARD"
      ) {
        codes.push(singleZipcode["Zipcode"]);
      }
    });
    this.setState({ codes });
  }
  onChangeCityName(e) {
    this.setState({ cityName: e.target.value });
  }
  render() {
    return (
      <div className="App">
        <input
          type="text"
          value={this.state.cityName}
          onChange={this.onChangeCityName}
        />
        <button onClick={this.onSearchCity}>Search</button>
        {this.state.codes.length ? (
          <button onClick={this.fetchGoolgeAPI}>find Lat Long</button>
        ) : null}
        {this.state.csvData.length ? (
          <button onClick={this.downLoadCSV.bind(this, this.state.csvData)}>
            Download
          </button>
        ) : null}
      </div>
    );
  }
}

export default App;
