// Array para captar los diferentes cnPROTEINAS
var cns = [];
// Array para guardar las PROTEINAS
var proteins= [];
// Array ordenConstitutivo CORREGIR KME
var orConst= ["Cn","k_","k_m","k_b","k_u","d_m","Kme"];
// Array ordenInducible1
//SOLO APARECEN LOS QUE EN LA LIBRETA TIENEN EL NOMBRE DE LA PROTEINA "Y" HAY QUE ARREGLAR
var orIndu1Null= ["Cn","k_","k_m","k_b","k_u","d_m","k_bRNA","k_uRNA"];
var orIndu1Static=["k_uRNAComplex=null;\r","k_bRNAComplex=null;\r"];
// Array ordenInducible2
var orIndu2Null= ["Cn","k_","k_m","d_m","k_bRNA","k_uRNA"];
var orIndu2Static=["k_bO=null;\r","k_uO=null;\r","k_bO_2=null;\r","k_uO_2=null;\r","k_bRNAComplex=null;\r","k_uRNAComplex=null;\r"]
// Para no leer mas alla de los PARAMETROS
var limiteParametros=0;
// El output de la parte de PARAMETROS
var elOutput=["% parameters\rCrnaPOLfree=null;\r"];
//El resto de parameters
var elFooter=[];


fs = require('fs')
fs.readFile('/home/osboxes/Desktop/regulated1ConnectedDriver.m', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  // String para comparar los Cns
  var str1="Cn";
  // Longitud de la string str1
  var lengthStr1= str1.length;

  // Divide la data en Lineas
  var lines = data.split('\n');

  var rompeLoop1= true;

  // Bucle para coger todos los Cns y meterlos en las CnsProteinas
  for(var i = 0;i < lines.length && rompeLoop1;i++){
    if((lines[i].localeCompare("% define rate constants\r")==0))
    {
      //Hemos pasado todos los parametros y rompemos el bucle no hace falta buscar mas
      limiteParametros=i-2;
      rompeLoop1=false;
    }else{
    var str2=lines[i].substring(0,lengthStr1);
    var n = str2.localeCompare(str1);
   if(n==0){cns.push(lines[i]);}
    }
  }
  // Rellenamos el footer
  for (var j = limiteParametros; j < lines.length; j++) {
    elFooter.push(lines[j]);
  }
  var footer=elFooter.join("");


  // En este Bucle extraemos en una Array los nombres de las diferentes piezas Proteinas para buscar y ordenar
  for (var j = 0; j < cns.length; j++) {
    var rompeLoop2 = true;
    for (var k = 2; k < cns[j].length-1 && rompeLoop2; k++) {
      var m = cns[j].substring(k,k+1).localeCompare("=");
      if(m==0){
        proteins.push(cns[j].substring(lengthStr1,k));
        rompeLoop2=false;
      }
    }
  }
  for (var p = 0; p < proteins.length; p++) {
    var rompeLoop3= true;

    for (var i = 0; i < lines.length && i < limiteParametros && rompeLoop3; i++) {
      // VAMOS A VER SI ES INDUCIBLE DE DOS FACTORES SOBRE UN OPERADOR
      if((lines[i].substring(0,4+proteins[p].length).localeCompare("k_n"+proteins[p]+"2"))==0)
      {
        //Salimos porque ya sabemos que es
        rompeLoop3=false;
        for (var s = 0; s < orIndu2Null.length; s++) {
          elOutput.push(orIndu2Null[s]+proteins[p]+"=null;\r");
        }
        for (var t = 0; t < orIndu2Static.length; t++) {
          elOutput.push(orIndu2Static[t]);
        }
        elOutput.push("k_n"+proteins[p]+"1= k_uO/k_bO;\r");
        elOutput.push("k_n"+proteins[p]+"2= k_uO_2/k_bO_2;\r");
        elOutput.push("k_y0=(k_uRNA"+proteins[p]+"+k_m"+proteins[p]+")/k_bRNA"+proteins[p]+";\r");
        elOutput.push("k_y=(k_uRNAComplex+k_m"+proteins[p]+")/k_bRNAComplex;\r");
        elOutput.push("K_"+proteins[p]+"=k_"+proteins[p]+"*Cn"+proteins[p]+"*(k_m"+proteins[p]+"/d_m"+proteins[p]+"\r");

        //VAMOS A MIRAR SI ES INDUCIBLE DE UN FACTOR
      }else if ((lines[i].substring(0,4+proteins[p].length).localeCompare("k_n"+proteins[p]+"1"))==0) {

        //Salimos porque ya sabemos que es
        rompeLoop3=false;
        for (var s = 0; s < orIndu1Null.length; s++) {
          elOutput.push(orIndu1Null[s]+proteins[p]+"=null;\r");
        }
        for (var t = 0; t < orIndu1Static.length; t++) {
          elOutput.push(orIndu1Static[t]);
        }
        elOutput.push("k_y=(k_uRNAComplex+k_m"+proteins[p]+")/k_bRNAComplex;\r");
        elOutput.push("k_y0=(k_uRNA"+proteins[p]+"+k_m"+proteins[p]+")/k_bRNA"+proteins[p]+";\r");
        elOutput.push("k_n"+proteins[p]+"1= k_u"+proteins[p]+"/k_b"+proteins[p]+";\r");
        elOutput.push("K_"+proteins[p]+"=k_"+proteins[p]+"*Cn"+proteins[p]+"*(k_m"+proteins[p]+"/d_m"+proteins[p]+";\r");
      }
    }
  // SI rompeLoop3 es TRUE SIGNIFICA QUE ES CONSTITUTIVO
    if (rompeLoop3) {
      rompeLoop3=false;
      for (var s = 0; s < orConst.length; s++) {

        if((orConst[s].localeCompare("Kme"))==0)
        {
          elOutput.push("Km"+proteins[p]+"e=k_m"+proteins[p]+"/(1+(1/CrnaPOLfree)*((k_u"+proteins[p]+"+k_m"+proteins[p]+")/k_b"+proteins[p]+"));\r");

        }else{
          elOutput.push(orConst[s]+proteins[p]+"=null;\r");

        }
      }
    }

  }

  // Hago un String de la Array sin comas
  var parametros=elOutput.join("");
  // Concateno los dos String que componen el archivo
  var output=parametros.concat(footer);

  // Sobreescribimos el archivo reoordenado correctamente
  fs.writeFile('/home/osboxes/Desktop/Alvaro.m', output, function(err) {
      if(err) {
          return console.log(err);
      }
  });
});
