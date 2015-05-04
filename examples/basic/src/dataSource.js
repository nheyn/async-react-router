/*------------------------------------------------------------------------------------------------*/
//	--- Simple Data Source ---
/*------------------------------------------------------------------------------------------------*/
function DataSource() {

}

DataSource.prototype.getData = function(query) {
	switch(query.from) {
		case 'ds1':	return { 'article': 'Page one content (from Data Source)' };
		case 'ds2':	return { 'article': 'Page two content (from Data Source)' };
		case 'ds3':	return { 'article': 'Page three content (from Data Source)' };
		default:	return null;
	}
};

DataSource.prototype.getDataAsync = function(query) {
	var data = this.getData(query);
	return data? Promise.resolve(data): Promise.reject(new Error('Invalid Query'));
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = DataSource;