import { createConfig } from 'wagmi';
import { http } from 'viem';
import { base } from 'wagmi/chains';
import { getDefaultConfig } from "@daimo/pay";


export const config = createConfig(
  getDefaultConfig({
    // Your dApp's chains
    chains: [base],
    transports: {
      // RPC URL for each chain
      [base.id]: http('https://mainnet.base.org'),
    },
    // Required API Keys
    walletConnectProjectId: '669e001d23207377765d6c98b2d05be7',

    coinbaseWalletPreference: "eoaOnly",

    // Required App Info
    appName: 'Dgen1 Mint',

    // Optional App Info
    appDescription: 'Mint a Dgen1 NFT!',
    appUrl: 'https://mint.ethosmobile.org', // your app's url
    appIcon: 'https://assets-global.website-files.com/629fb11c1f7b33984fa82350/62bd8ab54a3a3790d382eb7d_favicon32.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);