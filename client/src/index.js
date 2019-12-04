import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import './index.css';

import {
  injected,
  network
} from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hooks";

const ethers = require('ethers');

const SCRIBE_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"dictator","type":"address","indexed":false},{"internalType":"address","name":"tokenAddress","type":"address","indexed":false},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"text","type":"string"}],"type":"event","anonymous":false,"name":"Record"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_text","type":"string"}],"name":"dictate","type":"function","constant":false,"outputs":[],"payable":false,"stateMutability":"nonpayable"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"documents","type":"function","constant":true,"outputs":[{"internalType":"address","name":"dictator","type":"address"},{"internalType":"string","name":"text","type":"string"},{"internalType":"uint256","name":"creationTime","type":"uint256"}],"payable":false,"stateMutability":"view"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"documentsCount","type":"function","constant":true,"outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view"},{"constant":true,"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getDocumentKey","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"}]

// const SCRIBE_CONTRACT_ADDRESS = "0x9831151655180132E6131AB35A82a5e32C149116" // Ropsten
const SCRIBE_CONTRACT_ADDRESS = "0x284Dc68Afe4b30793acb7507a0Ae029d91bf698e" // Goerli
// const SCRIBE_CONTRACT_ADDRESS = "..." // Mainnet



const LoadingState = {
    UNLOADED: 0,
    LOADING_RECORDS: 1,
    LOADED: 2,
    SUBMITTING_DICTATION: 3
}

const connectorsByName = {
  Injected: injected,
  Network: network
};

// function getErrorMessage(error) {
//   if (error instanceof NoEthereumProviderError) {
//     return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network.";
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected
//   ) {
//     return "Please authorize this website to access your Ethereum account.";
//   } else {
//     console.error(error);
//     return "An unknown error occurred. Check the console for more details.";
//   }
// }

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MyComponent />
    </Web3ReactProvider>
  );
}

function MyComponent() {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;

  const [tokenDocuments, setTokenDocuments] = React.useState([]);
  
  const [loadingState, setLoadingState] = React.useState(LoadingState.UNLOADED)

  function createDocumentTable() {
    var documentTable = []

    tokenDocuments.forEach(function(record) {
      var humanReadableTime = convertTimestampToHumanReadable(record.creationTime)

      // TODO automatically insert hyperlinks 
      documentTable.push(<label key={humanReadableTime}>{record.dictator} - {record.text} - {humanReadableTime} </label>)
    })

    return documentTable;
  }

  // 'https://api.opensea.io/api/v1/assets?token_ids=5477&asset_contract_address=0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0'
  function getTokenAddress() {
    var tokenAddressField = document.getElementById("tokenAddress")

    var address = tokenAddressField.value;
    
    try {
      var checksumAddress = ethers.utils.getAddress(address)

      return address;
    } catch (e) {
      return null;
    }    
  }

  function convertTimestampToHumanReadable(timestamp) {
    return "2hr ago"
  }

  function getTokenID() {
    var tokenAddressField = document.getElementById("tokenId")

    var tokenId = tokenAddressField.value.trim()

    tokenId = parseInt(tokenId)

    if (isNaN(tokenId)) {
      return null;
    }

    return tokenId;
  }

  async function loadToken() {
    var tokenAddress = getTokenAddress();
    
    if (tokenAddress == null) {
      window.alert("Please provide a valid ERC721 contract address.")
      return
    }

    var tokenId = getTokenID()
    if (tokenId == null) {
      window.alert("Please provide a valid ERC721 token ID.") 
      return
    }

    setLoadingState(LoadingState.LOADING_RECORDS)
    
    let provider = ethers.getDefaultProvider(chainId);

    var contract = new ethers.Contract(SCRIBE_CONTRACT_ADDRESS, SCRIBE_CONTRACT_ABI, provider)

    var documentKey = await contract.getDocumentKey(tokenAddress, tokenId)

    var numDocuments = (await contract.documentsCount(documentKey)).toString()

    var documents = []

    // TODO cache ENS names to avoid repeats    
    for (var i = 0; i < numDocuments; i++) {      
      var record = await contract.documents(documentKey, i)

      console.log(record.dictator)

      var checksumAddress = ethers.utils.getAddress("0x6fC21092DA55B392b045eD78F4732bff3C580e2c")
      
      // look up if there's an ENS name for this address
      record.ensName = await provider.lookupAddress(checksumAddress)

      documents.splice(0, 0, record)      
    }

    setTokenDocuments(documents)

    setLoadingState(LoadingState.LOADED)
  }

  const [NFTSamplePreviewURL, setNFTSamplePreviewURL] = React.useState("");

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // set up block listener
  const [blockNumber, setBlockNumber] = React.useState();
  React.useEffect(() => {
    if (library) {
      let stale = false;

      library
        .getBlockNumber()
        .then(blockNumber => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = blockNumber => {
        setBlockNumber(blockNumber);
      };
      library.on("block", updateBlockNumber);

      return () => {
        library.removeListener("block", updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]);

  // fetch eth balance of the connected account
  const [ethBalance, setEthBalance] = React.useState();
  React.useEffect(() => {
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then(balance => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
  }, [library, account, chainId]);

  return (
    <div>
      <label><i>NFT Scribe</i> is a ...</label>
      <hr/>
        <div className="center-header-images-container">
          <div className="inner-header-images">
            <img className="hero-image" src="scribe.jpg" alt="Scribe image"/>
            
            {(NFTSamplePreviewURL.length === 0) && (<img className="nft-overlay" src="nft_outline.png"/>)}

            {
              (loadingState === LoadingState.LOADING_RECORDS) && (<img className="loading-spinner" src="loading.gif"/>)
            }

            {(NFTSamplePreviewURL.length !== 0) && (<img className="nft-overlay" src={NFTSamplePreviewURL}/>)}
            

          </div>
          </div>
        <br/>
          <div>
            <div className="input-section">
              <label><b>Token Address</b></label>
                <input id="tokenAddress" placeholder="0x..."/>
              
              <label><b>Token ID</b></label>
                <input id="tokenId" type="number" placeholder="0, 1, 2, 3..." min="1" defaultValue="0"/>
            
              <div className="load-token-container">
                {!!(library && account) && (loadingState !== LoadingState.LOADING_RECORDS) && (
                  <button onClick={() => {
                      loadToken();
                    }}
                  ><b>Load ERC721</b></button>
                )}
                {
                  (!!(library) === false) && (
                  <p>TODO - button to connect to Web3</p>
                  )
                }
              </div>
            </div>

                      
            <div className="document-table">
              {
                (loadingState === LoadingState.LOADED) && createDocumentTable()
              }
            </div>        
          </div>

      <hr/>        
        <label>Github | Contract | @conlan | ThanksForTheCoffee.eth </label>
        <span>⛓</span>
<label>{chainId === undefined ? "..." : chainId}        </label>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));


// Loading gif https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b