import React from 'react';
import { WalletInfo } from '../types/wallet';
import { Wallet } from 'lucide-react';

interface WalletSelectorProps {
  wallets: WalletInfo[];
  onConnect: (provider: any) => void;
  isConnecting: boolean;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  wallets,
  onConnect,
  isConnecting,
}) => {
  const handleConnect = (provider: any, walletName: string) => {
    try {
      onConnect(provider);
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
    }
  };

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Wallets Found</h3>
        <p className="text-gray-400 text-sm mb-4">
          Please install a wallet extension like MetaMask, Trust Wallet, or SafePal to continue.
        </p>
        <div className="space-y-2 text-xs text-gray-500">
          <p>• MetaMask: Most popular Ethereum wallet</p>
          <p>• Trust Wallet: Multi-chain mobile wallet</p>
          <p>• SafePal: Hardware and software wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Connect Your Wallet
        </h3>
        
        <div className="space-y-3">
          {wallets.map((wallet, index) => (
            <div
              key={`${wallet.name}-${index}`}
              className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-white/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{wallet.name}</span>
                  <span className="text-sm text-green-400">
                    {wallet.isInstalled ? 'Ready to connect' : 'Not installed'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleConnect(wallet.provider, wallet.name)}
                disabled={isConnecting || !wallet.isInstalled}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100"
              >
                {isConnecting ? 'Connecting...' : wallet.isInstalled ? 'Connect' : 'Install'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Connection Requirements</h4>
          <div className="text-blue-300 text-sm space-y-1">
            <p>• Your wallet will be connected to BSC Testnet</p>
            <p>• You'll need testnet BNB for gas fees</p>
            <p>• Minimum 0.30 USDT required for distribution</p>
            <p>• All transactions are on testnet (no real funds)</p>
          </div>
        </div>
      </div>
    </div>
  );
};