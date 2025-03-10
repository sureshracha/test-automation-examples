import * as  fs from 'fs-extra';
try {
	fs.ensureDir("test-results-e2e");
	fs.emptyDir("test-results-e2e");

} catch (error) {
	console.log("Folder not created! " + error);
}
