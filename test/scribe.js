var Scribe = artifacts.require("./Scribe.sol");

contract("Scribe", function(accounts) {
  var scribeInstance;
  var documentKey;

  var tokenAddress = "0xD68f4893e2683BE6EfE6Aab3fca65848ACAFcC05";
  var tokenId = 1;

  it("initializes and checks for valid document key generation", function() {
    return Scribe.deployed().then(function(instance) {
      scribeInstance = instance;

      return scribeInstance.getDocumentKey(tokenAddress, tokenId)
    }).then(function(_documentKey) {
		documentKey = _documentKey;

      	assert.equal(documentKey, "0xd68f4893e2683be6efe6aab3fca65848acafcc050000000000000000000000000000000000000000000000000000000000000001");
    });
  });

  it("records two messages and asserts document count is correct", function() {
    return Scribe.deployed().then(function(instance) {
      scribeInstance.dictate(tokenAddress, tokenId, "Hello")
      scribeInstance.dictate(tokenAddress, tokenId, "World")

      return scribeInstance.documentsCount(documentKey)
    }).then(function(documentsCount) {    
      assert.equal(documentsCount, 2);
    });
  });

  it("records one message and asserts document count is still correct", function() {
    return Scribe.deployed().then(function(instance) {
      scribeInstance.dictate(tokenAddress, tokenId, "Foo")

      return scribeInstance.documentsCount(documentKey)
    }).then(function(documentsCount) {    
      assert.equal(documentsCount, 3);
    });
  });

  it("asserts that message from first recording is correct", function() {
    return Scribe.deployed().then(function(instance) {
      return scribeInstance.documents(documentKey, 0)
    }).then(function(document) {    
    	assert.equal(document.text, "Hello")
    });
  });

  it("records message for new token and asserts that document count is correct", function() {
    return Scribe.deployed().then(function(instance) {
		tokenId = 2
      	
      	scribeInstance.dictate(tokenAddress, tokenId, "Piano")

      	return scribeInstance.getDocumentKey(tokenAddress, tokenId)
    }).then(function(_documentKey) {    
    	documentKey = _documentKey;
    	
    	return scribeInstance.documentsCount(documentKey);
    }).then(function(documentsCount) {
    	assert.equal(documentsCount, 1)
    })
  });
});