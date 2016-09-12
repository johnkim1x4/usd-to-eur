$( () => {
  var moment = require('moment');
  var rates = [];
  var show = 5;
  var currentRate;

  var $moreBtn = $("#rate-history-more");
  var $form = $("#converter");

  $("#converter input[type='text']").focus();

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
        $boxLi.addClass("box normal");
      }
      var date = rates[i].date;
      $boxLi.html("<span class='rate-date'>" + date + "</span>");

      var $infoUl = $("<ul></ul>");

      var $rateLi = $("<li></li>");
      $rateLi.addClass("rate-conversion");
      $rateLi.text(`1 USD = ${rates[i].rate} EUR`);

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

      $(".loader").hide();
      $moreBtn.text("Show More");
      $moreBtn.prop("disabled",false);
    }
  }

  $form.on("submit", (e) => {
    e.preventDefault();
    var $historyLi = $("<li></li>");
    var $inputEl = $("#converter input[type='text']");
    var userInput = $inputEl.val();
    var $error;
    $inputEl.val("");

    if (userInput!=="" && !isNaN(userInput)) {
      $("#errors").children().remove();
      userInput = parseFloat(userInput);
      if (userInput < 0) {
        $error = $("<li>Please enter a positive USD amonut.</li>");
        $("#errors").append($error);
        return;
      }
      var result = userInput * currentRate;
      $historyLi.html(userInput.toFixed(2) + " USD <i class='fa fa-arrow-right'></i> " + result.toFixed(2) + " EUR");
      $historyLi.addClass("box");
      $historyLi.hide().fadeIn(800);
      $("#convert-history").prepend($historyLi);
    } else {
      $("#errors").children().remove();
      $error = $("<li>Please enter a valid number.</li>");
      $("#errors").append($error);
    }
  });

  $moreBtn.on("click", (e) => {
    $moreBtn.prop("disabled",true);
    $moreBtn.text("Loading...");
    $(".loader").show();
    show += 5;
    getHistory(rates[rates.length-1].date);
  });
});
