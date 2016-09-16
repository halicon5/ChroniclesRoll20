var cs = {}; // create namesheet for the chonicles sheet

increm = 0; // generic incrementer variable we will reuse. 


cs.initialize = function() {
	console.log("CHRON cs.initialize")

	this.configAttribs();
	this.configDerivedStats();
	this.assignAttributeChangeTriggers();
}

cs.configAttribs = function() {
	console.log("CHRON: cs.configAttribs");

	increm = 0;
	this.attribs = [];
	this.attribs[increm++] = {"attr": "strength",	"honed":"str"};
	this.attribs[increm++] = {"attr": "size", 		"honed":"siz"};
	this.attribs[increm++] = {"attr": "agility", 	"honed":"agl"};
	this.attribs[increm++] = {"attr": "reflexes", 	"honed":"ref"};
	this.attribs[increm++] = {"attr": "constitution", "honed":"con"};
	this.attribs[increm++] = {"attr": "fortitude", 	"honed":"fort"};
	this.attribs[increm++] = {"attr": "reasoning", 	"honed":"rea"};
	this.attribs[increm++] = {"attr": "willpower", 	"honed":"will"};
	this.attribs[increm++] = {"attr": "spirit", 	"honed":"spir"};
	this.attribs[increm++] = {"attr": "perception",	"honed":"per"};
}

cs.configDerivedStats = function() {
	console.log("CHRON: cs.configDerivedStats");

	this.derivedStats = [];
	this.derivedStats["strength"] = [];
	this.derivedStats["size"] = [];
	this.derivedStats["agility"] = [];
	this.derivedStats["reflexes"] = [];
	this.derivedStats["constitution"] = [];
	this.derivedStats["fortitude"] = [];
	this.derivedStats["reasoning"] = [];
	this.derivedStats["willpower"] = [];
	this.derivedStats["spirit"] = [];
	this.derivedStats["perception"] = [];

	this.derivedStats["str"] = [];
	this.derivedStats["siz"] = [];
	this.derivedStats["agl"] = [];
	this.derivedStats["ref"] = [];
	this.derivedStats["con"] = [];
	this.derivedStats["fort"] = [];
	this.derivedStats["rea"] = [];
	this.derivedStats["will"] = [];
	this.derivedStats["spir"] = [];
	this.derivedStats["per"] = [];

	console.log("CHRON: setting strength derived stat functions");
	increm = 0;
	this.derivedStats["strength"][increm++] = {"calc": cs.calc_lift };
	this.derivedStats["strength"][increm++] = {"calc": cs.calc_haul };

	increm = 0;
	this.derivedStats["str"][increm++] = {"calc": cs.calc_movement};

	console.log("CHRON: setting size derived stat function");
	increm = 0;
	this.derivedStats["size"][increm++] = {"calc":cs.calc_hp};

	increm = 0;
	this.derivedStats["siz"][increm++] = {"calc":cs.calc_stunPain};

	increm = 0;
	this.derivedStats["constitution"][increm++] = {"calc": cs.calc_stamRecoveryRate};
	this.derivedStats["constitution"][increm++] = {"calc": cs.calc_stamina};

	increm = 0;
	this.derivedStats["con"][increm++] = {"calc":cs.calc_hp};

	increm = 0;
	this.derivedStats["fortitude"][increm++] = {"calc": cs.calc_stamina};

	increm = 0;
	this.derivedStats["fort"][increm++] = {"calc":cs.calc_stunPain};

	increm = 0;
	this.derivedStats["willpower"][increm++] = {"calc": cs.calc_stamina};

	increm = 0;
	this.derivedStats["will"][increm++] = {"calc": cs.calc_hp};

	increm = 0;
	this.derivedStats["spirit"][increm++] = {"calc": cs.calc_stamina};

}

cs.assignAttributeChangeTriggers = function() {
	console.log ("CHRON: cs.assignAttributeChangeTriggers");
	this.dynamAttribChangeString = "";
	this.dynamHonedChangeString = "";
	for (var i = 0; i < this.attribs.length; i++) {
		this.dynamAttribChangeString += "change:a-" + this.attribs[i].attr + " ";
		this.dynamHonedChangeString += "change:" + this.attribs[i].honed.toLowerCase() + " ";
	}
	console.log (this.dynamAttribChangeString);
	console.log (this.dynamHonedChangeString);

	on(cs.dynamAttribChangeString, cs.processChangedAttribute);
	on(cs.dynamHonedChangeString, cs.processChangedHonedAttrib);
}


cs.processChangedAttribute = function(e) {
	console.log("CHRON: cs.processChangedAttribute");
	console.log(e);
	cs.setAttributeAdj(e);
	cs.setDerivedStats(e);
}

cs.processChangedHonedAttrib = function(e) {
	console.log("CHRON: cs.processChangedHonedAttrib");
	console.log(e);
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

cs.setDerivedStats = function(e) {
	console.log("CHRON: cs.setAttributeAdj");
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


cs.calc_attribAdj = function(attribRank) {
	if (isNaN(attribRank)) {
		return 0;
	}
	return Math.floor( (parseInt(attribRank) - 10) / 2);
}

cs.calc_lift = function(e) {
	console.log("CHRON cs.calc_lift");
}

cs.calc_haul = function(e) {
	console.log("CHRON cs.calc_haul");
}

cs.calc_movement = function(e) {
	console.log("CHRON cs.calc_movement");	
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
}

cs.calc_stamRecoveryRate = function(e) {
	console.log("CHRON: cs.alc_stamRecoveryRate");
}

cs.getIntegerValue = function(value, assumed) {
	if (value === 0) return 0;

	if ( (isNaN(value) || !value ) ) {
		return (assumed) ? 0 : assumed;
	} else {
		return parseInt(value,10);
	}
}

cs.initialize();