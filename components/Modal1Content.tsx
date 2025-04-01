import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  ScrollView,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Modal1ContentProps {
  onClose: () => void;
  onOpenNextModal: () => void;
}

export const Modal1Content = ({ onClose, onOpenNextModal }: Modal1ContentProps) => {
  return (
    <View style={styles.modalSecundarioContenido}>
      <View style={styles.modalSecundarioHeader}>
        <Text style={styles.modalSecundarioTitulo}>Detalles del Item</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-circle" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.modalSecundarioBody}>
        <Text style={styles.modalSecundarioTexto}>
          Este es un ejemplo de un modal secundario que aparece sobre el modal principal.
          Este enfoque evita los problemas en iOS donde los modales anidados no se muestran correctamente.
        </Text>
        
        <View style={styles.detallesContainer}>
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Nombre:</Text>
            <Text style={styles.detalleValor}>Producto de Ejemplo</Text>
          </View>
          
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Categoría:</Text>
            <Text style={styles.detalleValor}>Electrónica</Text>
          </View>
          
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Precio:</Text>
            <Text style={styles.detalleValor}>$199.99</Text>
          </View>
          
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Disponible:</Text>
            <Text style={styles.detalleValor}>Sí</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.botonSecundario}
          onPress={onOpenNextModal}
        >
          <Text style={styles.botonSecundarioTexto}>Abrir Tercer Modal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    // Estilos del modal principal
    modalFondo: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContenedor: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      height: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    
    // Estilos para los modales secundarios
    modalSecundarioContenido: {
      backgroundColor: 'white',
      width: '90%',
      maxHeight: '80%',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalSecundarioHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    modalSecundarioTitulo: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalSecundarioBody: {
      padding: 16,
    },
    modalSecundarioTexto: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 20,
    },
    detallesContainer: {
      marginBottom: 20,
    },
    detalleItem: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    detalleLabel: {
      width: 100,
      fontSize: 16,
      fontWeight: '500',
    },
    detalleValor: {
      flex: 1,
      fontSize: 16,
    },
    botonSecundario: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    botonSecundarioTexto: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    iconoConfirmacion: {
      alignSelf: 'center',
      marginBottom: 16,
    }
  });
