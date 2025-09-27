import { Building2, CreditCard, FileText, Home, Key, PieChart, Search, Shield, Vote, Wallet, Server } from "lucide-react";

export const navItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: 'Home',
      description: 'Your dashboard overview',
      color: 'from-emerald-400 to-blue-500'
    },
    { 
      path: '/browse', 
      icon: Search, 
      label: 'Browse Properties',
      description: 'Discover amazing properties',
      color: 'from-blue-400 to-purple-500'
    },
    { 
      path: '/my-properties', 
      icon: Building2, 
      label: 'My Properties',
      description: 'Manage your portfolio',
      color: 'from-purple-400 to-pink-500'
    },
    { 
      path: '/buy-fraction/1', 
      icon: PieChart, 
      label: 'Buy Fraction',
      description: 'Fractional ownership',
      color: 'from-amber-400 to-orange-500'
    },
    { 
      path: '/rent', 
      icon: Key, 
      label: 'Rent Property',
      description: 'Find rental opportunities',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      path: '/loan', 
      icon: CreditCard, 
      label: 'Loan Property',
      description: 'Property financing',
      color: 'from-indigo-400 to-blue-500'
    },
    { 
      path: '/dao', 
      icon: Vote, 
      label: 'DAO Governance',
      description: 'Property voting & decisions',
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      path: '/deed-generator', 
      icon: Shield, 
      label: 'Deed Generator',
      description: 'AI-powered deed creation',
      color: 'from-emerald-400 to-teal-500'
    },
    { 
      path: '/create-deed', 
      icon: FileText, 
      label: 'Create Deed',
      description: 'Generate new deeds',
      color: 'from-pink-400 to-rose-500'
    },
            { 
              path: '/wallet-test', 
              icon: Wallet, 
              label: 'Wallet Test',
              description: 'Test wallet integration',
              color: 'from-cyan-400 to-blue-500'
            },
            { 
              path: '/backend-test', 
              icon: Server, 
              label: 'Backend Test',
              description: 'Test backend integration',
              color: 'from-green-400 to-emerald-500'
            },
            { 
              path: '/wallet-debug', 
              icon: Wallet, 
              label: 'Wallet Debug',
              description: 'Debug wallet connection issues',
              color: 'from-red-400 to-orange-500'
            },
            { 
              path: '/rainbowkit-test', 
              icon: Wallet, 
              label: 'RainbowKit Test',
              description: 'Test RainbowKit wallet integration',
              color: 'from-rainbow-400 to-purple-500'
            },
  ];