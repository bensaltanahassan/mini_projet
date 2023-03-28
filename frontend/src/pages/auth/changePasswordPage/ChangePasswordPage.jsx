import {
  TextField,
  Button,
  InputLabel,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Form, Formik } from "formik";
import Loading from "../../../components/Loading";
import SnackBar from "../../../components/SnackBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

/* 
const ChangePasswSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Obligatoire")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])/,
        "Mot de passe doit contenir au moin une lettre minuscule, majuscule et un charactére spéciale !"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords doivent se ressambler")
      .required("Obligatoire"),
  }); 
*/
const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType } = useSelector((state) => state.auth);

  const resetSchemaPassword = yup.object().shape({
    newPassword: yup
      .string()
      .required("Obligatoire")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])/,
        "Mot de passe doit contenir au moin une lettre minuscule, majuscule et un charactére spéciale!"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords doivent se ressambler")
      .required("Obligatoire"),
  });

  const initialValuesPasswords = {
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values) => {
    // event.preventDefault();
    console.log("step1");
    try {
      console.log("step2");

      console.log(userType.toLowerCase());
      const { data } = await axios.put(
        `http://localhost:5000/${userType.toLowerCase()}/changePassword`,
        {
          newPassword: values.newPassword,
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={initialValuesPasswords}
      validationSchema={resetSchemaPassword}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form>
          <Box
            display="grid"
            gap="20px"
            sx={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.newPassword}
              name="newPassword"
              error={
                Boolean(touched.newPassword) && Boolean(errors.newPassword)
              }
              helperText={touched.newPassword && errors.newPassword}
              sx={{
                gridColumn: "span 2",
              }}
            />
            <TextField
              label="Confirm Password"
              type="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmPassword"
              error={
                Boolean(touched.confirmPassword) &&
                Boolean(errors.confirmPassword)
              }
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={{
                gridColumn: "span 2",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("fuck you");
                console.log(values);
                handleSubmit(values);
              }}
              sx={{
                mt: 3,
                mb: 2,
              }}
              // disabled={isSubmitting}
            >
              Change Mot de passe
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordPage;
