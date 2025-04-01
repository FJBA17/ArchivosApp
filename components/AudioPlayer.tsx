import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

interface AudioPlayerProps {
  visible: boolean;
  onClose: () => void;
  audioUri: string;
  nombreAudio: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  visible, 
  onClose, 
  audioUri,
  nombreAudio
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnloading, setIsUnloading] = useState(false);
  const [isStateChanging, setIsStateChanging] = useState(false);
  const isMounted = useRef(true);
  const playbackUpdateEnabled = useRef(true);
  
  // Limpiar al desmontar
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cargar o descargar audio cuando cambia la visibilidad
  useEffect(() => {
    if (visible && audioUri) {
      setupAudioMode().then(() => {
        if (isMounted.current) {
          loadAudio();
        }
      });
    }
    
    return () => {
      if (sound) {
        unloadAudio();
      }
    };
  }, [visible, audioUri]);

  // Actualizar posición mientras reproduce
  useEffect(() => {
    if (!sound || !isPlaying) return;
    
    const positionUpdateInterval = setInterval(async () => {
      if (sound && isPlaying && !isStateChanging) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis);
          }
        } catch (error) {
          clearInterval(positionUpdateInterval);
        }
      }
    }, 1000);
    
    return () => clearInterval(positionUpdateInterval);
  }, [sound, isPlaying, isStateChanging]);

  const setupAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        shouldDuckAndroid: false,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Error configurando audio:', error);
    }
  };

  const loadAudio = async () => {
    if (isUnloading) return;
    
    try {
      setIsLoading(true);
      
      // Encode URI to handle special characters
      const encodedUri = audioUri.replace(/ /g, '%20');
      console.log('Cargando audio desde:', encodedUri);
      
      // Desactivar actualizaciones durante la carga
      playbackUpdateEnabled.current = false;
      
      // Crear objeto de audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: encodedUri },
        { 
          shouldPlay: false,
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
          volume: 1.0,
          rate: 1.0,
          // Configuración específica para Android
          androidImplementation: Platform.OS === 'android' ? 'MediaPlayer' : undefined,
          shouldCorrectPitch: true,
        },
        onPlaybackStatusUpdate
      );
      
      if (isMounted.current) {
        const status = await newSound.getStatusAsync();
        setSound(newSound);
        
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }
        
        setIsLoading(false);
        
        // Reactivar actualizaciones después de carga completa
        setTimeout(() => {
          playbackUpdateEnabled.current = true;
        }, 500);
      } else {
        await newSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error cargando audio:', error);
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!isMounted.current || !playbackUpdateEnabled.current) return;
    
    if (status.isLoaded) {
      const newIsPlaying = status.isPlaying;
      
      // Solo actualizar UI al inicio, fin o cambios manuales
      if (status.didJustFinish || isStateChanging) {
        setIsPlaying(newIsPlaying);
        if (isStateChanging) {
          setIsStateChanging(false);
        }
      }
      
      // Mantener posición actualizada
      if (Math.abs(position - status.positionMillis) > 1000) {
        setPosition(status.positionMillis);
      }
      
      // Actualizar duración si cambia
      if (status.durationMillis !== duration) {
        setDuration(status.durationMillis || 0);
      }
      
      // Si el audio terminó, reiniciar posición
      if (status.didJustFinish) {
        setPosition(0);
        setIsPlaying(false);
        if (sound) {
          sound.setPositionAsync(0).catch(() => {});
        }
      }
    }
  };

  const unloadAudio = async () => {
    setIsUnloading(true);
    playbackUpdateEnabled.current = false;
    
    if (sound) {
      try {
        if (isPlaying) {
          await sound.pauseAsync();
        }
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        // Ignorar errores esperados
      } finally {
        if (isMounted.current) {
          setSound(null);
          setPosition(0);
          setDuration(0);
          setIsPlaying(false);
          setIsUnloading(false);
        }
      }
    } else {
      setIsUnloading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!sound || isLoading || isUnloading) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // Pequeña pausa para estabilidad
        await sound.setVolumeAsync(1.0);
        await sound.playFromPositionAsync(position);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error en play/pause:', error);
      
      if (error.message && error.message.includes('not loaded')) {
        loadAudio();
      }
    }
  };

  // Eliminar la función handleSeek ya que no se necesita
  
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleCloseModal = () => {
    if (sound && isPlaying) {
      sound.pauseAsync().catch(() => {});
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Reproduciendo audio</Text>
            <View style={styles.placeholder} />
          </View>

          <Text style={styles.audioName} numberOfLines={1}>{nombreAudio}</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Cargando audio...</Text>
            </View>
          ) : (
            <View style={styles.playerContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
              
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#007bff"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#007bff"
                disabled={true}
              />
              
              <View style={styles.controlsContainer}>
                <TouchableOpacity 
                  style={[styles.controlButton, {opacity: isLoading || isUnloading ? 0.5 : 1}]}
                  disabled={isLoading || isUnloading}
                >
                  <Ionicons name="play-skip-back" size={24} color="#333" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.playButton]} 
                  onPress={handlePlayPause}
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={32} 
                    color="white" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, {opacity: isLoading || isUnloading ? 0.5 : 1}]}
                  disabled={isLoading || isUnloading}
                >
                  <Ionicons name="play-skip-forward" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 270,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  audioName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom : 20
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});