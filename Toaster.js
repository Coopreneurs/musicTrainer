import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
} from 'react-native';
import {
    Text
} from './Components';
 
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


class Toaster extends Component {
    state = {
        text: null
    }
    constructor(...args) {
        super(...args);
        this.showToast = this.showToast.bind(this);
    }
    showToast(text) {
        this.setState({text});
    }
    componentDidMount() {
        this.props.eventEmitter.on('showToast', this.showToast);
    }
    componentWillUnmount() {
        this.props.eventEmitter.off('showToast', this.showToast);
    }
    render() {
        if (!this.state.text) {
            return (
                <View>
                    <Text>
                        {null}
                    </Text>
                </View>
            )
        }
        return (
            <View style={{backgroundColor:'red'}}>
                <Text>
                    {this.state.text}
                </Text>
            </View>
        )
    }
}

const eventEmitter = new EventEmitter;
function showToast (text) {
    eventEmitter.emit('showToast', text);
}
const toaster = <Toaster eventEmitter={eventEmitter}/>;
export {
    toaster,
    showToast
}