const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = "1YhG0SORRfhwrV5-HZhW-hq0oIZ_nnoRRtII944_T28o";

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}

app.get("/metadata", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  res.send(metadata.data);
});

app.get("/getRows", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Folha1",
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  res.send(getRows.data);
});

app.post("/addRow", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const { values } = req.body;

  const row = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Folha1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });

  res.send(row.data);
});

app.post("/updateValue", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { values } = req.body;

    const updateValue = await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Folha1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });

    res.send(updateValue.data)
});

app.post("/updatePatrickContacts", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { values } = req.body;

    const updateValue = await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Folha1!B2",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });

    res.send(updateValue.data)
});

app.listen(3001, () => console.log("Rodando na porta 3001"));
