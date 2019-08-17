



$(function () {

  var pDom = {
    mbox: $('#mbox'),
    plist: $('#personList'),
    txtDom: $('#dlgTxt'),
    dlg: $('#dialog-box'),
    load: $('#loadPage'),
    cartoon: $('#cartoonBox'),
    ctImg: $('#ct-imgs')
  }


  function runPage() {

    this.num = 0;
    this.preload()
  }

  runPage.prototype = {

    preload: function () {

      var source = sourceList;
      var thedom = pDom.load;
      var self = this;



      $('h1', thedom).html(source.name);
      $('h2', thedom).html(source.chaper);


      var len = source.list.length + 1;

      var thenum = 0;

      for (var i in source.list) {
        var cimg = source.list[i];

        var imgs = new Image();

        imgs.src = cimg;

        imgs.onload = function () {
          thenum++;

          $('.cur', thedom).css({
            'width': thenum / len * 100 + '%'
          })

          if (thenum === len - 1) {
            setTimeout(function () {
              $('.cur', thedom).css({
                'width': '100%'
              })
            }, 600)

            setTimeout(function () {
              pDom.load.hide();
              self.init();

            }, 1000)
          }
        }




      }





    },

    init: function () {
      let curData = pageData[this.num];

      if (!curData) { return }


      if (curData.type === 'txt') {
        this.runTxt(curData);
        return;
      }

      if (curData.type === 'dialog') {
        this.runDlg(curData);
        return;
      }

      if (curData.type === 'cartoon') {
        this.runCartoon(curData);
        return;
      }
    },


    runCartoon: function (curData) {


      showCartoon(curData, this);


    },

    runTxt: function (curData) {
      var num = 0;
      var self = this;



      function addTxt() {
        var txt = curData.data[num];

        if (!txt) {
          self.num++;
          self.init();
          return;
        }

        pDom.mbox.append('<div class="otxt">' + txt[0] + '</div>');
        num++;

        pDom.mbox.scrollTop(1000000)
        setTimeout(function () {
          addTxt();
        }, txt[1])

      }

      addTxt();
    },

    runDlg: function (curData) {
      var self = this;
      showDlg(curData, self)
    }

  }

  // dialog 显示
  function showDlg(curData, self) {

    var data = curData.data;
    var person = curData.person;
    var num = 0;

    pDom.txtDom.html('');

    if (!self) {
      if (!$('.cancel', pDom.dlg).length) {
        pDom.dlg.append('<div class="cancel"></div>')

      }
    }


    pDom.plist.html('')
    for (var i in person) {
      pDom.plist.append('<div class="op" id="' + person[i] + '"></div>')
    }

    function showDlg() {
      pDom.dlg.addClass('show');
      pDom.mbox.addClass('hide')

      var d = data[num];
      if (!d) {
        pDom.dlg.addClass('hide').removeClass('show');
        pDom.mbox.removeClass('hide')

        if (self) {
          pDom.mbox.append('<div class="again-dlg" data-id="' + self.num + '"><span></span> </div>')

          self.num++;
          self.init();
        }


        return;
      }

      if (num === 0) {

        setTimeout(function () {
          pDom.txtDom.html(d[0]);
        }, 600)

      } else {
        pDom.txtDom.html(d[0]);
      }
      $('#' + d[1], pDom.plist)
        .attr('class', 'op cur face-' + d[2])
        .siblings()
        .attr('class', 'op');

      pDom.txtDom.attr('data-txt', d[1])
    }

    showDlg()

    pDom.txtDom.off().on('click', function () {
      num++;
      showDlg();
    })

  }


  // cartoon 显示
  function showCartoon(curData, self) {

    pDom.mbox.addClass('hide')
    pDom.cartoon.show().removeClass().addClass('ct-' + curData.id);
    pDom.ctImg.html('');
    var theTime = 50;
    for (var i in curData.data) {
      var oi = curData.data[i];
      var oimg = $('<img src="' + oi[0] + '" class="img-' + i + ' ">');
      pDom.ctImg.append(oimg);

      (function (img, time, pos) {
        setTimeout(function () {
          img.addClass(pos)
        }, time)
      }(oimg, theTime, oi[1]));
      theTime += oi[2]
    }

    pDom.cartoon.off().on('click', function () {
      pDom.cartoon.hide();
      pDom.mbox.removeClass('hide')

      if (self) {
        pDom.mbox.append('<div class="again-cartoon" data-id="' + self.num + '"><span></span></div>')
        self.num++;
        self.init();
      }
    })


  }


  var pageit = new runPage(pDom)

  // 点击事件
  $('body').on('click', '.again-dlg span', function () {
    var btn = $(this);
    var index = btn.parent().attr('data-id');
    var curData = pageData[index];
    showDlg(curData)
  })


  // dlg关闭事件
  $('body').on('click', '#dialog-box .cancel', function () {
    pDom.dlg.removeClass('show').addClass('hide')
    pDom.mbox.removeClass('hide');
  })

  // 选章节
  $('.icon-list').on('click', function () {
    var listDom = $('#chapList');
    listDom.addClass('show').removeClass('hide')
  })

  $('#chapList').on('click', function (e) {
    var dom = $(this)

    dom.addClass('hide').removeClass('show');
    setTimeout(function () {
      dom.removeClass('hide')
    }, 500)
  })

  $('#chapList .main').on('click', function (e) {
    e.stopPropagation()
  })


  $('body').on('click', '.again-cartoon span', function () {
    var btn = $(this);
    var index = btn.parent().attr('data-id');
    var curData = pageData[index];
    pDom.cartoon.show();
    showCartoon(curData)
  })



})