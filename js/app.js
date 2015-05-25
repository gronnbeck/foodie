var React = require('react');
var GoogleMaps = require('react-googlemaps');
var GoogleMapsApi = window.google.maps;
var geocoder = new GoogleMapsApi.Geocoder();
var Map = GoogleMaps.Map;
var Marker = GoogleMaps.Marker;

var App = React.createClass({
  getInitialState() {
    return {
      value: '',
      locations: []
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
        this.setState({
          locations: [{lat: geocode.A, lng: geocode.F}]
        });
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
    var locations = this.state.locations;
    var center = locations.length > 0 ?
        locations[0] : {lat: 0, lng: 0};
    var markers = locations.map(function(l) {
      return <Marker position={new GoogleMapsApi.LatLng(l.lat, l.lng)} />
    });
    
    return (
      <div>
        <input id="autocompleteInput" ref="autocomplete" value={this.state.value} onChange={this.handleChange} type="text"/>
        <Map
          initialZoom={3}
          initialCenter={new GoogleMapsApi.LatLng(center.lat, center.lng)}
          width={700}
          height={700}>

          {markers}

        </Map>
      </div>
      )
  }
});


React.render(<App/>, document.getElementById('app'));
