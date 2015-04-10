describe("Unit: NodeController", function() {
	beforeEach(module("app"));
	
	var ctrl, scope;
	
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		//give some fake data to test
		scope.nodeList = {
			"ple01.fc.univie.ac.at": {
				"logs": [],
				"hostname": "ple01.fc.univie.ac.at",
				"index": 1
			},
			"onelab1.info.ucl.ac.be": {
				"logs": [],
				"hostname": "onelab1.info.ucl.ac.be",
				"index": 2
			},
			"onelab3.info.ucl.ac.be": {
				"logs": [],
				"hostname": "onelab3.info.ucl.ac.be",
				"index": 3
			},
			"planetlab2.montefiore.ulg.ac.be": {
				"logs": [],
				"hostname": "planetlab2.montefiore.ulg.ac.be",
				"index": 4
			},
			"planetlab-1.cs.ucy.ac.cy": {
				"logs": [],
				"hostname": "planetlab-1.cs.ucy.ac.cy",
				"index": 5
			},
			"planetlab-4.cs.ucy.ac.cy": {
				"logs": [],
				"hostname": "planetlab-4.cs.ucy.ac.cy",
				"index": 6
			},
			"planetlab1.bgu.ac.il": {
				"logs": [],
				"hostname": "planetlab1.bgu.ac.il",
				"index": 7
			},
			"planetlab2.mta.ac.il": {
				"logs": [],
				"hostname": "planetlab2.mta.ac.il",
				"index": 8
			},
			"pl1.sos.info.hiroshima-cu.ac.jp": {
				"logs": [],
				"hostname": "pl1.sos.info.hiroshima-cu.ac.jp",
				"index": 9
			},
			"planet1.pnl.nitech.ac.jp": {
				"logs": [],
				"hostname": "planet1.pnl.nitech.ac.jp",
				"index": 10
			},
			"planetlab4.goto.info.waseda.ac.jp": {
				"logs": [],
				"hostname": "planetlab4.goto.info.waseda.ac.jp",
				"index": 11
			},
			"csplanetlab3.kaist.ac.kr": {
				"logs": [],
				"hostname": "csplanetlab3.kaist.ac.kr",
				"index": 12
			},
			"netapp6.cs.kookmin.ac.kr": {
				"logs": [],
				"hostname": "netapp6.cs.kookmin.ac.kr",
				"index": 13
			},
			"planetlab1.aut.ac.nz": {
				"logs": [],
				"hostname": "planetlab1.aut.ac.nz",
				"index": 14
			},
			"planetlab1.ecs.vuw.ac.nz": {
				"logs": [],
				"hostname": "planetlab1.ecs.vuw.ac.nz",
				"index": 15
			},
			"planetlab2.cs.otago.ac.nz": {
				"logs": [],
				"hostname": "planetlab2.cs.otago.ac.nz",
				"index": 16
			},
			"ple1.ait.ac.th": {
				"logs": [],
				"hostname": "ple1.ait.ac.th",
				"index": 17
			},
			"planetlab-1.imperial.ac.uk": {
				"logs": [],
				"hostname": "planetlab-1.imperial.ac.uk",
				"index": 18
			},
			"planetlab-3.imperial.ac.uk": {
				"logs": [],
				"hostname": "planetlab-3.imperial.ac.uk",
				"index": 19
			},
			"planetlab1.nrl.eecs.qmul.ac.uk": {
				"logs": [],
				"hostname": "planetlab1.nrl.eecs.qmul.ac.uk",
				"index": 20
			},
			"planetlab2.nrl.eecs.qmul.ac.uk": {
				"logs": [],
				"hostname": "planetlab2.nrl.eecs.qmul.ac.uk",
				"index": 21
			},
			"planetlab3.cs.st-andrews.ac.uk": {
				"logs": [],
				"hostname": "planetlab3.cs.st-andrews.ac.uk",
				"index": 22
			},
			"planetlab4.cs.st-andrews.ac.uk": {
				"logs": [],
				"hostname": "planetlab4.cs.st-andrews.ac.uk",
				"index": 23
			},
			"uoepl2.essex.ac.uk": {
				"logs": [],
				"hostname": "uoepl2.essex.ac.uk",
				"index": 24
			},
			"planetlab1.dojima.wide.ad.jp": {
				"logs": [],
				"hostname": "planetlab1.dojima.wide.ad.jp",
				"index": 25
			},
			"planetlab1.sfc.wide.ad.jp": {
				"logs": [],
				"hostname": "planetlab1.sfc.wide.ad.jp",
				"index": 26
			},
			"planetlab-coffee.ait.ie": {
				"logs": [],
				"hostname": "planetlab-coffee.ait.ie",
				"index": 27
			},
			"node1.planetlab.albany.edu": {
				"logs": [],
				"hostname": "node1.planetlab.albany.edu",
				"index": 28
			},
			"planetlab02.alucloud.com": {
				"logs": [],
				"hostname": "planetlab02.alucloud.com",
				"index": 29
			},
			"planetlab2.arizona-gigapop.net": {
				"logs": [],
				"hostname": "planetlab2.arizona-gigapop.net",
				"index": 30
			},
			"planetlab2.cs.aueb.gr": {
				"logs": [],
				"hostname": "planetlab2.cs.aueb.gr",
				"index": 31
			},
			"plnode-04.gpolab.bbn.com": {
				"logs": [],
				"hostname": "plnode-04.gpolab.bbn.com",
				"index": 32
			},
			"pl2.bell-labs.fr": {
				"logs": [],
				"hostname": "pl2.bell-labs.fr",
				"index": 33
			},
			"planetlab2.tmit.bme.hu": {
				"logs": [],
				"hostname": "planetlab2.tmit.bme.hu",
				"index": 34
			},
			"scratchy.comlab.bth.se": {
				"logs": [],
				"hostname": "scratchy.comlab.bth.se",
				"index": 35
			},
			"planetlab-1.calpoly-netlab.net": {
				"logs": [],
				"hostname": "planetlab-1.calpoly-netlab.net",
				"index": 36
			},
			"saturn.planetlab.carleton.ca": {
				"logs": [],
				"hostname": "saturn.planetlab.carleton.ca",
				"index": 37
			},
			"pl2.ccsrfi.net": {
				"logs": [],
				"hostname": "pl2.ccsrfi.net",
				"index": 38
			},
			"planetlab2.cesnet.cz": {
				"logs": [],
				"hostname": "planetlab2.cesnet.cz",
				"index": 39
			},
			"ple1.cesnet.cz": {
				"logs": [],
				"hostname": "ple1.cesnet.cz",
				"index": 40
			}
		};
		scope.sets = ["ple01.fc.univie.ac.at", "onelab1.info.ucl.ac.be"];
		ctrl = $controller("nodeCtrl", {
			$scope: scope
		});		
	}));
	
	it("test hexDecode", function() {	
		expect(scope.hexDecode("61")).toEqual("a");
	});
	
	it("test hexEncode", function() {	
		expect(scope.hexEncode("a")).toEqual("61");
	});
});