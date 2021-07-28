"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = new _mongoose["default"].Schema({
  email: {
    type: String,
    requried: true,
    unique: true
  },
  avatarUrl: String,
  socialOnly: {
    type: Boolean,
    "default": false
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  location: String,
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Comment"
  }],
  videos: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Video"
  }]
});
userSchema.pre("save", function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified("password")) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(this.password, 5));

        case 3:
          this.password = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

var User = _mongoose["default"].model("User", userSchema);

var _default = User;
exports["default"] = _default;