import type { LanguageCode } from './languages';

export const translations = {
  es: {
    site: {
      name: 'Manantial de Vida',
      description: 'Iglesia Manantial de Vida',
    },
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      services: 'Servicios',
      contact: 'Contacto',
      live: 'En Vivo',
    },
    common: {
      welcome: 'Bienvenido',
      learnMore: 'Aprende más',
    },
    live: {
      title: 'Transmisión en Vivo',
      noLive: 'No hay transmisión en vivo en este momento',
      recentVideos: 'Videos Recientes',
      watchOnYoutube: 'Ver en YouTube',
      liveNow: 'En Vivo Ahora',
      viewCount: 'vistas',
      published: 'Publicado',
    },
    about: {
      title: 'Acerca de Nosotros',
      description: 'Conoce más sobre nuestra iglesia y nuestra misión',
      subtitle: 'Somos una comunidad de fe comprometida con servir a Dios y a nuestra comunidad.',
      mission: {
        title: 'Nuestra Misión',
        content: 'Nuestra misión es compartir el amor de Jesucristo con todos, creando un ambiente donde las personas puedan experimentar la transformación espiritual y el crecimiento en su relación con Dios. Buscamos ser un faro de esperanza y un lugar de refugio para todos aquellos que buscan conocer más sobre el evangelio.',
      },
      vision: {
        title: 'Nuestra Visión',
        content: 'Ser una iglesia que impacta positivamente nuestra comunidad, llevando el mensaje del evangelio a través de nuestras acciones y palabras. Anhelamos ser una familia unida en Cristo, donde cada persona encuentre su propósito y pueda desarrollar sus dones para servir a otros.',
      },
      values: {
        title: 'Nuestros Valores',
        items: [
          'Amor incondicional y aceptación',
          'Integridad y transparencia',
          'Servicio a la comunidad',
          'Crecimiento espiritual continuo',
          'Unidad en la diversidad',
          'Compromiso con la Palabra de Dios',
        ],
      },
      join: {
        title: 'Únete a Nosotros',
        content: 'Te invitamos a ser parte de nuestra familia. Ya sea que estés buscando respuestas, creciendo en tu fe, o buscando una comunidad donde servir, hay un lugar para ti aquí.',
        button: 'Contáctanos',
      },
    },
    services: {
      title: 'Nuestros Servicios',
      description: 'Información sobre nuestros servicios y actividades',
      subtitle: 'Únete a nosotros en nuestros servicios y actividades semanales',
      time: 'Horario',
      items: [
        {
          title: 'Servicio Dominical',
          description: 'Nuestro servicio principal de adoración donde nos reunimos para alabar, adorar y escuchar la Palabra de Dios. Un tiempo de comunión y crecimiento espiritual para toda la familia.',
          time: 'Domingos 10:00 AM',
        },
        {
          title: 'Estudio Bíblico',
          description: 'Grupos pequeños donde estudiamos la Biblia en profundidad, compartimos nuestras experiencias y nos apoyamos mutuamente en nuestro caminar con Cristo.',
          time: 'Miércoles 7:00 PM',
        },
        {
          title: 'Escuela Dominical',
          description: 'Clases bíblicas para todas las edades. Desde niños hasta adultos, cada uno puede aprender y crecer en su conocimiento de las Escrituras de manera apropiada para su edad.',
          time: 'Domingos 9:00 AM',
        },
        {
          title: 'Grupos de Oración',
          description: 'Tiempos dedicados a la oración intercesora, donde oramos por nuestras necesidades, nuestra comunidad y el mundo. Un espacio para buscar la presencia de Dios.',
          time: 'Viernes 7:00 PM',
        },
      ],
      special: {
        title: 'Eventos Especiales',
        content: 'Además de nuestros servicios regulares, organizamos eventos especiales, conferencias y actividades comunitarias durante el año. ¡Mantente al tanto de nuestras próximas actividades!',
        button: 'Más Información',
      },
    },
    contact: {
      title: 'Contáctanos',
      description: 'Ponte en contacto con nosotros',
      subtitle: 'Estamos aquí para servirte. No dudes en contactarnos si tienes preguntas o necesitas más información.',
      info: {
        title: 'Información de Contacto',
        items: [
          {
            label: 'Dirección',
            value: 'Tu dirección aquí',
            type: 'text',
          },
          {
            label: 'Teléfono',
            value: 'Teléfono aquí',
            type: 'text',
          },
          {
            label: 'Email',
            value: 'email@ejemplo.com',
            type: 'link',
            display: 'email@ejemplo.com',
          },
        ],
      },
      hours: {
        title: 'Horarios de Atención',
        items: [
          { day: 'Lunes - Viernes', time: '9:00 AM - 5:00 PM' },
          { day: 'Sábado', time: '9:00 AM - 12:00 PM' },
          { day: 'Domingo', time: 'Cerrado' },
        ],
      },
      message: {
        title: 'Síguenos en Redes Sociales',
        content: 'Mantente conectado con nosotros a través de nuestras redes sociales para recibir actualizaciones, devocionales y contenido inspiracional.',
      },
      social: [
        {
          name: 'Facebook',
          url: '#',
          icon: '📘',
        },
        {
          name: 'Instagram',
          url: '#',
          icon: '📷',
        },
        {
          name: 'YouTube',
          url: '#',
          icon: '▶️',
        },
      ],
    },
  },
  // Easy to add more languages:
  // en: {
  //   site: {
  //     name: 'Manantial de Vida',
  //     description: 'Manantial de Vida Church',
  //   },
  //   nav: {
  //     home: 'Home',
  //     about: 'About',
  //     services: 'Services',
  //     contact: 'Contact',
  //   },
  //   common: {
  //     welcome: 'Welcome',
  //     learnMore: 'Learn more',
  //   },
  // },
} as const;

export type Translations = typeof translations[LanguageCode];

export function getTranslations(lang: LanguageCode): Translations {
  return translations[lang];
}

