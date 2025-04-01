import React, { useState } from 'react';
import {
  View,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface ImageViewerProps {
  visible: boolean;
  onClose: () => void;
  imageUri: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  onClose,
  imageUri
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Para el gesto de zoom
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = Math.max(1, Math.min(event.scale, 5));
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      // Al terminar el gesto, animar de vuelta a la escala 1 si es menor a 1.5
      if (scale.value < 1.5) {
        scale.value = withTiming(1, { duration: 200 });
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
      ],
    };
  });

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="dark">
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <GestureHandlerRootView style={styles.gestureContainer}>
            <PinchGestureHandler
              onGestureEvent={pinchHandler}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END) {
                  if (scale.value < 1.5) {
                    scale.value = withTiming(1, { duration: 200 });
                  }
                }
              }}
            >
              <Animated.View style={[styles.imageContainer, rStyle]}>
                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                  </View>
                )}

                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={50} color="white" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </Animated.View>
            </PinchGestureHandler>
          </GestureHandlerRootView>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});