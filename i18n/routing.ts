import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['id', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'id',

  localePrefix: 'as-needed',
  alternateLinks: true,
    pathnames: {
    '/about': {
      en: '/about-us',
      id: '/tentang-kami'
    },
    '/catalog': {
      en: '/catalogues',
      id: '/katalog'
    },
    '/contact': {
      en: '/contact',
      id: '/kontak'
    },
    '/comparison': {
      en: '/comparison',
      id: '/komparasi'
    },
    '/distributors': {
      en: '/distributors',
      id: '/distributor'
    },

    '/news': {
      en: '/news',
      id: '/berita'
    },
    '/news/[subdynamicroute]': {
      en: '/news/[subdynamicroute]',
      id: '/berita/[subdynamicroute]'
    },
    '/berita/[subdynamicroute]': {
      en: '/news/[subdynamicroute]',
      id: '/berita/[subdynamicroute]'
    },

    // '/products': {
    //   en: '/',
    //   id: '/'
    // },
    // '/produk': {
    //   en: '/',
    //   id: '/'
    // },
'/products/[subdynamicroute]': {
  en: '/products/[subdynamicroute]',
  id: '/produk/[subdynamicroute]',
},
    
    '/drivers': {
      en: '/drivers',
      id: '/driver'
    },
    '/drivers/[subdynamicroute]': {
      en: '/drivers/[subdynamicroute]',
      id: '/driver/[subdynamicroute]'
    },
    '/drivers/[subdynamicroute]/[subsubdynamicroute]': {
      en: '/drivers/[subdynamicroute]/[subsubdynamicroute]',
      id: '/driver/[subdynamicroute]/[subsubdynamicroute]'
    },
    '/drivers/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]': {
      en: '/drivers/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]',
      id: '/driver/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]'
    },

    '/spareparts': {
      en: '/spareparts',
      id: '/sparepart'
    },
    '/spareparts/[subdynamicroute]': {
      en: '/spareparts/[subdynamicroute]',
      id: '/sparepart/[subdynamicroute]'
    },
    '/spareparts/[subdynamicroute]/[subsubdynamicroute]': {
      en: '/spareparts/[subdynamicroute]/[subsubdynamicroute]',
      id: '/sparepart/[subdynamicroute]/[subsubdynamicroute]'
    },
    '/spareparts/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]': {
      en: '/spareparts/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]',
      id: '/sparepart/[subdynamicroute]/[subsubdynamicroute]/[subsubsubdynamicroute]'
    },
  }
});