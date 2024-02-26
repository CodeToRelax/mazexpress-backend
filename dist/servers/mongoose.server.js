"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const ConnectToMongoDB = async (uri) => {
    try {
        await mongoose_1.default.connect(uri, {
            serverApi: {
                version: mongodb_1.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    }
    catch (error) {
        console.log(error);
    }
};
mongoose_1.default.connection.on('error', (err) => {
    console.log(err);
});
mongoose_1.default.connection.on('disconnected', (err) => {
    console.log(err);
});
exports.default = ConnectToMongoDB;
//# sourceMappingURL=mongoose.server.js.map