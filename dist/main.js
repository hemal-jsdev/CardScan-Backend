"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestServer = void 0;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
let isInitialized = false;
const createNestServer = async (expressInstance) => {
    if (isInitialized)
        return;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CardScan API')
        .setDescription('CardScan Backend REST API — Production v1.0')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0';
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customCssUrl: `${cdnBase}/swagger-ui.min.css`,
        customJs: [
            `${cdnBase}/swagger-ui-bundle.min.js`,
            `${cdnBase}/swagger-ui-standalone-preset.min.js`,
        ],
    });
    await app.init();
    isInitialized = true;
};
exports.createNestServer = createNestServer;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const port = process.env.PORT ?? 3000;
    (0, exports.createNestServer)(server).then(() => {
        server.listen(port, () => {
            console.log(`🚀 CardScan API running locally on: http://localhost:${port}/api/v1`);
            console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
        });
    });
}
exports.default = server;
//# sourceMappingURL=main.js.map