import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import style from 'common/style';
import Video from 'react-native-video';
import imageUrl from '../../image/image';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SliderBar from '../SliderBar/SliderBar';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '../Voice/Voice';
interface props {
  source: string;
  paused: boolean;
  title: string;
}
interface videoTime {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}
export default function VideoView(props: props) {
  const {source, paused} = props;
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const [allTimeData, setAllTimeData] = useState({
    playableDuration: 1,
    seekableDuration: 1,
  });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoTimeMySet, setVideoTimeMySet] = useState(0);
  const [isOpenVoice, setIsOpenVoice] = useState(true);
  const videoRef = useRef<any>();
  const footerShow = useSharedValue<boolean>(false);

  useEffect(() => {
    if (videoRef?.current?.seek != undefined) {
      videoRef?.current?.seek(videoTimeMySet);
    }
  }, [videoTimeMySet]);

  //定义style
  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(0, withSpring(footerShow.value ? 1 : 0)),
      transform: [
        {
          translateY: withDelay(0, withTiming(footerShow.value ? 0 : 50)),
        },
      ],
    };
  });
  const naVAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(0, withSpring(footerShow.value ? 1 : 0)),
      transform: [
        {
          translateY: withDelay(0, withTiming(footerShow.value ? 0 : -50)),
        },
      ],
    };
  });
  //底部组件
  const renderFooter = useMemo(() => {
    return (
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.5)']}
        style={{
          width: '100%',
        }}>
        <Animated.View style={[styles.footerBox, footerAnimatedStyle]}>
          <TouchableWithoutFeedback
            onPress={() => {
              setPausedState(!pausedState);
            }}>
            <FastImage
              source={
                pausedState
                  ? imageUrl.video.startFooter
                  : imageUrl.video.pausedFooter
              }
              style={{
                width: 30,
                height: 30,
              }}></FastImage>
          </TouchableWithoutFeedback>
          {/*进度条组件 */}

          <SliderBar
            currentTimeState={currentTime}
            allTime={allTimeData}
            setVideoTime={setVideoTimeMySet}></SliderBar>
          <TouchableOpacity
          activeOpacity={1}
            onPress={() => {
              //组件渲染即可
              setIsOpenVoice(!isOpenVoice);
            }}>
            <Voice isOpenVoice={isOpenVoice}></Voice>
          </TouchableOpacity>
          <TouchableOpacity>
            <FastImage
              source={imageUrl.video.fullScreen}
              style={{
                width: 30,
                height: 30,
              }}></FastImage>
          </TouchableOpacity>
          {/*全屏控件*/}
        </Animated.View>
      </LinearGradient>
    );
  }, [footerShow, pausedState, currentTime, allTimeData, isOpenVoice]);

  //顶部组件
  const renderNav = useMemo(() => {
    return (
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(255,255,255,0)']}
        style={{
          width: '100%',
        }}>
        <Animated.View style={[naVAnimatedStyle, styles.bottomBox]}>
          <FastImage
            source={imageUrl.common.back}
            style={{
              width: 30,
              height: 30,
            }}></FastImage>
          <FastImage
            source={imageUrl.common.option}
            style={{
              width: 30,
              height: 30,
            }}></FastImage>
        </Animated.View>
      </LinearGradient>
    );
  }, []);

  //整体渲染
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        footerShow.value = !footerShow.value;
      }}>
      <Animated.View style={styles.box}>
        <Animated.View>
          <Video
            paused={pausedState}
            source={source}
            style={styles.videoBox}
            onProgress={(event: videoTime) => {
              if (allTimeData.playableDuration == 1) {
                setAllTimeData(() => {
                  return {
                    playableDuration: event.playableDuration,
                    seekableDuration: event.seekableDuration,
                  };
                });
              }
              setCurrentTime(()=>{
                return event.currentTime;
              });
            }}
            muted={isOpenVoice}
            ref={videoRef}
            currentPlaybackTime={currentTime}></Video>
        </Animated.View>
        <View
          style={{
            ...styles.upOnVideoBox,
          }}>
          {renderNav}
          {renderFooter}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  box: {
    position: 'relative',
    overflow: 'hidden',
  },
  videoBox: {
    width: style.DeviceWidth,
    height: style.DeviceWidth * (9 / 16),
    backgroundColor: 'black',
  },
  upOnVideoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  footerBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBox: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
});
