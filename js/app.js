var React = require('react');
var GoogleMaps = require('react-googlemaps');
var GoogleMapsApi = window.google.maps;
var geocoder = new GoogleMapsApi.Geocoder();


var App = React.createClass({
  getInitialState() {
    return {
      value: ''
    }
  },
  componentDidMount() {
    var input = document.getElementById('autocompleteInput');
    var swCoord = new GoogleMapsApi.LatLng(53.878440, 1.164551);
		var neCoord = new GoogleMapsApi.LatLng(71.691293, 34.321289);
		var autocompleteBounds = new GoogleMapsApi.LatLngBounds(swCoord, neCoord);
    var options = {bounds: autocompleteBounds};
    var autocomplete = new GoogleMapsApi.places.Autocomplete(input, options);
    GoogleMapsApi.event.addListener(
      autocomplete,
      'place_changed',
      this.handleAutocompleteClick
    );
  },
  handleAutocompleteClick() {
    var newValue = this.refs.autocomplete.getDOMNode().value;
    this.setState({
      value: newValue
    });
    this.search(newValue);
  },
  search(input) {
    geocoder.geocode({ 'address': input }, function(results, status) {
      if (status == GoogleMapsApi.GeocoderStatus.OK) {
        var geocode = results[0].geometry.location;
        console.log(geocode)
      }
      else {
        console.log("Something went wrong: " + status);
      }
    }.bind(this));
  },
  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  },
  render() {
    return (
      <div>
        <h1>Hello world</h1>
        <input id="autocompleteInput" ref="autocomplete" value={this.state.value} onChange={this.handleChange} type="text"/>
      </div>
      )
  }
});


React.render(<App/>, document.getElementById('app'));
