
import React, { useState, useEffect, useRef } from 'react';
import { User, Product, CartItem, UserRole, ProductType, AppConfig, ChatMessage } from './types';
import { initDB, getProducts, getSession, setSession, clearSession, registerUser, enrollUser, getUserEnrollments, saveProduct, deleteProduct, getUsers, deleteUser, saveUser, getAppConfig, saveAppConfig, getStoredCategories, addCategory, getChatMessages, sendChatMessage } from './services/storageService';
import { getAIRecommendations } from './services/geminiService';
import { APP_NAME } from './constants';
import { 
  ShoppingCart, Search, User as UserIcon, LogOut, Menu, X, 
  Sparkles, Star, BookOpen, Trash2, Plus, Edit, Lock, ArrowRight,
  CheckCircle, Play, ChevronDown, ChevronUp, Upload, Youtube, FileText,
  Facebook, Twitter, Instagram, Mail, Shield, AlertCircle, ExternalLink,
  Settings, CreditCard, Truck, Link as LinkIcon, Box, LayoutDashboard,
  Users, MessageCircle, DollarSign, Briefcase, GraduationCap, Send, Loader2
} from 'lucide-react';

// --- Helper Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg transform transition-all animate-bounce-in z-[80] flex items-center gap-2`}>
      {type === 'success' && <CheckCircle size={20} />}
      {message}
    </div>
  );
};

// --- Main App ---

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin' | 'tutor' | 'partner'>('home');
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  
  // UI State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSyllabusExpanded, setIsSyllabusExpanded] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<{msg: string, ids: string[]} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Admin State
  const [adminActiveTab, setAdminActiveTab] = useState<'products' | 'settings' | 'users'>('products');
  const [adminEditingProduct, setAdminEditingProduct] = useState<(Omit<Partial<Product>, 'syllabus'> & { syllabus?: string | string[] }) | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({
      payment: { enabled: false, provider: 'Manual', apiKey: '', secretKey: '' },
      shipping: { enabled: false, provider: 'Manual', email: '', password: '' }
  });

  // --- Initialization ---
  useEffect(() => {
    initDB();
    setProducts(getProducts());
    setCategories(getStoredCategories());
    setAppConfig(getAppConfig());
    setAllUsers(getUsers());
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      loadViewForRole(session.role);
    }
  }, []);

  // Poll for new messages (Simplified simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChatOpen || currentView === 'tutor') {
        setChatMessages(getChatMessages());
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isChatOpen, currentView]);

  const loadViewForRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: setCurrentView('admin'); break;
      case UserRole.TUTOR: setCurrentView('tutor'); break;
      case UserRole.PARTNER: setCurrentView('partner'); break;
      default: setCurrentView('home'); break;
    }
  }

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ msg, type });
  };

  // --- Handlers ---

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const users = getUsers();
    
    if (authMode === 'login') {
      const foundUser = users.find(u => u.email === email && (u.password === password));
      
      if (foundUser) {
        setCurrentUser(foundUser);
        setSession(foundUser);
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${foundUser.name}!`, 'success');
        loadViewForRole(foundUser.role);
      } else {
        showToast('Invalid email or password.', 'error');
      }
    } else {
      // Signup
      const name = formData.get('name') as string;
      if (users.find(u => u.email === email)) {
        showToast('Email already exists.', 'error');
        return;
      }
      const newUser = registerUser(name, email, password);
      setCurrentUser(newUser);
      set