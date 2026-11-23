
import { Injectable } from '@angular/core';
import { Oferta } from '../Models/oferta';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  ejemplos: Oferta[] = [
    {
      id: 1,
      titulo: 'Asistente Administrativo',
      empresa: 'Grupo La Preferida',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,800 - 2,500',
      categoria: 'Administración',
      descripcion: 'Apoyo en tareas administrativas y organización de documentos.',
      requisitos: 'Conocimientos básicos de computación y organización.'
    },
    {
      id: 2,
      titulo: 'Cajero(a)',
      empresa: 'Tienda Retail',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,200 - 1,600',
      categoria: 'Atención al cliente',
      descripcion: 'Atención a clientes y registro de ventas.',
      requisitos: 'Buena comunicación y responsabilidad.'
    },
    {
      id: 3,
      titulo: 'Auxiliar de Almacén',
      empresa: 'Distribuidora Andina',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,300 - 1,700',
      categoria: 'Logística',
      descripcion: 'Apoyo en la recepción y organización de productos.',
      requisitos: 'Responsabilidad y capacidad para trabajar en equipo.'
    },
    {
      id: 4,
      titulo: 'Atención al Cliente',
      empresa: 'Comercial Central',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,200 - 1,500',
      categoria: 'Atención al cliente',
      descripcion: 'Orientar a los clientes y resolver consultas sobre productos.',
      requisitos: 'Buena comunicación y trato amable.'
    },
    {
      id: 5,
      titulo: 'Ayudante de Cocina',
      empresa: 'Restaurante El Buen Sabor',
      ubicacion: 'Concepción',
      modalidad: 'Medio tiempo',
      sueldo: 'S/ 650 - 850',
      categoria: 'Gastronomía',
      descripcion: 'Apoyo en la preparación de alimentos y limpieza del área de cocina.',
      requisitos: 'Responsabilidad, puntualidad y disposición para aprender.'
    },
    {
      id: 6,
      titulo: 'Asistente de Ventas',
      empresa: 'Comercial San José',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,200 - 1,600',
      categoria: 'Ventas',
      descripcion: 'Atención al público, organización de productos y apoyo en ventas.',
      requisitos: 'Buena comunicación y conocimientos básicos de ventas.'
    },
    {
      id: 7,
      titulo: 'Personal de Limpieza',
      empresa: 'Servicios Integrales',
      ubicacion: 'Concepción',
      modalidad: 'Medio tiempo',
      sueldo: 'S/ 600 - 800',
      categoria: 'Servicios',
      descripcion: 'Limpieza y mantenimiento de ambientes de trabajo.',
      requisitos: 'Responsabilidad, puntualidad y orden.'
    },
    {
      id: 8,
      titulo: 'Soporte Técnico',
      empresa: 'Soluciones Informáticas',
      ubicacion: 'Concepción',
      modalidad: 'Tiempo completo',
      sueldo: 'S/ 1,500 - 2,000',
      categoria: 'Tecnología',
      descripcion: 'Apoyo en mantenimiento de computadoras y solución de problemas técnicos.',
      requisitos: 'Conocimientos básicos de hardware, software y redes.'
    },
    {
      id: 9,
      titulo: 'Repartidor',
      empresa: 'Distribuciones Express',
      ubicacion: 'Concepción',
      modalidad: 'Medio tiempo',
      sueldo: 'S/ 700 - 1,000',
      categoria: 'Logística',
      descripcion: 'Entrega de productos y apoyo en distribución local.',
      requisitos: 'Responsabilidad, puntualidad y conocimiento de rutas locales.'
    }
  ];

  ofertas: Oferta[] = this.cargar();

  cargar(): Oferta[] {
    try {
      const datos = localStorage.getItem('empleo_ofertas');
      return datos ? JSON.parse(datos) as Oferta[] : [...this.ejemplos];
    } catch {
      return [...this.ejemplos];
    }
  }

  guardarDatos() {
    localStorage.setItem('empleo_ofertas', JSON.stringify(this.ofertas));
  }

  agregar(oferta: Oferta) {
    oferta.id = this.ofertas.length ? Math.max(...this.ofertas.map(o => o.id)) + 1 : 1;
    this.ofertas.unshift(oferta);
    this.guardarDatos();
  }

  editar(oferta: Oferta) {
    const indice = this.ofertas.findIndex(o => o.id === oferta.id);
    if (indice >= 0) {
      this.ofertas[indice] = oferta;
      this.guardarDatos();
    }
  }

  eliminar(id: number) {
    this.ofertas = this.ofertas.filter(o => o.id !== id);
    this.guardarDatos();
  }

  mostrar(): Oferta[] {
    return this.ofertas;
  }

  buscar(texto: string): Oferta[] {
    return this.ofertas.filter(oferta =>
      oferta.titulo.toLowerCase().includes(texto.toLowerCase())
    );
  }

  obtenerPorId(id: number): Oferta | undefined {
    return this.ofertas.find(oferta => oferta.id === id);
  }

}
