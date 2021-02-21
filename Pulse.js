import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import {
    Text
} from './Components';

import {
    Color
} from './Utils';

class EventEmitter {
    constructor () {
        this.events = new Map;
    }
    on (eventName, callback) {
        const event = this.events.get(eventName);
        if (!event) {
            this.events.set(eventName, [callback]);
        } else {
            event.push(callback);
        }
    }
    off (eventName, callback) {
        const event = this.events.get(eventName);
        if (!event) {
            return false;
        } else {
            const index = event.indexOf(callback);
            if (index > -1) {
                event.splice(index, 1);
            }
        }
    }
    emit (eventName, payload) {
        const event = this.events.get(eventName);
        if (!event || event.length < 1) {
            return false;
        } else {
            event.forEach(callback => callback(payload))
        }
    }
} 


class Pulse extends Component {
    state = {
        color: (new Color('#333')).rgba, 

    }
    constructor(...args) {
        super(...args);
        this.showPulse = this.showPulse.bind(this);
        this.state.colorInput = 0;  
		this.state.colorValue = new Animated.Value(this.state.colorInput); 
		this.state.colorInterpolation = this.state.colorValue.interpolate({
			inputRange: [0, 1],
			outputRange:[
				this.state.color, 
				this.state.color
			]
		});  
    }
    showPulse(color) {
        this.setState({color});
        Animated.timing(
            this.state.colorValue, 
            {
                toValue: 1 - this.state.colorInput,
                duration: 250,
                useNativeDriver: true
            }
        ).start();
    }
    componentDidMount() {
        this.props.eventEmitter.on('showPulse', this.showPulse);
    }
    componentWillUnmount() {
        this.props.eventEmitter.off('showPulse', this.showPulse);
    }
    render() {
        return (
            <View style={{position:'absolute', top:0, right:0, left:0, bottom: 0, backgroundColor:this.state.color}}/>
        )
    }
}

const eventEmitter = new EventEmitter;
function showPulse (color) {
    eventEmitter.emit('showPulse', color);
}
const pulse = <Pulse eventEmitter={eventEmitter}/>;
export {
    pulse,
    showPulse
}