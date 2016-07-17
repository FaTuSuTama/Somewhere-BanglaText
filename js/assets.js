var app = app || {};
app.BloggerSearch = Backbone.Model.extend({
    initialize: function() {},
    defaults: {
        nickname: "",
        name: ""
    }
});
var app = app || {};
app.BloggerSearch = Backbone.Collection.extend({
    model: app.BloggerSearch,
    url: "/bloggerSearch"
});
var app = app || {};
app.BloggerSearchResultView = Backbone.View.extend({
    tagName: "div",
    className: "blogger-search-result",
    template: _.template('<% if(nickname!=0) { %><a href="/blog/<%= nickname %>" target="_blank"><%= name %></a><br/><% } else { %>no result found.<% } %>'),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this
    }
});
var app = app || {};
app.BloggerSearchResultsView = Backbone.View.extend({
    el: "#BloggerSearchResult",
    initialize: function() {
        this.collection = new app.BloggerSearch();
        this.collection.on("sync", this.render, this);
        params = {
            q: $("#search_box").val()
        };
        this.collection.fetch({
            data: $.param(params),
            type: "POST"
        })
    },
    render: function() {
        this.$el.html("");
        this.collection.each(function(a) {
            this.renderBlogger(a)
        }, this)
    },
    renderBlogger: function(b) {
        var a = new app.BloggerSearchResultView({
            model: b
        });
        this.$el.append(a.render().el)
    }
});
var app = app || {};
app.Notification = Backbone.Model.extend({
    defaults: {
        text: "",
        link: "",
        status: ""
    }
});
var app = app || {};
app.NotificationList = Backbone.Collection.extend({
    model: app.Notification,
    url: "/notificationList"
});
var app = app || {};
app.NotificationListView = Backbone.View.extend({
    el: "#notification-list",
    initialize: function() {
        this.collection = new app.NotificationList();
        this.listenTo(this.collection, "request", this.showLoading);
        this.listenTo(this.collection, "sync", this.hideLoading);
        this.collection.on("sync", this.render, this);
        this.getNotifications()
    },
    getNotifications: function() {
        this.collection.fetch({
            data: {
                blog: "swi"
            },
            type: "POST"
        })
    },
    render: function() {
        this.$el.html("");
        var a = 0;
        if (this.collection.length > 0) {
            this.collection.every(function(b) {
                this.renderNotification(b);
                if (a == 3) {
                    return false
                }
                a++
            }, this);
            this.$el.append('<div class="text-center prepand2"><a href="/notificationList/all" class="more">à¦†à¦°à¦“ à¦¦à§‡à¦–à§à¦¨</a></div>')
        } else {
            this.$el.append("<li>0 à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨</li>")
        }
    },
    renderNotification: function(a) {
        var b = new app.NotificationView({
            model: a
        });
        this.$el.prepend(b.render().el)
    },
    showLoading: function() {
        this.$el.html("Loading...")
    },
    hideLoading: function() {}
});
var app = app || {};
app.NotificationView = Backbone.View.extend({
    tagName: "div",
    className: "",
    template: _.template('<li class="<%= status==1?\'unread\':\'read\' %>"><a id="notification_popover_link" href="<%= link %>" target="_blank"><%= text %></a><li>'),
    render: function() {
        this.$el.prepend(this.template(this.model.attributes));
        return this
    }
});
var app = app || {};
app.OnlineVisitor = Backbone.Model.extend({
    defaults: {
        userName: "Unknown",
        userProfileUrl: "http://www.somewhereinblog.net/",
        showUserImage: 0,
        userImageUrl: "http://s3.amazonaws.com/somewherein/pictures/head_comm.gif"
    }
});
var app = app || {};
app.OnlineVisitorList = Backbone.Collection.extend({
    model: app.OnlineVisitor,
    url: function() {
        return "/online-visitors"
    }
});
var app = app || {};
app.OnlineVisitorView = Backbone.View.extend({
    tagName: "li",
    template: _.template("<a href='<%= userProfileUrl %>'' title='<%= userName %>''><% if(showUserImage == 1) { %><img src='<%= userImageUrl %>' width='50' height='50' alt='<%= userName %>' /><% } else { %><%=userName %> <% } %></a>"),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this
    }
});
var app = app || {};
app.OnlineVisitorListView = Backbone.View.extend({
    el: "#online_users",
    tagName: "ui",
    initialize: function() {
        this.collection = new app.OnlineVisitorList();
        this.listenTo(this.collection, "request", this.showSpinner);
        this.listenTo(this.collection, "sync", this.render);
        this.getVisitors()
    },
    getVisitors: function() {
        this.collection.fetch({
            data: {
                blog: "swi"
            },
            type: "POST"
        })
    },
    render: function() {
        this.collection.each(function(a) {
            temp = a.toJSON();
            if (temp.userName != "Unknown") {
                this.renderVisitor(a)
            }
        }, this);
        if (this.collection.length > 0) {
            first_online_obj = this.collection.first().toJSON();
            if (first_online_obj) {
                $("#online_blogger_num").text(first_online_obj.loggedinUser);
                $("#online_visitor_num").text(first_online_obj.visitor);
                $("#online_mobile_visitor_num").text(first_online_obj.mobileUser)
            }
        }
        $("#online_users_loading").hide();
        online_users_busy = 0
    },
    renderVisitor: function(b) {
        var a = new app.OnlineVisitorView({
            model: b
        });
        this.$el.append(a.render().el)
    },
    showSpinner: function() {
        online_users_busy = 1;
        $("#online_users_loading").show()
    }
});
(function(j, f) {
    var c = j(window);

    function n() {
        return new Date(Date.UTC.apply(Date, arguments))
    }

    function g() {
        var q = new Date();
        return n(q.getFullYear(), q.getMonth(), q.getDate())
    }

    function l(q) {
        return function() {
            return this[q].apply(this, arguments)
        }
    }
    var e = (function() {
        var q = {
            get: function(r) {
                return this.slice(r)[0]
            },
            contains: function(u) {
                var t = u && u.valueOf();
                for (var s = 0, r = this.length; s < r; s++) {
                    if (this[s].valueOf() === t) {
                        return s
                    }
                }
                return -1
            },
            remove: function(r) {
                this.splice(r, 1)
            },
            replace: function(r) {
                if (!r) {
                    return
                }
                if (!j.isArray(r)) {
                    r = [r]
                }
                this.clear();
                this.push.apply(this, r)
            },
            clear: function() {
                this.length = 0
            },
            copy: function() {
                var r = new e();
                r.replace(this);
                return r
            }
        };
        return function() {
            var r = [];
            r.push.apply(r, arguments);
            j.extend(r, q);
            return r
        }
    })();
    var k = function(r, q) {
        this.dates = new e();
        this.viewDate = g();
        this.focusDate = null;
        this._process_options(q);
        this.element = j(r);
        this.isInline = false;
        this.isInput = this.element.is("input");
        this.component = this.element.is(".date") ? this.element.find(".add-on, .input-group-addon, .btn") : false;
        this.hasInput = this.component && this.element.find("input").length;
        if (this.component && this.component.length === 0) {
            this.component = false
        }
        this.picker = j(m.template);
        this._buildEvents();
        this._attachEvents();
        if (this.isInline) {
            this.picker.addClass("datepicker-inline").appendTo(this.element)
        } else {
            this.picker.addClass("datepicker-dropdown dropdown-menu")
        }
        if (this.o.rtl) {
            this.picker.addClass("datepicker-rtl")
        }
        this.viewMode = this.o.startView;
        if (this.o.calendarWeeks) {
            this.picker.find("tfoot th.today").attr("colspan", function(s, t) {
                return parseInt(t) + 1
            })
        }
        this._allow_update = false;
        this.setStartDate(this._o.startDate);
        this.setEndDate(this._o.endDate);
        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
        this.fillDow();
        this.fillMonths();
        this._allow_update = true;
        this.update();
        this.showMode();
        if (this.isInline) {
            this.show()
        }
    };
    k.prototype = {
        constructor: k,
        _process_options: function(q) {
            this._o = j.extend({}, this._o, q);
            var u = this.o = j.extend({}, this._o);
            var t = u.language;
            if (!b[t]) {
                t = t.split("-")[0];
                if (!b[t]) {
                    t = h.language
                }
            }
            u.language = t;
            switch (u.startView) {
                case 2:
                case "decade":
                    u.startView = 2;
                    break;
                case 1:
                case "year":
                    u.startView = 1;
                    break;
                default:
                    u.startView = 0
            }
            switch (u.minViewMode) {
                case 1:
                case "months":
                    u.minViewMode = 1;
                    break;
                case 2:
                case "years":
                    u.minViewMode = 2;
                    break;
                default:
                    u.minViewMode = 0
            }
            u.startView = Math.max(u.startView, u.minViewMode);
            if (u.multidate !== true) {
                u.multidate = Number(u.multidate) || false;
                if (u.multidate !== false) {
                    u.multidate = Math.max(0, u.multidate)
                } else {
                    u.multidate = 1
                }
            }
            u.multidateSeparator = String(u.multidateSeparator);
            u.weekStart %= 7;
            u.weekEnd = ((u.weekStart + 6) % 7);
            var r = m.parseFormat(u.format);
            if (u.startDate !== -Infinity) {
                if (!!u.startDate) {
                    if (u.startDate instanceof Date) {
                        u.startDate = this._local_to_utc(this._zero_time(u.startDate))
                    } else {
                        u.startDate = m.parseDate(u.startDate, r, u.language)
                    }
                } else {
                    u.startDate = -Infinity
                }
            }
            if (u.endDate !== Infinity) {
                if (!!u.endDate) {
                    if (u.endDate instanceof Date) {
                        u.endDate = this._local_to_utc(this._zero_time(u.endDate))
                    } else {
                        u.endDate = m.parseDate(u.endDate, r, u.language)
                    }
                } else {
                    u.endDate = Infinity
                }
            }
            u.daysOfWeekDisabled = u.daysOfWeekDisabled || [];
            if (!j.isArray(u.daysOfWeekDisabled)) {
                u.daysOfWeekDisabled = u.daysOfWeekDisabled.split(/[,\s]*/)
            }
            u.daysOfWeekDisabled = j.map(u.daysOfWeekDisabled, function(w) {
                return parseInt(w, 10)
            });
            var s = String(u.orientation).toLowerCase().split(/\s+/g),
                v = u.orientation.toLowerCase();
            s = j.grep(s, function(w) {
                return (/^auto|left|right|top|bottom$/).test(w)
            });
            u.orientation = {
                x: "auto",
                y: "auto"
            };
            if (!v || v === "auto") {} else {
                if (s.length === 1) {
                    switch (s[0]) {
                        case "top":
                        case "bottom":
                            u.orientation.y = s[0];
                            break;
                        case "left":
                        case "right":
                            u.orientation.x = s[0];
                            break
                    }
                } else {
                    v = j.grep(s, function(w) {
                        return (/^left|right$/).test(w)
                    });
                    u.orientation.x = v[0] || "auto";
                    v = j.grep(s, function(w) {
                        return (/^top|bottom$/).test(w)
                    });
                    u.orientation.y = v[0] || "auto"
                }
            }
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(q) {
            for (var r = 0, t, s, u; r < q.length; r++) {
                t = q[r][0];
                if (q[r].length === 2) {
                    s = f;
                    u = q[r][1]
                } else {
                    if (q[r].length === 3) {
                        s = q[r][1];
                        u = q[r][2]
                    }
                }
                t.on(u, s)
            }
        },
        _unapplyEvents: function(q) {
            for (var r = 0, t, u, s; r < q.length; r++) {
                t = q[r][0];
                if (q[r].length === 2) {
                    s = f;
                    u = q[r][1]
                } else {
                    if (q[r].length === 3) {
                        s = q[r][1];
                        u = q[r][2]
                    }
                }
                t.off(u, s)
            }
        },
        _buildEvents: function() {
            if (this.isInput) {
                this._events = [
                    [this.element, {
                        focus: j.proxy(this.show, this),
                        keyup: j.proxy(function(q) {
                            if (j.inArray(q.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1) {
                                this.update()
                            }
                        }, this),
                        keydown: j.proxy(this.keydown, this)
                    }]
                ]
            } else {
                if (this.component && this.hasInput) {
                    this._events = [
                        [this.element.find("input"), {
                            focus: j.proxy(this.show, this),
                            keyup: j.proxy(function(q) {
                                if (j.inArray(q.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1) {
                                    this.update()
                                }
                            }, this),
                            keydown: j.proxy(this.keydown, this)
                        }],
                        [this.component, {
                            click: j.proxy(this.show, this)
                        }]
                    ]
                } else {
                    if (this.element.is("div")) {
                        this.isInline = true
                    } else {
                        this._events = [
                            [this.element, {
                                click: j.proxy(this.show, this)
                            }]
                        ]
                    }
                }
            }
            this._events.push([this.element, "*", {
                blur: j.proxy(function(q) {
                    this._focused_from = q.target
                }, this)
            }], [this.element, {
                blur: j.proxy(function(q) {
                    this._focused_from = q.target
                }, this)
            }]);
            this._secondaryEvents = [
                [this.picker, {
                    click: j.proxy(this.click, this)
                }],
                [j(window), {
                    resize: j.proxy(this.place, this)
                }],
                [j(document), {
                    "mousedown touchstart": j.proxy(function(q) {
                        if (!(this.element.is(q.target) || this.element.find(q.target).length || this.picker.is(q.target) || this.picker.find(q.target).length)) {
                            this.hide()
                        }
                    }, this)
                }]
            ]
        },
        _attachEvents: function() {
            this._detachEvents();
            this._applyEvents(this._events)
        },
        _detachEvents: function() {
            this._unapplyEvents(this._events)
        },
        _attachSecondaryEvents: function() {
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents)
        },
        _detachSecondaryEvents: function() {
            this._unapplyEvents(this._secondaryEvents)
        },
        _trigger: function(s, t) {
            var r = t || this.dates.get(-1),
                q = this._utc_to_local(r);
            this.element.trigger({
                type: s,
                date: q,
                dates: j.map(this.dates, this._utc_to_local),
                format: j.proxy(function(u, w) {
                    if (arguments.length === 0) {
                        u = this.dates.length - 1;
                        w = this.o.format
                    } else {
                        if (typeof u === "string") {
                            w = u;
                            u = this.dates.length - 1
                        }
                    }
                    w = w || this.o.format;
                    var v = this.dates.get(u);
                    return m.formatDate(v, w, this.o.language)
                }, this)
            })
        },
        show: function() {
            if (!this.isInline) {
                this.picker.appendTo("body")
            }
            this.picker.show();
            this.place();
            this._attachSecondaryEvents();
            this._trigger("show")
        },
        hide: function() {
            if (this.isInline) {
                return
            }
            if (!this.picker.is(":visible")) {
                return
            }
            this.focusDate = null;
            this.picker.hide().detach();
            this._detachSecondaryEvents();
            this.viewMode = this.o.startView;
            this.showMode();
            if (this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val())) {
                this.setValue()
            }
            this._trigger("hide")
        },
        remove: function() {
            this.hide();
            this._detachEvents();
            this._detachSecondaryEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
            if (!this.isInput) {
                delete this.element.data().date
            }
        },
        _utc_to_local: function(q) {
            return q && new Date(q.getTime() + (q.getTimezoneOffset() * 60000))
        },
        _local_to_utc: function(q) {
            return q && new Date(q.getTime() - (q.getTimezoneOffset() * 60000))
        },
        _zero_time: function(q) {
            return q && new Date(q.getFullYear(), q.getMonth(), q.getDate())
        },
        _zero_utc_time: function(q) {
            return q && new Date(Date.UTC(q.getUTCFullYear(), q.getUTCMonth(), q.getUTCDate()))
        },
        getDates: function() {
            return j.map(this.dates, this._utc_to_local)
        },
        getUTCDates: function() {
            return j.map(this.dates, function(q) {
                return new Date(q)
            })
        },
        getDate: function() {
            return this._utc_to_local(this.getUTCDate())
        },
        getUTCDate: function() {
            return new Date(this.dates.get(-1))
        },
        setDates: function() {
            var q = j.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, q);
            this._trigger("changeDate");
            this.setValue()
        },
        setUTCDates: function() {
            var q = j.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, j.map(q, this._utc_to_local));
            this._trigger("changeDate");
            this.setValue()
        },
        setDate: l("setDates"),
        setUTCDate: l("setUTCDates"),
        setValue: function() {
            var q = this.getFormattedDate();
            if (!this.isInput) {
                if (this.component) {
                    this.element.find("input").val(q).change()
                }
            } else {
                this.element.val(q).change()
            }
        },
        getFormattedDate: function(q) {
            if (q === f) {
                q = this.o.format
            }
            var r = this.o.language;
            return j.map(this.dates, function(s) {
                return m.formatDate(s, q, r)
            }).join(this.o.multidateSeparator)
        },
        setStartDate: function(q) {
            this._process_options({
                startDate: q
            });
            this.update();
            this.updateNavArrows()
        },
        setEndDate: function(q) {
            this._process_options({
                endDate: q
            });
            this.update();
            this.updateNavArrows()
        },
        setDaysOfWeekDisabled: function(q) {
            this._process_options({
                daysOfWeekDisabled: q
            });
            this.update();
            this.updateNavArrows()
        },
        place: function() {
            if (this.isInline) {
                return
            }
            var E = this.picker.outerWidth(),
                A = this.picker.outerHeight(),
                u = 10,
                w = c.width(),
                r = c.height(),
                v = c.scrollTop();
            var C = parseInt(this.element.parents().filter(function() {
                return j(this).css("z-index") !== "auto"
            }).first().css("z-index")) + 10;
            var z = this.component ? this.component.parent().offset() : this.element.offset();
            var D = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
            var t = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
            var y = z.left,
                B = z.top;
            this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left");
            if (this.o.orientation.x !== "auto") {
                this.picker.addClass("datepicker-orient-" + this.o.orientation.x);
                if (this.o.orientation.x === "right") {
                    y -= E - t
                }
            } else {
                this.picker.addClass("datepicker-orient-left");
                if (z.left < 0) {
                    y -= z.left - u
                } else {
                    if (z.left + E > w) {
                        y = w - E - u
                    }
                }
            }
            var q = this.o.orientation.y,
                s, x;
            if (q === "auto") {
                s = -v + z.top - A;
                x = v + r - (z.top + D + A);
                if (Math.max(s, x) === x) {
                    q = "top"
                } else {
                    q = "bottom"
                }
            }
            this.picker.addClass("datepicker-orient-" + q);
            if (q === "top") {
                B += D
            } else {
                B -= A + parseInt(this.picker.css("padding-top"))
            }
            this.picker.css({
                top: B,
                left: y,
                zIndex: C
            })
        },
        _allow_update: true,
        update: function() {
            if (!this._allow_update) {
                return
            }
            var r = this.dates.copy(),
                s = [],
                q = false;
            if (arguments.length) {
                j.each(arguments, j.proxy(function(u, t) {
                    if (t instanceof Date) {
                        t = this._local_to_utc(t)
                    }
                    s.push(t)
                }, this));
                q = true
            } else {
                s = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val();
                if (s && this.o.multidate) {
                    s = s.split(this.o.multidateSeparator)
                } else {
                    s = [s]
                }
                delete this.element.data().date
            }
            s = j.map(s, j.proxy(function(t) {
                return m.parseDate(t, this.o.format, this.o.language)
            }, this));
            s = j.grep(s, j.proxy(function(t) {
                return (t < this.o.startDate || t > this.o.endDate || !t)
            }, this), true);
            this.dates.replace(s);
            if (this.dates.length) {
                this.viewDate = new Date(this.dates.get(-1))
            } else {
                if (this.viewDate < this.o.startDate) {
                    this.viewDate = new Date(this.o.startDate)
                } else {
                    if (this.viewDate > this.o.endDate) {
                        this.viewDate = new Date(this.o.endDate)
                    }
                }
            }
            if (q) {
                this.setValue()
            } else {
                if (s.length) {
                    if (String(r) !== String(this.dates)) {
                        this._trigger("changeDate")
                    }
                }
            }
            if (!this.dates.length && r.length) {
                this._trigger("clearDate")
            }
            this.fill()
        },
        fillDow: function() {
            var r = this.o.weekStart,
                s = "<tr>";
            if (this.o.calendarWeeks) {
                var q = '<th class="cw">&nbsp;</th>';
                s += q;
                this.picker.find(".datepicker-days thead tr:first-child").prepend(q)
            }
            while (r < this.o.weekStart + 7) {
                s += '<th class="dow">' + b[this.o.language].daysMin[(r++) % 7] + "</th>"
            }
            s += "</tr>";
            this.picker.find(".datepicker-days thead").append(s)
        },
        fillMonths: function() {
            var r = "",
                q = 0;
            while (q < 12) {
                r += '<span class="month">' + b[this.o.language].monthsShort[q++] + "</span>"
            }
            this.picker.find(".datepicker-months td").html(r)
        },
        setRange: function(q) {
            if (!q || !q.length) {
                delete this.range
            } else {
                this.range = j.map(q, function(r) {
                    return r.valueOf()
                })
            }
            this.fill()
        },
        getClassNames: function(s) {
            var q = [],
                t = this.viewDate.getUTCFullYear(),
                u = this.viewDate.getUTCMonth(),
                r = new Date();
            if (s.getUTCFullYear() < t || (s.getUTCFullYear() === t && s.getUTCMonth() < u)) {
                q.push("old")
            } else {
                if (s.getUTCFullYear() > t || (s.getUTCFullYear() === t && s.getUTCMonth() > u)) {
                    q.push("new")
                }
            }
            if (this.focusDate && s.valueOf() === this.focusDate.valueOf()) {
                q.push("focused")
            }
            if (this.o.todayHighlight && s.getUTCFullYear() === r.getFullYear() && s.getUTCMonth() === r.getMonth() && s.getUTCDate() === r.getDate()) {
                q.push("today")
            }
            if (this.dates.contains(s) !== -1) {
                q.push("active")
            }
            if (s.valueOf() < this.o.startDate || s.valueOf() > this.o.endDate || j.inArray(s.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
                q.push("disabled")
            }
            if (this.range) {
                if (s > this.range[0] && s < this.range[this.range.length - 1]) {
                    q.push("range")
                }
                if (j.inArray(s.valueOf(), this.range) !== -1) {
                    q.push("selected")
                }
            }
            return q
        },
        fill: function() {
            var L = new Date(this.viewDate),
                A = L.getUTCFullYear(),
                M = L.getUTCMonth(),
                F = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                J = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                x = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                G = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                y = b[this.o.language].today || b.en.today || "",
                s = b[this.o.language].clear || b.en.clear || "",
                u;
            this.picker.find(".datepicker-days thead th.datepicker-switch").text(b[this.o.language].months[M] + " " + A);
            this.picker.find("tfoot th.today").text(y).toggle(this.o.todayBtn !== false);
            this.picker.find("tfoot th.clear").text(s).toggle(this.o.clearBtn !== false);
            this.updateNavArrows();
            this.fillMonths();
            var O = n(A, M - 1, 28),
                I = m.getDaysInMonth(O.getUTCFullYear(), O.getUTCMonth());
            O.setUTCDate(I);
            O.setUTCDate(I - (O.getUTCDay() - this.o.weekStart + 7) % 7);
            var q = new Date(O);
            q.setUTCDate(q.getUTCDate() + 42);
            q = q.valueOf();
            var z = [];
            var D;
            while (O.valueOf() < q) {
                if (O.getUTCDay() === this.o.weekStart) {
                    z.push("<tr>");
                    if (this.o.calendarWeeks) {
                        var r = new Date(+O + (this.o.weekStart - O.getUTCDay() - 7) % 7 * 86400000),
                            v = new Date(Number(r) + (7 + 4 - r.getUTCDay()) % 7 * 86400000),
                            t = new Date(Number(t = n(v.getUTCFullYear(), 0, 1)) + (7 + 4 - t.getUTCDay()) % 7 * 86400000),
                            B = (v - t) / 86400000 / 7 + 1;
                        z.push('<td class="cw">' + B + "</td>")
                    }
                }
                D = this.getClassNames(O);
                D.push("day");
                if (this.o.beforeShowDay !== j.noop) {
                    var C = this.o.beforeShowDay(this._utc_to_local(O));
                    if (C === f) {
                        C = {}
                    } else {
                        if (typeof(C) === "boolean") {
                            C = {
                                enabled: C
                            }
                        } else {
                            if (typeof(C) === "string") {
                                C = {
                                    classes: C
                                }
                            }
                        }
                    }
                    if (C.enabled === false) {
                        D.push("disabled")
                    }
                    if (C.classes) {
                        D = D.concat(C.classes.split(/\s+/))
                    }
                    if (C.tooltip) {
                        u = C.tooltip
                    }
                }
                D = j.unique(D);
                z.push('<td class="' + D.join(" ") + '"' + (u ? ' title="' + u + '"' : "") + ">" + O.getUTCDate() + "</td>");
                if (O.getUTCDay() === this.o.weekEnd) {
                    z.push("</tr>")
                }
                O.setUTCDate(O.getUTCDate() + 1)
            }
            this.picker.find(".datepicker-days tbody").empty().append(z.join(""));
            var w = this.picker.find(".datepicker-months").find("th:eq(1)").text(A).end().find("span").removeClass("active");
            j.each(this.dates, function(P, Q) {
                if (Q.getUTCFullYear() === A) {
                    w.eq(Q.getUTCMonth()).addClass("active")
                }
            });
            if (A < F || A > x) {
                w.addClass("disabled")
            }
            if (A === F) {
                w.slice(0, J).addClass("disabled")
            }
            if (A === x) {
                w.slice(G + 1).addClass("disabled")
            }
            z = "";
            A = parseInt(A / 10, 10) * 10;
            var N = this.picker.find(".datepicker-years").find("th:eq(1)").text(A + "-" + (A + 9)).end().find("td");
            A -= 1;
            var E = j.map(this.dates, function(P) {
                    return P.getUTCFullYear()
                }),
                K;
            for (var H = -1; H < 11; H++) {
                K = ["year"];
                if (H === -1) {
                    K.push("old")
                } else {
                    if (H === 10) {
                        K.push("new")
                    }
                }
                if (j.inArray(A, E) !== -1) {
                    K.push("active")
                }
                if (A < F || A > x) {
                    K.push("disabled")
                }
                z += '<span class="' + K.join(" ") + '">' + A + "</span>";
                A += 1
            }
            N.html(z)
        },
        updateNavArrows: function() {
            if (!this._allow_update) {
                return
            }
            var s = new Date(this.viewDate),
                q = s.getUTCFullYear(),
                r = s.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    if (this.o.startDate !== -Infinity && q <= this.o.startDate.getUTCFullYear() && r <= this.o.startDate.getUTCMonth()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        })
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        })
                    }
                    if (this.o.endDate !== Infinity && q >= this.o.endDate.getUTCFullYear() && r >= this.o.endDate.getUTCMonth()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        })
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        })
                    }
                    break;
                case 1:
                case 2:
                    if (this.o.startDate !== -Infinity && q <= this.o.startDate.getUTCFullYear()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        })
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        })
                    }
                    if (this.o.endDate !== Infinity && q >= this.o.endDate.getUTCFullYear()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        })
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        })
                    }
                    break
            }
        },
        click: function(u) {
            u.preventDefault();
            var v = j(u.target).closest("span, td, th"),
                x, w, y;
            if (v.length === 1) {
                switch (v[0].nodeName.toLowerCase()) {
                    case "th":
                        switch (v[0].className) {
                            case "datepicker-switch":
                                this.showMode(1);
                                break;
                            case "prev":
                            case "next":
                                var q = m.modes[this.viewMode].navStep * (v[0].className === "prev" ? -1 : 1);
                                switch (this.viewMode) {
                                    case 0:
                                        this.viewDate = this.moveMonth(this.viewDate, q);
                                        this._trigger("changeMonth", this.viewDate);
                                        break;
                                    case 1:
                                    case 2:
                                        this.viewDate = this.moveYear(this.viewDate, q);
                                        if (this.viewMode === 1) {
                                            this._trigger("changeYear", this.viewDate)
                                        }
                                        break
                                }
                                this.fill();
                                break;
                            case "today":
                                var r = new Date();
                                r = n(r.getFullYear(), r.getMonth(), r.getDate(), 0, 0, 0);
                                this.showMode(-2);
                                var s = this.o.todayBtn === "linked" ? null : "view";
                                this._setDate(r, s);
                                break;
                            case "clear":
                                var t;
                                if (this.isInput) {
                                    t = this.element
                                } else {
                                    if (this.component) {
                                        t = this.element.find("input")
                                    }
                                }
                                if (t) {
                                    t.val("").change()
                                }
                                this.update();
                                this._trigger("changeDate");
                                if (this.o.autoclose) {
                                    this.hide()
                                }
                                break
                        }
                        break;
                    case "span":
                        if (!v.is(".disabled")) {
                            this.viewDate.setUTCDate(1);
                            if (v.is(".month")) {
                                y = 1;
                                w = v.parent().find("span").index(v);
                                x = this.viewDate.getUTCFullYear();
                                this.viewDate.setUTCMonth(w);
                                this._trigger("changeMonth", this.viewDate);
                                if (this.o.minViewMode === 1) {
                                    this._setDate(n(x, w, y))
                                }
                            } else {
                                y = 1;
                                w = 0;
                                x = parseInt(v.text(), 10) || 0;
                                this.viewDate.setUTCFullYear(x);
                                this._trigger("changeYear", this.viewDate);
                                if (this.o.minViewMode === 2) {
                                    this._setDate(n(x, w, y))
                                }
                            }
                            this.showMode(-1);
                            this.fill()
                        }
                        break;
                    case "td":
                        if (v.is(".day") && !v.is(".disabled")) {
                            y = parseInt(v.text(), 10) || 1;
                            x = this.viewDate.getUTCFullYear();
                            w = this.viewDate.getUTCMonth();
                            if (v.is(".old")) {
                                if (w === 0) {
                                    w = 11;
                                    x -= 1
                                } else {
                                    w -= 1
                                }
                            } else {
                                if (v.is(".new")) {
                                    if (w === 11) {
                                        w = 0;
                                        x += 1
                                    } else {
                                        w += 1
                                    }
                                }
                            }
                            this._setDate(n(x, w, y))
                        }
                        break
                }
            }
            if (this.picker.is(":visible") && this._focused_from) {
                j(this._focused_from).focus()
            }
            delete this._focused_from
        },
        _toggle_multidate: function(r) {
            var q = this.dates.contains(r);
            if (!r) {
                this.dates.clear()
            } else {
                if (q !== -1) {
                    this.dates.remove(q)
                } else {
                    this.dates.push(r)
                }
            }
            if (typeof this.o.multidate === "number") {
                while (this.dates.length > this.o.multidate) {
                    this.dates.remove(0)
                }
            }
        },
        _setDate: function(q, s) {
            if (!s || s === "date") {
                this._toggle_multidate(q && new Date(q))
            }
            if (!s || s === "view") {
                this.viewDate = q && new Date(q)
            }
            this.fill();
            this.setValue();
            this._trigger("changeDate");
            var r;
            if (this.isInput) {
                r = this.element
            } else {
                if (this.component) {
                    r = this.element.find("input")
                }
            }
            if (r) {
                r.change()
            }
            if (this.o.autoclose && (!s || s === "date")) {
                this.hide()
            }
        },
        moveMonth: function(q, r) {
            if (!q) {
                return f
            }
            if (!r) {
                return q
            }
            var u = new Date(q.valueOf()),
                y = u.getUTCDate(),
                v = u.getUTCMonth(),
                t = Math.abs(r),
                x, w;
            r = r > 0 ? 1 : -1;
            if (t === 1) {
                w = r === -1 ? function() {
                    return u.getUTCMonth() === v
                } : function() {
                    return u.getUTCMonth() !== x
                };
                x = v + r;
                u.setUTCMonth(x);
                if (x < 0 || x > 11) {
                    x = (x + 12) % 12
                }
            } else {
                for (var s = 0; s < t; s++) {
                    u = this.moveMonth(u, r)
                }
                x = u.getUTCMonth();
                u.setUTCDate(y);
                w = function() {
                    return x !== u.getUTCMonth()
                }
            }
            while (w()) {
                u.setUTCDate(--y);
                u.setUTCMonth(x)
            }
            return u
        },
        moveYear: function(r, q) {
            return this.moveMonth(r, q * 12)
        },
        dateWithinRange: function(q) {
            return q >= this.o.startDate && q <= this.o.endDate
        },
        keydown: function(w) {
            if (this.picker.is(":not(:visible)")) {
                if (w.keyCode === 27) {
                    this.show()
                }
                return
            }
            var s = false,
                r, q, u, v = this.focusDate || this.viewDate;
            switch (w.keyCode) {
                case 27:
                    if (this.focusDate) {
                        this.focusDate = null;
                        this.viewDate = this.dates.get(-1) || this.viewDate;
                        this.fill()
                    } else {
                        this.hide()
                    }
                    w.preventDefault();
                    break;
                case 37:
                case 39:
                    if (!this.o.keyboardNavigation) {
                        break
                    }
                    r = w.keyCode === 37 ? -1 : 1;
                    if (w.ctrlKey) {
                        q = this.moveYear(this.dates.get(-1) || g(), r);
                        u = this.moveYear(v, r);
                        this._trigger("changeYear", this.viewDate)
                    } else {
                        if (w.shiftKey) {
                            q = this.moveMonth(this.dates.get(-1) || g(), r);
                            u = this.moveMonth(v, r);
                            this._trigger("changeMonth", this.viewDate)
                        } else {
                            q = new Date(this.dates.get(-1) || g());
                            q.setUTCDate(q.getUTCDate() + r);
                            u = new Date(v);
                            u.setUTCDate(v.getUTCDate() + r)
                        }
                    }
                    if (this.dateWithinRange(q)) {
                        this.focusDate = this.viewDate = u;
                        this.setValue();
                        this.fill();
                        w.preventDefault()
                    }
                    break;
                case 38:
                case 40:
                    if (!this.o.keyboardNavigation) {
                        break
                    }
                    r = w.keyCode === 38 ? -1 : 1;
                    if (w.ctrlKey) {
                        q = this.moveYear(this.dates.get(-1) || g(), r);
                        u = this.moveYear(v, r);
                        this._trigger("changeYear", this.viewDate)
                    } else {
                        if (w.shiftKey) {
                            q = this.moveMonth(this.dates.get(-1) || g(), r);
                            u = this.moveMonth(v, r);
                            this._trigger("changeMonth", this.viewDate)
                        } else {
                            q = new Date(this.dates.get(-1) || g());
                            q.setUTCDate(q.getUTCDate() + r * 7);
                            u = new Date(v);
                            u.setUTCDate(v.getUTCDate() + r * 7)
                        }
                    }
                    if (this.dateWithinRange(q)) {
                        this.focusDate = this.viewDate = u;
                        this.setValue();
                        this.fill();
                        w.preventDefault()
                    }
                    break;
                case 32:
                    break;
                case 13:
                    v = this.focusDate || this.dates.get(-1) || this.viewDate;
                    this._toggle_multidate(v);
                    s = true;
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.setValue();
                    this.fill();
                    if (this.picker.is(":visible")) {
                        w.preventDefault();
                        if (this.o.autoclose) {
                            this.hide()
                        }
                    }
                    break;
                case 9:
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.fill();
                    this.hide();
                    break
            }
            if (s) {
                if (this.dates.length) {
                    this._trigger("changeDate")
                } else {
                    this._trigger("clearDate")
                }
                var t;
                if (this.isInput) {
                    t = this.element
                } else {
                    if (this.component) {
                        t = this.element.find("input")
                    }
                }
                if (t) {
                    t.change()
                }
            }
        },
        showMode: function(q) {
            if (q) {
                this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + q))
            }
            this.picker.find(">div").hide().filter(".datepicker-" + m.modes[this.viewMode].clsName).css("display", "block");
            this.updateNavArrows()
        }
    };
    var p = function(r, q) {
        this.element = j(r);
        this.inputs = j.map(q.inputs, function(s) {
            return s.jquery ? s[0] : s
        });
        delete q.inputs;
        j(this.inputs).datepicker(q).bind("changeDate", j.proxy(this.dateUpdated, this));
        this.pickers = j.map(this.inputs, function(s) {
            return j(s).data("datepicker")
        });
        this.updateDates()
    };
    p.prototype = {
        updateDates: function() {
            this.dates = j.map(this.pickers, function(q) {
                return q.getUTCDate()
            });
            this.updateRanges()
        },
        updateRanges: function() {
            var q = j.map(this.dates, function(r) {
                return r.valueOf()
            });
            j.each(this.pickers, function(r, s) {
                s.setRange(q)
            })
        },
        dateUpdated: function(t) {
            if (this.updating) {
                return
            }
            this.updating = true;
            var u = j(t.target).data("datepicker"),
                s = u.getUTCDate(),
                r = j.inArray(t.target, this.inputs),
                q = this.inputs.length;
            if (r === -1) {
                return
            }
            j.each(this.pickers, function(v, w) {
                if (!w.getUTCDate()) {
                    w.setUTCDate(s)
                }
            });
            if (s < this.dates[r]) {
                while (r >= 0 && s < this.dates[r]) {
                    this.pickers[r--].setUTCDate(s)
                }
            } else {
                if (s > this.dates[r]) {
                    while (r < q && s > this.dates[r]) {
                        this.pickers[r++].setUTCDate(s)
                    }
                }
            }
            this.updateDates();
            delete this.updating
        },
        remove: function() {
            j.map(this.pickers, function(q) {
                q.remove()
            });
            delete this.element.data().datepicker
        }
    };

    function i(t, w) {
        var v = j(t).data(),
            q = {},
            u, s = new RegExp("^" + w.toLowerCase() + "([A-Z])");
        w = new RegExp("^" + w.toLowerCase());

        function x(z, y) {
            return y.toLowerCase()
        }
        for (var r in v) {
            if (w.test(r)) {
                u = r.replace(s, x);
                q[u] = v[r]
            }
        }
        return q
    }

    function a(s) {
        var q = {};
        if (!b[s]) {
            s = s.split("-")[0];
            if (!b[s]) {
                return
            }
        }
        var r = b[s];
        j.each(o, function(u, t) {
            if (t in r) {
                q[t] = r[t]
            }
        });
        return q
    }
    var d = j.fn.datepicker;
    j.fn.datepicker = function(s) {
        var q = Array.apply(null, arguments);
        q.shift();
        var r;
        this.each(function() {
            var A = j(this),
                y = A.data("datepicker"),
                u = typeof s === "object" && s;
            if (!y) {
                var w = i(this, "date"),
                    t = j.extend({}, h, w, u),
                    v = a(t.language),
                    x = j.extend({}, h, v, w, u);
                if (A.is(".input-daterange") || x.inputs) {
                    var z = {
                        inputs: x.inputs || A.find("input").toArray()
                    };
                    A.data("datepicker", (y = new p(this, j.extend(x, z))))
                } else {
                    A.data("datepicker", (y = new k(this, x)))
                }
            }
            if (typeof s === "string" && typeof y[s] === "function") {
                r = y[s].apply(y, q);
                if (r !== f) {
                    return false
                }
            }
        });
        if (r !== f) {
            return r
        } else {
            return this
        }
    };
    var h = j.fn.datepicker.defaults = {
        autoclose: false,
        beforeShowDay: j.noop,
        calendarWeeks: false,
        clearBtn: false,
        daysOfWeekDisabled: [],
        endDate: Infinity,
        forceParse: true,
        format: "mm/dd/yyyy",
        keyboardNavigation: true,
        language: "en",
        minViewMode: 0,
        multidate: false,
        multidateSeparator: ",",
        orientation: "auto",
        rtl: false,
        startDate: -Infinity,
        startView: 0,
        todayBtn: false,
        todayHighlight: false,
        weekStart: 0
    };
    var o = j.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    j.fn.datepicker.Constructor = k;
    var b = j.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear"
        }
    };
    var m = {
        modes: [{
            clsName: "days",
            navFnc: "Month",
            navStep: 1
        }, {
            clsName: "months",
            navFnc: "FullYear",
            navStep: 1
        }, {
            clsName: "years",
            navFnc: "FullYear",
            navStep: 10
        }],
        isLeapYear: function(q) {
            return (((q % 4 === 0) && (q % 100 !== 0)) || (q % 400 === 0))
        },
        getDaysInMonth: function(q, r) {
            return [31, (m.isLeapYear(q) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][r]
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function(s) {
            var q = s.replace(this.validParts, "\0").split("\0"),
                r = s.match(this.validParts);
            if (!q || !q.length || !r || r.length === 0) {
                throw new Error("Invalid date format.")
            }
            return {
                separators: q,
                parts: r
            }
        },
        parseDate: function(H, E, B) {
            if (!H) {
                return f
            }
            if (H instanceof Date) {
                return H
            }
            if (typeof E === "string") {
                E = m.parseFormat(E)
            }
            var t = /([\-+]\d+)([dmwy])/,
                z = H.match(/([\-+]\d+)([dmwy])/g),
                A, y, D;
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(H)) {
                H = new Date();
                for (D = 0; D < z.length; D++) {
                    A = t.exec(z[D]);
                    y = parseInt(A[1]);
                    switch (A[2]) {
                        case "d":
                            H.setUTCDate(H.getUTCDate() + y);
                            break;
                        case "m":
                            H = k.prototype.moveMonth.call(k.prototype, H, y);
                            break;
                        case "w":
                            H.setUTCDate(H.getUTCDate() + y * 7);
                            break;
                        case "y":
                            H = k.prototype.moveYear.call(k.prototype, H, y);
                            break
                    }
                }
                return n(H.getUTCFullYear(), H.getUTCMonth(), H.getUTCDate(), 0, 0, 0)
            }
            z = H && H.match(this.nonpunctuation) || [];
            H = new Date();
            var u = {},
                F = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
                x = {
                    yyyy: function(J, s) {
                        return J.setUTCFullYear(s)
                    },
                    yy: function(J, s) {
                        return J.setUTCFullYear(2000 + s)
                    },
                    m: function(J, s) {
                        if (isNaN(J)) {
                            return J
                        }
                        s -= 1;
                        while (s < 0) {
                            s += 12
                        }
                        s %= 12;
                        J.setUTCMonth(s);
                        while (J.getUTCMonth() !== s) {
                            J.setUTCDate(J.getUTCDate() - 1)
                        }
                        return J
                    },
                    d: function(J, s) {
                        return J.setUTCDate(s)
                    }
                },
                I, r;
            x.M = x.MM = x.mm = x.m;
            x.dd = x.d;
            H = n(H.getFullYear(), H.getMonth(), H.getDate(), 0, 0, 0);
            var q = E.parts.slice();
            if (z.length !== q.length) {
                q = j(q).filter(function(s, J) {
                    return j.inArray(J, F) !== -1
                }).toArray()
            }

            function G() {
                var s = this.slice(0, z[D].length),
                    J = z[D].slice(0, s.length);
                return s === J
            }
            if (z.length === q.length) {
                var C;
                for (D = 0, C = q.length; D < C; D++) {
                    I = parseInt(z[D], 10);
                    A = q[D];
                    if (isNaN(I)) {
                        switch (A) {
                            case "MM":
                                r = j(b[B].months).filter(G);
                                I = j.inArray(r[0], b[B].months) + 1;
                                break;
                            case "M":
                                r = j(b[B].monthsShort).filter(G);
                                I = j.inArray(r[0], b[B].monthsShort) + 1;
                                break
                        }
                    }
                    u[A] = I
                }
                var v, w;
                for (D = 0; D < F.length; D++) {
                    w = F[D];
                    if (w in u && !isNaN(u[w])) {
                        v = new Date(H);
                        x[w](v, u[w]);
                        if (!isNaN(v)) {
                            H = v
                        }
                    }
                }
            }
            return H
        },
        formatDate: function(q, u, w) {
            if (!q) {
                return ""
            }
            if (typeof u === "string") {
                u = m.parseFormat(u)
            }
            var v = {
                d: q.getUTCDate(),
                D: b[w].daysShort[q.getUTCDay()],
                DD: b[w].days[q.getUTCDay()],
                m: q.getUTCMonth() + 1,
                M: b[w].monthsShort[q.getUTCMonth()],
                MM: b[w].months[q.getUTCMonth()],
                yy: q.getUTCFullYear().toString().substring(2),
                yyyy: q.getUTCFullYear()
            };
            v.dd = (v.d < 10 ? "0" : "") + v.d;
            v.mm = (v.m < 10 ? "0" : "") + v.m;
            q = [];
            var t = j.extend([], u.separators);
            for (var s = 0, r = u.parts.length; s <= r; s++) {
                if (t.length) {
                    q.push(t.shift())
                }
                q.push(v[u.parts[s]])
            }
            return q.join("")
        },
        headTemplate: '<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
    m.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + m.headTemplate + "<tbody></tbody>" + m.footTemplate + '</table></div><div class="datepicker-months"><table class="table-condensed">' + m.headTemplate + m.contTemplate + m.footTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + m.headTemplate + m.contTemplate + m.footTemplate + "</table></div></div>";
    j.fn.datepicker.DPGlobal = m;
    j.fn.datepicker.noConflict = function() {
        j.fn.datepicker = d;
        return this
    };
    j(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(r) {
        var q = j(this);
        if (q.data("datepicker")) {
            return
        }
        r.preventDefault();
        q.datepicker("show")
    });
    j(function() {
        j('[data-provide="datepicker-inline"]').datepicker()
    })
}(window.jQuery));
(function(a) {
    a.fn.datepicker.dates.rs = {
        days: ["à¦°à¦¬à¦¿", "à¦¸à§‹à¦®", "à¦®à¦™à§à¦—à¦²", "à¦¬à§à¦§", "à¦¬à§ƒà¦¹à¦ƒ", "à¦¶à§à¦•à§à¦°", "à¦¶à¦¨à¦¿", "ÐÐµÐ´ÐµÑ™Ð°"],
        daysShort: ["à¦°à¦¬à¦¿", "à¦¸à§‹à¦®", "à¦®à¦™à§à¦—à¦²", "à¦¬à§à¦§", "à¦¬à§ƒà¦¹à¦ƒ", "à¦¶à§à¦•à§à¦°", "à¦¶à¦¨à¦¿", "ÐÐµÐ´ÐµÑ™Ð°"],
        daysMin: ["à¦°à¦¬à¦¿", "à¦¸à§‹à¦®", "à¦®à¦™à§à¦—à¦²", "à¦¬à§à¦§", "à¦¬à§ƒà¦¹à¦ƒ", "à¦¶à§à¦•à§à¦°", "à¦¶à¦¨à¦¿", "ÐÐµÐ´ÐµÑ™Ð°"],
        months: ["à¦œà¦¾à¦¨à§à§Ÿà¦¾à¦°à¦¿", "à¦«à§‡à¦¬à§à¦°à§à§Ÿà¦¾à¦°à¦¿", "à¦®à¦¾à¦°à§à¦š", "à¦à¦ªà§à¦°à¦¿à¦²", "à¦®à§‡", "à¦œà§à¦¨", "à¦œà§à¦²à¦¾à¦‡", "à¦†à¦—à¦¸à§à¦Ÿ", "à¦¸à§‡à¦ªà§à¦Ÿà§‡à¦®à§à¦¬à¦°", "à¦…à¦•à§à¦Ÿà§‹à¦¬à¦°", "à¦¨à¦­à§‡à¦®à§à¦¬à¦°", "à¦¡à¦¿à¦¸à§‡à¦®à§à¦¬à¦°"],
        monthsShort: ["à¦œà¦¾à¦¨", "à¦«à§‡à¦¬à§à¦°à§", "à¦®à¦¾à¦°à§à¦š", "à¦à¦ªà§à¦°à¦¿", "à¦®à§‡", "à¦œà§à¦¨", "à¦œà§à¦²à¦¾à¦‡", "à¦†à¦—à¦¸à§à¦Ÿ", "à¦¸à§‡à¦ªà§à¦Ÿà§‡", "à¦…à¦•à§à¦Ÿà§‹", "à¦¨à¦­à§‡", "à¦¡à¦¿à¦¸à§‡"],
        today: "Ð”Ð°Ð½Ð°Ñ"
    }
}(jQuery));

function getNotificationCount() {
    return $.ajax({
        type: "POST",
        url: "/get-notifications-count",
        data: {
            blog: "swi"
        }
    })
}

// function makePopover(a, b) {
//     $("#" + a).popover({
//         placement: "bottom",
//         animation: true,
//         content: $("#" + b).html(),
//         html: true
//     }).show()
// }

function changeKeyBoard(b) {
    var a = b;
    if (a == "unijoy") {
        isEnglishOn = "false";
        setCookie("phonetic", "false", 3);
        setCookie("bijoykb", "false", 3);
        setCookie("english", "false", 3);
        setCookie("kb-selected", "true", 3)
    } else {
        if (a == "phonetic") {
            isEnglishOn = "false";
            setCookie("phonetic", "true", 3);
            setCookie("bijoykb", "false", 3);
            setCookie("english", "false", 3);
            setCookie("kb-selected", "true", 3)
        } else {
            if (a == "bijoy") {
                isEnglishOn = "false";
                setCookie("phonetic", "false", 3);
                setCookie("bijoykb", "true", 3);
                setCookie("english", "false", 3);
                setCookie("kb-selected", "true", 3)
            } else {
                if (a == "english") {
                    isEnglishOn = "true";
                    setCookie("phonetic", "false", 3);
                    setCookie("bijoykb", "false", 3);
                    setCookie("english", "true", 3);
                    setCookie("kb-selected", "true", 3)
                }
            }
        }
    }
}
$(function() {
    var d, b;
    var a = 0;
    propagate();
    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            $("#top").show()
        } else {
            $("#top").hide()
        }
        if ($(window).scrollTop() > 100) {
            $("#scroller").css("top", 0);
            $("#scroller").css("position", "fixed");
            if ($("#nav-username").length) {
                $("#nav-settings").hide();
                $("#nav-username").show();
                $("#nav-username-2").show()
            } else {
                $("#nav-settings").show()
            }
        } else {
            $("#scroller").css("position", "relative");
            if ($("#nav-username").length) {
                $("#nav-settings").show();
                $("#nav-username").hide();
                $("#nav-username-2").hide()
            } else {
                $("#nav-settings").show()
            }
        }
    });
    logged_in = $.cookie("logged_in");
    if (logged_in) {
        ajax_notification_list_view = getNotificationCount();
        ajax_notification_list_view.done(function(e) {
            $(".count-post-scroll").html(e);
            $(".count-post").html(e);
            if (!d) {
                d = new app.NotificationListView()
            } else {
                d.getNotifications()
            }
        });
        setInterval(function() {
            ajax_notification_list_view = getNotificationCount();
            ajax_notification_list_view.done(function(e) {
                $(".count-post-scroll").html(e);
                $(".count-post").html(e);
                if (!d) {
                    d = new app.NotificationListView()
                } else {
                    d.getNotifications()
                }
            })
        }, 600000);
        if ($("#notification-count").length <= 0) {
            $("#loading_top_ajax_loader").show();
            var c = $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "/api/users_top_bar/",
                data: {
                    blog: "swi"
                }
            }).done(function(g) {
                if (g.success == 1) {
                    _.templateSettings.variable = "rctop";
                    var f = _.template($("#headerRightTemplate").html());
                    $("#header-right").html(f(g));
                    var e = _.template($("#smallHeaderRightTemplate").html());
                    $("#menu_right_nav").append(e(g));
                    makePopover("btn-user-pic", "UserDropMenu")
                }
            }).fail(function() {
                $("#loading_top_ajax_loader").hide()
            })
        }
    } else {
        if ($(".new-post-btn").length > 0) {
            $(".nav.top-list li:last-child").remove();
            $(".nav.top-list li:last-child").remove();
            $("#loading_top_ajax_loader").show();
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "/api/check_login",
                data: {
                    blog: "swi"
                }
            }).done(function(f) {
                if (f.success == 0) {
                    console.log($(".new-post-btn").length);
                    _.templateSettings.variable = "rctop";
                    var e = _.template($("#headerRightVisitorTemplate").html());
                    $("#visitor_top_log_in").html(e())
                }
            }).fail(function() {
                $("#loading_top_ajax_loader").hide()
            })
        }
    }
    $("#calendar").datepicker({
        language: "rs"
    }).on("changeDate", function(f) {
        year = f.date.getFullYear();
        month = f.date.getMonth() + 1;
        date = f.date.getDate();
        if (month < 9) {
            month = "0" + month
        }
        if (date < 9) {
            date = "0" + date
        }
        url = "/blog/archive/" + year + "/" + month + "/" + date;
        window.location = url.toString()
    });
    $("#search_blog").on("click", function() {
        $("#search_box").attr("placeholder", "à¦¬à§à¦²à¦— à¦…à¦¨à§à¦¸à¦¨à§à¦§à¦¾à¦¨");
        $("#search_blog").addClass("active-blog");
        $("#search_user").removeClass("active-user")
    });
    $("#search_user").on("click", function() {
        $("#search_box").attr("placeholder", "à¦¬à§à¦²à¦—à¦¾à¦° à¦…à¦¨à§à¦¸à¦¨à§à¦§à¦¾à¦¨");
        $("#search_user").addClass("active-user");
        $("#search_blog").removeClass("active-blog")
    });
    $("#search").on("click", function() {
        if ($("#search_user").hasClass("active-user")) {
            $("#ResultContainer").show();
            new app.BloggerSearchResultsView()
        } else {
            url = "http://www.google.com.bd/custom?q=" + $("#search_box").val() + "&searchtype=content&domains=www.somewhereinblog.net&sitesearch=www.somewhereinblog.net&client=pub-6383224968083856&forid=1&ie=UTF-8&eo=UTF-8&flav=0000&sig=GQYjOYEqLSfb_zjI&cof=GALT:#008000;GL:1;DIV:#FFFFFF;VLC:663399;AH:center;BGC:FFFFFF;LBGC:FFFFFF;ALC:0000FF;LC:0000FF;T:000000;GFNT:0000FF;GIMP:0000FF;LH:80;LW:300;L:http://www.somewhereinblog.net/logo.jpg;S:http://www.somewhereinblog.net;FORID:1&hl=en";
            window.open(url)
        }
        $("#font-keyboard").hide()
    });
    // $("#notification-count").popover({
    //     placement: "bottom",
    //     animation: true,
    //     content: function() {
    //         return $("#notification-list").html()
    //     },
    //     html: true
    // }).show();
    // $("#notification-count-scroll").popover({
    //     placement: "bottom",
    //     animation: true,
    //     content: function() {
    //         return $("#notification-list").html()
    //     },
    //     html: true
    // }).show();
    $(".bng_text").focus(function() {
        if ($.cookie("kb-selected") != "true") {
            $(this).before($("#font-keyboard"));
            $("#font-keyboard").show()
        }
    });
    $("#kb-phonetic").on("click", function() {
        $.cookie("selected_keyboard", "phonetic", {
            path: "/"
        });
        changeKeyBoard("phonetic");
        $("#kb-phonetic").removeClass("active");
        $("#kb-unijoy").removeClass("active");
        $("#kb-bijoy").removeClass("active");
        $("#kb-phonetic").addClass("active");
        $("#font-keyboard").hide()
    });
    $("#kb-bijoy").on("click", function() {
        $.cookie("selected_keyboard", "bijoy", {
            path: "/"
        });
        changeKeyBoard("bijoy");
        $("#kb-phonetic").removeClass("active");
        $("#kb-unijoy").removeClass("active");
        $("#kb-bijoy").removeClass("active");
        $("#kb-bijoy").addClass("active");
        $("#font-keyboard").hide()
    });
    $("#kb-unijoy").on("click", function() {
        $.cookie("selected_keyboard", "unijoy", {
            path: "/"
        });
        changeKeyBoard("unijoy");
        $("#kb-phonetic").removeClass("active");
        $("#kb-unijoy").removeClass("active");
        $("#kb-bijoy").removeClass("active");
        $("#kb-unijoy").addClass("active");
        $("#font-keyboard").hide()
    });
    selected_keyboard = $.cookie("selected_keyboard");
    if (selected_keyboard == undefined || selected_keyboard == "phonetic") {
        $("#kb-phonetic").click()
    } else {
        if (selected_keyboard == "unijoy") {
            $("#kb-unijoy").click()
        } else {
            if (selected_keyboard == "bijoy") {
                $("#kb-bijoy").click()
            }
        }
    }
    $("#btn-store-name").on("click", function() {
        BanglaName = encodeURIComponent($("#bangla_name").val());
        $.cookie("BanglaName", BanglaName, {
            path: "/",
            expires: 365 * 10
        });
        window.location = "/registration"
    });
    $("#bangla_name").on("focus", function() {
        if ($.cookie("kb-selected") != "true") {
            $("#font-keyboard").show()
        }
    });
    $("#search_box").on("focus", function() {
        if ($.cookie("kb-selected") != "true") {
            $("#font-keyboard-2").show()
        }
    });
    if ($.cookie("BanglaName")) {
        $("#bangla_name").val(decodeURIComponent($.cookie("BanglaName")))
    }
    //makePopover("btn-insertlink", "comment-insert-link");
    //makePopover("btn-insertsmilies", "smilies-content");
    //makePopover("btn-converter", "converter-content");
    //makePopover("btn-help", "feedbackOptions");
    //makePopover("btn-user-pic", "UserDropMenu");
    // $("html").on("click", function(f) {
    //     if (typeof $(f.target).data("original-title") == "undefined" && $(f.target).parent().parent().attr("id") !== "tool-bar") {
    //         $("[data-original-title]").popover("hide")
    //     }
    // });
    $.post("/insert-web-visitors", {
        blog: "swi"
    });
    if (!a) {
        if (!b) {
            b = new app.OnlineVisitorListView()
        } else {
            b.getVisitors()
        }
    }
    online_box_type = $.cookie("online_box_type");
    if (online_box_type) {
        if (online_box_type == "text") {
            $("#online_user_display_type_pic").show()
        } else {
            $("#online_user_display_type_text").show()
        }
    } else {
        $("#online_user_display_type_pic").show()
    }
    setInterval(function() {
        $.post("/insert-web-visitors", {
            blog: "swi"
        })
    }, 600000);
    setInterval(function() {
        $.when($.post("/online-visitors-count", {
            blog: "swi"
        })).done(function(e) {
            if (!a) {
                if (!b) {
                    b = new app.OnlineVisitorListView()
                } else {
                    $("#online_users").empty();
                    b.getVisitors()
                }
            }
        })
    }, 600000);
    $("body").on("click", "#notification_popover_link", function(e) {
        $.post("/api/clear-nofication-cache", {
            blog: "swi"
        })
    })
});
