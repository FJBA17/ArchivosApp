import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Archivo } from '../types/Evento';

export const pickPDF = async (): Promise<Archivo | null> => {
  try {
    console.log('Intentando seleccionar PDF...');
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf'
    });

    console.log('Resultado de selección de PDF:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedFile = result.assets[0];
      console.log('PDF seleccionado con éxito');
      
      const fileName = selectedFile.name;
      const newPath = `${FileSystem.documentDirectory}pdfs/${fileName}`;
      
      // Asegurarse de que el directorio exista
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}pdfs`, { intermediates: true });
      
      try {
        await FileSystem.copyAsync({
          from: selectedFile.uri,
          to: newPath
        });
        console.log('PDF copiado exitosamente:', newPath);

        return {
          uri: newPath,
          type: 'pdf',
          nombre: fileName
        };
      } catch (copyError) {
        console.error('Error al copiar PDF:', copyError);
        return null;
      }
    }
    return null;
  } catch (err) {
    console.error('Error general al seleccionar PDF:', err);
    return null;
  }
};

export const pickAudio = async (): Promise<Archivo | null> => {
  try {
    console.log('Intentando seleccionar audio...');
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*'
    });

    console.log('Resultado de selección de audio:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedFile = result.assets[0];
      console.log('Audio seleccionado con éxito');
      
      const fileName = selectedFile.name;
      const newPath = `${FileSystem.documentDirectory}audios/${fileName}`;
      
      // Asegurarse de que el directorio exista
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}audios`, { intermediates: true });
      
      try {
        await FileSystem.copyAsync({
          from: selectedFile.uri,
          to: newPath
        });
        console.log('Audio copiado exitosamente:', newPath);

        return {
          uri: newPath,
          type: 'audio',
          nombre: fileName
        };
      } catch (copyError) {
        console.error('Error al copiar audio:', copyError);
        return null;
      }
    }
    return null;
  } catch (err) {
    console.error('Error general al seleccionar audio:', err);
    return null;
  }
};

export const pickImage = async (): Promise<Archivo | null> => {
  try {
    console.log('Intentando seleccionar imagen...');
    
    // Usar nuevo método de permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permisos de galería denegados');
      alert('Se requieren permisos para acceder a la galería');
      return null;
    }

    // Usar el método correcto para tipos de medios
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    console.log('Resultado de selección de imagen:', pickerResult);

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedImage = pickerResult.assets[0];
      console.log('Imagen seleccionada con éxito');
      
      const fileName = selectedImage.fileName || `imagen_${Date.now()}.jpg`;
      const newPath = `${FileSystem.documentDirectory}imagenes/${fileName}`;
      
      // Asegurarse de que el directorio exista
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}imagenes`, { intermediates: true });
      
      try {
        await FileSystem.copyAsync({
          from: selectedImage.uri,
          to: newPath
        });
        console.log('Imagen copiada exitosamente:', newPath);

        return {
          uri: newPath,
          type: 'image',
          nombre: fileName
        };
      } catch (copyError) {
        console.error('Error al copiar imagen:', copyError);
        return null;
      }
    }
    return null;
  } catch (err) {
    console.error('Error general al seleccionar imagen:', err);
    return null;
  }
};