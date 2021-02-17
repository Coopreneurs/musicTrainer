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
            <Text style={styles.paragraph}>
                {this.props.children}
            </Text>
        )
    }
}