(function () {
    // (function () {
        // console.log($("input[name='limit']").val());
        // chrome.storage.local.get(["limit"], function (value) {
            // console.log(value.limit);
            /*
             * if (value.status == "start"){
             *     $("#status_start").show();
             *     $("#status_end").hide();
             *     $("#status_open").hide();
             * } else if (value.status == "end"){
             *     $("#status_start").hide();
             *     $("#status_end").show();
             *     $("#status_open").hide();
             * } else if (value.status == "open"){
             *     $("#status_start").hide();
             *     $("#status_end").hide();
             *     $("#status_open").show();
             * }
             */
        // });
    // })();

    $('#submit').click(function() {
        var m = {
            method: 'get',
            limit: $("input[name='limit']").val()
        }
        chrome.runtime.sendMessage(m, function(response) {
            console.log(response)
        })
        /*
         * chrome.runtime.sendMessage({ status: "start" }, function (response) {
         *     console.log(response.status)
         *     $("#status_start").show()
         *     $('#status_start').show()
         *     $("#status_end").hide()
         *     $("#status_open").hide()
         * })
         * pushMessege("Qiita", "START","/image/qiita_icon.png")
         */
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
