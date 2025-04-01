import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import { Ionicons } from '@expo/vector-icons';

// Constantes
const API_KEY = "AIzaSyCuWXeQiSThkpuk89WCuVTa32nBKoxPVQM"; // Tu API key

const DireccionScreen = () => {
    const [direccion, setDireccion] = useState({
        calle: '',
        numero: '',
        region: '',
        ciudad: '',
        codigoPostal: '',
        referencias: ''
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showManualForm, setShowManualForm] = useState(false);
    const [addressText, setAddressText] = useState("");

    // Función para buscar lugares con la API de Google Places
    const searchPlaces = async (text) => {
        if (!text || text.length < 3) {
            setPredictions([]);
            return;
        }
        
        setLoading(true);
        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${API_KEY}&language=es&components=country:mx`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK') {
                setPredictions(data.predictions);
            } else {
                console.error('Error en la búsqueda de lugares:', data.status);
                setPredictions([]);
            }
        } catch (error) {
            console.error('Error al buscar lugares:', error);
            setPredictions([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener detalles de un lugar
    const getPlaceDetails = async (placeId) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&language=es&fields=formatted_address,address_component`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return data.result;
            } else {
                console.error('Error al obtener detalles del lugar:', data.status);
                return null;
            }
        } catch (error) {
            console.error('Error al obtener detalles del lugar:', error);
            return null;
        }
    };

    // Usar debounce para evitar demasiadas llamadas a la API
    const debouncedSearch = React.useCallback(
        debounce((text) => {
            searchPlaces(text);
        }, 500),
        []
    );

    // Actualizar la búsqueda cuando cambia el texto
    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    // Seleccionar un lugar de las predicciones
    const handleSelectPlace = async (placeId, description) => {
        setLoading(true);
        setAddressText(description);
        
        try {
            const details = await getPlaceDetails(placeId);
            
            if (details) {
                // Extraer componentes de la dirección
                let streetNumber = '';
                let route = '';
                let neighborhood = '';
                let city = '';
                let state = '';
                let postalCode = '';
                
                if (details.address_components) {
                    for (const component of details.address_components) {
                        const types = component.types;
                        
                        if (types.includes('street_number')) {
                            streetNumber = component.long_name;
                        } else if (types.includes('route')) {
                            route = component.long_name;
                        } else if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
                            neighborhood = component.long_name;
                        } else if (types.includes('locality')) {
                            city = component.long_name;
                        } else if (types.includes('administrative_area_level_1')) {
                            state = component.long_name;
                        } else if (types.includes('postal_code')) {
                            postalCode = component.long_name;
                        }
                    }
                }
                
                // Actualizar el estado con la información extraída
                setDireccion({
                    calle: route,
                    numero: streetNumber,
                    region: neighborhood,
                    ciudad: city,
                    codigoPostal: postalCode,
                    referencias: ''
                });
            }
            
            // Limpiar predicciones y mostrar el formulario manual
            setPredictions([]);
            setSearchQuery('');
            setShowManualForm(true);
            
        } catch (error) {
            console.error('Error al procesar el lugar seleccionado:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = () => {
        // Validación básica
        if (!direccion.calle || !direccion.numero || !direccion.ciudad) {
            Alert.alert('Campos incompletos', 'Por favor completa los campos obligatorios (calle, número y ciudad)');
            return;
        }

        console.log('Dirección guardada:', direccion);
        // Aquí puedes añadir la lógica para guardar la dirección
        Alert.alert('Éxito', 'Dirección guardada correctamente');
    };

    // Función para actualizar el estado de direccion
    const handleChange = (field, value) => {
        setDireccion(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Ingresa tu dirección</Text>
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                {!showManualForm ? (
                    <View style={styles.autocompleteContainer}>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar dirección"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {loading && (
                                <ActivityIndicator 
                                    style={styles.loadingIndicator} 
                                    size="small" 
                                    color="#2196F3" 
                                />
                            )}
                        </View>
                        
                        {predictions.length > 0 && (
                            <View style={styles.predictionsContainer}>
                                {predictions.map((prediction) => (
                                    <TouchableOpacity
                                        key={prediction.place_id}
                                        style={styles.predictionItem}
                                        onPress={() => handleSelectPlace(prediction.place_id, prediction.description)}
                                    >
                                        <Ionicons name="location" size={18} color="#666" />
                                        <Text style={styles.predictionText}>{prediction.description}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.manualButton}
                            onPress={() => setShowManualForm(true)}
                        >
                            <Text style={styles.manualButtonText}>Ingresar manualmente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.formContainer}>
                        {addressText ? (
                            <View style={styles.addressSummary}>
                                <Text style={styles.addressSummaryText}>{addressText}</Text>
                                <TouchableOpacity 
                                    onPress={() => setShowManualForm(false)}
                                    style={styles.editButton}
                                >
                                    <Text style={styles.editButtonText}>Cambiar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        
                        <Text style={styles.formLabel}>Calle <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={direccion.calle}
                            onChangeText={(text) => handleChange('calle', text)}
                            placeholder="Ej. Av. Insurgentes"
                        />

                        <Text style={styles.formLabel}>Número <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={direccion.numero}
                            onChangeText={(text) => handleChange('numero', text)}
                            placeholder="Ej. 123"
                            keyboardType="numeric"
                        />

                        <Text style={styles.formLabel}>Región</Text>
                        <TextInput
                            style={styles.input}
                            value={direccion.region}
                            onChangeText={(text) => handleChange('region', text)}
                            placeholder="Ej. Del Valle"
                        />

                        <Text style={styles.formLabel}>Ciudad <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={direccion.ciudad}
                            onChangeText={(text) => handleChange('ciudad', text)}
                            placeholder="Ej. Ciudad de México"
                        />

                        <Text style={styles.formLabel}>Código Postal</Text>
                        <TextInput
                            style={styles.input}
                            value={direccion.codigoPostal}
                            onChangeText={(text) => handleChange('codigoPostal', text)}
                            placeholder="Ej. 03100"
                            keyboardType="numeric"
                        />

                        <Text style={styles.formLabel}>Referencias</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={direccion.referencias}
                            onChangeText={(text) => handleChange('referencias', text)}
                            placeholder="Ej. Edificio azul, frente a la farmacia"
                            multiline={true}
                            numberOfLines={4}
                        />

                        <TouchableOpacity 
                            style={styles.manualButton}
                            onPress={() => setShowManualForm(false)}
                        >
                            <Text style={styles.manualButtonText}>Usar búsqueda automática</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveAddress}
                >
                    <Text style={styles.saveButtonText}>Guardar dirección</Text>
                </TouchableOpacity>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        <Text style={styles.required}>*</Text> Campos obligatorios
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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
        paddingBottom: 30,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    autocompleteContainer: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        height: 50,
    },
    loadingIndicator: {
        position: 'absolute',
        right: 12,
    },
    predictionsContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    predictionText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    formContainer: {
        marginBottom: 20,
    },
    addressSummary: {
        flexDirection: 'row',
        backgroundColor: '#e8f4fd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressSummaryText: {
        fontSize: 14,
        color: '#2196F3',
        flex: 1,
    },
    editButton: {
        marginLeft: 10,
    },
    editButtonText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 12,
    },
    required: {
        color: 'red',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    manualButton: {
        marginTop: 16,
        alignSelf: 'center',
    },
    manualButtonText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#757575',
    }
});

export default DireccionScreen;