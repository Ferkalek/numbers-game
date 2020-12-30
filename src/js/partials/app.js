(function () {
  var $ = function (el) {
    return document.getElementById(el);
  };
  var $s = function (el) {
    return document.querySelectorAll(el);
  };
  var $o = function (el) {
    return document.querySelector(el);
  };

  var body = $o("body"),
    pageTitle = $o("title"),
    wrap = $("wrap"),
    overlay = $("overlay"),
    modal = $o(".modal"),
    modalMsg = $o(".modal-msg"),
    modalBtnWrap = $o(".modal-btn-wrap"),
    textError = "",
    delUserText = "",
    beforName = "",
    userName = $("name"),
    btnStart = $("btn-start"),
    startAgain = $s(".start-again"),
    cancelBtn = $o(".cancel-btn"),
    confirmBtn = $o(".confirm-btn"),
    showResults = $("show-results"),
    showSettings = $("show-settings"),
    btnBack = $s(".btn-back"),
    hereName = $s(".output-name-js"),
    newName = $("new-name"),
    editNameWrap = $("edit-name-wrap"),
    langBtn = $s('input[name="lang"]'),
    editNameBtn = $("edit-name"),
    headerOus = $("header-lg"),
    ugadano = $("ugadano"),
    nameste = $("nameste"),
    hiOus = $("hi-lg"),
    targetOus = $("target-lg"),
    targetAgainOus = $("target-again-lg"),
    bestResultOus = $("best-r-lg"),
    bestResult2Ous = $("best-r2-lg"),
    elemHistory = $("results-history"),
    elemHistory_2 = $("results-history-2"),
    typeNameOus = $("your-name-lg"),
    levelOus = $("level-lg"),
    ogTitle = $o('meta[property="og:title"]'),
    ogDescription = $o('meta[property="og:description"]'),
    levelBtn = $s('input[name="level"]'),
    btnDelUser = $("del-user"),
    display = $("display"),
    keyBtn = $s("#key button"),
    enterBtn = $("enter"),
    cleanBtn = $("clean"),
    vin = $("vin"),
    vinText = $("vin-text"),
    vinTextBest = "",
    vinTextBasic = "",
    result = $o(".result"),
    hasHistory = $("if-has-history"),
    hasHistory_2 = $("if-has-history-2"),
    choosNum = [],
    rand = [],
    countUg = 0,
    countNm = 0,
    td = new Date(),
    day = (td.getDate() < 10 ? "0" : "") + td.getDate(),
    month = (td.getMonth() + 1 < 10 ? "0" : "") + (td.getMonth() + 1),
    today = day + "." + month + "." + td.getFullYear();

  //проверяю есть ли пользователь или он открыл игру впервые
  var logined = localStorage.getItem("userGame") == null ? false : true;
  var userLang =
    localStorage.getItem("userLang") != null
      ? localStorage.getItem("userLang")
      : "en";
  var userLevel =
    localStorage.getItem("userLevel") != null
      ? localStorage.getItem("userLevel")
      : 3;
  if (localStorage.getItem("userLevel") == null) {
    localStorage.setItem("userLevel", "3");
  }

  if (logined) {
    //если пользователь есть:
    wrap.classList.add("auth"); //добавляю клас в главный враппер
    outputUserName(); //прописываю его имя
  }
  function outputUserName() {
    [].forEach.call(hereName, function (el) {
      el.innerText = localStorage.getItem("userGame");
    });
  }
  function addUser() {
    localStorage.setItem("userGame", userName.value);
  }

  btnDelUser.addEventListener("click", function () {
    customAlert("error-cl", delUserText, true);
  });

  confirmBtn.onclick = function () {
    calbackDelUser();
    closeModal();
  };

  function calbackDelUser() {
    body.classList.add("no-game");
    localStorage.clear();
    wrap.className = "main-wrap start-layout";
    userName.value = "";
    $("en").setAttribute("checked", "checked");
    $("s3").setAttribute("checked", "checked");
    userLevel = 3;
    localStorage.setItem("userLevel", "3");
    logined = false;
    hasHistory.classList.add("hidden");
    hasHistory_2.classList.add("hidden");
    elemHistory.innerHTML = "";
    elemHistory_2.innerHTML = "";
  }

  //загрузка языка
  loadLang();
  [].forEach.call(langBtn, function (el) {
    el.addEventListener("change", function () {
      localStorage.setItem("userLang", el.value);
      $o("html").setAttribute("lang", el.value);
      changTextByLang(el.value);
    });
  });
  function loadLang() {
    $(userLang).setAttribute("checked", "checked");
    $o("html").setAttribute("lang", userLang);
    changTextByLang(userLang);
  }
  function changTextByLang(vl) {
    var ol = langGl[vl];
    ogTitle.setAttribute("content", ol.ogTitle);
    pageTitle.innerText = ol.ogTitle;
    ogDescription.setAttribute("content", ol.target);
    headerOus.innerHTML = ol.header;
    hiOus.innerText = ol.hi;
    targetOus.innerText = ol.target;
    targetAgainOus.innerText = ol.targetAgain;
    bestResultOus.innerText = ol.bestResult;
    bestResult2Ous.innerText = ol.bestResult2;
    typeNameOus.innerText = ol.typeName;
    levelOus.innerText = ol.level;
    btnStart.innerText = ol.startBtn;
    btnDelUser.innerText = ol.delUser;
    ugadano.innerText = ol.ugadano;
    nameste.innerText = ol.nameste;
    textError = ol.tEr;
    delUserText = ol.dUser;
    vinTextBest = ol.tSu;
    vinTextBasic = ol.tCongr;
    startAgain[0].innerText = ol.startAgain;
    startAgain[1].innerText = ol.startAgain;
    cancelBtn.innerText = ol.cancelBtn;
    confirmBtn.innerText = ol.confirmBtn;
  }

  //загрузка уровня сложности
  $("s" + userLevel).setAttribute("checked", "checked");
  [].forEach.call(levelBtn, function (el) {
    el.addEventListener("change", function () {
      localStorage.setItem("userLevel", el.value);
      userLevel = el.value;
      if (rand.length > 0) {
        getRand();
        result.innerHTML = "";
        hideLayout(wrap, "settings-layout");
      }
    });
  });

  function hideLayout(spyEl, spyClass) {
    if (spyEl.classList.contains(spyClass)) {
      spyEl.classList.remove(spyClass);
      setTimeout(function () {
        overlay.style.display = "none";
      }, 500);
    }
  }

  function showLayout(spyEl, spyClass) {
    if (!spyEl.classList.contains(spyClass)) {
      overlay.style.display = "block";
      setTimeout(function () {
        spyEl.classList.add(spyClass);
      }, 100);
    }
  }

  showSettings.onclick = function () {
    showLayout(wrap, "settings-layout");
    loadHistory();
  };

  userName.onblur = function () {
    if (this.value != "") {
      this.classList.add("not-empty");
    }
    if (this.value == "" && this.classList.contains("not-empty")) {
      this.classList.remove("not-empty");
    }
  };

  //загрузка истории
  loadHistory();
  function loadHistory() {
    var resultHistory = JSON.parse(localStorage.getItem("result"));
    if (resultHistory !== null) {
      var elemCont = "";
      for (var key in resultHistory) {
        var dateilsResultHistory = resultHistory[key];
        elemCont +=
          '<div class="' + key + '"><i class="material-icons">star</i>';
        for (var key2 in dateilsResultHistory) {
          elemCont += "<span>" + dateilsResultHistory[key2] + "</span>";
        }
        elemCont += "</div>";
      }
      elemHistory.innerHTML = elemCont;
      elemHistory_2.innerHTML = elemCont;
      hasHistory.classList.remove("hidden");
      hasHistory_2.classList.remove("hidden");
    }
  }

  showResults.onclick = function () {
    showLayout(wrap, "results-layout");
  };

  [].forEach.call(btnBack, function (el) {
    el.addEventListener("click", function () {
      wrap.className = "main-wrap";
      setTimeout(function () {
        overlay.style.display = "none";
      }, 500);
    });
  });

  function customAlert(c_lass, msg, show_btn) {
    body.classList.add("show-modal");
    modal.classList.add(c_lass);
    modalMsg.innerText = msg;
    if (show_btn) {
      modalBtnWrap.classList.add("show-modal-btn");
    }
  }

  $o(".modal-overlay").onclick = function () {
    closeModal();
  };
  $o(".modal-close").onclick = function () {
    closeModal();
  };
  cancelBtn.onclick = function () {
    closeModal();
  };

  function closeModal() {
    body.classList.remove("show-modal");
    if (modalBtnWrap.classList.contains("show-modal-btn")) {
      modalBtnWrap.classList.contains("show-modal-btn");
    }
    if ($o(".modal").classList.contains("error-cl")) {
      $o(".modal").classList.remove("error-cl");
    }
  }

  overlay.onclick = function () {
    if (wrap.classList.contains("start-layout") && userName.value == "") {
      customAlert("error-cl", textError);
      return false;
    }
    var te = this;
    wrap.className = "main-wrap";
    setTimeout(function () {
      te.style.display = "none";
    }, 500);
  };

  //edit user name
  editNameBtn.addEventListener("click", function () {
    beforName = localStorage.getItem("userGame");
    editNameWrap.classList.add("iseditting");
    newName.value = localStorage.getItem("userGame");
    newName.focus();
  });
  newName.addEventListener("blur", function () {
    if (this.value !== "") {
      localStorage.setItem("userGame", this.value);
      this.value = "";
    } else {
      localStorage.setItem("userGame", beforName);
    }
    editNameWrap.classList.remove("iseditting");
    outputUserName();
  });

  //GAME
  //генерация рандомного числа с неповторяющимися цифрами внутри
  function getRand() {
    var unicZn = true;
    while (unicZn) {
      var rand1 = Math.round(Math.random() * 9),
        rand2 = Math.round(Math.random() * 9),
        rand3 = Math.round(Math.random() * 9),
        rand4 = Math.round(Math.random() * 9),
        rand5 = Math.round(Math.random() * 9);

      if (
        rand1 != rand2 &&
        rand1 != rand3 &&
        rand1 != rand4 &&
        rand1 != rand5 &&
        rand2 != rand3 &&
        rand2 != rand4 &&
        rand2 != rand5 &&
        rand3 != rand4 &&
        rand3 != rand5 &&
        rand4 != rand5
      ) {
        rand = [rand1, rand2, rand3, rand4, rand5];
        rand = rand.splice(0, userLevel);
        unicZn = false;
      }
    }
    console.log(rand);
  }

  function clickNumber(k) {
    var num = +k.target.innerHTML;

    if (isNaN(num)) return false;

    if (choosNum.length > userLevel - 1) return false;

    choosNum.push(num);

    if (choosNum.length == userLevel) enterBtn.removeAttribute("disabled");

    if (choosNum.length > 0) cleanBtn.removeAttribute("disabled");

    k.target.setAttribute("disabled", "disabled");
    display.value = choosNum.join("");
  }

  function clickEnter() {
    mainFunc();

    var elem = document.createElement("li");
    elem.innerHTML =
      "<span>" +
      countUg +
      "</span><span>" +
      countNm +
      "</span><span>" +
      choosNum.join("") +
      "</span>";

    clearInput();

    result.appendChild(elem);
    showLayout(wrap, "results-layout");

    if (countUg == countNm && countUg == userLevel) {
      vin.classList.add("is-vin");
      endFunc();
    }
  }

  function mainFunc() {
    //обнуление переменных для угаданых чисел и на местах
    countUg = 0;
    countNm = 0;

    for (var i = 0; i < userLevel; i++) {
      for (var j = 0; j < userLevel; j++) {
        //проверяем сколько угадано
        if (choosNum[i] == rand[j]) {
          countUg++;
        }
      }
      //проверка сколько на местах
      if (choosNum[i] == rand[i]) {
        countNm++;
      }
    }
  }

  function clearInput() {
    display.value = "";
    choosNum = [];

    cleanBtn.setAttribute("disabled", "disabled");
    enterBtn.setAttribute("disabled", "disabled");

    for (var i = 0; i < keyBtn.length; i++) {
      keyBtn[i].removeAttribute("disabled");
    }
  }

  function endFunc() {
    var level = "level_" + userLevel,
      oldResult = JSON.parse(localStorage.getItem("result")),
      newResult = {};

    body.classList.add("no-game");

    switch (userLevel) {
      case "3":
        newResult = {
          level_3: {
            countSteps: $s(".result li").length,
            date: today,
          },
        };
        break;
      case "4":
        newResult = {
          level_4: {
            countSteps: $s(".result li").length,
            date: today,
          },
        };
        break;
      case "5":
        newResult = {
          level_5: {
            countSteps: $s(".result li").length,
            date: today,
          },
        };
    }

    if (vin.classList.contains("best-result")) {
      vin.classList.remove("best-result");
    }
    vinText.innerText = vinTextBasic;

    if (oldResult !== null) {
      if (!oldResult[level]) {
        oldResult[level] = newResult[level];
      } else if (oldResult[level].countSteps > newResult[level].countSteps) {
        oldResult[level] = newResult[level];
        vin.classList.add("best-result");
        vinText.innerText = vinTextBest;
      }
    } else {
      oldResult = newResult;
    }

    localStorage.setItem("result", JSON.stringify(oldResult));

    rand = [];
    for (var i = 0; i < keyBtn.length; i++) {
      keyBtn[i].setAttribute("disabled", "disabled");
    }
  }

  $("key").addEventListener("click", clickNumber);
  enterBtn.addEventListener("click", clickEnter);
  cleanBtn.addEventListener("click", clearInput);

  btnStart.onclick = function () {
    if (!logined) {
      if (userName.value == "") {
        customAlert("error-cl", textError);
        return false;
      }
      addUser();
    }
    body.classList.remove("no-game");
    getRand();
    hideLayout(wrap, "start-layout");
    outputUserName();
  };

  [].forEach.call(startAgain, function (el) {
    el.addEventListener("click", function () {
      body.classList.remove("no-game");
      for (var i = 0; i < keyBtn.length; i++) {
        keyBtn[i].removeAttribute("disabled");
      }
      clearInput();
      getRand();
      result.innerHTML = "";
      if (vin.classList.contains("is-vin")) vin.classList.remove("is-vin");
      hideLayout(wrap, "results-layout");
    });
  });
  window.onload = function () {
    $o(".loader-inner").classList.add("hidden-inner");
    setTimeout(function () {
      $("loader").classList.add("hidden");
    }, 500);
  };
})();
