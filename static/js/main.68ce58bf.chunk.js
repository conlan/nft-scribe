(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{130:function(e,t,n){e.exports=n(353)},136:function(e,t){},138:function(e,t){},160:function(e,t,n){},166:function(e,t){},168:function(e,t){},353:function(e,t,n){"use strict";n.r(t);var a=n(4),r=n.n(a),l=n(56),o=n(34),i=n(1),c=n(119),s=n(43),u=n(129),d=(n(160),n(125)),m=n(126),p="https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",f="https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213",b=new d.a({supportedChainIds:[1,3,4,5,42]});new m.a({urls:{1:p,4:f},defaultChainId:1,pollingInterval:8e3});var h=n(68),y=[{inputs:[{internalType:"address",name:"dictator",type:"address",indexed:!1},{internalType:"address",name:"tokenAddress",type:"address",indexed:!1},{indexed:!1,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"string",name:"text",type:"string"}],type:"event",anonymous:!1,name:"Record"},{inputs:[{internalType:"address",name:"_tokenAddress",type:"address"},{internalType:"uint256",name:"_tokenId",type:"uint256"},{internalType:"string",name:"_text",type:"string"}],name:"dictate",type:"function",constant:!1,outputs:[],payable:!1,stateMutability:"nonpayable"},{inputs:[{internalType:"bytes",name:"",type:"bytes"},{internalType:"uint256",name:"",type:"uint256"}],name:"documents",type:"function",constant:!0,outputs:[{internalType:"address",name:"dictator",type:"address"},{internalType:"string",name:"text",type:"string"},{internalType:"uint256",name:"creationTime",type:"uint256"}],payable:!1,stateMutability:"view"},{inputs:[{internalType:"bytes",name:"",type:"bytes"}],name:"documentsCount",type:"function",constant:!0,outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view"},{constant:!0,inputs:[{internalType:"address",name:"_tokenAddress",type:"address"},{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"getDocumentKey",outputs:[{internalType:"bytes",name:"",type:"bytes"}],payable:!1,stateMutability:"pure",type:"function"}],g=[{constant:!0,inputs:[{name:"tokenId",type:"uint256"}],name:"tokenURI",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"_tokenId",type:"uint256"}],name:"ownerOf",outputs:[{name:"_owner",type:"address"}],payable:!1,stateMutability:"view",type:"function"}],E="0x9831151655180132E6131AB35A82a5e32C149116",v="0x284Dc68Afe4b30793acb7507a0Ae029d91bf698e",w="0xC207efACb12a126D382fA28460BB815F336D845f",I="",k=0,N=!1,T=!1,D={UNLOADED:0,LOADING_RECORDS:1,LOADED:2,SUBMITTING_DICTATION:3};function O(e){var t=new u.a(e);return t.pollingInterval=8e3,t}function C(e){var t=Object(s.b)(),n=t.connector,a=t.library,c=t.chainId,u=t.account,d=t.activate,m=i.useState([]),p=Object(o.a)(m,2),f=p[0],O=p[1],C=i.useState(D.UNLOADED),A=Object(o.a)(C,2),_=A[0],x=A[1];function S(){var e=document.getElementById("dictation").value.trim();return 0===e.length?null:e}function L(e){return 1===e?w:3===e?E:5===e?v:""}function j(e){return 1===e?"Mainnet":5===e?"Goerli":"..."}function R(e){var t=parseInt(e);return isNaN(t)||t<0?null:t}function B(){return R(document.getElementById("tokenId").value.trim())}function M(e){try{return h.utils.getAddress(e)}catch(t){return null}}function G(){return M(document.getElementById("tokenAddress").value)}function U(e){return P.apply(this,arguments)}function P(){return(P=Object(l.a)(r.a.mark((function e(t){var n,l,o,i,s;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==(n=S())){e.next=4;break}return window.alert("Please provide a dictation."),e.abrupt("return");case 4:return console.log("Submitting dictation..."),l=new h.utils.Interface(y),o=l.functions.dictate.encode([I,k,n]),i={to:L(c),data:o,gasPrice:h.utils.bigNumberify(1e9*t)},s=a.getSigner(u),e.prev=9,e.next=12,s.sendTransaction(i).then((function(e){F(e)}));case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(9),x(D.LOADED);case 17:case"end":return e.stop()}}),e,null,[[9,14]])})))).apply(this,arguments)}function F(e){return J.apply(this,arguments)}function J(){return(J=Object(l.a)(r.a.mark((function e(t){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=h.getDefaultProvider(c),e.next=3,n.waitForTransaction(t.hash);case 3:x(D.LOADING_RECORDS),X();case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function K(){return null==G()?(window.alert("Please provide a valid ERC721 contract address."),!1):null!=B()||(window.alert("Please provide a valid ERC721 token ID."),!1)}function V(e){return null===e.image_preview_url?"":e.image_preview_url}function q(){ae({url:"",title:""}),x(D.UNLOADED)}function z(){K()&&(!function(e){var t=document.createElement("textarea");t.innerText=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove()}(function(){var e=B();return"https://conlan.github.io/nft-scribe/?address="+G()+"&id="+e}()),document.getElementById("share-button").src="copy-complete.png")}function W(){K()&&(x(D.LOADING_RECORDS),function(e){ae({url:"",title:""});var t=B(),n=G(),a="https://api.opensea.io/api/v1/assets?token_ids="+t+"&asset_contract_address="+n;console.log(a),fetch(a,{crossDomain:!0,method:"POST",headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(a){var r="",l="";console.log(a),a.assets.length>0?(0!==V(a.assets[0]).length&&(r=V(a.assets[0])),l=function(e,t){return null!==e.name?e.name:null!==e.asset_contract&&null!==e.asset_contract.name?e.asset_contract.name+" #"+t:void 0}(a.assets[0],t)):(r="image-not-found.png",l="n/a"),ae({url:r,title:l}),e().catch((function(e){window.alert(e),q()})),new h.Contract(n,g,h.getDefaultProvider(c)).tokenURI(t).then((function(e){try{var t=JSON.parse(e);t.ipfs&&ae({url:"https://ipfs.infura.io/ipfs/"+t.ipfs,title:l})}catch(n){}})).catch((function(e){}))})).catch((function(e){window.alert(e),q()}))}(X))}function X(){return H.apply(this,arguments)}function H(){return(H=Object(l.a)(r.a.mark((function e(){var t,n,a,l,o,i,s,d,m,p,f,b;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=G(),n=B(),a=h.getDefaultProvider(c),l=new h.Contract(L(c),y,a),e.next=6,l.getDocumentKey(t,n);case 6:return o=e.sent,e.next=9,l.documentsCount(o);case 9:i=e.sent.toString(),s=[],d=0;case 12:if(!(d<i)){e.next=24;break}return e.next=15,l.documents(o,d);case 15:return m=e.sent,p=h.utils.getAddress(m.dictator),e.next=19,a.lookupAddress(p);case 19:m.ensName=e.sent,s.splice(0,0,m);case 21:d++,e.next=12;break;case 24:return I=t,k=n,O(s),f=new h.Contract(I,g,a),e.next=30,f.ownerOf(k);case 30:b=e.sent,$(u===b),x(D.LOADED);case 33:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Q=i.useState(!1),Y=Object(o.a)(Q,2),Z=Y[0],$=Y[1],ee=i.useState({url:"",title:""}),te=Object(o.a)(ee,2),ne=te[0],ae=te[1],re=i.useState(),le=Object(o.a)(re,2),oe=le[0],ie=le[1];if(i.useEffect((function(){oe&&oe===n&&ie(void 0)}),[oe,n]),function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=Object(s.b)(),n=t.active,a=t.error,r=t.activate;Object(i.useEffect)((function(){var t=window.ethereum;if(t&&!n&&!a&&!e){var l=function(e){console.log("networkChanged",e),r(b)},o=function(e){console.log("accountsChanged",e),e.length>0&&r(b)};return t.on("networkChanged",l),t.on("accountsChanged",o),function(){t.removeListener("networkChanged",l),t.removeListener("accountsChanged",o)}}return function(){}}),[n,a,e,r])}(!function(){var e=Object(s.b)(),t=e.activate,n=e.active,a=Object(i.useState)(!1),r=Object(o.a)(a,2),l=r[0],c=r[1];return Object(i.useEffect)((function(){b.isAuthorized().then((function(e){e?t(b,void 0,!0).catch((function(){c(!0)})):c(!0)}))}),[t]),Object(i.useEffect)((function(){!l&&n&&c(!0)}),[l,n]),l}()||!!oe),!1===N){N=!0;try{if("URLSearchParams"in window){var ce=new URLSearchParams(window.location.search),se=null,ue=null;if(ce.has("address")){var de=ce.get("address");se=M(de)}if(ce.has("id")){var me=ce.get("id");ue=R(me)}}null!==se&&null!==ue&&(console.log("found valid address + id, loading token..."),window.requestAnimationFrame((function(){document.getElementById("tokenAddress").value=se,document.getElementById("tokenId").value=ue,T=!0})))}catch(pe){console.log(pe)}}return T&&L(c).length>0&&(T=!1,W()),i.createElement("div",null,i.createElement("div",{className:"padded-div"},i.createElement("label",null,i.createElement("i",null,"NFT Scribe")," is a smart contract that allows ERC721 owners to append onchain messages and annotations to their tokens.")),i.createElement("hr",null),i.createElement("div",{className:"center-header-images-container"},i.createElement("div",{className:"inner-header-images"},i.createElement("img",{className:"hero-image",src:"scribe.gif",alt:"Scribe"}),0===ne.url.length&&i.createElement("img",{className:"nft-outline",alt:"Outline",src:"nft_outline.png"}),0!==ne.url.length&&i.createElement("img",{alt:"Token",className:"nft-overlay",src:ne.url}),0!==ne.title.length&&i.createElement("label",{className:"nft-overlay"},ne.title),(_===D.LOADING_RECORDS||_===D.SUBMITTING_DICTATION)&&i.createElement("img",{alt:"Spinner",className:"loading-spinner",src:"loading.gif"}),_===D.LOADED&&i.createElement("img",{alt:"Copy",id:"share-button",className:"share-button",src:"copy.png",onClick:function(){z()}}))),i.createElement("br",null),i.createElement("div",null,i.createElement("div",{className:"main-section"},i.createElement("label",null,i.createElement("b",null,"Token Address")),i.createElement("input",{id:"tokenAddress",placeholder:"0x..."}),i.createElement("label",null,i.createElement("b",null,"Token ID")),i.createElement("input",{id:"tokenId",type:"number",placeholder:"0, 1, 2, 3...",min:"0",defaultValue:"0"}),i.createElement("div",{className:"button-container"},!(!a||!u)&&i.createElement("button",{disabled:_===D.LOADING_RECORDS,className:"load-erc",onClick:function(){W()}},i.createElement("b",null,"Load ERC721")),!1===!!a&&i.createElement("button",{className:"connect-web3",onClick:function(){ie(b),d(b)}},"Connect to Web3")),_!==D.UNLOADED&&_!==D.LOADING_RECORDS&&Z&&i.createElement("div",null,i.createElement("label",null,i.createElement("b",null,"Dictation")),i.createElement("input",{disabled:_===D.SUBMITTING_DICTATION,id:"dictation",placeholder:"Let it be known..."}),i.createElement("div",{className:"button-container"},i.createElement("button",{disabled:_===D.SUBMITTING_DICTATION,className:"submit-dictation",onClick:function(){var e;(null!==S()||(window.alert("Please provide a dictation."),0))&&(x(D.SUBMITTING_DICTATION),e=U,fetch("https://ethgasstation.info/json/ethgasAPI.json").then((function(e){return e.json()})).then((function(t){var n=t.fast;void 0===n?n=10:n/=10,e(n)})))}},i.createElement("b",null,"Submit Dictation")))),(_===D.LOADED||_===D.SUBMITTING_DICTATION)&&function(){var e=[];return f.forEach((function(t){var n=function(e){var t=(new Date).getTime()/1e3,n=Math.floor(t-e),a=Math.floor(n/60),r=Math.floor(a/60),l=Math.floor(r/24);return l>0?1===l?l+" day ago":l+" days ago":r>0?1===r?r+" hour ago":r+" hours ago":a>0?a+" min ago":n>0?1===n?n+" second ago":n+" seconds ago":"just recently"}(t.creationTime),a=t.text,r=j(c),l=null;if(l="Mainnet"===r?"https://etherscan.io/address/"+t.dictator:"https://"+r+".etherscan.io/address/"+t.dictator,null===t.ensName){var o=(t.dictator,"0x33b93...3243");e.push(i.createElement("div",{className:"record-line",key:a+t.creationTime.toString()},i.createElement("label",{className:"record-line"},i.createElement("b",null,i.createElement("a",{href:l,rel:"noopener noreferrer",target:"_blank"},o)),i.createElement("span",{className:"timestamp"}," \u2022 (",n,")"),i.createElement("br",null),i.createElement("br",null),a)))}else e.push(i.createElement("div",{className:"record-line",key:t.creationTime.toString()},i.createElement("label",{className:"record-line"},i.createElement("b",null,i.createElement("a",{href:l,rel:"noopener noreferrer",target:"_blank"},t.ensName)),i.createElement("span",{className:"timestamp"}," \u2022 (",n,")"),i.createElement("br",null),i.createElement("br",null),a)))})),0===e.length&&e.push(i.createElement("label",{key:"0"},"No records found for this token.")),e}())),i.createElement("hr",null),i.createElement("div",{className:"padded-div"},i.createElement("label",null,"Version 1.0.4 | ",i.createElement("b",null,i.createElement("a",{href:"https://github.com/conlan/nft-scribe",target:"_blank",rel:"noopener noreferrer"},"Github"))," | ",i.createElement("b",null,i.createElement("a",{href:"https://etherscan.io/address/0xC207efACb12a126D382fA28460BB815F336D845f",target:"_blank",rel:"noopener noreferrer"},"Contract"))," | ",i.createElement("b",null,i.createElement("a",{href:"https://twitter.com/conlan",target:"_blank",rel:"noopener noreferrer"},"@Conlan"))," | ",i.createElement("b",null,i.createElement("a",{href:"https://www.cryptovoxels.com/play?coords=S@279E,418N",target:"_blank",rel:"noopener noreferrer"},"Cryptovoxels"))," | "),i.createElement("label",null,"\u26d3",j(c)),i.createElement("br",null),i.createElement("label",null,"Please use at your own risk and double check ",i.createElement("a",{href:"https://ethgasstation.info/",target:"_blank",rel:"noopener noreferrer"},"gas price")," before submitting transaction \u26fd"),i.createElement("br",null),i.createElement("label",null,"Image and name metadata powered by ",i.createElement("a",{href:"https://opensea.io/",target:"_blank",rel:"noopener noreferrer"},"OpenSea")),i.createElement("br",null),i.createElement("label",null,i.createElement("a",{href:"https://giphy.com/stickers/geometric-heysp-illustrated-geometry-c6XT7hN1iSuUoNxD1b",target:"_blank",rel:"noopener noreferrer"},"Loading GIF Source"))))}c.render(i.createElement((function(){return i.createElement(s.a,{getLibrary:O},i.createElement(C,null))}),null),document.getElementById("root"))}},[[130,1,2]]]);
//# sourceMappingURL=main.68ce58bf.chunk.js.map