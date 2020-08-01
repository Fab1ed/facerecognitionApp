import React from 'react';
import Particles from 'react-particles-js'; 
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: '39b402456df94476a9b90c7199566db3'
});

const particleOptions = { // placing particles options separately
  particles: {
    number: {
      value: 120
  },
  size: {
      value: 5
  }
},
interactivity: {
  events: {
      onhover: {
          enable: true,
          mode: "repulse"
      }
  }
  }
}

class App extends React.Component { 
  constructor() {
    super();
    this.state = {
      input: '', 
      imageURL: '',
      box: {}, //object will contain values we receive(% of image sides)
      route: 'signin', //keeps track of where are we on the page (we want to start it with signin)
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => { //we call this function based on what we get from onsubmitbutton function 
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return { //returning object that'll fill up box in state
      leftCol: clarifaiFace.left_col * width, //left_col is a prop we receive from clarifaiFace,has % value
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  } 

  onInputChange = (event) => { // if theres any event listener on a page we receive an event, in this case when user types smth in field
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => { // when user clicks on detect button(onClick)
    this.setState({imageURL: this.state.input}); // this way we can pass imageurl to FaceRecognition (component below)
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(response => this.displayFaceBox(this.calculateFaceLocation(response)))//we use this. since we use classes
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;//destruturing for cleaner code
  return ( // order of components matters! 
    <div className="App">  
      <Particles 
          params={particleOptions}
          className='particles'/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' //wrapped in a div since must return 1 element;
        ? <div> 
            <Logo />
            <Rank />
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} /> 
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div>
        : (
          route === 'signin' //if its true return signin component; onroutechange func gonna direct user to main page after signig
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
      }
    </div>
  );
  }
}
export default App;
