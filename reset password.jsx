import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import loginImage from "../Images/abc4.png";
import "../styles/auth.css";
import { useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const token = queryParams.get("token");
  //   const token = useLocation().search.split("=")[1];
  console.log(token, id);
  if (token === undefined || token === "") {
    toast.error("Invalid token. Please try again.");
    navigate("/");
  }
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === "" || confirmPassword === "") {
        toast.error("Please provide email and password");
        return;
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      } else {
        const response = await Axios.post(
          "/resetpassword",
          {
            userId: id,
            password: password,
          },
  2 changes: 0 additions & 2 deletions2  