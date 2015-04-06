'use strict';/* Api Service */ameis.service('apiFactory', ['$http', '$q', function ($http, $q) {    this.isEmpty = function (obj) {        for (var i in obj) if (obj.hasOwnProperty(i)) return false;            return true;    };    this.formatDates = function (today) {        var dd = today.getDate();        var mm = today.getMonth() + 1;        var yyyy = today.getFullYear();        if (dd < 10) {            dd = '0' + dd        }        if (mm < 10) {            mm = '0' + mm        }        return yyyy + '' + mm + '' + dd;    };    this.notify = function (title, message, type) {        var title = typeof title !== 'undefined' && title.length ? title : '';        var message = typeof message !== 'undefined' && message.length ? message : 'Error en el servidor, por favor espere.';        var type = typeof type !== 'undefined' && type.length ? type : 'notice';        if (message instanceof Array) {            angular.forEach(message, function (v, k) {                new PNotify({                    type: type,                    title: title,                    text: v,                    animate_speed: "fast",                    desktop: {                        desktop: true                    },                    sticker: false                });            });        } else {            new PNotify({                type: type,                title: title,                text: message,                animate_speed: "fast",                desktop: {                    desktop: true                },                sticker: false            });        }    };    this.stackNotify = function (type, position) {        var stack_topleft = {"dir1": "down", "dir2": "right", "push": "top"};        var stack_bottomleft = {"dir1": "right", "dir2": "up", "push": "top"};        var stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};        var stack_bar_bottom = {"dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0};        var opts = {            title: "Over Here",            text: "Check me out. I'm in a different stack.",            addclass: "stack_bottomleft",            cornerclass: "",            width: "60%"        };        switch (type) {            case 'error':            opts.title = "Oh No";            opts.text = "Watch out for that water tower!";            opts.type = "error";            break;            case 'info':            opts.title = "Atención!";            opts.text = "No se encontraron datos";            opts.type = "info";            break;            case 'success':            opts.title = "Good News Everyone";            opts.text = "I've invented a device that bites shiny metal asses.";            opts.type = "success";            break;        }        switch (position) {            case 'top':            opts.stack = stack_bar_top;            break;            case 'topleft':            opts.stack = stack_topleft;            break;            case 'bottom':            opts.stack = stack_bottomleft;            break;        }        new PNotify(opts);    }    this.getMonth = function (date) {        var month = date.getMonth();        return month < 10 ? '0' + month : month;        /* ('' + month) for string result */    }    this.utf8_decode = function (str_data) {        var tmp_arr = [],        i = 0,        ac = 0,        c1 = 0,        c2 = 0,        c3 = 0,        c4 = 0;        str_data += '';        while (i < str_data.length) {            c1 = str_data.charCodeAt(i);            if (c1 <= 191) {                tmp_arr[ac++] = String.fromCharCode(c1);                i++;            } else if (c1 <= 223) {                c2 = str_data.charCodeAt(i + 1);                tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));                i += 2;            } else if (c1 <= 239) {                c2 = str_data.charCodeAt(i + 1);                c3 = str_data.charCodeAt(i + 2);                tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));                i += 3;            } else {                c2 = str_data.charCodeAt(i + 1);                c3 = str_data.charCodeAt(i + 2);                c4 = str_data.charCodeAt(i + 3);                c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);                c1 -= 0x10000;                tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));                tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));                i += 4;            }        }        return tmp_arr.join('');    }}]);/* WS Service */ameis.service('wsFactory', ['$http', '$q', function ($http, $q) {    this.restApi = 'http://192.168.1.100:9998/';    this.urlWS;    this.deferred;    this.url = function (method) {        this.urlWS = this.restApi + method;    };    this.post = function (datos) {        if (this.isEmpty(datos)) {            return {ok: false};        }        var self = this;        self.deferred = $q.defer();        var configs = {            url: this.urlWS,            method: "POST",            data: $.param(datos),            headers: {                "Content-Type": "application/x-www-form-urlencoded;"            }        };        $http(configs)        .success(function (data) {            self.deferred.resolve(data);        })        .error(function (data) {            self.deferred.resolve(data);        })        .catch(function (errorMsg) {            self.deferred.resolve(errorMsg);        });        return self.deferred.promise;    };   }]);/* Chart Service */ameis.service('chartService', ['rootFactory', '$http', '$window', 'storageService', 'apiFactory', function (rootFactory, $http, $window, storageService, apiFactory) {    this.urlImages = rootFactory.root + '/js/amcharts/images/';    this.dashboardPieChart = function (data) {        var result = [], campana = '', count = 0;        angular.forEach(data, function (v, k) {            while (count < 1) {                if (v.hasOwnProperty('campana')) {                    campana = v.campana.nombre;                }                if (v.hasOwnProperty('nombreCampana')) {                    campana = v.nombreCampana;                }                if (v.hasOwnProperty('nombre_campana')) {                    campana = v.nombre_campana;                }                result.push({                    campana: campana,                    total: v.qelectronicos                });                count++;            }        });        return result;    };    this.dashboardSerialChart = function (data) {        var arreglo = [], config = [], campañas = [], temp = [], fecha = '', id = '', campana = '', nombreNegocio = '';        angular.forEach(data, function (v, k) {            fecha = v.ano + '-' + v.mes;            id = v.ano + '' + v.mes;            nombreNegocio = v.nombreNegocio;            if (v.hasOwnProperty('campana')) {                campana = v.campana.nombre;            }            if (v.hasOwnProperty('nombreCampana')) {                campana = v.nombreCampana;            }            campañas.push(campana);            if (arreglo.hasOwnProperty(id)) {                arreglo[id][campana] = v.qelectronicos;                arreglo[id]['idcampana'] = v.id_campana;            } else {                arreglo[id] = {'fecha': fecha, 'nombreNegocio': nombreNegocio};                arreglo[id][campana] = v.qelectronicos;                arreglo[id]['idcampana'] = v.id_campana;            }        });        arreglo.forEach(function (elemento) {            if (elemento != null) {                temp.push(elemento);            }        });        config['data'] = temp;        config['graphs'] = this.unique(campañas);        return config;    };    this.unique = function (origArr) {        var newArr = [],        origLen = origArr.length,        found, x, y;        for (x = 0; x < origLen; x++) {            found = undefined;            for (y = 0; y < newArr.length; y++) {                if (origArr[x] === newArr[y]) {                    found = true;                    break;                }            }            if (!found) {                newArr.push(origArr[x]);            }        }        return newArr;    };    this.sort = function (array) {        array = array.sort(function (a, b) {            return a.item.localeCompare(b.item);        });    };    /* 123 || 321 */    this.sortJSON = function (data, key, way) {        return data.sort(function (a, b) {            var x = a[key];            var y = b[key];            if (way === '123') {                return ((x < y) ? -1 : ((x > y) ? 1 : 0));            }            if (way === '321') {                return ((x > y) ? -1 : ((x < y) ? 1 : 0));            }        });    };    this.donut = function (chart, div, data, ejeX, ejey, title, labelTexto) {        labelTexto = typeof labelTexto !== 'undefined' || labelTexto != null ? labelTexto : '';        chart.titleField = title;        chart.valueField = ejeX;        chart.outlineColor = "#FFFFFF";        chart.outlineAlpha = 0.8;        chart.outlineThickness = 2;        chart.labelTexto = labelTexto;        /* <--- titulo de cada parte del gráfico */        chart.balloonTex = "[[title]]<br><span style='font-size:11px'><b>[[value]]</b> ([[percents]]%)</span>";        chart.pathToImages = this.urlImages;        chart.categoryField = ejey;        chart.language = "es";        chart.numberFormatter = this.formatNumber();        /* */        chart.labelRadius = 5;        chart.radius = "35%";        chart.innerRadius = "60%";        chart.dataDateFormat = "YYYY-MM-DD HH:NN";        this.animation(chart, true);        this.legend(chart);        //chart.exportConfig = this.export();        chart.dataProvider = data;        chart.write(div);    };    this.trackingGlobal = function (chart, div, data, ejeX, ejey, title, labelTexto) {        labelTexto = typeof labelTexto !== 'undefined' || labelTexto != null ? labelTexto : '';        chart.titleField = title;        chart.valueField = ejeX;        chart.outlineColor = "#FFFFFF";        chart.outlineAlpha = 0.8;        chart.outlineThickness = 2;        chart.pullOutOnlyOne = true;        chart.labelTexto = labelTexto;        /* <--- titulo de cada parte del gráfico */        chart.balloonTex = "[[title]]<br><span style='font-size:11px'><b>[[value]]</b> ([[percents]]%)</span>";        chart.pathToImages = this.urlImages;        chart.categoryField = ejey;        chart.language = "es";        chart.numberFormatter = this.formatNumber();        /* */        chart.labelRadius = 5;        chart.radius = "35%";        chart.innerRadius = "60%";        chart.dataDateFormat = "YYYY-MM-DD HH:NN";        this.animation(chart, true);        this.legend(chart);        //chart.exportConfig = this.export();        chart.dataProvider = data;        //chart.addListener("clickSlice", eventClick2);        chart.write(div);    };    this.trackingDetalle = function (chart, div, data, ejeX, ejey, title, labelTexto) {        labelTexto = typeof labelTexto !== 'undefined' || labelTexto != null ? labelTexto : '';        chart.titleField = title;        chart.valueField = ejeX;        chart.outlineColor = "#FFFFFF";        chart.outlineAlpha = 0.8;        chart.outlineThickness = 2;        chart.pullOutOnlyOne = true;        chart.labelTexto = labelTexto;        /* <--- titulo de cada parte del gráfico */        chart.balloonTex = "[[title]]<br><span style='font-size:11px'><b>[[value]]</b> ([[percents]]%)</span>";        chart.pathToImages = this.urlImages;        chart.categoryField = ejey;        chart.language = "es";        chart.numberFormatter = this.formatNumber();        /* */        chart.labelRadius = 5;        chart.radius = "35%";        chart.innerRadius = "60%";        chart.dataDateFormat = "YYYY-MM-DD HH:NN";        this.animation(chart, true);        this.legend(chart);        //chart.exportConfig = this.export();        chart.dataProvider = data;        chart.write(div);    };    this.semestral = function (chart, div, data, ejeX, ejey, title, labelTexto) {        labelTexto = typeof labelTexto !== 'undefined' || labelTexto != null ? labelTexto : '';        chart.pathToImages = this.urlImages;        chart.categoryField = ejey;        /* <--- */        chart.language = "es";        chart.numberFormatter = this.formatNumber();        chart.dataDateFormat = "YYYY-MM";        var chartScrollbar = new AmCharts.ChartScrollbar();        chartScrollbar.updateOnReleaseOnly = true;        chartScrollbar.autoGridCount = true;        chartScrollbar.scrollbarHeight = 20;        chart.addChartScrollbar(chartScrollbar);        var valueAxis = new AmCharts.ValueAxis();        valueAxis.dashLength = 1;        valueAxis.axisColor = "#DADADA";        valueAxis.axisAlpha = 1;        /* valueAxis.unit = "$"; */        valueAxis.unitPosition = "left";        chart.addValueAxis(valueAxis);        var count = 0;        angular.forEach(data.graphs, function (v, k) {            var graph = new AmCharts.AmGraph();            var color = '#' + Math.floor(Math.random() * 16777215).toString(16);            graph.title = v;            graph.balloonText = "<span style='font-size:13px;'>[[title]] en [[category]]: <b>[[value]]</b></span>";            graph.type = "line";            graph.valueField = v;            /* <--- */            graph.lineColor = color;            graph.lineThickness = 3;            graph.bullet = "round";            graph.bulletColor = color;            graph.bulletBorderColor = "#ffffff";            graph.bulletBorderAlpha = 1;            graph.bulletBorderThickness = 3;            graph.bulletSize = 15;            if (count > 2) {                graph.hidden = true;            }            chart.addGraph(graph);            count++;        });        chart.dataProvider = data.data;        this.animation(chart, false);        this.legend(chart);        this.categoryAxis(chart, true);        var chartCursor = new AmCharts.ChartCursor();        chart.addChartCursor(chartCursor);        //chart.exportConfig = this.export();        chart.addListener("clickGraphItem", eventClick);        chart.write(div);    };    function eventClick(event) {        console.log(event);        var date = event.item.dataContext.fecha;        var campana = event.item.dataContext.idcampana;        var data = {date: date, campana: campana, negocio: event.item.dataContext.nombreNegocio};        if (storageService.isSupported) {            if (storageService.create('searchTracking', data)) {                $window.location.href = rootFactory.root + '/dashboard/informe/';            }        } else {            $http.post(rootFactory.root + '/dashboard/setSearchTracking', data).            success(function (data) {                console.log('NonSupported');        //console.log(data);    });        }    }    /**    *    * @param chart    * @param div    * @param data    * @param ejeX    * @param ejey    * @param title    * @param labelTexto    */    this.dots = function (chart, div, data, ejeX, ejey, title, labelTexto) {        labelTexto = typeof labelTexto !== 'undefined' || labelTexto != null ? labelTexto : '';        chart.pathToImages = this.urlImages;        chart.categoryField = ejey;        /* <--- */        chart.language = "es";        chart.numberFormatter = this.formatNumber();        chart.dataDateFormat = "YYYY-MM";        this.categoryAxis(chart, true);        var valueAxis = new AmCharts.ValueAxis();        valueAxis.dashLength = 1;        valueAxis.axisColor = "#DADADA";        valueAxis.axisAlpha = 1;        /* valueAxis.unit = "$"; */        valueAxis.unitPosition = "left";        chart.addValueAxis(valueAxis);        this.animation(chart, false);        this.legend(chart);        var graph = new AmCharts.AmGraph();        graph.title = title;        graph.balloonText = "<span style='font-size:13px;'>[[title]] en [[category]]: <b>[[value]]</b></span>";        graph.type = "line";        graph.valueField = ejeX;        /* <--- */        graph.lineColor = "#60c6cf";        graph.lineThickness = 3;        graph.bullet = "round";        graph.bulletColor = "#60c6cf";        graph.bulletBorderColor = "#ffffff";        graph.bulletBorderAlpha = 1;        graph.bulletBorderThickness = 3;        graph.dashLengthLine = "dashLengthLine";        graph.bulletSize = 15;        chart.addGraph(graph);        //chart.exportConfig = this.export();        var chartCursor = new AmCharts.ChartCursor();        chart.addChartCursor(chartCursor);        chart.dataProvider = data;        chart.write(div);    };    this.animation = function (chart, bool) {        if (bool) {            chart.sequencedAnimation = true;            chart.startDuration = 1;            chart.startAlpha = 0;        } else {            chart.sequencedAnimation = false;            chart.startDuration = 0;            chart.startAlpha = 0;        }    };    this.export = function () {        var exportConfig = {            menuTop: "-10px",            menuBottom: "0px",            menuRight: "0px",            backgroundColor: "#efefef",            menuItems: [{                textAlign: 'center',                icon: this.urlImages + 'export.png',                items: [{                    title: 'JPG',                    format: 'jpg'                }, {                    title: 'PNG',                    format: 'png'                }, {                    title: 'SVG',                    format: 'svg'                }, {                    title: 'PDF',                    format: 'pdf'                }]            }]        };        return exportConfig;    };    this.legend = function (chart, legenddiv, text) {        legenddiv = typeof legenddiv !== 'undefined' && legenddiv.length != 0 ? legenddiv : false;        text = typeof text !== 'undefined' && text.length != 0 ? text : false;        var legend = new AmCharts.AmLegend();        legend.align = "center";        legend.markerType = "circle";        legend.valueText = "";        legend.useGraphSettings = false;        if (!text) {            legend.labelTexto = "[[title]]";        } else {            legend.labelTexto = text;        }        if (!legenddiv) {            chart.addLegend(legend);        } else {            chart.addLegend(legend, legenddiv);        }    };    this.margin = function (chart) {        chart.autoMargins = false;        chart.marginRight = 10;        chart.marginLeft = 80;        chart.marginBottom = 20;        chart.marginTop = 20;    };    this.formatNumber = function () {        return {            decimalSeparator: ",",            thousandsSeparator: ".",            precision: parseInt(-1)        };    };    this.categoryAxis = function (chart, parse) {        parse = typeof parse !== 'undefined' && parse.length != 0 ? parse : true;        var categoryAxis = chart.categoryAxis;        categoryAxis.inside = false;        categoryAxis.axisAlpha = 0;        categoryAxis.gridAlpha = 0;        categoryAxis.tickLength = 0;        categoryAxis.minPeriod = "MM";        categoryAxis.equalSpacing = false;        categoryAxis.equalSpacing = true;        categoryAxis.boldPeriodBeginning = true;        if (parse) {            categoryAxis.parseDates = true;            /*            //categoryAxis.dateFormats = [            //    {            //        period: 'fff',            //        format: 'JJ:NN:SS'            //    }, {            //        period: 'ss',            //        format: 'JJ:NN:SS'            //    }, {            //        period: 'mm',            //        format: 'JJ:NN'            //    }, {            //        period: 'hh',            //        format: 'JJ:NN'            //    }, {            //        period: 'DD',            //        format: 'MMM DD'            //    }, {            //        period: 'WW',            //        format: 'MMM DD'            //    }, {            //        period: 'MM',            //        format: 'MMM YYYY'            //    }, {            //        period: 'YYYY',            //        format: 'MMM YYYY'            //    }            //];            */        }    };    this.exportGraphToFormat = function (chart, format, fileName) {        var exp = new AmCharts.AmExport(chart);        exp.init();        exp.output({            format: format,            output: 'save',            backgroundColor: '#FFFFFF',            fileName: fileName,            dpi: 90        });            //exp.userCFG = {            //    menuTop: 'auto',            //    menuLeft: 'auto',            //    menuRight: '0px',            //    menuBottom: '0px',            //    menuItems: [{            //        textAlign: 'center',            //        icon: '../amcharts/images/export.png',            //        iconTitle: 'Save chart as an image',            //        onclick: function () {            //        },            //        items: [{            //            title: 'JPG',            //            format: 'jpg'            //        }, {            //            title: 'PNG',            //            format: 'png'            //        }, {            //            title: 'SVG',            //            format: 'svg'            //        }]            //    }],            //    menuItemStyle: {            //        backgroundColor: 'transparent',            //        opacity: 1,            //        rollOverBackgroundColor: '#EFEFEF',            //        color: '#000000',            //        rollOverColor: '#CC0000',            //        paddingTop: '6px',            //        paddingRight: '6px',            //        paddingBottom: '6px',            //        paddingLeft: '6px',            //        marginTop: '0px',            //        marginRight: '0px',            //        marginBottom: '0px',            //        marginLeft: '0px',            //        textAlign: 'left',            //        textDecoration: 'none',            //        fontFamily: 'Arial', // Default: charts default            //        fontSize: '12px', // Default: charts default            //    },            //    menuItemOutput: {            //        backgroundColor: '#FFFFFF',            //        fileName: 'amCharts',            //        format: 'png',            //        output: 'dataurlnewwindow',            //        render: 'browser',            //        dpi: 90,            //        onclick: function (instance, config, event) {            //            event.preventDefault();            //            instance.output(config);            //        }            //    },            //    removeImagery: true            //}        }    }]);/* Storage Service */ameis.factory('storageService', ['localStorageService', function (localStorageService) {    var storage = {        create: function (key, val) {            return localStorageService.set(key, val);        },        getItem: function (key) {            return localStorageService.get(key);        },        removeItem: function (key) {            return localStorageService.remove(key);        },        clearNumbers: function () {            return localStorageService.clearAll(/^\d+$/);        },        clearAll: function () {            return localStorageService.clearAll();        },        getLength: function () {            return localStorageService.length();        },        getKeys: function () {            return localStorageService.keys();        },        isSupported: function () {            if (localStorageService.isSupported) {                return true;            }            return false;        }    };    return storage;}]);