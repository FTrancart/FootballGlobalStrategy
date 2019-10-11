$(document).ready( function () {
	window.scroll(0,0);
	$('[data-toggle="datepicker"]').datepicker({ format: 'yyyy-mm-dd'});
})

function about() {
	var c_home = $("#homecontent").attr("class");
	if(c_home.includes("hidden") == true) {
		$("#navmenu").hide();
	}
	ui_click('home');
	var p = $("#div-ccm").position();
	p.behavior = 'smooth';
	window.scroll(p);
}

function setDashboard(text, text2, res1, res, $tr, club) {
	$("#td-typecomptefgs").text(text2);
	$("<td>").text(text).appendTo($tr);
	if(club) {
		$("<td>").text(res1.respos[0] + ", " + res1.respos[1] + ", " + res1.respos[2]).appendTo($tr);
		$tr = $("<tr>").appendTo($("#dashboard-club"));
		$("<td>").text("Cahiers de charges émis").appendTo($tr);
		$("#selectContrat").show();
		$("#selectContratInv").hide();
		$("#showifinv").hide();
		$("#showifclub").show();
	}
	else{
		$("#selectContrat").hide();
		$("#selectContratInv").show();
		$("#showifinv").show();
		$("#showifclub").hide();
	}
	var idscahiers = "";
	for(var j = 0; j< res.length ; j++) {
		idscahiers += res[j];
		if(j != (res.length - 1))
		{
			idscahiers += ", ";
		}
	}
	$("<td>").text(idscahiers).appendTo($tr);
}
/*Teste si les identifiants existent dans le bdd*/
function getLogin() {
	$.get(
		'database/login.php',
		{
			username : $("#username").val(),
			password : $("#password").val(),
		},
		function(data, status) {
			var res = JSON.parse(data);
			var entite = res.entite;
			if(entite.nb > 0) {
				document.getElementById("btn-mapage").setAttribute("entite_type", entite.type);
				document.getElementById("btn-mapage").setAttribute("nom", entite.nom);
				document.getElementById("btn-mapage").setAttribute("ent-id", entite.id);
				$("#btn-mapage").removeClass("hidden").css("left","45%");
				$("#home1").css("left","30%");
				$("#home2").css("left","65%");
				$("#home3").css("left","80%");
				$("#dashboard-club").empty();
				var $tr = $("<thead style='background-color: #4CA1F1;'>").appendTo($("#dashboard-club"));
				$("<th class='centre bold' colspan=2>").text(entite.nom).appendTo($tr);
				$tr = $("<tr>").appendTo($("#dashboard-club"));
				$("<td style='width: 30%;'>").text("Type du compte FGS").appendTo($tr);
				$("<td id='td-typecomptefgs'>").appendTo($tr);
				$tr = $("<tr>").appendTo($("#dashboard-club"));
				$("<td>").text("Correspondant avec FGS").appendTo($tr);
				$("<td>").text(res.corres).appendTo($tr);
				$tr = $("<tr>").appendTo($("#dashboard-club"));
                $("#espace-name").empty();
                 buildJsGrid(entite.type);
				switch(entite.type) {
					case 'club': 
                    $("<img>").attr("src","images/logoclub" + entite.id + ".png").appendTo($("#espace-name"));
                    $("<h3 style='display:inline;margin-left : 70px;'>").text(entite.nom).appendTo($("#espace-name"));
					setDashboard('Responsables du compte FGS','Club', res, res.joueurs, $tr, true);
					break;
					case 'investisseur': 
                     $("<h3>").text(entite.nom).appendTo($("#espace-name"));
					setDashboard("Ids des cahiers de proposition d'entrée en capital émis",'Investisseur en capital/sponsoring', res, res.cahierscap, $tr, false);
					var $tr1 = $("<tr>").appendTo($("#dashboard-club"));
					setDashboard('Ids des cahiers de proposition de sponsoring émis','Investisseur en capital/sponsoring', res, res.cahierssponsor, $tr1, false);
					break;
					default:
					console.error("Type de l'entite venant de se logger inconnue");
					break;
				}
				ui_click('monespace');	
                		
			}
			else{
				$("#password").removeClass("is-invalid");
				$("#username").removeClass("is-invalid");
				$("#feedbackpassword").remove();
				$("#password").addClass("is-invalid");
				$("#username").addClass("is-invalid");
				$("<div id='feedbackpassword' class='invalid-feedback' style='font-size:15'>").text("Username et/ou mot de passe incorrect(s)").appendTo($("#feedlog"));
			}
		},
		'text'
		)
}

function buildJsGrid(_mode) {
	$.post(
		'database/getRecent.php',
        {
            mode : _mode
        },
		function(data, status) {
			if (status == "success") {
				var res = JSON.parse(data);
                var clients = res.club;
                var clients2 = res.inv;
				$("#jsGrid").jsGrid({
					height: "400px",
                    width : "40%",
					data: clients,
					fields: [
					{ name: "ID", type: "number", width:25, align : "center" },
					{ name: "Emetteur", type: "number", width: 100 , align : "left"},
					{ name: "Type", type: "text", width: 100, align : "left" },
					{ name: "Date", type: "date", width : 100, align : "center"}
					]
				});
                $("#jsGrid2").jsGrid({
					height: "400px",
                    width : "40%",
					data: clients2,
					fields: [
					{ name: "ID", type: "number", width: 25, align : "center" },
					{ name: "Emetteur", type: "number", width: 100 , align : "left"},
					{ name: "Type", type: "text", width: 100, align : "left" },
					{ name: "Date", type: "date", width : 100 , align : "center"}
					]
				});
			}
		});
}

/*Scroll to a specific section with smooth animation*/
function ui_click(show) {
	if(show == 'home') {
		$("#username").val("");
		$("#password").val("");
		$("#password").removeClass("is-invalid");
		$("#username").removeClass("is-invalid");
		$("#feedbackpassword").remove();
	}
	$(".hide").addClass("hidden");
	$("#" + show + "content").removeClass("hidden");
	window.scroll(0,0);
}

function showCompte(div) {
	$(".reset").val(0);
    $("#attache").empty();
	ui_click('monespace');
	$(".hideclub").hide();
	div.show();
}

function ligneFormulaire(mainDiv, id1, text1, place1, id2, text2, place2, opt) {
	var $div1 = $("<div class='form-row'>").appendTo(mainDiv);
	var $div = $("<div class='form-group col-md-6'>").appendTo($div1);
	$("<label for=" + id1 + ">").text(text1).appendTo($div);
	if(opt[0] == 0){
		$("<input class='form-control' id=" + id1 + " placeholder= " + place1 + ">").appendTo($div);
	}
	else if(opt[0] == 1) {
		$("<input data-toggle='datepicker' id=" + id1 + "  style='width:  100%;'>").appendTo($div);
	}
	var $div2 = $("<div class='form-group col-md-6'>").appendTo($div1);
	$("<label for=" + id2 + ">").text(text2).appendTo($div2);
	if(opt[1] == 0) {
		$("<input class='form-control' id=" + id2 + " placeholder=" + place2 + ">").appendTo($div2);
	}
	else if(opt[1] == 1) {
		$("<input data-toggle='datepicker' id=" + id2 + "  style='width:  100%;'>").appendTo($div2);
	}
}

function champFormulaire(mainDiv, id1, text1, place1) {
	var $div = $("<div class='form-group col-md-6'>").appendTo(mainDiv);
	$("<label for=" + id1 + ">").text(text1).appendTo($div);
	$("<input class='form-control' id=" + id1 + " placeholder=" + place1 + ">").appendTo($div);
}

function selectorFormulaire(mainDiv, id1, text1, text2, opt, val) {
	var $div = $("<div class='form-group col-md-6'>").appendTo(mainDiv);
	var $label = $("<label for=" + id1 + ">").text(text1).appendTo($div);
	var $div1 = $("<div class='form-group'>").appendTo($div);
	var $select = $("<select class='form-control' id=" + id1 + ">").appendTo($div1);
	$("<option selected='selected'>").text(text2).appendTo($select);
	for(var i=0; i<opt.length; i++) {
		$("<option value=" + val[i] + ">").text(opt[i]).appendTo($select);
	}
}

function newLigneHistorique() {
	var $tr = $("<tr>").appendTo($("#historique-clubs"));
	var $td = $("<td>").appendTo($tr);
	$("<input class='form-control saison' placeholder='Saison jouée'>").appendTo($td);
	$td = $("<td>").appendTo($tr);
	$("<input class='form-control nomclub' placeholder='Nom du club'>").appendTo($td);
}

function newRespo() {
	var num = $("#compte-club tr").length;
	if(num < 4) {
		var $tr = $("<tr>").appendTo($("#compte-club"));
		$("<th schope='row'>").text(num).appendTo($tr);
		var $td = $("<td>").appendTo($tr);
		$("<input class='form-control' placeholder='Nom prénom du responsable'>").attr("id","nom-club" + num).appendTo($td);
		$td = $("<td>").appendTo($tr);
		$("<input class='form-control' placeholder='Qualité du responsable'>").attr("id","qualite-club" + num).appendTo($td);
		$td = $("<td>").appendTo($tr);
		$("<input class='form-control' placeholder='Mail du responsable'>").attr("id","mail-club" + num).appendTo($td);
		$td = $("<td>").appendTo($tr);
		$("<input class='form-control' placeholder='Téléphone du responsable'>").attr("id","tel-club" + num).appendTo($td);
	}
}

function offreTransfert() {
	$("#attache").empty();
	var $ul = $("<ul class='timeline'>").appendTo($("#attache"));
	var $li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Présentation joueur").appendTo($li);
	$("<br><br>").appendTo($li);
	ligneFormulaire($li, "nom", "Nom", "Nom du joueur", "postejoueur", "Poste", "Poste du joueur", [0,0]);
	ligneFormulaire($li, "iptDateNaissance", "Date de naissance", "", "lieunaissance", "Lieu de naissance", "Lieu de naissance du joueur", [1,0]);
	var $d = $("<div class='form-row'>").appendTo($li);
	champFormulaire($d, "nationalite", "Nationalité", "Pays d'origine");
	selectorFormulaire($d, "selectSelection", "Selection nationale", "Selectionnez la réponse", ["Oui", "Non"], ["Oui","Non"]);
	var $divtime = $("<div class='form-group col-md-6 milieu'>").appendTo($li);
	$("<label>").text("Expiration du contrat").appendTo($divtime);
	$("<input data-toggle='datepicker' id='expirationContrat' style='width:  100%;text-align: center;' placholder='Clickez pour chosir la date'>").appendTo($divtime);
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Responsable officiel du joueur").appendTo($li);
	$("<br><br>").appendTo($li);
	var $divs = $("<div style='width: 80%; margin: auto;'>").appendTo($li);
	$("<label class='centre'>").text("Nature de votre compte").appendTo($divs);
	$sel = $("<select class='form-control' id='typerespo'>").appendTo($divs);
	$("<option selected>").text("Type de compte").appendTo($sel);
	$("<option value='Physique'>").text("Personne physique").appendTo($sel);
	$("<option value='Morale'>").text("Personne morale").appendTo($sel);
	ligneFormulaire($li, "nomrespo", "Nom", "Nom du responsable", "adrespo ", "Adresse", "Adresse du responsable", [0,0]);
	ligneFormulaire($li, "mailrespo", "Mail", "Mail du responsable", "telrespo", "Téléphone", "Téléphone du responsable", [0,0]);
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Anciens clubs du joueur depuis ses 12 ans").appendTo($li);
	$("<br><br>").appendTo($li);
	var $divtable = $("<div class='centre' id='history-clubs'>").appendTo($li);
	var $table = $("<table class='table table-dark' id='historique-clubs'>").appendTo($divtable);
	var $tr = $("<tr>").appendTo($table); 
	$("<th>").text("Année").appendTo($tr);	
	$("<th>").text("Club").appendTo($tr);
	$tr = $("<tr>").appendTo($table);
	var $td = $("<td>").appendTo($tr);
	$("<input class='form-control saison' placeholder='Saison jouée'>").appendTo($td);	
	$td = $("<td>").appendTo($tr);
	$("<input class='form-control nomclub' placeholder='Nom du club'>").appendTo($td);
	$("<button class='btn btn-secondary' id='add-club' onclick='newLigneHistorique()'>").text("Ajouter une ligne à l'historique").appendTo($divtable); 
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Elements économiques").appendTo($li);
	$("<br><br>").appendTo($li);
	ligneFormulaire($li, "debuttransfert", "Début du transfert", "", "fintransfert", "Fin du transfert", "", [1,1]);
	var $diveco = $("<div id='div-eco'>").appendTo($li);
	var $d2 = $("<div class='form-row'>").appendTo($diveco);
	champFormulaire($d2, "montantTransfert", "Montant du transfert souhaité", "Montant souhaité");
	selectorFormulaire($d2, "selectDevise", "Devise", "Selectionnez la devise", ["Euro €", "Livre sterling £", "Dollar $", "Yuan ¥"], ["Euro", "Livre", "Dollar", "Yuan"]);
	var $d3 = $("<div class='form-row' id='garantie'>").appendTo($li);
	selectorFormulaire($d3,  "selectGarantie", "Garantie bancaire", "Selectionnez la réponse",  ["Oui", "Non"], ["Oui","Non"]);
	champFormulaire($d3, "conditions", "Si oui, conditions de garantie", "Décrivez vos conditions");
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Conditions souhaitées par le joueur").appendTo($li);
	$("<br><br>").appendTo($li);
	ligneFormulaire($li, "duree", "Durée du contrat souhaitée", "Durée souhaitée", "destinations", "Destinations souhaitées", "Liste des destinations", [0,0]);
	var $d4 = $("<div class='form-row' id='salaire-div'>").appendTo($li);
	champFormulaire($d4, "salairesouhaite", "Salaire net/mois souhaité", "Salaire souhaité");
	selectorFormulaire($d4,  "select-devise", "Devise", "Selectionnez la devise",  ["Euro €", "Livre sterling £", "Dollar $", "Yuan ¥"], ["Euro", "Livre", "Dollar", "Yuan"]);
	$("<label class='centre'>").text("Autres avantages à préciser").appendTo($li);
	$("<textarea class='form-control' id='autre' row=2 placeholder='200 caracteres maximum' style='width:80%; margin:auto;'>").appendTo($li);
	var $divbtn = $("<br><div class='centre'>").appendTo($li);	
	$("<button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
	$('[data-toggle="datepicker"]').datepicker({ format: 'yyyy-mm-dd'});
}

function offrePrêt() {
	offreTransfert();
	$("#div-eco").empty();
	$("#garantie").empty();
	var $d = $("<div class='form-row'>").appendTo($("#div-eco"));
	selectorFormulaire($d, "select-pret", "Type de prêt" , "Selectionnez le type de prêt", ["Payant", "Option d'achat", "Sans option d'achat"], ['payant', 'optionachat', 'sansoption']);
	champFormulaire($d, "duréepret", "Durée du prêt", "Durée souhaitée");
	ligneFormulaire($("#div-eco"), "conditionspret", "Conditions liées à prise en charge du salaire du joueur prêté", "Conditions pour salaire", "conditions-options", "Conditions liées à option d'achat ou cas échéant","Conditions avec/sans option d'achat", [0,0]);
}

function offreJoueurLibre() {
	offreTransfert();
	$("#div-eco").empty();
	$("#garantie").empty();
}

function newRowRech(table, text, id, place, _place) {
	var $tr = $("<tr>").appendTo(table);
	$("<td>").text(text).appendTo($tr);
	
	for(var i = 0; i <  id.length; i++) {
		var $td = $("<td>").appendTo($tr);
		if(_place){
			$("<input class='form-control'>").attr("id",id[i]).attr("placeholder",place[i]).appendTo($td);	
		}
		else{
			$("<input class='form-control' value=0>").attr("id",id[i]).appendTo($td);
		}
	}
}

$(document).on('change','#selectContratInv',function(){
	switch(this.value) {
		case 'p-capital' :
		rechercheCapital();
        $("#supIfInvCap").empty();
       var $li = $("<li>").appendTo($("#main-ul-cap"));
        $("#supIfInvCap2").empty();
        $("<br><br>").appendTo($li);
          var $f = $("<form-group>").appendTo($li);
    $("<label>").text("Formulez votre proposition (1000 caractères maximum)").appendTo($f);
	$("<textarea class='form-control' placeholder = 'Proposition' row = 3 id='propcapital'>").appendTo($f);
    var $divbtn = $("<br><br><div class='centre'>").appendTo( $li);	
	$("<br><button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
		break;
		case 'p-sponsor' :
		rechercheSponsor();
        $("#supIfInvSponsor").empty();
         var $li = $("<li>").appendTo($("#main-ul-spon"));
        $("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Proposition<br>").appendTo( $li);
	$("<br><br>").appendTo($li);
    var $f = $("<form-group>").appendTo($li);
    $("<label>").text("Formulez votre proposition (1000 caractères maximum)").appendTo($f);
	$("<textarea class='form-control' placeholder = 'Proposition' row = 3 id='propsponsor'>").appendTo($f);
    var $divbtn = $("<br><br><div class='centre'>").appendTo( $li);	
	$("<br><button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
		break;
		default:
		console.error("Type de contrat pour investisseur inconnu");
		break;
	}
});

function rechercheSponsor() {
	$("#attache").empty();
	var $ul = $("<ul class='timeline' id='main-ul-spon'>").appendTo($("#attache"));
	var $li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Coordonées de la personne en charge du dossier<br><br>").appendTo($li);
	ligneFormulaire($li, "nomresp-sponsor", "Nom ", "Nom du responsable", "mailresp-sponsor", "Mail", "Mail du responsable", [0,0]);
	$("<br><br>").appendTo($li);
	$li = $("<li id='supIfInvSponsor'>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Eléments économiques proposés par le club<br>").appendTo($li);
	$("<br><br>").appendTo($li);
	var $t = $("<table class='table table-bordered'>").appendTo($li);
	var $head = $("<thead class='thead-dark'>").appendTo($t);
	var $tr = $("<tr>").appendTo($head);
	$("<th>").text("Type d'offre").appendTo($tr);
	$("<th>").text("Caractéristiques techniques de l'offre").appendTo($tr);
	$("<th>").text("Durée de l'offre").appendTo($tr);
	$("<th>").text("Budget hors-taxes").appendTo($tr);
	newRowRech($t, "Naming stade",["naming-car", "duree-naming", "budget-naming"] ,["Caractéristiques naming stade", "Durée pour naming stade", "Budget naming stade"], true);
	newRowRech($t, "Espace maillots club",["maillots-car" , "duree-maillots", "budget-maillots"],["Caractéristiques sur maillots", "Durée pour les maillots", "Budget maillots"], true);
	newRowRech($t, "Visibilité stade - Panneaux fixes",["fixes-car" ,"duree-fixes", "budget-fixes"],["Caractéristiques panneaux fixes",  "Durée pour visibilité", "Budget pour visibilité sur panneaux"], true);
	newRowRech($t, "Visibilité stade - Panneaux mobiles",["mobiles-car", "duree-mobiles", "budget-mobiles"], ["Caractéristiques panneaux mobiles",  "Durée pour visibilité", "Budget pour visibilité sur panneaux"], true);
	newRowRech($t, "Visibilité tribunes",["tribunes-car" , "duree-tribunes", "budget-tribunes"], ["Caractéristiques visibilité tribunes", "Durée sur visibilité tribunes", "Budget pour tribunes"], true);
	newRowRech($t, "Visibilié site internet du club",["site-car", "duree-site", "budget-site"] ,["Caractéristiques site","Durée sur site", "Budget pour site"], true);
	newRowRech($t, "Loges et package premium",["loges-car" , "duree-loges","budget-loges"],["Caractéristiques loges", "Durée sur loges",  "Budget pour loges, packages"], true);
	var $divbtn = $("<div class='centre'>").appendTo($li);	
	$("<br><button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
}

function getSponsorArray(type) {
	var array = {};
	array['cond'] = $("#" + type + "-car").val();
	array['duree'] = $("#duree-" + type).val();
	array['budget'] = $("#budget-" + type).val();
	return array;
}

function rechercheCapital() {
	$("#attache").empty();
	var $ul = $("<ul class='timeline' id='main-ul-cap'>").appendTo($("#attache"));
	var $li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Coordonées de la personne en charge du dossier<br><br>").appendTo($li);
	ligneFormulaire($li, "nomresp-cap", "Nom ", "Nom du responsable", "mailresp-cap", "Mail", "Mail du responsable", [0,0]);
	$li = $("<li id='supIfInvCap'>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Eléments économiques proposés par le club<br>").appendTo($li);
	$("<br><br>").appendTo($li);
	var $t = $("<table class='table table-bordered'>").appendTo($li);
	var $head = $("<thead class='thead-dark'>").appendTo($t);
	var $tr = $("<tr>").appendTo($head);
	$("<th>").text("Type de cession").appendTo($tr);
	$("<th>").text("Nombres d'actions ou parts sociales concernées").appendTo($tr);
	$("<th>").text("Valeur nominative d'une action ou part").appendTo($tr);
	$("<th>").text("Valeur evaluée de la cession").appendTo($tr);
	newRowRech($t, "Augmentation de capital",["aug-nb" ,"aug-nom", "aug-total"],[], false);
	newRowRech($t, "Cession partielle d'actions existantes",["cession-nb", "cession-nom", "cession-total"], [], false);
	newRowRech($t, "Cession totale ou de plus de 50% du capital",["tot-nb", "tot-nom", "tot-total"],[], false);
	$li = $("<li id='supIfInvCap2'>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").html("Eléments matériels et immatériels faisant partie de la vente<br>").appendTo($li);
	$("<br><br>").appendTo($li);
	$("<div class='form-group'>").appendTo($li)
	$("<textarea class='form-control' id='elems-cap' rows='2' placeholder='200 caractères maximum'>").appendTo($li);
	var $divbtn = $("<div class='centre'>").appendTo($li);	
	$("<br><br><button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
}

function getCapArray( type) {
	var array = {};
	array['nombre'] = $("#" + type + "-nb").val();
	array['nominatif'] = $("#" + type + "-nom").val();
	array['total'] = $("#" + type + "-total").val();
	return array;
}

function demandeTransfert() {
	$("#attache").empty();
	var $ul = $("<ul class='timeline'>").appendTo($("#attache"));
	var $li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Eléments techniques et spécifiques du profil joueur recherché").appendTo($li);
	$("<br><br>").appendTo($li);
	ligneFormulaire($li, "poste-rech", "Poste recherché", "Poste du profil joueur", "age-rech", "Age recherché", "Age du profil joueur", [0,0]);
	var $div1 = $("<div class='form-row'>").appendTo($li);
	var $div = $("<div class='form-group col-md-6'>").appendTo($div1);
	$("<label for='prof-tech'>").text("Profil technique recherché").appendTo($div);
	$("<textarea class='form-control' id='prof-tech' placeholder='Décrivez le profil technique du joueur que vous nécessitez.' row=2>").appendTo($div);
	var $div2 = $("<div class='form-group col-md-6'>").appendTo($div1);
	$("<label for='autres-elem'>").text("Autres éléments").appendTo($div2);
	$("<textarea class='form-control' id='autres-elem' placeholder='Informations supplémentaires pour compléter le profil du joueur.' row=2>").appendTo($div2);
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Eléments économiques proposés par le club demandeur").appendTo($li);
	$("<br><br>").appendTo($li);
	var $d = $("<div class='form-row' id='cahier-elemeco'>").appendTo($li);
	champFormulaire($d, "montant-rech", "Montant du transfert proposé", "Somme disponible pour le transfert");
	selectorFormulaire($d, "select-devise-rech", "Devise du montant", "Selectionnez la devise", ["Dollar US", "Euro", "Livre Sterling", "Yuan"], ["usd", "eur", "gbp", "cny"]);
	champFormulaire($d, "cond-paiement-rech", "Conditions liées au paiement", "Comptant/échelonné, etc");
	selectorFormulaire($d, "garantie-rech", "Garantie bancaire", "Selectionnez la réponse", ["Oui", "Non"], ["Oui", "Non"]);
	var $d2 = $("<div class='form-group col-md-6 milieu'>").appendTo($d);
	$("<label for='cond-gar-rech'>").text("Si garantie, détaillez les conditions").appendTo($d2);
	$("<input class='form-control' id='cond-gar-rech' placeholder='Conditions de la garantie'>").appendTo($d2);
	$("<br><br>").appendTo($li);
	$li = $("<li>").appendTo($ul);
	$("<a href='#'style='font-size : 27;text-align: left;font-weight : bold;'>").text("Conditions proposées au futur joueur").appendTo($li);
	$("<br><br>").appendTo($li);
	ligneFormulaire($li, "duree-rech", "Durée du contrat proposé", "Durée du contrat de transfert", "salaire-rech", "Salaire net/mois proposé", "Salaire du futur joueur en transfert", [0,0]);
	$d = $("<div class='form-row'>").appendTo($li);
	selectorFormulaire($d, "select-devise2-rech", "Devise du salaire", "Selectionnez la devise", ["Dollar US", "Euro", "Livre Sterling", "Yuan"], ["usd", "eur", "gbp", "cny"]);
	champFormulaire($d, "autre-cond-rech", "Autres avantages proposés au joueur", "Avantages supplémentaires à préciser");
	var $divbtn = $("<div class='centre'>").appendTo($li);	
	$("<button class='btn btn-success' onclick='registerCahier()'>").text("Soumettre").appendTo($divbtn);
}

function demandePret() {
	demandeTransfert();
	$("#cahier-elemeco").empty().removeClass('form-row');
	ligneFormulaire($("#cahier-elemeco"), "typepret-dem", "Type de prêt recherché", "Décrivez le type de prêt que vous cherchez", "dureepret-dem", "Durée du prêt recherché", "Durée désirée", [0,0]);
	var $d = $("<div class='form-row'>").appendTo($("#cahier-elemeco"));
	selectorFormulaire($d, "select-chargesal", "Prise en charge du salaire du joueur", "Selectionnez la réponse", ["Oui", "Non"], ["Oui", "Non"]);
	champFormulaire($d, "pourcent-sal", "Si oui, à quel pourcentage ?", "En pourcentage (50%, 70%)");
}

function demandeLibre() {
	demandeTransfert();
	$("#li-eco").empty();
}

function testDate(param, val, date) {
	if(date[param]() < 10) {
		val = "0" + date[param]() ;
	}
	else{
		val = date[param]();
	}
	return val;
}

function registerCahier() {
	/*Cahier d'offre*/
	var tempC = $("#historique-clubs .nomclub").map( (i,x) => { return $(x).val() }).toArray();
	var tempS = $("#historique-clubs .saison").map( (i,x) => { return $(x).val() }).toArray();
	var listeClubs = JSON.stringify(tempC);
	var listeSaisons = JSON.stringify(tempS);
	var path;
	var typeContrat;
	var date = new Date();
	var min = testDate('getMinutes', min, date);
	var hours = testDate('getHours', hours, date);
	var sec = testDate('getSeconds', sec, date);
	var months = {1 : "Janvier", 2 : "Février",  3 : "Mars", 4 : "Avril", 5 : "Mai", 6 : "Juin", 7 : "Juillet", 8 : "Août", 9 : "Septembre", 10 : "Octobre", 11 : "Novembre", 12 : "Décembre"};
	var _date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " à " + hours + ":" + min + ":" + sec; 
	if(document.getElementById("btn-mapage").getAttribute("entite_type") == 'club') {
		typeContrat = $("#selectContrat")[0].value;
	}
	else if(document.getElementById("btn-mapage").getAttribute("entite_type") == 'investisseur') {
		typeContrat = $("#selectContratInv")[0].value;
	}
	switch(typeContrat) {
		case 'transfert' :
		var fields = ['club', 'nom', 'poste', 'nomresp', 'mailresp', 'telresp','typeresp', 'addressresp','dateNaissance', 'lieuNaissance', 'nationalite', 'selection', 'expContrat', 'montantTransfert', 'unite', 'garantie', 'conditionsGarantie', 'typepret', 'dureepret', 'condachat', 'condsalaire', 'duree', 'destinations', 'salairesouhaite', 'devise', 'autre', 'typeoffre', 'typecond' , 'listeclubs', 'listesaisons' , 'debuttransfert', 'fintransfert', 'date'];
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#nom").val(), $("#postejoueur").val(), $("#nomrespo").val(), $("#mailrespo").val(), $("#telrespo").val(), $("#typerespo")[0].value, $("#adrespo").val(), $("#iptDateNaissance").val(), $("#lieunaissance").val(), $("#nationalite").val(), $("#selectSelection")[0].value, $("#expirationContrat").val(), $("#montantTransfert").val(), $("#selectDevise")[0].value, $("#selectGarantie")[0].value, $("#conditions").val(), 0, 0, 0, 0,  $("#duree").val(), $("#destinations").val(),$("#salairesouhaite").val(), $("#select-devise")[0].value,	$("#autre").val(), "transfert", "conditionstransfert", listeClubs, listeSaisons, $("#debuttransfert").val(), $("#fintransfert").val(), _date];
		path = 'database/newOffre.php';
		break;
		case 'pret' : 
		var fields = ['club', 'nom', 'poste', 'nomresp', 'mailresp', 'telresp','typeresp', 'addressresp', 'dateNaissance', 'lieuNaissance', 'nationalite', 'selection', 'expContrat', 'montantTransfert', 'unite', 'garantie', 'conditionsGarantie', 'typepret', 'dureepret', 'condachat', 'condsalaire', 'duree', 'destinations', 'salairesouhaite', 'devise', 'autre', 'typeoffre', 'typecond', 'listeclubs', 'listesaisons', 'debuttransfert', 'fintransfert', 'date'];
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#nom").val(), $("#postejoueur").val(), $("#nomrespo").val(), $("#mailrespo").val(), $("#telrespo").val(), $("#typerespo")[0].value, $("#adrespo").val(), $("#iptDateNaissance").val(), $("#lieunaissance").val(), $("#nationalite").val(), $("#selectSelection")[0].value, $("#expirationContrat").val(), 0, 0, 0, 0,$("#select-pret")[0].value, $("#duréepret").val(), $("#conditionspret").val(), $("#conditions-options").val(), $("#duree").val(), $("#destinations").val(),$("#salairesouhaite").val(), $("#select-devise")[0].value, $("#autre").val(), "pret", "conditionspret", listeClubs, listeSaisons, $("#debuttransfert").val(), $("#fintransfert").val(), _date];
		path = 'database/newOffre.php';
		break;
		case 'libre' :
		var fields = ['club', 'nom', 'poste', 'nomresp', 'mailresp', 'telresp','typeresp', 'addressresp', 'dateNaissance', 'lieuNaissance', 'nationalite', 'selection', 'expContrat', 'montantTransfert', 'unite', 'garantie', 'conditionsGarantie', 'typepret', 'dureepret', 'condachat', 'condsalaire', 'duree', 'destinations', 'salairesouhaite', 'devise', 'autre', 'typeoffre', 'typecond', 'listeclubs', 'listesaisons', 'debuttransfert', 'fintransfert', 'date'];
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#nom").val(), $("#postejoueur").val(), $("#nomrespo").val(), $("#mailrespo").val(), $("#telrespo").val(), $("#typerespo")[0].value, $("#adrespo").val(), $("#iptDateNaissance").val(), $("#lieunaissance").val(), $("#nationalite").val(), $("#selectSelection")[0].value, $("#expirationContrat").val(), 0, 0, 0, 0, 0, 0, 0, 0, $("#duree").val(), $("#destinations").val(),$("#salairesouhaite").val(), $("#select-devise")[0].value, $("#autre").val(), "joueurlibre", "conditionsjoueurlibre", listeClubs, listeSaisons, $("#debuttransfert").val(), $("#fintransfert").val(), _date];
		path = 'database/newOffre.php';
		break;
		/*Cahier de demande*/
		case 'd-libre' : 
		var fields = ['club','poste', 'age', 'tech', 'autre-tech', 'typepret', 'dureepret', 'chargesal', 'pourcentsal', 'dureecontrat', 'sal-prop', 'devise', 'autre-avantage', 'montant', 'devise-montant', 'cond-paiement','garantie', 'cond-garantie', 'typecond', 'typeoffre', 'date'];
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#poste-rech").val(), $("#age-rech").val(), $("#prof-tech").val(), $("#autres-elem").val(), 0, 0, 0, 0, $("#duree-rech").val(), $("#salaire-rech").val(), $("#select-devise2-rech")[0].value, $("#autre-cond-rech").val(), 0, 0, 0, 0, 0, 'conditionsdemandelibre', 'demandelibre', _date];
		path = 'database/newDemande.php';
		break;
		case 'd-transfert' :
		var fields = ['club','poste', 'age', 'tech', 'autre-tech', 'typepret', 'dureepret', 'chargesal', 'pourcentsal', 'dureecontrat', 'sal-prop', 'devise', 'autre-avantage', 'montant', 'devise-montant', 'cond-paiement','garantie', 'cond-garantie', 'typecond', 'typeoffre', 'date'];		
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#poste-rech").val(), $("#age-rech").val(), $("#prof-tech").val(), $("#autres-elem").val(), 0, 0, 0, 0, $("#duree-rech").val(), $("#salaire-rech").val(), $("#select-devise2-rech")[0].value, $("#autre-cond-rech").val(), $("#montant-rech").val(), $("#select-devise-rech")[0].value, $("#cond-paiement-rech").val(), $("#garantie-rech").val(), $("#cond-gar-rech").val(), 'conditionsdemandetransfert', 'demandetransfert', _date];
		path = 'database/newDemande.php';
		break;
		case 'd-pret' :
		var fields = ['club','poste', 'age', 'tech', 'autre-tech', 'typepret', 'dureepret', 'chargesal', 'pourcentsal', 'dureecontrat', 'sal-prop', 'devise', 'autre-avantage', 'montant', 'devise-montant', 'cond-paiement','garantie', 'cond-garantie', 'typecond', 'typeoffre', 'date'];		
		var args = [document.getElementById("btn-mapage").getAttribute("nom"), $("#poste-rech").val(), $("#age-rech").val(), $("#prof-tech").val(), $("#autres-elem").val(), $("#typepret-dem").val(),$("#dureepret-dem").val(),$("#select-chargesal")[0].value, $("#pourcent-sal").val(), $("#duree-rech").val(), $("#salaire-rech").val(), $("#select-devise2-rech")[0].value, $("#autre-cond-rech").val(), 0, 0, 0, 0, 0, 'conditionsdemandepret', 'demandepret', _date];
		path = 'database/newDemande.php';
		break;
		case 'capital' :
		var fields = ['id-ent','mail', 'nom', 'augmentation', 'cession', 'cessiontotale', 'elemautre', 'type', 'typecond', 'entite', 'offre', 'date'];		
		var args = [document.getElementById("btn-mapage").getAttribute("ent-id"),$("#mailresp-cap").val(), $("#nomresp-cap").val(), getCapArray('aug'), getCapArray('cession'), getCapArray('tot'), $("#elems-cap").val(), 'capital', 'conditionsrechcapital', document.getElementById("btn-mapage").getAttribute("entite_type"), 'rechcapital', _date]; 
		path = 'database/newRecherche.php';
		break;
		case 'sponsor' :
		var fields = ['id-ent','mail', 'nom', 'naming', 'maillots', 'fixes', 'mobiles','tribunes', 'site', 'loges', 'type', 'typecond', 'entite', 'offre', 'date'];
		var args = [document.getElementById("btn-mapage").getAttribute("ent-id"),$("#mailresp-sponsor").val(), $("#nomresp-sponsor").val(), getSponsorArray('naming'), getSponsorArray('maillots'), getSponsorArray('fixes'), getSponsorArray('mobiles'), getSponsorArray( 'tribunes'), getSponsorArray('site'), getSponsorArray('loges'), 'sponsor', 'conditionsrechsponsor', document.getElementById("btn-mapage").getAttribute("entite_type"), 'rechsponsor', _date]; 
		path = 'database/newRecherche.php';
		break;
		case 'p-capital' : 
		var fields = ['id-ent','mail', 'nom', 'type', 'entite', 'offre', 'date', 'prop'];		
		var args = [document.getElementById("btn-mapage").getAttribute("ent-id"),$("#mailresp-cap").val(), $("#nomresp-cap").val(),  'capital', document.getElementById("btn-mapage").getAttribute("entite_type"), 'propcapital', _date, $("#propcapital").val()]; 
		path = 'database/newProp.php';
		break;
		case 'p-sponsor' : 	
		var fields = ['id-ent','mail', 'nom', 'type', 'entite', 'offre', 'date', 'prop'];
		var args = [document.getElementById("btn-mapage").getAttribute("ent-id"),$("#mailresp-sponsor").val(), $("#nomresp-sponsor").val(), 'sponsor', document.getElementById("btn-mapage").getAttribute("entite_type"), 'propsponsor', _date, $("#propsponsor").val()]; 
		path = 'database/newProp.php';
		break;
		default :
		console.error("Type de cahier non reconnu avant envoi à base de données");
		break;
	}
	upDataCahier(path, fields, args, function(data, status) {
		console.log(data);
		var res = JSON.parse(data);
		if(res.state == "Registered"){
			sendMailAndPdf(typeContrat, res.mail);
		}
		else{
			$("#modal_title").text("Confirmation de création de cahier de charge");
			$("#body-registerCahier").text("Problème dans l'enregistrement du cahier");
			$("#modal-close-btn").attr("onclick", "showCompte('$('#fonctions')')");
			$("#modalNewCahier").modal("show");
		}
	});
}

function upDataCahier(file, fields, args, callback) {
	var data = {};
	for(var i = 0; i < fields.length ; i++) {
		data[fields[i]] = args[i];
	}
	$.post(file, data, callback, 'text');
}

function upImg() {
	var input = document.getElementById("fileToUpload");
	var formdata = new FormData();
	var file = $("#fileToUpload")[0].files[0];
	formdata.append("fileToUpload", file);

	$.ajax({
		url: "database/upload.php",
		type: "POST",
		data: formdata,
		processData: false,
		contentType: false,
		success: function (res) {
			console.log(res);
		}
	});    
}

function savePdf() {
	var docDef = {
		info: {
			title: "Cahier de recherche en SPONSORING",
			Subject: 'Précisions sur les élements économiques ainsi que termes du contrat',
			body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une proposition de sponsoring.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
		},
		content:  "CAHIER DE CHARGE DE PROPOSITION DE SPONSORING"};

		const pdf = pdfMake.createPdf(docDef);

			$.post(
                'database/txt.php',
                {
                    data : docDef.content
                }, 
                function(data) {
                    console.log(data);
                }
            );
	

	}

$(document).on('change','#select-type-compte',function(){
	if(this.value == 1) {
		$("#type-part").show();
		$("#type-club").hide();
		$("#part-resume").text("Résumé de l'objectif de l'adhésion gratuite à la plateforme FGS");
	}
	else if(this.value == 2) {
		$("#type-club").show();
		$("#type-part").hide();
	}
	$("#newaccount-check").removeClass("hidden");
	$("#newaccount-logs").removeClass("hidden");
	$("#btn-newaccount").removeClass("hidden");
});

$(document).on('change','#selectContrat',function(){
	switch(this.value) {
		case 'transfert' :
		offreTransfert();
		break;
		case 'libre' :
		offreJoueurLibre();
		break;
		case 'pret' :
		offrePrêt();
		break;
		case 'd-pret' :
		demandePret();
		break;
		case 'd-transfert' :
		demandeTransfert();
		break;
		case 'd-libre' :
		demandeLibre();
		break;
		case 'capital' :
		rechercheCapital();
		break;
		case 'sponsor' :
		rechercheSponsor();
		break;
	}
});

function registerUser() {
	switch($("#select-type-compte")[0].value) {
		case '1' :
		var fields = ['type', 'nom', 'nationalite', 'mandat', 'mandant', 'domaine', 'nomresp', 'mailresp', 'telresp', 'obj', 'user', 'pass', 'fct', 'mail'];
		var args = [$("#select-typepart")[0].value, $("#nomstructure-part").val(), $("#nationalite-part").val(), $("#select-mandat")[0].value, $("#mandant-part").val(), $("#domaine-part").val(), $("#nom-part").val(), $("#mail-part").val(), $("#tel-part").val(), $("#obj-adhesion").val(), $("#login-compte").val(), $("#pass-compte").val(), $("#fct-part").val(), $("#mail-inv").val()];
		upDataCahier('database/registerInv.php', fields, args , function(data, status) {
			$("#modal_title").text("Confirmation d'inscription d'un compte pour un investisseur en capital/sponsoring");
			if(data == "Registered") {
				$("#body-registerCahier").text("L'inscription de votre compte a bien été prise en compte !");
				$("#modal-close-btn").attr("onclick", "ui_click('log')");
			}
			else{
				$("#body-registerCahier").html("Nous avons rencontré une erreur durant l'inscription de votre compte.<br> Veuillez réessayer.");
				$("#modal-close-btn").attr("onclick", "$('#navmenu').hide();ui_click('home')");
			}
			$("#modalNewCahier").modal("show");
		});
		break;
		case '2' :
		var respo = [];
		for(var i=1; i<4; i++) {
			respo[i] = {"nom" : $("#nom-club" + i).val(), "qualite" : $("#qualite-club" + i).val(), "mail" : $("#mail-club"+ i).val(), "tel" : $("#tel-club" + i ).val()};
		}
		var fin = [];
		fin = fin.concat(respo[1], respo[2], respo[3]);
		var fields = ['club', 'affil','fifa', 'ligue', 'conf', 'pays','corresnom', 'corresfct','correstel','corresmail','respo','user','pass'];
		var args = [$("#club-name").val(), $("#club-affil").val(), $("#club-fifa").val(), $("#club-ligue").val(), $("#club-conf").val(),$("#club-pays").val(), $("#nom-corres").val(), $("#fonction-corres").val(), $("#tel-corres").val(), $("#mail-corres").val(), JSON.stringify(fin), $("#login-compte").val(),$("#pass-compte").val()];
		upDataCahier('database/registerClub.php', fields, args , function(data, status) {
            console.log(data);
          $("#modal_title").text("Confirmation d'inscription d'un compte pour un club");
			if(data == "Registered") {
				$("#body-registerCahier").text("L'inscription de votre compte a bien été prise en compte !");
				$("#modal-close-btn").attr("onclick", "ui_click('log')");
			}
			else{
				$("#body-registerCahier").html("Nous avons rencontré une erreur durant l'inscription de votre compte.<br> Veuillez réessayer.");
				$("#modal-close-btn").attr("onclick", "$('#navmenu').hide();ui_click('home')");
			}
			$("#modalNewCahier").modal("show");
		});
		break;
		default : 
		console.error("Type d'entité non reconnu avant inscription");
		break;
	}
}

function rebuildTable(table, elemtr) {
	table.empty();
	var $thead = $("<thead class='centre thead-dark'>").appendTo(table);
	var $tr = $("<tr>").appendTo($thead);
	for( var k=0; k<elemtr.length; k++) {
		$("<th>").text(elemtr[k]).appendTo($tr);
	}
}

var g_joueurs = {};
var g_conditions = {};

function resultSearch(_entite, mode) {
	switch(document.getElementById('btn-mapage').getAttribute('entite_type')) {
		case 'club' : 
		var _conf, _pay, _champ, path;
		var args = [];
		var fields = ['conf', 'pays', 'champ', 'entite', 'max', 'offre', 'poste', 'typecahier', 'showprop', 'typeprop'];
		switch(mode) {
			case 1 : 
			args = [$('#select-conf')[0].value, $('#select-pays')[0].value, $('#select-champ')[0].value, _entite, $("#input-montantmax").val(), $('#select-search-offre')[0].value, $('#select-poste')[0].value, $('#select-type-cahier')[0].value, $("#select-propinv")[0].value, $("#select-typeprop")[0].value];
			break;
			case 2 : 
			args = [0 , 0, 0, _entite, $("#input-montantmax").val(), $('#select-search-offre')[0].value, $('#select-poste')[0].value, $('#select-type-cahier')[0].value, 'non', $("#select-typeprop")[0].value];
			break;
		}
		path = 'database/searchPlayers2.php';
		break;
		case 'investisseur' :
		var path;
		var args = [];
		var fields = ['typecahier', 'typecontrat', 'inv'];
		switch(mode) {
			case 1 : 
			args = [$("#select-invcahier")[0].value, $("#select-invcontrat")[0].value, '0'];
			break;
			case 2 : 
			args = ['prop', $("#select-invcontrat")[0].value, document.getElementById('btn-mapage').getAttribute('nom')];
			break;
		}
		path = 'database/searchPlayersInv.php';
		break;
		default : 
		console.error("Entite non reconnue avant envoi de requête à base de données");
		break;
	}
	upDataCahier(path, fields, args,
		function displayPlayers(data, status) {
			if(status =="success") {
				var res = JSON.parse(data);
				g_joueurs = res.joueur;
				g_conditions = res.conditions;
				$('#result-search').empty();
				$("#explain-cards").show();
				for(var l = 0; l<res.joueur.length; l++) {
					var $d = $("<div class='playerCard'>");
					if(res.joueur[l].type == 'offre') {
						$d.attr("style", "background-image : url('images/fichegreen.png')");
						$("<label style='color : white;'>").html("<br>OFFRE DE " + res.joueur[l].typeoffre.toUpperCase()).appendTo($d);
						var text = "* " + res.joueur[l].club + "<br>* " + res.joueur[l].nom+ "<br> * " + res.joueur[l].poste + "<br>* Fin de contrat : " + res.joueur[l].expirationcontrat ; 
						$("<label style='text-align: left;'>").html(text).appendTo($d);
						res.joueur[l].zoom = 0;
					}
					else if(res.joueur[l].typeoffre.slice(0,7) == 'demande') {
						$d.attr("style", "background-image : url('images/fichered.png')");
						var typedemande = res.joueur[l].typeoffre.slice(7,res.joueur[l].typeoffre.length);
						$("<label style='color : white;'>").html("<br>DEMANDE DE " + typedemande.toUpperCase()).appendTo($d);
						var text = "Profil recherché :<br>* Par " + res.joueur[l].club + "<br> * " + res.conditions[l].poste + "<br>* Salaire net/mois : " + res.conditions[l].salaire + " " + res.conditions[l].devisesalaire; 
						$("<label style='text-align: left;'>").html(text).appendTo($d);
						res.joueur[l].zoom = 0;
					}
					else if(res.joueur[l].typeoffre.slice(0,4) == 'rech') {
						$d.attr("style", "background-image : url('images/ficheblue.png')");
						var typedemande = res.joueur[l].typeoffre.slice(4,res.joueur[l].typeoffre.length);
						$("<label style='color : white;'>").html("<br>RECHERCHE " + typedemande.toUpperCase() ).appendTo($d);
						$("<label style='text-align:left;'>").html( "* Par " + res.joueur[l].club).appendTo($d);
						res.joueur[l].zoom = 1;
					}
					else if(res.joueur[l].typeoffre.slice(0,4) == 'prop') {
						$d.attr("style", "background-image : url('images/ficheor.png')");
						var typeprop = res.joueur[l].typeoffre.slice(4,res.joueur[l].typeoffre.length);
						$("<label style='color : white;'>").html("<br>PROPOSITION " + typeprop.toUpperCase() ).appendTo($d);
						$("<br>").appendTo($d);
						$("<label style='text-align: left;'>").text("* Par " + res.joueur[l].club).appendTo($d);
						res.joueur[l].zoom = 1;
					}
					var $bt = $("<button class='btn'>").attr("id", l).attr("onclick","zoomPlayer(this.id)").appendTo($('#result-search'));
					$d.appendTo($bt);
				}
				scrollResult();
			}
		});
}

function scrollResult() {
	var p = $("#result-search").position();
	p.behavior = "smooth";
	window.scroll(p);
}

function updateSearch(own) {
	$("#result-search").empty();
	$("#explain-cards").hide();
	var _club;
	switch(document.getElementById('btn-mapage').getAttribute('entite_type')) {
		case 'club' :
		_club = document.getElementById('btn-mapage').getAttribute('nom');
		break;
		case 'investisseur' :
		if(own) {
			$("#showGInv").hide();
		}
		else{
			$("#showGInv").show();
		}
		_club = '0';
		break;
		default:
		console.error("type d'entite non reconnu avant update de search");
		break;
	}
	$.post(
		'database/searchUpdate.php',
		{
			club : _club
		},
		function(data, status) {
			if(status =="success") {
				var res = JSON.parse(data);
				if(!own) {
					$("#selectclub-search").show();
					$("#show-inv").show();
					addOption(res[0], $("#select-conf"), "Choisissez la confédération");
					addOption(res[1], $("#select-pays"), "Choisissez le pays");
					addOption(res[2], $("#select-champ"), "Choisissez le championnat");
					addOption(res[3], $("#select-club"), "Choisissez le club");
					addOption(res[4], $("#select-poste"), "Choisissez le poste");
					$("#search-cahiers-btn").attr("onclick","resultSearch(document.getElementById('btn-mapage').getAttribute('nom'), 1)");
				}
				else{
					$("#show-inv").hide();
					$("#selectclub-search").hide();
					addOption(res[4], $("#select-poste"), "Choisissez le poste");
					$("#search-cahiers-btn").attr("onclick","resultSearch(document.getElementById('btn-mapage').getAttribute('nom'), 2)");
				}
			}
		},
		'text'
		);
}

function addOption(tab, select, text) {
	select.empty();
	$("<option>").attr("value", 0).text(text).appendTo(select);
	for(var n=0; n<tab.length; n++) {
		$("<option class='bold'>").attr("value", tab[n]).text(tab[n]).appendTo(select);
	}
}

/*Upload logo in club register*/
function uploadImg() {
	$.post('database/upload.php',function(data, status) {console.log(data);});
}

/*Mail avec pdf après emsission de cahier de charge*/
function sendMailAndPdf(mode, _to) {
	var docDef;
	switch(mode) {
		case 'transfert' : 
		docDef = {
			info: {
				title: "Cahier de charges OFFRE TRANSFERT",
				Subject: 'Précisions sur le joueur, responsable du joueur ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une offre de transfert.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE OFFRE DE TRANSFERT\n\nPrécisions sur le joueur \n\nNom : " + $("#nom").val() + '\nNé le  ' + $("#iptDateNaissance").val() + ' à ' + $("#lieunaissance").val() + '\nPoste : ' + $("#postejoueur").val() + '\nNationalité : ' + $("#nationalite").val() + ', en sélection nationale : ' + $("#selectSelection")[0].value + '\nExpiration du contrat : ' + $("#expirationContrat").val() + '\n\nPrécisions sur le responsable du joueur\n\nLe responsable possède un compte ' + $("#typerespo")[0].value + ' \nNom : ' + $("#nomrespo").val() + '\nAdresse : ' + $("#adrespo").val() + '\nMail : ' + $("#mailrespo").val() 
			+ '\nTelephone : ' + $("#telrespo").val() + '\n\nEléments économiques\n\nLe transfert débute le ' + $("#debuttransfert").val() + ' et se termine le ' + $("#fintransfert").val() + '\nMontant du transfert : ' + $("#montantTransfert").val() + ' ' + $("#selectDevise")[0].value + '\nGarantie : ' + $("#selectGarantie")[0].value + ', conditions : ' + $("#conditions").val() + '\n\nConditions souhaitées par le joueur\n\nDurée du contrat : ' + $("#duree").val() + '\nDestinations : ' + $("#destinations").val() + '\nSalaire souhaité : ' + $("#salairesouhaite").val() + ' ' + $("#select-devise")[0].value
			+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'pret' : 
		docDef = {
			info: {
				title: "Cahier de charges OFFRE PRET",
				Subject: 'Précisions sur le joueur, responsable du joueur ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une offre de pret.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE OFFRE DE PRET\n\nPrécisions sur le joueur \n\nNom : " + $("#nom").val() + '\nNé le  ' + $("#iptDateNaissance").val() + ' à ' + $("#lieunaissance").val() + '\nPoste : ' + $("#postejoueur").val() + '\nNationalité : ' + $("#nationalite").val() + ', en sélection nationale : ' + $("#selectSelection")[0].value + '\nExpiration du contrat : ' + $("#expirationContrat").val() + '\n\nPrécisions sur le responsable du joueur\n\nLe responsable possède un compte ' + $("#typerespo")[0].value + ' \nNom : ' + $("#nomrespo").val() + '\nAdresse : ' + $("#adrespo").val() + '\nMail : ' + $("#mailrespo").val() 
			+ '\nTelephone : ' + $("#telrespo").val() + '\n\nEléments économiques\n\nLe transfert débute le ' + $("#debuttransfert").val() + ' et se termine le ' + $("#fintransfert").val() + '\nType de transfert : ' + $("#select-pret")[0].value + ', durée : ' + $("#duréepret").val() + '\nConditions sur prise en charge du salaire du joueur : ' + $("#conditionspret").val() + "\nConditions liées à option d'achat ou cas échéant : " + $("#conditions-options").val() + '\n\nConditions souhaitées par le joueur\n\nDurée du contrat : ' + $("#duree").val() + '\nDestinations : ' + $("#destinations").val() + '\nSalaire souhaité : ' + $("#salairesouhaite").val() + ' ' + $("#select-devise")[0].value
			+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'libre' : 
		docDef = {
			info: {
				title: "Cahier de charges OFFRE JOUEUR LIBRE",
				Subject: 'Précisions sur le joueur, responsable du joueur ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une offre de joueur libre.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE OFFRE DE JOUEUR LIBRE\n\nPrécisions sur le joueur \n\nNom : " + $("#nom").val() + '\nNé le  ' + $("#iptDateNaissance").val() + ' à ' + $("#lieunaissance").val() + '\nPoste : ' + $("#postejoueur").val() + '\nNationalité : ' + $("#nationalite").val() + ', en sélection nationale : ' + $("#selectSelection")[0].value + '\nExpiration du contrat : ' + $("#expirationContrat").val() + '\n\nPrécisions sur le responsable du joueur\n\nLe responsable possède un compte ' + $("#typerespo")[0].value + ' \nNom : ' + $("#nomrespo").val() + '\nAdresse : ' + $("#adrespo").val() + '\nMail : ' + $("#mailrespo").val() 
			+ '\nTelephone : ' + $("#telrespo").val() + '\n\nEléments économiques\n\nLe transfert débute le ' + $("#debuttransfert").val() + ' et se termine le ' + $("#fintransfert").val() + '\n\nConditions souhaitées par le joueur\n\nDurée du contrat : ' + $("#duree").val() + '\nDestinations : ' + $("#destinations").val() + '\nSalaire souhaité : ' + $("#salairesouhaite").val() + ' ' + $("#select-devise")[0].value
			+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'd-transfert' : 
		docDef = {
			info: {
				title: "Cahier de charges DEMANDE TRANSFERT",
				Subject: 'Précisions sur les demandes du club concernant le profil technique, les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une demande de transfert.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE DEMANDE DE TRANSFERT\n\nProfil du joueur recherché : \n\nPoste recherché : " + $("#poste-rech").val() + '\nAge recherché : ' + $("#age-rech").val() + '\nProfil technique : ' + $("#prof-tech").val() + '\nAutres précisions : ' + $("#autres-elem").val() + '\n\nElements économiques \n\nMontant proposé pour transfert : ' + $("#montant-rech").val() + ' ' + $("#select-devise-rech")[0].value + '\nConditions liées au paiement : ' + $("#cond-paiement-rech").val() + '\nGarantie : ' + $("#garantie-rech")[0].value + ' , conditions : ' + $("#cond-gar-rech").val()
			+ '\n\nConditions proposées au futur joueur\n\nDurée du contrat : ' + $("#duree-rech").val() + '\nSalaire proposé : ' + $("#salaire-rech").val() + ' ' + $("#select-devise2-rech")[0].value + '\nAutres avantages : ' + $("#autre-cond-rech").val() + "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'd-pret' : 
		docDef = {
			info: {
				title: "Cahier de charges DEMANDE PRÊT",
				Subject: 'Précisions sur les demandes du club concernant le profil technique, les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une demande de prêt.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE DEMANDE DE TRANSFERT\n\nProfil du joueur recherché : \n\nPoste recherché : " + $("#poste-rech").val() + '\nAge recherché : ' + $("#age-rech").val() + '\nProfil technique : ' + $("#prof-tech").val() + '\nAutres précisions : ' + $("#autres-elem").val() + '\n\nElements économiques \n\nType de prêt recherché : ' + $("#typepret-dem").val() + '\nDurée du prêt recherché : ' + $("#dureepret-dem").val() + '\nPrise en charge du salaire du salaire : ' + $("#select-chargesal").val() + ' , si oui au pourcentage :  ' + $("#pourcent-sal").val() +
			'\n\nConditions proposées au futur joueur\n\nDurée du contrat : ' + $("#duree-rech").val() + '\nSalaire proposé : ' + $("#salaire-rech").val() + ' ' + $("#select-devise2-rech")[0].value + '\nAutres avantages : ' + $("#autre-cond-rech").val()+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'd-libre' : 
		docDef = {
			info: {
				title: "Cahier de charges DEMANDE JOUEUR LIBRE",
				Subject: 'Précisions sur les demandes du club concernant le profil technique, les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une demande de joueur libre.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE POUR L'EMISSION D'UNE DEMANDE DE JOUEUR LIBRE\n\nProfil du joueur recherché : \n\nPoste recherché : " + $("#poste-rech").val() + '\nAge recherché : ' + $("#age-rech").val() + '\nProfil technique : ' + $("#prof-tech").val() + '\nAutres précisions : ' + $("#autres-elem").val() + '\n\nConditions proposées au futur joueur\n\nDurée du contrat : ' + $("#duree-rech").val() + '\nSalaire proposé : ' + $("#salaire-rech").val() + ' ' + $("#select-devise2-rech")[0].value + '\nAutres avantages : ' + $("#autre-cond-rech").val()+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'capital' :
		docDef = {
			info: {
				title: "Cahier de recherche en CAPITAL",
				Subject: 'Précisions sur les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une recherche en capital.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE DE RECHERCHE EN CAPITAL\n\nAugmentation de capital : \n\nNombre de parts concernées : " + $("#aug-nb").val() + " , avec une valeur nominative de " + $("#aug-nom").val() + " , soit une évaluation totale de " + $("#aug-total").val() + "\n\nCession partielle d'actions : \n\nNombre de parts concernées : " + $("#cession-nb").val() + " , avec une valeur nominative de " + $("#cession-nom").val() + " , soit une évaluation totale de " + $("#cession-total").val() + "\n\nCession totale ou de plus de 50% des actions : \n\nNombre de parts concernées : " + $("#tot-nb").val() + " , avec une valeur nominative de " + $("#tot-nom").val() + " , soit une évaluation totale de " + $("#tot-total").val() + '\nAutres avantages : ' + $("#elems-cap").val()+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'sponsor' :
		docDef = {
			info: {
				title: "Cahier de recherche en SPONSORING",
				Subject: 'Précisions sur les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une recherche de sponsoring.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE DE RECHERCHE EN SPONSORING\n\nOffre : Naming de stade\n\nCaracteristiques de l'offre : " + $("#naming-car").val() + "\nDurée de l'offre : " + $("#duree-naming").val() + "\nBudget hors taxes : " + $("#budget-naming").val() + "\n\nOffre : Espace maillots du club\n\nCaracteristiques de l'offre : " + $("#maillots-car").val() 
			+ "\nDurée de l'offre : " + $("#duree-maillots").val() + "\nBudget hors taxes : " + $("#budget-maillots").val() + "\n\nOffre : Visibilité panneaux fixes\n\nCaracteristiques de l'offre : " + $("#fixes-car").val() + "\nDurée de l'offre : " + $("#duree-fixes").val() + "\nBudget hors taxes : " + $("#budget-fixes").val() +
			+ "\n\nOffre : Visibilité panneaux mobiles\n\nCaracteristiques de l'offre : " + $("#mobiles-car").val() + "\nDurée de l'offre : " + $("#duree-mobiles").val() + "\nBudget hors taxes : " + $("#budget-mobiles").val() + 
			"\n\nOffre : Visibilité tribunes\n\nCaracteristiques de l'offre : " + $("#tribunes-car").val() + "\nDurée de l'offre : " + $("#duree-tribunes").val() + "\nBudget hors taxes : " + $("#budget-tribunes").val() + 
			"\n\nOffre : Visibilité sur site internet du club\n\nCaracteristiques de l'offre : " + $("#site-car").val() + "\nDurée de l'offre : " + $("#duree-site").val() + "\nBudget hors taxes : " + $("#budget-site").val() + 
			"\n\nOffre : Loges et packages premium\n\nCaracteristiques de l'offre : " + $("#loges-car").val() + "\nDurée de l'offre : " + $("#duree-loges").val() + "\nBudget hors taxes : " + $("#budget-loges").val() 
		}
		break;
		case 'p-capital' :
		docDef = {
			info: {
				title: "Cahier de proposition d'entrée en CAPITAL",
				Subject: 'Précisions sur les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une proposition d'entrée en capital.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE DE PROPOSITION D'ENTREE EN CAPITAL\n\nAugmentation de capital : \n\nNombre de parts concernées : " + $("#aug-nb").val() + " , avec une valeur nominative de " + $("#aug-nom").val() + " , soit une évaluation totale de " + $("#aug-total").val() + "\n\nCession partielle d'actions : \n\nNombre de parts concernées : " + $("#cession-nb").val() + " , avec une valeur nominative de " + $("#cession-nom").val() + " , soit une évaluation totale de " + $("#cession-total").val() + "\n\nCession totale ou de plus de 50% des actions : \n\nNombre de parts concernées : " + $("#tot-nb").val() + " , avec une valeur nominative de " + $("#tot-nom").val() + " , soit une évaluation totale de " + $("#tot-total").val() + '\nAutres avantages : ' + $("#elems-cap").val()+ "\n\nN'hésitez pas à nous contacter pour toute erreur ou incohérence !\n\nL'équipe FootballGlobalSociety,\nhttp://footballglobalstrategy.epizy.com\n\n\n\n"
		}
		break;
		case 'p-sponsor' :
		docDef = {
			info: {
				title: "Cahier de recherche en SPONSORING",
				Subject: 'Précisions sur les élements économiques ainsi que termes du contrat',
				body : "Bonjour Mr, Mme, " + "\n\nVous venez d'émettre un cahier de charge concernant une proposition de sponsoring.\nVeuillez trouver en pièce-jointe un PDF regroupant les clauses du contrat.\nMerci de nous indiquer toute incohérence.\n\nCordialement, l'équipe FootballGlobalSociety.\nfootballglobalstrategy@gmail.com"
			},
			content:  "CAHIER DE CHARGE DE PROPOSITION DE SPONSORING\n\nOffre : Naming de stade\n\nCaracteristiques de l'offre : " + $("#naming-car").val() + "\nDurée de l'offre : " + $("#duree-naming").val() + "\nBudget hors taxes : " + $("#budget-naming").val() + "\n\nOffre : Espace maillots du club\n\nCaracteristiques de l'offre : " + $("#maillots-car").val() 
			+ "\nDurée de l'offre : " + $("#duree-maillots").val() + "\nBudget hors taxes : " + $("#budget-maillots").val() + "\n\nOffre : Visibilité panneaux fixes\n\nCaracteristiques de l'offre : " + $("#fixes-car").val() + "\nDurée de l'offre : " + $("#duree-fixes").val() + "\nBudget hors taxes : " + $("#budget-fixes").val() +
			+ "\n\nOffre : Visibilité panneaux mobiles\n\nCaracteristiques de l'offre : " + $("#mobiles-car").val() + "\nDurée de l'offre : " + $("#duree-mobiles").val() + "\nBudget hors taxes : " + $("#budget-mobiles").val() + 
			"\n\nOffre : Visibilité tribunes\n\nCaracteristiques de l'offre : " + $("#tribunes-car").val() + "\nDurée de l'offre : " + $("#duree-tribunes").val() + "\nBudget hors taxes : " + $("#budget-tribunes").val() + 
			"\n\nOffre : Visibilité sur site internet du club\n\nCaracteristiques de l'offre : " + $("#site-car").val() + "\nDurée de l'offre : " + $("#duree-site").val() + "\nBudget hors taxes : " + $("#budget-site").val() + 
			"\n\nOffre : Loges et packages premium\n\nCaracteristiques de l'offre : " + $("#loges-car").val() + "\nDurée de l'offre : " + $("#duree-loges").val() + "\nBudget hors taxes : " + $("#budget-loges").val() 
		}
		break;
		default:
		console.error("Type de cahier non reconnu dans l'envoi du mail");
		break;
	}

	const pdf = pdfMake.createPdf(docDef);

    //save PDF on server
        $.post(
            'database/txt.php',
            {
                data : docDef.content
            },
            function(data, status) {
                if(data == 'Saved') {
    //send Mail with PDF as attachment
	pdf.getBase64( function(res) { 
		Email.send({
			Host : "smtp.elasticemail.com",
			To : _to,
			From : "",   //adresse mail de l'expediteur
			Subject : "Emission d'un cahier de charge",
			Body : "Bonjour Mr,Mme,\n\nNous vous confirmons l'enregistrement d'un cahier de charge de votre club sur la plateforme.\nVveuillez trouver le PDF reprenant les termes du cahier de charges en pièce-jointe.\nN'hésitez pas à nous signaler toute incohérence ! \n\nCordialement, l'équipe FootballGlobalSociety\nfootballglobalstrategy.epizy.com\nfootballglobalstrategy@gmail.com",
			Username : "", //adresse mail de l'expediteur
			Password : "e5301ecc-cf8f-419c-a986-2a87147071c9",
			Attachments : [
			{
				name : "contract.pdf",
				data : res
			}
			]
		}).then(message => {
			$("#modal_title").text("Confirmation de création de cahier de charge");
			$("#modal-close-btn").attr("onclick", "showCompte($('#fonctions'))");
			if(message == "OK") {
				$("#body-registerCahier").text("Enregistrement du cahier de charge effectué.\nUn mail de confirmation a été envoyé au responsable du club !");
				$("#modalNewCahier").modal("show");
			}
			else{
				$("#body-registerCahier").text("Enregistrement du cahier de charge effectué.\nCependant le mail de confirmation n'a pas pu être envoyé dû à une adresse mail incorrecte ou un problème technique.");
				$("#modalNewCahier").modal("show");
			}
		});
	});
                }
                else{
                    $("#body-registerCahier").text("Problème de l'enregistrement du fichier texte du cahier sur le serveur.");
				$("#modalNewCahier").modal("show");
                }
     });
}

function fillTable(head, param, elem, table) {
	var $t = $("<thead class='thead-dark'>").appendTo(table);
	var $tr = $("<tr>").appendTo($t);
	$("<th colspan = 2  style='text-align: center;'>").text(head).appendTo($tr);
	for(var i = 0; i < param.length; i++) {
		var $tr = $("<tr>").appendTo(table);
		$("<td>").text(param[i]).appendTo($tr);
		$("<td>").text(elem[i]).appendTo($tr);
	}
}

function fillCapital(head, param, table) {
	var compt = 0;
	var $t = $("<thead class='thead-dark'>").appendTo(table);
	var $tr = $("<tr>").appendTo($t);
	for(var k = 0; k < head.length; k++) {
		$("<th>").text(head[k]).appendTo($tr);
	}
	for(var i = 0; i < 3; i++) {
		var $tr = $("<tr>").appendTo(table);
		for(var j  =0; j < 4; j++) {
			$("<td>").text(param[compt]).appendTo($tr);
			compt++;
		}
	}
}

function fillSponsor(head, param, table) {
	var compt  =0;
	var $t = $("<thead class='thead-dark'>").appendTo(table);
	var $tr = $("<tr>").appendTo($t);
	for(var k = 0; k < head.length; k++) {
		$("<th>").text(head[k]).appendTo($tr);
	}
	for(var i = 0; i < 7; i++) {
		var $tr = $("<tr>").appendTo(table);
		for(var j  =0; j < 4; j++) {
			$("<td>").text(param[compt]).appendTo($tr);
			compt++;
		}
	}
}

function zoomPlayer(idx) {
	window.scroll(0,0);
	var joueur = g_joueurs[idx];
	var conditions = g_conditions[idx];
    $("#downloadCahier").attr('href', 'database/cahier' + joueur.id + ".txt");
	$("#zoomtitle").empty();
	$("#table-zoom-joueur").empty();
	$("#table-zoom-conditions").empty();
	$("#capspo").empty();
	$("#showIfProp").hide();
	if(joueur.zoom == 0){
		$("#showZoomClub").show();
		$("#showCapSpo").hide();
	}
	else if(joueur.zoom == 1) {
		console.log("show capspo");
		$("#showZoomClub").hide();
		$("#showCapSpo").show();
	}
	document.getElementById("btn-mapage").setAttribute("idCahier", joueur.id);
	
	switch(joueur.typeoffre.slice(0,4)) {
		case 'tran' : 
		fillTable('Description du joueur', ['Nom', 'Naissance', 'Nationalité', 'Poste', 'Selection' , 'Expiration du contrat', 'Responsable'], [joueur.nom, 'Le' + joueur.datenaissance + ' à ' + joueur.lieunaissance, joueur.nationalite, joueur.poste, joueur.selection, joueur.expirationcontrat, joueur.idrespo], $("#table-zoom-joueur"));
		fillTable('Conditions du cahier', ['Type de cahier', 'Période de transfert', 'Montant du transfert', 'Destinations souhaitées par joueur', 'Durée du contrat souhaité par joueur' , 'Salaire souhaité par joueur', 'Autres conditions du joueur'], ['Transfert', 'Du ' + conditions.debuttransfert + ' au ' + conditions.fintransfert, conditions.montant + " " + conditions.devisemontant, conditions.destinations, conditions.duree, conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
		$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Offre de transfert du joueur " + joueur.nom);
		break;
		case 'pret':
		fillTable('Description du joueur', ['Nom', 'Naissance', 'Nationalité', 'Poste', 'Selection' , 'Expiration du contrat', 'Responsable'], [joueur.nom, 'Le' + joueur.datenaissance + ' à ' + joueur.lieunaissance, joueur.nationalite, joueur.poste, joueur.selection, joueur.expirationcontrat, joueur.idrespo], $("#table-zoom-joueur"));
		fillTable('Conditions du cahier', ['Type de cahier', 'Période de transfert', 'Type de prêt', 'Durée du prêt', "Conditions à l'achat" , 'Conditions de prise en charge du salaire', 'Destinations souhaitées par joueur', 'Durée du contrat souhaité par joueur' , 'Salaire souhaité par joueur', 'Autres conditions du joueur'], ['Prêt', 'Du ' + conditions.debuttransfert + ' au ' + conditions.fintransfert, conditions.typepret, conditions.dureepret, conditions.conditionsachat, conditions.conditionssalaire, conditions.destinations, conditions.duree, conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
		$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Offre de prêt du joueur " + joueur.nom);
		break;
		case 'joue':
		fillTable('Description du joueur', ['Nom', 'Naissance', 'Nationalité', 'Poste', 'Selection' , 'Expiration du contrat', 'Responsable'], [joueur.nom, 'Le' + joueur.datenaissance + ' à ' + joueur.lieunaissance, joueur.nationalite, joueur.poste, joueur.selection, joueur.expirationcontrat, joueur.idrespo], $("#table-zoom-joueur"));
		fillTable('Conditions du cahier', ['Type de cahier', 'Période de transfert', 'Destinations souhaitées par joueur', 'Durée du contrat souhaité par joueur' , 'Salaire souhaité par joueur', 'Autres conditions du joueur'], ['Transfert', 'Du ' + conditions.debuttransfert + ' au ' + conditions.fintransfert, conditions.destinations, conditions.duree, conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
		$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Offre de joueur libre : " + joueur.nom);
		break;
		case 'dema':
		fillTable('Profil recherché', ['Poste', 'Age', 'Profil technique', 'Précisions supplémentaires'], [conditions.poste, conditions.age , conditions.technique, conditions.autretech], $("#table-zoom-joueur"));
		if(joueur.typeoffre.slice(7, joueur.typeoffre.length) == "transfert") {
			fillTable('Conditions du cahier', ['Type de cahier', 'Montant proposé', 'Conditions du paiement', 'Garantie et conditions' , 'Durée de contrat demandée', 'Salaire net/mois proposé', 'Autres avantages proposés'], ['Demande de transfert', conditions.montant + " " + conditions.devisemontant, conditions.conditionspaiement, conditions.garantie + ", " + conditions.conditionsgarantie, conditions.duree , conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Recherche d'offre de transfert");
		}
		else if(joueur.typeoffre.slice(7, joueur.typeoffre.length) == "pret") {
			fillTable('Conditions du cahier', ['Type de cahier', 'Type de prêt recherché', 'Durée du prêt recherché', 'Prise en charge du salaire' , 'Salaire net/mois proposé', 'Autres avantages'], ['Demande de prêt', conditions.typepret, conditions.dureepret, conditions.chargesal + ", si oui à " + conditions.pourcentsal, conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Recherche d'offre de prêt");
		}
		else if(joueur.typeoffre.slice(7, joueur.typeoffre.length) == "libre") {
			fillTable('Conditions du cahier', ['Type de cahier', 'Durée du contrat recherché', 'Salaire net/mois proposé', 'Autres avantages' ], ['Recherche de joueur libre', conditions.duree, conditions.salaire + " " + conditions.devisesalaire, conditions.autre], $("#table-zoom-conditions"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Recherche d'offre de joueur libre");
		}
		break;
		case 'rech' : 
		if(joueur.typeoffre.slice(4, joueur.typeoffre.length) == "capital") {
			fillCapital(['Type de cession', "Nombres d'actions ou parts sociales concernées", "Valeur nominative d'une action ou part", "Valeur evaluée de la cession"],['Augmentation de capital', conditions.augm, conditions.augmnom, conditions.augmtot, "Cession partielle d'actions existantes", conditions.ced, conditions.cednom, conditions.cedtot , "Cession totale ou de plus de 50% du capital", conditions.cedtotal, conditions.cedtotalnom, conditions.cedtotaltot], $("#capspo"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Offre d'entrée en capital");
		}
		else if(joueur.typeoffre.slice(4, joueur.typeoffre.length) == "sponsor") {
			fillSponsor(["Type d'offre", "Caractéristiques techniques de l'offre", "Durée de l'offre", "Budget hors-taxes"], ["Naming stade", conditions.namingcar, conditions.namingduree, conditions.namingbudget, "Espace maillots club", conditions.maillotcar, conditions.maillotduree, conditions.maillotbudget, "Visibilité stade - Panneaux fixes",  conditions.fixescar, conditions.fixesduree, conditions.fixesbudget, "Visibilité stade - Panneaux mobiles", conditions.mobilescar, conditions.mobilesduree, conditions.mobilesbudget, "Visibilité tribunes", conditions.tribunescar, conditions.tribunesduree, conditions.tribunesbudget, "Visibilié site internet du club", conditions.sitecar, conditions.siteduree, conditions.sitebudget,"Loges et package premium", conditions.logescar, conditions.logesduree, conditions.logesbudget], $("#capspo"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Recherche de sponsoring" );
		}
		break;
		case 'prop':
		if(joueur.typeoffre.slice(4, joueur.typeoffre.length) == "capital") {
			fillCapital(['Type de cession', "Nombres d'actions ou parts sociales concernées", "Valeur nominative d'une action ou part", "Valeur evaluée de la cession"],['Augmentation de capital', conditions.augm, conditions.augmnom, conditions.augmtot, "Cession partielle d'actions existantes", conditions.ced, conditions.cednom, conditions.cedtot , "Cession totale ou de plus de 50% du capital", conditions.cedtotal, conditions.cedtotalnom, conditions.cedtotaltot], $("#capspo"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Proposition d'entrée en capital");
		}
		else if(joueur.typeoffre.slice(4, joueur.typeoffre.length) == "sponsor") {
			fillSponsor(["Type d'offre", "Caractéristiques techniques de l'offre", "Durée de l'offre", "Budget hors-taxes"], ["Naming stade", conditions.namingcar, conditions.namingduree, conditions.namingbudget, "Espace maillots club", conditions.maillotcar, conditions.maillotduree, conditions.maillotbudget, "Visibilité stade - Panneaux fixes",  conditions.fixescar, conditions.fixesduree, conditions.fixesbudget, "Visibilité stade - Panneaux mobiles", conditions.mobilescar, conditions.mobilesduree, conditions.mobilesbudget, "Visibilité tribunes", conditions.tribunescar, conditions.tribunesduree, conditions.tribunesbudget, "Visibilié site internet du club", conditions.sitecar, conditions.siteduree, conditions.sitebudget,"Loges et package premium", conditions.logescar, conditions.logesduree, conditions.logesbudget], $("#capspo"));
			$("#zoom-title").html("Cahier de charge n°" + joueur.id + "<br>" +  joueur.club + "<br>" + "Proposition de sponsoring");
		}
		break;
		default : 
		console.error("Erreur dans type de cahier avant zoom sur détails");
		break;
	}
	ui_click("zoom");
}

function showContreprop() {
	$("#showIfProp").show();
	var p = $("#textprop").position();
	p.behavior = 'smooth';
	window.scroll(p); 
}

function contactClub() {
	$("#modal_title").text("Prise de contact avec le club ");
	$.post(
		'database/noticeInterest.php',
		{
			idcahier : document.getElementById("btn-mapage").getAttribute('idCahier'),
			nom : document.getElementById("btn-mapage").getAttribute('nom'),
			type : document.getElementById("btn-mapage").getAttribute('entite_type'),
			contreprop : $("#textprop").val()
		},
		function(data, status) {
			if(data == "Updated") {
				$("#body-registerCahier").text("Les responsables du club ont bien été signalés de votre intêret pour ce cahier de charge !");
			}
			else{
				$("#body-registerCahier").text("Une erreur s'est produite lors de la prise de contact avec le club.");
			}
			$("#modal-close-btn").attr("onclick", "ui_click('zoom')");
			$("#modalNewCahier").modal("show");
		});

}