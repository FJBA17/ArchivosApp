import * as SQLite from 'expo-sqlite';
import { Evento } from '../types/Evento';

const db = SQLite.openDatabaseSync('eventos.db');

export const initDatabase = () => {
  try {
    db.execSync(
      'CREATE TABLE IF NOT EXISTS eventos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descripcion TEXT, archivos TEXT, fechaCreacion TEXT)'
    );
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
};

export const insertEvento = (evento: Omit<Evento, 'id'>): number => {
  try {
    const result = db.runSync(
      'INSERT INTO eventos (titulo, descripcion, archivos, fechaCreacion) VALUES (?, ?, ?, ?)',
      [
        evento.titulo, 
        evento.descripcion, 
        JSON.stringify(evento.archivos), 
        evento.fechaCreacion
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error insertando evento:', error);
    throw error;
  }
};

export const obtenerEventos = (): Evento[] => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM eventos ORDER BY fechaCreacion DESC'
    );
    
    return result.map(item => ({
      ...item,
      archivos: JSON.parse(item.archivos)
    }));
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return [];
  }
};

export const eliminarEvento = (id: number) => {
  try {
    db.runSync('DELETE FROM eventos WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error eliminando evento:', error);
    throw error;
  }
};