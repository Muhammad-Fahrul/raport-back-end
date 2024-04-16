import { RaportPayloadSchema } from './schema.js';

export default {
  validateRaportPayload: (payload) => {
    const validationResult = RaportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};
