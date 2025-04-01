import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  SafeAreaView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Importamos nuestros componentes de modales
import { ModalManager } from '../../components/ModalManager';
import { Modal1Content } from '../../components/Modal1Content';
import { Modal2Content } from '../../components/Modal2Content';

export default function ModalesScreen() {
  // Estados para controlar la visibilidad de los modales
  const [modalPrincipalVisible, setModalPrincipalVisible] = useState(false);
  
  // Estado para controlar qué modal secundario mostrar (solo se mostrará uno a la vez)
  const [modalActivo, setModalActivo] = useState(null);
  
  // Animaciones para el modal principal
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  // Función para abrir el modal principal con animación
  const abrirModalPrincipal = () => {
    setModalPrincipalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  // Función para cerrar el modal principal con animación
  const cerrarModalPrincipal = () => {
    if (modalActivo !== null) {
      // Si hay un modal secundario activo, solo cerramos ese
      setModalActivo(null);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      setModalPrincipalVisible(false);
    });
  };

  // Función para manejar la confirmación y cerrar todos los modales
  const handleConfirmAndClose = () => {
    setModalActivo(null);
    setTimeout(() => cerrarModalPrincipal(), 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Ejemplo de Modales Anidados</Text>
      </View>
      
      <View style={styles.contenido}>
        <Text style={styles.descripcion}>
          Este ejemplo muestra cómo implementar modales anidados que funcionan correctamente en iOS.
          En lugar de usar múltiples componentes Modal anidados, usamos un único Modal y renderizamos
          condicionalmente el contenido de los "modales secundarios" dentro del principal.
        </Text>
        
        <TouchableOpacity style={styles.boton} onPress={abrirModalPrincipal}>
          <Text style={styles.botonTexto}>Abrir Modal Principal</Text>
        </TouchableOpacity>
      </View>
      
      {/* Utilizamos nuestro componente ModalManager */}
      <ModalManager
        isVisible={modalPrincipalVisible}
        onClose={cerrarModalPrincipal}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      >
        {/* Header del modal principal */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>Modal Principal</Text>
          <TouchableOpacity onPress={cerrarModalPrincipal}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        {/* Body del modal principal, solo visible si no hay modal secundario activo */}
        {modalActivo === null && (
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalTexto}>
              Este es el modal principal. Desde aquí puedes abrir un "modal secundario" que en realidad
              será renderizado dentro de este mismo componente Modal.
            </Text>
            
            <View style={styles.opcionesContainer}>
              {[1, 2, 3].map((item) => (
                <TouchableOpacity 
                  key={item}
                  style={styles.opcionItem}
                  onPress={() => setModalActivo('modal1')}
                >
                  <View style={styles.opcionIcono}>
                    <Ionicons name="document-text" size={24} color="#007bff" />
                  </View>
                  <View style={styles.opcionTextoContainer}>
                    <Text style={styles.opcionTitulo}>Item {item}</Text>
                    <Text style={styles.opcionSubtitulo}>Toca para ver detalles</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
        
        {/* Renderizado condicional del primer modal secundario como componente */}
        {modalActivo === 'modal1' && (
          <View style={styles.modalSecundarioOverlay}>
            <Modal1Content
              onClose={() => setModalActivo(null)}
              onOpenNextModal={() => setModalActivo('modal2')}
            />
          </View>
        )}
        
        {/* Renderizado condicional del segundo modal secundario como componente */}
        {modalActivo === 'modal2' && (
          <View style={styles.modalSecundarioOverlay}>
            <Modal2Content
              onBack={() => setModalActivo('modal1')}
              onConfirm={handleConfirmAndClose}
            />
          </View>
        )}
      </ModalManager>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 16,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contenido: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  boton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos del modal principal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  modalTexto: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  
  // Estilos para las opciones en el modal principal
  opcionesContainer: {
    marginTop: 16,
  },
  opcionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  opcionIcono: {
    marginRight: 16,
  },
  opcionTextoContainer: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '500',
  },
  opcionSubtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  
  // Estilos para los modales secundarios
  modalSecundarioOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});