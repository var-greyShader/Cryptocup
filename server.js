var express = require("express");
var app = express();
const jsonfile = require("jsonfile");
var formidable = require("formidable");
const path = require("path");

var PORT = process.env.PORT || 3000;

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/secureLogin", function(req, res) {
  let data = req.body;
  const file = `${data.teamname}.json`;
  const ipAdd =
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  jsonfile.readFile(file, function(err, obj) {
    if (err) {
      console.log("User Not found");
      res.sendFile(__dirname + "/public/loginError.html");
    } else {
      console.log(obj.password + " " + data.password);
      if (data.password === obj.password) {
        console.log(
          `"${data.teamname}" logged in successfully with password "${data.password}" and locator "${ipAdd}"`
        );
        res.setHeader("teamName", `${data.teamname}`);
        res.sendFile(__dirname + "/public/homepageQuestions.html");
      } else {
        res.sendFile(__dirname + "/public/loginError.html");
      }
    }
  });
});

app.post("/fileupload", function(req, res) {
  var form = new formidable.IncomingForm();
  const ipAdd =
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  form.parse(req);

  form.on("fileBegin", function(name, file) {
    file.path = __dirname + "/fileUploads/" + file.name;
  });

  form.on("file", function(name, file) {
    console.log("Uploaded " + file.name + " by user at " + ipAdd);
  });
  return res.sendFile(__dirname + "/public/uploadSuccessful.html");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
