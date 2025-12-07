import type { LanguageCode } from './languages';

export const translations = {
  es: {
    site: {
      name: 'Manantial de Vida',
      description: 'Un lugar de restauración para tu vida',
    },
    nav: {
      home: 'Inicio',
      about: 'Nosotros',
      activities: 'Actividades',
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
    activities: {
      title: 'Nuestras Actividades',
      description: 'Información sobre nuestras actividades',
      subtitle: 'Únete a nosotros en nuestras actividades semanales',
      time: 'Horario',
      items: [
        { 
          title: 'Reunión de Oración y Discipulado',
          description: 'Grupos pequeños donde estudiamos la Biblia en profundidad, compartimos nuestras experiencias y nos apoyamos mutuamente en nuestro caminar con Cristo.',
          time: 'Miércoles 7:30 PM',
        },
        {
          title: 'Pre-adolescentes',
          description: '',
          time: 'Sábados 4:00 PM',
        },
        {
          title: 'Adolescentes',
          description: '',
          time: 'Sábados 4:30 PM',
        },
        {
          title: 'Jóvenes',
          description: '',
          time: 'Sábados 8:00 PM',
        },
        {
          title: 'Iglesia de Niños',
          description: '',
          time: 'Domingos 10:30 AM',
        },
        {
          title: 'Reunión General',
          description: '',
          time: 'Domingos 10:30 AM',
        },
      ],
      upcoming: {
        title: 'Próximos Eventos',
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
            value: 'Av. Nestor Kirchner 1836, Berazategui, Buenos Aires, Argentina',
            type: 'text',
          },
          {
            label: 'Teléfono',
            value: '+54 9 1169512565',
            type: 'text',
          },
        ],
      },
      hours: {
        title: 'Horarios de Atención',
        items: [
          { day: 'Lunes - Viernes', time: 'Consultar' },
          { day: 'Sábado', time: 'Consultar' },
          { day: 'Domingo', time: 'Consultar' },
        ],
      },
      message: {
        title: 'Síguenos en Redes Sociales',
        content: 'Mantente conectado con nosotros a través de nuestras redes sociales para recibir actualizaciones, devocionales y contenido inspiracional.',
      },
      social: [
        {
          name: 'Facebook',
          url: 'https://www.facebook.com/ccmdvoficial/',
          icon: '📘',
        },
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/ccmdvoficial/',
          icon: '📷',
        },
        {
          name: 'YouTube',
          url: 'https://www.youtube.com/@CCMDVOficial',
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
  //     activities: 'Activities',
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

