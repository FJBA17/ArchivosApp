import React from 'react';
import { View, StyleSheet, Modal as RNModal, Animated, TouchableWithoutFeedback } from 'react-native';

interface ModalManagerProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const ModalManager = ({ 
  isVisible, 
  onClose, 
  children, 
  fadeAnim, 
  slideAnim 
}: ModalManagerProps) => {
  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      {/* Fondo oscuro animado */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.modalFondo,
            { opacity: fadeAnim }
          ]}
        />
      </TouchableWithoutFeedback>
      
      {/* Contenido del modal principal con animación */}
      <Animated.View 
        style={[
          styles.modalContenedor,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        {children}
      </Animated.View>
    </RNModal>
  );
};

// Estilos compartidos (pueden estar en un archivo separado)
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