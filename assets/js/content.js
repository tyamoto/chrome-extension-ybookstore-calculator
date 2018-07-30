(function() {

    let limit = 0;

    const getDataFromChromeStorage = (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get((store) => {
                resolve(store[key]);
            });
        });
    }

/*
 *     const applyLimit = (result) => {
 *         return new Promise((resolve, reject) => {
 *             console.log(limit);
 *             limit = result;
 *             resolve(limit);
 *         });
 *     }
 *
 *     const getLimit = () => {
 *         // return Promise.resolve()
 *                    // .then(getDataFromChromeStorage('limit'))
 *                    // .then(applyLimit)
 *         return getDataFromChromeStorage('limit');
 *         ;
 *     }
 */

    const fetchWalletParams = () => {
        return $.ajax({
            url: 'https://detail.wallet.yahoo.co.jp/history'
        });
    }

    const fetchCurrentUsage = (response) => {
        // console.log(d);
        let m, arg = {};
        m = response.match(/^\s+yid: "(.+)"/m);
        arg['yid'] = m[1] ? m[1] : '';
        m = response.match(/^\s+crumb: "(.+)"/m);
        arg['.crumb'] = m[1] ? m[1] : '';
        if (! (arg['yid'] && arg['.crumb'])) return false;
        let dt = new Date();
        arg['ym'] = dt.getFullYear() + ('0' + (dt.getMonth() + 1)).slice(-2);
        // console.log(arg);
        return $.ajax({
            url: 'https://detail.wallet.yahoo.co.jp/history/api',
            dataType: "json",
            data: arg
        });
    }

    const fetchUsage = () => {
        return Promise.resolve()
                   .then(fetchWalletParams)
                   .then(fetchCurrentUsage)
        ;
    }

    const fetchCartPage = () => {
        return $.ajax({
            url: 'https://bookstore.yahoo.co.jp/cart/cart.html'
        });
    }

    const calcTotal = (response) => {
        let total = 0,
            r = $(response.replace("''", "\'"));
        r.find(".cartEachItem[data-is-available]").each(function() {
            total += Number($(this).attr('data-purchaseprice'));
            total += Number($(this).attr('data-tax'));
        });
        return new Promise((resolve, reject) => {
            resolve(total);
        });
    }

    const fetchCart = () => {
        return Promise.resolve()
                   .then(fetchCartPage)
                   .then(calcTotal)
        ;
    }
    const fetchAll = () => {
        return Promise.all([
            getDataFromChromeStorage('limit'),
            fetchUsage(),
            fetchCart()
        ]);
    }

    const drawUsageBox = (responses) => {
        let limit     = responses[0] || 10000,
            response  = responses[1],
            cart      = responses[2];
        console.log(limit);
        if (response.code !== '00') return;
        let usage = Number(response.month_info.total_amount);
        console.log(usage);
        let m     = $('p#price').text().match(/^価格：\s+([0-9,]+)円\+税([0-9,]+)円/m);
        if (! (m[1] && m[2])) return;
        tax_included = Number(m[1].replace(',', '')) + Number(m[2].replace(',', ''));
        total = usage + tax_included + cart;
        let is_exceed_limit = (total > limit);
        let htmlToAppend =
            // '<div class="att-Wrap" id="bscResult">' +
            '<div class="left-bottom-float">' +
            '<div class="bscLine bscTotal">今月の料金（計）<span class="bscPriceTotal' + (is_exceed_limit ? ' bscRed">' : '">') + addComma(total) + ' 円</span></div>' +
            '<div class="bscLine">価格 <span class="bscPrice">' + addComma(tax_included)  + ' 円</span></div>' +
            '<div class="bscLine">購入済み金額 <span class="bscPrice">' + addComma(usage) + ' 円</span></div>' +
            '<div class="bscLine">カート追加済 <span class="bscPrice">' + addComma(cart)  + ' 円</span></div>' +
            '</div>';
        $('#footer').after(htmlToAppend);
    }

    const addComma = (num) => {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    /*
     * Promise.resolve()
     *     .then(getDataFromChromeStorage('limit'))
     */
    /*
     * getDataFromChromeStorage('limit')
     *     .then((r) => limit = r || 10000)
     *     .then(() => console.log(limit))
     */
    Promise.resolve()
        .then(fetchAll)
        .then(drawUsageBox)
    ;

}).call(this);
