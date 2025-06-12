"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = __importDefault(require("@/middleware/error.middleware"));
const utils_1 = require("@/utils/helper/utils");
const constants_1 = require("./utils/helper/constants");
class App {
    constructor(controllers, port, express, httpServer) {
        this.express = express;
        this.httpServer = httpServer;
        this.port = port;
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeLinks();
        this.initializeDatabaseConnectionAndStartApp();
    }
    initializeMiddleware() {
        this.express.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: ["'self'", 'http://127.0.0.1:3000']
                }
            }
        }));
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use((0, compression_1.default)());
        this.express.use((0, express_fileupload_1.default)());
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Headers', 'authorization, Origin, Content-Type, Accept');
            next();
        });
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }
    initializeErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    initializeLinks() {
        //on production
        if (process.env.NODE_ENV === 'production') {
            this.express.use(express_1.default.static(constants_1.FILE_STRUCTURE.CLIENT_BUILD_PATH));
            this.express.use(express_1.default.static(constants_1.FILE_STRUCTURE.PUBLIC_DIR));
            this.express.get('*', (req, res) => {
                res.sendFile(path_1.default.join(constants_1.FILE_STRUCTURE.CLIENT_BUILD_PATH, 'index.html'));
            });
        }
        else {
            this.express.get('/', (req, res) => {
                res.send('Round table Api running');
            });
        }
    }
    initializeDatabaseConnectionAndStartApp() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(String(process.env.MONGO_URI)).then(() => __awaiter(this, void 0, void 0, function* () {
                    yield (0, utils_1.createSuperAdmin)();
                    this.httpServer.listen(process.env.PORT, () => {
                        console.log(`Round table Server running on port http://localhost:${this.port} and on ${process.env.NODE_ENV} mode`);
                    });
                }));
                if (process.env.NODE_ENV !== 'production') {
                    yield (0, utils_1.initializeDevelopmentDummyData)();
                }
                console.log('round table MongoDB Connection Success 👍');
            }
            catch (err) {
                console.log('round table MongoDB Connection Failed 💥');
                process.exit(1);
            }
        });
    }
}
exports.default = App;
