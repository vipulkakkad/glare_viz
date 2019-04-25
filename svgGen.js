var svg = document.getElementById('renderSvg');

var element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
element.setAttributeNS(null, 'x', 150);
element.setAttributeNS(null, 'y', 15);
var txt = document.createTextNode("Hello World");
element.appendChild(txt);
svg.appendChild(element);

GlareSim.Utilities.rotateWholeSetup(gameParameters, 90 * Math.PI/180);    

var edges = GlareSim.Utilities.computeAdjacencies(
    gameParameters,
    function(x1, y1, x2, y2, meshName) {
    });    

GlareSim.Utilities.setChiralityInBipartiteManner(gameParameters, edges);
GlareSim.Utilities.createGearIntrinsicsFromPegSpecs(gameParameters, edges);
GlareSim.Utilities.setHoleParameters(gameParameters);

function addCircleAsChild(parent, idString, cx, cy, r) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'id', idString);
    circle.setAttributeNS(null, 'cx', cx);
    circle.setAttributeNS(null, 'cy', cy);
    circle.setAttributeNS(null, 'r', r);

    circle.setAttributeNS(null, 'style', "fill:none;stroke:#000000;stroke-width:0.26458332");

    parent.appendChild(circle);
}

function addGearAsChild(document, parent, idString, size) {
    var gearPath = getGearPath(size);

    var gear = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gear.setAttributeNS(null, 'id', idString);
    gear.setAttributeNS(null, 'd', gearPath);
    gear.setAttributeNS(null, 'inkscape:connector-curvature', "0");

    circle.setAttributeNS(null, 'style', "fill:none;stroke:#000000;stroke-width:0.26458332");

    parent.appendChild(gear);
}

function getGearPath(size) {
    switch(size)
    {
        case "S":
            return "SMALL";
        case "M":
            return "MEDIUM";
        case "L":
            return "LARGE";
        case "XL":
            return "RIMSIZED";
        default: 
            return "WTF";        
    }
}