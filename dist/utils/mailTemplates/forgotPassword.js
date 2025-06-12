"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/utils/helper/constants");
const forgottenPasswordTemplate = (params) => {
    return `
      <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Cameroon Round Table Management - Reset Password.</h2>
          <h4></h4>
          <p style="margin-bottom: 30px;">Please click the link below to reset your password</p>
          <div>
            <h1 style="font-size: 18px;">Please click: <a href='${constants_1.FRONTEND_HOSTNAME}/reset-password/${params.verificationCode}'>${constants_1.FRONTEND_HOSTNAME}/reset-password/${params.verificationCode}</a>  </h1>
          </div>
          <p style="background: #000; margin-top: 20px; padding: 1rem; border-radius: 7px; color: #fff;">Please this mail was intended for Mr/Mrs ${params.firstName} ${params.lastName}. If you are not the one stated please delete/ignore this message.</p>
        </div>
      `;
};
exports.default = forgottenPasswordTemplate;
