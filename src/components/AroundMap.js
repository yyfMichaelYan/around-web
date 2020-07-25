import React, {Component} from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {POS_KEY} from "../constants";

class NormalAroundMap extends Component {
    render() {
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap defaultZoom={8}
                       defaultCenter={{lat: lat, lng: lon}}/>
        );
    }
}

const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
export default AroundMap;