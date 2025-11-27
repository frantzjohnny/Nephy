import { MenuItem, RestaurantSettings } from './types';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "Bistro Jacmel",
  whatsappNumber: "50937000000",
  welcomeMessage: "Bienvenue! Découvrez nos saveurs locales.",
  deliveryFee: 150,
  logo: "" // Logo opcional
};

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Soup Joumou',
    description: 'Soupe traditionnelle haïtienne au giraumon.',
    ingredients: ['Giraumon', 'Bœuf', 'Pommes de terre', 'Carottes', 'Navet', 'Macaroni', 'Céleri'],
    price: 350,
    category: 'Entrées',
    available: true,
    featured: true,
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: 'Akra',
    description: 'Beignets de malanga croustillants servis avec du pikliz.',
    ingredients: ['Malanga râpé', 'Épices', 'Piment', 'Farine', 'Pikliz (Chou, Carotte, Vinaigre)'],
    price: 150,
    category: 'Entrées',
    available: true,
    featured: false,
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: 'Griot de Porc',
    description: 'Morceaux de porc marinés et frits, plat national.',
    ingredients: ['Épaule de porc', 'Orange amère', 'Piment Scotch Bonnet', 'Ail', 'Thym', 'Clous de girofle'],
    price: 750,
    category: 'Plats Principaux',
    available: true,
    featured: true,
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: 'Poisson Gros Sel',
    description: 'Vivaneau frais cuit à la vapeur.',
    ingredients: ['Vivaneau entier', 'Gros sel', 'Poivrons', 'Oignons', 'Citron vert', 'Huile d\'olive'],
    price: 1200,
    category: 'Plats Principaux',
    available: true,
    featured: true,
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: '5',
    name: 'Douce Macos',
    description: 'Fudge traditionnel de Petit-Goâve.',
    ingredients: ['Lait', 'Sucre', 'Cannelle', 'Vanille', 'Chocolat', 'Colorants naturels'],
    price: 200,
    category: 'Desserts',
    available: true,
    featured: false,
    image: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: '6',
    name: 'Jus de Corossol',
    description: 'Jus frais naturel et onctueux.',
    ingredients: ['Corossol frais', 'Lait évaporé', 'Sucre de canne', 'Muscade', 'Zeste de citron vert'],
    price: 150,
    category: 'Boissons',
    available: true,
    featured: false,
    image: 'https://picsum.photos/400/300?random=6'
  },
  {
    id: '7',
    name: 'Prestige',
    description: 'Bière nationale bien glacée.',
    ingredients: ['Malt', 'Houblon', 'Eau', 'Levure'],
    price: 125,
    category: 'Boissons',
    available: true,
    featured: false,
    image: 'https://picsum.photos/400/300?random=7'
  }
];