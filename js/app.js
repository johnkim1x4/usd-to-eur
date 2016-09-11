$( () => {
  var moment = require('moment');
  var rates = [];
  var show = 5;
  var currentRate;

  var $moreBtn = $("#rate-history-more");
  var $form = $("#converter");

  (function getToday() {
    $.get({
      url: `http://api.fixer.io/latest?base=USD`,
      success(payload) {
        currentRate = payload.rates["EUR"];
        rates.push({date: payload.date, rate: currentRate});
        getHistory(payload.date);
        // $("#converter input[type='text']").attr("placeholder", `1USD = ${currentRate}EUR`);
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
      if (i === 0) {
        $boxLi.addClass("box highlight");
      } else {
        $boxLi.addClass("box");
      }
      var date = rates[i].date;
      $boxLi.text(date);

      var $infoUl = $("<ul></ul>");

      var $rateLi = $("<li></li>");
      $rateLi.addClass("rate-conversion");
      $rateLi.text(`1USD = ${rates[i].rate}EUR`);

      var $changeLi = $("<li></li>");
      var diff = rates[i].rate - rates[i+1].rate;
      $changeLi.addClass("rate-change");
      if (diff >= 0) {
        $changeLi.addClass("pos");
      } else {
        $changeLi.addClass("neg");
      }
      $changeLi.text(diff.toFixed(5));

      $infoUl.append($rateLi);
      $infoUl.append($changeLi);
      $boxLi.append($infoUl);
      $("ul#rate-history").append($boxLi);

      $moreBtn.text("Show More");
      $moreBtn.prop("disabled",false);
    }
  }

  $form.on("submit", (e) => {
    e.preventDefault();
    var $historyLi = $("<li></li>");
    var $inputEl = $("#converter input[type='text']");
    var userInput = $inputEl.val();
    $inputEl.val("");

    if (!isNaN(userInput)) {
      userInput = parseFloat(userInput);
      var result = userInput * currentRate;
      $historyLi.text(`${userInput.toFixed(2)} USD => ${result.toFixed(2)} EUR`);
      $("#convert-history").prepend($historyLi);
    }
  });

  $moreBtn.on("click", (e) => {
    $moreBtn.prop("disabled",true);
    $moreBtn.text("Loading");
    show += 5;
    getHistory(rates[rates.length-1].date);
  });
});
