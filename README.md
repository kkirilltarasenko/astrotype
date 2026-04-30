# Astrotype

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E=18.0.0-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Version-1.1.2-brightgreen" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</p>

---
Workflows:
[![Push analyze](https://github.com/kkirilltarasenko/astrotype/actions/workflows/push.yml/badge.svg)](https://github.com/kkirilltarasenko/astrotype/actions/workflows/push.yml)
---

## 🚀 Astrotype — TypeScript CLI Toolkit

Astrotype is a modern CLI application built with TypeScript for automating API workflows and interacting with Google Gemini AI. Key features:

- **API Fetcher**: Batch process YAML files with API endpoints using worker threads
- **Gemini AI**: Ask questions to Google Gemini AI directly from your terminal
- **Image Converter**: Convert images between formats (png, jpg, jpeg, webp) from the CLI
- **Bundle Size Analyzer**: Analyze directory file sizes with gzip and brotli compression stats
- Modular command/flag system, colorized output, and easy extensibility

---

## 📦 Installation

```bash
# Clone the repository
$ git clone https://github.com/your-username/astrotype.git
$ cd astrotype

# Install dependencies (pnpm recommended)
$ pnpm install
```

### 🌍 Global Installation

You can install Astrotype globally to use the `astrotype` command anywhere in your terminal:

```bash
npm install -g .
```

Or, if you use pnpm:

```bash
pnpm build
pnpm link
```

Now you can run commands globally, for example:

```bash
astc -v
astc api-test
astc gemini -m="Your question"
astc convert -p="./image.png" --to="webp"
astc bundle-size -p="./dist"
```
---

## 🛠️ Usage

### Quick start with ts-node (local)

```bash
npx ts-node src/index.ts <command> [flags]
```

### Build and run (local)

```bash
pnpm build
pnpm start <command> [flags]
```

### With node (after build, local)

```bash
node dist/index.js <command> [flags]
```

---

## 📋 Command Reference

| Command       | Description                                                | Example Usage                                    |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| `api-test`    | Process all YAML API files in `/api` with worker threads  | `astrotype api-test`                             |
| `gemini`      | Ask Google Gemini AI a question (requires `-m` flag)      | `astrotype gemini -m="Your question"`           |
| `convert`     | Convert an image to another format (png, jpg, jpeg, webp) | `astrotype convert -p="./image.png" --to="webp"` |
| `bundle-size` | Analyze directory file sizes with compression stats       | `astrotype bundle-size -p="./dist"`             |

### Flags

| Flag       | Description                                          | Example                                          |
| ---------- | ---------------------------------------------------- | ------------------------------------------------ |
| `-v`       | Show CLI version                                     | `astrotype -v`                                   |
| `-m`       | Message for Gemini AI (required)                    | `astrotype gemini -m="Hello"`                   |
| `-p`       | Path to file/directory                               | `astrotype convert -p="./image.jpg"`            |
| `--path`   | Path to file/directory (alternative to `-p`)        | `astrotype bundle-size --path="./dist"`         |
| `--to`     | Target file extension (required for convert)        | `astrotype convert --to="webp"`                 |
| `-q`       | Quality for image conversion (optional)             | `astrotype convert -p="./image.jpg" -q="90"`    |
| `--help`   | Show help information                                | `astrotype --help`                              |
| `-h`       | Show help information (short form)                  | `astrotype -h`                                  |

---

## 🧩 Features

### 1. API Fetcher (`api-test`)

- Scans the `/api` directory for `.yaml` files
- Each file should define a list of URLs under the `urls:` key
- Each URL is processed in a separate worker thread, results are printed to the console

**YAML Example (`api/api-fetcher-urls.yaml`):**

```yaml
urls:
  - https://jsonplaceholder.typicode.com/posts
  - https://jsonplaceholder.typicode.com/comments
  - https://jsonplaceholder.typicode.com/users
```

**Run:**

```bash
astrotype api-test
```

### 2. Gemini AI (`gemini`)

- Interact with Google Gemini AI from your terminal
- Requires the `-m` flag with your question
- Needs a valid `GOOGLE_API_KEY` in your `.env` file

**Run:**

```bash
astrotype gemini -m="What's the weather today?"
```

### 3. Image Converter (`convert`)

- Convert images between formats: `.png`, `.jpg`, `.jpeg`, `.webp`
- Requires the `-p` flag for the image path and `--to` for the target extension
- Optional `-q` flag for quality control (1-100)
- Overwrites the output file if it already exists

**Supported formats:** `.png`, `.jpg`, `.jpeg`, `.webp`

**Run:**

```bash
astc convert -p="./image.png" --to="webp"
astc convert -p="./image.jpg" --to="png" -q="90"
```

### 4. Bundle Size Analyzer (`bundle-size`)

- Analyze file sizes in a directory with detailed compression statistics
- Shows raw size, gzipped size, and brotli compressed size
- Provides breakdown by file extension with compression ratios
- Requires the `-p` flag for the directory path

**Features:**
- Total file count and sizes
- Gzip and Brotli compression analysis
- File type breakdown with percentages
- Compression ratio calculations

**Run:**

```bash
astc bundle-size -p="./dist"
astc bundle-size --path="./build"
```

---

## ⚙️ Environment Variables

For Gemini AI, create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🖌️ Output Example

```bash
$ astc gemini -m="Tell me a joke."
📨 Sending question [Tell me a joke.]...
Here's a joke: Why did the TypeScript developer stay calm? Because they knew how to handle any type of situation!

$ astc convert -p="./cat.jpg" --to="png"
Start Converting [/absolute/path/to/cat.jpg]
File has successfully been converted [/absolute/path/to/cat.png]

$ astc bundle-size -p="./dist"
📁 Analyzing directory: /absolute/path/to/dist
------------------------------
📊 Overall Statistics:
Total Files: 15
Raw Size: 2.45 MB (2.45 MB)
Gzipped: 856.32 KB (0.84 MB)
Brotli: 742.18 KB (0.72 MB)
Gzip Compression: 65.1%
Brotli Compression: 69.7%
------------------------------
📈 Breakdown by Extension:
.js: 8 files, 1.82 MB (74.3%)
.css: 3 files, 456.78 KB (18.2%)
.html: 2 files, 123.45 KB (5.0%)
.json: 2 files, 67.89 KB (2.8%)
```

---

## 🤝 Contributing

Pull requests and issues are welcome! For major changes, please open an issue to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
