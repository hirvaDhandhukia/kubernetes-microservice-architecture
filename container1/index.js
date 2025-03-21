const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const portNum = 6000;
const rootPath = "/hirva_PV_dir";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(portNum, () => {
  console.log(`Server of c1 started on localhost port ${portNum}`);
});

// call c2 /process endpoint with the payload in the request & relay response to user
app.post("/calculate", async (request, response) => {
  response.setHeader("content-type", "application/json");

  const { file, product } = request.body;

  try {
    // validate input json
    if (!file) {
      return response.status(400).json({
        file: null,
        error: "Invalid JSON input.",
      });
    }

    // does file exist in PV?
    if (!fileExists(file)) {
      return response.status(404).json({
        file,
        error: "File not found.",
      });
    }

    console.log(`forwarding the payload in request to c2: ${file}, ${product}`);
    const containerURL = `${process.env.CONTAINER2_URL}/process`;
    const resp = await axios.post(containerURL, {
      file,
      product,
    });
    return response.json(resp.data);
  } catch (error) {
    console.error("Error processing /calculate:", error.message);

    return response.status(500).json({
      file,
      error: "Internal server error.",
    });
  }

  function fileExists(file) {
    try {
      // const filePath = path.join(rootPath, file);
      const filePath = `${rootPath}/${file}`;
      fs.accessSync(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
});

app.post("/store-file", (request, response) => {
  // store in k8 pv in override(write) mode
  response.setHeader("content-type", "application/json");

  const { file, data } = request.body;
  const filePath = path.join(rootPath, file);

  // file name not provided / file not found / data not found
  if (!file || !data) {
    return response.status(400).json({
      file: null,
      error: "Invalid JSON input.",
    });
  }

  // check of file stored successfully
  try {
    fs.writeFileSync(filePath, data);
    response.json({
      file,
      message: "Success.",
    });

    // error to save file in PV
  } catch (error) {
    console.log(error);
    response.status(500).json({
      file: file || null,
      error: "Error while storing the file to the storage.",
    });
  }
});
