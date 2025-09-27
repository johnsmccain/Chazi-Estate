import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, ConnectButton } from '../contexts/RainbowKitWalletContext';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Network
} from 'lucide-react';

interface RainbowKitWalletConnectionProps {
  className?: string;
  showBalance?: boolean;
  showAddress?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export const RainbowKitWalletConnection: React.FC<RainbowKitWalletConnectionProps> = ({
  className = '',
  showBalance = true,
  showAddress = true,
  variant = 'default'
}) => {
  const wallet = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (wallet.accountId) {
      await navigator.clipboard.writeText(wallet.accountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (variant === 'minimal') {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  const getExplorerUrl = () => {
    if (wallet.chainId === 296) {
      return `https://hashscan.io/testnet/account/${wallet.accountId}`;
    }
    // Default to Etherscan for other chains
    const chainName = wallet.chainId === 1 ? '' : 
                     wallet.chainId === 137 ? 'polygon.' :
                     wallet.chainId === 10 ? 'optimistic.' :
                     wallet.chainId === 42161 ? 'arbitrum.' :
                     wallet.chainId === 8453 ? 'base.' : '';
    return `https://${chainName}etherscan.io/address/${wallet.accountId}`;
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {wallet.isConnected ? (
          <motion.button
            onClick={wallet.disconnectWallet}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect</span>
          </motion.button>
        ) : (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <motion.button
                          onClick={openConnectModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>Connect</span>
                        </motion.button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <motion.button
                          onClick={openChainModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Wrong network</span>
                        </motion.button>
                      );
                    }

                    return (
                      <motion.button
                        onClick={openAccountModal}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                      >
                        <span>{formatAddress(account.address)}</span>
                      </motion.button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {wallet?.isConnected ? (
          <>
            {showBalance && (
              <div className="text-sm text-gray-300">
                {formatBalance(wallet?.accountBalance)} {wallet?.chainName === 'Hedera Testnet' ? 'HBAR' : 'ETH'}
              </div>
            )}
            <motion.button
              onClick={copyAddress}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{formatAddress(wallet?.accountId || '')}</span>
            </motion.button>
            <motion.button
              onClick={wallet?.disconnectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </>
        ) : (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <motion.button
                          onClick={openConnectModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>Connect Wallet</span>
                        </motion.button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <motion.button
                          onClick={openChainModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Wrong Network</span>
                        </motion.button>
                      );
                    }

                    return (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={copyAddress}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                          {copied ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span>{formatAddress(account.address)}</span>
                        </motion.button>
                        <motion.button
                          onClick={openAccountModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                        </motion.button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-emerald-400" />
          <span>Wallet Connection</span>
        </h3>
        {wallet.isConnected && (
          <motion.button
            onClick={wallet.getAccountBalance}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {wallet.isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Connection Status */}
            <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Connected to {wallet.chainName}</span>
            </div>

            {/* Account Address */}
            {showAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Address
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm">
                    {wallet.accountId}
                  </div>
                  <motion.button
                    onClick={copyAddress}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </motion.button>
                  <motion.a
                    href={getExplorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                </div>
              </div>
            )}

            {/* Account Balance */}
            {showBalance && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Balance
                </label>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">
                      {formatBalance(wallet.accountBalance)}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {wallet.chainName === 'Hedera Testnet' ? 'HBAR' : 'ETH'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Network Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Network
              </label>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-white">{wallet.chainName}</span>
                  <span className="text-emerald-400 text-sm">Chain ID: {wallet.chainId}</span>
                </div>
              </div>
            </div>

            {/* Disconnect Button */}
            <motion.button
              onClick={wallet.disconnectWallet}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Error Message */}
            {wallet.error && (
              <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-300 text-sm">{wallet.error}</span>
              </div>
            )}

            {/* Connection Instructions */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  Connect Your Wallet
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Connect your wallet to interact with chazi-chain's smart contracts and manage your real estate investments.
                </p>
              </div>

              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <motion.button
                              onClick={openConnectModal}
                              disabled={wallet.isLoading}
                              whileHover={{ scale: wallet.isLoading ? 1 : 1.02 }}
                              whileTap={{ scale: wallet.isLoading ? 1 : 0.98 }}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {wallet.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Wallet className="h-5 w-5" />
                              )}
                              <span>{wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                            </motion.button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <motion.button
                              onClick={openChainModal}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <AlertCircle className="h-5 w-5" />
                              <span>Wrong Network - Switch to Supported Chain</span>
                            </motion.button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>

              <div className="text-xs text-gray-400">
                Supports MetaMask, WalletConnect, Coinbase Wallet, and more
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
