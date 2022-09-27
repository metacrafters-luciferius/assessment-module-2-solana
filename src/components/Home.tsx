import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Typography, Button, Link } from '@mui/material';
import { Keypair } from '@solana/web3.js';
import { PhantomConnector } from '../Phantom';

interface HomeProps {
    version: String;
    fromWalletAddress: Keypair|undefined;
    createWallet: Function;
    transferSol: Function;
}

const Home: FunctionComponent<HomeProps> = ({version, fromWalletAddress, createWallet, transferSol}) => {  
  const connector = useMemo(() => new PhantomConnector(), []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, rerender] = useState(Date.now());

  useEffect(() => {
    connector.initialize();
  }, [connector]);

  async function connectPhantom() : Promise<void> {
    if(!connector.isAvailable){
      console.error("Phantom is not installed.");
    }

    await connector.connect();
    rerender(Date.now());
  }

  return (
    <>
      <div className="my-4 flex flex-col">
        <Typography variant="h3" component="h1" gutterBottom>
          Hello Solana - {version}
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Step 1 - Create new wallet
        </Typography>
        <Typography variant="body1" component="p" className='my-4'>
          Create a new wallet by creating a new keypair and airdropping 2 SOL into the wallet.
        </Typography>
        {!fromWalletAddress && (
          <Button onClick={() => createWallet()} variant="contained">
            Create a new Solana account
          </Button>
        )}
        {fromWalletAddress && (
          <>
            <Typography variant="h5" component="p" className='my-4'>
              Created Wallet: {fromWalletAddress.publicKey.toString()}
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Step 2 - Connect Phantom Wallet
            </Typography>
            {connector.isAvailable && !connector.isConnected && (
                <>
                  <Typography variant="body1" component="p" className='my-4'>
                    Click below to connect to your Phantom Wallet.
                  </Typography>
                  <Button onClick={() => connectPhantom()} variant="contained">
                    Connect to Phantom Wallet
                  </Button>
                </>
            )}
            {!connector.isAvailable && (
                <Typography variant="body1" component="p" className='my-4'>
                  No provider found. Install{" "} <Link href='https://phantom.app/'>Phantom Browser extension</Link>
                </Typography>
            )}
            {connector.isConnected && (
              <>
                <Typography variant="body1" component="p" className='my-4'>
                  Connected phantom wallet: {connector.wallet?.toString()}
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                  Step 3 - Transfer SOL
                </Typography>
                <Typography variant="body1" component="p" className='my-4'>
                  Click below to transfer SOL from the created wallet to the Phantom Wallet address.
                </Typography>
                <Button onClick={() => transferSol(connector.wallet)} variant="contained">
                  Transfer to new wallet
                </Button>
              </>
            )}
          </>
        )}
      </div>
      
    </>
  );
};

export default Home;
