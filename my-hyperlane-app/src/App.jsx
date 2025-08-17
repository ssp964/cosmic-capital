import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Assume standard ERC-20 ABI for WETH contract and HypERC20Collateral
// In a real application, you would import the specific ABIs.
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

// ABI for the HypERC20Collateral contract's transferRemote function
const transferAbi = [
  "function transferRemote(uint32 destinationDomain, bytes32 recipient, uint256 amount) external returns (uint256)"
];

// Define chain and token configurations for the UI.
// In a real app, this would be fetched from a registry.
const chainConfigs = {
  basesepolia: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    wethAddress: '0x4200000000000000000000000000000000000006',
    warpRouteContract: '0x37852c938d1F4BeA6e4A397C7C4B9539dB7AFe1CbDa' // MOCK ADDRESS
  },
  optimismsepolia: {
    chainId: 11155420,
    name: 'Optimism Sepolia',
    rpcUrl: 'https://sepolia.optimism.io',
    wethAddress: '0x4200000000000000000000000000000000000006',
    warpRouteContract: '0x3861d8b671e4A397C7C4B9539dB7AFe1CbDa' // MOCK ADDRESS
  },
};

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [sourceChain, setSourceChain] = useState('basesepolia');
  const [destinationChain, setDestinationChain] = useState('optimismsepolia');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for wallet connection on component mount
    if (window.ethereum) {
      const connectWallet = async () => {
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);

          const accounts = await newProvider.listAccounts();
          if (accounts.length > 0) {
            const newSigner = await newProvider.getSigner();
            const address = await newSigner.getAddress();
            setSigner(newSigner);
            setWalletAddress(address);
          }
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          setStatus("Failed to connect wallet.");
        }
      };
      connectWallet();
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask or a similar wallet is not installed.");
        return;
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      const address = await newSigner.getAddress();
      setProvider(newProvider);
      setSigner(newSigner);
      setWalletAddress(address);
      setStatus("Wallet connected successfully!");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setStatus("Wallet connection failed.");
    }
  };

  const handleTransfer = async () => {
    if (!signer || !amount || !walletAddress) {
      setStatus("Please connect your wallet and enter an amount.");
      return;
    }

    setLoading(true);
    setStatus('Initiating transfer...');

    try {
      // 1. Get contract instances on the source chain
      const sourceWethContract = new ethers.Contract(chainConfigs[sourceChain].wethAddress, erc20Abi, signer);
      const warpRouteContract = new ethers.Contract(chainConfigs[sourceChain].warpRouteContract, transferAbi, signer);

      // Get WETH decimals to format the amount correctly
      const decimals = await sourceWethContract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);

      // 2. Approve the Warp Route contract to spend WETH
      setStatus('Approving token transfer...');
      const approveTx = await sourceWethContract.approve(chainConfigs[sourceChain].warpRouteContract, amountInWei);
      await approveTx.wait();
      setStatus(`Approval confirmed! TX Hash: ${approveTx.hash}`);

      // 3. Initiate the cross-chain transfer
      setStatus('Executing cross-chain transfer...');
      const recipientBytes32 = ethers.AbiCoder.defaultAbiCoder().encode(['address'], [walletAddress]);
      const transferTx = await warpRouteContract.transferRemote(
        chainConfigs[destinationChain].chainId,
        recipientBytes32,
        amountInWei
      );
      await transferTx.wait();
      setStatus(`Transfer successful! TX Hash: ${transferTx.hash}`);

    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus(`Transfer failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-white font-inter">Hyperlane Bridge</h1>
        
        {walletAddress ? (
          <div className="mb-6 text-center text-sm text-gray-400">
            Connected as: <span className="font-mono text-white break-all">{walletAddress}</span>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-105"
          >
            Connect Wallet
          </button>
        )}

        {walletAddress && (
          <div className="space-y-4">
            <div>
              <label htmlFor="sourceChain" className="block text-sm font-medium text-gray-400 mb-1">From</label>
              <select
                id="sourceChain"
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="basesepolia">{chainConfigs.basesepolia.name}</option>
              </select>
            </div>

            <div>
              <label htmlFor="destinationChain" className="block text-sm font-medium text-gray-400 mb-1">To</label>
              <select
                id="destinationChain"
                value={destinationChain}
                onChange={(e) => setDestinationChain(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="optimismsepolia">{chainConfigs.optimismsepolia.name}</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={handleTransfer}
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-xl transition duration-300 transform ${
                loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'
              } text-white`}
            >
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        )}

        {status && (
          <div className="mt-4 p-3 bg-gray-700 rounded-xl text-sm text-gray-300 break-words">
            Status: {status}
          </div>
        )}
      </div>
    </div>
  );
}

