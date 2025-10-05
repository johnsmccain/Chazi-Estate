import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HashConnect, HashConnectConnectionState, DappMetadata, SessionData } from 'hashconnect';
import { AccountId } from '@hashgraph/sdk';
import { Client, LedgerId, AccountBalanceQuery } from '@hashgraph/sdk';

interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  accountBalance: number;
  isLoading: boolean;
  error: string | null;
  hashConnect: HashConnect | null;
  pairingString: string | null;
  pairingData: SessionData | null;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<{ success: boolean; accountId?: string; error?: string }>;
  disconnectWallet: () => void;
  getAccountBalance: () => Promise<number>;
  signTransaction: (transaction: any) => Promise<any>;
  sendTransaction: (transaction: any) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    accountBalance: 0,
    isLoading: false,
    error: null,
    hashConnect: null,
    pairingString: null,
    pairingData: null,
  });

  // Initialize HashConnect
  useEffect(() => {
    const initializeHashConnect = async () => {
      try {
        console.log('🚀 Initializing HashConnect...');
        
        // Initialize HashConnect
        const appMetadata: DappMetadata = {
          name: "CHAZI ESTATE",
          description: "Real Estate Tokenization Platform",
          icons: ["https://your-app-icon-url.com/icon.png"],
          url: window.location.origin,
        };

        console.log('📱 Creating HashConnect instance...');
        const hashConnect = new HashConnect(LedgerId.TESTNET, "chazi-estate-platform", appMetadata, true);
        
        console.log('🔧 Initializing HashConnect...');
        await hashConnect.init();
        
        console.log('✅ HashConnect initialized successfully');
        console.log('🔗 Pairing string:', hashConnect.pairingString);
        
        setState(prev => ({
          ...prev,
          hashConnect,
          pairingString: hashConnect.pairingString || null,
        }));

        // Set up event listeners
        hashConnect.pairingEvent.on((pairingData) => {
          console.log('🎉 Wallet paired:', pairingData);
          setState(prev => ({
            ...prev,
            isConnected: true,
            accountId: pairingData.accountIds[0],
            pairingData,
            error: null,
            isLoading: false,
          }));
        });

        hashConnect.connectionStatusChangeEvent.on((connectionStatus) => {
          console.log('🔄 Connection status changed:', connectionStatus);
          if (connectionStatus === HashConnectConnectionState.Disconnected) {
            setState(prev => ({
              ...prev,
              isConnected: false,
              accountId: null,
              pairingData: null,
              isLoading: false,
            }));
          } else if (connectionStatus === HashConnectConnectionState.Connected) {
            setState(prev => ({
              ...prev,
              isConnected: true,
              isLoading: false,
            }));
          }
        });

        // Check for existing pairing
        // Check if there are any existing connections
        if (hashConnect.connectedAccountIds.length > 0) {
          setState(prev => ({
            ...prev,
            isConnected: true,
            accountId: hashConnect.connectedAccountIds[0].toString(),
          }));
        }

      } catch (error) {
        console.error('❌ Failed to initialize HashConnect:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize wallet connection',
        }));
      }
    };

    initializeHashConnect();
  }, []);

  const connectWallet = async (): Promise<{ success: boolean; accountId?: string; error?: string }> => {
    console.log('🔌 Attempting to connect wallet...');
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!state.hashConnect) {
        console.error('❌ HashConnect not initialized');
        throw new Error('HashConnect not initialized');
      }

      console.log('📱 Opening HashPack pairing modal...');
      // Open HashPack wallet for pairing
      await state.hashConnect.openPairingModal();
      console.log('✅ Pairing modal opened successfully');

      // Set a timeout to stop loading if user doesn't connect
      setTimeout(() => {
        setState(prev => {
          if (prev.isLoading && !prev.isConnected) {
            console.log('⏰ Connection timeout - user did not connect');
            return {
              ...prev,
              isLoading: false,
              error: 'Connection timeout - please try again',
            };
          }
          return prev;
        });
      }, 30000); // 30 second timeout

      return { success: true };
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const disconnectWallet = () => {
    if (state.hashConnect && state.pairingData) {
      state.hashConnect.disconnect();
    }
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      accountId: null,
      pairingData: null,
      accountBalance: 0,
    }));
  };

  const getAccountBalance = async (): Promise<number> => {
    if (!state.accountId) return 0;

    try {
      const client = Client.forTestnet();
      const accountId = AccountId.fromString(state.accountId);
      const balance = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
      
      setState(prev => ({
        ...prev,
        accountBalance: Number(balance.hbars.toTinybars()) / 100000000, // Convert to HBAR
      }));

      return Number(balance.hbars.toTinybars()) / 100000000;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return 0;
    }
  };

  const signTransaction = async (transaction: any): Promise<any> => {
    if (!state.hashConnect || !state.pairingData) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await state.hashConnect.sendTransaction(
        state.hashConnect.connectedAccountIds[0],
        transaction
      );

      return response;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  const sendTransaction = async (transaction: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    try {
      const response = await signTransaction(transaction);
      
      if (response.success) {
        return {
          success: true,
          transactionId: response.receipt.transactionId.toString(),
        };
      } else {
        return {
          success: false,
          error: response.error || 'Transaction failed',
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Update balance when account changes
  useEffect(() => {
    if (state.isConnected && state.accountId) {
      getAccountBalance();
    }
  }, [state.isConnected, state.accountId]);

  const value: WalletContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    getAccountBalance,
    signTransaction,
    sendTransaction,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
