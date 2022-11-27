(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{42:function(e,t,n){e.exports=n(65)},49:function(e,t,n){},52:function(e,t){},65:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),o=n(22),l=n(14),i=n(2),c=n(34),s=n(16),u=n(69),d=(n(49),n(36)),m=n(38),p="https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",f="https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213",b=new d.a({supportedChainIds:[1,3,4,5,42,137]});new m.a({urls:{1:p,4:f},defaultChainId:1,pollingInterval:8e3});var h=n(50),g=[{inputs:[{internalType:"address",name:"dictator",type:"address",indexed:!1},{internalType:"address",name:"tokenAddress",type:"address",indexed:!1},{indexed:!1,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"string",name:"text",type:"string"}],type:"event",anonymous:!1,name:"Record"},{inputs:[{internalType:"address",name:"_tokenAddress",type:"address"},{internalType:"uint256",name:"_tokenId",type:"uint256"},{internalType:"string",name:"_text",type:"string"}],name:"dictate",type:"function",constant:!1,outputs:[],payable:!1,stateMutability:"nonpayable"},{inputs:[{internalType:"bytes",name:"",type:"bytes"},{internalType:"uint256",name:"",type:"uint256"}],name:"documents",type:"function",constant:!0,outputs:[{internalType:"address",name:"dictator",type:"address"},{internalType:"string",name:"text",type:"string"},{internalType:"uint256",name:"creationTime",type:"uint256"}],payable:!1,stateMutability:"view"},{inputs:[{internalType:"bytes",name:"",type:"bytes"}],name:"documentsCount",type:"function",constant:!0,outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view"},{constant:!0,inputs:[{internalType:"address",name:"_tokenAddress",type:"address"},{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"getDocumentKey",outputs:[{internalType:"bytes",name:"",type:"bytes"}],payable:!1,stateMutability:"pure",type:"function"}],y=[{constant:!0,inputs:[{name:"_tokenId",type:"uint256"}],name:"ownerOf",outputs:[{name:"_owner",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"},{internalType:"uint256",name:"id",type:"uint256"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"}],name:"uri",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"}],E="",v=0,w=!1,k=!1,C=0,x=1,T=2,N=3;function A(e){var t=new u.a(e);return t.pollingInterval=8e3,t}function I(){return i.createElement(s.a,{getLibrary:A},i.createElement(_,null))}function _(e){var t=Object(s.b)(),n=t.connector,a=t.library,c=t.chainId,u=t.account,d=t.activate,m=i.useState([]),p=Object(l.a)(m,2),f=p[0],A=p[1],I=i.useState(C),_=Object(l.a)(I,2),S=_[0],O=_[1];function j(){var e=document.getElementById("dictation").value.trim();return 0===e.length?null:e}function F(){return 1===c?"0xC207efACb12a126D382fA28460BB815F336D845f":3===c?"0x9831151655180132E6131AB35A82a5e32C149116":5===c?"0x284Dc68Afe4b30793acb7507a0Ae029d91bf698e":137===c?"0x1224110880FC42b49Ae08AA4E8B753337b356f4F":""}function L(e){return 1===e?"Mainnet - Ethereum":5===e?"Testnet - Goerli":137===e?"Mainnet - Polygon":"..."}function D(e){var t=parseInt(e);return isNaN(t)||t<0?null:e}function B(){return D(document.getElementById("tokenId").value.trim())}function R(e){try{return h.utils.getAddress(e)}catch(t){return null}}function M(){return R(document.getElementById("tokenAddress").value)}function P(e){return U.apply(this,arguments)}function U(){return(U=Object(o.a)(r.a.mark((function e(t){var n,o,l,i,c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==(n=j())){e.next=4;break}return window.alert("Please provide a dictation."),e.abrupt("return");case 4:return console.log("Submitting dictation..."),o=new h.utils.Interface(g),l=o.functions.dictate.encode([E,v,n]),i={to:F(),data:l},t>0&&(i.gasPrice=h.utils.bigNumberify(1e9*t)),c=a.getSigner(u),e.prev=10,e.next=13,c.sendTransaction(i).then((function(e){G(e)}));case 13:e.next=19;break;case 15:e.prev=15,e.t0=e.catch(10),O(T),window.alert(e.t0);case 19:case"end":return e.stop()}}),e,null,[[10,15]])})))).apply(this,arguments)}function G(e){return K.apply(this,arguments)}function K(){return(K=Object(o.a)(r.a.mark((function e(t){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=W(),e.next=3,n.waitForTransaction(t.hash);case 3:O(x),$();case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function J(){var e=M(),t=null;return t=137==c?" for an ERC721 or ERC1155 contract deployed on "+L(c)+".":" for an ERC721 contract deployed on "+L(c)+".",null==e?(window.alert("Please provide a valid address"+t),!1):null!=B()||(window.alert("Please provide a valid tokenID"+t),!1)}function q(e){return null===e.image_preview_url?"":e.image_preview_url}function V(e){ce({url:"",title:""});var t=B(),n=M();137==c?function(e,t,n){var a=new h.Contract(t,y,W());a.uri(e).then((function(a){z(a,e,t,n)})).catch((function(r){a.tokenURI(e).then((function(a){z(a,e,t,n)})).catch((function(e){console.log(e)}))}))}(t,n,e):function(e,t,n){var a="https://api.opensea.io/api/v1/assets?token_ids="+e+"&asset_contract_address="+t;console.log(a),fetch(a,{crossDomain:!0,method:"GET",headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(a){var r="",o="";console.log(a),a.assets.length>0?(0!==q(a.assets[0]).length&&(r=q(a.assets[0])),o=function(e,t){return null!==e.name?e.name:null!==e.asset_contract&&null!==e.asset_contract.name?e.asset_contract.name+" #"+t:void 0}(a.assets[0],e)):(r="image-not-found.png",o="n/a"),ce({url:r,title:o}),n().catch((function(e){window.alert(e),X()})),new h.Contract(t,y,W()).tokenURI(e).then((function(e){try{var t=JSON.parse(e);t.ipfs&&ce({url:"https://ipfs.infura.io/ipfs/"+t.ipfs,title:o})}catch(n){}})).catch((function(e){}))})).catch((function(e){window.alert(e),X()}))}(t,n,e)}function z(e,t,n,a){console.log(t),console.log(e),e.includes("https://api.opensea.io/api/v2/metadata/matic/")&&(e="https://api.opensea.io/api/v2/metadata/matic/"+n+"/"+t,console.log(e));try{fetch(e).then((function(e){return e.json()})).then((function(e){var t=e;console.log(t),t.image&&ce({url:t.image,title:t.name})})),a().catch((function(e){window.alert(e),X()}))}catch(r){}}function W(){return 137==c?new h.providers.JsonRpcProvider("https://polygon-rpc.com"):h.getDefaultProvider(c)}function X(){ce({url:"",title:""}),O(C)}function H(){var e=B();return"https://conlan.github.io/nft-scribe/?address="+M()+"&id="+e}function Q(){J()&&(!function(e){var t=document.createElement("textarea");t.innerText=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove()}(H()),document.getElementById("share-button").src="copy-complete.png")}function Y(){J()&&(O(x),V($))}function Z(e){return 5===c?"https://goerli.etherscan.io/address/"+e:137===c?"https://polygonscan.com/address/"+e:"https://etherscan.io/address/"+e}function $(){return ee.apply(this,arguments)}function ee(){return(ee=Object(o.a)(r.a.mark((function e(){var t,n,a,o,l,i,s,d,m,p,f,b,w,k,C;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=M(),n=B(),a=W(),o=new h.Contract(F(),g,a),e.next=6,o.getDocumentKey(t,n);case 6:return l=e.sent,e.next=9,o.documentsCount(l);case 9:i=e.sent.toString(),s=[],d=0;case 12:if(!(d<i)){e.next=28;break}return e.next=15,o.documents(l,d);case 15:if(m=e.sent,137!=c){e.next=20;break}m.ensName=m.dictator,e.next=24;break;case 20:return p=h.utils.getAddress(m.dictator),e.next=23,a.lookupAddress(p);case 23:m.ensName=e.sent;case 24:s.splice(0,0,m);case 25:d++,e.next=12;break;case 28:if(E=t,v=n,A(s),f=new h.Contract(E,y,a),b=!1,w=!1,137!=c){e.next=48;break}return e.prev=35,e.t0=parseInt,e.next=39,f.balanceOf(u,v);case 39:e.t1=e.sent.toString(),k=(0,e.t0)(e.t1),b=k>0,w=!0,e.next=48;break;case 45:e.prev=45,e.t2=e.catch(35),console.log(e.t2);case 48:if(0!=w){e.next=53;break}return e.next=51,f.ownerOf(v);case 51:C=e.sent,b=u===C;case 53:re(b),O(T);case 55:case"end":return e.stop()}}),e,null,[[35,45]])})))).apply(this,arguments)}var te=i.useState(!1),ne=Object(l.a)(te,2),ae=ne[0],re=ne[1],oe=i.useState({url:"",title:""}),le=Object(l.a)(oe,2),ie=le[0],ce=le[1],se=i.useState(),ue=Object(l.a)(se,2),de=ue[0],me=ue[1];if(i.useEffect((function(){de&&de===n&&me(void 0)}),[de,n]),function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=Object(s.b)(),n=t.active,a=t.error,r=t.activate;Object(i.useEffect)((function(){var t=window.ethereum;if(t&&!n&&!a&&!e){var o=function(e){console.log("networkChanged",e),r(b)},l=function(e){console.log("accountsChanged",e),e.length>0&&r(b)};return t.on("networkChanged",o),t.on("accountsChanged",l),function(){t.removeListener("networkChanged",o),t.removeListener("accountsChanged",l)}}return function(){}}),[n,a,e,r])}(!function(){var e=Object(s.b)(),t=e.activate,n=e.active,a=Object(i.useState)(!1),r=Object(l.a)(a,2),o=r[0],c=r[1];return Object(i.useEffect)((function(){b.isAuthorized().then((function(e){e?t(b,void 0,!0).catch((function(){c(!0)})):c(!0)}))}),[t]),Object(i.useEffect)((function(){!o&&n&&c(!0)}),[o,n]),o}()||!!de),!1===w){w=!0;try{if("URLSearchParams"in window){var pe=new URLSearchParams(window.location.search),fe=null,be=null;if(pe.has("address")){var he=pe.get("address");fe=R(he)}if(pe.has("id")){var ge=pe.get("id");be=D(ge)}}null!==fe&&null!==be&&(console.log("found valid address + id, loading token..."),window.requestAnimationFrame((function(){document.getElementById("tokenAddress").value=fe,document.getElementById("tokenId").value=be,k=!0})))}catch(ye){console.log(ye)}}return k&&F().length>0&&(k=!1,Y()),i.createElement("div",null,i.createElement("div",{className:"padded-div"},137==c?i.createElement("label",null,i.createElement("i",null,"NFT Scribe")," is a smart contract that allows ERC721 + ERC1155 owners to append onchain messages and annotations to their tokens.",i.createElement("p",null),"The longer your message the more gas it will require!"):i.createElement("label",null,i.createElement("i",null,"NFT Scribe")," is a smart contract that allows ERC721 owners to append onchain messages and annotations to their tokens.",i.createElement("p",null),"The longer your message the more gas it will require!")),i.createElement("hr",null),i.createElement("div",{className:"center-header-images-container"},i.createElement("div",{className:"inner-header-images"},i.createElement("img",{className:"hero-image",src:"scribe-holiday.gif",alt:"Scribe"}),0===ie.url.length&&i.createElement("img",{className:"nft-outline",alt:"Outline",src:"nft_outline.png"}),0!==ie.url.length&&i.createElement("img",{alt:"Token",className:"nft-overlay",src:ie.url}),0!==ie.title.length&&i.createElement("label",{className:"nft-overlay"},ie.title),(S===x||S===N)&&i.createElement("img",{alt:"Spinner",className:"loading-spinner",src:"loading.gif"}),S===T&&i.createElement("img",{alt:"Copy",id:"share-button",className:"share-button",src:"copy.png",onClick:function(){Q()}}),S===T&&i.createElement("img",{alt:"Copy",className:"tweet-button",src:"tweet.png",onClick:function(){!function(){if(J()){var e=H(),t=ie.title;t.length>50&&(t=t.substring(0,50)+"...");var n=(o=(o=M()).toLowerCase())==="0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0".toLowerCase()||o==="0x41A322b28D0fF354040e2CbC676F0320d8c8850d".toLowerCase()?"SuperRare_co":o==="0x1d963688FE2209A98dB35C67A041524822Cf04ff".toLowerCase()?"marble_cards":o==="0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756".toLowerCase()?"makersplaceco":o==="0xfbeef911dc5821886e1dda71586d90ed28174b7d".toLowerCase()?"KnownOrigin_io":o==="0x06012c8cf97BEaD5deAe237070F9587f8E7A266d".toLowerCase()?"CryptoKitties":o==="0x6aD0f855c97eb80665F2D0C7d8204895e052C373".toLowerCase()||o==="0x6aD0f855c97eb80665F2D0C7d8204895e052C373".toLowerCase()?"wildcards_world":o==="0x102C527714AB7e652630cAc7a30Abb482B041Fd0".toLowerCase()?"CryptoKaijuIO":o==="0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab".toLowerCase()?"GodsUnchained":o==="0x79986aF15539de2db9A5086382daEdA917A9CF0C".toLowerCase()?"Cryptovoxels":null,a='See scribed messages for "'+t+'" ';null!==n&&(a+="(@"+n+") ");var r="https://twitter.com/intent/tweet?text="+(a=(a+="at "+(e=e.replace("&","%26"))).replace("#",""))+"&hashtags=NFT";window.open(r)}var o}()}}))),i.createElement("br",null),i.createElement("div",null,i.createElement("div",{className:"main-section"},i.createElement("label",null,i.createElement("b",null,"Token Address")),i.createElement("input",{id:"tokenAddress",placeholder:"0x..."}),i.createElement("label",null,i.createElement("b",null,"Token ID")),i.createElement("input",{id:"tokenId",type:"number",placeholder:"0, 1, 2, 3...",min:"0",defaultValue:"0"}),i.createElement("div",{className:"button-container"},!(!a||!u)&&i.createElement("button",{disabled:S===x,className:"load-erc",onClick:function(){Y()}},i.createElement("b",null,"Load ERC721")),!1===!!a&&i.createElement("button",{className:"connect-web3",onClick:function(){me(b),d(b)}},"Connect to Web3")),S!==C&&S!==x&&ae&&i.createElement("div",null,i.createElement("label",null,i.createElement("b",null,"Dictation")),i.createElement("input",{disabled:S===N,id:"dictation",placeholder:"Let it be known..."}),i.createElement("div",{className:"button-container"},i.createElement("button",{disabled:S===N,className:"submit-dictation",onClick:function(){var e;(null!==j()||(window.alert("Please provide a dictation."),0))&&(O(N),e=P,137==c?e(0):fetch("https://ethgasstation.info/json/ethgasAPI.json").then((function(e){return e.json()})).then((function(t){var n=t.fast;void 0===n?n=10:n/=10,e(n)})))}},i.createElement("b",null,"Submit Dictation")))),(S===T||S===N)&&function(){var e=[];return f.forEach((function(t){var n,a=function(e){var t=(new Date).getTime()/1e3,n=Math.floor(t-e),a=Math.floor(n/60),r=Math.floor(a/60),o=Math.floor(r/24);return o>0?1===o?o+" day ago":o+" days ago":r>0?1===r?r+" hour ago":r+" hours ago":a>0?a+" min ago":n>0?1===n?n+" second ago":n+" seconds ago":"just recently"}(t.creationTime),r=t.text,o=(L(c),Z(t.dictator));if(null===t.ensName){var l=((n=t.dictator).length>20&&(n=n.substring(0,10)+"..."+n.substring(n.length-10,n.length)),n);e.push(i.createElement("div",{className:"record-line",key:r+t.creationTime.toString()},i.createElement("label",{className:"record-line"},i.createElement("b",null,i.createElement("a",{href:o,rel:"noopener noreferrer",target:"_blank"},l)),i.createElement("span",{className:"timestamp"}," \u2022 (",a,")"),i.createElement("br",null),i.createElement("br",null),r)))}else e.push(i.createElement("div",{className:"record-line",key:t.creationTime.toString()},i.createElement("label",{className:"record-line"},i.createElement("b",null,i.createElement("a",{href:o,rel:"noopener noreferrer",target:"_blank"},t.ensName)),i.createElement("span",{className:"timestamp"}," \u2022 (",a,")"),i.createElement("br",null),i.createElement("br",null),r)))})),0===e.length&&e.push(i.createElement("label",{key:"0"},"No records found for this token.")),e}())),i.createElement("hr",null),i.createElement("div",{className:"padded-div"},i.createElement("label",null,"Version ","1.1.0"," | ",i.createElement("b",null,i.createElement("a",{href:"https://github.com/conlan/nft-scribe",target:"_blank",rel:"noopener noreferrer"},"Github"))," | ",i.createElement("b",null,i.createElement("a",{href:Z(F()),target:"_blank",rel:"noopener noreferrer"},"Contract"))," | ",i.createElement("b",null,i.createElement("a",{href:"https://twitter.com/conlan",target:"_blank",rel:"noopener noreferrer"},"@Conlan"))," | ",i.createElement("b",null,i.createElement("a",{href:"https://www.cryptovoxels.com/play?coords=S@279E,418N",target:"_blank",rel:"noopener noreferrer"},"Cryptovoxels"))," | "),i.createElement("label",null,"\u26d3",L(c)),i.createElement("br",null),i.createElement("label",null,"Please use at your own risk and double check ",i.createElement("a",{href:"https://ethgasstation.info/",target:"_blank",rel:"noopener noreferrer"},"gas price")," before submitting transaction \u26fd"),i.createElement("br",null),i.createElement("label",null,"Image and name metadata powered by ",i.createElement("a",{href:"https://opensea.io/",target:"_blank",rel:"noopener noreferrer"},"OpenSea")),i.createElement("br",null),i.createElement("label",null,i.createElement("a",{href:"https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b",target:"_blank",rel:"noopener noreferrer"},"Loading GIF Source"))))}c.render(i.createElement(I,null),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.64081464.chunk.js.map