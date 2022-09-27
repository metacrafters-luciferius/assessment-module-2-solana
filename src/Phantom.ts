import { PublicKey, Transaction } from "@solana/web3.js";

// create types
type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

// create a provider interface (hint: think of this as an object) to store the Phantom Provider
interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

class PhantomConnector {
    private _provider: PhantomProvider|undefined = undefined;
    wallet: PublicKey|undefined = undefined;

    get isAvailable() : boolean {
        return this._provider !== undefined;
    }

    get isConnected() : boolean {
        return this.wallet !== undefined;
    }

    initialize(): void {
        if ("solana" in window) {
            // @ts-ignore
            const provider = window.solana as any;
            if (provider.isPhantom){
                this._provider = provider as PhantomProvider;
            }
        }
    }

    async connect(): Promise<void> {
        if(!this._provider){
            throw Error("No Phantom provider initialized or found.");
        }

        try {
            // connects wallet and returns response which includes the wallet public key
            const response = await this._provider.connect();
            console.log('wallet account ', response.publicKey.toString());
                    // update walletKey to be the public key
            this.wallet = response.publicKey;
        } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
        }
    }
}

export {PhantomConnector};