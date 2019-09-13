// Please read comment carefully
// You will find a lot use of interpolate because of many stuff moving at same time but not with the same position.
// using opposite card opacity to manipute the card of showing on the screen. you may find this odd, even I do
// but after a lots of trial and error this was best bet to build the screen.
// Would love see the your approch to build the screen and optimization.
// Alignment issue, you some alignment issue in iOS or Android depending on screen size, still trying to make it responsive


import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TextInput } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State, createNativeWrapper, PureNativeButton } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const { Value, event, createAnimatedComponent, block, interpolate, Extrapolate, cond, eq, set, Clock, startClock, clockRunning, stopClock, debug, timing } = Animated;

const constant = { 
    PADDING_OUTSIDE_CARD : 30,
    PADDING_INSIDE_CARD: 32,
    TOTAL_PADDING: 62,
    CARD_WIDTH: width-60,
    CARD_HEIGHT: height/2,
    CLOSE_ICON_SIZE: 48
 }

const InputWhite = (props) => {
    return(
        <View style={{ borderBottomWidth:1.5, borderBottomColor: 'white', paddingBottom: 8 }} >
            <TextInput 
                style={{ color: 'white', fontSize: 18 }}
                placeholderTextColor={"white"}
                placeholder={props.placeholder}
            />
        </View>
    )
}

const AnimatedRawButton = createNativeWrapper(
    createAnimatedComponent(PureNativeButton),
    {
      shouldCancelWhenOutside: false,
      shouldActivateOnStart: false,
    }
);

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
}

export default class LoginSignup extends React.Component{

    constructor() {
        super();
        this.signInCardOpacity = new Value(1);
        this.loginCardOpacity = new Value(1);
        //on sign up card tap it changes the login card opacity 0 and keep sign up card 1
        // login card fade away and sign up card will be in center
        this.onSignUpTap = event([
            {
                nativeEvent: ({state})=> block([
                    cond(eq(state, State.END), set(this.loginCardOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ]);
        //on login card tap it changes the sign up card opacity 0 and keep the login card 1
        // sign up card fade away and login card will be in center
        this.onLoginTap = event([
            {
                nativeEvent: ({state}) => block([
                    cond(eq(state, State.END), set(this.signInCardOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ]);
        //in case of back press setting opcaity from 0 to 1, and using loginCardOpacity for signup and signInCardOpacity opacity for login 
        this.goToHomeFromSignUp = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.loginCardOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ])
        this.goToHomeFromLogin = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.signInCardOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ]);

        let { CARD_HEIGHT, CARD_WIDTH, TOTAL_PADDING, PADDING_INSIDE_CARD, CLOSE_ICON_SIZE } = constant;
        // this move the cards, with same concept loginCardOpacity for sign up and signInCardOpacity for login
        this.signUpX = interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [30, -CARD_WIDTH/2+30],
            extrapolate: Extrapolate.CLAMP
        });
        this.loginX = interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [-CARD_WIDTH+30, -CARD_WIDTH/2+TOTAL_PADDING],
            extrapolate: Extrapolate.CLAMP
        });
        
        //close icon on top moveCloseIconLogin for signup and moveCloseIconSignUp for login still trying figure it out.
        this.moveCloseIconLogin = interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [width/2-CLOSE_ICON_SIZE/2, CARD_WIDTH+TOTAL_PADDING],
            extrapolate: Extrapolate.CLAMP
        });
        this.moveCloseIconSignUp = interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [width/2-CLOSE_ICON_SIZE-16, -CARD_WIDTH+TOTAL_PADDING],
            extrapolate: Extrapolate.CLAMP
        });

        // header
        //header text outside card for to move in and move out
        this.moveSignUpHeader = interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [-CARD_WIDTH/4+20, -width],
            extrapolate: Extrapolate.CLAMP
        });
        this.moveLoginHeader = interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [(CARD_WIDTH/2)-TOTAL_PADDING+8, CARD_WIDTH+TOTAL_PADDING],
            extrapolate: Extrapolate.CLAMP
        });
        this.moveHomeHeaderTitle = interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [TOTAL_PADDING+16, -(CARD_WIDTH/2)+30],
            extrapolate: Extrapolate.CLAMP
        });

        // animation to move sign up card
        this.moveInputSignUp= interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [0, -CARD_WIDTH],
            extrapolate: Extrapolate.CLAMP
        });
        this.moveTextSignUp= interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [30, -132],
            extrapolate: Extrapolate.CLAMP
        });
        this.signCardHeader = interpolate(this.loginCardOpacity, {
            inputRange: [0, 1],
            outputRange: [-CARD_WIDTH/4, 0],
            extrapolate: Extrapolate.CLAMP
        });

        //animation to move login card
        this.moveInputLogin= interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [0, CARD_WIDTH/2],
            extrapolate: Extrapolate.CLAMP
        });
        this.moveTextLogin= interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [-CARD_WIDTH-CARD_WIDTH/2, -CARD_WIDTH+TOTAL_PADDING],
            extrapolate: Extrapolate.CLAMP
        });
        this.loginCardHeader = interpolate(this.signInCardOpacity, {
            inputRange: [0, 1],
            outputRange: [-((width-124-70)/2), -((width/2+5))],
            extrapolate: Extrapolate.CLAMP
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Animated.View style={{ opacity: this.signInCardOpacity, transform: [ { translateX: this.moveCloseIconLogin } ] }} >
                        <AnimatedRawButton onHandlerStateChange={this.goToHomeFromSignUp}>
                            <View style={{ marginBottom: 30 }}>
                                <View style={{ ...styles.closeButton, backgroundColor: '#0553D3' }}>
                                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/icon/arrow_left_white.png')} />
                                </View>
                            </View>
                        </AnimatedRawButton>
                    </Animated.View>
                    <Animated.View style={{ opacity: this.loginCardOpacity, transform: [ { translateX: this.moveCloseIconSignUp } ] }} >
                        <AnimatedRawButton onHandlerStateChange={this.goToHomeFromLogin}>
                            <View style={{  marginBottom: 30 }}>
                                <View style={{ ...styles.closeButton, backgroundColor: '#0021FD' }}>
                                <Image style={{ width: 24, height: 24 }} source={require('../../assets/icon/arrow_left_white.png')} />
                                </View>
                            </View>
                        </AnimatedRawButton>
                    </Animated.View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Animated.View style={{ opacity: this.loginCardOpacity, transform: [ { translateX: this.moveLoginHeader } ] }}>
                        <View style={{ ...styles.headerTextView }}>
                            <Text style={{ ...styles.headerText }}>Welcome Back!</Text>
                        </View>
                    </Animated.View>
                    <Animated.View style={{ opacity: this.signInCardOpacity, transform: [ { translateX: this.moveSignUpHeader } ] }}>
                        <View style={{ ...styles.headerTextView }}>
                            <Text style={{ ...styles.headerText }}>New Customer</Text>
                        </View>
                    </Animated.View>
                    <Animated.View style={{ opacity: this.loginCardOpacity, transform: [ { translateX: this.moveHomeHeaderTitle } ] }}>
                        <View style={{ ...styles.headerTextView }}>
                            <Text style={{ ...styles.headerText }}>Hello!</Text>
                        </View>
                    </Animated.View>
                </View>
                <Animated.View style={{ flexDirection: 'row', paddingBottom: 32 }}>
                    {/* Sign up card */}
                    <TapGestureHandler onHandlerStateChange={this.onSignUpTap} >
                        <Animated.View style={{ opacity: this.signInCardOpacity, transform: [ { translateX: this.signUpX } ] }}>
                            <View style={{ ...styles.loginSignUpView, width: constant.CARD_WIDTH, height: constant.CARD_HEIGHT, backgroundColor: '#0021FD' }}>
                                <View style={{ ...styles.introView }}>
                                    <Animated.View style={{ paddingBottom: 24, transform: [ { translateX: this.signCardHeader } ] }}>
                                        <Text style={{ ...styles.introHeader, textAlign: 'right' }}>Sign Up</Text>
                                    </Animated.View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Animated.View style={{ width: (width-122), opacity: this.signInCardOpacity, transform: [ { translateX: this.moveInputSignUp } ] }}>
                                            <View style={{ ...styles.inputView }}>
                                                <InputWhite placeholder="Enter your name" />
                                            </View>
                                            <View style={{ ...styles.inputView }}>
                                                <InputWhite placeholder="Enter your email" />
                                            </View>
                                            <View style={{ ...styles.inputView }}>
                                                <InputWhite placeholder="Enter your password" />
                                            </View>
                                            <View style={{ paddingTop: 32, alignItems: 'center' }}>
                                                <View style={{ ...styles.submitButton, backgroundColor: 'white', }}>
                                                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/icon/arrow_right_signup.png')} />
                                                </View>
                                            </View>
                                        </Animated.View>
                                        <Animated.View style={{ width: (width-122), opacity: this.signInCardOpacity, transform: [ { translateX: this.moveTextSignUp } ] }}>
                                            <Text style={{ ...styles.introText, textAlign: 'right', paddingBottom: 8, width: (width-122)/2 }}>
                                                New Here?
                                            </Text>
                                            <Text style={{ ...styles.introText, textAlign: 'right', width: (width-122)/2 }} >
                                                Don't worry just sign up to gain access to this amazing app.
                                            </Text>
                                        </Animated.View>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </TapGestureHandler>
                    {/* login card */}
                    <TapGestureHandler onHandlerStateChange={this.onLoginTap}>
                        <Animated.View style={{ opacity: this.loginCardOpacity, transform: [ { translateX: this.loginX } ] }}>
                            <View style={{ ...styles.loginSignUpView, width: constant.CARD_WIDTH, height: constant.CARD_HEIGHT, backgroundColor: '#0553D3' }}>
                               <View style={{ ...styles.introView }}>
                                    <Animated.View style={{ paddingBottom: 24, transform: [ { translateX: this.loginCardHeader } ] }}>
                                        <Text style={{ ...styles.introHeader, textAlign: 'right' }}>Login</Text>
                                    </Animated.View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Animated.View style={{ width: (width-122), opacity: this.loginCardOpacity, transform: [ { translateX: this.moveInputLogin } ] }}>
                                            <View style={{ ...styles.inputView }}>
                                                <InputWhite placeholder="Enter your email" />
                                            </View>
                                            <View style={{ ...styles.inputView }}>
                                                <InputWhite placeholder="Enter your password" />
                                            </View>
                                            <View style={{ paddingTop: 32, alignItems: 'center' }}>
                                                <View style={{ ...styles.submitButton, backgroundColor: 'white', }}>
                                                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/icon/arrow_right_signup.png')} />
                                                </View>
                                            </View>
                                        </Animated.View>
                                        <Animated.View style={{ width: (width-122), opacity: this.loginCardOpacity, transform: [ { translateX: this.moveTextLogin } ] }}>
                                            <Text style={{ ...styles.introText, textAlign: 'left', paddingBottom: 8, width: (width-122)/2 }}>
                                                Returning?
                                            </Text>
                                            <Text style={{ ...styles.introText, textAlign: 'left', width: (width-122)/2 }} >
                                            Just sign in to resume what you were doing.
                                            </Text>
                                        </Animated.View>
                                    </View>
                               </View>
                            </View>
                        </Animated.View>
                    </TapGestureHandler>
                    
                </Animated.View>
                <View style={{ alignItems: 'center', paddingTop: 24 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ paddingLeft: 8 }}>
                            <View style={{ ...styles.socialButton }}>
                                <Image style={{ ...styles.socialIconImg }} source={require('../../assets/icon/sm_google.png')} />
                            </View>
                        </View>
                        <View style={{ paddingLeft: 16 }}>
                            <View style={{ ...styles.socialButton, }}>
                                <Image style={{ ...styles.socialIconImg }} source={require('../../assets/icon/sm_twitter.png')} />
                            </View>
                        </View>
                        <View style={{ paddingLeft: 16 }}>
                            <View style={{ ...styles.socialButton }}>
                                <Image style={{ ...styles.socialIconImg }} source={require('../../assets/icon/sm_facebook.png')} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    loginSignUpView: {
        borderRadius: 32
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    closeButton: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    submitButton: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    socialIconImg: { width: 48, height: 48 },
    socialButton: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'black',
        shadowOpacity: 0.4,
        elevation: 4
    },
    headerTextView: {
        alignItems: 'center',
        marginBottom: 30
    },
    headerText: {
        fontSize: 24, 
        color: '#0F1010', 
        fontWeight: 'bold'
    },
    introText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18
    },
    introView: {
        paddingTop: 32, 
        paddingLeft: 32,
        paddingRight: 32
    },
    introHeader: {
        color: 'white',
        fontSize: 24,
        fontWeight: '300',
    },
    inputView: {
        paddingTop: 12,
        paddingBottom: 12
    }
})