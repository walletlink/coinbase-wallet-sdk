(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,a,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(81408)}])},81408:function(e,a,r){"use strict";r.r(a),r.d(a,{default:function(){return Home}});var s=r(85893),t=r(22338),n=r(57747),i=r(22757),d=r(79078),c=r(68519),l=r(67294),o=r(13990),m=r(40607),u=r(93717),h=r(26101),p=r(56727);function EventListenersCard(){let[e,a]=l.useState(null),[r,t]=l.useState(null),[d,c]=l.useState(null),[y,g]=l.useState(null),[b,x]=l.useState(null),{provider:f}=(0,p.Wg)();return(0,l.useEffect)(()=>{if(f)return f.on("connect",e=>{a(e)}),f.on("disconnect",e=>{t({code:e.code,message:e.message})}),f.on("accountsChanged",e=>{c(e)}),f.on("chainChanged",e=>{g(e)}),f.on("message",e=>{x(e)}),()=>{f&&f.removeAllListeners()}},[f]),(0,s.jsx)(o.Z,{shadow:"lg",children:(0,s.jsxs)(m.e,{children:[(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(u.k,{align:"center",justify:"space-between",children:(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:"accountsChanged"})})}),d&&(0,s.jsx)(h.E,{mt:2,as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(d,null,2)})]}),(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(u.k,{align:"center",justify:"space-between",children:(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:"chainChanged"})})}),y&&(0,s.jsx)(h.E,{mt:2,as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(y,null,2)})]}),(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(u.k,{align:"center",justify:"space-between",children:(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:"message"})})}),b&&(0,s.jsx)(h.E,{mt:2,as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(b,null,2)})]}),(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(u.k,{align:"center",justify:"space-between",children:(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:"connect"})})}),e&&(0,s.jsx)(h.E,{mt:2,as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(e,null,2)})]}),(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(u.k,{align:"center",justify:"space-between",children:(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:"disconnect"})})}),r&&(0,s.jsx)(h.E,{mt:2,as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(r,null,2)})]})]})})}var y=r(46721);let g=[{method:"eth_requestAccounts",params:[]},{method:"eth_accounts",params:[]}],b=[{method:"wallet_switchEthereumChain",params:[{key:"chainId",required:!0}],format:e=>[{chainId:"0x".concat(Number(e.chainId).toString(16))}]},{method:"wallet_addEthereumChain",params:[{key:"chainId",required:!0},{key:"chainName",required:!0},{key:"currencyName",required:!0},{key:"currencySymbol",required:!0},{key:"decimals",required:!0},{key:"rpcUrl",required:!0},{key:"blockExplorerUrl"},{key:"iconUrl"}],format:e=>[{chainId:"0x".concat(Number(e.chainId).toString(16)),chainName:e.chainName,rpcUrls:[e.rpcUrl],blockExplorerUrls:[e.blockExplorerUrls],iconUrls:[e.iconUrl],nativeCurrency:{name:e.currencyName,symbol:e.currencySymbol,decimals:18}}]},{method:"wallet_watchAsset",params:[{key:"type",required:!0},{key:"contractAddress",required:!0},{key:"symbol",required:!1},{key:"decimals",required:!1},{key:"tokenId",required:!1}],format:e=>[{type:e.type,options:{address:e.contractAddress,symbol:e.symbol,decimals:Number(e.decimals),tokenId:e.tokenId}}]}],x=[{method:"eth_getBalance",params:[{key:"address",required:!0},{key:"blockNumber",required:!0}],format:e=>[e.address,e.blockNumber]},{method:"eth_getTransactionCount",params:[{key:"address",required:!0},{key:"blockNumber",required:!0}],format:e=>[e.address,e.blockNumber]}],f=[{method:"eth_sendTransaction",params:[{key:"from",required:!0},{key:"to",required:!0},{key:"value",required:!0},{key:"gasLimit",required:!1},{key:"gasPriceInWei",required:!1},{key:"maxFeePerGas",required:!1},{key:"maxPriorityFeePerGas",required:!1},{key:"data",required:!1}],format:e=>[{from:e.from,to:e.to,value:e.value,gasLimit:e.gasLimit,gasPriceInWei:e.gasPriceInWei,maxFeePerGas:e.maxFeePerGas,maxPriorityFeePerGas:e.maxPriorityFeePerGas,data:e.data}]}];var k=r(51091);let parseMessage=e=>"string"==typeof e?JSON.parse(e):e;var w=r(48764).Buffer;let C=[{method:"eth_sign",params:[{key:"message",required:!0},{key:"address",required:!0}],format:e=>[e.address,"0x".concat(w.from(e.message,"utf8").toString("hex"))]},{method:"personal_sign",params:[{key:"message",required:!0},{key:"address",required:!0}],format:e=>["0x".concat(w.from(e.message,"utf8").toString("hex")),e.address]},{method:"eth_signTypedData_v1",params:[{key:"message",required:!0},{key:"address",required:!0}],format:e=>[parseMessage(e.message),e.address]},{method:"eth_signTypedData_v3",params:[{key:"message",required:!0},{key:"address",required:!0}],format:e=>[e.address,parseMessage(e.message)]},{method:"eth_signTypedData_v4",params:[{key:"message",required:!0},{key:"address",required:!0}],format:e=>[e.address,parseMessage(e.message)]}],verifySignMsg=e=>{let{method:a,from:r,sign:s,message:t}=e;switch(a){case"personal_sign":{let e="0x".concat(w.from(t,"utf8").toString("hex")),a=(0,k.recoverPersonalSignature)({data:e,signature:s});if(a===r)return"SigUtil Successfully verified signer as ".concat(a);return"SigUtil Failed to verify signer when comparing ".concat(a," to ").concat(r)}case"eth_signTypedData_v1":{let e=(0,k.recoverTypedSignature)({data:t,signature:s,version:k.SignTypedDataVersion.V1});if(e===r)return"SigUtil Successfully verified signer as ".concat(e);return"SigUtil Failed to verify signer when comparing ".concat(e," to ").concat(r)}case"eth_signTypedData_v3":{let e=(0,k.recoverTypedSignature)({data:t,signature:s,version:k.SignTypedDataVersion.V3});if(e===r)return"SigUtil Successfully verified signer as ".concat(e);return"SigUtil Failed to verify signer when comparing ".concat(e," to ").concat(r)}case"eth_signTypedData_v4":{let e=(0,k.recoverTypedSignature)({data:t,signature:s,version:k.SignTypedDataVersion.V4});if(e===r)return"SigUtil Successfully verified signer as ".concat(e);return"SigUtil Failed to verify signer when comparing ".concat(e," to ").concat(r)}default:return null}},S=[{method:"wallet_getCapabilities",params:[]},{method:"wallet_getCallsStatus",params:[{key:"params",required:!0}],format:e=>[e.params]},{method:"wallet_showCallsStatus",params:[{key:"params",required:!0}],format:e=>[e.params]},{method:"wallet_sendCalls",params:[{key:"version",required:!0},{key:"chainId",required:!0},{key:"from",required:!0},{key:"calls",required:!0},{key:"capabilities",required:!0}],format:e=>[{chainId:e.chainId,from:e.from,calls:e.calls,version:e.version,capabilities:parseMessage(e.capabilities)}]}];var j=r(14225),B=r(82215),v=r(88087),E=r(64071),_=r(87334),q=r(53891),M=r(48783),N=r(85970),D=r(82140),I=r(51680),T=r(71025),P=r(26105),U=r(34292),F=r(87536);let O="Example Message",A="ADDR_TO_FILL";function RpcMethodCard(e){let{format:a,method:r,params:t,shortcuts:n}=e,[d,c]=l.useState(null),[y,g]=l.useState(null),[b,x]=l.useState(null),{provider:f}=(0,p.Wg)(),{handleSubmit:k,register:w,formState:{errors:C}}=(0,F.cI)(),S=(0,l.useCallback)(async(e,a)=>{var s;let t=verifySignMsg({method:r,from:null===(s=a.address)||void 0===s?void 0:s.toLowerCase(),sign:e,message:a.message});if(t){g(t);return}},[]),O=(0,l.useCallback)(async e=>{if(x(null),g(null),c(null),!f)return;let s=e;if(a){let r=await f.request({method:"eth_accounts"});for(let a in e)Object.prototype.hasOwnProperty.call(e,a)&&e[a]===A&&(e[a]=r[0]);s=a(e)}try{(null==f?void 0:f.connected)||await f.enable();let a=await f.request({method:r,params:s});c(a),S(a,e)}catch(s){let{code:e,message:a,data:r}=s;x({code:e,message:a,data:r})}},[f]);return(0,s.jsx)(o.Z,{shadow:"lg",as:"form",onSubmit:k(O),children:(0,s.jsxs)(m.e,{children:[(0,s.jsxs)(u.k,{align:"center",justify:"space-between",children:[(0,s.jsx)(i.X,{as:"h2",size:"lg",children:(0,s.jsx)(h.E,{children:r})}),(0,s.jsx)(j.z,{type:"submit",mt:4,children:"Submit"})]}),(null==t?void 0:t.length)>0&&(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)(B.U,{allowMultiple:!0,mt:4,defaultIndex:n?[1]:[0],children:[(0,s.jsxs)(v.Q,{children:[(0,s.jsxs)(E.K,{children:[(0,s.jsx)(i.X,{as:"h3",size:"sm",marginY:2,flex:"1",textAlign:"left",children:"Params"}),(0,s.jsx)(_.X,{})]}),(0,s.jsx)(q.H,{pb:4,children:(0,s.jsx)(M.g,{spacing:2,mt:2,children:t.map(e=>{let a=C[e.key];return(0,s.jsxs)(N.NI,{isInvalid:!!a,isRequired:e.required,children:[(0,s.jsxs)(D.B,{size:"sm",children:[(0,s.jsx)(I.Ui,{children:e.key}),(0,s.jsx)(T.I,{...w(e.key,{required:!!e.required&&"".concat(e.key," required")})})]}),(0,s.jsx)(P.J1,{children:null==a?void 0:a.message})]},e.key)})})})]}),(null==n?void 0:n.length)>0&&(0,s.jsxs)(v.Q,{children:[(0,s.jsxs)(E.K,{children:[(0,s.jsx)(i.X,{as:"h3",size:"sm",marginY:2,flex:"1",textAlign:"left",children:"Shortcuts"}),(0,s.jsx)(_.X,{})]}),(0,s.jsx)(q.H,{pb:4,children:(0,s.jsx)(U.U,{spacing:2,children:n.map(e=>(0,s.jsx)(j.z,{onClick:()=>O(e.data),children:e.key},e.key))})})]})]})}),d&&(0,s.jsx)(M.g,{mt:4,children:(0,s.jsx)(h.E,{as:"pre",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(d,null,2)})}),y&&(0,s.jsx)(M.g,{mt:4,children:(0,s.jsx)(h.E,{as:"pre",p:4,colorScheme:y.includes("Failed")?"red":"cyan",wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(y,null,2)})}),b&&(0,s.jsx)(M.g,{mt:4,children:(0,s.jsx)(h.E,{as:"pre",colorScheme:"red",p:4,wordBreak:"break-word",whiteSpace:"pre-wrap",w:"100%",children:JSON.stringify(b,null,2)})})]})})}let X={wallet_switchEthereumChain:[{key:"Ethereum",data:{chainId:"1"}},{key:"Base",data:{chainId:"8453"}},{key:"Base Sepolia",data:{chainId:"84532"}},{key:"Harmony",data:{chainId:"1666600000"}}],wallet_addEthereumChain:[{key:"Harmony",data:{chainId:"1666600000",chainName:"Harmony Mainnet",currencyName:"ONE",currencySymbol:"ONE",decimals:"18",rpcUrl:"https://api.harmony.one",blockExplorerUrl:"https://explorer.harmony.one",iconUrl:""}}],wallet_watchAsset:[{key:"WONE on Harmony",data:{type:"ERC20",contractAddress:"0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",symbol:"WONE",decimals:"18"}}]},z={eth_getBalance:[{key:"Get your address balance",data:{address:A,blockNumber:"latest"}}],eth_getTransactionCount:[{key:"Get number of txns sent from your address",data:{address:A,blockNumber:"latest"}}]},W={eth_sendTransaction:[{key:"Example Tx",data:{from:A,to:"0x0000000000000000000000000000000000000000",value:"0x0"}}]},J=[{key:O,data:{message:O,address:A}}],H=[{key:O,data:{message:[{type:"string",name:"Message",value:O}],address:A}}],ethSignTypedDataV3Shortcuts=e=>[{key:O,data:{message:{types:{EIP712Domain:[{name:"name",type:"string"},{name:"version",type:"string"},{name:"chainId",type:"uint256"},{name:"verifyingContract",type:"address"}],Person:[{name:"name",type:"string"},{name:"wallet",type:"address"}],Mail:[{name:"from",type:"Person"},{name:"to",type:"Person"},{name:"contents",type:"string"}]},primaryType:"Mail",domain:{name:"Ether Mail",version:"1",chainId:e,verifyingContract:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},message:{from:{name:"Cow",wallet:"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},to:{name:"Bob",wallet:"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},contents:"Hello, Bob!"}},address:A}}],ethSignTypedDataV4Shortcuts=e=>[{key:O,data:{message:{domain:{chainId:e,name:"Ether Mail",verifyingContract:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",version:"1"},message:{contents:"Hello, Bob!",from:{name:"Cow",wallets:["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"]},to:[{name:"Bob",wallets:["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]},primaryType:"Mail",types:{EIP712Domain:[{name:"name",type:"string"},{name:"version",type:"string"},{name:"chainId",type:"uint256"},{name:"verifyingContract",type:"address"}],Group:[{name:"name",type:"string"},{name:"members",type:"Person[]"}],Mail:[{name:"from",type:"Person"},{name:"to",type:"Person[]"},{name:"contents",type:"string"}],Person:[{name:"name",type:"string"},{name:"wallets",type:"address[]"}]}},address:A}}],signMessageShortcutsMap=e=>({personal_sign:J,eth_signTypedData_v1:H,eth_signTypedData_v3:ethSignTypedDataV3Shortcuts(e),eth_signTypedData_v4:ethSignTypedDataV4Shortcuts(e)}),L={wallet_sendCalls:[{key:"wallet_sendCalls",data:{chainId:"84532",from:A,calls:[],version:"1",capabilities:{paymaster:{url:"https://paymaster.base.org"}}}}]};function Home(){let{provider:e}=(0,p.Wg)(),[a,r]=l.useState(!!(null==e?void 0:e.connected)),[c,o]=l.useState(void 0);return(0,l.useEffect)(()=>{window.coinbaseWalletExtension&&r(!0)},[]),(0,l.useEffect)(()=>{null==e||e.on("connect",()=>{r(!0)}),null==e||e.on("chainChanged",e=>{o(e)})},[e]),(0,s.jsxs)(t.W,{maxW:y.R,mb:8,children:[(0,s.jsxs)(n.xu,{children:[(0,s.jsx)(i.X,{size:"md",children:"Event Listeners"}),(0,s.jsx)(d.r,{mt:2,templateColumns:{base:"100%"},gap:2,children:(0,s.jsx)(EventListenersCard,{})})]}),(0,s.jsx)(MethodsSection,{title:"Wallet Connection",methods:g}),a&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(MethodsSection,{title:"Switch/Add Chain",methods:b,shortcutsMap:X}),(0,s.jsx)(MethodsSection,{title:"Sign Message",methods:C,shortcutsMap:signMessageShortcutsMap(c)}),(0,s.jsx)(MethodsSection,{title:"Send",methods:f,shortcutsMap:W}),(0,s.jsx)(MethodsSection,{title:"Wallet Tx",methods:S,shortcutsMap:L}),(0,s.jsx)(MethodsSection,{title:"Read-only JSON-RPC Requests",methods:x,shortcutsMap:z})]})]})}function MethodsSection(e){let{title:a,methods:r,shortcutsMap:t}=e;return(0,s.jsxs)(n.xu,{mt:4,children:[(0,s.jsx)(i.X,{size:"md",children:a}),(0,s.jsx)(d.r,{mt:2,templateColumns:{base:"100%",md:"repeat(2, 50%)",xl:"repeat(3, 33%)"},gap:2,children:r.map(e=>(0,s.jsx)(c.P,{w:"100%",children:(0,s.jsx)(RpcMethodCard,{method:e.method,params:e.params,format:e.format,shortcuts:null==t?void 0:t[e.method]})},e.method))})]})}},55024:function(){}},function(e){e.O(0,[221,774,888,179],function(){return e(e.s=48312)}),_N_E=e.O()}]);