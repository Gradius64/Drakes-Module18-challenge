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
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../models/index.js");
const auth_js_1 = require("../utils/auth.js");
const resolvers = {
    Query: {
        profiles: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield index_js_1.Profile.find();
        }),
        profile: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { profileId }) {
            return yield index_js_1.Profile.findOne({ _id: profileId });
        }),
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                return yield index_js_1.Profile.findOne({ _id: context.user._id });
            }
            throw auth_js_1.AuthenticationError;
        }),
    },
    Mutation: {
        addProfile: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { input }) {
            const profile = yield index_js_1.Profile.create(Object.assign({}, input));
            const token = (0, auth_js_1.signToken)(profile.name, profile.email, profile._id);
            return { token, profile };
        }),
        login: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { email, password }) {
            const profile = yield index_js_1.Profile.findOne({ email });
            if (!profile) {
                throw auth_js_1.AuthenticationError;
            }
            const correctPw = yield profile.isCorrectPassword(password);
            if (!correctPw) {
                throw auth_js_1.AuthenticationError;
            }
            const token = (0, auth_js_1.signToken)(profile.name, profile.email, profile._id);
            return { token, profile };
        }),
        addSkill: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { profileId, skill }, context) {
            if (context.user) {
                return yield index_js_1.Profile.findOneAndUpdate({ _id: profileId }, {
                    $addToSet: { skills: skill },
                }, {
                    new: true,
                    runValidators: true,
                });
            }
            throw auth_js_1.AuthenticationError;
        }),
        removeProfile: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                return yield index_js_1.Profile.findOneAndDelete({ _id: context.user._id });
            }
            throw auth_js_1.AuthenticationError;
        }),
        removeSkill: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { skill }, context) {
            if (context.user) {
                return yield index_js_1.Profile.findOneAndUpdate({ _id: context.user._id }, { $pull: { skills: skill } }, { new: true });
            }
            throw auth_js_1.AuthenticationError;
        }),
    },
};
exports.default = resolvers;
