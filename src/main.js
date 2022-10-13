"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
var core_1 = require("@edict/core");
console.log('Hello World!');
var WIDTH = 800;
var HEIGHT = 600;
var newDest = function () { return ({
    destX: Math.floor(Math.random() * WIDTH),
    destY: Math.floor(Math.random() * HEIGHT)
}); };
// Start an edict session
var _b = (0, core_1.edict)(), insert = _b.insert, rule = _b.rule, fire = _b.fire, retract = _b.retract;
// Enact the rules for this session
rule('Circles with a destination move to destination', function (_a) {
    var speed = _a.speed, dt = _a.dt;
    return ({
        $npc: { x: { then: false }, y: { then: false }, speed: speed },
        time: { dt: dt }
    });
}).enact({
    then: function (_a) {
        var _b;
        var _c = _a.$npc, x = _c.x, y = _c.y, id = _c.id, speed = _c.speed, time = _a.time;
        insert((_b = {},
            _b[id] = {
                x: x + 0.1 * speed * time.dt,
                y: y + 0.1 * speed * time.dt
            },
            _b));
    }
});
rule('when the values get to big reset', function (_a) {
    var x = _a.x, y = _a.y, dt = _a.dt;
    return ({
        $npc: {
            x: x,
            y: y
        },
        time: { dt: dt }
    });
}).enact({
    then: function (_a) {
        var _b;
        var $npc = _a.$npc;
        if ($npc.x > 100) {
            insert((_b = {},
                _b[$npc.id] = newDest(),
                _b));
        }
    }
});
for (var i = 0; i < 500; i++) {
    insert((_a = {},
        _a["c".concat(i)] = __assign({ speed: Math.random() * 2 }, newDest()),
        _a));
}
// Continuously update the dt fact (delta time)
for (var i = 0; i < 1000; i++) {
    insert({
        time: { dt: 16 }
    });
    fire();
    console.log("fired");
}
