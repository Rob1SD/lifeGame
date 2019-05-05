 var sizeGrille = 100;
 var caseColor="black";
 var playerList=[];
 var colorList = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke"];
 var nouritures=[];
 var populationSize=50;
 var quantiteNouriture=sizeGrille * sizeGrille / 4 ;
 var dayDuration = 20;
 var tailleCase = parseInt(38 * 20 / sizeGrille);
 var vitesseDeplacement = 0.025;
 $(document).ready(function() {
	 
	

	for (var i = 0; i < sizeGrille; ++i)
	{
	 var line = '<div id="line'+i+'" style="display:inline-flex"></div>'
	 $("#grille").append(line);
	 for (var j = 0; j < sizeGrille; ++j)
	 {
		var caseId="case"+i+"_"+j;
		//border:solid;border-color:brown;
		var elem = '<div id="'+caseId+'" style="height:'+tailleCase+'px;width:'+tailleCase+'px;background-color:'+caseColor+';"></div>'
		$("#line"+i).append(elem);
	 }
	 
	}
	var generation0=[];
	for (var i = 0; i < populationSize; ++i){
	 var p1 = new Player(colorList[0]);
	 p1.afficher();
	 generation0.push(p1);
	 
	}
	playerList.push(generation0);
	//console.log(playerList);
	monitor();
	spawnFood();
	var deplacerPersonnagesInterval = setInterval(deplacerPlayers, 1000 * vitesseDeplacement);
	var jourInterval = setInterval(initDay, dayDuration * 1000);

})
var initDay = function()
{
	// console.log(playerList);
	
	
	CheckForDead();
	reproduction();
	resetFood();
	
	
	spawnFood();
	monitor();
}
var monitor = function(){
	$("#monitor").html("");
	var total = 0;
	playerList.forEach(function(item, index, array)
	{
		if (item.length > 0){
			var color=item[0].color;
			var generation=item[0].generation;
			total+=item.length;
			
			var elem = '<div id="Generation'+generation+'">Generation'+generation+'<div style="height:'+tailleCase+'px;width:'+tailleCase+'px;border:solid;border-color:brown;display:inline-flex;background-color:'+color+';"></div> : '+item.length+' membres</div>'
			$("#monitor").append(elem);
			$("#Generation"+generation).click(function(){
				var id = this.id.replace("Generation","");
				$("#info").html("");
				// console.log(id);
				var infoLines = [];
				infoLines.push('<div>Generation : '+playerList[id][0].generation+'</div>');
				infoLines.push('<div>Mutant : '+playerList[id][0].mutant+'</div>');
				infoLines.push('<div>Mutation chance : '+playerList[id][0].mutationRate+'</div>');
				infoLines.push('<div>Reserve : '+playerList[id][0].reserve+'</div>');
				infoLines.push('<div>DeathRate : '+playerList[id][0].deathRate+'</div>');
				infoLines.forEach(function(item, index, array)
				{
					$("#info").append(item);
					
				});
				
				
			});
		}
		
		
	});
	if (total == 0){
		window.location.reload()
	}
	$("#monitor").append('<div>Nombre de joueur total : '+total+'</div>');
	
}
var reproduction = function(){
	playerList.forEach(function(item, index, array)
	{
		item.forEach(function(item1, index1, array1)
		{
			item1.reproduce();
		});
		
	});
}
var resetFood = function(){
	playerList.forEach(function(item, index, array)
	{
		item.forEach(function(item1, index1, array1)
		{
			item1.nouriture-=1;
			if (item1.nouriture > 0)
			{
				item1.currReserve = item1.nouriture + item1.currReserve > item1.reserve ? item1.reserve : item1.nouriture + item1.currReserve;
			}
			
		});
		
	});
}
var CheckForDead = function(){
	playerList.forEach(function(item, index, array)
	{
		item.forEach(function(item1, index1, array1)
		{
			var randomDeath = getRandomInt(0,10000);
			if (randomDeath < item1.deathRate){
				item1.cacher();
				item.splice(index1,1);
				// if (item.length==0)
					// playerList.splice(index,1);
				CheckForDead();
				return;
			}
			
			if (item1.nouriture==0){
				if (item1.currReserve > 0)
				{
					item1.nouriture+=1;
					item1.currReserve-=1;
					CheckForDead();
				}
				item1.cacher();
				item.splice(index1,1);
				// if (item.length==0)
					// playerList.splice(index,1);
				CheckForDead();
				return;
			}
		});
		
			
		
	});
}
var spawnFood = function(){
	// nouritures.forEach(function(item, index, array)
	// {
		// item.cacher();
	// });
	// nouritures.splice(0, quantiteNouriture);
	for (var i = 0; i < quantiteNouriture; ++i){
		nouritures.push(new Player("yellow"));
	}
	nouritures.forEach(function(item, index, array)
	{
		item.afficher();
	});
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
var deplacerPlayers = function(){
	playerList.forEach(function(item, index, array)
	{
		item.forEach(function(item1, index1, array1)
		{
			item1.move();
		});
		
	});
	nouritures.forEach(function(item1, index1, array1)
	{
		playerList.forEach(function(item2, index2, array2)
		{
			item2.forEach(function(item3, index3, array3)
			{
				if (item1.isSamePos(item3))
				{
					item3.nouriture+=1;
					nouritures.splice(index1,1);
				}
			});
			
		});
		
			
	});
	nouritures.forEach(function(item, index, array)
	{
		
		item.afficher();
			
	});
	
}
class Player {
	constructor(color, generation=0, reserve=0, mutationRate=20, deathRate=-1){
		this.color = color;
		this.posX = getRandomInt(0,sizeGrille);
		this.posY = getRandomInt(0,sizeGrille);
		this.nouriture = 0;
		this.currReserve = 0;
		this.reserve=reserve;
		this.generation=generation;
		this.reproductionCost=2;
		this.mutationRate = mutationRate;
		this.deathRate = deathRate;
		this.mutant = false;
		
		this.afficher = function(){
			$("#case"+this.posX+"_"+this.posY).css("background-color", this.color);
		}
		this.cacher = function(){
			$("#case"+this.posX+"_"+this.posY).css("background-color", caseColor);
		}
		this.isSamePos = function(perso2){
			return this.posX==perso2.posX && this.posY==perso2.posY;
		}
		this.mutate = function(){
			var randomMutation = getRandomInt(0,100);
			if (randomMutation <= this.mutationRate)
			{
				this.mutant=true;
				this.mutationRate += getRandomInt(0,2);
				this.reserve+=getRandomInt(0,2);
			}
			return this.mutant;
		}
		this.reproduce = function(){
			if (this.nouriture>=this.reproductionCost){
				
				var newColor = playerList.length % colorList.length;
				this.deathRate-=1;
				var newBorn = new Player(colorList[newColor],playerList.length,this.reserve, this.mutationRate,this.deathRate-1);
				
				if (newBorn.mutate() == true){
					//if (playerList.length == this.generation + 1){
						// console.log("OUI");
						
						var found = false;
						playerList.forEach(function(item, index, array){
							if (item.length > 0)
							{
								if (item[0].reserve == newBorn.reserve
								){
								newBorn.color = item[0].color;
								newBorn.generation = item[0].generation;
								newBorn.reserve = item[0].reserve;
								newBorn.mutationRate = item[0].mutationRate;
								newBorn.mutant = item[0].mutant;
								newBorn.reproductionCost = item[0].reproductionCost;
								found=true;
								item.push(newBorn);
							}
							}
							
						});
						if (!found){
							var newGen=[];
							newGen.push(newBorn);
							playerList.push(newGen);
						}
						
					//}
				}
				else {
					newBorn.color = this.color;
					newBorn.generation = this.generation;
					newBorn.mutant = this.mutant;
					newBorn.reproductionCost = this.reproductionCost;
					playerList[this.generation].push(newBorn);
				}
				newBorn.afficher();
				
				
				this.nouriture-=this.reproductionCost;
				//console.log(this.nouriture);
			}
		}
		this.move = function(){
			this.cacher();
			var randomMove = getRandomInt(0,5)
			switch(randomMove){
				case 1 :
					if (this.posX+1<sizeGrille)
						this.posX+=1;
					break;
				case 2 :
					if (this.posY-1>=0)
						this.posY-=1;
					break;
				case 3 :
					if (this.posX-1>=0)
						this.posX-=1;
					break;
				case 4 :
					if (this.posY+1<sizeGrille)
						this.posY+=1;
					break;
			}
			
			
			this.afficher()
		}
	}
}

























