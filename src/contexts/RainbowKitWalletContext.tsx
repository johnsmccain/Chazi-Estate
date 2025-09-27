import React, { createContext, useContext, ReactNode } from 'react';
import { 
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  ConnectButton,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { 
  createConfig,
  WagmiProvider,
  useAccount,
  useBalance,
  useDisconnect,
  useConnect,
  useChainId,
  useSwitchChain
} from 'wagmi';
import { 
  mainnet,
  polygon,
  sepolia
} from 'wagmi/chains';
import { http } from 'viem';
import type { Chain } from 'viem';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


const queryClient = new QueryClient();

// Custom Hedera chain configuration
const hederaTestnet: Chain = {
  id: 296,
  name: 'Hedera Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'],
    },
    public: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: { name: 'HashScan', url: 'https://hashscan.io/testnet' },
  },
  testnet: true,
};

// Configure essential chains only for faster loading
const allChains: readonly [Chain, ...Chain[]] = [
  mainnet,
  polygon,
  hederaTestnet,
  sepolia,
];

// Configure wallets - only include essential wallets for faster loading
const { wallets } = getDefaultWallets({
  appName: 'chazi-chain',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'chazi-chain-platform'
});

// Use all wallets for now - filtering can be complex with the new structure
const essentialWallets = wallets;

const connectors = connectorsForWallets(essentialWallets, {
  appName: 'chazi-chain',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'chazi-chain-platform'
});

// Configure wagmi
const wagmiConfig = createConfig({
  chains: allChains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
    [hederaTestnet.id]: http('https://testnet.hashio.io/api'),
  },
});

interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  accountBalance: number;
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
  chainName: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<{ success: boolean; accountId?: string; error?: string }>;
  disconnectWallet: () => void;
  getAccountBalance: () => Promise<number>;
  switchNetwork: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Helper function to get chain name from chain ID
const getChainName = (chainId: number): string => {
  const chainMap: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    10: 'Optimism',
    42161: 'Arbitrum',
    8453: 'Base',
    11155111: 'Sepolia',
    5: 'Goerli',
    80001: 'Mumbai',
    421613: 'Arbitrum Goerli',
    420: 'Optimism Goerli',
    84531: 'Base Goerli',
    296: 'Hedera Testnet',
  };
  return chainMap[chainId] || 'Unknown';
};

// Custom hook for wallet functionality
const useWalletHook = (): WalletContextType => {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const connectWallet = async (): Promise<{ success: boolean; accountId?: string; error?: string }> => {
    try {
      if (isConnected) {
        return { success: true, accountId: address || undefined };
      }

      if (connectors.length > 0) {
        await connect({ connector: connectors[0] });
        return { success: true, accountId: address || undefined };
      }

      return { success: false, error: 'No wallet connectors available' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect wallet' 
      };
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const getAccountBalance = async (): Promise<number> => {
    if (balance) {
      return parseFloat(balance.formatted);
    }
    return 0;
  };

  const switchToNetwork = async (newChainId: number) => {
    if (switchChain) {
      await switchChain({ chainId: newChainId });
    }
  };

  return {
    isConnected,
    accountId: address || null,
    accountBalance: balance ? parseFloat(balance.formatted) : 0,
    isLoading: isConnecting,
    error: null,
    chainId: chainId || null,
    chainName: chainId ? getChainName(chainId) : null,
    connectWallet,
    disconnectWallet,
    getAccountBalance,
    switchNetwork: switchToNetwork,
  };
};

export const RainbowKitWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Reduce initialization time to prevent blocking
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Reduced from 1000ms to 100ms

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-white">chazi-chain</h2>
          <p className="mt-2 text-gray-400">Initializing wallet connection...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
       <QueryClientProvider client={queryClient}>
      <RainbowKitProvider 
        appInfo={{
          appName: 'chazi-chain',
          learnMoreUrl: 'https://chazi-chain.com',
        }}
        theme={darkTheme()}
        showRecentTransactions={true}
      >
        {/* <WalletContext.Provider value={useWalletHook()}> */}
          {children}
        {/* </WalletContext.Provider> */}
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const useWallet = () => {

  try {
      const context = useContext(WalletContext);
 return context;
  } catch (error) {
          console.log('useWallet must be used within a RainbowKitWalletProvider');
  }
 
};

// Export RainbowKit components for use in UI
export { ConnectButton };
