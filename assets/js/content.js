(function() {

    getCurrentUsage(drawMessage)

    function getCurrentUsage(callback) {
        $.ajax({
            url: 'https://detail.wallet.yahoo.co.jp/history'
        }).done(function(d) {
            var m, arg = {};
            m = d.match(/^\s+yid: "(.+)"/m);
            arg['yid'] = m[1] ? m[1] : '';
            m = d.match(/^\s+crumb: "(.+)"/m);
            arg['.crumb'] = m[1] ? m[1] : '';
            if (! (arg['yid'] && arg['.crumb'])) return false;
            var dt = new Date();
            arg['ym'] = dt.getFullYear() + ('0' + (dt.getMonth() + 1)).slice(-2);
            // console.log($.param(arg))
            $.ajax({
                url: 'https://detail.wallet.yahoo.co.jp/history/api',
                dataType: "json",
                data: arg
            }).done(function(d) {
                if (d.code !== '00') return false;
                var usage = d.month_info.total_amount;
                callback(Number(usage.replace(',', '')));
            });
        });
    }

    function drawMessage(usage) {
        var price, m;
        m = $('p#price').text().match(/^価格：\n(.+)円\+税(.+)円/m);
        if (! (m[1] && m[2])) return;
        tax_included = Number(m[1].replace(',', '')) + Number(m[2].replace(',', ''));
        total = usage + tax_included;
        console.log(doSomething())
        var is_exceed_limit = (total > 10000);
        var htmlToAppend =
            // '<div class="att-Wrap" id="bscResult">' +
            '<div class="left-bottom-float">' +
            '<div class="bscLine bscTotal">今月の料金（計）<span class="bscPriceTotal' + (is_exceed_limit ? ' bscRed">' : '">') + addComma(total) + ' 円</span></div>' +
            '<div class="bscLine">価格 <span class="bscPrice">' + addComma(tax_included) + ' 円</span></div>' +
            '<div class="bscLine">課金済み金額 <span class="bscPrice">' + addComma(usage) + ' 円</span></div>' +
            '</div>';
        $('#footer').after(htmlToAppend);
    }

    function addColor(html, b) {
        return b ? '<p style="color: #f00">' + html + '</p>' : html;
    }

    function addComma(num) {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    function getLimit() {
        var limit = 0;
        chrome.storage.local.get(null, function(value) {
            limit = value.limit;
            console.log(limit);
        });
        console.log(limit);
        return limit;
    }

    const getDataFromChromeStorage = (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get((store) => {
                resolve(store.key)
            });
        })
    }

    async function doSomething() {
        const data = await getDataFromChromeStorage('limit');
        return data;
    }

}).call(this);
