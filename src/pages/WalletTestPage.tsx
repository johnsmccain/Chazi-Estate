import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHedera } from '../hooks/useHedera';
import { WalletConnection } from '../components/WalletConnection';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const WalletTestPage: React.FC = () => {
  const hedera = useHedera();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testContractInteraction = async () => {
    if (!hedera.isConnected) {
      setTestResult('Please connect your wallet first');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Test getting property info
      const result = await hedera.getPropertyInfo('1');
      
      if (result.success) {
        setTestResult(`✅ Successfully queried contract! Property: ${result.data?.name || 'Unknown'}`);
      } else {
        setTestResult(`❌ Contract query failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const copyAccountId = async () => {
    if (hedera.account) {
      await navigator.clipboard.writeText(hedera.account);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Wallet className="h-8 w-8 text-emerald-400" />
          <span>Wallet Integration Test</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Test your Hedera wallet connection and smart contract interactions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WalletConnection />
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span>Connection Status</span>
          </h3>

          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Wallet Connected:</span>
              <div className="flex items-center space-x-2">
                {hedera.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={hedera.isConnected ? 'text-emerald-400' : 'text-red-400'}>
                  {hedera.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Account ID */}
            {hedera.account && (
              <div>
                <span className="text-gray-300 block mb-2">Account ID:</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm">
                    {hedera.account}
                  </div>
                  <motion.button
                    onClick={copyAccountId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Balance */}
            {hedera.isConnected && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Balance:</span>
                <div className="flex items-center space-x-2">
                  <RefreshCw 
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white transition-colors"
                    onClick={() => hedera.getAccountBalance?.()}
                  />
                  <span className="text-white font-semibold">
                    {hedera.balance} HBAR
                  </span>
                </div>
              </div>
            )}

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Network:</span>
              <span className="text-white">{hedera.networkInfo.network}</span>
            </div>

            {/* Chain ID */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Chain ID:</span>
              <span className="text-white">{hedera.networkInfo.chainId}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contract Interaction Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-blue-400" />
          <span>Contract Interaction Test</span>
        </h3>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Test your wallet's ability to interact with the deployed smart contracts.
          </p>

          <motion.button
            onClick={testContractInteraction}
            disabled={!hedera.isConnected || isTesting}
            whileHover={{ scale: hedera.isConnected && !isTesting ? 1.02 : 1 }}
            whileTap={{ scale: hedera.isConnected && !isTesting ? 0.98 : 1 }}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span>
              {isTesting 
                ? 'Testing Contract...' 
                : hedera.isConnected 
                  ? 'Test Contract Interaction' 
                  : 'Connect Wallet First'
              }
            </span>
          </motion.button>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                testResult.includes('✅') 
                  ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300'
                  : 'bg-red-500/10 border-red-400/20 text-red-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {testResult.includes('✅') ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className="font-medium">{testResult}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Contract Addresses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <ExternalLink className="h-5 w-5 text-purple-400" />
          <span>Deployed Contract Addresses</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(hedera.getContractAddress).map(([name, address]) => (
            <div key={name} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium">{name}</span>
                <motion.a
                  href={`${hedera.networkInfo.explorerUrl}/contract/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.a>
              </div>
              <div className="text-white font-mono text-sm break-all">
                {address}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WalletTestPage;