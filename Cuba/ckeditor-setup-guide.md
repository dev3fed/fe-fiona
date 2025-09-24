# CKEditor Setup Guide

## 1. Include CKEditor in your Layout

Add this script tag to your main layout file (e.g., `Views/Shared/_Layout.cshtml`):

```html
<!-- CKEditor 5 Classic Build -->
<script src="https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js"></script>
```

Or download and host locally:

```html
<script src="~/assets/js/ckeditor5/ckeditor.js"></script>
```

## 2. Update HTML Elements

Change your textarea elements to have `contenteditable="true"` or keep them as textareas:

```html
<!-- Option 1: Textarea (recommended) -->
<textarea id="noStk" class="form-control" rows="3"></textarea>
<textarea id="judulStk" class="form-control" rows="4"></textarea>

<!-- Option 2: Div with contenteditable -->
<div id="noStk" contenteditable="true" class="form-control" style="min-height: 100px;"></div>
<div id="judulStk" contenteditable="true" class="form-control" style="min-height: 100px;"></div>
```

## 3. Initialize CKEditor

The helper.js file has been updated to use CKEditor. You can now use the helper functions:

```javascript
// Initialize a single CKEditor instance
initializeCKEditor("#myTextarea", "Initial content here")
  .then((editor) => {
    console.log("Editor ready:", editor);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Get data from CKEditor
const element = document.querySelector("#myTextarea");
if (element && element.ckeditorInstance) {
  const data = element.ckeditorInstance.getData();
}

// Clean up when done
cleanupCKEditorInstances(["#myTextarea"]);
```

## 4. CKEditor Benefits over Summernote

- **Better Performance**: More efficient DOM manipulation
- **Modern Architecture**: Built with modern web standards
- **Better Mobile Support**: Touch-friendly interface
- **Accessibility**: Better screen reader support
- **Extensibility**: Rich plugin ecosystem
- **Active Development**: Regular updates and security patches
- **Better List Support**: Improved bullet and numbered list functionality

## 5. Migration Notes

The helper.js file has been updated with:

1. **Backward Compatibility**: Falls back to plain textareas if CKEditor isn't loaded
2. **Automatic Cleanup**: Destroys editor instances to prevent memory leaks
3. **Error Handling**: Graceful fallback if initialization fails
4. **Helper Functions**: `initializeCKEditor()` and `cleanupCKEditorInstances()`

## 6. Troubleshooting

If you encounter issues:

1. **Check Console**: Look for JavaScript errors
2. **Verify CDN**: Ensure CKEditor script is loaded
3. **Element Existence**: Verify target elements exist before initialization
4. **Timing**: Initialize CKEditor after DOM is ready

## 7. Custom Configuration

You can customize CKEditor configuration:

```javascript
const customConfig = {
  toolbar: ["bold", "italic", "underline", "|", "bulletedList", "numberedList", "|", "link", "undo", "redo"],
  height: 200,
  placeholder: "Type your content here...",
};

initializeCKEditor("#myEditor", "", customConfig);
```
