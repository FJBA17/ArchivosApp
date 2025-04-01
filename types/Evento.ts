export interface Archivo {
    uri: string;
    type: 'image' | 'pdf' | 'audio';
    nombre: string;
  }
  
  export interface Evento {
    id?: number;
    titulo: string;
    descripcion: string;
    archivos: Archivo[];
    fechaCreacion: string;
  }