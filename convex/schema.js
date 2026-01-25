"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("convex/server");
var values_1 = require("convex/values");
exports.default = (0, server_1.defineSchema)({
    tasks: (0, server_1.defineTable)({
        text: values_1.v.string(),
        isCompleted: values_1.v.boolean(),
    }),
});
