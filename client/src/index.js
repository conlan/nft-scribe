import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Web3ReactProvider,
  useWeb3React,
  // UnsupportedChainIdError
} from "@web3-react/core";
// import {
  // NoEthereumProviderError,
//   UserRejectedRequestError as UserRejectedRequestErrorInjected
// } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
// import { formatEther } from "@ethersproject/units";
import './index.css';

import {
  injected,
  // network
} from "./connectors";

import { useEagerConnect, useInactiveListener } from "./hooks";

const ethers = require('ethers');

const SCRIBE_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"dictator","type":"address","indexed":false},{"internalType":"address","name":"tokenAddress","type":"address","indexed":false},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"text","type":"string"}],"type":"event","anonymous":false,"name":"Record"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_text","type":"string"}],"name":"dictate","type":"function","constant":false,"outputs":[],"payable":false,"stateMutability":"nonpayable"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"documents","type":"function","constant":true,"outputs":[{"internalType":"address","name":"dictator","type":"address"},{"internalType":"string","name":"text","type":"string"},{"internalType":"uint256","name":"creationTime","type":"uint256"}],"payable":false,"stateMutability":"view"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"documentsCount","type":"function","constant":true,"outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view"},{"constant":true,"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getDocumentKey","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"}]
const ERC721_CONTRACT_ABI = [{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]

// const SCRIBE_CONTRACT_ADDRESS = "0x9831151655180132E6131AB35A82a5e32C149116" // Ropsten
const SCRIBE_CONTRACT_ADDRESS = "0x284Dc68Afe4b30793acb7507a0Ae029d91bf698e" // Goerli
// const SCRIBE_CONTRACT_ADDRESS = "..." // Mainnet

var currentTokenAddress = "";
var currentTokenId = 0;


const LoadingState = {
    UNLOADED: 0,
    LOADING_RECORDS: 1,
    LOADED: 2,
    SUBMITTING_DICTATION: 3
}

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

function getShortName(recordDictator) {
  return "0x33b93...3243"
}

function MyComponent() {  
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    // deactivate,
    // active,
    // error
  } = context;

  const [tokenDocuments, setTokenDocuments] = React.useState([]);
  
  const [loadingState, setLoadingState] = React.useState(LoadingState.UNLOADED)

  // create a list of record divs
  function createRecordList() {
    var recordList = []

    tokenDocuments.forEach(function(record) {
      var humanReadableTime = convertTimestampToHumanReadable(record.creationTime)

      // TODO automatically insert hyperlinks 
      var dictation = record.text;

      var networkName = getNetworkName(chainId)
      var recordLink = null;

      if (networkName === "Mainnet") {
        recordLink = "https://etherscan.io/address/" + record.dictator;
      } else {
        recordLink = "https://" + networkName + ".etherscan.io/address/" + record.dictator;        
      }

      if (record.ensName === null) {
        var shortName =  getShortName(record.dictator)

        recordList.push(<div className="record-line" key={dictation + record.creationTime.toString()}>
          <label className="record-line"><b><a href={recordLink} rel="noopener noreferrer" target="_blank">{shortName}</a></b><span className="timestamp"> • ({humanReadableTime})</span><br/><br/>{dictation}</label>
        </div>)
      } else {
        recordList.push(<div className="record-line" key={record.creationTime.toString()}>
          <label className="record-line"><b><a href={recordLink} rel="noopener noreferrer" target="_blank">{record.ensName}</a></b><span className="timestamp"> • ({humanReadableTime})</span><br/><br/>{dictation}</label>          
        </div>)
      }
      
      
    })

    if (recordList.length === 0) {
      recordList.push(<label key="0">No records found for this token.</label>)
    }

    return recordList;
  }

  // convert a UTC timestamp to something human readable
  function convertTimestampToHumanReadable(timestamp) {
    var nowSeconds = new Date().getTime() / 1000;
    
    var elapsedSeconds = Math.floor(nowSeconds - timestamp)

    var minutes = Math.floor(elapsedSeconds / 60)
    var hours = Math.floor(minutes / 60)
    var days = Math.floor(hours / 24)

    // TODO insert parentheses
    if (days > 0) {
      return days + " days ago";
    } else if (hours > 0) {
      return hours + " hours ago";
    } else if (minutes > 0) {
      return minutes + " min ago";
    } else if (elapsedSeconds > 0) {
      return elapsedSeconds + " seconds ago";
    } else {
      return "just recently"
    }
  }

  // get the currently inputted dictation text
  function getDictationInput() {
    var dictationField = document.getElementById("dictation")

    var dictation = dictationField.value.trim();

    if (dictation.length === 0) {
      return null;
    }
    return dictation;
  }

  // get the name of the network for a chain id
  function getNetworkName(chainId) {
    if (chainId === 1) {
      return "Mainnet"
    } else if (chainId === 5) {
      return "Goerli"
    } else {
      return "..."
    }
  }

  // Return the currently inputted token id
  function getTokenIDInput() {
    var tokenAddressField = document.getElementById("tokenId")

    var tokenId = tokenAddressField.value.trim()

    tokenId = parseInt(tokenId)

    if (isNaN(tokenId)) {
      return null;
    }

    return tokenId;
  }

  // 'https://api.opensea.io/api/v1/assets?token_ids=5477&asset_contract_address=0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0'
  // Return the currently inputted token address
  function getTokenAddressInput() {
    var tokenAddressField = document.getElementById("tokenAddress")

    var address = tokenAddressField.value;
    
    try {
      var checksumAddress = ethers.utils.getAddress(address)

      return checksumAddress;
    } catch (e) {
      return null;
    }    
  }

  // Retrieve the fast gas price from ETHGasStation
  function getGasPrice(callback) {
    fetch("https://ethgasstation.info/json/ethgasAPI.json").then(response => response.json()).then(response => {
      var gasPrice = response.fast

      // default gas price of 10 if we got an undefined response
      if (gasPrice === undefined) {
        gasPrice = 10
      } else {
        gasPrice = gasPrice / 10
      }

      callback(gasPrice)
    })
  }

  function checkValidDictation() {
    var dictation = getDictationInput();

    if (dictation === null) {
      window.alert("Please provide a dictation.")
      return false;
    }

    return true
  }

  async function submitDictation(gasPrice) {
    var dictation = getDictationInput();

    if (dictation === null) {
      window.alert("Please provide a dictation.")
      return
    }

    console.log("Submitting dictation...")

    // var provider = ethers.getDefaultProvider(chainId);

    var iface = new ethers.utils.Interface(SCRIBE_CONTRACT_ABI)

    // generate the call data for the dictation
    var calldata = iface.functions.dictate.encode(
      [currentTokenAddress, currentTokenId, dictation]
    )

    const tx = {
      to: SCRIBE_CONTRACT_ADDRESS,
      data: calldata,      
      gasPrice: ethers.utils.bigNumberify(gasPrice * 1000000000)
    }

    var signer = library.getSigner(account);

    // send the transaction
    try {
      await signer.sendTransaction(tx).then((tx) => {
        
        waitForTransaction(tx)       
      });
    } catch (error) {
      setLoadingState(LoadingState.LOADED)
    }
  }

  async function waitForTransaction(tx) {
    var provider = ethers.getDefaultProvider(chainId);

    await provider.waitForTransaction(tx.hash)

    loadToken()
  }

  async function loadToken() {
    var tokenAddress = getTokenAddressInput();
    
    if (tokenAddress == null) {
      window.alert("Please provide a valid ERC721 contract address.")
      return
    }

    var tokenId = getTokenIDInput()
    if (tokenId == null) {
      window.alert("Please provide a valid ERC721 token ID.") 
      return
    }

    setNFTSamplePreviewURL("")
    
    setLoadingState(LoadingState.LOADING_RECORDS)

    var provider = ethers.getDefaultProvider(chainId)
    
    var contract = new ethers.Contract(SCRIBE_CONTRACT_ADDRESS, SCRIBE_CONTRACT_ABI, provider)

    var documentKey = await contract.getDocumentKey(tokenAddress, tokenId)

    var numDocuments = (await contract.documentsCount(documentKey)).toString()

    var documents = []

    // TODO cache ENS names to avoid repeats    
    for (var i = 0; i < numDocuments; i++) {      
      var record = await contract.documents(documentKey, i)

      var checksumAddress = ethers.utils.getAddress("0x6fC21092DA55B392b045eD78F4732bff3C580e2c")
      
      // look up if there's an ENS name for this address
      record.ensName = await provider.lookupAddress(checksumAddress)

      documents.splice(0, 0, record)      
    }

    currentTokenAddress = tokenAddress;
    currentTokenId = tokenId;

    setNFTSamplePreviewURL("https://storage.opensea.io/0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0-preview/5477-1574363597.png")

    setTokenDocuments(documents)

    // check if we're the owner of this token
    var tokenContract = new ethers.Contract(currentTokenAddress, ERC721_CONTRACT_ABI, provider)

    var ownerOfTokenAddress = await tokenContract.ownerOf(currentTokenId)
    
    setIsTokenOwner(account === ownerOfTokenAddress)

    setLoadingState(LoadingState.LOADED)
  }

  const [isTokenOwner, setIsTokenOwner] = React.useState(false);

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
  // const [blockNumber, setBlockNumber] = React.useState();

  // React.useEffect(() => {
  //   if (library) {
  //     let stale = false;

  //     library
  //       .getBlockNumber()
  //       .then(blockNumber => {
  //         if (!stale) {
  //           setBlockNumber(blockNumber);
  //         }
  //       })
  //       .catch(() => {
  //         if (!stale) {
  //           setBlockNumber(null);
  //         }
  //       });

  //     // const updateBlockNumber = blockNumber => {
  //     //   setBlockNumber(blockNumber);
  //     // };
  //     // library.on("block", updateBlockNumber);

  //     return () => {
  //       library.removeListener("block", updateBlockNumber);
  //       stale = true;
  //       setBlockNumber(undefined);
  //     };
  //   }
  // }, [library, chainId]);

  // fetch eth balance of the connected account
  // const [ethBalance, setEthBalance] = React.useState();
  // React.useEffect(() => {
  //   if (library && account) {
  //     let stale = false;

  //     library
  //       .getBalance(account)
  //       .then(balance => {
  //         if (!stale) {
  //           setEthBalance(balance);
  //         }
  //       })
  //       .catch(() => {
  //         if (!stale) {
  //           setEthBalance(null);
  //         }
  //       });

  //     return () => {
  //       stale = true;
  //       setEthBalance(undefined);
  //     };
  //   }
  // }, [library, account, chainId]);



  return (
    <div>
      <br/>
      <label><i>NFT Scribe</i> is a ...</label>
      <hr/>
        <div className="center-header-images-container">
          <div className="inner-header-images">
            <img className="hero-image" src="scribe.gif" alt="Scribe"/>
            
            {(NFTSamplePreviewURL.length === 0) && (<img className="nft-overlay" alt="Outline" src="nft_outline.png"/>)}

            {(NFTSamplePreviewURL.length !== 0) && (<img alt="Token" className="nft-overlay" src={NFTSamplePreviewURL}/>)}

            {
              ((loadingState === LoadingState.LOADING_RECORDS) || (loadingState === LoadingState.SUBMITTING_DICTATION))
              && (<img alt="Spinner" className="loading-spinner" src="loading.gif"/>)
            }
            

          </div>
          </div>
        <br/>
          <div>
            <div className="main-section">
                <label><b>Token Address</b></label>
                  <input id="tokenAddress" placeholder="0x..." defaultValue="0x6Da7DD22A9c1B6bC7b2Ba9A540A37EC786E30eA7"/>
              
                <label><b>Token ID</b></label>
                  <input id="tokenId" type="number" placeholder="0, 1, 2, 3..." min="1" defaultValue="0"/>
            
              <div className="button-container">
                {!!(library && account) && (
                  <button disabled={(loadingState === LoadingState.LOADING_RECORDS)}  className="load-erc" onClick={() => {
                      loadToken();
                    }}
                  ><b>Load ERC721</b></button>
                )}
                {
                  (!!(library) === false) && (
                    <button className="connect-web3"  onClick={() => {
                      setActivatingConnector(injected);
                      activate(injected);
                    }}
                  >Connect to Web3</button>                  
                  )
                }
              </div>       


              {
                (loadingState !== LoadingState.UNLOADED) && (loadingState !== LoadingState.LOADING_RECORDS) && (isTokenOwner) &&
                  (<div>
                    <label><b>Dictation</b></label>                   
                    <input disabled={(loadingState === LoadingState.SUBMITTING_DICTATION)} id="dictation" placeholder="Let it be known..."/>
                    <div className="button-container">
                    
                      <button disabled={(loadingState === LoadingState.SUBMITTING_DICTATION)} className="submit-dictation" onClick={() => {
                        if (checkValidDictation()) {
                          setLoadingState(LoadingState.SUBMITTING_DICTATION)

                          getGasPrice(submitDictation)
                        }                        
                      }}><b>Submit Dictation</b></button>

                    </div>
                  </div>
                )
              }

              {
                ((loadingState === LoadingState.LOADED) || (loadingState === LoadingState.SUBMITTING_DICTATION)) && createRecordList()
              }
            </div>        
          </div>

      <hr/>        
        <label><b><a href="https://github.com/conlan/nft-scribe" target="_blank" rel="noopener noreferrer">Github</a></b> | <b><a href="https://github.com/conlan/nft-scribe" target="_blank" rel="noopener noreferrer">Contract</a></b> | <b><a href="https://twitter.com/conlan" target="_blank" rel="noopener noreferrer">@conlan</a></b> | </label>
        <span>⛓</span>
        <label>{getNetworkName(chainId)}</label>
        <br/>
        <br/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));


// Loading gif https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b