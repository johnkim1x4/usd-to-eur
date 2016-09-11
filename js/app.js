$( () => {
  var moment = require('moment');
  var rates = [];
  var show = 5;

  (function getToday() {
    $.get({
      url: `http://api.fixer.io/latest?base=USD`,
      success(payload) {
        rates.push({date: payload.date, rate: payload.rates["EUR"]});
        getHistory(payload.date);
      }
    });
  })()

  function getHistory(date) {
    date = moment(date.replace(/-/g,"")).subtract(1, 'days').format('YYYY-MM-DD');
    $.get({
      url: `http://api.fixer.io/${date}?base=USD`,
      success(payload) {
        rates.push({date: payload.date, rate: payload.rates["EUR"]});
        if (rates.length < show + 1) {
          getHistory(payload.date);
        } else {
          renderHistory();
        }
      }
    });
  }

  function renderHistory() {
    for (var i = show - 5; i < show; i++) {
      var $boxLi = $("<li></li>");
      $boxLi.addClass("box");
      var date = rates[i].date;
      $boxLi.text(date);

      var $infoUl = $("<ul></ul>");

      var $rateLi = $("<li>" + rates[i].rate + "</li>");
      $rateLi.addClass("rate-conversion");

      var $changeLi = $("<li></li>");
      var diff = rates[i+1].rate - rates[i].rate;
      $changeLi.addClass("rate-change");
      if (diff >= 0) {
        $changeLi.addClass("pos");
      } else {
        $changeLi.addClass("neg");
      }
      $changeLi.text(diff.toFixed(4));

      $infoUl.append($rateLi);
      $infoUl.append($changeLi);
      $boxLi.append($infoUl);
      $("ul#rate-history").append($boxLi);
    }
  }

  $("#rate-history-more").on("click", (e) => {
    show += 5;
    getHistory(rates[rates.length-1].date);
  });

  // <li class="box">
  //   <ul>
  //     <li class="rate-conversion"></li>
  //     <li class="rate-change"></li>
  //   </ul>
  // </li>
});
