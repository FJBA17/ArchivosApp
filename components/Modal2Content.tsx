import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Modal2ContentProps {
  onBack: () => void;
  onConfirm: () => void;
}

export const Modal2Content = ({ onBack, onConfirm }: Modal2ContentProps) => {
  return (
    <View style={styles.modalSecundarioContenido}>
      <View style={styles.modalSecundarioHeader}>
        <Text style={styles.modalSecundarioTitulo}>Confirmación</Text>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalSecundarioBody}>
        <Ionicons name="checkmark-circle" size={60} color="#28a745" style={styles.iconoConfirmacion} />
        
        <Text style={styles.modalSecundarioTexto}>
          ¡Este es un tercer nivel de modal! Como puedes ver, esto funciona perfectamente incluso en iOS.
        </Text>
        
        <TouchableOpacity 
          style={[styles.botonSecundario, {backgroundColor: '#28a745'}]}
          onPress={onConfirm}
        >
          <Text style={styles.botonSecundarioTexto}>Confirmar y Cerrar Todo</Text>
        </TouchableOpacity>
      </View>
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
