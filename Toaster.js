import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import {
    Text
} from './Components';
 

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#607D8B',
        padding: 10,
        paddingBottom: 30,
        position: 'absolute',
        bottom: 20,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 4,
        shadowColor: "#B0BEC5",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.85,
		shadowRadius: 8,
        opacity:0.99,
    }
})
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
        this.state.y = new Animated.Value(40);
        // this.state.opacity = new Animated.Value(0);
        this.showToast = this.showToast.bind(this);
    }
    showToast(text) {
        this.setState({text});
        Animated.spring(this.state.y, {
            toValue: -20,
            useNativeDriver: true,
            friction: 5
          }).start(
              () => setTimeout(() => 
            Animated.spring(this.state.y, {
                toValue: 100,
                useNativeDriver: true,
                friction: 12
              }).start(() => 
                this.setState({text: null})
              ), 2000)
          );
    }
    
    fadeIn() {
    //   Animated.timing(this.state.opacity, {
    //     toValue: 1,
    //     duration: 500,
    //     useNativeDriver: true
    //   }).start();
      Animated.spring(this.state.y, {
        toValue: 100,
        useNativeDriver: true,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    };
  
    fadeOut(callback) {
    //   Animated.timing(this.state.opacity, {
    //     toValue: 0,
    //     duration: 500,
    //     useNativeDriver: true
    //   }).start(callback);
    };
    componentDidMount() {
        this.props.eventEmitter.on('showToast', this.showToast);
    }
    componentWillUnmount() {
        this.props.eventEmitter.off('showToast', this.showToast);
    }
    render() {
        if (!this.state.text) {
            return null;
        }
        return (
            <Animated.View 
            style={[styles.container, {
                transform: [
                    {
                        translateY: this.state.y
                    }
                ]
                }]}>
                <Text bold>
                    🎉 Correct! 🎉
                </Text>
            </Animated.View>
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