var toInkscapeFromBabylon = 4.045;
var holeDeviationInInkscape = 7.25;
var gearCenterRadiusInInkscape = 2.291;
var pegCenterRadiusInInkscape = 2.18;
var rimRadiusInInkscape = 155;

var renderSvg = document.getElementById('renderSvg');
renderSvg.setAttributeNS(null, 'height', 150);
renderSvg.setAttributeNS(null, 'width', 200);

var svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
svg.setAttributeNS(null, 'id', "overall");

var transformString = "translate(0, 0) scale(1, 1)";
svg.setAttributeNS(null, 'transform', transformString);

renderSvg.appendChild(svg);

for (var i = 0; i < 50; i++) {
    addRadialLineAsChild(svg, 3 * gearCenterRadiusInInkscape * i, 0, 4 * gearCenterRadiusInInkscape);
}

function addRadialLineAsChild(parent, x, y1, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttributeNS(null, 'x1', x);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x);
    line.setAttributeNS(null, 'y2', y2);

    line.setAttributeNS(null, 'style', "fill:none;stroke:#000000;stroke-width:0.0127");

    parent.appendChild(line);
}