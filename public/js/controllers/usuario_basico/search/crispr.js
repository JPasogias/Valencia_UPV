plantcoApp.controller('crisprSearchController', function (
  $scope,
  $http,
  $window,
  crisprElementsService,
  img64Service
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }
  function intersectionObjects2(a, b, areEqualFunction) {
    var results = [];

    for(var i = 0; i < a.length; i++) {
        var aElement = a[i];
        var existsInB = _.any(b, function(bElement) { return areEqualFunction(bElement, aElement); });

        if(existsInB) {
            results.push(aElement);
        }
    }

    return results;
}
  function intersection_destructive(a, b){
    var results = arguments[0];
    var lastArgument = arguments[arguments.length - 1];
    var arrayCount = arguments.length;
    var areEqualFunction = _.isEqual;

    if(typeof lastArgument === "function") {
        areEqualFunction = lastArgument;
        arrayCount--;
    }

    for(var i = 1; i < arrayCount ; i++) {
        var array = arguments[i];
        results = intersectionObjects2(results, array, areEqualFunction);
        if(results.length === 0) break;
    }

    return results;
  }
  $scope.resultsTable = [];
  function clearTable(array) {
    array = array.filter(function (este, i) {
        return array.indexOf(este) == i;
      });

    for (var i in array) {
      array[i].openRow = false;
      if (i == 0) {
        array[i].openRow = true;
      }
    }
    return array;
  }

  $scope.init = function (user) {
    $scope.user = user;
  };

  $scope.showData = false;

  $scope.showmore = function (element) {
    crisprElementsService.findPossibleCrispr(element.geneSequence)
      .then(function (data) {
        $scope.fastaText = element.geneSequence;
        $scope.header = data.header;
        $scope.dna = data.dna;
        $scope.dnaReverse = data.dnaReverse;
        $scope.crisprs = generateTable(data.crisprs);
        $scope.showData = true;
        $scope.crisprsSelected = {
          geneName : element.geneName,
          phenotypicTrait : element.phenotypicTrait,
          commonName: element.commonName,
          species: element.species,
        };


      })
      .catch(serverError);

  }

  $scope.search = function () {
    $scope.resultsTable = [];

        if ($scope.valuesearch1 && !$scope.valuesearch2 && !$scope.valuesearch3) {
          crisprElementsService.getByNameAndSpecie($scope.valuesearch1)
          .then(function (data) {
            $scope.resultsTable = $scope.resultsTable.concat(data);
            $scope.resultsTable = clearTable($scope.resultsTable);
            $scope.results = true;
          })
          .catch(serverError);
          return;
        }

        if ($scope.valuesearch2 && !$scope.valuesearch1 && !$scope.valuesearch3) {
          crisprElementsService.getByPhenotypic($scope.valuesearch2)
          .then(function (data) {
            $scope.resultsTable = $scope.resultsTable.concat(data);
            $scope.resultsTable = clearTable($scope.resultsTable);
            $scope.results = true;
          })
          .catch(serverError);
          return;
        }

        if ($scope.valuesearch3 && !$scope.valuesearch1 && !$scope.valuesearch2) {
          crisprElementsService.getByGeneName($scope.valuesearch3)
          .then(function (data) {
            $scope.resultsTable = $scope.resultsTable.concat(data);
            $scope.resultsTable = clearTable($scope.resultsTable);
            $scope.results = true;
          })
          .catch(serverError);
          return;
        }
    if (!$scope.valuesearch1 && !$scope.valuesearch2 && !$scope.valuesearch3) {
      crisprElementsService.getAll()
      .then(function (data) {
        $scope.resultsTable = $scope.resultsTable.concat(data);
        $scope.resultsTable = clearTable($scope.resultsTable);
        $scope.results = true;
      })
      .catch(serverError);
      return;
    }

    if ($scope.valuesearch1 && $scope.valuesearch2 && !$scope.valuesearch3) {
      crisprElementsService.getByNameAndSpecie($scope.valuesearch1)
      .then(function (data) {
        $scope.resultsTable1 = data;
        crisprElementsService.getByPhenotypic($scope.valuesearch2)
        .then(function (data) {
          $scope.resultsTable2 = data;
          $scope.resultsTable = intersection_destructive($scope.resultsTable1, $scope.resultsTable2);
          $scope.resultsTable = clearTable($scope.resultsTable);
          $scope.results = true;
        })
        .catch(serverError);
      })
      .catch(serverError);
      return;
    }

    if ($scope.valuesearch1 && $scope.valuesearch3 && !$scope.valuesearch2) {
      crisprElementsService.getByNameAndSpecie($scope.valuesearch1)
      .then(function (data) {
        $scope.resultsTable1 = data;
        crisprElementsService.getByGeneName($scope.valuesearch3)
        .then(function (data) {
          $scope.resultsTable2 = data;
          $scope.resultsTable = intersection_destructive($scope.resultsTable1, $scope.resultsTable2);
          $scope.resultsTable = clearTable($scope.resultsTable);
          $scope.results = true;
        })
        .catch(serverError);
      })
      .catch(serverError);
      return;
    }

    if ($scope.valuesearch2 && $scope.valuesearch3 && !$scope.valuesearch1) {
      crisprElementsService.getByPhenotypic($scope.valuesearch2)
      .then(function (data) {
        $scope.resultsTable1 = data;
        crisprElementsService.getByGeneName($scope.valuesearch3)
        .then(function (data) {
          $scope.resultsTable2 = data;
          $scope.resultsTable = intersection_destructive($scope.resultsTable1, $scope.resultsTable2);
          $scope.resultsTable = clearTable($scope.resultsTable);
          $scope.results = true;
        })
        .catch(serverError);
      })
      .catch(serverError);
      return;
    }

  };



  function getHTMLResults(string, pointer) {
    var lines = [];

    for (var i = 0; i < string.length; i = i + 70) {
      lines.push(string.substring(i, i + 70));
    }

    var line = Math.floor(pointer / 70);
    var pointerStrart = pointer % 70;
    var pointerEnd = pointerStrart + 20 + 3;
    if (pointerEnd < 70) {
      lines[line] = lines[line].substring(0, pointerStrart) +
                    '<strong>' +
                    lines[line].substring(pointerStrart, pointerEnd) +
                    '</strong>' +
                    lines[line].substring(pointerEnd);
    }else {
      lines[line] = lines[line].substring(0, pointerStrart) +
                    '<strong>' +
                    lines[line].substring(pointerStrart);
      line = line + 1;
      pointerEnd = pointerEnd - 70;
      lines[line] = lines[line].substring(0, pointerEnd) +
                    '</strong>' +
                    lines[line].substring(pointerEnd);
    }

    return fromArrayToHTML(lines);

  }
function generateTable(crisprs) {

  for (var c in crisprs) {
    crisprs[c].openRow = false;
    if (c == 0) {
      $scope.idSelectedVote = crisprs[c].id;
      crisprs[c].openRow = true;
    }

    if (crisprs[c].ebra === 'strandForward') {
      crisprs[c].innerHTML = getHTMLResults($scope.dna, crisprs[c].position);
    }else {
      crisprs[c].innerHTML = getHTMLResults($scope.dna, $scope.dna.length - crisprs[c].position - 23);
    }
  }

  return crisprs;
}


function fromArrayToHTML(array) {
  var result = '<p>';
  for (var i = 0; i < array.length; i++) {
    result = result + array[i] + '<br/>';
  }

  return result + '</p>';
}
function getdnaSequence() {
  var array = [];
  var array2 = [
    { text: '', style: 'gene', alignment: 'center' },
    { text: $scope.fastaText, style: 'gene', alignment: 'left' },
    { text: '', style: 'gene', alignment: 'center' },
  ];

  array.push(array2);

  return array;
}

function getTables() {
  var array = [];
  var array2 = [
    { text: 'gRNA', style: 'tableHeader', alignment: 'center' },
    { text: 'Score', style: 'tableHeader', alignment: 'center' },
    { text: '', style: 'tableHeader', alignment: 'center' },
    { text: '', style: 'tableHeader', alignment: 'center' },
    { text: '', style: 'tableHeader', alignment: 'center' },
    { text: '', style: 'tableHeader', alignment: 'center' },
    { text: '', style: 'tableHeader', alignment: 'center' },
    { text: 'Strand', style: 'tableHeader', alignment: 'center' }, ];

  array.push(array2);

  for (var i in $scope.crisprs) {
    if (i % 2 == 0) {
      stylerow = 'tableRow1';
    }else {
      stylerow = 'tableRow2';
    }

    array2 = [
      { text: $scope.crisprs[i].crispr.toString(),  style: stylerow, alignment: 'center' },
      { text: $scope.crisprs[i].score.toString(),  style: stylerow, alignment: 'center' },
      { image: '', width: 25,  style: stylerow, alignment: 'center' },
      { image: '', width: 25,  style: stylerow, alignment: 'center' },
      { image: '', width: 25,  style: stylerow, alignment: 'center' },
      { image: '', width: 25,  style: stylerow, alignment: 'center' },
      { image: '', width: 25,  style: stylerow, alignment: 'center' },
      { text: $scope.crisprs[i].ebra.toString(), style: stylerow, alignment: 'center' },
    ];

    // final-high.png
    // $scope.crisprs[i].scores.arround == 0"
    // final-medium.png
    // $scope.crisprs[i].scores.arround == 1"
    if ($scope.crisprs[i].scores.arround == 0) {
      array2[2].image = img64Service.finalH();
    }else {
      array2[2].image = img64Service.finalM();
    }

    // position-high.png
    // $scope.crisprs[i].scores.position == 0"
    // position-low.png
    // $scope.crisprs[i].scores.position == 0.5"
    // position-medium.png
    // $scope.crisprs[i].scores.position == 1"
    if ($scope.crisprs[i].scores.position == 0) {
      array2[3].image = img64Service.positionH();
    }else if ($scope.crisprs[i].scores.position == 0.5) {
      array2[3].image = img64Service.positionL();
    }else {
      array2[3].image = img64Service.positionM();
    }


    // dna-high.png
    // $scope.crisprs[i].scores.pam == 0"
    // dna-low.png
    // $scope.crisprs[i].scores.pam == 0.5"
    // dna-medium.png
    // $scope.crisprs[i].scores.pam == 1"
    if ($scope.crisprs[i].scores.pam == 0) {
      array2[4].image = img64Service.dnaH();
    }else if ($scope.crisprs[i].scores.pam == 0.5) {
      array2[4].image = img64Service.dnaL();
    }else {
      array2[4].image = img64Service.dnaM();
    }


    // diana-high.png
    // $scope.crisprs[i].scores.concentracion == 0"
    // diana-low.png
    // $scope.crisprs[i].scores.concentracion == 0.5"
    // diana-medium.png
    // $scope.crisprs[i].scores.concentracion == 1"
    if ($scope.crisprs[i].scores.concentracion == 0) {
      array2[5].image = img64Service.dianaH();
    }else if ($scope.crisprs[i].scores.concentracion == 0.5) {
      array2[5].image = img64Service.dianaL();
    }else {
      array2[5].image = img64Service.dianaM();
    }

    // symmetry-high.png
    // $scope.crisprs[i].scores.simetrias <= 0.25"
    // symmetry-low.png
    // $scope.crisprs[i].scores.simetrias > 0.25 && $scope.crisprs[i].scores.simetrias < 0.75"
    // symmetry-medium.png
    // $scope.crisprs[i].scores.simetrias >= 0.75"
    if ($scope.crisprs[i].scores.simetrias <= 0.2) {
      array2[6].image = img64Service.symmetryH();
    }else if ($scope.crisprs[i].scores.simetrias > 0.25 && $scope.crisprs[i].scores.simetrias < 0.75) {
      array2[6].image = img64Service.symmetryL();
    }else {
      array2[6].image = img64Service.symmetryM();
    }

    array.push(array2);

    array2 = [
      { text: '' +
      '\ngRNA + Golden Braid overhangs:' +
      '\n-   Forward: ' +  $scope.crisprs[i].grna.grnaStrandForwardGB +
      '\n-   Reverse: ' +  $scope.crisprs[i].grna.grnaStrandReverseGB +
      '\n\nPrimers:' +
      '\n-   Forward: ' +  $scope.crisprs[i].primers.strandForward +
      '\n-   Reverse: ' +  $scope.crisprs[i].primers.strandReverse +
      '\n\nPrimers + Golden Braid overhangs:' +
      '\n-   Forward: ' +  $scope.crisprs[i].primers.strandForwardGB +
      '\n-   Reverse: ' +  $scope.crisprs[i].primers.strandReverseGB +
      '\n\nTarget consensus + plantco overhangs:' +
      '\n-   Forward: ' +  $scope.crisprs[i].targetconsensus.strandForwardGB +
      '\n-   Reverse: ' +  $scope.crisprs[i].targetconsensus.strandReverseGB +
      '\n\nTarget Knockout:' +
      '\n-   Forward: ' +  $scope.crisprs[i].targetknockout.strandForwardGB +
      '\n-   Reverse: ' +  $scope.crisprs[i].targetknockout.strandReverseGB +
      '\n\n',
      style: stylerow, alignment: 'left', colSpan: 7, },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },
      { text: '', style: stylerow, alignment: 'center' },

    ];
    array.push(array2);
  }

  return array;
}

function formattedDate(date) {
  var d = new Date(date || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('/');
}

// playground requires you to assign document definition to a variable called dd
$scope.dd = {
  content: [
    {
      image: img64Service.getlogo(),
      width: 100,
    }, {
      stack: [
          'Optimal guide RNA chosen for gene editing', {
              text: 'Primers needed for amplification of the region and synthesis of gRNA',
              style: 'subheader',
            },
      ],
      style: 'header',
    }, {
      text: [
          'In this document it is shown the optimal guide RNA according to the scoring system designed by the Valencia UPV iGEM team. Other gRNAs are shown in order according to their score. The scoring system is based in the following parameters:\n\n',
      ],
      style: 'plaintext',
    },
    {
      style: 'tableExample',
      table: {
          body: [
              [
                {
                  image: img64Service.final(),
                  width: 15,
                },
                {
                ul: [
                  'Final nucleotide: if the PAM of the gRNA is followed by a T, its score is higher.',
                ],
                style: 'plaintext',
              }
             ],
              [
                {
                  image: img64Service.position(),
                  width: 15,
                },
                {
                ul: [
                  'Position: gRNAs which are more upstream in the gene have a higher score. Mutations produced upstream on the gene by CRISPR/Cas9 will produce with a higher probability a non-functional protein.',
                ],
                style: 'plaintext',
              }
             ],
              [
                {
                  image: img64Service.dna(),
                  width: 20,
                },
                {
                ul: [
                  'Gene composition: GC content in the gRNA equal to 50% gives the higher score. GC content between 30%-80% gives a medium score, and different GC content gives a low score.',
                ],
                style: 'plaintext',
              }
             ],
              [
                {
                  image: img64Service.diana(),
                  width: 15,
                },
                {
                ul: [
                  'PAM composition: the score according to the PAM composition is higher when it is CGG, and lower when it is AGG',
                ],
                style: 'plaintext',
              }
             ],
              [
                {
                  image: img64Service.symmetry(),
                  width: 15,
                },
                {
                ul: [
                  'Symmetry: gRNAs which are susceptible to form hairpin loops have a penalized scoring.\n ',
                ],
                style: 'plaintext',
              }
             ],
          ]
      },
      layout: 'noBorders'
    }, {
      text: [
          'Green color represents a good score, yellow a medium and red represents a bad score.\n\nFor more information about the scoring system, you can visit the Valencia UPV iGEM webpage (http://hypeit.cloudno.de)\n',
      ],
      style: 'plaintext',

    }, {
      text: '',
      margin: [0, 20],
    }, {
      pageBreak: 'before',
      text: [
          'This is the sequence of the gene of the query. (Date of search: ' + formattedDate(new Date()) + ')\n\n',
      ],
      style: 'plaintext',

    }, {
      style: 'tableExample',
      table: {
          widths: [20, 'auto', 20],
          headerRows: 1,
          body: [],
        },
      layout: 'noBorders',
      margin: [0, 20],
    }, {
      style: 'tableExample',
      table: {
          headerRows: 1,
          body: [],
        },
      layout: 'headerLineOnly',
      alignment: 'center',
      margin: [0, 20],
    }, {
      text: '',
      margin: [0, 20],
    }, {
      style: 'smallcaps',
      text: [
          'THIS SOFTWARE IS PROVIDED BY THE AUTHORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. IN NO EVENT SHALL THE AUTHORS,BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF DATA OR DATA BEING RENDERED INACCURATE; LOSS OF USE OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n',
      ],
    },
   ],
  styles: {
    gene: {
        fontSize: 10,
      },
    smallcaps: {
        fontSize: 6,
        alignment: 'justify',
      },
    plaintext: {
        fontSize: 10,
        alignment: 'justify',
      },
    header: {
        fontSize: 18,
        bold: true,
        alignment: 'right',
        margin: [0, 190, 0, 80],
      },
    subheader: {
        fontSize: 14,
      },
    superMargin: {
        margin: [20, 0, 40, 0],
        fontSize: 15,
      },
    tableHeader: {
        bold: true,
        fontSize: 10,
        fillColor: 'black',
        color: 'white',
      },
    tableRow1: {
        bold: true,
        fontSize: 9,
        color: 'black',
      },
    tableRow2: {
        bold: true,
        fontSize: 9,
        color: 'black',
        fillColor: '#fbfbfb',
      },
  },
};
$scope.openPdf = function () {
  $scope.dd.content[7].table.body = getdnaSequence();
  $scope.dd.content[8].table.body = getTables();
  pdfMake.createPdf($scope.dd).open();
};

$scope.downloadPdf = function () {
  $scope.dd.content[7].table.body = getdnaSequence();
  $scope.dd.content[8].table.body = getTables();
  pdfMake.createPdf($scope.dd).download();
};
});
