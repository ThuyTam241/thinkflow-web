import IconButton from "../../components/ui/buttons/IconButton";
import TextInput from "../../components/ui/inputs/TextInput";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import circleArrowLeftIconDark from "../../assets/icons/circle-arrow-left-icon-dark.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useForm } from "react-hook-form";
import {
  forgotPasswordApi,
  resetPasswordApi,
} from "../../services/api.service";
import { useContext, useState } from "react";
import { EmailVerificationContext } from "../../components/context/EmailVerificationContext";
import notify from "../../components/ui/CustomToast";
import { ThemeContext } from "../../components/context/ThemeContext";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [isReset, setIsReset] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { email } = useContext(EmailVerificationContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (values) => {
    setIsReset(true);
    const res = await resetPasswordApi(email, values.code, values.new_password);
    setIsReset(false);
    if (res.data) {
      notify(
        "success",
        "Password Updated!",
        "Your password has been successfully reset",
        "var(--color-silver-tree)",
      );
      localStorage.removeItem("email");
      navigate("/login");
    } else {
      if (res.code === 400) {
        setError(
          "code",
          {
            type: "custom",
            message: "Invalid or expired OTP",
          },
          {
            shouldFocus: true,
          },
        );
        return;
      }
      notify(
        "error",
        "Reset Failed",
        "Unable to reset your password",
        "var(--color-crimson-red)",
      );
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    const res = await forgotPasswordApi(email);
    setIsResending(false);
    if (res.data) {
      notify(
        "success",
        "Code Resent",
        "A new verification code has been sent to your email. Please check your inbox",
        "var(--color-silver-tree)",
        "top-center",
      );
    } else {
      notify(
        "error",
        "Resend Failed",
        "Failed to resend the verification code",
        "var(--color-crimson-red)",
      );
    }
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex h-screen items-center justify-center bg-[radial-gradient(50%_50%_at_50%_50%,_#DAD7FC_0%,_#EDEBFE_50%,_#FFFFFF_100%)] px-6 dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#4C3D99_0%,_rgba(43,35,101,0.5)_50%,_rgba(10,9,48,0)_100%)]">
      {/* Back button */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        whileHover={{ boxShadow: "0px 6px 20px rgba(39,35,64,0.1)" }}
        className="absolute top-6 left-6 h-12 rounded-full md:top-10 md:left-[60px]"
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          src={
            theme === "light" ? circleArrowLeftIcon : circleArrowLeftIconDark
          }
        />
      </motion.div>

      <motion.div
        variants={fadeIn("right", 0.4)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        className="border-hawkes-blue/50 w-full max-w-96 rounded-md border bg-white/60 px-5 py-4 text-center md:px-8 md:py-7 dark:bg-[#FFFFFF]/5"
      >
        <div>
          <h1 className="font-heading text-indigo text-2xl font-bold md:text-[32px]">
            Check Your Email
          </h1>
          <p className="font-body text-gravel mt-3 text-sm md:text-base">
            We sent a code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Reset password form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 mb-3"
        >
          <div className="flex flex-col items-center gap-5">
            <TextInput
              type="text"
              placeholder="6-digit code"
              {...register("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Verification code must be exactly 6 digits",
                },
              })}
              errorMessage={errors.code}
            />
            <TextInput
              type="password"
              placeholder="New password"
              {...register("new_password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
              errorMessage={errors.new_password}
            />
            <p className="font-body text-ebony-clay text-xs md:text-sm">
              Didn't receive the email?{" "}
              <Link
                onClick={(e) => {
                  if (isResending) {
                    e.preventDefault();
                    return;
                  }
                  handleResendCode();
                }}
                className={`font-body text-indigo font-medium ${isResending ? "cursor-progress" : ""}`}
              >
                Click to resend
              </Link>
            </p>
            <PrimaryButton
              color="blue"
              label="Reset password"
              type="submit"
              isProcessing={isReset}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
