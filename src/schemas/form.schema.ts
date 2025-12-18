export const formSchema = {
    body: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'fields'],
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string', minLength: 1, maxLength: 255 },

            fields: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['label', 'required', 'fieldType'],

                    properties: {
                        label: { type: 'string', minLength: 1, maxLength: 255 },
                        required: { type: 'boolean' },
                        placeholder: { type: 'string', minLength: 1, maxLength: 255 },
                        helpText: { type: 'string', minLength: 1, maxLength: 255 },

                        fieldType: {
                            type: 'string',
                            enum: [
                                'single-line-text',
                                'textarea',
                                'number',
                                'email',
                                'dropdown',
                                'checkbox',
                                'date',
                            ],
                        },

                        validation: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                minLength: { type: 'number', minimum: 0 },
                                maxLength: { type: 'number', minimum: 1 },
                                min: { type: 'number' },
                                max: { type: 'number' },

                                emailPolicy: {
                                    type: 'string',
                                    enum: ['any', 'allowed-domains'],
                                },

                                allowedDomains: {
                                    type: 'array',
                                    minItems: 1,
                                    items: { type: 'string', minLength: 1 },
                                },

                                regex: { type: 'string' },
                            },
                        },
                    },

                    allOf: [
                        /**
                         * ─────────────────────────────────────────
                         * TEXT / TEXTAREA
                         * ─────────────────────────────────────────
                         */
                        {
                            if: {
                                properties: {
                                    fieldType: {
                                        enum: ['single-line-text', 'textarea'],
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    validation: {
                                        type: 'object',
                                        required: ['minLength', 'maxLength'],
                                        not: {
                                            anyOf: [
                                                {
                                                    type: 'object',
                                                    required: [
                                                        'emailPolicy',
                                                        'allowedDomains',
                                                        'regex',
                                                        'min',
                                                        'max',
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },

                        /**
                         * ─────────────────────────────────────────
                         * NUMBER
                         * ─────────────────────────────────────────
                         */
                        {
                            if: {
                                properties: {
                                    fieldType: { const: 'number' },
                                },
                            },
                            then: {
                                properties: {
                                    validation: {
                                        type: 'object',
                                        required: ['min', 'max'],
                                        not: {
                                            anyOf: [
                                                {
                                                    type: 'object',
                                                    required: [
                                                        'minLength',
                                                        'maxLength',
                                                        'emailPolicy',
                                                        'allowedDomains',
                                                        'regex',
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },

                        /**
                         * ─────────────────────────────────────────
                         * EMAIL
                         * ─────────────────────────────────────────
                         */
                        {
                            if: {
                                properties: {
                                    fieldType: { const: 'email' },
                                },
                            },
                            then: {
                                properties: {
                                    validation: {
                                        type: 'object',
                                        required: ['emailPolicy'],
                                        not: {
                                            anyOf: [
                                                {
                                                    type: 'object',
                                                    required: [
                                                        'minLength',
                                                        'maxLength',
                                                        'regex',
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },

                                allOf: [
                                    {
                                        if: {
                                            properties: {
                                                validation: {
                                                    type: 'object',
                                                    properties: {
                                                        emailPolicy: {
                                                            const: 'allowed-domains',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        then: {
                                            properties: {
                                                validation: {
                                                    type: 'object',
                                                    required: ['allowedDomains'],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        },
    },

    response: {
        201: {
            type: 'object',
            required: ['status', 'formId', 'version', 'url'],
            properties: {
                status: { type: 'boolean', const: true },
                formId: { type: 'string' },
                version: { type: 'string' },
                url: { type: 'string', format: 'url' },
            },
        },

        400: {
            type: 'object',
            required: ['statusCode', 'message'],
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },

        500: {
            type: 'object',
            required: ['statusCode', 'message'],
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
}
