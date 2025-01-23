var DropzoneExample = (function () {
  var DropzoneDemos = function () {
    Dropzone.options.singleFileUpload = {
      paramName: "file",
      maxFiles: 1,
      maxFilesize: 5,
      addRemoveLinks: true,
      dictDefaultMessage: "Drop files here or click to upload",
      dictRemoveFile: "Remove",
      dictCancelUpload: "Cancel",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictMaxFilesExceeded: "You can not upload any more files.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      accept: function (file, done) {
        if (file.name == "justinbieber.jpg") {
          done("Naha, you don't.");
        } else {
          alert("masuk");
          done();
        }
      },
    };
    Dropzone.options.multiFileUpload = {
      paramName: "file",
      maxFiles: 10,
      maxFilesize: 10,
      accept: function (file, done) {
        if (file.name == "justinbieber.jpg") {
          done("Naha, you don't.");
        } else {
          // alert
          alert("masuk");
          done();
        }
      },
    };
    Dropzone.options.fileTypeValidation = {
      paramName: "file",
      maxFiles: 10,
      maxFilesize: 10,
      acceptedFiles: "image/*,application/pdf,.psd",
      accept: function (file, done) {
        if (file.name == "justinbieber.jpg") {
          done("Naha, you don't.");
        } else {
          done();
        }
      },
    };
  };
  return {
    init: function () {
      DropzoneDemos();
    },
  };
})();
DropzoneExample.init();
