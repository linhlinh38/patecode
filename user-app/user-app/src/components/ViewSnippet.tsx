import React, { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { AxiosInstance } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadLanguage, LanguageName } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { dropCursor } from "@codemirror/view";
import {
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  keymap,
} from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { html } from "@codemirror/lang-html";
import { basicSetup } from "codemirror";
import { languages } from "@codemirror/language-data";
import { jwtDecode } from "jwt-decode";
interface CodeSnippet {
  _id: string;
  title: string;
  description: string;
  language: LanguageName;
  code: string;
  isUsepassword: true;
  password: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}
const ViewSnippet: React.FC<{
  axiosInstance: AxiosInstance;
}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snippetDetail, setSnippetDetail] = useState<CodeSnippet | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const storedToken = localStorage.getItem("accessToken") || "";
  // const token = jwtDecode<{
  //   member: string;
  // }>(storedToken);
  const { snippetId } = useParams();

  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    language: yup.string().optional(),
    title: yup.string().required("Title is required"),
    description: yup.string().optional(),
    code: yup.string().required("Please enter code first"),
  });

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
  interface ErrorResponse {
    response: {
      data: {
        message: string;
      };
    };
  }

  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const response = await axiosInstance.get(`/code/get/${snippetId}`);

        if (!response.data.requiredPass) {
          setSnippetDetail(response.data.code);
        } else {
          setOpen(true);
        }
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching watch:", error);
        navigate("/404");
      } finally {
      }
    };
    fetchWatch();
  }, [axiosInstance, navigate, snippetId]);

  const formik = useFormik<{
    language: LanguageName;
    title: string;
    password: string;
    code: string;
    description: string;
  }>({
    initialValues: {
      language: "c",
      title: "",
      password: "",
      code: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formatData = {
          ...values,
          isUsepassword: values.password !== "",
          member: '',
        };
        console.log("formatData", formatData);

        const res = await axiosInstance.post("/code/create", formatData);
        console.log("res", res);

        // navigate("/");
      } catch (error) {
        setErrorMessage("Error creating brand. Please try again.");
        const errorMess = error as ErrorResponse;
        if (errorMess.response.data.message === "Unauthentication") {
          navigate("/401");
        } else if (errorMess.response.data.message === "Unauthorization") {
          navigate("/403");
        } else {
          handleError(errorMess.response.data.message || "An error occurred");
        }
      }
    },
  });

  return (
    <div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const password = formJson.password;
              const res2 = await axiosInstance.post(`/code/validate`, {
                id: snippetId,
                password: password,
              });
              console.log("res2", res2);

              setSnippetDetail(res2.data.code);

              handleClose();
            } catch (error) {
              console.log("error", error);
              const errorMess = error as ErrorResponse;
              if (errorMess.response.data.message === "Unauthentication") {
                navigate("/401");
              } else if (
                errorMess.response.data.message === "Unauthorization"
              ) {
                navigate("/403");
              } else if (
                errorMess.response.data.message === "Invalid password"
              ) {
                formik.setFieldError(
                  "password",
                  errorMess.response.data.message
                );
              }
            }
          },
        }}
      >
        <DialogTitle>Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to provide valid password to see this snippet
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            error={!!formik.errors.password}
            helperText={formik.errors.password}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>

      {snippetDetail == null ? (
        <div
          className="p-5 text-center font-bold text-3xl "
          style={{ minHeight: "70vh" }}
        >
          This snippet is password protected!
        </div>
      ) : (
        <form>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "80vh",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                padding: "10px",
                width: "70%",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full flex flex-col space-y-2">
                  <div className="text-2xl">Title: {snippetDetail?.title}</div>
                  <div className="text-lg text-gray-500">
                    Description: {snippetDetail?.description}
                  </div>
                  <div className="text-lg text-gray-500">
                    Language: {snippetDetail?.language}
                  </div>
                  <div className="text-lg ">
                    Share:{" "}
                    <Link
                      className=""
                      to={`http://localhost:3000/snippet/${snippetDetail._id}`}
                    >{`http://localhost:3000/snippet/${snippetDetail._id}`}</Link>
                  </div>
                </div>
                <div className="w-full">
                  <CodeMirror
                    className="editor"
                    width="100%"
                    readOnly
                    value={snippetDetail?.code}
                    theme={tokyoNight}
                    extensions={[
                      EditorView.lineWrapping,
                      basicSetup,
                      highlightSpecialChars(),
                      drawSelection(),
                      dropCursor(),

                      highlightActiveLine(),
                      keymap.of(defaultKeymap),

                      EditorView.theme({
                        "&.cm-editor": {
                          height: "calc(100vh - 300px)",
                          width: "100%",
                        },
                        "&.cm-editor .cm-scroller": { overflow: "auto" },
                      }),
                      loadLanguage(snippetDetail?.language ?? "markdown")!,
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ViewSnippet;
