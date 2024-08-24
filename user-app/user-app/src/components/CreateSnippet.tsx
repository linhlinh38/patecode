import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import { IconButton, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
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
import { useNavigate } from "react-router-dom";
import {
  loadLanguage,
  LanguageName,
  langNames,
} from "@uiw/codemirror-extensions-langs";
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
import { basicSetup } from "codemirror";
import { languages } from "@codemirror/language-data";
import { jwtDecode } from "jwt-decode";
const CreateSnippet: React.FC<{
  axiosInstance: AxiosInstance;
}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [link, setLink] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const storedToken = localStorage.getItem("accessToken") || "";
  const token = jwtDecode<{
    member: string;
  }>(storedToken);

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

  // useEffect(() => {}, [axiosInstance]);

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
          member: token?.member,
        };
        console.log("formatData", formatData);

        const res = await axiosInstance.post("/code/create", formatData);
        console.log("res", res);

        if (res.status === 201) {
          setOpen(true);
          setLink(res.data.link);
          console.log("res");
        }
        setErrorMessage(null);
        handleSuccess("Create Snippet Successful");
        formik.resetForm();
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

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(link);
  };
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
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const password = formJson.password;

            handleClose();
          },
        }}
      >
        <DialogTitle>
          Link to Share
          <IconButton onClick={handleClick} color="primary">
            <ShareIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            You can share this link to other people for access your snippet{" "}
          </DialogContentText>
          {link}

          {/* <Snackbar
            message="Copied to clibboard"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={2000}
            onClose={() => setOpen(false)}
            open={open}
          /> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions> */}
      </Dialog>
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
              <div className="w-full flex flex-col space-y-4">
                <h2 className="text-lg font-bold text-center">
                  Create Snippet
                </h2>
                <FormControl>
                  <InputLabel id="language">Language</InputLabel>
                  <Select
                    id="language"
                    labelId="language"
                    name="language"
                    required
                    label="Language"
                    value={formik.values.language || ""}
                    placeholder="Choose a language (optional)"
                    onChange={formik.handleChange}
                    error={formik.touched.language && !!formik.errors.language}
                  >
                    {/* <MenuItem value="">Choose a language (optional)</MenuItem> */}
                    {langNames.map((lang, id) => (
                      <MenuItem key={id} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <TextField label="Title" {...formik.getFieldProps("title")} />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Password"
                    {...formik.getFieldProps("password")}
                    placeholder="Password (optional)"
                    type="password"
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Description"
                    {...formik.getFieldProps("description")}
                    multiline
                    rows={3}
                  />
                </FormControl>

                <Button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  variant="contained"
                >
                  Create Snippet
                </Button>
              </div>
              <div className="w-full">
                <CodeMirror
                  className="editor"
                  width="100%"
                  value={formik.values.code}
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
                    loadLanguage(formik.values.language)!,
                  ]}
                  onChange={(event) => {
                    formik.setFieldValue("code", event);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSnippet;
