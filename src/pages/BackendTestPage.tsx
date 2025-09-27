import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { useHedera } from '../hooks/useHedera';
import { apiService } from '../services/api';
import { 
  Server, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Zap,
  Building,
  DollarSign,
  Vote,
  CreditCard
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
}


const BackendTestPage: React.FC = () => {
  const { isConnected, accountId } = useWallet();
  const hedera = useHedera();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests: Array<{
      name: string;
      test: () => Promise<TestResult>;
    }> = [
      {
        name: 'Backend Health Check',
        test: async () => {
          try {
            const response = await apiService.getHealth();
            return {
              name: 'Backend Health Check',
              status: response.success ? 'success' : 'error',
              message: response.success ? 'Backend is healthy' : response.error,
              data: response.data
            };
          } catch (error) {
            return {
              name: 'Backend Health Check',
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      },
      {
        name: 'Contract Status Check',
        test: async () => {
          try {
            const response = await apiService.getContractStatus();
            return {
              name: 'Contract Status Check',
              status: response.success ? 'success' : 'error',
              message: response.success ? 'Contracts configured' : response.error,
              data: response.data
            };
          } catch (error) {
            return {
              name: 'Contract Status Check',
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      },
      {
        name: 'Property Query Test',
        test: async () => {
          try {
            const response = await apiService.testContractQuery('1');
            return {
              name: 'Property Query Test',
              status: response.success ? 'success' : 'error',
              message: response.success ? 'Property query successful' : response.error,
              data: response.data
            };
          } catch (error) {
            return {
              name: 'Property Query Test',
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      },
      {
        name: 'Transaction Test',
        test: async () => {
          try {
            const response = await apiService.testTransaction();
            return {
              name: 'Transaction Test',
              status: response.success ? 'success' : 'error',
              message: response.success ? 'Transaction capability available' : response.error,
              data: response.data
            };
          } catch (error) {
            return {
              name: 'Transaction Test',
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      }
    ];

    for (const test of tests) {
      const result = await test.test();
      setTestResults(prev => [...prev, result]);
      // Small delay between tests for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const testHederaHook = async () => {
    if (!isConnected || !accountId) {
      alert('Please connect your wallet first');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test getPropertyInfo
      const propertyResult = await hedera.getPropertyInfo('1');
      setTestResults(prev => [...prev, {
        name: 'Hedera Hook - Property Info',
        status: propertyResult.success ? 'success' : 'error',
        message: propertyResult.success ? 'Property info retrieved' : propertyResult.error,
        data: propertyResult.data
      }]);

      // Test getUserShares
      const sharesResult = await hedera.getUserShares(accountId, '1');
      setTestResults(prev => [...prev, {
        name: 'Hedera Hook - User Shares',
        status: sharesResult.success ? 'success' : 'error',
        message: sharesResult.success ? 'User shares retrieved' : sharesResult.error,
        data: sharesResult.data
      }]);

      // Test hasVotingPower
      const votingResult = await hedera.hasVotingPower(accountId, '1');
      setTestResults(prev => [...prev, {
        name: 'Hedera Hook - Voting Power',
        status: votingResult.success ? 'success' : 'error',
        message: votingResult.success ? 'Voting power checked' : votingResult.error,
        data: votingResult.data
      }]);

    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'Hedera Hook Test',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }

    setIsRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Server className="h-8 w-8 text-blue-400" />
          <span>Backend Integration Test</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Test the complete frontend-backend integration with your deployed Hedera smart contracts.
        </p>
      </motion.div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Database className="h-6 w-6 text-emerald-400" />
            <span>Backend Status</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Connection:</span>
              <span className="text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Base URL:</span>
              <span className="text-blue-300 font-mono text-sm">http://localhost:3001/api</span>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-purple-400" />
            <span>Wallet Status</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Connected:</span>
              <span className={isConnected ? "text-emerald-400" : "text-red-400"}>
                {isConnected ? "Yes" : "No"}
              </span>
            </div>
            {isConnected && accountId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Account:</span>
                <span className="text-blue-300 font-mono text-sm">
                  {accountId.substring(0, 8)}...{accountId.substring(accountId.length - 4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Test Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Test Controls</h3>
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={runTests}
            disabled={isRunning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Server className="h-5 w-5" />
                <span>Test Backend APIs</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={testHederaHook}
            disabled={isRunning || !isConnected}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-5 w-5" />
            <span>Test Hedera Hook</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  {result.status === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                  {result.status === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
                  {result.status === 'pending' && <Loader className="h-5 w-5 text-yellow-400 animate-spin" />}
                  <span className="text-white font-medium">{result.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${result.status === 'success' ? 'text-emerald-400' : result.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <p className="text-xs text-gray-400 mt-1">
                      {typeof result.data === 'object' ? JSON.stringify(result.data).substring(0, 100) + '...' : result.data}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contract Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Deployed Contracts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(hedera.getContractAddress('PropertyFactory') ? {
            PropertyFactory: hedera.getContractAddress('PropertyFactory'),
            PropertyDeed: hedera.getContractAddress('PropertyDeed'),
            PropertyToken: hedera.getContractAddress('PropertyToken'),
            DeedDAO: hedera.getContractAddress('DeedDAO'),
            RevenueDistributor: hedera.getContractAddress('RevenueDistributor'),
            LoanManager: hedera.getContractAddress('LoanManager')
          } : {}).map(([name, address]) => (
            <div key={name} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                {name.includes('Property') && <Building className="h-4 w-4 text-blue-400" />}
                {name.includes('DAO') && <Vote className="h-4 w-4 text-purple-400" />}
                {name.includes('Revenue') && <DollarSign className="h-4 w-4 text-emerald-400" />}
                {name.includes('Loan') && <CreditCard className="h-4 w-4 text-orange-400" />}
                <span className="text-white font-medium text-sm">{name}</span>
              </div>
              <p className="text-gray-300 font-mono text-xs break-all">{address}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BackendTestPage;