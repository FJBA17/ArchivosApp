import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Evento } from '../types/Evento';
import { EventoDetalleModal } from './EventoDetalleModal';

interface EventoItemProps {
  evento: Evento;
  onEliminar: (id: number) => void;
}

export const EventoItem: React.FC<EventoItemProps> = ({ evento, onEliminar }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderPrevistaArchivo = () => {
    const primerArchivo = evento.archivos[0];
    if (!primerArchivo) return null;

    switch (primerArchivo.type) {
      case 'image':
        return (
          <Image 
            source={{ uri: primerArchivo.uri }} 
            style={styles.imagenPrevia} 
          />
        );
      case 'pdf':
        return (
          <View style={styles.iconoArchivo}>
            <Ionicons name="document" size={40} color="#FF0000" />
          </View>
        );
      case 'audio':
        return (
          <View style={styles.iconoArchivo}>
            <Ionicons name="musical-notes" size={40} color="#007bff" />
          </View>
        );
    }
  };

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que quieres eliminar este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onEliminar(evento.id!)
        }
      ]
    );
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.contenedor}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.contenidoItem}>
          {renderPrevistaArchivo()}
          <View style={styles.textoContenedor}>
            <Text style={styles.titulo}>
              {evento.titulo}
            </Text>
            <Text 
              style={styles.descripcion}
              numberOfLines={2}
            >
              {evento.descripcion}
            </Text>
            <Text style={styles.fecha}>
              {evento.fechaCreacion}
            </Text>
          </View>
          <TouchableOpacity onPress={handleEliminar} style={styles.botonEliminar}>
            <Ionicons name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <EventoDetalleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        evento={evento}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f9f9f9',
    elevation: 3,
  },
  contenidoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagenPrevia: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  iconoArchivo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textoContenedor: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  botonEliminar: {
    marginLeft: 10,
  },
});