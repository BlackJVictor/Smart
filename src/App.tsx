import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Smartphone,
  ShoppingCart,
  Wrench,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  X,
  Send,
  Cpu,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  KeyRound,
  LogOut,
  Package,
  PlusCircle,
  MinusCircle,
  History,
  AlertTriangle,
  Mail,
  RefreshCw,
  Eye,
  Check,
  ChevronRight,
  CreditCard,
  QrCode,
  Banknote,
  Search,
  Layers,
  Phone,
  UserCheck,
  UserPlus,
  Camera,
  Video,
  VideoOff,
  ScanLine,
  Accessibility,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Sliders,
  Type,
  SunMedium,
  CheckCircle,
  Radio,
  Maximize2,
} from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tag: string;
  stock: number;
  minStock: number;
  description?: string;
  sku: string;
}

export interface StockMovement {
  id: string;
  productId: number;
  productName: string;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  responsible: string;
  timestamp: string;
  capturedByCamera?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'PEL-3D-CER',
    name: 'Película de Vidro 3D Cerâmica & Privacidade',
    category: 'Proteção de Tela',
    price: 39.9,
    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    tag: 'Mais Vendido',
    stock: 24,
    minStock: 5,
    description: 'Película ultra flexível de alta resistência contra quedas e arranhões.',
  },
  {
    id: 2,
    sku: 'CAB-TPC-60W',
    name: 'Cabo USB-C Turbo Power 60W Ultra Resistente',
    category: 'Cabos & Conexões',
    price: 49.9,
    image:
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    tag: 'Nylon Trançado',
    stock: 18,
    minStock: 4,
    description: 'Cabo reforçado com blindagem dupla compatível com carregamento rápido.',
  },
  {
    id: 3,
    sku: 'CAR-USB-20W',
    name: 'Carregador Rápido 20W USB-C Homologado Anatel',
    category: 'Energia & Bateria',
    price: 89.9,
    image:
      'https://images.unsplash.com/photo-1622445262464-84b14e0745b1?w=600&auto=format&fit=crop&q=80',
    tag: 'Carga Ultra Rápida',
    stock: 12,
    minStock: 3,
    description: 'Fonte turbo bivolt inteligente com corte de sobrecarga.',
  },
  {
    id: 4,
    sku: 'CAP-MAG-MIL',
    name: 'Capa Anti-Impacto com Proteção Militar & MagSafe',
    category: 'Capinhas Premium',
    price: 59.9,
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    tag: 'Bordas Reforçadas',
    stock: 9,
    minStock: 4,
    description: 'Bordas com bolsas de ar air-cushion e anel magnético integrado.',
  },
  {
    id: 5,
    sku: 'BAT-IPH-11',
    name: 'Bateria de Reposição Premium iPhone (Garantia 6 Meses)',
    category: 'Peças de Manutenção',
    price: 180.0,
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    tag: 'Uso Técnico',
    stock: 7,
    minStock: 2,
    description: 'Célula de íon-lítio classe A+ com chip controlador de saúde de bateria.',
  },
  {
    id: 6,
    sku: 'CON-TYPC-MOT',
    name: 'Sub-placa Conector de Carga com Microfone Integrado',
    category: 'Peças de Manutenção',
    price: 45.0,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    tag: 'Peça Original',
    stock: 15,
    minStock: 3,
    description: 'Circuito impresso flexível para substituição rápida em bancada.',
  },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'MOV-1001',
    productId: 1,
    productName: 'Película de Vidro 3D Cerâmica & Privacidade',
    type: 'ENTRADA',
    quantity: 10,
    previousStock: 14,
    newStock: 24,
    reason: 'Chegada de fornecedor (conferência câmera #01)',
    responsible: 'admin',
    timestamp: 'Ontem às 16:30',
    capturedByCamera: true,
  },
  {
    id: 'MOV-1002',
    productId: 5,
    productName: 'Bateria de Reposição Premium iPhone',
    type: 'SAIDA',
    quantity: 1,
    previousStock: 8,
    newStock: 7,
    reason: 'Utilizado em bancada - Orçamento OS #4812',
    responsible: 'admin',
    timestamp: 'Hoje às 10:15',
    capturedByCamera: false,
  },
];

export default function App() {
  // Estado de Produtos e Estoque
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);

  // Navegação Principal: 'loja' | 'admin'
  const [currentView, setCurrentView] = useState<'loja' | 'admin'>('loja');

  // Autenticação Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Esqueci a Senha Admin
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('1234');
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'token' | 'done'>('email');
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  // Autenticação e Cadastro do Cliente (Para Efetuar Compras)
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerUser[]>([
    {
      name: 'Cliente Exemplo',
      email: 'cliente@exemplo.com',
      phone: '(11) 99876-5432',
      password: '123',
    },
  ]);
  const [loggedCustomer, setLoggedCustomer] = useState<CustomerUser | null>(null);
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState<'cadastro' | 'login'>('cadastro');

  // Campos do formulário de Cadastro do Cliente
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Campos do formulário de Login do Cliente
  const [custLoginEmail, setCustLoginEmail] = useState('');
  const [custLoginPassword, setCustLoginPassword] = useState('');

  // Carrinho do Cliente
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Modo Compra Fácil / Checkout do Cliente
  const [isBeginnerCheckoutOpen, setIsBeginnerCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'balcao' | 'entrega'>('balcao');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  // Formulário de Orçamento Rápido
  const [phoneModel, setPhoneModel] = useState('');
  const [issue, setIssue] = useState('');
  const [customerQuoteName, setCustomerQuoteName] = useState('');
  const [customerQuotePhone, setCustomerQuotePhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastQuote, setLastQuote] = useState<{
    model: string;
    issue: string;
    name?: string;
  } | null>(null);

  // Estado do Painel de Movimentação do Admin
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [movementType, setMovementType] = useState<'ENTRADA' | 'SAIDA' | 'AJUSTE'>('ENTRADA');
  const [movementQty, setMovementQty] = useState<number>(1);
  const [movementReason, setMovementReason] = useState<string>('Recebimento de mercadoria');
  const [movementFeedback, setMovementFeedback] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'camera_online' | 'movimentacao' | 'catalogo' | 'historico'>('camera_online');

  // Adicionar Novo Produto no Estoque (Admin)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Proteção de Tela');
  const [newProdPrice, setNewProdPrice] = useState('29.90');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdSku, setNewProdSku] = useState('');

  // Busca na vitrine
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // ==========================================
  // ESTADOS DE ACESSIBILIDADE
  // ==========================================
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'grande' | 'extra'>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAccessibleFont, setIsAccessibleFont] = useState(false);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [readAloudActive, setReadAloudActive] = useState(false);

  // ==========================================
  // ESTADOS DA CÂMERA DE MONITORAMENTO DE ESTOQUE (ADMIN)
  // ==========================================
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraScanTarget, setCameraScanTarget] = useState<number>(1);
  const [cameraMotionType, setCameraMotionType] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [cameraQuantity, setCameraQuantity] = useState<number>(1);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(true);
  const [lastCameraDetection, setLastCameraDetection] = useState<{
    time: string;
    sku: string;
    name: string;
    type: 'ENTRADA' | 'SAIDA';
    qty: number;
  } | null>(null);
  const [flashDetected, setFlashDetected] = useState(false);

  // Totais do carrinho
  const totalCartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['Todos', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Formatação de Moeda
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);

  // --- CONTROLE DE ACESSIBILIDADE: LEITOR DE VOZ (SPEECH SYNTHESIS) ---
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1;
      utterance.onend = () => setReadAloudActive(false);
      setReadAloudActive(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não possui suporte para síntese de voz.');
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setReadAloudActive(false);
    }
  };

  const readPageSummary = () => {
    const summary = `Você está na SmartAcessórios São Roque. Assistência Técnica e Acessórios para celulares. Temos ${products.length} itens no estoque disponíveis para entrega ou retirada no centro de São Roque. No topo há o carrinho de compras com ${totalCartCount} itens e botões para login ou orçamento rápido.`;
    speakText(summary);
  };

  // --- GERENCIAMENTO DA CÂMERA DE VÍDEO DO ESTOQUE (ADMIN) ---
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Acesso a câmera de vídeo não é suportado pelo seu navegador.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Erro ao acessar câmera:', err);
      setCameraError('Permissão para a câmera não concedida ou dispositivo ocupado.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Garante vinculação do stream caso o elemento de vídeo seja montado depois
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive, cameraStream, adminTab]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cameraStream]);

  // Efeito simulador de detecção por visão computacional da câmera ativa
  useEffect(() => {
    if (!isCameraActive || !isAutoDetecting) return;

    const interval = setInterval(() => {
      // Simula uma detecção a cada 18 segundos se o usuário mantiver a câmera ligada
      const randomProd = products[Math.floor(Math.random() * products.length)];
      if (!randomProd) return;

      const randomType: 'ENTRADA' | 'SAIDA' = Math.random() > 0.5 ? 'ENTRADA' : 'SAIDA';
      const qty = 1;

      // Se for saída e tiver estoque zero, pula
      if (randomType === 'SAIDA' && randomProd.stock <= 0) return;

      const newStock =
        randomType === 'ENTRADA'
          ? randomProd.stock + qty
          : Math.max(0, randomProd.stock - qty);

      setProducts((prev) =>
        prev.map((p) => (p.id === randomProd.id ? { ...p, stock: newStock } : p))
      );

      const now = new Date();
      const timeFormatted = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const autoMov: StockMovement = {
        id: `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: randomProd.id,
        productName: randomProd.name,
        type: randomType,
        quantity: qty,
        previousStock: randomProd.stock,
        newStock: newStock,
        reason: `Reconhecimento Óptico de Bancada (Câmera #01 São Roque)`,
        responsible: 'visão-computacional',
        timestamp: timeFormatted,
        capturedByCamera: true,
      };

      setMovements((prev) => [autoMov, ...prev]);
      setLastCameraDetection({
        time: timeFormatted,
        sku: randomProd.sku,
        name: randomProd.name,
        type: randomType,
        qty: qty,
      });

      setFlashDetected(true);
      setTimeout(() => setFlashDetected(false), 800);
    }, 18000);

    return () => clearInterval(interval);
  }, [isCameraActive, isAutoDetecting, products]);

  // Registrar leitura manual direta pela mira da câmera
  const handleCaptureFromCameraManual = () => {
    const product = products.find((p) => p.id === Number(cameraScanTarget));
    if (!product) return;

    const qty = Number(cameraQuantity) || 1;
    if (cameraMotionType === 'SAIDA' && qty > product.stock) {
      alert(`Erro: Quantidade de saída (${qty}) maior do que o estoque (${product.stock}).`);
      return;
    }

    const newStock =
      cameraMotionType === 'ENTRADA'
        ? product.stock + qty
        : Math.max(0, product.stock - qty);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
    );

    const now = new Date();
    const timeFormatted = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newMov: StockMovement = {
      id: `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: product.id,
      productName: product.name,
      type: cameraMotionType,
      quantity: qty,
      previousStock: product.stock,
      newStock: newStock,
      reason: `Captura via Câmera de Bancada (Operador Admin)`,
      responsible: 'admin-camera',
      timestamp: timeFormatted,
      capturedByCamera: true,
    };

    setMovements((prev) => [newMov, ...prev]);
    setLastCameraDetection({
      time: timeFormatted,
      sku: product.sku,
      name: product.name,
      type: cameraMotionType,
      qty: qty,
    });

    setFlashDetected(true);
    setTimeout(() => setFlashDetected(false), 900);
  };

  // --- HANDLERS DO CARRINHO ---
  const handleAddToCart = (product: Product) => {
    const currentInCart = cart.find((i) => i.product.id === product.id)?.quantity || 0;
    if (currentInCart >= product.stock) {
      alert(`Desculpe! Só temos ${product.stock} unidades de "${product.name}" no estoque.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);

    if (isScreenReaderMode) {
      speakText(`${product.name} adicionado ao carrinho. Total de itens: ${totalCartCount + 1}`);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > product.stock) {
              alert(`Limite de estoque atingido (${product.stock} unidades disponíveis).`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // --- HANDLER DO ORÇAMENTO ---
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneModel.trim() || !issue.trim()) return;

    setLastQuote({
      model: phoneModel,
      issue: issue,
      name: loggedCustomer ? loggedCustomer.name : customerQuoteName,
    });
    setIsSubmitted(true);
  };

  const handleResetQuote = () => {
    setPhoneModel('');
    setIssue('');
    setCustomerQuoteName('');
    setCustomerQuotePhone('');
    setIsSubmitted(false);
    setLastQuote(null);
  };

  // --- HANDLERS DE AUTENTICAÇÃO DO ADMIN ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginUsername === 'admin' && loginPassword === currentPassword) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha incorretos! Verifique os dados ou utilize "Esqueceu a senha?".');
    }
  };

  const handleLogout = () => {
    stopCamera();
    setIsAdminLoggedIn(false);
    setCurrentView('loja');
  };

  // Recuperação de senha por Token de Email (Admin)
  const handleSendRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      alert('Por favor digite um e-mail válido.');
      return;
    }

    const generatedToken = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryToken(generatedToken);
    setEmailSentAlert(true);
    setRecoveryStep('token');
  };

  const handleValidateTokenAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim() !== recoveryToken) {
      alert('Token numérico inválido! Verifique o número simulado enviado para sua caixa.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      alert('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setCurrentPassword(newPassword);
    setLoginPassword(newPassword);
    setRecoveryStep('done');
  };

  // --- HANDLERS DE CADASTRO E LOGIN DO CLIENTE ---
  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('Preencha todos os campos obrigatórios.');
      return;
    }

    const exists = registeredCustomers.some(
      (c) => c.email.toLowerCase() === regEmail.toLowerCase()
    );
    if (exists) {
      setRegError('Este e-mail já está cadastrado. Tente entrar na sua conta.');
      return;
    }

    const newCust: CustomerUser = {
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    };

    setRegisteredCustomers((prev) => [...prev, newCust]);
    setLoggedCustomer(newCust);
    setRegSuccess('Cadastro realizado com sucesso!');

    setTimeout(() => {
      setIsCustomerAuthModalOpen(false);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegSuccess('');
    }, 1200);
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const found = registeredCustomers.find(
      (c) =>
        c.email.toLowerCase() === custLoginEmail.toLowerCase() &&
        c.password === custLoginPassword
    );

    if (found) {
      setLoggedCustomer(found);
      setIsCustomerAuthModalOpen(false);
      setCustLoginEmail('');
      setCustLoginPassword('');
    } else {
      setRegError('E-mail ou senha incorretos.');
    }
  };

  const handleCustomerLogout = () => {
    setLoggedCustomer(null);
  };

  // --- HANDLER DE MOVIMENTAÇÃO MANUAL DE MATERIAL (ADMIN) ---
  const handleProcessMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    const qty = Number(movementQty);
    if (isNaN(qty) || qty <= 0) {
      alert('Por favor, informe uma quantidade válida maior que zero.');
      return;
    }

    let newStock = product.stock;
    if (movementType === 'ENTRADA') {
      newStock = product.stock + qty;
    } else if (movementType === 'SAIDA') {
      if (qty > product.stock) {
        alert(`Erro: Quantidade de saída (${qty}) maior do que o estoque atual (${product.stock}).`);
        return;
      }
      newStock = product.stock - qty;
    } else if (movementType === 'AJUSTE') {
      newStock = qty;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
    );

    const now = new Date();
    const timeFormatted = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMov: StockMovement = {
      id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: product.id,
      productName: product.name,
      type: movementType,
      quantity: qty,
      previousStock: product.stock,
      newStock: newStock,
      reason: movementReason || 'Movimentação manual pelo administrador',
      responsible: 'admin',
      timestamp: timeFormatted,
      capturedByCamera: false,
    };

    setMovements((prev) => [newMov, ...prev]);
    setMovementFeedback(
      `Sucesso! Movimentação de ${movementType} (${qty} un) realizada para "${product.name}". Novo estoque: ${newStock} un.`
    );
    setMovementQty(1);

    setTimeout(() => {
      setMovementFeedback(null);
    }, 4000);
  };

  // Cadastrar Novo Produto
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const priceNum = parseFloat(newProdPrice.replace(',', '.')) || 10;
    const stockNum = parseInt(newProdStock, 10) || 0;

    const created: Product = {
      id: newId,
      sku: newProdSku || `PROD-${newId.toString().padStart(3, '0')}`,
      name: newProdName,
      category: newProdCategory,
      price: priceNum,
      image:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      tag: 'Novo',
      stock: stockNum,
      minStock: 3,
      description: 'Item cadastrado via painel administrativo.',
    };

    setProducts((prev) => [...prev, created]);

    if (stockNum > 0) {
      const newMov: StockMovement = {
        id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: created.id,
        productName: created.name,
        type: 'ENTRADA',
        quantity: stockNum,
        previousStock: 0,
        newStock: stockNum,
        reason: 'Cadastro inicial de material no estoque',
        responsible: 'admin',
        timestamp: 'Agora',
        capturedByCamera: false,
      };
      setMovements((prev) => [newMov, ...prev]);
    }

    setIsNewProductModalOpen(false);
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice('29.90');
    setNewProdStock('10');
  };

  // Concluir Compra
  const handleFinishBeginnerOrder = () => {
    if (cart.length === 0) return;
    if (!loggedCustomer) {
      setIsCustomerAuthModalOpen(true);
      return;
    }

    cart.forEach((cartItem) => {
      const prod = products.find((p) => p.id === cartItem.product.id);
      if (prod) {
        const remaining = Math.max(0, prod.stock - cartItem.quantity);
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, stock: remaining } : p))
        );

        const saleMov: StockMovement = {
          id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
          productId: prod.id,
          productName: prod.name,
          type: 'SAIDA',
          quantity: cartItem.quantity,
          previousStock: prod.stock,
          newStock: remaining,
          reason: `Venda Direta - Cliente: ${loggedCustomer.name} (${loggedCustomer.email})`,
          responsible: 'sistema-venda',
          timestamp: 'Agora',
          capturedByCamera: false,
        };
        setMovements((prev) => [saleMov, ...prev]);
      }
    });

    const orderId = `PED-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderCompletedId(orderId);
    setCheckoutStep(3);
    setCart([]);
  };

  // Classes dinâmicas de acessibilidade
  const accessibilityRootClasses = [
    fontSizeLevel === 'grande' ? 'text-lg' : fontSizeLevel === 'extra' ? 'text-xl' : 'text-base',
    isHighContrast ? 'high-contrast' : '',
    isAccessibleFont ? 'accessible-font' : '',
  ].join(' ');

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${accessibilityRootClasses}`}>
      
      {/* ================= BARRA SUPERIOR DE ACESSIBILIDADE E MODO ================= */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Lado Esquerdo: Identificação e Atalhos de Acessibilidade Rápidos */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline text-slate-400">
                Loja & Manutenção em São Roque • SP
              </span>
              <span className="sm:hidden font-medium text-slate-300">
                SmartAcessórios
              </span>
            </div>

            {/* Botão para Abrir Central de Acessibilidade */}
            <button
              onClick={() => setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium transition cursor-pointer border border-emerald-500/30"
              title="Opções de Acessibilidade (Fonte, Contraste, Leitor de Voz)"
              aria-label="Opções de Acessibilidade"
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Acessibilidade</span>
            </button>

            {/* Leitor Rápido de Tela */}
            {readAloudActive ? (
              <button
                onClick={stopReading}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/80 text-white font-medium hover:bg-red-600 transition cursor-pointer"
                title="Parar leitura de voz"
              >
                <VolumeX className="w-3 h-3" />
                <span className="hidden md:inline">Parar Voz</span>
              </button>
            ) : (
              <button
                onClick={readPageSummary}
                className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Ouvir resumo da página em voz alta"
              >
                <Volume2 className="w-3 h-3 text-blue-400" />
                <span>Ouvir Página</span>
              </button>
            )}
          </div>

          {/* Lado Direito: Alternância Admin */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Admin Conectado
                </span>
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'loja' : 'admin')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition font-medium cursor-pointer"
                >
                  {currentView === 'admin' ? 'Ver Loja' : 'Painel de Materiais'}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 hover:text-red-400 text-slate-400 transition cursor-pointer"
                  title="Sair do Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium transition cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                Área do Administrador
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= BARRA / PAINEL DE ACESSIBILIDADE EXPANSÍVEL ================= */}
      {isAccessibilityMenuOpen && (
        <aside
          role="region"
          aria-label="Recursos de Acessibilidade"
          className="bg-emerald-950 text-white border-b border-emerald-800 py-3 px-4 shadow-md transition"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-200">Central de Acessibilidade e Inclusão</p>
                <p className="text-[11px] text-emerald-300">
                  Personalize o tamanho do texto, contraste visual e leitura em áudio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tamanho da Fonte */}
              <div className="flex items-center gap-1 bg-emerald-900/80 p-1 rounded-xl border border-emerald-700">
                <span className="text-[11px] font-semibold px-2 text-emerald-200 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5" /> Texto:
                </span>
                <button
                  onClick={() => setFontSizeLevel('normal')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    fontSizeLevel === 'normal' ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-800'
                  }`}
                  title="Tamanho Normal"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSizeLevel('grande')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    fontSizeLevel === 'grande' ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-800'
                  }`}
                  title="Texto Grande"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSizeLevel('extra')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    fontSizeLevel === 'extra' ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-800'
                  }`}
                  title="Texto Extra Grande"
                >
                  A++
                </button>
              </div>

              {/* Alto Contraste */}
              <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700'
                }`}
                title="Ativar/Desativar Alto Contraste"
              >
                <SunMedium className="w-3.5 h-3.5" />
                Alto Contraste
              </button>

              {/* Fonte Amigável para Leitura / Dislexia */}
              <button
                onClick={() => setIsAccessibleFont(!isAccessibleFont)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  isAccessibleFont
                    ? 'bg-white text-emerald-950 border-white'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700'
                }`}
                title="Alternar para fonte com maior espaçamento"
              >
                <Sliders className="w-3.5 h-3.5" />
                Fonte Legível
              </button>

              {/* Botão de Leitura de Áudio */}
              <button
                onClick={readAloudActive ? stopReading : readPageSummary}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  readAloudActive
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                }`}
              >
                {readAloudActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {readAloudActive ? 'Parar Leitura' : 'Ler Tela em Voz Alta'}
              </button>

              {/* Fechar barra */}
              <button
                onClick={() => setIsAccessibilityMenuOpen(false)}
                className="p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-800 transition cursor-pointer ml-1"
                title="Fechar barra de acessibilidade"
                aria-label="Fechar barra de acessibilidade"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* RENDERIZAÇÃO CONDICIONAL: PAINEL ADMIN VS LOJA DO CLIENTE */}
      {currentView === 'admin' ? (
        /* ================= PAINEL DO ADMINISTRADOR ================= */
        <div className="flex-1 bg-slate-100 flex flex-col">
          {!isAdminLoggedIn ? (
            /* TELA DE LOGIN DO ADMINISTRADOR (SEM SENHA EXPOSTA) */
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <Lock className="w-6 h-6 text-blue-300" />
                  </div>
                  <h2 className="text-xl font-bold">Acesso Administrativo</h2>
                  <p className="text-xs text-blue-200 mt-1">
                    SmartAcessórios • Gestão e Movimentação de Materiais
                  </p>
                </div>

                <div className="p-6">
                  {loginError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome de Usuário
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder="Digite seu usuário de administrador"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Senha
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPasswordOpen(true);
                            setRecoveryStep('email');
                            setEmailSentAlert(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Digite sua senha de acesso"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      Entrar no Sistema
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('loja')}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      ← Voltar para a Loja do Cliente
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* PAINEL DE CONTROLE LOGADO DO ADMINISTRADOR */
            <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
              {/* Header do Painel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Painel de Movimentação de Materiais
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Entrada e saída de insumos, peças de bancada, acessórios e conferência por câmera ao vivo.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Novo Material / Peça
                  </button>
                  <button
                    onClick={() => setCurrentView('loja')}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Loja
                  </button>
                </div>
              </div>

              {/* Mensagem de Feedback de Movimentação */}
              {movementFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{movementFeedback}</span>
                </div>
              )}

              {/* Métricas Rápidas de Estoque */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-medium">Total de Materiais</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {products.length} itens
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-medium">Unidades em Prateleira</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    {products.reduce((acc, p) => acc + p.stock, 0)} un
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-medium">Estoque Baixo</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                    {products.filter((p) => p.stock <= p.minStock).length} alertas
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500 font-medium">Movimentações Feitas</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                    {movements.length} logs
                  </p>
                </div>
              </div>

              {/* Navegação entre Abas do Admin com Nova Aba de Câmera Online */}
              <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl gap-6 overflow-x-auto">
                <button
                  onClick={() => setAdminTab('camera_online')}
                  className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'camera_online'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Acompanhamento por Câmera (Ao Vivo)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
                <button
                  onClick={() => setAdminTab('movimentacao')}
                  className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'movimentacao'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Movimentação Manual
                </button>
                <button
                  onClick={() => setAdminTab('catalogo')}
                  className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'catalogo'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Tabela Geral de Materiais
                </button>
                <button
                  onClick={() => setAdminTab('historico')}
                  className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'historico'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Histórico de Operações
                </button>
              </div>

              {/* ================= CONTEÚDO DA ABA: CÂMERA ONLINE (NOVO!) ================= */}
              {adminTab === 'camera_online' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visor da Câmera ao Vivo */}
                  <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
                    {/* Barra de Status do Feed */}
                    <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${isCameraActive ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`}></span>
                        <span className="font-bold uppercase tracking-wider text-slate-200">
                          {isCameraActive ? 'Câmera #01 • Bancada São Roque (Ao Vivo)' : 'Câmera Offline'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCameraActive ? (
                          <button
                            onClick={stopCamera}
                            className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
                          >
                            <VideoOff className="w-3.5 h-3.5" />
                            Desativar Câmera
                          </button>
                        ) : (
                          <button
                            onClick={startCamera}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Ativar Câmera da Bancada
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Frame do Vídeo com Mira de Escaneamento Óptico */}
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Grade e Mira de Visão Computacional */}
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className={`w-64 h-48 sm:w-80 sm:h-56 border-2 rounded-2xl relative transition duration-300 ${
                              flashDetected ? 'border-emerald-400 bg-emerald-500/20 shadow-2xl shadow-emerald-500' : 'border-emerald-500/70 border-dashed'
                            }`}>
                              {/* Mira e linhas de cantos */}
                              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                              
                              {/* Linha de Varredura Laser */}
                              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2"></div>

                              <span className="absolute top-2 left-3 bg-black/60 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                                <ScanLine className="w-3 h-3" /> Scanner Óptico Ativo
                              </span>

                              {flashDetected && (
                                <div className="absolute bottom-2 inset-x-2 bg-emerald-600 text-white font-bold text-center text-xs py-1 rounded shadow-lg animate-bounce">
                                  ✓ Movimentação Registrada pela Câmera!
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-slate-400 space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                            <Camera className="w-8 h-8 stroke-[1.4]" />
                          </div>
                          <div>
                            <p className="text-slate-200 font-bold text-base">Câmera de Monitoramento Desligada</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              Ative a câmera para monitorar em tempo real a entrada e saída de peças, cabos e telas na bancada de São Roque.
                            </p>
                          </div>
                          <button
                            onClick={startCamera}
                            className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-600/30 inline-flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Ligar Monitoramento por Câmera
                          </button>
                        </div>
                      )}

                      {cameraError && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-white p-3 rounded-xl text-xs flex items-center gap-2 border border-red-700">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-300" />
                          <span>{cameraError} (Utilize a captura manual ou simulação assistida abaixo).</span>
                        </div>
                      )}
                    </div>

                    {/* Controles de Leitura Rápida com Câmera */}
                    <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <ScanLine className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-white">Disparo Rápido de Registro pela Câmera:</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={isAutoDetecting}
                            onChange={(e) => setIsAutoDetecting(e.target.checked)}
                            className="rounded text-emerald-500 focus:ring-emerald-400"
                          />
                          <span>Detecção contínua inteligente ativa</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Material em Foco na Câmera
                          </label>
                          <select
                            value={cameraScanTarget}
                            onChange={(e) => setCameraScanTarget(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                [{p.sku}] {p.name} (Atual: {p.stock} un)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Tipo de Movimento
                          </label>
                          <select
                            value={cameraMotionType}
                            onChange={(e) => setCameraMotionType(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="ENTRADA">ENTRADA (+) Chegada</option>
                            <option value="SAIDA">SAÍDA (-) Bancada/Venda</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Qtd na Mira
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              value={cameraQuantity}
                              onChange={(e) => setCameraQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white text-center font-bold"
                            />
                            <button
                              onClick={handleCaptureFromCameraManual}
                              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center shrink-0 shadow-md"
                              title="Capturar e atualizar estoque"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Painel Lateral: Última Detecção e Logs Capturados pela Câmera */}
                  <div className="space-y-4">
                    {/* Cartão de Última Captura */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Última Captura Óptica
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> Sincronizado
                        </span>
                      </div>

                      {lastCameraDetection ? (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-blue-600 font-bold">
                              {lastCameraDetection.sku}
                            </span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              lastCameraDetection.type === 'ENTRADA' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {lastCameraDetection.type} ({lastCameraDetection.qty} un)
                            </span>
                          </div>
                          <p className="font-bold text-slate-900 text-sm">{lastCameraDetection.name}</p>
                          <p className="text-slate-400 text-[11px] pt-1">
                            Capturado às: {lastCameraDetection.time}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Nenhuma movimentação por câmera registrada nesta sessão ainda.
                        </p>
                      )}
                    </div>

                    {/* Resumo Rápido de Registros Ópticos */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        Histórico por Câmera / Visão Óptica
                      </h4>

                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {movements.filter((m) => m.capturedByCamera).length === 0 ? (
                          <p className="text-xs text-slate-400">Nenhum evento registrado pela câmera.</p>
                        ) : (
                          movements
                            .filter((m) => m.capturedByCamera)
                            .slice(0, 5)
                            .map((mov) => (
                              <div
                                key={mov.id}
                                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900 truncate max-w-[160px]">
                                    {mov.productName}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{mov.timestamp}</p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    mov.type === 'ENTRADA'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {mov.type === 'ENTRADA' ? '+' : '-'}{mov.quantity} un
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: MOVIMENTAÇÃO MANUAL */}
              {adminTab === 'movimentacao' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Formulário de Lançamento */}
                  <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Lançar Nova Movimentação de Estoque
                    </h3>
                    <p className="text-xs text-slate-500 mb-5">
                      Atualize a quantidade física de peças, insumos de bancada ou produtos de venda.
                    </p>

                    <form onSubmit={handleProcessMovement} className="space-y-4">
                      {/* Seleção do Produto */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Selecione o Material / Item
                        </label>
                        <select
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.sku}] {p.name} — Atual: {p.stock} un ({formatBRL(p.price)})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tipo de Operação */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Tipo de Movimento
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setMovementType('ENTRADA');
                              setMovementReason('Recebimento de compra de fornecedor');
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                              movementType === 'ENTRADA'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-600" />
                            <span>ENTRADA (+)</span>
                            <span className="text-[10px] font-normal text-slate-500">Compra / Devolução</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMovementType('SAIDA');
                              setMovementReason('Utilização em reparo de bancada');
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                              movementType === 'SAIDA'
                                ? 'bg-red-50 border-red-500 text-red-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <MinusCircle className="w-4 h-4 text-red-600" />
                            <span>SAÍDA (-)</span>
                            <span className="text-[10px] font-normal text-slate-500">Reparo / Venda / Perda</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMovementType('AJUSTE');
                              setMovementReason('Ajuste de inventário / Balanço');
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                              movementType === 'AJUSTE'
                                ? 'bg-blue-50 border-blue-500 text-blue-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                            <span>AJUSTE (=)</span>
                            <span className="text-[10px] font-normal text-slate-500">Contagem de prateleira</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantidade */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {movementType === 'AJUSTE'
                              ? 'Novo Valor Total de Estoque'
                              : 'Quantidade a Movimentar'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={movementQty}
                            onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Motivo / Ordem de Serviço
                          </label>
                          <input
                            type="text"
                            required
                            value={movementReason}
                            onChange={(e) => setMovementReason(e.target.value)}
                            placeholder="Ex: OS #3491 ou Compra NF 892"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        Confirmar Movimentação de Estoque
                      </button>
                    </form>
                  </div>

                  {/* Resumo do Item Selecionado */}
                  {(() => {
                    const currentProd = products.find((p) => p.id === Number(selectedProductId));
                    if (!currentProd) return null;
                    return (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Ficha do Material Selecionado
                          </h4>
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                            <img
                              src={currentProd.image}
                              alt={currentProd.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs font-mono text-blue-600 font-semibold">{currentProd.sku}</p>
                          <h5 className="font-bold text-slate-900 text-sm mt-0.5">{currentProd.name}</h5>
                          <p className="text-xs text-slate-500 mt-1">{currentProd.description}</p>

                          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Preço de Venda:</span>
                              <span className="font-bold text-slate-900">{formatBRL(currentProd.price)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Estoque Atual:</span>
                              <span className="font-bold text-blue-600 text-sm">{currentProd.stock} unidades</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Estoque Mínimo:</span>
                              <span className="text-slate-700">{currentProd.minStock} unidades</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-blue-800 text-[11px] flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Monitorado pela Visão Computacional de São Roque.</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CONTEÚDO DA ABA: CATÁLOGO GERAL */}
              {adminTab === 'catalogo' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Lista Completa de Materiais em Estoque ({products.length})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Clique no item para movimentar rápido
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">SKU / Código</th>
                          <th className="p-3.5">Material / Nome</th>
                          <th className="p-3.5">Categoria</th>
                          <th className="p-3.5">Preço Unitário</th>
                          <th className="p-3.5">Qtd Atual</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Ação Rápida</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map((p) => {
                          const isLow = p.stock <= p.minStock;
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 font-mono font-medium text-slate-700">{p.sku}</td>
                              <td className="p-3.5 font-semibold text-slate-900 flex items-center gap-2">
                                <img
                                  src={p.image}
                                  alt=""
                                  className="w-8 h-8 rounded object-cover border border-slate-200"
                                />
                                {p.name}
                              </td>
                              <td className="p-3.5">{p.category}</td>
                              <td className="p-3.5 font-semibold text-slate-900">{formatBRL(p.price)}</td>
                              <td className="p-3.5">
                                <span className="font-bold text-sm text-slate-900">{p.stock}</span> un
                              </td>
                              <td className="p-3.5">
                                {isLow ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                    BAIXO ({p.stock} un)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    NORMAL
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedProductId(p.id);
                                    setAdminTab('movimentacao');
                                  }}
                                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition cursor-pointer"
                                >
                                  Movimentar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: HISTÓRICO DE LOGS */}
              {adminTab === 'historico' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Histórico Recente de Entradas e Saídas ({movements.length} registros)
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {movements.map((mov) => (
                      <div key={mov.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              mov.type === 'ENTRADA'
                                ? 'bg-emerald-100 text-emerald-700'
                                : mov.type === 'SAIDA'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {mov.type === 'ENTRADA' ? (
                              <PlusCircle className="w-5 h-5" />
                            ) : mov.type === 'SAIDA' ? (
                              <MinusCircle className="w-5 h-5" />
                            ) : (
                              <RefreshCw className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {mov.productName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  mov.type === 'ENTRADA'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : mov.type === 'SAIDA'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {mov.type} ({mov.quantity} un)
                              </span>
                              {mov.capturedByCamera && (
                                <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                                  <Camera className="w-2.5 h-2.5" /> Câmera Óptica
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 mt-0.5">{mov.reason}</p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Operado por: <strong className="text-slate-600">{mov.responsible}</strong> • {mov.timestamp}
                            </p>
                          </div>
                        </div>

                        <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                          <p className="text-[11px] text-slate-400">Saldo pós-operação</p>
                          <p className="text-sm font-bold text-slate-900">{mov.newStock} un</p>
                          <span className="text-[10px] text-slate-400">
                            (era {mov.previousStock} un)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= ÁREA DO CLIENTE / E-COMMERCE ================= */
        <div className="flex-1 flex flex-col">
          {/* CABEÇALHO DA LOJA */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              {/* Logo & Marca */}
              <a href="#inicio" className="flex items-center gap-2.5 text-slate-900 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Smart<span className="text-blue-600">Acessórios</span>
                  </span>
                  <span className="hidden sm:block text-[11px] font-medium text-slate-400 -mt-1 tracking-wide">
                    São Roque • Assistência & Acessórios
                  </span>
                </div>
              </a>

              {/* Links Rápidos */}
              <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
                <a href="#inicio" className="hover:text-blue-600 transition-colors">
                  Início
                </a>
                <a href="#produtos" className="hover:text-blue-600 transition-colors">
                  Produtos
                </a>
                <a href="#orcamento" className="hover:text-blue-600 transition-colors">
                  Orçamento
                </a>
                <a
                  href="#estoque"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Estoque em Tempo Real
                </a>
              </nav>

              {/* Ações: Acessibilidade, Perfil/Cadastro do Cliente, Compra Rápida e Carrinho */}
              <div className="flex items-center gap-2">
                {/* Botão de Atalho para Acessibilidade */}
                <button
                  onClick={() => setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen)}
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer border border-slate-200"
                  title="Abrir Central de Acessibilidade"
                  aria-label="Abrir opções de acessibilidade"
                >
                  <Accessibility className="w-4 h-4 text-emerald-600" />
                </button>

                {/* Botão de Cadastro / Conta do Cliente */}
                {loggedCustomer ? (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 py-1 px-2.5 rounded-xl text-xs">
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="text-left hidden sm:block">
                      <p className="font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                        {loggedCustomer.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500">Cliente cadastrado</p>
                    </div>
                    <button
                      onClick={handleCustomerLogout}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer p-0.5"
                      title="Sair da conta"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCustomerAuthMode('cadastro');
                      setRegError('');
                      setIsCustomerAuthModalOpen(true);
                    }}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Criar Conta / Entrar</span>
                    <span className="sm:hidden">Conta</span>
                  </button>
                )}

                {/* Botão de Compra Rápida para Iniciantes */}
                <button
                  onClick={() => setIsBeginnerCheckoutOpen(true)}
                  className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  title="Comprar pelo passo a passo fácil"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Compra Fácil
                </button>

                {/* Carrinho */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Ver Carrinho de Compras"
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-700 transition cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-slate-700" />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-700">
                    Carrinho
                  </span>
                  <span
                    className={`min-w-5 h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center transition-transform ${
                      totalCartCount > 0
                        ? 'bg-blue-600 text-white scale-100'
                        : 'bg-slate-200 text-slate-600 scale-90'
                    }`}
                  >
                    {totalCartCount}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* BANNER PRINCIPAL COM DESTAQUE PARA CLIENTE INICIANTE */}
          <section
            id="inicio"
            className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-14 sm:py-20"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              {/* Tag informativa */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Compre Online com Retirada em São Roque ou Entrega Rápida
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Assistência Técnica e Acessórios para Celulares em{' '}
                <span className="text-blue-600 underline decoration-blue-300 underline-offset-8">
                  São Roque
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Reparo rápido de telas e baterias, películas de alta durabilidade e acessórios originais.
                Estoque 100% integrado com controle óptico por câmera em tempo real!
              </p>

              {/* Botões de Ação */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <a
                  href="#orcamento"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition active:scale-[0.98]"
                >
                  <Wrench className="w-5 h-5" />
                  Pedir Orçamento
                </a>

                {/* Botão de Compra Iniciante Destacado */}
                <button
                  onClick={() => setIsBeginnerCheckoutOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  Modo Compra Fácil (Passo a Passo)
                </button>

                <a
                  href="#produtos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-base transition"
                >
                  Ver Produtos
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Destaques de Confiança */}
              <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">Reparo Expresso</p>
                    <p className="text-slate-500">Telas e baterias em até 40 min</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">Garantia de 90 Dias</p>
                    <p className="text-slate-500">Peças selecionadas e nota fiscal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">Centro de São Roque</p>
                    <p className="text-slate-500">Próximo à Praça da Matriz</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CARD DE INCENTIVO AO CADASTRO DO CLIENTE (SE NÃO ESTIVER LOGADO) */}
          {!loggedCustomer && (
            <section className="py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                    <UserPlus className="w-6 h-6 text-blue-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">
                      Cadastre-se na SmartAcessórios para Comprar Online
                    </h3>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Crie sua conta informando seu nome, e-mail, senha e telefone para salvar pedidos e acelerar sua compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setCustomerAuthMode('cadastro');
                      setRegError('');
                      setIsCustomerAuthModalOpen(true);
                    }}
                    className="cursor-pointer w-full md:w-auto px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    Criar Meu Cadastro
                  </button>
                  <button
                    onClick={() => {
                      setCustomerAuthMode('login');
                      setRegError('');
                      setIsCustomerAuthModalOpen(true);
                    }}
                    className="cursor-pointer w-full md:w-auto px-4 py-2.5 bg-blue-700/80 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs border border-blue-400/40 transition"
                  >
                    Já tenho conta
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* VITRINE DE PRODUTOS */}
          <section id="produtos" className="py-14 max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Vitrine de Produtos & Acessórios
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Estoque em tempo real na loja física de São Roque.
                </p>
              </div>

              {/* Filtro por Categoria */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de Busca Simples */}
            <div className="mb-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por película, carregador, cabo, capinha ou bateria..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid de Cards dos Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const isJustAdded = addedProductId === prod.id;
                const isOutOfStock = prod.stock <= 0;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                  >
                    {/* Imagem do Produto */}
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-slate-700 px-2.5 py-1 rounded-md shadow-xs border border-slate-200">
                        {prod.tag}
                      </span>

                      {/* Selo de Estoque em tempo real */}
                      <span
                        className={`absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                          isOutOfStock
                            ? 'bg-red-600 text-white'
                            : prod.stock <= prod.minStock
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'Esgotado' : `${prod.stock} em estoque`}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-blue-600 uppercase font-semibold">
                          <span>{prod.category}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{prod.sku}</span>
                        </div>
                        <h3 className="mt-1 font-semibold text-slate-900 text-sm leading-snug">
                          {prod.name}
                        </h3>
                        {prod.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {prod.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 block -mb-0.5">
                            Preço à vista
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            {formatBRL(prod.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={isOutOfStock}
                            onClick={() => handleAddToCart(prod)}
                            className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Adicionado!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Adicionar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FORMULÁRIO DE ORÇAMENTO RÁPIDO */}
          <section id="orcamento" className="py-16 bg-slate-100/80 border-y border-slate-200">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Orçamento Rápido de Reparo
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Informe o modelo do celular e o problema para receber o orçamento gratuito.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                {isSubmitted ? (
                  /* AVISO DE SUCESSO */
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Orçamento enviado com sucesso!
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                      Recebemos seu pedido para o aparelho{' '}
                      <strong className="text-slate-800">{lastQuote?.model}</strong>.
                      Nossos técnicos em São Roque retornarão rapidamente.
                    </p>

                    <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 max-w-md mx-auto">
                      <p className="text-slate-500">
                        <strong className="text-slate-700">Modelo:</strong> {lastQuote?.model}
                      </p>
                      <p className="text-slate-500">
                        <strong className="text-slate-700">Falha / Serviço:</strong> {lastQuote?.issue}
                      </p>
                      {lastQuote?.name && (
                        <p className="text-slate-500">
                          <strong className="text-slate-700">Cliente:</strong> {lastQuote.name}
                        </p>
                      )}
                      <p className="text-emerald-700 font-medium pt-1">
                        Tempo estimado de retorno: até 15 minutos.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={handleResetQuote}
                        className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                      >
                        Fazer Novo Orçamento
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Olá SmartAcessórios! Enviei orçamento para ${lastQuote?.model} (${lastQuote?.issue}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition"
                      >
                        Chamar no WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  /* FORMULÁRIO */
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="phoneModel" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Modelo do Celular <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneModel"
                        type="text"
                        required
                        value={phoneModel}
                        onChange={(e) => setPhoneModel(e.target.value)}
                        placeholder="Ex: iPhone 13, Galaxy S22, Moto G54..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label htmlFor="issue" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Qual é o defeito ou falha? <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="issue"
                        type="text"
                        required
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        placeholder="Ex: Troca de Tela, Bateria não segura carga, Não carrega..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50/50"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {['Troca de Tela', 'Troca de Bateria', 'Conector de Carga', 'Aparelho Molhado'].map((tip) => (
                          <button
                            key={tip}
                            type="button"
                            onClick={() => setIssue(tip)}
                            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md transition cursor-pointer"
                          >
                            + {tip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Se o cliente estiver logado, usa dados automaticamente */}
                    {loggedCustomer ? (
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                        <span>
                          Solicitando como: <strong>{loggedCustomer.name}</strong> ({loggedCustomer.phone})
                        </span>
                        <span className="text-blue-600 font-semibold">Conta Conectada</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label htmlFor="customerQuoteName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Seu Nome (Opcional)
                          </label>
                          <input
                            id="customerQuoteName"
                            type="text"
                            value={customerQuoteName}
                            onChange={(e) => setCustomerQuoteName(e.target.value)}
                            placeholder="Ex: Carlos Silva"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="customerQuotePhone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                            WhatsApp para Resposta (Opcional)
                          </label>
                          <input
                            id="customerQuotePhone"
                            type="tel"
                            value={customerQuotePhone}
                            onChange={(e) => setCustomerQuotePhone(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50/50"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-2 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition active:scale-[0.99]"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Pedido de Orçamento
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* AVISO DE ESTOQUE INTELIGENTE (SIMULAÇÃO) */}
          <section id="estoque" className="py-8 bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="bg-slate-50 rounded-xl border border-slate-200/90 p-3.5 sm:p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800">
                      Sistema de Monitoramento Operacional: Estoque sincronizado em tempo real via Visão Computacional.
                    </p>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      Sensores e conferência direta integrada com a área de administração de materiais.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* RODAPÉ */}
          <footer className="mt-auto bg-slate-900 text-slate-400 py-10 text-xs border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  SmartAcessórios
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Assistência técnica especializada em São Roque com peças originais e controle inteligente de material.
                </p>
                <div className="mt-4 flex flex-col gap-1.5">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer text-left"
                  >
                    Área Restrita (Administrador & Câmera)
                  </button>
                  <button
                    onClick={() => setIsAccessibilityMenuOpen(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer text-left"
                  >
                    Opções de Acessibilidade
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                  Atendimento & Localização
                </h4>
                <p className="text-slate-400">Rua XV de Novembro, Centro • São Roque - SP</p>
                <p className="text-slate-400 mt-1">Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00</p>
                <p className="text-blue-400 mt-2 font-medium">WhatsApp: (11) 97123-4567</p>
              </div>

              <div>
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                  Garantia e Procedência
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Todos os reparos contam com 90 dias de garantia e rastreabilidade total de componentes no estoque.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                  © {new Date().getFullYear()} SmartAcessórios São Roque. Todos os direitos reservados.
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* MODAL: CADASTRO E LOGIN DO CLIENTE (COM EMAIL, SENHA E TELEFONE) */}
      {isCustomerAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">
                  {customerAuthMode === 'cadastro' ? 'Cadastro do Cliente' : 'Entrar na Conta do Cliente'}
                </h3>
              </div>
              <button
                onClick={() => setIsCustomerAuthModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Abas Alternar entre Cadastro e Login */}
              <div className="flex border-b border-slate-200 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerAuthMode('cadastro');
                    setRegError('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition cursor-pointer ${
                    customerAuthMode === 'cadastro'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Novo Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerAuthMode('login');
                    setRegError('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition cursor-pointer ${
                    customerAuthMode === 'login'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Já Possuo Conta
                </button>
              </div>

              {regError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {customerAuthMode === 'cadastro' ? (
                /* FORMULÁRIO DE CADASTRO */
                <form onSubmit={handleCustomerRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seu Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo de Oliveira"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de Telefone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Crie uma Senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Digite uma senha segura"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Concluir Cadastro & Conectar
                  </button>

                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Seus dados são usados apenas para processar pedidos na SmartAcessórios em São Roque.
                  </p>
                </form>
              ) : (
                /* FORMULÁRIO DE LOGIN DO CLIENTE */
                <form onSubmit={handleCustomerLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Cadastrado
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={custLoginEmail}
                        onChange={(e) => setCustLoginEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={custLoginPassword}
                        onChange={(e) => setCustLoginPassword(e.target.value)}
                        placeholder="Digite sua senha cadastrada"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Entrar na Minha Conta
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECUPERAÇÃO DE SENHA (TOKEN POR E-MAIL ADMIN) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Recuperação de Senha do Admin</h3>
              </div>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {recoveryStep === 'email' && (
                <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Digite seu e-mail de administrador para receber um <strong>número de token</strong> de segurança.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Cadastrado
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="admin@smartacessorios.com.br"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Enviar Token por E-mail
                  </button>
                </form>
              )}

              {recoveryStep === 'token' && (
                <form onSubmit={handleValidateTokenAndReset} className="space-y-4">
                  {emailSentAlert && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-amber-800">
                        <Mail className="w-4 h-4" /> [Simulação de E-mail Recebido]
                      </p>
                      <p>Para: <strong>{recoveryEmail}</strong></p>
                      <p>
                        Seu código de verificação é:{' '}
                        <span className="text-base font-extrabold text-blue-700 tracking-widest bg-white px-2 py-0.5 rounded border border-blue-200 inline-block my-1">
                          {recoveryToken}
                        </span>
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Digite esse número abaixo para confirmar sua identidade e cadastrar nova senha.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Digite o Token Recebido (6 Dígitos)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Ex: 849201"
                      className="w-full text-center tracking-widest font-mono text-lg font-bold px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nova Senha de Acesso
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha desejada"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Redefinir Senha do Admin
                  </button>
                </form>
              )}

              {recoveryStep === 'done' && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Senha alterada com sucesso!</h4>
                  <p className="text-xs text-slate-500">
                    Sua nova senha já está ativa. Você já pode fazer login normalmente.
                  </p>
                  <button
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setRecoveryStep('email');
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Voltar para o Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ÁREA DE COMPRA INICIANTE (PASSO A PASSO GUIADO COM CADASTRO DO CLIENTE) */}
      {isBeginnerCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-base">Modo Compra Fácil para Iniciantes</h3>
                  <p className="text-[11px] text-emerald-200">
                    Passo a passo simples e guiado sem burocracia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBeginnerCheckoutOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className={`flex items-center gap-1.5 ${checkoutStep === 1 ? 'text-emerald-700 font-bold' : ''}`}>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
                Itens Desejados
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`flex items-center gap-1.5 ${checkoutStep === 2 ? 'text-emerald-700 font-bold' : ''}`}>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">2</span>
                Conta & Entrega
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`flex items-center gap-1.5 ${checkoutStep === 3 ? 'text-emerald-700 font-bold' : ''}`}>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                Pagamento & Pedido
              </span>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {checkoutStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Passo 1: Verifique seus itens</p>
                    <p>Você pode adicionar mais itens navegando pela vitrine ou continuar com os itens abaixo.</p>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">Seu carrinho ainda não tem produtos</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Escolha um produto da vitrine abaixo e clique nele para incluir:
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                        {products.slice(0, 4).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleAddToCart(p)}
                            className="p-2 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 text-xs flex items-center gap-2 cursor-pointer transition"
                          >
                            <img src={p.image} className="w-8 h-8 rounded object-cover" alt="" />
                            <div className="truncate">
                              <p className="font-semibold truncate">{p.name}</p>
                              <p className="text-blue-600 font-bold">{formatBRL(p.price)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{item.product.name}</p>
                              <p className="text-blue-600 font-bold">{formatBRL(item.product.price)} cada</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="w-6 h-6 rounded bg-white border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="w-6 h-6 rounded bg-white border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-600">Total parcial:</span>
                        <span className="text-xl font-extrabold text-slate-900">{formatBRL(cartSubtotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4">
                  {/* Seção de Cadastro / Identificação do Cliente */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        Identificação do Cliente
                      </p>
                      {loggedCustomer && (
                        <button
                          type="button"
                          onClick={handleCustomerLogout}
                          className="text-[11px] text-red-500 hover:underline cursor-pointer"
                        >
                          Trocar de conta
                        </button>
                      )}
                    </div>

                    {loggedCustomer ? (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <p><strong className="text-slate-700">Nome:</strong> {loggedCustomer.name}</p>
                        <p><strong className="text-slate-700">E-mail:</strong> {loggedCustomer.email}</p>
                        <p><strong className="text-slate-700">Telefone:</strong> {loggedCustomer.phone}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                          ✓ Conta verificada para compras
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-600">
                          Para concluir sua compra com segurança, faça seu cadastro rápido com nome, e-mail, telefone e senha.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerAuthMode('cadastro');
                            setIsCustomerAuthModalOpen(true);
                          }}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4" />
                          Cadastrar ou Entrar para Continuar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Forma de Entrega */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Como prefere receber o produto?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('balcao')}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                          deliveryMethod === 'balcao'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-600" /> Retirar no Balcão
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">Loja física no Centro de São Roque (Sem frete)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('entrega')}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                          deliveryMethod === 'entrega'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-emerald-600" /> Entrega em São Roque
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">Motoboy rápido para o mesmo dia</p>
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'entrega' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Endereço Completo em São Roque
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Rua, número, bairro e ponto de referência"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="space-y-4">
                  {orderCompletedId ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        Parabéns! Pedido {orderCompletedId} Realizado!
                      </h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto">
                        O estoque já foi atualizado e seus produtos foram reservados no sistema de São Roque.
                      </p>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left max-w-sm mx-auto space-y-1">
                        <p><strong className="text-slate-700">Cliente Cadastrado:</strong> {loggedCustomer?.name} ({loggedCustomer?.email})</p>
                        <p><strong className="text-slate-700">Telefone:</strong> {loggedCustomer?.phone}</p>
                        <p><strong className="text-slate-700">Modalidade:</strong> {deliveryMethod === 'balcao' ? 'Retirada no Balcão' : `Entrega em: ${deliveryAddress}`}</p>
                        <p><strong className="text-slate-700">Forma de Pagamento:</strong> {paymentMethod.toUpperCase()}</p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Olá! Fiz o pedido ${orderCompletedId} na SmartAcessórios São Roque. Meu nome é ${loggedCustomer?.name}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 transition"
                        >
                          Confirmar no WhatsApp da Loja
                        </a>
                        <button
                          onClick={() => {
                            setIsBeginnerCheckoutOpen(false);
                            setCheckoutStep(1);
                            setOrderCompletedId(null);
                          }}
                          className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
                        >
                          Fechar e Voltar à Loja
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                        <p className="font-semibold text-slate-800">Passo 3: Como deseja pagar?</p>
                        <p>Você pode pagar na entrega/retirada ou via PIX rápido com desconto.</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          onClick={() => setPaymentMethod('pix')}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                            paymentMethod === 'pix'
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <QrCode className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="font-bold text-slate-900">PIX (Mais Rápido)</p>
                              <p className="text-slate-500">Chave PIX e QR Code imediato no balcão</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'pix'} readOnly />
                        </label>

                        <label
                          onClick={() => setPaymentMethod('cartao')}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                            paymentMethod === 'cartao'
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-bold text-slate-900">Cartão de Crédito / Débito</p>
                              <p className="text-slate-500">Maquininha na entrega ou na loja</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'cartao'} readOnly />
                        </label>

                        <label
                          onClick={() => setPaymentMethod('dinheiro')}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                            paymentMethod === 'dinheiro'
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Banknote className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-bold text-slate-900">Dinheiro em Espécie</p>
                              <p className="text-slate-500">Pagamento direto no ato com troco</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'dinheiro'} readOnly />
                        </label>
                      </div>

                      <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center text-sm font-bold">
                        <span>Valor Final da Compra:</span>
                        <span className="text-emerald-700 text-lg">{formatBRL(cartSubtotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!orderCompletedId && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                {checkoutStep > 1 ? (
                  <button
                    onClick={() => setCheckoutStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    ← Voltar
                  </button>
                ) : (
                  <div></div>
                )}

                {checkoutStep < 3 ? (
                  <button
                    disabled={cart.length === 0}
                    onClick={() => {
                      if (checkoutStep === 2 && !loggedCustomer) {
                        setCustomerAuthMode('cadastro');
                        setIsCustomerAuthModalOpen(true);
                        return;
                      }
                      setCheckoutStep((prev) => (prev + 1) as any);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    Próximo Passo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishBeginnerOrder}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Finalizar Compra Agora
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CADASTRO DE NOVO MATERIAL / PEÇA PELO ADMIN */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Cadastrar Novo Material ou Peça
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Material / Peça *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Tela Frontal Incell Galaxy A14"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Código SKU / Identificador
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="Ex: DISP-SAM-A14"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Proteção de Tela">Proteção de Tela</option>
                    <option value="Cabos & Conexões">Cabos & Conexões</option>
                    <option value="Energia & Bateria">Energia & Bateria</option>
                    <option value="Capinhas Premium">Capinhas Premium</option>
                    <option value="Peças de Manutenção">Peças de Manutenção</option>
                    <option value="Ferramentas de Bancada">Ferramentas de Bancada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="Ex: 120.00"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estoque Inicial (Qtd)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Salvar Material no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER DO CARRINHO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-left">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">
                  Meu Carrinho ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingCart className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300" />
                  <p className="font-semibold text-slate-700 text-base">Seu carrinho está vazio</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore os produtos disponíveis e adicione ao carrinho.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsBeginnerCheckoutOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Usar Compra Fácil
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 items-center justify-between"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-white shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 mt-0.5">
                        {formatBRL(item.product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-slate-700 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatBRL(cartSubtotal)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCart([])}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-200 text-xs font-medium cursor-pointer transition"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsBeginnerCheckoutOpen(true);
                      setCheckoutStep(2);
                    }}
                    className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Concluir com Compra Fácil →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
