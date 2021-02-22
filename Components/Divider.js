import React, { Component } from 'react';
import { 
    View,
} from 'react-native';

export default class Divider extends Component {
    render() {
        if (this.props.vertical) {
            return (
                <View
                    style={{
                    borderLeftColor: this.props.color || '#fff',
                    borderLeftWidth: 1,
                    margin: 20,
                    height: '100%'
                    }}
                />
            )
        } else {
            return (
                <View
                    style={{
                    borderBottomColor: this.props.color || '#fff',
                    borderBottomWidth: 1,
                    margin: 20,
                    width: '80%'
                    }}
                />
            )
        }
    }
}