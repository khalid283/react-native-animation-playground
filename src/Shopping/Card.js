// @flow
import * as React from "react";
import {
  Image, StyleSheet, View, Text,
} from "react-native";
import Animated from "react-native-reanimated"; 
 
const { Value } = Animated;

export default class Card extends React.Component{
  static defaultProps = {
    likeOpacity: 0,
    nopeOpacity: 0,
  };

  render() {
    const { profile, likeOpacity, nopeOpacity } = this.props;
    
    console.log('profiles', profile.source);
    return (
      <View style={StyleSheet.absoluteFill}>
        {profile ? <Image style={styles.image} source={profile.source} />  : null}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Animated.View style={[styles.like, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabel}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.nope, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabel}>NOPE</Text>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
  },
  name: {
    color: "white",
    fontSize: 32,
  },
  like: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#6ee3b4",
  },
  likeLabel: {
    fontSize: 32,
    color: "#6ee3b4",
    fontWeight: "bold",

  },
  nope: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#ec5288",
  },
  nopeLabel: {
    fontSize: 32,
    color: "#ec5288",
    fontWeight: "bold",
  },
});