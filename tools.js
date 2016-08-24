/**
 * Created by crispin on 16/08/16.
 */
function find(key, array) {
	// The variable results needs var in this case (without 'var' a global variable is created)
	var results = [];
	for (var i = 0; i < array.length; i++) {
		if (array[i].indexOf(key) == 0) {
			results.push(array[i]);
		}
	}
	return results;
}
