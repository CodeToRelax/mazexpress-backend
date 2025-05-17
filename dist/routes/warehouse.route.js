"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const warehouse_controller_1 = require("../controllers/warehouse.controller");
const checkUserRules_middleware_1 = require("../middlewares/checkUserRules.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const validateRequest_middleware_1 = require("../middlewares/validateRequest.middleware");
const types_1 = require("../utils/types");
const warehouse_validation_1 = require("../validation/warehouse.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getWarehouses', jwt_middleware_1.default, async (_, res) => {
    const wareHouses = await warehouse_controller_1.WarehouseController.getWarehouses();
    return res.status(types_1.StatusCode.SUCCESS_OK).json(wareHouses);
});
router.post('/createWarehouse', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(warehouse_validation_1.createWarehouseValidation), async (req, res) => {
    const warehouse = await warehouse_controller_1.WarehouseController.createWarehouse(req.body);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(warehouse);
});
router.patch('/updateWarehouse/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(warehouse_validation_1.createWarehouseValidation), async (req, res) => {
    await warehouse_controller_1.WarehouseController.updateWarehouse(req.params.id, req.body);
    return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
});
router.delete('/deleteWarehouse/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_FORBIDDEN, 'common.errorValidation', 'common.missingInfo');
    await warehouse_controller_1.WarehouseController.deleteWarehouse(req.params.id);
    return res.status(types_1.StatusCode.SUCCESS_OK).json('success');
});
exports.default = router;
//# sourceMappingURL=warehouse.route.js.map