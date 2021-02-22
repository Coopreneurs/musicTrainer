import React, { Component } from 'react';
import { 
    StyleSheet,
} from 'react-native';
import {
    Text
} from '.';

const styles = StyleSheet.create({
    paragraph: {
        alignSelf: 'center',
        color: '#fff',
    },
})

export default class Paragraph extends Component {
    render () {
        return(
            <Text {...this.props} style={[styles.paragraph, {color: this.props.color}]}>
                {this.props.children}
            </Text>
        )
    }
}