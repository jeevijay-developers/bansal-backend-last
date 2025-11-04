/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { LoginRequest, LoginResponse } from "./authInterface";
import api from "../../api/api";
import { APIPATH } from "../../api/urls";
import { VerifyOTPRequest, VerifyOTPResponse } from "./authInterface";
// import { toast } from "react-toastify";

export const useLogin = () => {
  return useMutation(
    async ({ mobileNumber }: LoginRequest) => {
      // ✅ Send plain JSON — no FormData needed
      const response:{ data: LoginResponse } = await api.post(
        APIPATH.login,
        { mobileNumber },
        {
          headers: {
            "Content-Type": "application/json", // ✅ make sure it's set
          },
        }
      );

      return response.data;
    },
    {
      onError: (error: any) => {
        console.error("Login API Error:", error.response?.data?.error || error.message);
        // toast.error(error.response?.data?.error || "Login failed.");
      },
    }
  );
};

export const useVerifyOTP = () => {
  return useMutation(
    async ({ mobileNumber, otp }: VerifyOTPRequest) => {
      // const formData = new FormData();
      // formData.append("mobileNumber", mobileNumber);
      // formData.append("otp", otp);

      const response: { data: VerifyOTPResponse } = await api.post(
        APIPATH.verifyOTP,
        { mobileNumber, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data;
    },
    {
      onError: (error: any) => {
        // Log error for debugging
        console.error("Verify OTP API Error:", error.response?.data.error);
      },
    }
  );
};
export const useCourses = () => {
  return useMutation(
    async (params: Record<string, string>) => {
      const formData = new FormData();

      // Append all dynamic parameters to FormData
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Append each array item with the same key
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      });

      const response: { data: any } = await api.post(
        APIPATH.courses,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response?.data;
    },
    {
      onError: (error: any) => {
        // Log error for debugging
        console.error("Courses API Error:", error.response?.data);
      },
    }
  );
};

// export const useLiveTest = () => {
//   return useMutation(
//     async (params: Record<string, string>) => {
//       const formData = new FormData();

//       // Append all dynamic parameters to FormData
//       Object.entries(params).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           // Append each array item with the same key
//           value.forEach((item) => formData.append(`${key}[]`, item));
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const response: { data: any } = await api.post(
//         APIPATH.liveTest,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response?.data;
//     },
//     {
//       onError: (error: any) => {
//         // Log error for debugging
//         console.error("Practice Test API Error:", error.response?.data);
//       },
//     }
//   );
// };

// export const usePracticeTest = () => {
//   return useMutation(
//     async (params: Record<string, string>) => {
//       const formData = new FormData();

//       // Append all dynamic parameters to FormData
//       Object.entries(params).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           // Append each array item with the same key
//           value.forEach((item) => formData.append(`${key}[]`, item));
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const response: { data: any } = await api.post(
//         APIPATH.practiceTest,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response?.data;
//     },
//     {
//       onError: (error: any) => {
//         // Log error for debugging
//         console.error("Practice  Test API Error:", error.response?.data);
//       },
//     }
//   );
// };
