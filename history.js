if ("undefined" === typeof YAHOO) YAHOO = {};

if ("undefined" === typeof YAHOO.JP) YAHOO.JP = {};

if ("undefined" === typeof YAHOO.JP.wallet) YAHOO.JP.wallet = {};

if ("undefined" === typeof YAHOO.JP.wallet.books) YAHOO.JP.wallet.books = {};

!function() {
    YAHOO.JP.wallet.books.History = function() {
        var a = {
            yearMonth: "",
            selectedYm: "",
            yid: "",
            code: "",
            nodata: false,
            apiRunning: true,
            fetching: "",
            isSetInnerHeight: false,
            isRendered: false,
            monthIndex: 0,
            api: "",
            isApp: ""
        }, b, c = YAHOO.JP.wallet.books.Util;
        return {
            init: function(d) {
                var e = c.isIE78() ? $(window).height() : window.innerHeight;
                if (!d) d = {};
                a.yearMonth = d.ym || "";
                a.selectedYm = d.selectedYm || "";
                a.yid = d.yid || "";
                a.crumb = d.crumb || "";
                a.code = d.code || "";
                a.nodata = d.nodata || false;
                a.api = d.api || "https://" + location.host + "/history/api";
                a.isApp = d.isApp || false;
                b = YAHOO.JP.wallet.books.History;
                b.fetch(a.yearMonth);
                if ("all" !== a.selectedYm) return;
                $(window).scroll(function(d) {
                    if (!a.isRendered) return;
                    if (!a.isSetInnerHeight) {
                        e = c.isIE78() ? $(window).height() : window.innerHeight;
                        a.isSetInnerHeight = true;
                    }
                    if ($(document).height() - (e + $(this).scrollTop()) < 2) if (a.fetching !== a.yearMonth) {
                        a.fetching = a.yearMonth;
                        b.fetch(a.yearMonth);
                    }
                });
                $(window).resize(function(a) {
                    e = c.isIE78() ? $(window).height() : window.innerHeight;
                });
            },
            fetch: function(c) {
                var d = {};
                if (!a.apiRunning || a.monthIndex >= 24) return false;
                d = {
                    ym: c,
                    yid: a.yid,
                    ".crumb": a.crumb
                };
                if (true === a.nodata) d.nodata = 1; else if ("" !== a.code) d.code = a.code;
                $.ajax({
                    url: a.api,
                    dataType: "json",
                    data: d,
                    success: b.onAsyncRequestSuccess,
                    error: function(a, b, c) {}
                });
            },
            onAsyncRequestSuccess: function(d) {
                if ("50" === d.code) {
                    location.href = "https://login.yahoo.co.jp/config/login?.src=wallet&.done=" + encodeURIComponent(location.href);
                    return;
                }
                a.apiRunning = b.renderContent(d);
                a.isSetInnerHeight = false;
                if (!a.apiRunning) return;
                b.onDataLoaded(a.monthIndex);
                a.monthIndex++;
                a.yearMonth = c.getPreviousMonth(a.yearMonth);
                if ("all" === a.selectedYm && !c.hasEnoughHeight() && a.monthIndex < 11) b.fetch(a.yearMonth); else a.isRendered = true;
            },
            renderContent: function(d) {
                var e, f, g, h, i, j, k, l;
                if (c.isSmartPhone()) e = $('<article class="articleBox' + a.monthIndex + '">'); else e = $('<div class="articleBox articleBox' + a.monthIndex + '">');
                $(".historyWrapper").append(e);
                if ("" !== d.top_message && 0 === $(".topMessage").length) {
                    h = b.makeTopMessageHtml(d);
                    $(h).insertBefore($(".mainHeader"));
                }
                if ("00" !== d.code && "30" !== d.code) {
                    i = b.makeApiErrorHtml(d);
                    e.append(i);
                    return false;
                }
                f = b.makeMonthHeader(d);
                e.append(f);
                if ("30" === d.code || "" !== d.month_info.message && 0 !== d.detail.length) {
                    j = b.makeDataLossHtml(d);
                    e.append(j);
                }
                if (0 !== d.detail.length) for (l = 0; l < d.detail.length; l++) {
                    g = b.makeProductWrapper(d.detail[l]);
                    e.append(g);
                } else {
                    if ("" !== d.month_info.message) {
                        j = b.makeDataLossHtml(d);
                        e.append(j);
                    }
                    k = b.makeNodataHtml();
                    e.append(k);
                }
                ins.refreshModule("uselist");
                return true;
            },
            makeMonthHeader: function(a) {
                var b = $("#headerTemplate").html(), c = YAHOO.JP.wallet.books.Util;
                b = b.replace("{{ym}}", a.month_info.ym);
                b = b.replace("{{total_amount}}", c.numberFormat(a.month_info.total_amount));
                return b;
            },
            makeProductWrapper: function(b) {
                var c = "", d = "", e, f, g, h, i, j = "", k = "", l = "", m = "", n = "", o = "", p = "", q = "", r = $("#productWrapperTemplate").html(), s = YAHOO.JP.wallet.books.Util, t = 0;
                f = b.order_date.split("-")[1] - 0;
                g = b.order_date.split("-")[2].split(" ")[0] - 0;
                c = f + "月" + g + "日";
                if (null !== b.prdct_link && "" !== b.prdct_link && (!a.isApp || "undefined" !== typeof b.detail_link)) {
                    j = '<a href="' + b.prdct_link + '" data-ylk="slk:selling;pos:*">';
                    j += b.prdct_name;
                    j += "</a>";
                } else j = b.prdct_name;
                if ("undefined" !== typeof b.note && "" !== b.note) k = '<dl><dt class="dItem">備考：</dt><dd class="dValue">' + b.note + "</dd></dl>"; else k = "";
                if ("undefined" !== typeof b.detail_link) {
                    l = '<div><a href="';
                    l += b.detail_link;
                    l += '" class="detailLink" data-ylk="slk:usedtl;pos:*">利用詳細</a></div>';
                } else detialLink = "";
                if ("0" === b.stop_flg && b.stop_link && "" !== b.stop_link) {
                    m = '<dl><dt class="dItem">ステータス：</dt><dd class="dValue"><span class="status">' + b.status + "</span>";
                    if (!a.isApp) m += '<a href="' + b.stop_link + '" data-ylk="slk:stop;pos:*" class="iconStop">停止する</a>';
                    m += "</dd></dl>";
                } else if ("1" === b.stop_flg) {
                    e = b.stop_date.split("-")[0] - 0;
                    f = b.stop_date.split("-")[1] - 0;
                    g = b.stop_date.split("-")[2].split(" ")[0] - 0;
                    h = b.stop_date.split("-")[2].split(" ")[1].split(":")[0] - 0;
                    i = b.stop_date.split("-")[2].split(" ")[1].split(":")[1] - 0;
                    d = e + "年" + f + "月" + g + "日 " + h + "時" + i + "分";
                    m = '<dl><dt class="dItem">ステータス：</dt><dd class="dValue"><span class="status stop">';
                    m += b.status + "</span> " + d + "</dd></dl>";
                } else m = '<dl><dt class="dItem">ステータス：</dt><dd class="dValue"><span class="status">' + b.status + "</span></dd></dl>";
                if ("" === b.status) m = "";
                for (t = 0; t < b.pay.length; t++) {
                    n += '<div><span class="' + b.pay[t].pay_icon + '">';
                    n += s.numberFormat(b.pay[t].pay_price) + '</span><span class="textS">円</span></div>';
                }
                if ("undefined" !== typeof b.prdct_price) {
                    o = "<tr><th>価格（税込）</th><td>";
                    o += s.numberFormat(b.prdct_price);
                    o += "円</td></tr>";
                } else o = "";
                if ("undefined" !== typeof b.dscnt_price) {
                    p = '<tr><th class="discount">割引</th><td>';
                    p += s.numberFormat(b.dscnt_price);
                    p += "円</td></tr>";
                } else p = "";
                if (b.status.indexOf("キャンセル") != -1) q = " cancelProduct"; else q = "";
                r = r.replace("{{orderDate}}", c);
                r = r.replace("{{prdctName}}", j);
                r = r.replace("{{order_id}}", b.order_id);
                r = r.replace("{{use_place}}", b.use_place);
                r = r.replace("{{note}}", k);
                r = r.replace("{{status}}", m);
                r = r.replace("{{detailLink}}", l);
                r = r.replace("{{payPrice}}", n);
                r = r.replace("{{productPrice}}", o);
                r = r.replace("{{discountPrice}}", p);
                r = r.replace("{{cancelProduct}}", q);
                r = r.replace("{{sub_total}}", s.numberFormat(b.sub_total));
                return r;
            },
            makeTopMessageHtml: function(a) {
                var b = $("#topMessageTemplate").html();
                b = b.replace("{{top_message}}", a.top_message);
                return b;
            },
            makeApiErrorHtml: function(a) {
                var b = $("#apiErrorTemplate").html(), c = "";
                if ("" === a.month_info.message) c = "現在、ご利用いただいた商品・コンテンツがご確認いただけません。"; else c = a.month_info.message;
                b = b.replace("{{message}}", c);
                return b;
            },
            makeDataLossHtml: function(a) {
                var b = $("#dataLossTemplate").html();
                b = b.replace("{{message}}", a.month_info.message);
                return b;
            },
            makeNodataHtml: function() {
                var a = $("#nodataTemplate").html();
                return a;
            },
            onDataLoaded: function(a) {}
        };
    }();
}();
