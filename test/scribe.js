var Scribe = artifacts.require("./Scribe.sol");
const MyERC721 = artifacts.require("./MyERC721.sol");

contract("Scribe", function(accounts) {
  var scribeInstance;
  var myERC721Instance;
  var documentKey;

  var tokenOwnerAddress = "0xD68f4893e2683BE6EfE6Aab3fca65848ACAFcC05"

  var dictationMessage = "This is a message"

  it("initializes contracts", function() {
    return Scribe.deployed().then(function(instance) {
      scribeInstance = instance;

      return MyERC721.deployed();
      // return scribeInstance.getDocumentKey(tokenAddress, tokenId)
    }).then(function(instance) {
    	myERC721Instance = instance;


		// documentKey = _documentKey;

      	// assert.equal(documentKey, "0xd68f4893e2683be6efe6aab3fca65848acafcc050000000000000000000000000000000000000000000000000000000000000001");
    });
  });

  it("mints a sample ERC721 token and asserts that the token was minted and received", function() {
    return myERC721Instance.mintUniqueTokenTo(tokenOwnerAddress, 3, "QmZuKRfpCWV8SWgFcvjUWWQtn47axMYmdrPafvzTmppTPv").then(function(tx) {
    	return myERC721Instance.ownerOf(3);
    }).then(function(owner) {    
      assert.equal(owner, tokenOwnerAddress)
    });
  });

  it("dictates a record for the scribe and that the message is expected", function() {
    return scribeInstance.dictate(myERC721Instance.address, 3, dictationMessage).then(function(tx) {    	
    	return scribeInstance.getDocumentKey(myERC721Instance.address, 3);
    }).then(function(_documentKey) {    
    	documentKey = _documentKey;

    	return scribeInstance.documents(documentKey, 0);
    }).then(function(document) {    
    	console.log(document.dictator)
    	console.log(document.text)
    	
    	assert.equal(document.text, dictationMessage)
    });
  });

  // it("records one message and asserts document count is still correct", function() {
  //   return Scribe.deployed().then(function(instance) {
  //     scribeInstance.dictate(tokenAddress, tokenId, "Foo")

  //     return scribeInstance.documentsCount(documentKey)
  //   }).then(function(documentsCount) {    
  //     assert.equal(documentsCount, 3);
  //   });
  // });

  // it("asserts that message from first recording is correct", function() {
  //   return Scribe.deployed().then(function(instance) {
  //     return scribeInstance.documents(documentKey, 0)
  //   }).then(function(document) {    
  //   	assert.equal(document.text, "Hello")
  //   });
  // });

  // it("records message for new token and asserts that document count is correct", function() {
  //   return Scribe.deployed().then(function(instance) {
		// tokenId = 2
      	
  //     	scribeInstance.dictate(tokenAddress, tokenId, "Piano")

  //     	return scribeInstance.getDocumentKey(tokenAddress, tokenId)
  //   }).then(function(_documentKey) {    
  //   	documentKey = _documentKey;
    	
  //   	return scribeInstance.documentsCount(documentKey);
  //   }).then(function(documentsCount) {
  //   	assert.equal(documentsCount, 1)
  //   })
  // });
});