import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Modal,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEventos } from '../../hooks/useEventos';
import { pickPDF, pickImage, pickAudio } from '../../utils/fileUtils';
import { EventoItem } from '../../components/EventoItem';
import { Evento, Archivo } from '../../types/Evento';

export default function EventosScreen() {
  const { eventos, agregarEvento, borrarEvento } = useEventos();
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<Archivo[]>([]);

  const handlePickPDF = async () => {
    console.log('Iniciando selección de PDF');
    const archivo = await pickPDF();
    if (archivo) {
      console.log('PDF seleccionado:', archivo);
      setArchivos(prev => [...prev, archivo]);
    } else {
      console.log('No se seleccionó ningún PDF');
    }
  };

  const handlePickImage = async () => {
    console.log('Iniciando selección de imagen');
    const imagen = await pickImage();
    if (imagen) {
      console.log('Imagen seleccionada:', imagen);
      setArchivos(prev => [...prev, imagen]);
    } else {
      console.log('No se seleccionó ninguna imagen');
    }
  };

  const handlePickAudio = async () => {
    console.log('Iniciando selección de audio');
    const archivo = await pickAudio();
    if (archivo) {
      console.log('Audio seleccionado:', archivo);
      setArchivos(prev => [...prev, archivo]);
    } else {
      console.log('No se seleccionó ningún audio');
    }
  };

  const handleEliminarArchivo = (index: number) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const renderArchivoItem = (archivo: Archivo, index: number) => {
    const iconMap = {
      'pdf': 'document',
      'image': 'image',
      'audio': 'musical-notes'
    };

    return (
      <View style={styles.archivoItem} key={index}>
        <Ionicons 
          name={iconMap[archivo.type]} 
          size={24} 
          color={archivo.type === 'pdf' ? '#FF0000' : 
                 archivo.type === 'audio' ? '#007bff' : '#000'}
        />
        <Text style={styles.archivoNombre} numberOfLines={1}>
          {archivo.nombre}
        </Text>
        <TouchableOpacity onPress={() => handleEliminarArchivo(index)}>
          <Ionicons name="close-circle" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleCrearEvento = () => {
    if (!titulo.trim()) {
      alert('Por favor, ingresa un título');
      return;
    }

    const nuevoEvento: Omit<Evento, 'id'> = {
      titulo,
      descripcion,
      archivos,
      fechaCreacion: new Date().toLocaleDateString()
    };

    console.log('Evento a crear:', nuevoEvento);
    agregarEvento(nuevoEvento);
    
    // Limpiar formulario
    setTitulo('');
    setDescripcion('');
    setArchivos([]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mis Eventos</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={({ item }) => (
          <EventoItem 
            evento={item} 
            onEliminar={borrarEvento} 
          />
        )}
        contentContainerStyle={styles.listaEventos}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay eventos creados</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Crear Nuevo Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Título del Evento"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={[styles.input, styles.descripcionInput]}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />

            {/* Archivos seleccionados */}
            {archivos.length > 0 && (
              <View style={styles.archivosContainer}>
                {archivos.map(renderArchivoItem)}
              </View>
            )}

            <View style={styles.botonesArchivosContainer}>
              <TouchableOpacity 
                style={styles.botonArchivo} 
                onPress={handlePickPDF}
              >
                <Ionicons name="document" size={24} color="#333" />
                <Text style={styles.botonArchivoTexto}>PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.botonArchivo} 
                onPress={handlePickImage}
              >
                <Ionicons name="image" size={24} color="#333" />
                <Text style={styles.botonArchivoTexto}>Imagen</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.botonArchivo} 
                onPress={handlePickAudio}
              >
                <Ionicons name="musical-notes" size={24} color="#333" />
                <Text style={styles.botonArchivoTexto}>Audio</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.botonCrear} 
              onPress={handleCrearEvento}
            >
              <Text style={styles.botonCrearTexto}>Guardar Evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Resto de los estilos permanecen igual...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listaEventos: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  descripcionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  botonesArchivosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  botonArchivo: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: '30%',
  },
  botonArchivoTexto: {
    marginTop: 4,
    fontSize: 12,
  },
  archivoTexto: {
    fontSize: 12,
    color: '#666',
  },
  botonCrear: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCrearTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  archivosContainer: {
    marginBottom: 12,
    gap: 8,
  },
  archivoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  archivoNombre: {
    flex: 1,
    fontSize: 14,
  },
});