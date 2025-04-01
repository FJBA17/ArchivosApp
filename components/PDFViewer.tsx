import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface PDFViewerProps {
  visible: boolean;
  onClose: () => void;
  pdfUri: string;
  documentName: string;
}

const { width, height } = Dimensions.get('window');

export const PDFViewer: React.FC<PDFViewerProps> = ({
  visible,
  onClose,
  pdfUri,
  documentName
}) => {
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [localPdfPath, setLocalPdfPath] = useState<string | null>(null);

  // Para PDFs en línea, descargarlos primero para mejor rendimiento
  React.useEffect(() => {
    if (visible && pdfUri.startsWith('http')) {
      downloadPdf();
    } else if (visible && !pdfUri.startsWith('http')) {
      // Para archivos locales, usar directamente
      setLocalPdfPath(pdfUri);
      setLoading(false);
    }

    return () => {
      // Limpiar archivos temporales cuando se cierra
      if (localPdfPath && pdfUri.startsWith('http')) {
        ReactNativeBlobUtil.fs.unlink(localPdfPath).catch(() => {});
      }
    };
  }, [visible, pdfUri]);

  const downloadPdf = async () => {
    try {
      setLoading(true);
      setPdfError(false);
      
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', pdfUri);
      
      const path = res.path();
      setLocalPdfPath(path);
      setLoading(false);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      setPdfError(true);
      setLoading(false);
      Alert.alert(
        "Error",
        "No se pudo descargar el documento PDF.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {documentName}
          </Text>
          <Text style={styles.pageInfo}>{currentPage}/{totalPages}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Cargando documento...</Text>
          </View>
        ) : pdfError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="document-text-outline" size={70} color="#ccc" />
            <Text style={styles.errorText}>
              No se pudo cargar el documento
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={downloadPdf}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : localPdfPath ? (
          <Pdf
            source={{ uri: localPdfPath }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`PDF cargado: ${numberOfPages} páginas`);
              setTotalPages(numberOfPages);
            }}
            onPageChanged={(page) => {
              console.log(`Página actual: ${page}`);
              setCurrentPage(page);
            }}
            onError={(error) => {
              console.error('Error al renderizar PDF:', error);
              setPdfError(true);
            }}
            onPressLink={(uri) => {
              console.log(`Link presionado: ${uri}`);
            }}
            style={styles.pdf}
            enablePaging={true}
            activityIndicator={<ActivityIndicator color="#007bff" />}
            activityIndicatorProps={{ color: '#007bff' }}
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
});