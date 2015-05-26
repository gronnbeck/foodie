var request = require('superagent');
var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var GoogleMaps = require('react-googlemaps');
var GoogleMapsApi = window.google.maps;
var geocoder = new GoogleMapsApi.Geocoder();
var Map = GoogleMaps.Map;
var Marker = GoogleMaps.Marker;


var LocationsMap = React.createClass({
  render(){
    var locations = this.props.locations;
    var center = locations.length > 0 ?
        locations[0] : {lat: 0, lng: 0};
    var markers = locations.map(function(l) {
      return <Marker position={new GoogleMapsApi.LatLng(l.lat, l.lng)} />
    });
    return (
    <Map
      initialZoom={3}
      initialCenter={new GoogleMapsApi.LatLng(center.lat, center.lng)}
      width={700}
      height={700}>

      {markers}

    </Map>
    )
  }
});

var Add = React.createClass({
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
  handleChangeName(event) {
    this.setState({
      placeName: event.target.value
    });
  },
  submit(event) {
    event.preventDefault();
    this.setState({
      posting: true
    });
    request
      .post('/api/locations')
      .set('content-type', 'application/json')
      .send({
        name: this.state.placeName,
        address: this.state.value,
        lat: this.state.locations[0].lat,
        lng: this.state.locations[0].lng
      })
      .end(function(err, result) {
        var success = null;
        if (err) success = false
        else success = true;
        this.setState({
          success: success,
          posting: false
        })
      }.bind(this));
  },
  render() {
    return (
      <div>
        <input id="placeName" value={this.state.placeName} onChange={this.handleChangeName} type="text" />
        <input id="autocompleteInput" ref="autocomplete" value={this.state.value} onChange={this.handleChange} type="text"/>
        <button onClick={this.submit}>Submit</button>
        <LocationsMap locations={this.state.locations}/>
      </div>
      )
  }
});

var List = React.createClass({
  getInitialState() {
    return {
      locations: []
    }
  },
  componentDidMount() {
    request
    .get('/api/locations')
    .end(function(err, result) {
      if (err) return alert('something went wrong errorCode 5001')
      var locations = JSON.parse(result.text);
      this.setState({
        locations: locations
      });
    }.bind(this))
  },
  locations() {
    return this.state.locations
  },
  render() {
    return (
      <LocationsMap locations={this.locations()}/>
    );
  }
});

var App = React.createClass({
  render () {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

var routes = (
  <Route handler={App}>
    <Route path="/add" handler={Add}/>
    <DefaultRoute handler={List}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>, document.getElementById('app'));
});
