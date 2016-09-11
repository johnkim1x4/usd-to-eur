$( () => {
  var moment = require('moment');
  $("#time").text(moment().format());
});
