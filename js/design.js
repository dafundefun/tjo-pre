var api = 'api/prereg';
var user = $('#userId').text();

function logout_dg() {
    console.log(123);
    $("#logout-form").submit();
}
$.post(
    api,
    {
        type: 'login',
        user: user,
    },
    function (res) {
        $('#totalAccValue').text(res.totalAccValue);
        $('#userAccValue').text(res.userAccValue);
        var count = 30 - res.userAccValue;
        //若已登入
        if (res.status == 1) {
            // 已登錄過
            $('#section3 .left .btn,#section2 .form button').removeClass('noUser');
            if (res.bind == 'Y') {
                $('#section2 .form button').addClass('done');
                $('#section2 .form input[type=tel]').val(res.phone).prop('disabled', true);
                $('#section2 .form select').prop('disabled', true);
                if(count < 1){
                    $('#countDown').hide();
                    $('#getPet').show();
                    $('.pet .pic').addClass('shine');
                }else if(count == 'NaN'){
                    $('#countDown').text(30);
                }else{
                    $('#countDown').text('餘' + count);
                    $('#getPet').hide();
                }
            };
            if (res.lotteryToday == 'Y') {
                $('#section3 .left .btn').addClass('done');
            };
        } else if (res.status == -99) {
            $('#section3 .left .btn,#section2 .form button').addClass('noUser');
            $('#record').addClass('noUser');
            $('#getPet').hide();
        };
        if (res.bind == 'Y') {
            $('#section2 .form button').addClass('done').attr('disable', true);
        };

        
    },
);

$(document).ready(function () {
    // 漢堡選單切換關閉
    $('.burgerIcon').click(function () {
        $(this).toggleClass('cross');
        //$('header').find('.list').toggleClass('open');
        $('header').find('.list').slideToggle();
    });

    $('.menuSm .innerLink li').click(function () {
        var sec = '#sectio' + $(this).attr('id');
        var position = $(sec).find('.title').offset().top - 60;
        $('html,body').animate({ scrollTop: position }, 500);
        $('header').find('.list').slideUp();
        $('.burgerIcon').removeClass('cross');
    });

    //PC版選單展開
    $('.menuLgSwitch').on('click', function () {
        $(this).toggleClass('right');
        $('.menuLg').toggleClass('open');
    });

    //選單點擊後滑動    
    $('.menuLg div.btn').click(function () {
        var sec = '#section' + $(this).attr('id');
        var position = $(sec).find('.title').offset().top;
        $('html,body').animate({ scrollTop: position }, 500);
        $('.menuLgSwitch').toggleClass('right');
        $('.menuLg').toggleClass('open');
    });

    //監聽FB iframe
    $('#fbLike').click(function() {
        $(this).prop('clicked',true);
    });

    // 四大門派
    $('.switchBtn .btn').on('click', function () {
        $(this).addClass('switchOn').siblings().removeClass('switchOn');
        var now = $(this).attr('id');
        var CH = '#' + now + 'Ch';
        var NA = '#' + now + 'Na';
        var CA = '#' + now + 'Ca';
        $(CH).removeClass('sectHidden').siblings().addClass('sectHidden');
        $(NA).removeClass('sectHidden').siblings().addClass('sectHidden');
        $(CA).removeClass('sectHidden').siblings().addClass('sectHidden');
    });

    //彈窗顯示及關閉
    $('.popUpBtn').click(function () {
        if($(this).hasClass('noUser')){
            warn();
            warnText.text('請先登入帳號');
        }else{
            var target = '#' + $(this).attr('id') + 'Block';
            $(target).fadeIn().addClass('show');
            $('.popUpCover').fadeIn();
            $('body').css('overflow', 'hidden');
            var contentTop = $(target).find('.title').outerHeight() + 32;
            $(target).find('.content').css({'top': contentTop});
        }
    });
    // 關閉彈窗
    function closePop() {
        $('.show,.popUpCover').fadeOut();
        $('show').removeClass('show');
        $('body').css('overflow', '');
    };

    $('.popUp').find('.close').click(closePop);
    $('.popUpCover').click(closePop);

    // 提示視窗
    function warn() {
        $('#warningBlock,.popUpCover').fadeIn();
        $('#warningBlock').addClass('show');
        $('body').css('overflow', 'hidden');
    };

    var warnText = $('#warningText');

    // 預約驗證
    $('#section2 .form button').click(function () {
        var area = $('#userArea option:selected').val();
        var phone = $('#userPhone').val().length;
        var phoneNu = $('#userPhone').val();
        var check = $('#section2 .form input[type="checkbox"]');
        var fbClick = $('#fbLike').prop('clicked');

        if ($(this).hasClass('done')) {
            warn();
            warnText.text('已預約完成');
        } else if ($(this).hasClass('noUser')) {
            warn();
            warnText.text('請先登入帳號');
        } else if (area == '+886' && phone == 0) {
            warn();
            warnText.text('請輸入手機號碼');
        } else if (area == '+886' && phone != 0 && phone != 9 && phone != 10) {
            warn();
            warnText.text('格式錯誤，請重新確認');
        } else if (area == '+886' && phone == 9){
            if (fbClick !== true ) {
                warn();
                warnText.text('請先按讚粉絲團');
            } else if (fbClick == true && check.prop('checked') == false) {
                warn();
                var phone = area + phone
                warnText.text('尚未勾選隱私條款');
            } else if (fbClick == true && check.prop('checked') == true) {
                warn();
                var phone = area + phoneNu;
                bindaccount(phone);
            }
        } else if (area == '+886' && phone == 10){
            var phoneNumber = $('#userPhone').val().trim();
            if (phoneNumber.charAt(0) === '0') {
                var cleanedNumber = phoneNumber.substring(1);
                if (fbClick !== true ) {
                    warn();
                    warnText.text('請先按讚粉絲團');
                } else if (fbClick == true && check.prop('checked') == false) {
                    warn();
                    var phone = area + phone
                    warnText.text('尚未勾選隱私條款');
                } else if (fbClick == true && check.prop('checked') == true) {
                    warn();
                    var phone = area + cleanedNumber;
                    bindaccount(phone);
                }
            }else{
                warn();
                warnText.text('格式錯誤，請重新確認');
            }
        } else if ((area == '+852' || area == '+853') && phone == 0) {
            warn();
            warnText.text('請輸入手機號碼');
        } else if ((area == '+852' || area == '+853') && phone !== 0 && phone !== 8) {
            warn();
            warnText.text('格式錯誤，請重新確認');
        } else if ((area == '+852' || area == '+853') && phone == 8 && fbClick != true) {
            warn();
            warnText.text('請先按讚粉絲團');
        } else if ((area == '+852' || area == '+853') && phone == 8 && fbClick == true && check.prop('checked') == false) {
            warn();
            warnText.text('尚未勾選隱私條款');
        } else if ((area == '+852' || area == '+853') && phone == 8 && fbClick == true && check.prop('checked') == true) {
            warn();
            var phone = area + phoneNu;
            bindaccount(phone);
        };
        function bindaccount(phonenumber) {
            $.post(
                api,
                {
                    type: 'bind',
                    user: user,
                    phone: phonenumber,
                },
                function (bin) {
                    if (bin.status == 1) {
                        warn();
                        warnText.html('<span>已完成事前預約<br>敬請期待遊戲開放</span>');
                        $('#section2 .form button').addClass('done');
                    } else if (bin.status == -98) {
                        warn();
                        warnText.text('此帳號已進行過事前預約');
                    } else if (bin.status == -96) {
                        warn();
                        warnText.text('此手機號碼已進行過事前預約');
                    } else if (bin.status == -99) {
                        warn();
                        warnText.text('請先登入帳號');
                    } else if (bin.status == -90) {
                        warn();
                        warnText.text('活動已結束');
                    }
                }
            );
        }
    });
    // 實時更新注入次數
    function newValueCount(){
        $.post(
            api,
            {
                type: 'login',
                user: user,
            },
            function(val){
                var NewUserAccValue = val.userAccValue;
                var NewTotalAccValue = val.totalAccValue;
                var count = 30 - NewUserAccValue;
                if(count < 1){
                    $('#countDown').hide();
                    $('#getPet').show();
                    $('.pet .pic').addClass('shine');
                }else{
                    $('#userAccValue').text(NewUserAccValue)
                    $('#countDown').text('餘' + count);
                }
                $('#totalAccValue').text(NewTotalAccValue);
            }
        )
    }


    // 注入精力
    $('#section3 .left .btn').click(function () {
        $.post(
            api,
            {
                type: 'lottery',
                user: user,

            },
            function (lot) {
                console.log(lot.item)
                if($(this).hasClass('noUser')){
                    warn();
                    warnText.text('請先登入帳號');
                }else if (lot.status == -99) {
                    warn();
                    warnText.text('尚未完成預約');
                } else if (lot.status == -98) {
                    warn();
                    warnText.text('今日次數已用完');
                } else if (lot.status == -90) {
                    warn();
                    warnText.text('活動已結束');
                } else if (lot.status == 1) {
                    $('#giftName').show().text(lot.item);
                    $('.gift .bg').show();
                    $('#section3 .left .btn').addClass('done');
                    $('.gift>img').attr("src", "img/items/0" + lot.img + ".png");
                    newValueCount();
                };
            },
        );
    });

    // 獎勵紀錄
    $('#record').click(function () {
        $('#recordBlock .center').empty();
        $.post(
            api,
            {
                type: 'record',
                user: user,
            },
            function (rec) {
                // console.log(rec.recordList[0].item, rec.recordList[0].date)
                if(rec.recordList.length == 0){
                    $('#recordBlock .center').append('<div class="item normal">暫無紀錄</div>');
                }else{
                    for (let i = 0; i < rec.recordList.length; i++) {
                        $('#recordBlock .center').append('<div class="item normal"><div class="dates small">' + rec.recordList[i].date + '</div><div class="name">' + rec.recordList[i].item + '</div></div>')
                    }

                }
            }
        )

    });
})