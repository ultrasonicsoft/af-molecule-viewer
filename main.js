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
  console.log(atoms)
  atoms.vertices.forEach((position, i) => {
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', position.x + " " + position.y + " " + position.z)
    sphere.setAttribute('radius', "0.4")
    sphere.setAttribute('shadow', true)
    sphere.setAttribute('color', rgbToHex(atoms.colors[i]))
    sphere.setAttribute('cursor-listener', 'on: mouseenter;');
    sphere.setAttribute('data-index', index);
    sphere.setAttribute('id', 'sphere-' + index);
    sphere.setAttribute('event-set__enter', `_event: mouseenter; _target: #cylinderText; visible: true; value:${atoms.elements[i]} Atom`);

    sphere.setAttribute('event-set__leave', "_event: mouseleave; _target: #cylinderText; visible: true");
    index++;
    scene.appendChild(sphere);

    const text = document.createElement('a-text');
    text.setAttribute('id', 'atom-' + index);
    text.setAttribute('position', position.x + " " + position.y + " " + position.z + 0.4);
    text.setAttribute('value', atoms.elements[i]);
    text.setAttribute('color', 'yellow');
    scene.appendChild(text);
  })


  for (let i = 0; i < bonds.vertices.length; i = i + 2) {
    const start = bonds.vertices[i]
    const end = bonds.vertices[i + 1]
    const line = document.createElement('a-entity');
    line.setAttribute('line', "start: " + start.x + ", " + start.y + ", " + start.z + "; " + "end: " + end.x + ", " + end.y + ", " + end.z + "; color: white")
    scene.appendChild(line);
  }

  AFRAME.registerComponent('cursor-listener', {
    schema: {
      on: { type: 'string' },
      target: { type: 'selector' },
      src: { type: 'string' },
      dur: { type: 'number', default: 300 }
    },
    init: function () {
      console.log('event registered....');
      var lastIndex = -1;
      var COLORS = ['red', 'green', 'blue'];
      this.el.addEventListener('mouseenter', function (evt) {
        // const label = document.getElementById('txtLabel');
        // const dataIndex = this.getAttribute("data-index");
        // const value = `value: Selected Atom:${atoms.elements[dataIndex]}; color:black`
        // label.setAttribute('text', value);
        console.log('event fired on ....', this.getAttribute("data-index"));
        // lastIndex = (lastIndex + 1) % COLORS.length;
        // this.setAttribute('material', 'color', COLORS[lastIndex]);
        console.log('I was clicked at: ', evt.detail.intersection.point);
      });
    }
  });
});

