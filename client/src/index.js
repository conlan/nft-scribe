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

const ERC721_CONTRACT_ABI_BALANCE_SINGLE = [ { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]
const ERC721_CONTRACT_ABI_BALANCE_MULTIPLE = [ { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]

const SCRIBE_CONTRACT_ADDRESS_ROPSTEN = "0x9831151655180132E6131AB35A82a5e32C149116" // Ropsten
const SCRIBE_CONTRACT_ADDRESS_GOERLI = "0x284Dc68Afe4b30793acb7507a0Ae029d91bf698e" // Goerli
const SCRIBE_CONTRACT_ADDRESS_MAINNET = "0xC207efACb12a126D382fA28460BB815F336D845f" // Mainnet
const SCRIBE_CONTRACT_ADDRESS_POLYGON = "0x1224110880FC42b49Ae08AA4E8B753337b356f4F"; // Mainnet

const CHAIN_ID_MAINNET_ETHEREUM = 1;
const CHAIN_ID_TESTNET_ROPSTEN = 3;
const CHAIN_ID_TESTNET_GOERLI = 5;
const CHAIN_ID_MAINNET_POLYGON = 137;

const APP_VERSION = "1.1.2";

var currentTokenAddress = "";
var currentTokenId = 0;

var didCheckForURLParams = false;
var isWaitingForValidChainToAutoload = false;

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
  var maxLength = 20;  

  if (recordDictator.length > maxLength) {
    recordDictator = recordDictator.substring(0, maxLength / 2) + "..." + 
      recordDictator.substring(recordDictator.length - (maxLength /2), recordDictator.length)
  }

  return recordDictator;
}

function MyComponent(props) {  
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
      var recordLink = getBlockchainExplorerAddress(record.dictator);

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

    if (days > 0) {
      if (days === 1) {
        return days + " day ago";
      } else {
        return days + " days ago";
      }
    } else if (hours > 0) {
      if (hours === 1) {
        return hours + " hour ago";
      } else {
        return hours + " hours ago";
      }
    } else if (minutes > 0) {
      return minutes + " min ago";
    } else if (elapsedSeconds > 0) {
      if (elapsedSeconds === 1) {
        return elapsedSeconds + " second ago";
      } else {
        return elapsedSeconds + " seconds ago";
      }
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

  function getScribeContractAddress() {    
    if (chainId === CHAIN_ID_MAINNET_ETHEREUM) {
      return SCRIBE_CONTRACT_ADDRESS_MAINNET;
    } else if (chainId === CHAIN_ID_TESTNET_ROPSTEN) {
      return SCRIBE_CONTRACT_ADDRESS_ROPSTEN
    } else if (chainId === CHAIN_ID_TESTNET_GOERLI) {
      return SCRIBE_CONTRACT_ADDRESS_GOERLI;
    } else if (chainId === CHAIN_ID_MAINNET_POLYGON) {
      return SCRIBE_CONTRACT_ADDRESS_POLYGON;
    }

    return ""
  }

  // get the name of the network for a chain id
  function getNetworkName(chainId) {
    if (chainId === CHAIN_ID_MAINNET_ETHEREUM) {
      return "Mainnet - Ethereum"
    } else if (chainId === CHAIN_ID_TESTNET_GOERLI) {
      return "Testnet - Goerli"
    } else if (chainId === CHAIN_ID_MAINNET_POLYGON) {
      return "Mainnet - Polygon"
    } else {
      return "..."
    }
  }

  function cleanTokenInput(tokenIdCandidate) {
    var tokenId = parseInt(tokenIdCandidate)

    if ((isNaN(tokenId)) || (tokenId < 0)) {
      return null;    
    }

    return tokenIdCandidate;
  }

  // Return the currently inputted token id
  function getTokenIDInput() {
    var tokenAddressField = document.getElementById("tokenId")

    var tokenId = tokenAddressField.value.trim()

    return cleanTokenInput(tokenId)
  }

  function cleanAddressInput(tokenAddressCandidate) {
    try {
      var checksumAddress = ethers.utils.getAddress(tokenAddressCandidate)

      return checksumAddress;
    } catch (e) {
      return null;
    } 
  }
  
  // Return the currently inputted token address
  function getTokenAddressInput() {    
    var tokenAddressField = document.getElementById("tokenAddress")

    var address = tokenAddressField.value;

    return cleanAddressInput(address)  
  }

  // Retrieve the fast gas price from ETHGasStation
  function getGasPrice(callback) {
    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      callback(0)
    } else {
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

    var iface = new ethers.utils.Interface(SCRIBE_CONTRACT_ABI)

    // generate the call data for the dictation
    var calldata = iface.functions.dictate.encode(
      [currentTokenAddress, currentTokenId, dictation]
    )

    const tx = {
      to: getScribeContractAddress(),
      data: calldata
    }     

    if (gasPrice > 0) {
      tx.gasPrice = ethers.utils.bigNumberify(gasPrice * 1000000000)
    }

    var signer = library.getSigner(account);

    // send the transaction
    try {
      await signer.sendTransaction(tx).then((tx) => {
        
        waitForTransaction(tx)       
      });
    } catch (error) {
      setLoadingState(LoadingState.LOADED)

      window.alert(error)
    }
  }

  async function waitForTransaction(tx) {
    var provider = getBlockchainProvider();

    await provider.waitForTransaction(tx.hash)

    setLoadingState(LoadingState.LOADING_RECORDS)

    loadToken()
  }

  function checkValidToken() {
    var tokenAddress = getTokenAddressInput();

    var errorMessageSuffix = null;

    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      errorMessageSuffix = " for an ERC721 or ERC1155 contract deployed on " + getNetworkName(chainId) + ".";
    } else {
      errorMessageSuffix = " for an ERC721 contract deployed on " + getNetworkName(chainId) + ".";
    }
    
    if (tokenAddress == null) {
      window.alert("Please provide a valid address" + errorMessageSuffix);
      return false
    }

    var tokenId = getTokenIDInput()
    if (tokenId == null) {
      window.alert("Please provide a valid tokenID" + errorMessageSuffix);
      return false
    }

    return true;
  }

  function getTitleFromOpenSeaAsset(asset, tokenId) {
    if (asset.name === null) {
      if (asset.asset_contract !== null) {
        if (asset.asset_contract.name !== null) {
          return asset.asset_contract.name + " #" + tokenId
        }
      }
    } else {
      return asset.name;
    }
  }

  function getPreviewFromOpenSeaAsset(asset) {    
    if (asset.image_preview_url === null) {
      return ""; 
    }    

    return asset.image_preview_url;
  }

  function loadTokenPreview(callback) {  
    // reset preview and title
    setNFTPreviewData({
    	url : "",
    	title : ""
    })

    var tokenId = getTokenIDInput();

    var tokenAddress = getTokenAddressInput();

    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      loadTokenPreviewPolygon(tokenId, tokenAddress, callback);
    } else {
      loadTokenPreviewEthereum(tokenId, tokenAddress, callback);
    }
  }

  function handlePolygonTokenURI(tokenUri, tokenId, tokenAddress, callback) {
    console.log(tokenId)
    console.log(tokenUri)
    console.log(typeof(tokenUri))

    if (tokenUri.startsWith("https://arweave.net/")) {
      tokenUri = tokenUri.replace("https://arweave.net/", "https://ccskfx3osc4pyxbh6ix7m7lqq2glfzaijilcgc6usjh3zcu3vafa.arweave.net/");
      console.log(tokenUri)
    }

    if (tokenUri.includes("https://api.opensea.io/api/v2/metadata/matic/")) {
      tokenUri = "https://api.opensea.io/api/v2/metadata/matic/" + tokenAddress + "/" + tokenId;
      console.log(tokenUri)
    }

    if (tokenUri.includes("{id}")) {
      tokenUri = tokenUri.replace("{id}", tokenId);
      console.log(tokenUri)
    }

    if (tokenUri.startsWith("ipfs://")) {
      tokenUri = tokenUri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
      console.log(tokenUri)
    }

    var previewURL = "";
    var nftTitle = "";

    try {
      fetch(tokenUri).then(response => response.json()).then(response => {
        let tokenUriParsed = response;

        console.log(tokenUriParsed)

        if (!!tokenUriParsed.image) {

          if (tokenUriParsed.image.startsWith("ipfs://")) {
            tokenUriParsed.image = tokenUriParsed.image.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
            console.log(tokenUriParsed.image)
          } else if (tokenUriParsed.image.startsWith("https://arweave.net/")) {
            tokenUriParsed.image = tokenUriParsed.image.replace("https://arweave.net/", "https://ccskfx3osc4pyxbh6ix7m7lqq2glfzaijilcgc6usjh3zcu3vafa.arweave.net/");
            console.log(tokenUriParsed.image)
          }

          setNFTPreviewData({
            url : tokenUriParsed.image,
            title : tokenUriParsed.name
          })
        }   
      });

      callback().catch(error => {
        window.alert(error)

        resetToUnloadedState();
      });  
    } catch (e) {
      // ignore error, many tokens will error since not a json object
      console.log(e);
    }
  }

  function loadTokenPreviewPolygon(tokenId, tokenAddress, callback) {
    var tokenContract = new ethers.Contract(tokenAddress, ERC721_CONTRACT_ABI_BALANCE_SINGLE, getBlockchainProvider());

    tokenContract.uri(tokenId).then(tokenUri => {
      handlePolygonTokenURI(tokenUri, tokenId, tokenAddress, callback);   
    }).catch((e) => {
      tokenContract.tokenURI(tokenId).then(tokenUri => {
        handlePolygonTokenURI(tokenUri, tokenId, tokenAddress, callback);   
      }).catch((e) => {
        console.log(e)
      })
    })
  }

  function getBlockchainProvider() {
    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      return new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    } else {
      return ethers.getDefaultProvider(chainId);
    }
  }


  function loadTokenPreviewEthereum(tokenId, tokenAddress, callback) {
    // TODO insert developer API Key
    var openseaURL = "https://api.opensea.io/api/v1/assets?token_ids=" + tokenId + "&asset_contract_address=" + tokenAddress;

    console.log(openseaURL)
                        
    fetch(openseaURL, {
      crossDomain:true,
      method: 'GET',
      headers: {'Content-Type':'application/json'},      
    }).then(response => response.json()).then(response => {
    	var previewURL = "";
    	var nftTitle = "";

		  console.log(response)

  		if (response.assets.length > 0) {        
  			if (getPreviewFromOpenSeaAsset(response.assets[0]).length !== 0) {
  				previewURL = getPreviewFromOpenSeaAsset(response.assets[0]);
  			}

  			nftTitle = getTitleFromOpenSeaAsset(response.assets[0], tokenId);
  		} else {
  			previewURL = "image-not-found.png";
  			nftTitle = "n/a"			
  		}

  		setNFTPreviewData({
  			url : previewURL,
  			title : nftTitle
  		})

  		callback().catch(error => {
  		  window.alert(error)

  		  resetToUnloadedState();
  		});

		  // Get the details from the token URI
	 	 var tokenContract = new ethers.Contract(tokenAddress, ERC721_CONTRACT_ABI_BALANCE_SINGLE, getBlockchainProvider())

  		tokenContract.tokenURI(tokenId).then(tokenUri => {
  		  try {
  		    let tokenUriParsed = JSON.parse(tokenUri)

  		    if (!!tokenUriParsed.ipfs) {
  		    	setNFTPreviewData({
  	  		  	url : "https://ipfs.infura.io/ipfs/" + tokenUriParsed.ipfs,
  		  			title : nftTitle
  		  		})
  		    }        
  		  } catch (e) {
  		    // ignore error, many tokens will error since not a json object
  		  }
  		}).catch((e) => {
  		  // ignore error, any token that doesn't have the `tokenURI` function will fail here.
  		})
      }).catch(error => {      
        window.alert(error)

        resetToUnloadedState();
    })
  }

  function resetToUnloadedState() {
    // reset preview and title
    setNFTPreviewData({
		url : "",
		title : ""
	})

    setLoadingState(LoadingState.UNLOADED)
  }

  function generateShareLink() {
      var tokenId = getTokenIDInput();
      var tokenAddress = getTokenAddressInput();

      return "https://conlan.github.io/nft-scribe/?address=" + tokenAddress + "&id=" + tokenId;
  }

  function getTwitterUserForContract(tokenAddress) {
  	tokenAddress = tokenAddress.toLowerCase();

  	// TODO put these in a file somewhere
  	if ((tokenAddress === "0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0".toLowerCase()) ||
  		(tokenAddress === "0x41A322b28D0fF354040e2CbC676F0320d8c8850d".toLowerCase())) {
  		return "SuperRare_co";
  	} else if (tokenAddress === "0x1d963688FE2209A98dB35C67A041524822Cf04ff".toLowerCase()) {
  		return "marble_cards";
  	} else if (tokenAddress === "0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756".toLowerCase()) {
  		return "makersplaceco";
  	} else if (tokenAddress === "0xfbeef911dc5821886e1dda71586d90ed28174b7d".toLowerCase()) {
  		return "KnownOrigin_io";
  	} else if (tokenAddress === "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d".toLowerCase()) {
  		return "CryptoKitties";
  	} else if (tokenAddress === "0x6aD0f855c97eb80665F2D0C7d8204895e052C373".toLowerCase()) {
  		return "wildcards_world";
  	} else if (tokenAddress === "0x6aD0f855c97eb80665F2D0C7d8204895e052C373".toLowerCase()) {
  		return "wildcards_world";
  	} else if (tokenAddress === "0x102C527714AB7e652630cAc7a30Abb482B041Fd0".toLowerCase()) {
  		return "CryptoKaijuIO";
  	} else if (tokenAddress === "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab".toLowerCase()) {
  		return "GodsUnchained";
  	} else if (tokenAddress === "0x79986aF15539de2db9A5086382daEdA917A9CF0C".toLowerCase()) {
  		return "Cryptovoxels";
  	}

  	return null;
  }

  function onTweetLinkClicked() {
  	if (checkValidToken()) {
  		var shareLink = generateShareLink();

  		var tokenName = NFTPreviewData.title;

  		// trim name down and add elipsis if too long
  		let MAX_TOKEN_NAME_LENGTH = 50;

  		if (tokenName.length > MAX_TOKEN_NAME_LENGTH) {
  			tokenName = tokenName.substring(0, MAX_TOKEN_NAME_LENGTH) + "..."
  		}

  		// detect which contract we're using and append tweet names if found
  		var twitterUserForContract = getTwitterUserForContract(getTokenAddressInput())

  		var tweetText = "See scribed messages for \"" + tokenName + "\" ";

  		if (twitterUserForContract !== null) {
  			tweetText += "(@" + twitterUserForContract + ") ";
  		}

  		shareLink = shareLink.replace("&", "%26") // replace the ampersand with URL escape

  		tweetText += "at " + shareLink;

  		tweetText = tweetText.replace("#", "") // remove the hashtag since on twitter it means a linkable tag
  	
  		var tweetURL = "https://twitter.com/intent/tweet?text=" + tweetText + "&hashtags=NFT"

  		window.open(tweetURL)
  		
  	}
  }

  function onCopyLinkClicked() {
    if (checkValidToken()) {
      var shareLink = generateShareLink();

      copyToClipboard(shareLink);

      // check the share button source to copied
      document.getElementById("share-button").src="copy-complete.png";      
    }
  }

  function copyToClipboard(e) {
    var textField = document.createElement('textarea')
    
    textField.innerText = e;
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  };

  function onLoadTokenClicked() {
    if (checkValidToken()) {
      setLoadingState(LoadingState.LOADING_RECORDS)

      loadTokenPreview(loadToken)                        
    }
  }

  function getBlockchainExplorerAddress(address) {
    if (chainId === CHAIN_ID_TESTNET_GOERLI) {
      return "https://goerli.etherscan.io/address/" + address;
    } else if (chainId === CHAIN_ID_MAINNET_POLYGON) {
      return "https://polygonscan.com/address/" + address;
    } else {
      return "https://etherscan.io/address/" + address;
    }
  }

  function getPageDescription() {
    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      return <label><i>NFT Scribe</i> is a smart contract that allows ERC721 + ERC1155 owners to append onchain messages and annotations to their tokens.<p/>The longer your message the more gas it will require!</label>;
    } else {
      return <label><i>NFT Scribe</i> is a smart contract that allows ERC721 owners to append onchain messages and annotations to their tokens.<p/>The longer your message the more gas it will require!</label>;
    }
  }

  async function loadToken() {
    var tokenAddress = getTokenAddressInput();
    var tokenId = getTokenIDInput()    

    var provider = getBlockchainProvider()
    
    var contract = new ethers.Contract(getScribeContractAddress(), SCRIBE_CONTRACT_ABI, provider)

    var documentKey = await contract.getDocumentKey(tokenAddress, tokenId)

    var numDocuments = (await contract.documentsCount(documentKey)).toString()

    var documents = []

    // TODO cache ENS names to avoid repeats    
    for (var i = 0; i < numDocuments; i++) {      
      var record = await contract.documents(documentKey, i)

      if (chainId == CHAIN_ID_MAINNET_POLYGON) {      
        // no ENS on polygon right now
        record.ensName = record.dictator;
      } else {
        // look up if there's an ENS name for this address
        var checksumAddress = ethers.utils.getAddress(record.dictator)

        record.ensName = await provider.lookupAddress(checksumAddress)
      }

      documents.splice(0, 0, record)      
    }

    currentTokenAddress = tokenAddress;
    currentTokenId = tokenId;    

    setTokenDocuments(documents)

    // check if we're the owner of this token
    var tokenContract = new ethers.Contract(currentTokenAddress, ERC721_CONTRACT_ABI_BALANCE_MULTIPLE, provider)

    var isOwner = false;
    var didFetchOwnerData = false;

    // try BalanceOf method for polygon 1155's
    if (chainId == CHAIN_ID_MAINNET_POLYGON) {
      try {
        var balanceOfOwner = parseInt((await tokenContract.balanceOf(account, currentTokenId)).toString());

        isOwner = (balanceOfOwner > 0);
        didFetchOwnerData = true;
      } catch (e) {
        console.log(e);

        try {
          tokenContract = new ethers.Contract(currentTokenAddress, ERC721_CONTRACT_ABI_BALANCE_SINGLE, provider)

          var balanceOfOwner = parseInt((await tokenContract.balanceOf(account)).toString());

          isOwner = (balanceOfOwner > 0);
          didFetchOwnerData = true;
        } catch (e) {
          console.log(e);
        }
      }
    }

    // try OwnerOf method
    if (didFetchOwnerData == false) {
      try {
        var ownerOfTokenAddress = await tokenContract.ownerOf(currentTokenId)
        isOwner = (account === ownerOfTokenAddress);
      } catch (e) {
        console.log(e);
      }
    }

    setIsTokenOwner(isOwner);

    setLoadingState(LoadingState.LOADED)
  }

  const [isTokenOwner, setIsTokenOwner] = React.useState(false);
  
  const [NFTPreviewData, setNFTPreviewData] = React.useState({
  	url : "",
  	title : "",
  });

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

  // check if a token address + token ID were put into the URL
  if (didCheckForURLParams === false) {
    didCheckForURLParams = true;

    try {
      // check for URL Search Params support
      if ("URLSearchParams" in window) {
        // extract token address from URL if found
        var urlParams = new URLSearchParams(window.location.search);

        var autoLoadAddress = null;
        var autoLoadId = null;

        if (urlParams.has("address")) {
          var addressInput = urlParams.get("address");
          
          // validate the address input before assuming it's a valid address
          autoLoadAddress = cleanAddressInput(addressInput)
        }

        if (urlParams.has("id")) {
          var idInput = urlParams.get("id");

          // validate the id before assuming it's a valid id
          autoLoadId = cleanTokenInput(idInput)
        }
      }

      // check if we received some parameters in the URL
      if ((autoLoadAddress !== null) && (autoLoadId !== null)) {
        console.log("found valid address + id, loading token...")

        window.requestAnimationFrame(function() {  
          document.getElementById("tokenAddress").value = autoLoadAddress;

          document.getElementById("tokenId").value = autoLoadId;

          isWaitingForValidChainToAutoload = true;          
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (isWaitingForValidChainToAutoload) {
    if (getScribeContractAddress().length > 0) {
      isWaitingForValidChainToAutoload = false;

      onLoadTokenClicked()
    }
  } 

  return (
    <div>
      <div className="padded-div">
        {getPageDescription()}
      </div>
      <hr/>
        <div className="center-header-images-container">
          <div className="inner-header-images">
            <img className="hero-image" src="scribe-holiday.gif" alt="Scribe"/>
            
            {(NFTPreviewData.url.length === 0) && (<img className="nft-outline" alt="Outline" src="nft_outline.png"/>)}

            {(NFTPreviewData.url.length !== 0) && (<img alt="Token" className="nft-overlay" src={NFTPreviewData.url}/>)}

            {(NFTPreviewData.title.length !== 0) && (<label className="nft-overlay" >{NFTPreviewData.title}</label>)}

            {
              ((loadingState === LoadingState.LOADING_RECORDS) || (loadingState === LoadingState.SUBMITTING_DICTATION))
              && (<img alt="Spinner" className="loading-spinner" src="loading.gif"/>)
            }

            {
              (loadingState === LoadingState.LOADED) &&
              (<img alt="Copy" id="share-button" className="share-button" src="copy.png" onClick={() => {
                  onCopyLinkClicked();                  
              }}/>)
            }

            {
              (loadingState === LoadingState.LOADED) &&
              (<img alt="Copy" className="tweet-button" src="tweet.png" onClick={() => {
				onTweetLinkClicked()
              }}/>)
            }
            

          </div>
          </div>
        <br/>
          <div>
            <div className="main-section">
                <label><b>Token Address</b></label>
                  <input id="tokenAddress" placeholder="0x..."/>
              
                <label><b>Token ID</b></label>
                  <input id="tokenId" type="number" placeholder="0, 1, 2, 3..." min="0" defaultValue="0"/>
            
              <div className="button-container">
                {!!(library && account) && (
                  <button disabled={(loadingState === LoadingState.LOADING_RECORDS)}  className="load-erc" onClick={() => {
                      onLoadTokenClicked()                      
                    }}
                  ><b>Load Token</b></button>
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
        <div className="padded-div">
          <label>Version {APP_VERSION} | <b><a href="https://github.com/conlan/nft-scribe" target="_blank" rel="noopener noreferrer">Github</a></b> | <b><a href={getBlockchainExplorerAddress(getScribeContractAddress())} target="_blank" rel="noopener noreferrer">Contract</a></b> | <b><a href="https://twitter.com/conlan" target="_blank" rel="noopener noreferrer">@Conlan</a></b> | <b><a href="https://www.cryptovoxels.com/play?coords=S@279E,418N" target="_blank" rel="noopener noreferrer">Cryptovoxels</a></b> | </label>
          
          <label>⛓{getNetworkName(chainId)}</label>     
          <br/>
          <label>Please use at your own risk and double check <a href="https://ethgasstation.info/" target="_blank" rel="noopener noreferrer">gas price</a> before submitting transaction ⛽</label>               
          <br/>
          <label>Image and name metadata powered by <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer">OpenSea</a></label>
          <br/>
          <label><a href="https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b" target="_blank" rel="noopener noreferrer">Loading GIF Source</a></label>          
        </div>
    </div>    
  );
}

ReactDOM.render(<App />, document.getElementById("root"));


// Loading gif https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b