import IconButton from "../../components/ui/buttons/IconButton";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import circleArrowLeftIconDark from "../../assets/icons/circle-arrow-left-icon-dark.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useForm } from "react-hook-form";
import { verifyEmailApi, resendEmailCodeApi } from "../../services/api.service";
import { useContext, useState } from "react";
import { EmailVerificationContext } from "../../components/context/EmailVerificationContext";
import notify from "../../components/ui/CustomToast";
import { ThemeContext } from "../../components/context/ThemeContext";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [isVerify, setIsVerify] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { email } = useContext(EmailVerificationContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (values) => {
    setIsVerify(true);
    const code =
      [...Array(6)].map((_, index) => values[`code${index}`]).join("") || "";
    const res = await verifyEmailApi(email, code);
    setIsVerify(false);
    if (res.data) {
      notify(
        "success",
        "Email Verified",
        "Your email has been successfully verified. Your account is now activated.",
        "var(--color-silver-tree)",
      );
      localStorage.removeItem("email");
      navigate("/login");
    } else {
      if (res.code === 400) {
        setError("custom_error", {
          type: "custom",
          message: "Invalid or expired OTP",
        });
        return;
      }
      notify(
        "error",
        "Verification failed!",
        "Something went wrong",
        "var(--color-crimson-red)",
      );
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    const res = await resendEmailCodeApi(email);
    setIsResending(false);
    if (res.data) {
      notify(
        "success",
        "Code Sent",
        "A new verification code has been sent to your email. Please check your inbox.",
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
            Verify Your Email
          </h1>
          <p className="font-body text-gravel mt-3 text-sm md:text-base">
            Enter the email 6-digit code sent to{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Reset password form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 mb-3"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="grid grid-cols-6 gap-1 md:gap-3">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className={`text-ebony-clay font-body h-10 max-w-10 rounded-lg text-center text-xl font-semibold outline outline-gray-200 md:h-12 md:max-w-12 dark:outline-gray-100/20 ${errors[`code${index}`] ? "focus:outline-crimson-red outline-crimson-red! focus:shadow-[0px_0px_8px_rgba(230,57,70,0.4)]" : "focus:outline-indigo focus:shadow-[0px_0px_8px_rgba(107,118,246,0.4)]"}`}
                  {...register(`code${index}`, { required: true })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value && index < 5) {
                      document
                        .querySelector(`[name="code${index + 1}"]`)
                        ?.focus();
                    }
                  }}
                />
              ))}
            </div>
            {errors.custom_error && (
              <span className="font-body text-crimson-red text-left text-xs font-medium md:text-sm">
                {errors.custom_error.message}
              </span>
            )}
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
              label="Verify code"
              type="submit"
              onClick={() => clearErrors()}
              isProcessing={isVerify}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
