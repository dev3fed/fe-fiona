import os
import jsmin

# List of files to concatenate
files_to_concat = [
    "File Gabung HC_dataJobDesc.js",
    "Gabung File Dirut_dataJobDesc.js",
    "Gabung File_Marketing (1)_dataJobDesc.js",
    "gabung jabatan baru_ 23 jan_dataJobDesc_full_isi.js",
]

# Directory containing the files
directory = "Cuba/wwwroot/assets/js/job-description/data-job-desc/"

# Output file
output_file = os.path.join(directory, "dataJobDescCompare.js")

# Concatenate files
with open(output_file, "w") as outfile:
    for fname in files_to_concat:
        with open(os.path.join(directory, fname)) as infile:
            outfile.write(infile.read())
            outfile.write("\n")

    # write a newline at the end of the file to concat dataJobDesc0, dataJobDesc1, etc.
    outfile.write("\n")
    const_names = ["dataJobDesc" + str(i) for i in range(0, 4)]
    outfile.write("const dataJobDescCompare = [...")
    outfile.write(", ...".join(const_names))
    outfile.write("];")

# Minify the concatenated file
with open(output_file, "r") as f:
    minified_content = jsmin.jsmin(f.read())

with open(output_file, "w") as f:
    f.write(minified_content)

print(f"Files concatenated and minified into {output_file}")
