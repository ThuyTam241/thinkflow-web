import { useState } from "react";
import IconButton from "../components/ui/buttons/IconButton";
import TextInput from "../components/ui/inputs/TextInput";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../assets/icons/circle-arrow-left-icon.svg";
import facebookIconButton from "../assets/icons/facebook-button-icon.svg";
import googleIconButton from "../assets/icons/google-button-icon.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../components/utils/motion";

const initialState = {
  first_name: "",
  last_name: "",
  password: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(initialState);

  return (
    <div className="from-hawkes-blue flex h-screen items-center justify-center bg-gradient-to-b via-[rgba(218,215,252,0.6)] to-[rgba(218,215,252,0.15)] px-6">
      {/* Back button */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        whileHover={{ boxShadow: "0px 6px 20px rgba(0,0,0,0.1)" }}
        className="absolute top-6 left-6 h-12 rounded-full md:top-10 md:left-[60px]"
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          src={circleArrowLeftIcon}
        />
      </motion.div>

      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        className="w-full max-w-[364px] rounded-[6px] bg-white/60 px-8 py-7 text-center shadow-[0px_4px_20px_rgba(99,104,209,0.4)]"
      >
        <h1 className="font-heading text-indigo text-3xl font-bold md:text-[32px]">
          Sign Up
        </h1>

        {/* Sign up form */}
        <form action="/login" method="POST" className="mt-6 mb-3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-5">
              <TextInput
                type="text"
                placeholder="First name"
                name="first_name"
                value={inputs.first_name}
                onChange={() => alert("ok")}
              />
              <TextInput
                type="text"
                placeholder="Last name"
                name="last_name"
                value={inputs.last_name}
                onChange={() => alert("ok")}
              />
            </div>
            <TextInput
              type="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={() => alert("ok")}
            />
            <TextInput
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={() => alert("ok")}
            />
            <p className="font-body text-ebony-clay text-left text-xs md:text-sm">
              By signing up, you agree to our{" "}
              <Link to="#" className="font-body text-indigo font-medium">
                Term of Use & Privacy Policy
              </Link>
            </p>
            <PrimaryButton
              color="blue"
              label="Sign Up"
              type="submit"
              onClick={() => alert("ok")}
            />
          </div>
        </form>

        {/* Sign in link */}
        <p className="font-body text-ebony-clay text-xs md:text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-body text-indigo font-medium">
            Sign in
          </Link>
        </p>

        {/* Social media authentication */}
        <div className="mt-5">
          <p className="font-body text-silver-chalice before:bg-silver-chalice/50 after:bg-silver-chalice/50 flex items-center gap-2 text-xs font-light before:block before:h-[1px] before:w-1/2 after:block after:h-[1px] after:w-1/2">
            OR
          </p>
          <div className="mt-5 flex justify-center gap-5">
            <IconButton
              onClick={() => {
                alert("gg auth");
              }}
              src={googleIconButton}
            />
            <IconButton
              onClick={() => {
                alert("fb auth");
              }}
              src={facebookIconButton}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
