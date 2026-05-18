"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_card_dto_1 = require("./create-card.dto");
class UpdateCardDto extends (0, swagger_1.PartialType)(create_card_dto_1.CreateCardDto) {
}
exports.UpdateCardDto = UpdateCardDto;
//# sourceMappingURL=update-card.dto.js.map