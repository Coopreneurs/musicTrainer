import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import {
    Text
} from './Components';
import { componentTypeSanitizer } from './Utils'; 

const   SUCCESS = Symbol('SUCCESS'),  
        FAILURE = Symbol('FAILURE'), 
        INFO = Symbol('INFO'), 
        sanitizeType = componentTypeSanitizer([SUCCESS, FAILURE, INFO], INFO); 

const styles = StyleSheet.create({
    block: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        alignItems: 'center',
        padding: 10,
        paddingBottom: 10,
        position: 'absolute',
        bottom: 20,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 4,
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.85,
		shadowRadius: 8,
        opacity: 0.95,
        color: '#424242'
    },
    success: {
        backgroundColor: '#E0E0E0',
        shadowColor: "#B0BEC5",
        borderLeftColor: '#64DD17',
        borderLeftWidth: 10
    },
    failure: {
        backgroundColor: '#E0E0E0',
        shadowColor: "#B0BEC5",
        borderLeftColor: '#F44336',
        borderLeftWidth: 10
    },
    info: {
        backgroundColor: '#E0E0E0',
        shadowColor: "#B0BEC5",
        borderLeftColor: '#0D47A1',
        borderLeftWidth: 10
    },
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
        text: null,
        visible: false
    }
    static SUCCESS = SUCCESS;
    static FAILURE = FAILURE; 
    static INFO = INFO;

    constructor(...args) {
        super(...args);
        const [props] = args; 
        this.state.y = new Animated.Value(40);
        this.state.type = sanitizeType(props.type);
        this.showToast = this.showToast.bind(this);
    }
    showToast({ text, type, duration, callback }) {
        this.setState({ 
            text: text,
            type: sanitizeType(type),
            visible: !this.state.visible
        });
        Animated.spring(this.state.y, {
            toValue: -20,
            useNativeDriver: true,
            friction: 5,
            tension: 200
          }).start(
              () => setTimeout(() => 
            Animated.spring(this.state.y, {
                toValue: 80,
                useNativeDriver: true,
                friction: 12,
                tension: 200
              }).start(() => {
                this.setState({visible: !this.state.visible});
                callback();
              }
            ), duration)
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
        if (!this.state.visible) {
            return null;
        }
        if (this.state.type == SUCCESS) {
            return (
                <>
                <View style={styles.block}/>
                    <Animated.View 
                        style={[styles.container, styles.success, {transform: [{translateY: this.state.y}]}]}
                    >
                        <Text style={{color: styles.container.color}} bold>
                            🎉  Correct! 🎉
                        </Text>
                        <Text style={{color: styles.container.color}}>
                            {this.state.text}
                        </Text>
                    </Animated.View>
                    </>
            )
        } else if (this.state.type == FAILURE) {
            return (
                <>
                <View style={styles.block}/>
                    <Animated.View 
                        style={[styles.container, styles.failure, {transform: [{translateY: this.state.y}]}]}
                    >
                        <Text style={{color: styles.container.color}} bold>
                            😱  Wrong 
                        </Text>
                        <Text style={{color: styles.container.color}}>
                            {this.state.text}
                        </Text>
                    </Animated.View>
                    </>
            )

        } else if (this.state.type == INFO) {
            return (
                <>
                <View style={styles.block}/>
                    <Animated.View 
                        style={[styles.container, styles.info, {transform: [{translateY: this.state.y}]}]}
                    >
                        <Text style={{color: styles.container.color}} bold>
                            💡
                        </Text>
                        <Text style={{color: styles.container.color}}>
                            {this.state.text}
                        </Text>
                    </Animated.View>
                    </>
            )
        } else {
            throw new Error("toast type unknown!")
        }
    }
}

const eventEmitter = new EventEmitter;
function showToast (text) {
    eventEmitter.emit('showToast', text);
}
const toaster = <Toaster eventEmitter={eventEmitter}/>;
export {
    toaster,
    showToast, 
    Toaster, 
}