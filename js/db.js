var dbPromised = idb.open("live-score", 1, function(upgradeDb) {
  var articlesObjectStore = upgradeDb.createObjectStore("team", {
	keyPath: "id"
  });
  articlesObjectStore.createIndex("name", "name", { unique: false });
});

function addToFav(team) {
  dbPromised
	.then(function(db) {
	  var tx = db.transaction("team", "readwrite");
	  var store = tx.objectStore("team");
	  console.log(team);
	  store.put(team);
	  return tx.complete;
	})
	.then(function() {
		M.toast({html: 'Tim favorit berhasil disimpan.'});
	});
}

function removeFromFav(id){
	dbPromised.then(function(db) {
      var tx = db.transaction('team', 'readwrite');
      var store = tx.objectStore('team');
      store.delete(id);
      return tx.complete;
    }).then(function() {
		M.toast({html: 'Tim favorit berhasil dihapus.'});
    });
}

function getAllFav() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.getAll();
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.get(parseInt(id, 10));
      })
      .then(function(team) {
        resolve(team);
      })
	  .catch(function(error){
		  console.log(error)
	  });
  });
}