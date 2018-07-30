(function () {
    // @link https://semantic-ui.com/behaviors/form.html
    // $('.ui.large.form').form.settings.debug = true;
    $('.ui.large.form').form({
        fields: {
            name: {
                identifier: 'limit',
                rules: [
                    {
                        type   : 'integer[1000..100000]',
                        prompt : '1,000 から 100,000 の範囲で入力してください'
                    }
                ]
            },
        }
    });

    chrome.storage.local.get(null, function(value) {
        $("input[name='limit']").val(value.limit);
    });


    $('#submit').click(function() {
        console.log($("input[name='limit']").val());
        let m = {
            type: 'setSettings',
            limit: $("input[name='limit']").val()
        }
        chrome.runtime.sendMessage(m, function(_settings) {
            console.log(_settings);
            $("#messageSuccess").show();
        })
    })

    // (function () {
        // chrome.storage.local.get(["status"], function (value) {
            // console.log(value.status);
            // if (value.status == "start"){
                // $("#status_start").show();
                // $("#status_end").hide();
                // $("#status_open").hide();
            // } else if (value.status == "end"){
                // $("#status_start").hide();
                // $("#status_end").show();
                // $("#status_open").hide();
            // } else if (value.status == "open"){
                // $("#status_start").hide();
                // $("#status_end").hide();
                // $("#status_open").show();
            // }
        // });
    // })();

    /*
    * START
    */
    // $('#start_push').click(function () {
        // chrome.runtime.sendMessage({ status: "start" }, function (response) {
            // console.log(response.status);
            // $("#status_start").show();
            // $('#status_start').show();
            // $("#status_end").hide();
            // $("#status_open").hide();
        // });
        // pushMessege("Qiita", "START","/image/qiita_icon.png");
    // });

    /*
    * THE END
    */
    // $('#end_push').click(function () {
        // chrome.runtime.sendMessage({ status: "end"}, function (response) {
            // console.log(response.status);
            // $("#status_start").hide();
            // $("#status_end").show();
            // $("#status_open").hide();
        // });
        // pushMessege("Qiita", "END", "/image/qiita_icon.png");
    // });

    /*
    * push通知
    */
    // function pushMessege(header, body, iconPath) {
        // Push.create(header, {
            // body: body,
            // icon: iconPath,
            // timeout: 8000,
            // onClick: function () {
                // window.focus();
                // this.close();
            // }
        // });
    // }

}).call(this);
