(function() {

    (function () {
        getCurrentUsage()
//        if (document.URL.match(/\/[dg]p\//) == null) return;
//
//        chrome.extension.sendRequest(
//            { name: "get" },
//            function(response) {
//                var isEbook = $("li:contains('ISBN-13')").length == 0;
//                var title   = isEbook ? $("#ebooksProductTitle").text() : $("#productTitle").text();
//                if (! title) {
//                    return;
//                }
//                title = title.replace(/\u2015/g, ' ').replace(/\s+/, ' ');
//                console.log(title,);
//                if (title.match(/^([^\s]+\s+[^\s]+)\s+.+/) || title.match(/^(.+)\s+\(\S+\)$/)) {
//                    title = RegExp.$1;
//                    // console.log(title,);
//                    if (title.match(/^(.+)[(（]/) || title.match(/^(.+)\s+\d+巻/)) {
//                        title = RegExp.$1;
//                        console.log(title,);
//                    }
//                }
//                var htmlToAppend = '<div id="bssOutput"><p class="lead1">この本がブックストアにあるか検索</p>'
//                                 + '<div id="bssLoader"><img src="' + chrome.extension.getURL("images/ajax-loader.gif") + '" width="56" height="21" /></div>'
//                                 + '<div id="bssResult"></div></div>';
//                if ($("#olpDivId").length > 0) {
//                    $("#olpDivId").after(htmlToAppend);
//                } else {
//                    $("#MediaMatrix").after(htmlToAppend);
//                }
//
//                /*
//                 * console.log(
//                 *     title,
//                 *     encodeURI(title),
//                 *     encodeURIComponent(title),
//                 *     escape(title)
//                 * );
//                 */
//                searchBookstore(title);
//        });
    })();

    function getCurrentUsage() {
        $.ajax({
            url: 'https://detail.wallet.yahoo.co.jp/history'
        }).done(function(d) {
            var m, arg = {}
            m = d.match(/^\s+yid: "(.+)"/m)
            arg['yid'] = m[1] ? m[1] : ''
            m = d.match(/^\s+crumb: "(.+)"/m)
            arg['.crumb'] = m[1] ? m[1] : ''
            if (! (arg['yid'] && arg['.crumb'])) return false
            var dt = new Date()
            arg['ym'] = dt.getFullYear() + ('0' + (dt.getMonth() + 1)).slice(-2)
            // console.log($.param(arg))
            $.ajax({
                url: 'https://detail.wallet.yahoo.co.jp/history/api',
                dataType: "json",
                data: arg
            }).done(function(d) {
                if (d.coce !== '00') return false
                var usage = d.month_info.total_amount
                console.log(usage)
            })
            /*
             * $('#bssLoader').fadeOut();
             * if (anchor.length == 1) {
             *     // console.log(anchor.attr('href'));
             *     $('#bssResult').append('<a href='' + anchor.attr('href') + '' target='_blank' class='found'>見つかりました</a>');
             * }
             * else {
             *     $('#bssResult').append('見つかりませんでした');
             * }
             */
        });
    }

}).call(this);
