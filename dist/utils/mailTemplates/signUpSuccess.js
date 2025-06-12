"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signUpSuccessTemplate = (params) => {
    return `
      <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Cameroon Round Table Management - Registration.</h2>
          <h4></h4>
          <p style="margin-bottom: 30px;">Your Account Login Details</p>
          <div>
            <h1 style="font-size: 18px;">Your Email: ${params.email}</h1>
            <h1 style="font-size: 18px;">Your OTP Code(Please use this code to verify your account): ${params.otpCode}</h1>
          </div>
          <p style="background: #000; margin-top: 20px; padding: 1rem; border-radius: 7px; color: #fff;">Please this mail was intended for Mr/Mrs ${params.firstName} ${params.lastName}. If you are not the one stated please delete/ignore this message.</p>
        </div>
      `;
};
exports.default = signUpSuccessTemplate;
