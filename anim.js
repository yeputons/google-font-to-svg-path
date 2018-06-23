function calculatePositions(svg) {
  const result = [];
  $('path', svg).each(function(i, path) {
    result.push(path.getPointAtLength(0));
  });
  return result;
}

function animateAnagram(textBefore, textAfter, svgBefore, svgAfter, svgCurrentHolder) {
  textBefore = textBefore.replace(' ', '');
  textAfter = textAfter.replace(' ', '');

  svgCurrentHolder.innerHTML = svgBefore.outerHTML;
  const svgCurrent = $('svg', svgCurrentHolder)[0];

  const positionsBefore = calculatePositions(svgBefore);
  const positionsAfter = calculatePositions(svgAfter);

  console.log(textBefore.length, textAfter.length);

  const taken = new Array(textAfter.length);
  const offsetsX = [];
  const offsetsY = [];
  for (let i = 0; i < textBefore.length; i++) {
    let found = false;
    for (let j = 0; j < textAfter.length; j++)
      if (textBefore[i] == textAfter[j] && !taken[j]) {
        taken[j] = true;
        offsetsX.push(positionsAfter[j].x - positionsBefore[i].x);
        offsetsY.push(positionsAfter[j].y - positionsBefore[i].y);
        found = true;
        break;
      }
    console.assert(found);
  }

  $('g', svgCurrent)[0].setAttribute('fill', 'black');
  $('g', svgCurrent)[0].setAttribute('style', '');

  let maxYOff = 0;

  let paths = $('path', svgCurrent);
  for (let i = 0; i < textBefore.length; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    el.setAttribute('attributeName', 'transform');
    const ox = offsetsX[i], oy = offsetsY[i];
    let dx = -oy, dy = ox;
    if (Math.abs(ox) > 1e-5) {
      const d = Math.sqrt(dx * dx + dy * dy) / (Math.abs(ox) / 4);
      dx /= d;
      dy /= d;
    }
    const mid1x = ox / 2 - dx, mid1y = oy / 2 - dy;
    const mid2x = ox / 2 + dx, mid2y = oy / 2 + dy;

    maxYOff = Math.max(maxYOff, Math.abs(dy));

    el.setAttribute('path',
      'M 0 0 ' +
      'Q' + mid1x + ' ' + mid1y + ', ' + ox + ' ' + oy +
      'Q' + mid2x + ' ' + mid2y + ', ' + 0 + ' ' + 0);
    el.setAttribute('dur', '3s');
    el.setAttribute('repeatCount', 'indefinite');
    paths[i].append(el);
  }

  svgCurrent.viewBox.baseVal.x -= 30;
  svgCurrent.viewBox.baseVal.width += 60;
  svgCurrent.viewBox.baseVal.y -= maxYOff;
  svgCurrent.viewBox.baseVal.height += 2 * maxYOff;
}
