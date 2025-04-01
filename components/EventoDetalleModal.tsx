import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image
} from 'react-native';
import { Evento, Archivo } from '../types/Evento';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer } from './AudioPlayer';
import { ImageViewer } from './ImageViewer';
// import { PDFViewer } from './PDFViewer';

interface EventoDetalleModalProps {
  visible: boolean;
  onClose: () => void;
  evento: Evento;
}

export const EventoDetalleModal: React.FC<EventoDetalleModalProps> = ({ 
  visible, 
  onClose, 
  evento 
}) => {
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<Archivo | null>(null);
  
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Archivo | null>(null);
  
  const [pdfViewerVisible, setPdfViewerVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<Archivo | null>(null);

  const handleAudioPress = (archivo: Archivo) => {
    // Verificar si el archivo tiene una URI válida
    if (!archivo.uri) {
      console.error('El archivo no tiene una URI válida');
      alert('No se puede reproducir este archivo de audio');
      return;
    }
    
    // Asignar el archivo seleccionado y mostrar el reproductor
    setSelectedAudio({
      ...archivo,
      // Asegurar que el nombre sea legible
      nombre: archivo.nombre || 'Audio sin nombre'
    });
    setAudioPlayerVisible(true);
  };

  const handleImagePress = (archivo: Archivo) => {
    if (!archivo.uri) {
      console.error('La imagen no tiene una URI válida');
      alert('No se puede mostrar esta imagen');
      return;
    }

    setSelectedImage(archivo);
    setImageViewerVisible(true);
  };

  const handlePdfPress = (archivo: Archivo) => {
    if (!archivo.uri) {
      console.error('El PDF no tiene una URI válida');
      alert('No se puede mostrar este documento');
      return;
    }

    setSelectedPdf(archivo);
    setPdfViewerVisible(true);
  };

  const renderArchivos = () => {
    if (!evento.archivos || evento.archivos.length === 0) {
      return (
        <View style={styles.noArchivosContainer}>
          <Text style={styles.noArchivosText}>No hay archivos adjuntos</Text>
        </View>
      );
    }

    return evento.archivos.map((archivo, index) => {
      switch (archivo.type) {
        case 'image':
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.archivoImagenDetalle}
              onPress={() => handleImagePress(archivo)}
            >
              <Image 
                source={{ uri: archivo.uri }} 
                style={styles.imagenMiniatura} 
                resizeMode="cover"
              />
              <View style={styles.infoArchivoContainer}>
                <Text style={styles.nombreArchivo} numberOfLines={1}>{archivo.nombre}</Text>
                <Ionicons name="expand" size={20} color="#007bff" style={styles.verIcon} />
              </View>
            </TouchableOpacity>
          );
        case 'pdf':
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.archivoDetalle}
              onPress={() => handlePdfPress(archivo)}
            >
              <Ionicons name={'document'} size={30} color="#FF0000"/>
              <Text style={styles.nombreArchivo}>{archivo.nombre}</Text>
              <Ionicons name="open-outline" size={24} color="#FF0000" style={styles.openIcon} />
            </TouchableOpacity>
          );
        case 'audio':
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.archivoDetalle}
              onPress={() => handleAudioPress(archivo)}
            >
              <Ionicons name={'musical-notes'} size={30} color="#007bff"/>
              <Text style={styles.nombreArchivo}>{archivo.nombre}</Text>
              <Ionicons name="play-circle" size={24} color="#007bff" style={styles.playIcon} />
            </TouchableOpacity>
          );
      }
    });
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.cerrarBoton} onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#333" />
            </TouchableOpacity>

            <ScrollView>
              <Text style={styles.titulo}>
                {evento.titulo}
              </Text>
              <Text style={styles.descripcion}>
                {evento.descripcion}
              </Text>
              <Text style={styles.fecha}>
                Creado el: {evento.fechaCreacion}
              </Text>

              <View style={styles.seccionArchivos}>
                <Text style={styles.tituloArchivos}>
                  Archivos
                </Text>
                {renderArchivos()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reproductor de Audio */}
      {selectedAudio && (
        <AudioPlayer
          visible={audioPlayerVisible}
          onClose={() => {
            setAudioPlayerVisible(false);
          }}
          audioUri={selectedAudio.uri}
          nombreAudio={selectedAudio.nombre}
        />
      )}

      {/* Visor de Imágenes */}
      {selectedImage && (
        <ImageViewer
          visible={imageViewerVisible}
          onClose={() => setImageViewerVisible(false)}
          imageUri={selectedImage.uri}
        />
      )}

      {/* Visor de PDF */}
      {selectedPdf && (
        <PDFViewer
          visible={pdfViewerVisible}
          onClose={() => setPdfViewerVisible(false)}
          pdfUri={selectedPdf.uri}
          documentName={selectedPdf.nombre || 'Documento PDF'}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  cerrarBoton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  fecha: {
    fontSize: 14,
    marginBottom: 20,
    color: '#999',
  },
  seccionArchivos: {
    marginTop: 20,
  },
  tituloArchivos: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  archivoDetalle: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  archivoImagenDetalle: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden'
  },
  nombreArchivo: {
    fontSize: 16,
    paddingLeft: 10,
    flex: 1
  },
  playIcon: {
    marginLeft: 10
  },
  openIcon: {
    marginLeft: 10
  },
  verIcon: {
    marginRight: 10
  },
  imagenMiniatura: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0'
  },
  infoArchivoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  noArchivosContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center'
  },
  noArchivosText: {
    color: '#999',
    fontSize: 16
  }
});