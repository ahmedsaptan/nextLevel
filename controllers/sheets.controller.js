const { body } = require("express-validator");
const { google } = require("googleapis");
const createError = require("http-errors");
const { validationResult, matchedData } = require("express-validator");

require("dotenv").config();
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

console.log();
const client = new google.auth.JWT(
  process.env.client_email,
  null,
  process.env.private_key,
  SCOPES
);

const validateOnAddRows = () => {
  return [
    body("firstName")
      .exists()
      .withMessage("firstName is Required")
      .bail()
      .notEmpty()
      .withMessage("firstName can't be empty"),
    body("lastName")
      .exists()
      .withMessage("lastName is Required")
      .bail()
      .notEmpty()
      .withMessage("lastName can't be empty"),
    body("email")
      .exists()
      .withMessage("email is Required")
      .bail()
      .notEmpty()
      .withMessage("email can't be empty")
      .isEmail()
      .withMessage("email not valid")
      .bail(),
    body("phoneNumber")
      .exists()
      .withMessage("phoneNumber is Required")
      .bail()
      .notEmpty()
      .withMessage("phoneNumber can't be empty"),
    body("company")
      .exists()
      .withMessage("company is Required")
      .bail()
      .notEmpty()
      .withMessage("company can't be empty"),
    body("position")
      .exists()
      .withMessage("position is Required")
      .bail()
      .notEmpty()
      .withMessage("position can't be empty"),
    body("userName")
      .exists()
      .withMessage("userName is Required")
      .bail()
      .notEmpty()
      .withMessage("userName can't be empty"),
  ];
};

const addRows = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", {
        data: req.body,
        errors: errors.mapped(),
      });
    }
    const body = matchedData(req);
    client.authorize(async (err, token) => {
      if (err) {
        console.log(err);
        next(createError(500, "there is problem with connection to sheets"));
      } else {
        console.log("CONNECTED");
        const { sheets, updateOptions } = googleSheetRun();

        updateOptions.resource = {
          values: [Object.values(body)],
        };

        const result = await sheets.spreadsheets.values.append(updateOptions);
        res.redirect("/");
        // res.status(200).send(result);
      }
    });
  } catch (e) {
    next(e);
  }
};

const googleSheetRun = () => {
  const sheets = google.sheets({ version: "v4", auth: client });

  const updateOptions = {
    spreadsheetId: "1rpdK7wfKwGEdixDfGmG9FPhpexB2PlSCSTps3IiipPk",
    range: "A1",
    valueInputOption: "USER_ENTERED",
    // resource: { values: newDataArray },
  };

  return { sheets, updateOptions };
  // const res1 = await sheets.spreadsheets.values.append(updateOptions);
  // console.log(res1);
};
module.exports = {
  addRows,
  validateOnAddRows,
};
