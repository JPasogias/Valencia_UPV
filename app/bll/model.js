'use strict';
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID


exports.modelObj = function newsCreate(piezas) {
  var parteParametros = "";
  var parteEcuaciones = "";

  for (var i = 0; i < piezas.length; i++) {
    var pieza = piezas[i];
    // Posibilidad Constitutive
    if (pieza.type == "Constitutive") {

      if(!pieza.name) {pieza.name = "Noname-" + i;}
      if(!pieza.CrnaPOLfree) {pieza.CrnaPOLfree = 0;}
      if(!pieza.Cn) {pieza.Cn = 0;}
      if(!pieza.k_b) {pieza.k_b = 0;}
      if(!pieza.k_u) {pieza.k_u = 0;}
      if(!pieza.k_m) {pieza.k_m = 0;}
      if(!pieza.d_m) {pieza.d_m = 0;}
      if(!pieza.k_) {pieza.k_ = 0;}

      // Parametros
      parteParametros = parteParametros + "parameter Cn" + pieza.name + "=" + pieza.Cn + ";\n";
      parteParametros = parteParametros + "parameter k_b" + pieza.name + "=" + pieza.k_b + ";\n";
      parteParametros = parteParametros + "parameter k_u" + pieza.name + "=" + pieza.k_u + ";\n";
      parteParametros = parteParametros + "parameter k_m" + pieza.name + "=" + pieza.k_m + ";\n";
      parteParametros = parteParametros + "parameter d_m" + pieza.name + "=" + pieza.d_m + ";\n";
      parteParametros = parteParametros + "parameter k_" + pieza.name + "=" + pieza.k_ + ";\n";
      parteParametros = parteParametros + "parameter CrnaPOLfree" + pieza.name + "=" + pieza.CrnaPOLfree + ";\n";

      parteParametros = parteParametros + "parameter Km" + pieza.name + "e=k_m" + pieza.name + "/(1+(1/CrnaPOLfree"+pieza.name+")*((k_u" + pieza.name + " + k_m" + pieza.name + ")/k_b" + pieza.name + "));\n";
      parteParametros = parteParametros + "parameter k" + pieza.name + "e=k_" + pieza.name + "*(Km" + pieza.name + "e/d_m" + pieza.name + ");\n\n\n";

      //Ecuaciones
      parteEcuaciones = parteEcuaciones + "null => " + pieza.name + "; k" + pieza.name + "e*Cn" + pieza.name + "\n";
      parteEcuaciones = parteEcuaciones + pieza.name + " -> null; d_" + pieza.name + "=null;" + "\n\n\n";
    }
    // Posibilidad IndOneOOneF
    else if (pieza.type == "IndOneOOneF") {

      if(!pieza.name) {pieza.name = "Noname-" + i;}
      if(!pieza.CrnaPOLfree) {pieza.CrnaPOLfree = 0}
      if(!pieza.Cn) {pieza.Cn = 0}
      if(!pieza.k_b) {pieza.k_b = 0}
      if(!pieza.k_u) {pieza.k_u = 0}
      if(!pieza.k_bRNAComplex) {pieza.k_bRNAComplex = 0}
      if(!pieza.k_uRNAComplex) {pieza.k_uRNAComplex = 0}
      if(!pieza.k_bRNA) {pieza.k_bRNA = 0}
      if(!pieza.k_uRNA) {pieza.k_uRNA = 0}
      if(!pieza.k_m) {pieza.k_m = 0}
      if(!pieza.k_) {pieza.k_ = 0}
      if(!pieza.d_m) {pieza.d_m = 0}
      if(!pieza.dependency1) {pieza.dependency1 = 0}

      // Parametros
      parteParametros = parteParametros + "parameter Cn" + pieza.name + "=" + pieza.Cn + ";\n";
      parteParametros = parteParametros + "parameter k_b" + pieza.name + "=" + pieza.k_b + ";\n";
      parteParametros = parteParametros + "parameter k_u" + pieza.name + "=" + pieza.k_u + ";\n";
      parteParametros = parteParametros + "parameter k_n" + pieza.name + "1= k_u" + pieza.name + "/k_b" + pieza.name + ";\n";

      parteParametros = parteParametros + "parameter k_bRNAComplex" + pieza.name + "=" + pieza.k_bRNAComplex + ";\n";
      parteParametros = parteParametros + "parameter k_uRNAComplex" + pieza.name + "=" + pieza.k_uRNAComplex + ";\n";
      parteParametros = parteParametros + "parameter k_y" + pieza.name + "=(k_uRNAComplex" + pieza.name + "+k_m" + pieza.name + ")/k_bRNAComplex" + pieza.name + ";\n";

      parteParametros = parteParametros + "parameter k_bRNA" + pieza.name + "=" + pieza.k_bRNA + ";\n";
      parteParametros = parteParametros + "parameter k_uRNA" + pieza.name + "=" + pieza.k_uRNA + ";\n";
      parteParametros = parteParametros + "parameter k_m" + pieza.name + "=" + pieza.k_m + ";\n";
      parteParametros = parteParametros + "parameter k_y0" + pieza.name + "=(k_uRNA" + pieza.name + "+k_m" + pieza.name + ")/k_bRNA" + pieza.name + ";\n";
      parteParametros = parteParametros + "parameter d_m" + pieza.name + "=" + pieza.d_m + ";\n";
      parteParametros = parteParametros + "parameter k_" + pieza.name + "=" + pieza.k_ + ";\n";
      parteParametros = parteParametros + "parameter K_" + pieza.name + "=k_" + pieza.name + "*Cn" + pieza.name + "*(k_m" + pieza.name + "/d_m" + pieza.name + ");\n";
      parteParametros = parteParametros + "parameter CrnaPOLfree" + pieza.name + "=" + pieza.CrnaPOLfree + ";\n";

      //Ecuaciones
      parteEcuaciones = parteEcuaciones + "null => " + pieza.name + ";  K_" + pieza.name + "*((CrnaPOLfree"+pieza.name+"/k_y0" + pieza.name + ")+(CrnaPOLfree"+pieza.name+"/k_y" + pieza.name + ")*(" + pieza.dependency1 + "/k_n" + pieza.name + "1))/(1+(CrnaPOLfree"+pieza.name+"/k_y0"+pieza.name+")+(" + pieza.dependency1 + "/k_n" + pieza.name + "1)*(1+CrnaPOLfree"+pieza.name+"/k_y" + pieza.name + "))\n";
      parteEcuaciones = parteEcuaciones + pieza.name + " -> null; d_" + pieza.name + "=null;\n\n\n";


    }

    // Posibilidad IndOneOTwoO
    else if (pieza.type == "IndOneOTwoO") {

      if(!pieza.name) {pieza.name = "Noname-" + i;}
      if(!pieza.CrnaPOLfree){pieza.CrnaPOLfree = 0;}
      if(!pieza.Cn){pieza.Cn = 0;}
      if(!pieza.k_b){pieza.k_b = 0;}
      if(!pieza.k_u){pieza.k_u = 0;}
      if(!pieza.k_u2){pieza.k_u2 = 0;}
      if(!pieza.k_b2){pieza.k_b2 = 0;}
      if(!pieza.k_bRNAComplex){pieza.k_bRNAComplex = 0;}
      if(!pieza.k_uRNAComplex){pieza.k_uRNAComplex = 0;}
      if(!pieza.k_bRNA){pieza.k_bRNA = 0;}
      if(!pieza.k_uRNA){pieza.k_uRNA = 0;}
      if(!pieza.k_m){pieza.k_m = 0;}
      if(!pieza.d_m){pieza.d_m = 0;}
      if(!pieza.k_){pieza.k_ = 0;}
      if(!pieza.dependency1){pieza.dependency1 = 0}
      if(!pieza.dependency2){pieza.dependency2 = 0}

      // Parametros
      parteParametros = parteParametros + "parameter Cn" + pieza.name + "=" + pieza.Cn + ";\n";
      parteParametros = parteParametros + "parameter k_b" + pieza.name + "=" + pieza.k_b + ";\n";
      parteParametros = parteParametros + "parameter k_u" + pieza.name + "=" + pieza.k_u + ";\n";
      parteParametros = parteParametros + "parameter k_n" + pieza.name + "1= k_u" + pieza.name + "/k_b" + pieza.name + ";\n";

      parteParametros = parteParametros + "parameter k_b" + pieza.name + "_2=" + pieza.k_b + ";\n";
      parteParametros = parteParametros + "parameter k_u" + pieza.name + "_2=" + pieza.k_u + ";\n";
      parteParametros = parteParametros + "parameter k_n" + pieza.name + "2=k_u" + pieza.name + "_2/k_b" + pieza.name + "_2;\n";

      parteParametros = parteParametros + "parameter k_bRNAComplex" + pieza.name + "=" + pieza.k_bRNAComplex + ";\n";
      parteParametros = parteParametros + "parameter k_uRNAComplex" + pieza.name + "=" + pieza.k_uRNAComplex + ";\n";
      parteParametros = parteParametros + "parameter k_y" + pieza.name + "=(k_uRNAComplex" + pieza.name + "+k_m" + pieza.name + ")/k_bRNAComplex" + pieza.name + ";\n";

      parteParametros = parteParametros + "parameter k_bRNA" + pieza.name + "=" + pieza.k_bRNA + ";\n";
      parteParametros = parteParametros + "parameter k_uRNA" + pieza.name + "=" + pieza.k_uRNA + ";\n";
      parteParametros = parteParametros + "parameter k_y0" + pieza.name + "=(k_uRNA" + pieza.name + "+k_m" + pieza.name + ")/k_bRNA" + pieza.name + ";\n";

      parteParametros = parteParametros + "parameter k_m" + pieza.name + "=" + pieza.k_m + ";\n";
      parteParametros = parteParametros + "parameter d_m" + pieza.name + "=" + pieza.d_m + ";\n";

      parteParametros = parteParametros + "parameter k_" + pieza.name + "=" + pieza.k_ + ";\n";
      parteParametros = parteParametros + "parameter K_" + pieza.name + "=k_" + pieza.name + "*Cn" + pieza.name + "*(k_m" + pieza.name + "/d_m" + pieza.name + ");\n";
      parteParametros = parteParametros + "parameter CrnaPOLfree" + pieza.name + "=" + pieza.CrnaPOLfree + ";\n";

      //Ecuaciones
      parteEcuaciones = parteEcuaciones + "null => " + pieza.name + ";  K_" + pieza.name + "*((CrnaPOLfree"+pieza.name+"/k_y0" + pieza.name + ")+(CrnaPOLfree"+pieza.name+"/k_y" + pieza.name + ")*(" + pieza.dependency1 + "/k_n" + pieza.name + "1)*(" + pieza.dependency2 + "/k_n" + pieza.name + "2))/(1+(CrnaPOLfree"+pieza.name+"/k_y0" + pieza.name + ")+(" + pieza.dependency1 + "/k_n";
      parteEcuaciones = parteEcuaciones + pieza.name + "1)*(1+(" + pieza.dependency2 + "/k_n" + pieza.name + "2)*(1+CrnaPOLfree"+pieza.name+"/k_y" + pieza.name + ")))\n";
      parteEcuaciones = parteEcuaciones + pieza.name + " -> null; d_" + pieza.name + "=null;\n\n\n";


      // Posibilidad IndTwoO

    } else if (pieza.type == "IndTwoO") {

      if(!pieza.name) {pieza.name = "Noname-" + i;}
      if(!pieza.CrnaPOLfree) {pieza.CrnaPOLfree = 0}
      if(!pieza.Cn) {pieza.Cn = 0}
      if(!pieza.k_bF1) {pieza.k_bF1 = 0}
      if(!pieza.k_uF1) {pieza.k_uF1 = 0}
      if(!pieza.k_bF2) {pieza.k_bF2 = 0}
      if(!pieza.k_uF2) {pieza.k_uF2 = 0}
      if(!pieza.k_bF1_F2op) {pieza.k_bF1_F2op = 0}
      if(!pieza.k_uF1_F2op) {pieza.k_uF1_F2op = 0}
      if(!pieza.k_bF2_F1op) {pieza.k_bF2_F1op = 0}
      if(!pieza.k_uF2_F1op) {pieza.k_uF2_F1op = 0}
      if(!pieza.k_bY_) {pieza.k_bY_ = 0}
      if(!pieza.k_uY_) {pieza.k_uY_ = 0}
      if(!pieza.k_bY_F1op) {pieza.k_bY_F1op = 0}
      if(!pieza.k_uY_F1op) {pieza.k_uY_F1op = 0}
      if(!pieza.k_bY_F2op) {pieza.k_bY_F2op = 0}
      if(!pieza.k_uY_F2op) {pieza.k_uY_F2op = 0}
      if(!pieza.k_bY_F12op) {pieza.k_bY_F12op = 0}
      if(!pieza.k_uY_F12op) {pieza.k_uY_F12op = 0}
      if(!pieza.k_m) {pieza.k_m = 0}
      if(!pieza.d_m) {pieza.d_m = 0}
      if(!pieza.k_) {pieza.k_ = 0}
      if(!pieza.dependency1) {pieza.dependency1 = 0}
      if(!pieza.dependency2) {pieza.dependency2 = 0}


      // Parametros
      parteParametros = parteParametros + "parameter Cn" + pieza.name + "=" + pieza.Cn + ";\n";

      parteParametros = parteParametros + "parameter k_bF1" + pieza.name + "=" + pieza.k_bF1 + ";\n";
      parteParametros = parteParametros + "parameter k_uF1" + pieza.name + "=" + pieza.k_uF1 + ";\n";

      parteParametros = parteParametros + "parameter k_bF2" + pieza.name + "=" + pieza.k_bF2 + ";\n";
      parteParametros = parteParametros + "parameter k_uF2" + pieza.name + "=" + pieza.k_uF2 + ";\n";

      parteParametros = parteParametros + "parameter k_bF1_F2op" + pieza.name + "=" + pieza.k_bF1_F2op + ";\n";
      parteParametros = parteParametros + "parameter k_uF1_F2op" + pieza.name + "=" + pieza.k_uF1_F2op + ";\n";

      parteParametros = parteParametros + "parameter k_bF2_F1op" + pieza.name + "=" + pieza.k_bF2_F1op + ";\n";
      parteParametros = parteParametros + "parameter k_uF2_F1op" + pieza.name + "=" + pieza.k_uF2_F1op + ";\n";

      parteParametros = parteParametros + "parameter k_bY_" + pieza.name + "=" + pieza.k_bY_ + ";\n";
      parteParametros = parteParametros + "parameter k_uY_" + pieza.name + "=" + pieza.k_uY_ + ";\n";
      parteParametros = parteParametros + "parameter k_bY_F1op" + pieza.name + "=" + pieza.k_bY_F1op + ";\n";
      parteParametros = parteParametros + "parameter k_uY_F1op" + pieza.name + "=" + pieza.k_uY_F1op + ";\n";
      parteParametros = parteParametros + "parameter k_bY_F2op" + pieza.name + "=" + pieza.k_bY_F2op + ";\n";
      parteParametros = parteParametros + "parameter k_uY_F2op" + pieza.name + "=" + pieza.k_uY_F2op + ";\n";
      parteParametros = parteParametros + "parameter k_bY_F12op" + pieza.name + "=" + pieza.k_bY_F12op + ";\n";
      parteParametros = parteParametros + "parameter k_uY_F12op" + pieza.name + "=" + pieza.k_uY_F12op + ";\n";

      parteParametros = parteParametros + "parameter k_m" + pieza.name + "=" + pieza.k_m + ";\n";
      parteParametros = parteParametros + "parameter d_m" + pieza.name + "=" + pieza.d_m + ";\n";

      parteParametros = parteParametros + "parameter k_" + pieza.name + "=" + pieza.k_ + ";\n";
      parteParametros = parteParametros + "parameter CrnaPOLfree" + pieza.name + "=" + pieza.CrnaPOLfree + ";\n";

      parteParametros = parteParametros + "parameter k_y0" + pieza.name + "= (k_uY_" + pieza.name + " + k_m" + pieza.name + ")/k_bY_" + pieza.name + ";\n";
      parteParametros = parteParametros + "parameter k_y1" + pieza.name + "= (k_uY_F1op" + pieza.name + " + k_m" + pieza.name + ")/k_bY_F1op" + pieza.name + ";\n";
      parteParametros = parteParametros + "parameter k_y2" + pieza.name + "= (k_uY_F2op" + pieza.name + " + k_m" + pieza.name + ")/k_bY_F2op" + pieza.name + ";\n";
      parteParametros = parteParametros + "parameter k_y12" + pieza.name + "= (k_uY_F12op" + pieza.name + " + k_m" + pieza.name + ")/k_bY_F12op" + pieza.name + ";\n";


      parteParametros = parteParametros + "parameter k_bu1234" + pieza.name + "= (k_bF1" + pieza.name + " *k_bF2_F1op" + pieza.name + ")/(k_uF1" + pieza.name + "+k_bF2_F1op" + pieza.name + "*" + pieza.dependency2 + ") + (k_bF2" + pieza.name + "*k_bF1_F2op" + pieza.name + ")/(k_uF2" + pieza.name + "+k_bF1_F2op" + pieza.name + "*";
      parteParametros = parteParametros + pieza.dependency1 + ");\n";

      parteParametros = parteParametros + "parameter k_24" + pieza.name + "= (k_bF1_F2op" + pieza.name + "*k_uF1_F2op" + pieza.name + ")/(k_uF2" + pieza.name + "+k_bF1_F2op" + pieza.name + "*" + pieza.dependency1 + ");\n";
      parteParametros = parteParametros + "parameter k_13" + pieza.name + "= (k_bF2_F1op" + pieza.name + "*k_uF2_F1op" + pieza.name + ")/(k_uF1" + pieza.name + "+k_bF2_F1op" + pieza.name + "*" + pieza.dependency2 + ");\n";
      parteParametros = parteParametros + "parameter k_1234" + pieza.name + "= k_bu1234" + pieza.name + " / (k_uF2_F1op" + pieza.name + "+ k_uF1_F2op" + pieza.name + "-" + pieza.dependency1 + "*k_24" + pieza.name + "-" + pieza.dependency2 + "*k_13" + pieza.name + ");\n";
      parteParametros = parteParametros + "parameter k_1" + pieza.name + "= (k_bF1" + pieza.name + "+" + pieza.dependency2 + "*k_1234" + pieza.name + "*k_uF2_F1op" + pieza.name + ")/(k_uF1" + pieza.name + "+k_bF2_F1op" + pieza.name + "*" + pieza.dependency2 + ");\n";
      parteParametros = parteParametros + "parameter k_2" + pieza.name + "= (k_1234" + pieza.name + "*(k_uF2_F1op" + pieza.name + "+k_uF1_F2op" + pieza.name + ") - ((k_bF1" + pieza.name + "+" + pieza.dependency2 + "*k_1234" + pieza.name + "*k_uF2_F1op" + pieza.name + ")/(k_uF1" + pieza.name + "+k_bF2_F1op" + pieza.name + "*";
      parteParametros = parteParametros + pieza.dependency2 + ")))/(k_bF1_F2op" + pieza.name + ");\n";
      parteParametros = parteParametros + "parameter K_" + pieza.name + "=k_" + pieza.name + "(k_m" + pieza.name + "/d_m" + pieza.name + ")*Cn" + pieza.name + ";\n";

      //Ecuaciones
      parteEcuaciones = parteEcuaciones + "null => " + pieza.name + "; K_" + pieza.name + "*((1/k_y0" + pieza.name + "*CrnaPOLfree"+pieza.name+" + (1/k_y12" + pieza.name + ")*CrnaPOLfree"+pieza.name+"*" + pieza.dependency1 + "*" + pieza.dependency2 + "*k_1234" + pieza.name + " + (1/k_y1" + pieza.name + ")*CrnaPOLfree"+pieza.name+"*" + pieza.dependency1 + "*k_1 + (1/k_y2" + pieza.name;
      parteEcuaciones = parteEcuaciones + ")*CrnaPOLfree"+pieza.name+"*" + pieza.dependency2 + "*k_2" + pieza.name + ")/(1+" + pieza.dependency1 + "*k_1" + pieza.name + "+" + pieza.dependency2 + "*k_2" + pieza.name + "+" + pieza.dependency1 + "*" + pieza.dependency2 + "*k_1234" + pieza.name + " + (1/k_y0" + pieza.name + "*CrnaPOLfree"+pieza.name;

      parteEcuaciones = parteEcuaciones + "+ (1/k_y12";
      parteEcuaciones = parteEcuaciones + "*CrnaPOLfree"+pieza.name+"*" + pieza.dependency1 + "*" + pieza.dependency2 + "*k_1234" + pieza.name +" + (1/k_y1" + pieza.name + ")*CrnaPOLfree"+pieza.name+"*" + pieza.dependency1 + "*k_1" + pieza.name + "+ (1/k_y2" + pieza.name + ")*CrnaPOLfree"+pieza.name+"*" + pieza.dependency2 + "*k_2);\n";
      parteEcuaciones = parteEcuaciones + pieza.name + " -> null; d_" + pieza.name + "=null;\n\n\n";

    }
  };

  var text = parteParametros + parteEcuaciones;
  var name = new ObjectID();
  var direction =  __dirname.substring(0, __dirname.indexOf('app/bll')) + 'public/model_docs/' + name + ".eqn";
  var direction_scripts =   __dirname.substring(0, __dirname.indexOf('app/bll')) + 'python/sencillo.py';

  fs.writeFile(direction, text, function(err) {
    if(err) {
      return console.log(err);
    }
    var spawn = require("child_process").spawn;
    var process = spawn('python',[direction_scripts, "-m", direction]);
  });

  return name;

};
