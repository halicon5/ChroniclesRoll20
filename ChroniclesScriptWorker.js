<script type="text/worker">
var cs = {}; // create namesheet for the chonicles sheet

increm = 0; // generic incrementer variable we will reuse. 


cs.initialize = function() {
	console.log("CHRON cs.initialize")

	this.configAttribs();
	this.configLookupTables();
	this.configManualMods();
	this.configDerivedStats();
	this.assignAttributeChangeTriggers();
	this.assignManualModChangeTriggers();
}

cs.configAttribs = function() {
	console.log("CHRON: cs.configAttribs");

	this.attribs = [];
	this.attribs.push( {"attr": "strength", "adj":"strength-adj",	"honed":"str"} );
	this.attribs.push( {"attr": "size", 	"adj":"size-adj",		"honed":"siz"} );
	this.attribs.push( {"attr": "agility", 	"adj":"agility-adj",	"honed":"agl"} );
	this.attribs.push( {"attr": "reflexes", "adj":"reflexes-adj",	"honed":"ref"} );
	this.attribs.push( {"attr": "constitution", "adj":"constitution-adj", "honed":"con"} );
	this.attribs.push( {"attr": "fortitude", "adj":"fortitude-adj",	"honed":"fort"} );
	this.attribs.push( {"attr": "reasoning", "adj":"reasoning-adj",	"honed":"rea"} );
	this.attribs.push( {"attr": "willpower", "adj":"willpower-adj",	"honed":"will"} );
	this.attribs.push( {"attr": "spirit", 	"adj":"spirit-adj", 	"honed":"spir"} );
	this.attribs.push( {"attr": "perception", "adj":"perception-adj",	"honed":"per"} );

	this.attribHash = {};
	this.attribHash["strength"] = {"honed": "str"};
	this.attribHash["size"] = {"honed": "siz"};
	this.attribHash["agility"] = {"honed": "agl"};
	this.attribHash["reflexes"] = {"honed": "ref"};
	this.attribHash["constitution"] = {"honed": "con"};
	this.attribHash["fortitude"] = {"honed": "fort"};
	this.attribHash["reasoning"] = {"honed": "rea"};
	this.attribHash["willpower"] = {"honed": "will"};
	this.attribHash["spirit"] = {"honed": "spir"};
	this.attribHash["perception"] = {"honed": "per"};
}

cs.configLookupTables = function() {

	this.healingRates = [];
	this.healingRates[0] = 	{ "lw": "No Healing",	"sw":"No Healing", "conrange":"0"};
	this.healingRates[1] = 	{ "lw": "1 per 8 days",	 "sw": "1 per 32 days",	 "conrange": "1-3"};
	this.healingRates[2] = 	{ "lw": "1 per 4 days",	 "sw": "1 per 16 days",	 "conrange": "4-6"};
	this.healingRates[3] = 	{ "lw": "1 per 2 days",	 "sw": "1 per 8 days",	 "conrange": "7-9"};
	this.healingRates[4] = 	{ "lw": "1 per day",	 "sw": "1 per 4 days",	 "conrange": "10-12"};
	this.healingRates[5] = 	{ "lw": "1 per 18 hours",	 "sw": "1 per 3 days",	 "conrange": "13-15"};
	this.healingRates[6] = 	{ "lw": "1 per 12 hours",	 "sw": "1 per 2 days",	 "conrange": "16-18"};
	this.healingRates[7] = 	{ "lw": "1 per 8 hours",	 "sw": "1 per day",	 "conrange": "19-21"};
	this.healingRates[8] = 	{ "lw": "1 per 4 hours",	 "sw": "1 per 18 hours",	 "conrange": "22-24"};
	this.healingRates[9] = 	{ "lw": "1 per 2 hours",	 "sw": "1 per 12 hours",	 "conrange": "25-27"};
	this.healingRates[10] = 	{ "lw": "1 per hour",	 "sw": "1 per 8 hours",	 "conrange": "28-30"};
	this.healingRates[11] = 	{ "lw": "1 per 30 mins",	 "sw": "1 per 4 hours",	 "conrange": "31-33"};
	this.healingRates[12] = 	{ "lw": "1 per 15 mins",	 "sw": "1 per 2 hours",	 "conrange": "34-36"};
	this.healingRates[13] = 	{ "lw": "1 per 10 mins",	 "sw": "1 per hour",	 "conrange": "37-39"};
	this.healingRates[14] = 	{ "lw": "1 per 5 mins",	 "sw": "1 per 30 mins",	 "conrange": "40-42"};
	this.healingRates[15] = 	{ "lw": "1 per 3 mins",	 "sw": "1 per 15 mins",	 "conrange": "43-45"};
	this.healingRates[16] = 	{ "lw": "1 per min",	 "sw": "1 per 10 mins",	 "conrange": "46-48"};
	this.healingRates[17] = 	{ "lw": "1 per 5 rounds",	 "sw": "1 per 5 mins",	 "conrange": "49-51"};
	this.healingRates[18] = 	{ "lw": "1 per 3 rounds",	 "sw": "1 per 3 mins",	 "conrange": "52-54"};
	this.healingRates[19] = 	{ "lw": "1 per round",	 "sw": "1 per min",	 "conrange": "55-57"};
	this.healingRates[20] = 	{ "lw": "2 per round",	 "sw": "1 per 5 rounds",	 "conrange": "58-60"};
	this.healingRates[21] = 	{ "lw": "3 per round",	 "sw": "1 per 3 rounds",	 "conrange": "61-63"};
	this.healingRates[22] = 	{ "lw": "5 per round",	 "sw": "1 per round",	 "conrange": "64-66"};
	this.healingRates[23] = 	{ "lw": "8 per round",	 "sw": "2 per round",	 "conrange": "67-69"};
	this.healingRates[24] = 	{ "lw": "10 per round",	 "sw": "3 per round",	 "conrange": "70+"};
}

cs.configManualMods = function() {
	console.log("CHRON: cs.configManualMods");
	this.manualMods = [];

	this.manualMods.push("strength-adj");
	this.manualMods.push("size-adj");

	this.manualMods.push("height");
	this.manualMods.push("minormove-adj");
	this.manualMods.push("majormove-adj");
	this.manualMods.push("hp-adj");
	this.manualMods.push("stam-adj");
	this.manualMods.push("stamrec-conadj");
	this.manualMods.push("stunpain-adj");
	this.manualMods.push("healing-adj");
	this.manualMods.push("healing-medmod");
	this.manualMods.push("stam-tot");
	this.manualMods.push("wind-percent");

	this.manualMods.push("dr-base");
	this.manualMods.push("dr-armor");
	this.manualMods.push("dr-size");
	this.manualMods.push("dr-agl");
	this.manualMods.push("dr-other");

	this.manualMods.push("absorb-base");
	this.manualMods.push("absorb-armor");
	this.manualMods.push("absorb-other");
}

cs.configDerivedStats = function() {
	console.log("CHRON: cs.configDerivedStats");
	this.derivedStats = [];

	for (var i = 0; i < this.attribs.length; i++) {
		this.derivedStats[this.attribs[i].attr] = [];
		this.derivedStats[this.attribs[i].honed] = [];
	}

	for (var i = 0; i < this.manualMods.length; i++) {
		if (!this.derivedStats[this.manualMods[i]]) {
			this.derivedStats[this.manualMods[i]] = [];
		}
	}

	this.derivedStats["strength"].push( {"calc": cs.calc_lift_haul } );
	
	this.derivedStats["strength-adj"].push( {"calc": cs.calc_movement});
	this.derivedStats["size-adj"].push( {"calc":cs.calc_movement} );
	this.derivedStats["height"].push( {"calc": cs.calc_movement} );
	this.derivedStats["majormove-adj"].push( {"calc": cs.calc_movement});
	this.derivedStats["minormove-adj"].push( {"calc": cs.calc_movement});

	this.derivedStats["spirit"].push( {"calc": cs.calc_maxKarma} );

	this.derivedStats["size"].push( {"calc":cs.calc_hp} );
	this.derivedStats["con"].push( {"calc":cs.calc_hp} );
	this.derivedStats["will"].push( {"calc": cs.calc_hp} );
	this.derivedStats["fort"].push( {"calc": cs.calc_hp} );
	this.derivedStats["hp-adj"].push( {"calc": cs.calc_hp });
	
	this.derivedStats["constitution"].push( {"calc": cs.calc_stamina} );
	this.derivedStats["fortitude"].push( {"calc": cs.calc_stamina} );
	this.derivedStats["willpower"].push( {"calc": cs.calc_stamina} );
	this.derivedStats["spirit"].push( {"calc": cs.calc_stamina} );
	this.derivedStats["stam-adj"].push( {"calc": cs.calc_stamina} );

	this.derivedStats["siz"].push( {"calc":cs.calc_stunPain} );
	this.derivedStats["fort"].push( {"calc":cs.calc_stunPain} );
	this.derivedStats["stunpain-adj"].push( {"calc":cs.calc_stunPain} );

	this.derivedStats["constitution"].push( {"calc": cs.calc_stamRecoveryRate} );
	this.derivedStats["stamrec-conadj"].push( {"calc": cs.calc_stamRecoveryRate} );

	this.derivedStats["wind-percent"].push( {"calc": cs.calc_windRecovery});
	this.derivedStats["stam-tot"].push({"calc": cs.calc_windRecovery});

	this.derivedStats["constitution"].push( {"calc": cs.calc_healingRates} );
	this.derivedStats["healing-adj"].push( {"calc": cs.calc_healingRates} );
	this.derivedStats["healing-medmod"].push( {"calc": cs.calc_healingRates} );

}


cs.assignAttributeChangeTriggers = function() {
	console.log ("CHRON: cs.assignAttributeChangeTriggers");
	this.dynamAttribChangeString = "";
	this.dynamHonedChangeString = "";
	this.dynamAdjChangeString = "";
	for (var i = 0; i < this.attribs.length; i++) {
		this.dynamAttribChangeString += "change:a-" + this.attribs[i].attr.toLowerCase() + " ";
		this.dynamHonedChangeString += "change:" + this.attribs[i].honed.toLowerCase() + " ";
		this.dynamAdjChangeString += "change:a-" + this.attribs[i].adj.toLowerCase() + " ";
	}
	console.log (this.dynamAttribChangeString);
	console.log (this.dynamHonedChangeString);
	console.log (this.dynamAdjChangeString);

	on(cs.dynamAttribChangeString, cs.processChangedAttribute);
	on(cs.dynamAdjChangeString, cs.processChangedAttribAdj);
	on(cs.dynamHonedChangeString, cs.processChangedHonedAttrib);
}

cs.assignManualModChangeTriggers = function() {
	console.log ("CHRON: cs.assignAttributeChangeTriggers");	
	this.dynamManualModChangeString = "";
	for (var i = 0; i < this.manualMods.length; i++) {
		this.dynamManualModChangeString += "change:" + this.manualMods[i] + " ";
	}
	console.log(this.dynamManualModChangeString);

	on(cs.dynamManualModChangeString, cs.processChangedManualMod);
}


cs.processChangedAttribute = function(e) {
	console.log("CHRON: cs.processChangedAttribute");
	console.log(e);
	cs.setAttributeAdj(e);
	cs.setDerivedStats(e);
}

cs.processChangedAttribAdj = function(e) {
	console.log("CHRON: cs.processChangedAttribAdj");
	cs.setHonedWithinLimits(e);
	cs.setDerivedStats(e);
}

cs.processChangedHonedAttrib = function(e) {
	console.log("CHRON: cs.processChangedHonedAttrib");
	console.log(e);
	cs.setHonedWithinLimits(e);
	cs.setDerivedStats(e);
}

cs.processChangedManualMod = function(e) {
	cs.setDerivedStats(e);
}

cs.setAttributeAdj = function(e) {
	console.log("CHRON: cs.setAttributeAdj");
	getAttrs([e.sourceAttribute], function(v) {
		var targ = e.sourceAttribute + "-adj";
		var targVal = cs.calc_attribAdj(v[e.sourceAttribute]);
		var targObj = {};
		targObj[targ] = targVal;
		setAttrs(targObj);
	});
}

cs.setHonedWithinLimits = function(e) {
	console.log("CHRON: cs.setHonedWithinLimits " + e.sourceAttribute);
	var honedName;
	var attribAdj;
	if (e.sourceAttribute.length > 4) {
		 honedName = cs.get_honed_from_attrib(e.sourceAttribute);
		 attribAdj = e.sourceAttribute;
	} else {
		honedName = e.sourceAttribute;
		for (var i = 0; i < cs.attribs.length; i++) {
			if (cs.attribs[i].honed === honedName) {
				attribAdj = "a-" + cs.attribs[i].adj;
				break;
			}
		}
	}
	getAttrs([honedName,attribAdj], function(v) { 
		var targObj = {};

		if (cs.getIntegerValue(v[honedName],0) <= 2 && cs.getIntegerValue(v[attribAdj],0) <= 2) {
			targObj[honedName] = cs.getIntegerValue(v[attribAdj],0);
		} else if (cs.getIntegerValue(v[honedName],0) <= 2 && cs.getIntegerValue(v[attribAdj],0) >= 2) {
			targObj[honedName] = 2;;
		}  else if ( cs.getIntegerValue(v[attribAdj],0) <= cs.getIntegerValue(v[honedName],0) ) {
			targObj[honedName] = cs.getIntegerValue(v[attribAdj]);
		}  else if (cs.getIntegerValue(v[attribAdj],0) >= cs.getIntegerValue(v[honedName],0) ) {
			targObj[honedName] = cs.getIntegerValue(v[honedName],0);
		}
		setAttrs(targObj);	
	});
}

cs.setDerivedStats = function(e) {
	console.log("CHRON: cs.setDerivedStats " + e.sourceAttribute);
	var attribName = e.sourceAttribute.replace("a-","");
	if(cs.derivedStats[attribName] && cs.derivedStats[attribName].length > 0) {
		var shct = cs.derivedStats[attribName];
		for (var i = 0; i < shct.length; i++) {
			if (shct[i].calc) {
				shct[i].calc(e);
			}
		}
	}

}

cs.getIntegerValue = function(value, assumed) {
	if (value === undefined && assumed !== undefined) {
		return assumed;
	}
	if (value === undefined && assumed === undefined) {
		return 0;
	}
	if (value === 0) return 0;

	if (value.replace) {
		value = value.replace("+","");
	}

	if ( (isNaN(value) || !value ) ) {
		return (assumed) ? 0 : assumed;
	} else {
		return parseInt(value,10);
	}
}

cs.convertHeightToInches = function(height) {
	console.log("CHRON: cs.convertHeightToInches");
	var feet;
	var inches;
	if (height.toString) {height = height.toString()};

	if (height.split) {
		var splitArray;
		var remExp = /\D/ig
		splitArray = height.split("'");

		for (var i = 0; i < splitArray.length; i++) {
			if (splitArray[i].replace) {
				splitArray[i] = splitArray[i].replace(remExp, "");
			}
		}

		feet = (splitArray[0]) ? cs.getIntegerValue(splitArray[0],0) : 0;
		inches = (splitArray[1]) ? cs.getIntegerValue(splitArray[1],0) : 0;
		return feet * 12 + inches;
	} else {
		// just assume 5 feet
		return 60;
	}
}

cs.calc_attribAdj = function(attribRank) {
	if (isNaN(attribRank)) {
		return 0;
	}
	return Math.floor( (parseInt(attribRank) - 10) / 2);
}

cs.get_honed_from_attrib = function(attribInfo) {
	var attribName = attribInfo.replace("a-","");
	attribName = attribName.replace("-adj","");
	return (this.attribHash[attribName]) ? this.attribHash[attribName].honed : "";
}

cs.calc_lift_haul = function(e) {
	console.log("CHRON: cs.calc_lift");
	getAttrs(["a-strength"], function(v) { 
		var strength = cs.getIntegerValue(v["a-strength"],1);
		var lift = 5;
		var haul = 0;
		for (var i = 2; i <= strength; i++) {
			lift = Math.round((lift + 2.75 * i)/10) * 10;
		}
		haul = Math.round(Math.floor(lift * 15/8)/10)*10;

		var targObj = {};
		targObj["lift"] = lift;
		targObj["haul"] = haul;
		setAttrs(targObj);
	});
}


cs.calc_movement = function(e) {
	console.log("CHRON: cs.calc_movement " + e.sourceAttribute);

	getAttrs(["height", "a-strength-adj", "a-size-adj", "minormove-adj", "majormove-adj"], function(v) {
		console.log(v);
		var majMoveBase = 10;
		var majMoveTot, minMoveBase, minMoveTot = 0;
		var inches = cs.convertHeightToInches(v["height"]);

		var heightMod = 0;

		if (inches < 60) {
			heightMod = Math.floor( (inches - 60)/6 );
			heightMod = (heightMod < -5) ? -5 : heightMod;
		} else if (inches > 72) {
			heightMod = Math.round( (inches - 72)/12);
		}

		var strSizeMod = (cs.getIntegerValue(v["a-str-adj"]),0) - (cs.getIntegerValue(v["a-size-adj"],0));
		strSizeMod = (strSizeMod > 3) ? 3 : strSizeMod;

		majMoveBase = majMoveBase + heightMod + strSizeMod;
		majMoveBase = (majMoveBase < 1) ? 1 : majMoveBase;
		majMoveTot = majMoveBase + cs.getIntegerValue(v["majormove-adj"],0);

		minMoveBase = Math.round(majMoveTot/3);
		minMoveBase = (minMoveBase < 1) ? 0 : minMoveBase;
		minMoveTot = minMoveBase + cs.getIntegerValue(v["minormove-adj"],0);

		var targObj = {};
		targObj["minormove"] = minMoveBase;
		targObj["minormove-tot"] = minMoveTot;
		targObj["majormove"] = majMoveBase;
		targObj["majormove-tot"] = majMoveTot;
		setAttrs(targObj);
	});
}

cs.calc_stamina = function(e) {
	console.log("CHRON: cs.calc_stamina");
	getAttrs(["a-constitution","a-fortitude","a-willpower","a-spirit","stam-adj"], function(v) {
		var stamBase = 0;
		var stamTot = 0;

		stamTot = cs.getIntegerValue(v["a-constitution"],0);
		stamTot += cs.getIntegerValue(v["a-fortitude"],0);
		stamTot += cs.getIntegerValue(v["a-willpower"],0);
		stamTot += cs.getIntegerValue(v["a-spirit"],0);
		stamBase = stamTot;
		stamTot += cs.getIntegerValue(v["stam-adj"],0);

		var targObj = {};
		targObj["stam-base"] = stamBase;
		targObj["stam-tot"] = stamTot;
		setAttrs(targObj);

	});
}

cs.calc_hp = function(e) {
	console.log("CHRON cs.calc_hp");
	getAttrs(["a-size","con","fort","will","hp-adj"], function(v) {
		var hpBase = 0;
		var hpTot = 0;
		hpTot = cs.getIntegerValue(v["a-size"],0) * 2;
		hpTot += cs.getIntegerValue(v["con"],0);
		hpTot += cs.getIntegerValue(v["fort"],0);
		hpTot += cs.getIntegerValue(v["will"],0);
		
		hpBase = hpTot;
		hpTot += cs.getIntegerValue(v["hp-adj"],0);

		var targObj = {};
		targObj["hp-base"] = hpBase;
		targObj["hp-tot"] = hpTot;
		setAttrs(targObj);
	})
}

cs.calc_stunPain = function(e) {
	console.log("CHRON: cs.calc_stunPain");
	getAttrs(["siz","fort","stunpain-adj"], function(v) {
		var sp_base = cs.getIntegerValue(v["siz"],0) + cs.getIntegerValue(v["fort"],0);
		var sp_tot = sp_base + cs.getIntegerValue(v["stunpain-adj"],0);
		var targObj = {};
		targObj["stunpain-base"] = sp_base;
		targObj["stunpain-tot"] = sp_tot;
		setAttrs(targObj);
	});
}

cs.calc_stamRecoveryRate = function(e) {
	console.log("CHRON: cs.alc_stamRecoveryRate");
	getAttrs(["a-constitution","stamrec-conadj"], function(v) {
		var recbase = Math.round(cs.getIntegerValue(v["a-constitution"],0)/3);
		var rectot = Math.round( ((cs.getIntegerValue(v["a-constitution"],0) + cs.getIntegerValue(v["stamrec-conadj"],0)) / 3) );
		var targObj = {};
		targObj["stamrec-base"] = recbase;
		targObj["stamrec-tot"] = rectot;
		setAttrs(targObj);
	});
}

cs.calc_windRecovery = function(e) {
	console.log("CHRON: cs.calc_windRecovery");
	getAttrs(["stam-tot","wind-percent"], function(v) {
		var windstam = Math.round( cs.getIntegerValue(v["stam-tot"],0) * cs.getIntegerValue(v["wind-percent"],20) / 100 );
		targObj = {};
		targObj["windstam"] = windstam;
		setAttrs(targObj);
	});
}

cs.calc_maxKarma = function(e) {
	console.log("CHRON: cs.calc_maxKarma");
	getAttrs(["a-spirit"], function(v) {
		var maxKarma = cs.getIntegerValue(v["a-spirit"],0);
		setAttrs( {"karma-max": maxKarma});
	});
}

cs.calc_healingRates = function(e) {
	console.log("CHRON: cs.calc_healingRates");
	getAttrs(["a-constitution", "healing-medmod", "healing-adj"], function(v) {
		var healCon = cs.getIntegerValue(v["a-constitution"],0) + cs.getIntegerValue(v["healing-adj"],0) + cs.getIntegerValue(v["healing-medmod"],0);
		var healCon = Math.ceil(healCon / 3);
		if (healCon > 24) healcon = 24;
		if (healCon < 0) healCon = 0;

		var targObj = {};
		if (cs.healingRates[healCon]) {
			targObj["heal-wnd"] = cs.healingRates[healCon].lw;
			targObj["heal-svr"] = cs.healingRates[healCon].sw;
		} else {
			targObj["heal-wnd"] = cs.healingRates[0].lw;
			targObj["heal-svr"] = cs.healingRates[0].sw;
		}
		setAttrs(targObj);
	});
}

cs.initialize();
</script>