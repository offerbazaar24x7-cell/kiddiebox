
import { MOCK_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { Product, User, Enrollment, UserRole, AppConfig, ChatMessage } from '../types';

// Keys for LocalStorage
const KEYS = {
  USERS: 'kb_users',
  PRODUCTS: 'kb_products',
  ENROLLMENTS: 'kb_enrollments',
  CURRENT_USER: 'kb_current_user',
  CONFIG: 'kb_app_config',
  CATEGORIES: 'kb_categories',
  CHAT: 'kb_chat_messages'
};

// Initialize DB if empty
export const initDB = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  
  if (!localStorage.getItem(KEYS.USERS)) {
    // Seed requested users
    const initialUsers: User[] = [
      { 
        id: 'admin1', 
        name: 'Super Admin', 
        email: 'admin@login', 
        password: 'Admin@9235',
        role: UserRole.ADMIN,
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=000&color=fff'
      },
      { 
        id: 'tutor1', 
        name: 'Pro Tutor', 
        email: 'tutor@login', 
        password: 'Admin@9235',
        role: UserRole.TUTOR,
        avatar: 'https://ui-avatars.com/api/?name=Pro+Tutor&background=7C3AED&color=fff'
      },
      { 
        id: 'partner1', 
        name: 'Affiliate Partner', 
        email: 'partner@login', 
        password: 'Admin@9235',
        role: UserRole.PARTNER,
        avatar: 'https://ui-avatars.com/api/?name=Affiliate+Partner&background=059669&color=fff'
      },
      { 
        id: 'user1', 
        name: 'Sample User', 
        email: 'user1', 
        password: '321321',
        role: UserRole.STUDENT,
        avatar: 'https://ui-avatars.com/api/?name=Sample+User&background=2563EB&color=fff'
      }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }

  if (!localStorage.getItem(KEYS.CONFIG)) {
    const defaultConfig: AppConfig = {
      payment: { enabled: false, provider: 'Manual', apiKey: '', secretKey: '' },
      shipping: { enabled: false, provider: 'Manual', email: '', password: '' }
    };
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(defaultConfig));
  }
};

// --- Category Operations ---
export const getStoredCategories = (): string[] => {
  const data = localStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
};

export const addCategory = (category: string) => {
  const cats = getStoredCategories();
  if (!cats.includes(category)) {
    cats.push(category);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
  }
};

// --- Product Operations ---
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

// --- User Operations ---
export const getUsers = (): User[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export const registerUser = (name: string, email: string, password?: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    password: password || '123456',
    role: UserRole.STUDENT,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const deleteUser = (id: string) => {
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

// --- Enrollment Operations ---
export const enrollUser = (userId: string, productIds: string[], totalPaid: number) => {
  const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(KEYS.ENROLLMENTS) || '[]');
  const now = new Date().toISOString();
  
  productIds.forEach(pid => {
    enrollments.push({
      id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      productId: pid,
      purchaseDate: now,
      pricePaid: totalPaid / productIds.length // simplified split
    });
  });
  
  localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(enrollments));
};

export const getUserEnrollments = (userId: string): Enrollment[] => {
  const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(KEYS.ENROLLMENTS) || '[]');
  return enrollments.filter(e => e.userId === userId);
};

// --- Chat Operations ---
export const getChatMessages = (): ChatMessage[] => {
  const data = localStorage.getItem(KEYS.CHAT);
  return data ? JSON.parse(data) : [];
};

export const sendChatMessage = (msg: ChatMessage) => {
  const msgs = getChatMessages();
  msgs.push(msg);
  localStorage.setItem(KEYS.CHAT, JSON.stringify(msgs));
};

// --- Session ---
export const getSession = (): User | null => {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setSession = (user: User) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

// --- Config Operations ---
export const getAppConfig = (): AppConfig => {
  const data = localStorage.getItem(KEYS.CONFIG);
  return data ? JSON.parse(data) : {
      payment: { enabled: false, provider: 'Manual', apiKey: '', secretKey: '' },
      shipping: { enabled: false, provider: 'Manual', email: '', password: '' }
  };
};

export const saveAppConfig = (config: AppConfig) => {
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
};
