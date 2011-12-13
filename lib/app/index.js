var app = require('derby').createApp(module),
    get = app.get,
    view = app.view,
    ready = app.ready;

// ROUTES //
get('/', function (page) { page.redirect('/dual3nigma'); });

get('/:usuario', function(page, model, params) {

  // Suscribirse a las actualizaciones de este muro
  model.subscribe({ _wall: 'walls.'+params.usuario }, function() {

    // valores por defecto
    model.setNull('_wall.nombre', params.usuario);
    model.setNull('_wall.publicaciones', 
      [
        { texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.', fecha: 'jueves, 8 de diciembre a las 2:10'},
        { texto: ' Duis nec tortor est, a ornare erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.', fecha: 'miércoles, 7 de diciembre a las 21:30'}
      ]
    );

    // renderear la página
    page.render();
  });
});


// CONTROLLER FUNCTIONS //
ready(function(model) {
  exports.publicar = function () {
    // lo que se va a publicar
    var texto = view.htmlEscape(model.get('_nuevaPublicacion'));

    // prevenir publicar en blanco
    if(texto == '') return;

    // borrar el input
    model.set('_nuevaPublicacion', '');

    var hoy = new Date(), // la fecha de ahorita
      dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // agregar al principio
    model.insertBefore('_wall.publicaciones', 0, {
      texto: texto,
      // formato bonito
      fecha: dias[hoy.getDay()]+', '+hoy.getDate()+' de '+meses[hoy.getMonth()]+' a las '+hoy.getHours()+':'+hoy.getMinutes()
    });
  };
});
