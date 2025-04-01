import { useState, useEffect } from 'react';
import { Evento } from '../types/Evento';
import { initDatabase, insertEvento, obtenerEventos, eliminarEvento } from '../utils/database';

export const useEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEventos = () => {
      try {
        initDatabase();
        const eventosGuardados = obtenerEventos();
        setEventos(eventosGuardados);
      } catch (error) {
        console.error('Error cargando eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, []);

  const agregarEvento = (evento: Omit<Evento, 'id'>) => {
    try {
      const id = insertEvento(evento);
      const nuevoEvento = { ...evento, id };
      setEventos(prevEventos => [nuevoEvento, ...prevEventos]);
    } catch (error) {
      console.error('Error agregando evento:', error);
    }
  };

  const borrarEvento = (id: number) => {
    try {
      eliminarEvento(id);
      setEventos(prevEventos => prevEventos.filter(evento => evento.id !== id));
    } catch (error) {
      console.error('Error eliminando evento:', error);
    }
  };

  return { eventos, loading, agregarEvento, borrarEvento };
};