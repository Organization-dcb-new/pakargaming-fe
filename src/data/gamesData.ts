import { GameItem } from "../context/CartContext"

export interface GameDetail extends GameItem {
  description: string
  longDescription: string
  developer: string
  publisher: string
  releaseDate: string
  screenshots: string[]
  systemRequirements: {
    minimum: {
      os: string
      processor: string
      memory: string
      graphics: string
      storage: string
    }
    recommended: {
      os: string
      processor: string
      memory: string
      graphics: string
      storage: string
    }
  }
  features: string[]
  reviews: {
    username: string
    rating: number
    comment: string
    date: string
  }[]
}

export const gamesData: GameDetail[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    price: 59.99,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5fGVufDF8fHx8MTc2NTgwODkyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'RPG',
    rating: 4.5,
    description: 'Petualangan RPG dunia terbuka di Night City yang futuristik',
    longDescription:
      'Cyberpunk 2077 adalah game RPG aksi dunia terbuka yang berlatar di Night City, sebuah megalopolis yang terobsesi dengan kekuasaan, glamor, dan modifikasi tubuh. Anda memerankan V, seorang tentara bayaran yang mencari implan cybernetic unik yang merupakan kunci keabadian. Sesuaikan karakter Anda, gaya bermain, dan jelajahi kota besar yang menakjubkan di mana pilihan Anda membentuk cerita dan dunia di sekitar Anda.',
    developer: 'CD PROJEKT RED',
    publisher: 'CD PROJEKT RED',
    releaseDate: '10 Des 2020',
    screenshots: [
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-3570K or AMD FX-8310',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 970 or AMD Radeon RX 470',
        storage: '70 GB available space',
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i7-4790 or AMD Ryzen 3 3200G',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB or AMD Radeon R9 Fury',
        storage: '70 GB SSD',
      },
    },
    features: [
      'Dunia terbuka yang luas dan detail',
      'Sistem character customization mendalam',
      'Cerita yang immersive dengan multiple endings',
      'Combat system yang dinamis',
      'Ray tracing graphics',
    ],
    reviews: [
      {
        username: 'GamerPro123',
        rating: 5,
        comment: 'Game yang luar biasa! Grafis menakjubkan dan cerita yang engaging.',
        date: '2024-01-15',
      },
      {
        username: 'TechNerd',
        rating: 4,
        comment: 'Gameplay solid, tapi masih ada beberapa bugs kecil.',
        date: '2024-01-10',
      },
    ],
  },
  {
    id: '2',
    title: 'Fantasy Quest',
    price: 49.99,
    discount: 30,
    image:
      'https://images.unsplash.com/photo-1633287453177-24823499b02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGFydHxlbnwxfHx8fDE3NjU3OTEyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Adventure',
    rating: 4.8,
    description: 'Petualangan epik di dunia fantasy yang penuh sihir',
    longDescription:
      'Masuki dunia fantasy yang menakjubkan dengan grafis yang memukau. Bergabunglah dalam quest epik untuk menyelamatkan kerajaan dari kekuatan gelap. Dengan sistem magic yang unik dan combat yang menantang, setiap pertempuran akan menguji kemampuan strategis Anda.',
    developer: 'Epic Studios',
    publisher: 'Fantasy Games Inc',
    releaseDate: '5 Mar 2023',
    screenshots: [
      'https://images.unsplash.com/photo-1633287453177-24823499b02c?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-4460',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 960',
        storage: '50 GB available space',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-6700K',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070',
        storage: '50 GB SSD',
      },
    },
    features: [
      'Magic system yang kompleks',
      'Open world exploration',
      'Co-op multiplayer',
      'Dynamic weather system',
      'Character progression system',
    ],
    reviews: [
      {
        username: 'FantasyFan',
        rating: 5,
        comment: 'Best fantasy RPG saya mainkan tahun ini!',
        date: '2024-02-01',
      },
    ],
  },
  {
    id: '3',
    title: 'Speed Racing',
    price: 39.99,
    discount: 20,
    image:
      'https://images.unsplash.com/photo-1602940819863-2905852243ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBnYW1lfGVufDF8fHx8MTc2NTg2MjQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Racing',
    rating: 4.6,
    description: 'Racing game berkecepatan tinggi dengan grafis realistis',
    longDescription:
      'Rasakan sensasi kecepatan dengan physics engine yang realistis. Berlomba di berbagai trek di seluruh dunia dengan mobil-mobil supercar terbaik. Customisasi mobil Anda dan jadilah yang tercepat!',
    developer: 'Speed Studios',
    publisher: 'Racing Games Ltd',
    releaseDate: '20 Jun 2023',
    screenshots: [
      'https://images.unsplash.com/photo-1602940819863-2905852243ad?w=800',
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-2500K',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 760',
        storage: '40 GB available space',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-4770K',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060',
        storage: '40 GB SSD',
      },
    },
    features: [
      '50+ licensed cars',
      '20+ racing tracks',
      'Online multiplayer',
      'Vehicle customization',
      'Realistic physics',
    ],
    reviews: [
      {
        username: 'RacerX',
        rating: 5,
        comment: 'Physics-nya amazing! Feels like real racing.',
        date: '2024-01-20',
      },
    ],
  },
  {
    id: '4',
    title: 'Battle Royale Pro',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NTgyODUzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Action',
    rating: 4.7,
    description: 'Battle Royale terbaik dengan 100 pemain',
    longDescription:
      'Terjun ke medan perang dengan 100 pemain lainnya. Bertahan hidup, cari senjata, dan jadilah yang terakhir berdiri. Dengan map yang luas dan senjata yang beragam.',
    developer: 'Battle Games',
    publisher: 'Action Publishers',
    releaseDate: '15 Jan 2023',
    screenshots: [
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-6600K',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1050 Ti',
        storage: '30 GB available space',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700K',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1660',
        storage: '30 GB SSD',
      },
    },
    features: [
      '100 player battles',
      'Large open map',
      'Squad mode',
      'Regular updates',
      'Cross-platform play',
    ],
    reviews: [
      {
        username: 'ProGamer',
        rating: 5,
        comment: 'Addictive gameplay! Best BR game.',
        date: '2024-02-05',
      },
    ],
  },
  {
    id: '5',
    title: 'Space Explorer',
    price: 44.99,
    discount: 15,
    image:
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwY3xlbnwxfHx8fDE3NjU4MjQ3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Strategy',
    rating: 4.4,
    description: 'Strategi luar angkasa dengan eksplorasi tak terbatas',
    longDescription:
      'Jelajahi galaksi yang luas, bangun koloni, dan pimpin armada Anda menuju kemenangan. Game strategi turn-based dengan kedalaman gameplay yang luar biasa.',
    developer: 'Stellar Games',
    publisher: 'Space Interactive',
    releaseDate: '1 Apr 2023',
    screenshots: [
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-4590',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 970',
        storage: '35 GB available space',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-7700',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070',
        storage: '35 GB SSD',
      },
    },
    features: [
      'Procedural generation',
      'Deep strategy gameplay',
      'Colony management',
      'Fleet battles',
      'Modding support',
    ],
    reviews: [
      {
        username: 'StrategyKing',
        rating: 4,
        comment: 'Complex but rewarding strategy game.',
        date: '2024-01-25',
      },
    ],
  },
  {
    id: '6',
    title: 'Medieval Wars',
    price: 54.99,
    discount: 40,
    image:
      'https://images.unsplash.com/photo-1633287453177-24823499b02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGFydHxlbnwxfHx8fDE3NjU3OTEyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Strategy',
    rating: 4.9,
    description: 'Strategi perang abad pertengahan yang epik',
    longDescription:
      'Bangun kerajaan Anda, rekrut pasukan, dan taklukkan musuh-musuh Anda. Game strategi real-time dengan kampanye yang mendalam dan multiplayer kompetitif.',
    developer: 'Medieval Studios',
    publisher: 'War Games Co',
    releaseDate: '10 Nov 2022',
    screenshots: [
      'https://images.unsplash.com/photo-1633287453177-24823499b02c?w=800',
      'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800',
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800',
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-3470',
        memory: '6 GB RAM',
        graphics: 'NVIDIA GeForce GTX 660',
        storage: '25 GB available space',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-6700',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060',
        storage: '25 GB SSD',
      },
    },
    features: [
      'Epic siege battles',
      'Castle building',
      'Historical campaigns',
      'Multiplayer modes',
      'Unit customization',
    ],
    reviews: [
      {
        username: 'HistoryBuff',
        rating: 5,
        comment: 'Historically accurate and fun!',
        date: '2024-02-10',
      },
    ],
  },
]

export function getGameById(id: string): GameDetail | undefined {
  return gamesData.find((game) => game.id === id)
}
