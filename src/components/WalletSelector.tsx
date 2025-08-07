import React from 'react';
import { WalletInfo } from '../types/wallet';
import { Wallet, Download, ExternalLink } from 'lucide-react';

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
  // Define all supported wallets with their installation/redirect URLs
  const supportedWallets = [
    { 
      name: 'MetaMask', 
      icon: '🦊',
      installUrl: 'https://metamask.io/download/',
      mobileDeepLink: 'https://metamask.app.link/dapp/',
    },
    { 
      name: 'Trust Wallet', 
      icon: '🔷',
      installUrl: 'https://trustwallet.com/',
      mobileDeepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
    },
    { 
      name: 'SafePal', 
      icon: '🛡️',
      installUrl: 'https://safepal.io/',
      mobileDeepLink: null,
    },
  ];

  // Check if a wallet is detected/available
  const isWalletDetected = (walletName: string) => {
    return wallets.some(wallet => wallet.name.toLowerCase().includes(walletName.toLowerCase()));
  };

  // Get detected wallet provider
  const getWalletProvider = (walletName: string) => {
    const detectedWallet = wallets.find(wallet => 
      wallet.name.toLowerCase().includes(walletName.toLowerCase())
    );
    return detectedWallet?.provider;
  };

  // Handle wallet action (connect or redirect)
  const handleWalletAction = (wallet: any) => {
    const isDetected = isWalletDetected(wallet.name);
    
    if (isDetected) {
      // Wallet is detected, connect to it
      const provider = getWalletProvider(wallet.name);
      if (provider) {
        onConnect(provider);
      }
    } else {
      // Wallet not detected, redirect to install or mobile app
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile && wallet.mobileDeepLink) {
        // Try to open mobile wallet app
        const currentUrl = window.location.href;
        const deepLinkUrl = wallet.mobileDeepLink + encodeURIComponent(currentUrl);
        window.open(deepLinkUrl, '_blank');
      } else {
        // Redirect to install page
        window.open(wallet.installUrl, '_blank');
      }
    }
  };

  // Get button text and style based on wallet status
  const getButtonProps = (walletName: string) => {
    const isDetected = isWalletDetected(walletName);
    
    if (isDetected) {
      return {
        text: isConnecting ? 'Connecting...' : 'Connect',
        className: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105',
        disabled: isConnecting,
        icon: null
      };
    } else {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return {
        text: isMobile ? 'Open App' : 'Install',
        className: 'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2',
        disabled: false,
        icon: isMobile ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />
      };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Connect Wallet
        </h3>
        
        <div className="space-y-3">
          {supportedWallets.map((wallet) => {
            const buttonProps = getButtonProps(wallet.name);
            const isDetected = isWalletDetected(wallet.name);
            
            return (
              <div
                key={wallet.name}
                className={`flex items-center justify-between p-4 backdrop-blur-sm rounded-lg border transition-all duration-200 ${
                  isDetected 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{wallet.name}</span>
                    <span className={`text-sm ${
                      isDetected ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {isDetected ? 'Detected' : 'Not installed'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleWalletAction(wallet)}
                  disabled={buttonProps.disabled}
                  className={buttonProps.className}
                >
                  {buttonProps.icon && <span>{buttonProps.icon}</span>}
                  <span>{buttonProps.text}</span>
                </button>
              </div>
            );
          })}
        </div>
        
        {wallets.length === 0 && (
          <p className="text-gray-400 text-sm mt-4 text-center">
            No wallets detected. Install a wallet extension to get started.
          </p>
        )}
      </div>
    </div>
  );
};