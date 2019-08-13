const loader = new THREE.PDBLoader();

function toHex(value) {
  var hex = (value * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex({ r, g, b }) {
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

loader.load('https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/models/molecules/caffeine.pdb', function (atoms, bonds) {
  const scene = document.querySelector('#scene');

  let index = 0;
  atoms.vertices.forEach((position, i) => {
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', position.x + " " + position.y + " " + position.z)
    sphere.setAttribute('radius', "0.4")
    sphere.setAttribute('shadow', true)
    sphere.setAttribute('color', rgbToHex(atoms.colors[i]))
    sphere.setAttribute('cursor-listener', '');
    sphere.setAttribute('data-index', index);
    index++;
    scene.appendChild(sphere);
  })

  for (let i = 0; i < bonds.vertices.length; i = i + 2) {
    const start = bonds.vertices[i]
    const end = bonds.vertices[i + 1]
    const line = document.createElement('a-entity');
    line.setAttribute('line', "start: " + start.x + ", " + start.y + ", " + start.z + "; " + "end: " + end.x + ", " + end.y + ", " + end.z + "; color: black")
    scene.appendChild(line);
  }
}
);

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    console.log('event registered....');
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      const label = document.getElementById('txtLabel');
      const dataIndex = this.getAttribute("data-index");
      const value = `value: Selected Molecule:${dataIndex}; color:black`
      label.setAttribute('text', value);
      console.log('event fired on ....', this.getAttribute("data-index"));
      // lastIndex = (lastIndex + 1) % COLORS.length;
      // this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});