import React, { useState } from "react";
import CustomPageWithDrawer from "../../components/CustomPageWithDrawer";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { FileDownload, NoEncryption, PictureAsPdf } from "@mui/icons-material";
import CommentsPubDetails from "../../components/comments/CommentsPubDetails";
import CommentIcon from "@mui/icons-material/Comment";
import * as yup from "yup";
import { Formik } from "formik";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSinglePub } from "../../redux/api/pubApi";
import { useQuery } from "react-query";
import { fr } from "date-fns/locale";
import axios from "axios";
import { formatDistanceToNow, isBefore, subDays } from "date-fns";

const commentSchema = yup.object().shape({
  comment: yup
    .string()
    .required("Commentaire est obligatoire")
    .min(5, "Commentaire doit au moin contenir 5 caractères"),
});

const initialValuesComment = {
  comment: "",
};

function PubDetailsPage() {
  const [file, setFile] = useState(true);
  const [comment, setComment] = useState([]);
  const [addComment, setAddComment] = useState(false);
  const handleAddComment = (e) => {
    setAddComment(!addComment);
  };
  const { pubId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [teacher, setTeacher] = useState({});
  const [pub, setPub] = useState({});
  console.log(pub);
  const { isLoading, refetch } = useQuery({
    queryKey: "getSinglePub",
    queryFn: () => getSinglePub(pubId, user.token),
    enabled: false,
    onSuccess: (data) => {
      console.log(data.data);
      setTeacher(data.data.teacher);
      setPub(data.data.pub);
      setComment(data.data.pub.comments);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const [isDownloading, setIsDownloading] = useState(false);
  const handleClickDownload = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDownloading) {
      setIsDownloading(true);

      try {
        console.log("download");
        const response = await axios.get(
          `http://localhost:5000/files/download/${pub.file._id}`,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.log(error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  /*
  const date = new Date(pub.createdAt);
  const now = new Date();
  let formattedDate;

  if (isBefore(date, subDays(now, 1))) {
    formattedDate = date.toLocaleDateString("fr-FR");
  } else {
    formattedDate = formatDistanceToNow(date, {
      addSuffix: true,
      locale: fr,
    });
  }
  */

  const handleFormSubmit = (values) => {};
  return (
    <CustomPageWithDrawer>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          textAlign="center"
          gap={0.5}>
          <InfoIcon sx={{ fontSize: 40, color: "#071A2F" }} />
          <Typography variant="h4" color="#071A2F">
            {pub.content}
          </Typography>
        </Box>
        <Box>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            textAlign="center"
            p="5px"
            gap={0.5}>
            <Typography variant="p" color="rgb(104,109,112)">
              {teacher.fullName}
            </Typography>
            <AccessTimeIcon fontSize="5" color="rgb(104,109,112)" />
            <Typography variant="p" color="rgb(104,109,112)">
              :
            </Typography>
          </Box>
          <Divider style={{ backgroundColor: "rgb(104,109,112)" }} />
        </Box>
        {pub.file && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              backgroundColor: "#F8F8FB",
              borderRadius: "5px",
              pt: 1,
              pb: 1,
              pr: 2,
              pl: 2,
              alignItems: "center",
            }}
            mt={3}>
            <Typography>{pub.file.name}</Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}>
              <Avatar>
                <Icon>
                  <PictureAsPdf />
                </Icon>
              </Avatar>
              <Icon
                sx={{
                  color: "grey",
                  "&:hover": {
                    color: "black",
                  },
                  cursor: "pointer",
                }}
                onClick={handleClickDownload}>
                <FileDownload />
              </Icon>
            </Stack>
          </Stack>
        )}
        {pub.file && (
          <Divider
            style={{ backgroundColor: "rgb(104,109,112)" }}
            sx={{ mt: "10px" }}
          />
        )}
        <Box>
          <Box display="flex" textAlign="center" gap={2} m={1}>
            <CommentIcon />
            <Typography variant="p">Commentaires ajoutés au cours :</Typography>
          </Box>
          {comment.map((comment, i) => (
            <List sx={{ width: "100%", bgcolor: "#F8F8FB" }}>
              <CommentsPubDetails key={i} content={comment.content} />
              <Divider variant="inset" component="li" />
            </List>
          ))}
        </Box>
        {!addComment && (
          <Stack direction="row" spacing={2} mt={1}>
            <Button
              variant="outlined"
              sx={{
                color: "#071A2F",
                border: "none",
                "&:hover": {
                  color: "#636364",
                  borderRadius: "10px",
                  border: "1px solid #636364 ",
                  backgroundColor: "white",
                },
              }}
              onClick={handleAddComment}>
              Ajouter un commentaire a cette publication
            </Button>
          </Stack>
        )}
        {addComment && (
          <Stack direction="row" spacing={2} mt={2}>
            <Formik
              initialValues={initialValuesComment}
              validationSchema={commentSchema}
              onSubmit={() => {}}>
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                setFieldValue,
                handleSubmit,
                resetForm,
              }) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  gap={1}
                  justifyContent="center">
                  <Avatar sx={{ mt: 1 }} />
                  <TextField
                    label="Commentaire"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.comment}
                    name="comment"
                    error={Boolean(touched.comment) && Boolean(errors.comment)}
                    helperText={touched.comment && errors.comment}
                    placeholder="Ajouter votre commentaire"
                    sx={{
                      minWidth: "300px",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSubmit}>
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    multiline
                  />
                </Box>
              )}
            </Formik>
          </Stack>
        )}
      </Box>
    </CustomPageWithDrawer>
  );
}

export default PubDetailsPage;
