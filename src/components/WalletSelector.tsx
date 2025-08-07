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
  // Enhanced wallet detection - check for actual providers in window object
  const detectWallets = () => {
    const detectedWallets = [];

    // Check MetaMask
    if (typeof window !== 'undefined' && window.ethereum?.isMetaMask) {
      detectedWallets.push({
        name: 'MetaMask',
        icon: '🦊',
        provider: window.ethereum,
        id: 'metamask'
      });
    }

    // Check Trust Wallet
    if (typeof window !== 'undefined' && window.ethereum?.isTrust) {
      detectedWallets.push({
        name: 'Trust Wallet',
        icon: '🔷',
        provider: window.ethereum,
        id: 'trustwallet'
      });
    }

    // Check Xverse (Bitcoin wallet)
    if (typeof window !== 'undefined' && window.XverseProviders?.BitcoinProvider) {
      detectedWallets.push({
        name: 'Xverse',
        icon: '⚡',
        provider: window.XverseProviders.BitcoinProvider,
        id: 'xverse'
      });
    }

    // Check SafePal
    if (typeof window !== 'undefined' && window.safepalProvider) {
      detectedWallets.push({
        name: 'SafePal',
        icon: '🛡️',
        provider: window.safepalProvider,
        id: 'safepal'
      });
    }

    // Check Phantom (Solana wallet)
    if (typeof window !== 'undefined' && window.phantom?.solana) {
      detectedWallets.push({
        name: 'Phantom',
        icon: '👻',
        provider: window.phantom.solana,
        id: 'phantom'
      });
    }

    // Check Coinbase Wallet
    if (typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet) {
      detectedWallets.push({
        name: 'Coinbase Wallet',
        icon: '🔵',
        provider: window.ethereum,
        id: 'coinbase'
      });
    }

    // Fallback: use the provided wallets array if our detection missed something
    wallets.forEach(wallet => {
      const exists = detectedWallets.some(detected => 
        detected.name.toLowerCase().includes(wallet.name.toLowerCase()) ||
        wallet.name.toLowerCase().includes(detected.name.toLowerCase())
      );
      
      if (!exists && wallet.provider) {
        detectedWallets.push({
          name: wallet.name,
          icon: wallet.icon || '🔗',
          provider: wallet.provider,
          id: wallet.name.toLowerCase().replace(/\s+/g, '')
        });
      }
    });

    return detectedWallets;
  };

  const detectedWallets = detectWallets();

  const handleConnect = (provider: any, walletName: string) => {
    try {
      onConnect(provider);
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
    }
  };

  if (detectedWallets.length === 0) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Wallets Found</h3>
        <p className="text-gray-400 text-sm">
          Please install a wallet extension like MetaMask, Trust Wallet, or Xverse to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Available Wallets ({detectedWallets.length})
        </h3>
        
        <div className="space-y-3">
          {detectedWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-4 bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-500/30 transition-all duration-200 hover:bg-green-500/15"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{wallet.name}</span>
                  <span className="text-sm text-green-400">Ready to connect</span>
                </div>
              </div>
              
              <button
                onClick={() => handleConnect(wallet.provider, wallet.name)}
                disabled={isConnecting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};