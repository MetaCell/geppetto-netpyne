const TESTS = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[6]/div[3]/div/div[1]/button';
const NETPYNE_UI = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[5]/div[2]/div/div[1]/button';
const TUT3 = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[9]/div[4]/div/div/div/div/div[1]/span';
const CELL = '#TreeContainerCutting_component > div > div:nth-child(1) > div > div > div:nth-child(10) > div.rst__nodeContent';
const XCELL = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[10]/div[4]'

const x = path => ({type: 'xpath', path: path})

function testImport(casper, test, toolbox) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function(){
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarImport"]', function(){
			this.click('span[id="appBarImport"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('input[id="appbarImportFileName"]', function(){
			this.click('input[id="appbarImportFileName"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(NETPYNE_UI), function() {
			this.click(x(NETPYNE_UI))
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(TESTS), function() {
			this.click(x(TESTS))
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(XCELL), function() {
			this.evaluate(function(selector) {
				$(selector)['0'].scrollIntoView()
			}, CELL);
		})
	})
	casper.then(function(){
		this.click(x(TUT3))
	})
	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="browserAccept"]')
		})
	})
	
	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="appbarPerformAction"]')
		})
	})
	casper.then(function() {
		this.waitWhileVisible('span[id="appBarImport"]', function() {
			test.assert(false, 'imported HLS without specifying if mod files are required')
		}, function (){
			this.echo("specify if mod files required before importing HLS OK")
		}, 1000)
	})

	casper.then(function() {
		toolbox.click(this, 'appbarImportRequiresMod')
	})

	casper.then(function(){
		toolbox.click(this, 'appbarImportRequiresModNo', 'span')
	})
	casper.then(function(){
		toolbox.click(this, "appbarPerformAction", "button")
	})
	casper.then(function(){
		this.wait(10000)
	})
}

module.exports = {  
  testImport: testImport
}