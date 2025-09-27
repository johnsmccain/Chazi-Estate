import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const WalletDebugPage: React.FC = () => {
  const wallet = useWallet();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleConnect = async () => {
    addLog('Starting wallet connection...');
    const result = await wallet.connectWallet();
    addLog(`Connection result: ${JSON.stringify(result)}`);
  };

  const handleDisconnect = () => {
    addLog('Disconnecting wallet...');
    wallet.disconnectWallet();
    addLog('Wallet disconnected');
  };

  const handleRefreshBalance = async () => {
    addLog('Refreshing balance...');
    try {
      const balance = await wallet.getAccountBalance();
      addLog(`Balance: ${balance} HBAR`);
    } catch (error) {
      addLog(`Balance error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Wallet Debug Page</h1>
        
        {/* Wallet Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Wallet Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Connected:</span>
                <span className={wallet.isConnected ? 'text-emerald-400' : 'text-red-400'}>
                  {wallet.isConnected ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Loading:</span>
                <span className={wallet.isLoading ? 'text-yellow-400' : 'text-gray-400'}>
                  {wallet.isLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Account ID:</span>
                <span className="text-white font-mono text-xs">
                  {wallet.accountId || 'Not connected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Balance:</span>
                <span className="text-white">
                  {wallet.accountBalance.toFixed(4)} HBAR
                </span>
              </div>
              {wallet.error && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Error:</span>
                  <span className="text-red-400 text-xs">{wallet.error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleConnect}
                disabled={wallet.isLoading || wallet.isConnected}
                className="w-full px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              
              <button
                onClick={handleDisconnect}
                disabled={!wallet.isConnected}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disconnect Wallet
              </button>
              
              <button
                onClick={handleRefreshBalance}
                disabled={!wallet.isConnected}
                className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Balance
              </button>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Debug Logs</h3>
          <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-400 text-sm">No logs yet. Try connecting your wallet.</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400 text-xs font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-3 px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-sm hover:bg-gray-500/30 transition-colors"
          >
            Clear Logs
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Debug Instructions</h3>
          <div className="text-blue-300 text-sm space-y-2">
            <p>1. Open your browser's developer console (F12)</p>
            <p>2. Click "Connect Wallet" and watch the console for detailed logs</p>
            <p>3. Check if HashPack wallet is installed and accessible</p>
            <p>4. Look for any error messages in the console</p>
            <p>5. The logs above will show the connection process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDebugPage;